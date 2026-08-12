import status from "http-status";
import { envVariables } from "../../config/env";
import AppError from "../../errorHelpers/appError";
import { IRequestUser } from "../../interface/requestUser.interface";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import { jwtUtils } from "../../utils/jwt";
import { tokenUtils } from "../../utils/token";
import {
  IChangePasswordPayload,
  IPatientRegisterPayload,
  IUserLoginPayload,
} from "./auth.interface";

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

const refreshToken = async (refreshToken: string, sessionToken: string) => {
  const verifiedToken = jwtUtils.verifyToken(refreshToken, envVariables.JWT_SECRET);

  if (!verifiedToken) {
    throw new AppError("Unauthorized! Please login again", status.UNAUTHORIZED);
  }

  const session = await prisma.session.findUnique({
    where: {
      token: sessionToken,
    },
  });

  if (!session) {
    throw new AppError("Unauthorized! Please login again", status.UNAUTHORIZED);
  }

  const tokenPayload = {
    userId: verifiedToken.userId,
    role: verifiedToken.role,
    email: verifiedToken.email,
    name: verifiedToken.name,
    emailVerified: verifiedToken.emailVerified,
    isDeleted: verifiedToken.isDeleted,
    deletedAt: verifiedToken.deletedAt,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const newRefreshToken = tokenUtils.getRefreshToken(tokenPayload);

  const updatedSession = await prisma.session.update({
    where: {
      token: sessionToken,
    },
    data: {
      token: sessionToken,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 24), // 1 day
      updatedAt: new Date(),
    },
  });

  return {
    accessToken,
    refreshToken: newRefreshToken,
    sessionToken: updatedSession.token,
  };
};

const changePassword = async (payload: IChangePasswordPayload, sessionToken: string) => {
  const ValidSession = await auth.api.getSession({
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  if (!ValidSession) {
    throw new AppError("Unauthorized! Please login again", status.UNAUTHORIZED);
  }

  const { currentPassword, newPassword } = payload;

  const response = await auth.api.changePassword({
    body: {
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    },
    headers: new Headers({
      Authorization: `Bearer ${sessionToken}`,
    }),
  });

  const tokenPayload = {
    userId: ValidSession.user.id,
    role: ValidSession.user.role,
    email: ValidSession.user.email,
    name: ValidSession.user.name,
    emailVerified: ValidSession.user.emailVerified,
    isDeleted: ValidSession.user.isDeleted,
    deletedAt: ValidSession.user.deletedAt,
  };

  const accessToken = tokenUtils.getAccessToken(tokenPayload);
  const refreshToken = tokenUtils.getRefreshToken(tokenPayload);

  return {
    ...response,
    accessToken,
    refreshToken,
  };
};

const verifyEmail = async (email: string, otp: string) => {
  const response = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    },
  });

  if (response.status && !response.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      },
    });
  }
};

export const AuthService = {
  patientRegister,
  userLogin,
  getMe,
  refreshToken,
  changePassword,
  verifyEmail,
};
