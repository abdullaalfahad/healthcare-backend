import status from "http-status";
import AppError from "../../errorHelpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { tokenUtils } from "../../utils/token";

interface IPatientRegisterPayload {
  name: string;
  email: string;
  password: string;
}

interface IUserLoginPayload {
  email: string;
  password: string;
}

const getAuthUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      image: true,
      role: true,
      status: true,
      needPasswordChange: true,
      isDeleted: true,
      deletedAt: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  return user;
};

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
    throw new AppError("User registration failed", status.BAD_REQUEST);
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
        error instanceof Error ? error.message : "Unknown error occurred while creating patient",
        status.INTERNAL_SERVER_ERROR
      );
    }
  });

  const user = await getAuthUser(data.user.id);

  const tokenPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    isDeleted: user.isDeleted,
    deletedAt: user.deletedAt,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return {
    ...data,
    user,
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

  const user = await getAuthUser(data.user.id);

  const tokenPayload = {
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
    emailVerified: user.emailVerified,
    isDeleted: user.isDeleted,
    deletedAt: user.deletedAt,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return {
    ...data,
    user,
    accessToken,
    refreshToken,
  };
};

const getMe = async (user: IRequestUser) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    include: {
      patient: true,
      admin: true,
      doctor: true,
    },
  });

  if (!userData) {
    throw new AppError("User not found", status.NOT_FOUND);
  }

  return userData;
};

export const AuthService = {
  patientRegister,
  userLogin,
  getMe,
};
