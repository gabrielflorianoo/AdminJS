import { Router } from 'express';
import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    getFields,
} from '../controllers/ClassController.js';

const router = Router();

router.get('/', getAllClasses);
router.get('/fields', getFields);
router.get('/:id', getClassById);
router.post('/', createClass);
router.put('/:id', updateClass);
router.delete('/:id', deleteClass);

export default router;