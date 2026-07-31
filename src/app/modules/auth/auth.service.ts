import { auth } from '../../lib/auth';

interface User {
  name: string;
  email: string;
  password: string;
}

const patientRegister = async (payload: User) => {
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

  return data;
};

export const AuthService = {
  patientRegister,
};
