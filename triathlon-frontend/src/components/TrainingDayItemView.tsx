import {useState, useEffect, type FC,} from 'react';

type TrainingDayItem = {
    id: number;
    week_id: number;
    day: string;
    activity: string;
    completed: boolean;
    notes: string;
    week_number: number;
    activity_type: string;
    description: string
}

type TrainingDayItemPropHeaders = {
    dayId: number | null
    setRefreshWeekOnUpdate: (refreshAfterUpdate: boolean) => void,
    userRole: string
}

const TrainingDayItemData: FC<TrainingDayItemPropHeaders> = ({dayId, setRefreshWeekOnUpdate, userRole}: TrainingDayItemPropHeaders) => {
    const activityTypes = ["Run", "Swim", "Cycle", "Brick", "Rest"] as const;
    const [trainingDayItem, setTrainingDayItem] = useState<TrainingDayItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dataToUpdate, setDataToUpdate] = useState(
    {
        notes: '',
        activity: '',
        completed: false,
        activity_type: '',
        description: ''
    });

    const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
        // Only update the week number once fetch is successful
        e.preventDefault();
         try {
        const response = await fetch(
            `http://localhost:3000/api/update-training-day-item?dayId=${dayId}`,
            {
                method: "PUT",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify(dataToUpdate)
            }
        );

        const data = await response.json();
        console.log(data);

        // Only update the week number once fetch is successful
        setRefreshWeekOnUpdate(true); // Use the updated value if available
    } catch (error) {
        console.error("Error updating training day:", error);
        // optionally handle the error, maybe set error state
    }
    }
    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const {name, value} = event.target;
        setDataToUpdate((prevState) => {
            return(
                {
                    ...prevState,
                    [name]: value
                }
            )
        });
        
        console.log(`hallo ${dataToUpdate.completed}`);
    };
    
    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/api/training-day-item?dayId=${dayId}`)
        .then((res) => {
            if (!res.ok) throw new Error('Failed to fecth');
            return res.json();
        })
        .then((data: TrainingDayItem[]) => {
            setError(null);
            setTrainingDayItem(data[0]);
            setDataToUpdate(data[0]);
            console.log(data);
        })
        .catch((err) => setError(err.message))
        .finally(() => setLoading(false));
    }, [dayId])

    if (loading) return <p>Loading training plan...</p>;
    if (error) return <p>Error: {error}</p>;
    
    return(
            <form className="max-w-sm sm:max-w-2xl ml-5 ">
                <h2 className='pt-4 pb-4 text-amber-900 text-2xl font-bold'>{trainingDayItem?.day}</h2>
                <div className="mb-2 md:mb-5 md:flex items-center">
                    <label className="w-36 text-sm font-medium  text-amber-900  dark:text-white mr-4">Activity Type:</label>
                    <select onChange={handleChange} className='md:flex-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg' name="activity_type" id="activity_type">
                        {activityTypes.map((type) => (
                            <option key={type} selected={dataToUpdate.activity_type === type} value={type}>
                            {type}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-2 md:mb-5 md:flex items-center">
                    <label className="w-36 text-sm font-medium  text-amber-900 mr-4">Activity:</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="activity"
                        className="md: flex-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        value={dataToUpdate.activity}
                        readOnly={userRole.toUpperCase() !== 'COACH'}
                        required />
                </div>

                <div className="mb-2 md:mb-5 md:flex items-center">
                    <label className="w-36 text-sm font-medium  text-amber-900  mr-4">Description:</label>
                    <textarea 
                    onChange={handleChange} name='description' value={dataToUpdate.description} 
                    readOnly={userRole.toUpperCase() !== 'COACH'}
                    className="md: flex-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                    required>
                    </textarea>
                </div>

                <div className="mb-5 md:flex items-center">
                    <label className="w-36 text-sm font-medium  text-amber-900 mr-4">Notes:</label>
                    <input
                        onChange={handleChange}
                        type="text"
                        name="notes"
                        className="md: flex-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 p-1 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                        value={dataToUpdate.notes}
                        required
                    />
                </div>
                <div className="flex items-start mb-2 md:mb-5">
                    <div className="flex items-center h-5">
                        <input id="completed" name="completed" type="checkbox" checked={dataToUpdate.completed} onChange={(e) => setDataToUpdate((prevState) => 
                        ({
                            ...prevState,
                            completed: e.target.checked,
                        }))
                         }className="w-4 h-4 border border-gray-300 rounded-sm bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"/>
                        
                    </div>
                    <label className="ms-2 text-sm font-medium text-amber-900">Completed</label>
                </div>
                <button type="submit" onClick={handleSubmit} className="text-white bg-green-500 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center cursor-pointer">Submit</button>
            </form>
    )
}

export default TrainingDayItemData;