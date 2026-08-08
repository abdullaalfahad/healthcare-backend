import status from 'http-status';
import AppError from '../../errorHelpers/appError';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';

interface IPatientRegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface IUserLoginPayload {
  email: string;
  password: string;
}

const patientRegister = async (payload: IPatientRegisterPayload) => {
  const { name, email, password } = payload;

  const data = await auth.api.signUpEmail({
    body: {
      name,
      email,
      password,
    },
  });

  if (!data.user) {
    throw new AppError('User registration failed', status.BAD_REQUEST);
  }

  const patient = await prisma.$transaction(async (tx) => {
    try {
      const newPatient = await tx.patient.create({
        data: {
          name,
          email,
          userId: data.user.id,
        },
      });

      return newPatient;
    } catch (error) {
      prisma.user.delete({
        where: {
          id: data.user.id,
        },
      });
      throw new AppError(
        error instanceof Error ? error.message : 'Unknown error occurred while creating patient',
        status.INTERNAL_SERVER_ERROR
      );
    }
  });

  return {
    ...data,
    patient,
  };
};

const userLogin = async (payload: IUserLoginPayload) => {
  const { email, password } = payload;

  const data = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  return data;
};

export const AuthService = {
  patientRegister,
  userLogin,
};
