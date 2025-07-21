import sqlite3 from 'sqlite3';
import trainingDaysSeed from '../data/trainingDaySeed';

const db = new sqlite3.Database('./triathlon.db');

db.serialize(() => {

    db.run(`DROP TABLE IF EXISTS training_days`)

    db.run(`DROP TABLE IF EXISTS training_days_new`)
   
    db.run(`
        CREATE TABLE IF NOT EXISTS training_days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        activity_date TEXT NOT NULL,
        activity TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        activity_type TEXT CHECK(activity_type IN (
            'Run', 'Cycle', 'Rest', 'Swim', 'Brick', 'Race'
        )),
        activity_subtype TEXT CHECK(activity_subtype IN (
            'Easy', 'Recovery', 'Tempo', 'Interval', 'Long', 'Other', 'Race', 'Other', 'Technique', 'Endurance'
        )) NULL,
        distance TEXT,
        description TEXT,
        notes TEXT,
        phase TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users_new(id) ON DELETE CASCADE
        );

    `);
   
    /* db.run(`
        CREATE TABLE IF NOT EXISTS training_days (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        week_id INTEGER NOT NULL,
        day TEXT NOT NULL CHECK(day IN (
            'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
        )),
        activity TEXT NOT NULL,
        completed BOOLEAN DEFAULT 0,
        activity_type TEXT NOT NULL CHECK(activity_type IN (
            'Run', 'Cycle', 'Rest', 'Swim', 'Brick', 'Race'
        )),
        description TEXT NULL,
        notes TEXT NULL,
        FOREIGN KEY (week_id) REFERENCES training_weeks(id) ON DELETE CASCADE
        )
    `);


  const stmt = db.prepare(`
    INSERT INTO training_days (week_id, day, activity, completed, activity_type, description, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  for (const day of trainingDaysSeed) {
    stmt.run(day.week_id, day.day, day.activity, day.completed ? 1 : 0, day.activity_type, day.description, day.notes);
  }

  stmt.finalize();

    type TrainingDay = {
        id: number,
        activity: string,
        //email: string
    }

    db.each("SELECT id, activity FROM training_days", (err, row: TrainingDay) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(`${row.id}: ${row.activity}`);
        }
    }) */
})

db.close();