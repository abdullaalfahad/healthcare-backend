import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { AuthController } from "./auth.controller";
import { changeePasswordZodSchema } from "./auth.validation";

const router = Router();

router.post("/register", AuthController.patientRegister);

router.post("/login", AuthController.userLogin);

router.get(
  "/me",
  checkAuth(Role.PATIENT, Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN),
  AuthController.getMe
);

router.post("/refresh-token", AuthController.refreshToken);

router.post(
  "/change-password",
  checkAuth(Role.PATIENT, Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN),
  validateRequest(changeePasswordZodSchema),
  AuthController.changePassword
);

router.post("/verify-email", AuthController.verifyEmail);

router.post("/logout", AuthController.logout);

router.post("/forget-password", AuthController.forgetPassword);

router.post("/reset-password", AuthController.resetPassword);

export const AuthRoutes = router;
