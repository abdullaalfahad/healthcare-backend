import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { userController } from "./user.controller";
import { createAdminZodSchema, createDoctorZodSchema } from "./user.validation";

const router = Router();

router.post("/create-doctor", validateRequest(createDoctorZodSchema), userController.createDoctor);

router.post(
  "/create-admin",
  checkAuth(Role.SUPER_ADMIN, Role.ADMIN),
  validateRequest(createAdminZodSchema),
  userController.createAdmin
);

export const userRoutes = router;
