import { Gender } from "../../../generated/prisma/enums";

export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePhoto?: string;
    address?: string;
    contactNumber?: string;
    experience?: number;
    currentWorkingPlace?: string;
    registrationNumber: string;
    gender: Gender;
    appointmentFee: number;
    qualification?: string;
    designation?: string;
    averageRating?: number;
  };
  specialities: string[];
}

export interface ICreateAdminPayload {
  password: string;
  admin: {
    name: string;
    email: string;
    profilePicture?: string;
    contactNumber?: string;
  };
  role: "ADMIN" | "SUPER_ADMIN";
}
