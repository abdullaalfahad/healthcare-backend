export interface IChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface IPatientRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface IUserLoginPayload {
  email: string;
  password: string;
}
