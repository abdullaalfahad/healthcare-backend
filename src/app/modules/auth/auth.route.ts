import { Router } from 'express';
import { AuthController } from './auth.controller';

const router = Router();

router.post('/register', AuthController.patientRegister);

router.post('/login', AuthController.userLogin);

export const AuthRoutes = router;
