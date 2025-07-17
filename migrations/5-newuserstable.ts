import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./triathlon.db');

db.serialize(() => {
    db.run(`DROP TABLE IF EXISTS users_new`)
    db.run(`
        CREATE TABLE IF NOT EXISTS users_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password VARCHAR(255),
        plan_length INT,
        role TEXT NOT NULL CHECK(role IN (
            'Athlete', 'Coach')),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
    `);

})

db.close();