// project/backend/src/config/database.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: '1234554321',
  database: 'habit_tracker',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create projects table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS projects (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create habits table
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS habits (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        project_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        streak INT DEFAULT 0,
        completed_today BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
      )
    `);

    console.log('✅ Database initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  }
};

export default pool;
