import fs from 'fs/promises';
import sqlite3 from 'sqlite3';

// Define the structure of a training day
interface TrainingDay {
  activity: string;
  activity_type: string;
  activity_subtype?: string;
  distance: string;
  description: string;
  notes: string;
  phase: string;
}

// Open the database once
const db = new sqlite3.Database('./triathlon.db');

// Helper function to increment the date by one day
const incrementDate = (currentDate: Date, daysToAdd: number): Date => {
  const result = new Date(currentDate);
  result.setDate(result.getDate() + daysToAdd);
  return result;
};

// Function to format the date into YYYY-MM-DD format
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Main function to insert training days
async function insertTrainingDays(user_id: number, start_date: string) {
  let data = await fs.readFile('./data/four_week_plan.json', 'utf-8');
  
  const plan: TrainingDay[] = JSON.parse(data);

  // Convert start_date to a Date object
  const startDate = new Date(start_date);

  const insertSQL = `
    INSERT INTO training_days (
      user_id, activity_date, activity, completed,
      activity_type, activity_subtype, distance,
      description, notes, phase
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const stmt = db.prepare(insertSQL);

  let dayCounter = 0; // This will help increment the date for each day in the plan

  // Loop through each day directly
  for (const day of plan) {
    // Increment the date based on the current counter
    const currentDate = incrementDate(startDate, dayCounter);

    // Format the incremented date to YYYY-MM-DD
    const formattedDate = formatDate(currentDate);

    console.log(`Inserting activity: ${day.activity} on ${formattedDate}`);

    // Insert the training day into the database
    stmt.run(
      user_id,
      formattedDate, // Use the incremented date
      day.activity,
      false,
      day.activity_type,
      day.activity_subtype || 'Other',
      day.distance,
      day.description,
      day.notes,
      day.phase
    );

    // Increment the day counter
    dayCounter++;
  }

  stmt.finalize(() => {
    console.log('Training days inserted successfully.');
    db.close();
  });
}

export default insertTrainingDays;
