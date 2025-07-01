import { table } from 'console';
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./triathlon.db');

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS training_weeks`)
    
    db.run(`
        CREATE TABLE IF NOT EXISTS training_weeks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        week_number INTEGER NOT NULL,
        phase TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
        )
    `);

    const stmt = db.prepare("INSERT INTO training_weeks (user_id, week_number, phase) VALUES (?, ?, ?)");

    const training_weeks = [
        {userd_id: 2, week_number: 1, phase: "Base"},
        {userd_id: 2, week_number: 2, phase: "Base"},
        {userd_id: 2, week_number: 3, phase: "Base"},
        {userd_id: 2, week_number: 4, phase: "Base"},
        {userd_id: 2, week_number: 5, phase: "Build"},
        {userd_id: 2, week_number: 6, phase: "Build"},
        {userd_id: 2, week_number: 7, phase: "Build"},
        {userd_id: 2, week_number: 8, phase: "Build"},
        {userd_id: 2, week_number: 9, phase: "Peak"},
        {userd_id: 2, week_number: 10, phase: "Peak"},
        {userd_id: 2, week_number: 11, phase: "Peak"},
        {userd_id: 2, week_number: 12, phase: "Peak"},
    ]

    for (const training_week of training_weeks) {
        stmt.run(training_week.userd_id, training_week.week_number, training_week.phase);
    }

    stmt.finalize();

    type TrainingWeek = {
        id: number,
        user_id: number,
        //email: string
    }

    db.each("SELECT id, user_id FROM training_weeks", (err, row: TrainingWeek) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(`${row.id}: ${row.user_id}`);
        }
    })
})

db.close();