import { Router } from 'express';
import {
    createOrganization,
    readOrganization,
    readAllOrganizations,
    updateOrganization,
    deleteOrganization,
    inviteUserToOrganization,
} from '../controllers/organizationController';
import verifyToken from '../middlewares/verifyToken';


const router = Router();

// Routes with 'verifyToken' to check authorization
router.post('/', verifyToken, createOrganization);
router.get('/:organization_id', verifyToken, readOrganization);
router.get('/', verifyToken, readAllOrganizations);
router.put('/:organization_id', verifyToken, updateOrganization);
router.delete('/:organization_id', verifyToken, deleteOrganization);
router.post('/:organization_id/invite', verifyToken, inviteUserToOrganization);

export default router;
