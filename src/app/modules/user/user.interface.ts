import { Gender } from '../../../generated/prisma/enums';

export interface ICreateDoctorPayload {
  password: string;
  doctor: {
    name: string;
    email: string;
    profilePicture?: string;
    address?: string;
    phone?: string;
    experience?: number;
    currentWorkingPlace?: string;
    registrationNumber: string;
    gender: Gender;
    appointmentFee: number;
    qualifications?: string;
    designation?: string;
    averageRating?: number;
  };
  specialities: string[];
}
