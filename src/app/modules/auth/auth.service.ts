import status from 'http-status';
import AppError from '../../errorHelpers/appError';
import { auth } from '../../lib/auth';
import { prisma } from '../../lib/prisma';
import { tokenUtils } from '../../utils/token';

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

  const tokenPayload = {
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    emailVerified: data.user.emailVerified,
    isDeleted: data.user.isDeleted,
    deletedAt: data.user.deletedAt,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return {
    ...data,
    patient,
    accessToken,
    refreshToken,
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

  const tokenPayload = {
    userId: data.user.id,
    role: data.user.role,
    email: data.user.email,
    name: data.user.name,
    emailVerified: data.user.emailVerified,
    isDeleted: data.user.isDeleted,
    deletedAt: data.user.deletedAt,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return {
    ...data,
    accessToken,
    refreshToken,
  };
};

export const AuthService = {
  patientRegister,
  userLogin,
};
