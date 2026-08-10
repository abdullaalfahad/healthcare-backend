import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { doctorController } from "./doctor.controller";

const router = Router();

router.get("/", doctorController.getAllDoctors);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  doctorController.getDoctorById
);

export const DoctorRoutes = router;
