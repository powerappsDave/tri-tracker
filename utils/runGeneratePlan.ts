import insertTrainingDays from './generatePlan';

const user_id = 2;
const number_of_weeks = 4;
const start_date = '2025-07-23';

// Call the function
insertTrainingDays(user_id, start_date).catch(err => console.error('Error:', err));
