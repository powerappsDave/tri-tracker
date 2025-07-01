import {useState, useEffect} from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRunning, faSwimmer, faBicycle, faTired} from '@fortawesome/free-solid-svg-icons'

type TrainingDay = {
    id: number;
    week_id: number;
    day: string;
    activity: string;
    completed: boolean;
    notes: string;
    week_number: number;
    activity_type: string;
}

type TrainingDayPropHeaders = {
    userId: number,
    weekNumber: number,
    onDaySelected: (dayId: number) => void,
    refreshWeekOnUpdate: boolean,
    setRefreshWeekOnUpdate: (refreshAfterUpdate: boolean) => void,
}

const TrainingDaysData = ({userId, weekNumber, onDaySelected, refreshWeekOnUpdate, setRefreshWeekOnUpdate}: TrainingDayPropHeaders) => {
    const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/api/training-days?userId=${userId}`)
        .then((res) => {
            if (!res.ok) throw new Error('Failed to fecth');
            return res.json();
        })
        .then((data: TrainingDay[]) => {
            setError(null);
            setTrainingDays(data);
            setRefreshWeekOnUpdate(false);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [weekNumber, refreshWeekOnUpdate, userId])

    if (loading) return <p>Loading training plan...</p>;
    if (error) return <p>Error: {error}</p>;
    if (trainingDays.length === 0) return <p>No training plans assigned.</p>;

    
    return(
        <div className='flex gap-1'>
            {trainingDays.filter(week => week.week_number === weekNumber).map((day) => (
                <div key={day.id} onClick={() => onDaySelected(day.id)} className={`w-40 h-auto ${day.completed ? 'text-green-500' : 'text-red-500' }  bg-gray-50 border-2 border-gray-600 p-1 m-1 mb-0 mt-0 flex flex-col items-center overflow-hidden text-center cursor-pointer`}>
                    <p className="font-bold w-full truncate">{day.day}</p>
                    {day.activity.toUpperCase().includes("RUN") && (<FontAwesomeIcon icon={faRunning} />)}
                    {day.activity.toUpperCase().includes("SWIM") && (<FontAwesomeIcon icon={faSwimmer} />)}
                    {day.activity.toUpperCase().includes("BIKE") && (<FontAwesomeIcon icon={faBicycle} />)}
                    {day.activity.toUpperCase().includes("REST") && (<FontAwesomeIcon icon={faTired} />)}
                    <p >{day.activity_type}</p>
                </div>
            ))}
        </div>
    )
}

export default TrainingDaysData;