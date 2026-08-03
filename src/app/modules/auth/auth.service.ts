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
    throw new Error('User registration failed');
  }

  const patient = await prisma.$transaction(async (tx) => {
    const newPatient = await tx.patient.create({
      data: {
        name,
        email,
        userId: data.user.id,
      },
    });

    return newPatient;
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
