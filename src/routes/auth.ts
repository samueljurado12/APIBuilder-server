import { Router } from 'express';
import checkJwt from '../Middleware/checkjwt';
import AuthController from '../Controller/AuthController';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.post('/change-password', [checkJwt], AuthController.changePassword);

export default router;
