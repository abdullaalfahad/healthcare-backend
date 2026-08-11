import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { AuthController } from "./auth.controller";

const router = Router();

router.post("/register", AuthController.patientRegister);

router.post("/login", AuthController.userLogin);

router.get(
  "/me",
  checkAuth(Role.PATIENT, Role.ADMIN, Role.DOCTOR, Role.SUPER_ADMIN),
  AuthController.getMe
);

router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
