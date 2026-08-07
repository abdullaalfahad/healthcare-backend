import z from 'zod';
import { Gender } from '../../../generated/prisma/enums';

export const createDoctorZodSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters long'),
  doctor: z.object({
    name: z.string('Name must be a string').min(1, 'Name is required'),
    email: z.email('Invalid email address'),
    profilePicture: z.string().optional(),
    address: z.string().optional(),
    phone: z.string().optional(),
    experience: z.number().min(0).optional(),
    currentWorkingPlace: z.string().optional(),
    registrationNumber: z.string().min(1, 'Registration number is required'),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      'Gender must be one of the following: male, female, other'
    ),
    appointmentFee: z.number().min(0, 'Appointment fee must be positive'),
    qualifications: z.string().optional(),
    designation: z.string().optional(),
    averageRating: z.number().min(0).max(5).optional(),
  }),
  specialities: z.array(z.uuid()).min(1, 'At least one speciality is required'),
});
