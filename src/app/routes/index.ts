import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { DoctorRoutes } from "../modules/doctor/doctor.route";
import { SpecialityRoutes } from "../modules/speciality/speciality.route";
import { userRoutes } from "../modules/user/user.route";

const router = Router();

router.use("/auth", AuthRoutes);
router.use("/users", userRoutes);
router.use("/specialities", SpecialityRoutes);
router.use("/doctors", DoctorRoutes);

export const IndexRoutes = router;
