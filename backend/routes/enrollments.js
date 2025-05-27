import { Router } from 'express';
import {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
} from '../controllers/EnrollmentController.js';

const router = Router();

router.get('/', getAllEnrollments);
router.get('/:id', getEnrollmentById);
router.post('/', createEnrollment);
router.put('/:id', updateEnrollment);
router.delete('/:id', deleteEnrollment);

export default router;