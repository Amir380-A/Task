import { Router } from 'express';
import { signup, signin, refreshToken, revokeRefreshToken } from '../controllers/authController';
import UserModel from '../models/userModel';

const router = Router();

router.post('/signup', signup);
router.post('/signin', signin);
router.post('/refresh-token', refreshToken);
router.post('/revoke-token', revokeRefreshToken);

export default router;

