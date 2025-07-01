import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./triathlon.db');

db.serialize(() => {
  // Drop the athlete_coach table if it already exists (so we can recreate it)
  db.run(`DROP TABLE IF EXISTS athlete_coach`)

  //create the athlete_coach table with the correct foreign key references
  db.run(`
    CREATE TABLE IF NOT EXISTS athlete_coach (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      coach_id INTEGER NOT NULL,
      athlete_id INTEGER NOT NULL,
      FOREIGN KEY (coach_id) REFERENCES user(id),  -- Corrected the table name to 'user'
      FOREIGN KEY (athlete_id) REFERENCES user(id), -- Corrected the table name to 'user'
      UNIQUE(athlete_id)
    )
  `);

  // Prepare statement for inserting data into athlete_coach
  const stmt = db.prepare("INSERT INTO athlete_coach (coach_id, athlete_id) VALUES (?, ?)");

  const athlete_coach_relationships = [
    { coach_id: 1, athlete_id: 2 },
    { coach_id: 1, athlete_id: 3 }
  ];

  for (const athlete_coach_relationship of athlete_coach_relationships) {
    stmt.run(athlete_coach_relationship.coach_id, athlete_coach_relationship.athlete_id);
  }

  stmt.finalize();

  // Debug: Check if the data is correctly inserted
  db.each("SELECT id, coach_id, athlete_id FROM athlete_coach", (err, row) => {
    if (err) {
      console.error(err);
    } else {
      console.log(`passed`)
    }
  });
});

db.close();