//project\backend\src\routes\habits.js
import express from 'express';
import pool from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Get all habits for a user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const [habits] = await pool.execute(
      'SELECT * FROM habits WHERE user_id = ? ORDER BY created_at DESC',
      [req.user.id]
    );
    res.json(habits);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create a new habit
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description } = req.body;
    const [result] = await pool.execute(
      'INSERT INTO habits (user_id, name, description) VALUES (?, ?, ?)',
      [req.user.id, name, description]
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Toggle habit completion
router.put('/:id/toggle', authenticateToken, async (req, res) => {
  try {
    const [habit] = await pool.execute(
      'SELECT * FROM habits WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );

    if (habit.length === 0) {
      return res.status(404).json({ error: 'Habit not found' });
    }

    const newCompletedStatus = !habit[0].completed_today;
    const newStreak = newCompletedStatus ? habit[0].streak + 1 : habit[0].streak;

    await pool.execute(
      'UPDATE habits SET completed_today = ?, streak = ? WHERE id = ?',
      [newCompletedStatus, newStreak, req.params.id]
    );

    res.json({ completed: newCompletedStatus, streak: newStreak });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a habit
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    await pool.execute(
      'DELETE FROM habits WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.id]
    );
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user stats
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const [habits] = await pool.execute(
      'SELECT * FROM habits WHERE user_id = ?',
      [req.user.id]
    );

    const stats = {
      total: habits.length,
      completed: habits.filter(h => h.completed_today).length,
      streaks: habits.reduce((acc, h) => acc + h.streak, 0)
    };

    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;