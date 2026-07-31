import { Router } from 'express';
import { specialityController } from './speciality.controller';

const router = Router();

router.get('/', specialityController.getAllSpecialities);

router.post('/', specialityController.createSpeciality);

router.delete('/:id', specialityController.deleteSpecility);

export const SpecialityRoutes = router;
