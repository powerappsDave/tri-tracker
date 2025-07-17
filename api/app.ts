// app.ts
import express from 'express';
import sqlite3 from 'sqlite3';
import cors from 'cors';
import { json } from 'stream/consumers';
import { hashPassword } from '../utils/hashPassword';
import bcrypt from 'bcryptjs';

const app = express();
const port = 3000;
// Middleware
app.use(cors());
app.use(express.json());

type User ={
  email: string,
  password: string
}
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
    FROM users_new
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

app.get('/api/coaches', (req, res) => {
  const sql = `
  SELECT * FROM users_new WHERE role = 'Coach'`;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error querying DB: ',  err);
      return res.status(500).json({error: 'DB error'});
    }

    res.json(rows)
  })
})

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
    JOIN users_new u ON u.id = ac.athlete_id
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

app.post('/api/login-user', async (req, res) => {
  try {
    const { email, password: plainPassword } = req.body;

    const sqlGet = `SELECT * FROM users_new_new WHERE email = ?`;

    db.get(sqlGet, [email], async (err: Error | null, row: User) => {
      if (err) {
        console.error('Error querying DB:', err);
        return res.status(500).json({ error: 'DB error' });
      }

      if (!row) {
        return res.status(401).json({ error: 'User not found' });
      }

      const passwordMatch = await bcrypt.compare(plainPassword, row.password);

      if (passwordMatch) {
        console.log('Login successful');
        res.status(200).json({ message: 'Login successful', user: row });
      } else {
        console.log('Login unsuccessful');
        res.status(401).json({ error: 'Invalid password' });
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//create user
app.post('/api/register-user', async (req, res) => {
  try {
    
    const password = await hashPassword(req.body.password);  // <-- Await here
    console.log(password);
    
    const { name, email, plan_length, role } = req.body;

    const sqlInsert = `
      INSERT INTO users_new (name, email, password, plan_length, role, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sqlInsert, [name, email, password, plan_length, role, Date.now(), Date.now()], function(err) {
      if (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      res.json({ success: true, createdUser: name });
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
