// app.ts
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { json } from 'stream/consumers';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// DB setup
const db = new sqlite3.Database('./triathlon.db');

// Sample route
app.get('/api/training-days', (req, res) => {
  const userId = req.query.userId;
  const sql = `
    SELECT td.*, tw.week_number
    FROM training_days td
    JOIN training_weeks tw ON td.week_id = tw.id
    WHERE tw.user_id = ?
    ORDER BY td.week_id, td.id
  `;
  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Error querying DB:', err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json(rows);
  });
});

//Get User
app.get('/api/users', (req, res) => {
  const userId =  req.query.userId;
  const sql = `
    SELECT *
    FROM users
    WHERE id = ?
  `;

  db.all(sql, [userId], (err, rows) => {
    if (err) {
      console.error('Error querying DB:', err);
      return res.status(500).json({ error: 'DB error' });

    }

    res.json(rows)
  });
});

app.get('/api/training-day-item', (req, res) => {
  const dayId =  req.query.dayId;
  const sql = `
    SELECT *
    FROM training_days
    WHERE id = ?
  `;

  db.all(sql, [dayId], (err, rows) => {
    if (err) {
      console.error('Error querying DB:', err);
      return res.status(500).json({ error: 'DB error' });

    }

    res.json(rows)
  });
});

app.get('/api/training-weeks', (req, res) => {
  const userId =  req.query.userId;
  const sql = `
    SELECT *
    FROM training_weeks
    WHERE user_id = ?
  `;

  db.all(sql, userId, (err, rows) => {
    if (err) {
      console.error('Error querying DB:', err);
      return res.status(500).json({ error: 'DB error' });

    }

    res.json(rows)
  });
});

app.get('/api/athlete-coach', (req, res) => {
  const coachId =  req.query.coachId;

  console.log('Received coachId:', coachId);

 const sql = `
    SELECT ac.*, u.email
    FROM athlete_coach ac
    JOIN users u ON u.id = ac.athlete_id
    WHERE ac.coach_id = ?
  `;

  db.all(sql, [coachId], (err, rows) => {
    if (err) {
      console.error('Error querying DB:', err);
      return res.status(500).json({ error: 'DB error' });

    }

    res.json(rows)
  });
});

//Update training_days item
app.put('/api/update-training-day-item', (req, res) => {
  const id = req.query.dayId;
  const { activity, notes, completed, activity_type, description } = req.body;

  const sqlCheck = `SELECT id FROM training_days WHERE id = ?`;
  db.get(sqlCheck, [id], (err, row) => {
    if (err) {
      console.error('Error querying DB:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Training day not found' });
    }

    const sqlUpdate = `UPDATE training_days SET activity = ?, notes = ?, completed = ?, activity_type = ?, description = ? WHERE id = ?`;
    db.run(sqlUpdate, [activity, notes, completed, activity_type, description, id], function (err) {
      if (err) {
        console.error('Error updating DB:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ success: true, updatedId: id });
    });
  });
});


// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
