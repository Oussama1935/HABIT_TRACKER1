//project\backend\src\routes\index.js
import express from 'express';
import authRoutes from './authRoutes.js';
import projectsRoutes from './projectsRoutes.js';
import habitsRoutes from './habitsRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes); // /api/auth
router.use('/projects', projectsRoutes); // /api/projects
router.use('/habits', habitsRoutes); // /api/habits

export default router;
