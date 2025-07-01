// init-db.ts
import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./triathlon.db');

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  const stmt = db.prepare("INSERT INTO activities (name) VALUES (?)");

  const activities = ["Running", "Cycling", "Swimming"];

  for (const activity of activities) {
    stmt.run(activity);
  }

  stmt.finalize();

  type Activity = {
  id: number;
  name: string;
};

db.each("SELECT id, name FROM activities", (err, row: Activity) => {
  if (err) {
    console.error(err);
  } else {
    console.log(`${row.id}: ${row.name}`);
  }
});
});

db.close();
