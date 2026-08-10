import status from "http-status";
import { UserStatus } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/appError";
import { prisma } from "../../lib/prisma";
import { ISpeciality, IUpdateDoctorPayload } from "./doctor.interface";

const getAllDoctors = async () => {
  const doctor = await prisma.doctor.findMany();

  return doctor;
};

const getDoctorById = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
    include: {
      specialties: true,
    },
  });

  return doctor;
};

const updateDoctor = async (id: string, payload: IUpdateDoctorPayload) => {
  const { doctor, specialties } = payload;

  const validSpecialities: ISpeciality[] = await prisma.specialty.findMany({
    where: {
      id: {
        in: specialties?.map((speciality) => speciality.id),
      },
    },
  });

  if (validSpecialities.length !== specialties?.length) {
    throw new AppError("Invalid specialities", status.BAD_REQUEST);
  }

  const doctorExists = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctorExists) {
    throw new AppError("Doctor not found", status.NOT_FOUND);
  }
  try {
    const transaction = await prisma.$transaction(async (tx) => {
      const updatedDoctor = await tx.doctor.update({
        where: { id },
        data: {
          ...doctor,
        },
      });

      for (const speciality of specialities ?? []) {
        if (speciality.shouldDelete) {
          await tx.doctorSpecialty.deleteMany({
            where: {
              doctorId: id,
              specialityId: speciality.id,
            },
          });
        } else {
          await tx.doctorSpecialty.create({
            data: {
              doctorId: id,
              specialtyId: speciality.id,
            },
          });
        }
      }

      return updatedDoctor;
    });

    return transaction;
  } catch (error) {
    throw new AppError(
      error instanceof Error ? error.message : "Failed to update doctor",
      status.INTERNAL_SERVER_ERROR
    );
  }
};

const deleteDoctor = async (id: string) => {
  const doctor = await prisma.doctor.findUnique({
    where: { id },
  });

  if (!doctor || doctor.isDeleted) {
    throw new AppError("Doctor not found", status.NOT_FOUND);
  }

  const deletedAt = new Date();

  const deletedDoctor = await prisma.$transaction(async (tx) => {
    await tx.doctorSpecialty.updateMany({
      where: { doctorId: id, isDeleted: false },
      data: { isDeleted: true, deletedAt },
    });

    const updatedDoctor = await tx.doctor.update({
      where: { id },
      data: { isDeleted: true, deletedAt },
    });

    await tx.user.update({
      where: { id: doctor.userId },
      data: {
        isDeleted: true,
        deletedAt,
        status: UserStatus.DELETED,
      },
    });

    return updatedDoctor;
  });

  return deletedDoctor;
};

export const doctorService = {
  getAllDoctors,
  getDoctorById,
  updateDoctor,
  deleteDoctor,
};
