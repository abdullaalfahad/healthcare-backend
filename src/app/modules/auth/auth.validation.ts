import z from "zod";

export const changeePasswordZodSchema = z.object({
  currentPassword: z.string("Current password is required").min(8).max(32),
  newPassword: z.string("New password is required").min(8).max(32),
});
