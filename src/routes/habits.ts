import { Router } from 'express';
import { HabitController } from '../controllers/HabitController';
import { authenticateToken } from '../middleware/auth';
import { verifyHabitOwnership } from '../middleware/habitAuth';
import { validateSchema, schemas } from '../middleware/validation';

const router = Router();
const habitController = new HabitController();

router.get('/', authenticateToken, habitController.getHabits);

router.get('/:id', authenticateToken, verifyHabitOwnership, habitController.getHabit);

router.post('/', authenticateToken, validateSchema(schemas.createHabit), habitController.createHabit);

router.put('/:id', authenticateToken, verifyHabitOwnership, validateSchema(schemas.updateHabit), habitController.updateHabit);

router.delete('/:id', authenticateToken, verifyHabitOwnership, habitController.deleteHabit);

router.patch('/:id/toggle', authenticateToken, verifyHabitOwnership, habitController.toggleHabitStatus);

export default router;
