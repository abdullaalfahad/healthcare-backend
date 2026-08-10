import status from "http-status";
import { Specialty } from "../../../generated/prisma/client";
import { Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/appError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateAdminPayload, ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialities: Specialty[] = [];

  for (const specialityId of payload.specialties) {
    const specialityData = await prisma.specialty.findUnique({
      where: {
        id: specialityId,
      },
    });

    if (!specialityData) {
      throw new AppError(`Speciality with ID ${specialityId} not found`, status.NOT_FOUND);
    }

    specialities.push(specialityData);
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.doctor.email,
    },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", status.CONFLICT);
  }

  const user = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      name: payload.doctor.name,
      password: payload.password,
      role: Role.DOCTOR,
      needPasswordChange: true,
    },
  });

  try {
    const doctor = await prisma.$transaction(async (tx) => {
      const doctorData = await tx.doctor.create({
        data: {
          userId: user.user.id,
          ...payload.doctor,
        },
      });

      const specialtiesData: { doctorId: string; specialtyId: string }[] = specialities?.map(
        (specialty) => ({
          doctorId: doctorData.id,
          specialtyId: specialty.id,
        })
      );

      await tx.doctorSpecialty.createMany({
        data: specialtiesData,
      });

      return await tx.doctor.findUnique({
        where: {
          id: doctorData.id,
        },
        select: {
          id: true,
          userId: true,
          name: true,
          email: true,
          profilePhoto: true,
          address: true,
          contactNumber: true,
          experience: true,
          currentWorkingPlace: true,
          registrationNumber: true,
          gender: true,
          appointmentFee: true,
          specialties: {
            select: {
              specialty: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
    });

    return doctor;
  } catch (error) {
    // If an error occurs, delete the user from Clerk
    await prisma.user.delete({
      where: {
        email: payload.doctor.email,
      },
    });
    throw error; // Rethrow the error to be handled by the caller
  }
};

const createAdmin = async (payload: ICreateAdminPayload) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: payload.admin.email,
    },
  });

  if (existingUser) {
    throw new AppError("User with this email already exists", status.CONFLICT);
  }

  const { admin, password, role } = payload;

  const user = await auth.api.signUpEmail({
    body: {
      name: admin.name,
      email: admin.email,
      password,
      role,
      needPasswordChange: true,
    },
  });

  try {
    await prisma.admin.create({
      data: {
        userId: user.user.id,
        ...admin,
      },
    });
  } catch (error) {
    await prisma.user.delete({
      where: {
        email: admin.email,
      },
    });
    throw error;
  }

  return user;
};

export const userService = {
  createDoctor,
  createAdmin,
};
