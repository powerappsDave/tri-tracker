/* import { useState, useEffect } from 'react';
import trainingPlan from './data/trainingPlan.json'; */
import UserHeader from './components/UserHeader';
import TrainingWeeksList from './components/TrainingWeeksList';
import TrainingDaysData from './components/TrainingDaysData';
import { useState } from 'react';
import TrainingDayItemData from './components/TrainingDayItemView';
import AthleteDropdown from './components/AthleteDropdown';
import { faChevronCircleLeft, faChevronCircleRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  login: {
    email: string;
    password: string;
  };

  register: {
    name: string;
    email: string;
    password: string;
    planLength: number;
    selectedCoach: number;
    role: string;
  }
}

function App() {
  const userId = 2;

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
  const [refreshWeekOnUpdate, setRefreshWeekOnUpdate] = useState<boolean>(false);
  const [sidePanelMinimised, setSidePanelMinimised] = useState<boolean>(false);

  console.log(`user role: ${loggedInUser?.role}`);

  return (
    <>
    <div className='max-w-screen'>
      <div className="text-white bg-gray-600 pb-4 pt-4 flex flex-row">
        <UserHeader userId={userId} setUser={setLoggedInUser} />
        <div className={`ml-auto mr-8`}>
          <a href='' className='m-4 mt-0 mb-0 cursor-pointer font-bold transition delay-150 duration-300 ease-in-out hover:underline hover:text-amber-900'>My Training</a>
          <a href='' className='m-4 mt-0 mb-0 cursor-pointer font-bold transition delay-150 duration-300 ease-in-out hover:underline hover:text-amber-900'>About</a>
          <a href='' className='m-4 mt-0 mb-0 cursor-pointer font-bold transition delay-150 duration-300 ease-in-out hover:underline hover:text-amber-900'>Contact</a>
        </div>
      </div>
      <div className=' bg-gray-950 min-h-screen'>
        
      <div className="flex flex-row justify-center items-center h-auto">
          <div className={`${sidePanelMinimised ? 'w-32' : 'w-auto'} bg-gray-300 border-r-4 border-amber-300  lg:h-screen scroll-auto flex flex-row`}>{/*left Div*/}
            <div className=''>
              <h2 className={`${sidePanelMinimised ? 'text-xs' : 'text-xl'} font-bold text-amber-900 ml-2`}>Welcome User,</h2>
              <AthleteDropdown loggedInUser={loggedInUser} setDisplayUser={setDisplayUser} minimiseSide={sidePanelMinimised} />
              <TrainingWeeksList userId={displayUser?.id} onWeekSelect={setWeekNumber} selectedWeek={weekNumber} setDayId={setDayId} minimiseSide={sidePanelMinimised}/>
            </div>
            <div className='w-auto pt-64'>
              {!sidePanelMinimised ? (<FontAwesomeIcon icon={faChevronCircleLeft} className='mr-2 cursor-pointer text-gray-50' onClick={() => setSidePanelMinimised(prev => !prev)}/>) : (<FontAwesomeIcon icon={faChevronCircleRight} className='mr-2 cursor-pointer text-gray-50' onClick={() => setSidePanelMinimised(prev => !prev)}/>)}
            </div>
            
            {/* <button onClick={() => setMinimiseSide(prev => !prev)} className='bg-amber-50'>Minimise</button> */}
            </div>
            <div className='lg:h-screen w-xs sm:w-sm md:w-3xl lg:w-4xl bg-gray-300 pr-2'>
              <TrainingDaysData userId={displayUser?.id} weekNumber={weekNumber} onDaySelected={setDayId} refreshWeekOnUpdate={refreshWeekOnUpdate} setRefreshWeekOnUpdate={setRefreshWeekOnUpdate} />
                <div className='p-2 rounded-sm ml-3'>
                  {dayId === null ? (<h2>Select a day to view data</h2>): (<TrainingDayItemData dayId={dayId} setRefreshWeekOnUpdate={setRefreshWeekOnUpdate} userRole={loggedInUser.role}/>)}
                  {/* <TrainingDayItemData dayId={dayId} setRefreshWeekOnUpdate={setRefreshWeekOnUpdate} userRole={loggedInUser.role}/> */}
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default App
