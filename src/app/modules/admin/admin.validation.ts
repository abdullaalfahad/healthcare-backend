import z from "zod";

export const updateAdminZodSchema = z.object({
  admin: z.object({
    name: z.string().optional(),
    profilePhoto: z.string().optional(),
    contactNumber: z.string().optional(),
  }),
});
