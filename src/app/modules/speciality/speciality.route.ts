import { Router } from 'express';
import { Role } from '../../../generated/prisma/enums';
import { checkAuth } from '../../middleware/checkAuth';
import { specialityController } from './speciality.controller';

const router = Router();

router.get(
  '/',
  checkAuth(Role.ADMIN, Role.SUPER_ADMIN, Role.DOCTOR),
  specialityController.getAllSpecialities
);

router.post('/', specialityController.createSpeciality);

router.delete('/:id', specialityController.deleteSpecility);

export const SpecialityRoutes = router;
