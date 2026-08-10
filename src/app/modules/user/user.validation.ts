import z from "zod";
import { Gender } from "../../../generated/prisma/enums";

export const createDoctorZodSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  doctor: z.object({
    name: z.string("Name must be a string").min(1, "Name is required"),
    email: z.email("Invalid email address"),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    experience: z.number().min(0).optional(),
    currentWorkingPlace: z.string().optional(),
    registrationNumber: z.string().min(1, "Registration number is required"),
    gender: z.enum(
      [Gender.MALE, Gender.FEMALE, Gender.OTHER],
      "Gender must be one of the following: male, female, other"
    ),
    appointmentFee: z.number().min(0, "Appointment fee must be positive"),
    qualification: z.string().optional(),
    designation: z.string().optional(),
    averageRating: z.number().min(0).max(5).optional(),
  }),
  specialties: z.array(z.uuid()).min(1, "At least one speciality is required"),
});

export const createAdminZodSchema = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  admin: z.object({
    name: z.string("Name must be a string").min(1, "Name is required"),
    email: z.email("Invalid email address").min(1, "Email is required"),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
  role: z.enum(["ADMIN", "SUPER_ADMIN"]),
});
