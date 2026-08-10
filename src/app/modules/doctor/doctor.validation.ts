import z from "zod";

export const updateDoctorZodSchema = z.object({
  doctor: z.object({
    name: z.string().optional(),
    email: z.string().email().optional(),
    profilePhoto: z.string().optional(),
    address: z.string().optional(),
    contactNumber: z.string().optional(),
    experience: z.number().optional(),
    currentWorkingPlace: z.string().optional(),
    registrationNumber: z.string().optional(),
    gender: z.string().optional(),
    appointmentFee: z.number().optional(),
    qualification: z.string().optional(),
    designation: z.string().optional(),
    averageRating: z.number().optional(),
  }),
  specialties: z
    .array(
      z.object({
        id: z.string(),
        shouldDelete: z.boolean().optional(),
      })
    )
    .optional(),
});
