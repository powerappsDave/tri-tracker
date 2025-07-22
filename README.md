# Triathlon Tracker

## Overview

The **Triathlon Tracker** app is designed to help athletes and coaches track triathlon training progress. The app includes features for managing workouts, tracking progress, and adding notes. Athletes can log activities and mark them as complete, while coaches can view and manage the training plans of their athletes.

### Technologies Used:
- **Frontend**: React, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express.js
- **Database**: SQLite3
- **Authentication**: (mention what you plan to implement later, e.g., JWT or session-based)

---

## Features

### For Athletes:
- View weekly workout plans.
- Mark workouts as completed.
- Add notes for each workout.

### For Coaches:
- View athletes' workout plans.
- Edit workout details and track athlete progress.

---

## Installation

To get the project running on your local machine, follow these steps:

# 1. Clone the repository:

**gitbash
git clone https://github.com/your-username/triathlon-tracker.git

# 2. Install Dependencies andPackages
**gitbash
cd tri-tracker
npm install

**gitbash
cd triathlon-frontend
npm install

# 3. Set up sqlite database
**gitbash
npx ts-node migrations/init-db.ts
npx ts-node migrations/1-create-user-table.ts
npx ts-node migrations/2-create-trainingday-table.ts
npx ts-node migrations/3-create-athlete-coach-table.ts


## Starting the app

Register as a coach first
Then register a user as an athlete selecting a four week plan

Login as either coach or athlete to view and edit workout plan

Backend
cd tri-tracker
npx ts-node api/app.ts

Frontend 
cd triathlon-frontend
npm run dev


## Future Improvements
Future Improvements
- Authentication: Adding user login via JWT or OAuth (GitHub login, Google login, etc.).
- Responsive Design: Improve the app's mobile responsiveness for a better user experience on smaller devices.
- User Roles and Permissions: Adding a more dynamic and secure user management system.
