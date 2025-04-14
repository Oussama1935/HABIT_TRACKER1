// backend/src/routes/projects.js (ou dans un nouveau fichier)
import express from 'express';
import pool from '../config/database.js';

const router = express.Router();

router.get('/:projectId/progress', async (req, res) => {
  const { projectId } = req.params;

  try {
    const [totalRows] = await pool.execute(
      'SELECT COUNT(*) as total FROM habits WHERE project_id = ?',
      [projectId]
    );

    const [completedRows] = await pool.execute(
      'SELECT COUNT(*) as completed FROM habits WHERE project_id = ? AND completed_today = TRUE',
      [projectId]
    );

    const total = totalRows[0].total;
    const completed = completedRows[0].completed;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    res.json({ total, completed, progress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur lors du calcul de progression.' });
  }
});

export default router;
