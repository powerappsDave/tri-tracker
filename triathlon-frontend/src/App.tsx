/* import { useState, useEffect } from 'react';
import trainingPlan from './data/trainingPlan.json'; */
import UserHeader from './components/UserHeader';
import TrainingWeeksList from './components/TrainingWeeksList';
import TrainingDaysData from './components/TrainingDaysData';
import { useState } from 'react';
import TrainingDayItemData from './components/TrainingDayItemView';
import AthleteDropdown from './components/AthleteDropdown';

export interface IState {
  loggedInUser: {
    id: number;
    name: string;
    email: string;
    role: string
  };

  displayUser: {
    id: number;
    name: string;
    email: string;
    role: string
  };
}

function App() {
  const userId = 1;

  const [loggedInUser, setLoggedInUser] = useState<IState["loggedInUser"]>(
    {
      id: 0,
      name: '',
      email: '',
      role: ''
    }
  );

  const [displayUser, setDisplayUser] = useState<IState["loggedInUser"]>({
      id: 0,
      name: '',
      email: '',
      role: ''
    });


  //const role = "athlete"
  const [weekNumber, setWeekNumber] = useState(1);
  const [dayId, setDayId] = useState<number | null>(null);
  const [refreshWeekOnUpdate, setRefreshWeekOnUpdate] = useState(false);

  console.log(`user role: ${loggedInUser?.role}`);

  return (
    <>
    <div>  
      <UserHeader userId={userId} setUser={setLoggedInUser} />
      
    </div>
    <div className=' bg-gray-800 h-screen'>
      
    <div className="flex flex-row">
        <div className='w-sm ml-4 bg-gray-600 rounded-lg'>{/*left Div*/}
          <AthleteDropdown loggedInUser={loggedInUser} setDisplayUser={setDisplayUser} />
          <TrainingWeeksList userId={displayUser?.id} onWeekSelect={setWeekNumber} selectedWeek={weekNumber} setDayId={setDayId} />
          </div>
          <div className='w-5xl'>
            <TrainingDaysData userId={displayUser?.id} weekNumber={weekNumber} onDaySelected={setDayId} refreshWeekOnUpdate={refreshWeekOnUpdate} setRefreshWeekOnUpdate={setRefreshWeekOnUpdate} />
              <div className='bg-amber-600 w-auto p-2 rounded-sm'>
                {dayId === null ? (<h2>Select a day to view data</h2>): (<TrainingDayItemData dayId={dayId} setRefreshWeekOnUpdate={setRefreshWeekOnUpdate} userRole={loggedInUser.role}/>)}
                {/* <TrainingDayItemData dayId={dayId} setRefreshWeekOnUpdate={setRefreshWeekOnUpdate} userRole={loggedInUser.role}/> */}
              </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
