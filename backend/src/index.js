import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js'; // ✅ هذا كيستورد جميع المسارات من routes/index.js

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// ✅ جميع الـ routes: /api/auth, /api/projects, /api/habits
app.use('/api', routes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
