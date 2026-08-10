import status from "http-status";
import { Speciality } from "../../../generated/prisma/client";
import { Role } from "../../../generated/prisma/enums";
import AppError from "../../errorHelpers/appError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { ICreateDoctorPayload } from "./user.interface";

const createDoctor = async (payload: ICreateDoctorPayload) => {
  const specialities: Speciality[] = [];

  for (const specialityId of payload.specialities) {
    const specialityData = await prisma.speciality.findUnique({
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

  // additionalFields have input: false in auth config, so role/needPasswordChange
  // cannot be set via signUpEmail — update them on the user row after signup.
  const user = await auth.api.signUpEmail({
    body: {
      email: payload.doctor.email,
      name: payload.doctor.name,
      password: payload.password,
    },
  });

  try {
    const doctor = await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: user.user.id },
        data: {
          role: Role.DOCTOR,
          needPasswordChange: true,
        },
      });

      const doctorData = await tx.doctor.create({
        data: {
          userId: user.user.id,
          ...payload.doctor,
        },
      });

      const specialitiesData: { doctorId: string; specialityId: string }[] = specialities.map(
        (speciality) => ({
          doctorId: doctorData.id,
          specialityId: speciality.id,
        })
      );

      await tx.doctorSpeciality.createMany({
        data: specialitiesData,
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
          profilePicture: true,
          address: true,
          phone: true,
          experience: true,
          currentWorkingPlace: true,
          registrationNumber: true,
          gender: true,
          appointmentFee: true,
          specialities: {
            select: {
              speciality: {
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

export const userService = {
  createDoctor,
};
