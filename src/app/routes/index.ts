import { Router } from 'express';
import { AuthRoutes } from '../modules/auth/auth.route';
import { SpecialityRoutes } from '../modules/speciality/speciality.route';

const router = Router();

router.use('/auth', AuthRoutes);
router.use('/specialities', SpecialityRoutes);

export const IndexRoutes = router;
