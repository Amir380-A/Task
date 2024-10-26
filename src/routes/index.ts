import { Router } from 'express';
import userRoutes from './authRoutes';
import organizationRoutes from './organizationRoutes';

const router = Router();

router.use('/users', userRoutes);              // Routes starting with /api/users
router.use('/organizations', organizationRoutes); // Consistent use of 'organizations'

export default router;
