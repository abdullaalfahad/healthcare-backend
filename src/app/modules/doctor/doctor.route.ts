import { Router } from "express";
import { Role } from "../../../generated/prisma/enums";
import { checkAuth } from "../../middleware/checkAuth";
import { validateRequest } from "../../middleware/validateRequest";
import { doctorController } from "./doctor.controller";
import { updateDoctorZodSchema } from "./doctor.validation";

const router = Router();

router.get("/", doctorController.getAllDoctors);
router.get(
  "/:id",
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  doctorController.getDoctorById
);
router.put(
  "/:id",
  //   checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  validateRequest(updateDoctorZodSchema),
  doctorController.updateDoctor
);
export const DoctorRoutes = router;
