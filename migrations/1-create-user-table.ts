import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./triathlon.db');

db.serialize(() => {
    //
    db.run('DROP TABLE IF EXISTS users');

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        role TEXT NOT NULL CHECK(role IN (
            'Athlete', 'Coach'))
        )
    `);

    const stmt = db.prepare("INSERT INTO users (name, email, role) VALUES (?, ?, ?)");

    const users = [
        {name: "Test Coach", email: "test-coach@gmail.com", role: "Coach"},
        {name: "Test Athlete", email: "test-athlete@gmail.com", role: "Athlete"},
        {name: "Test SecondAthlete", email: "test-athlete2@gmail.com", role: "Athlete"}
    ]

    for (const user of users) {
        stmt.run(user.name, user.email, user.role);
    }

    stmt.finalize();

    type User = {
        id: number,
        name: string,
        email: string
    }

    db.each("SELECT id, name, email FROM users", (err, row: User) => {
        if (err) {
            console.error(err);
        }
        else {
            console.log(`${row.id}: ${row.name}`);
        }
    })
})

db.close();