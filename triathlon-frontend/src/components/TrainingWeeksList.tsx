import {useState, useEffect } from 'react';

type TrainingWeek = {
    id: number
    week_number: number
    phase: string
};

type TrainingWeekHeaderProps = {
    userId: number
    onWeekSelect: (weekNumber: number) => void
    selectedWeek: number
    setDayId: (dayNumber: number | null) => void
}

const TrainingWeeksList: React.FC<TrainingWeekHeaderProps> = ({userId, onWeekSelect, selectedWeek, setDayId}) => {
    const [trainingWeeks, setTrainingWeeks] = useState<TrainingWeek[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    /* useEffect(() => {
        setTrainingWeeks([
            {
                id: 1,
                week_number: 1,
                phase: "Build"
            },
            {
                id: 1,
                week_number: 2,
                phase: "Base"
            },
            {
                id: 1,
                week_number: 3,
                phase: "Peak"
            }
        ]);
    }, []); */

    useEffect(() => {
        setLoading(true);
        fetch(`http://localhost:3000/api/training-weeks?userId=${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error('Failed to fetch');
                return res.json();
            })
            .then((data: TrainingWeek[]) => {
                setError(null);
                setTrainingWeeks(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
        }, [userId])

        if (loading) return <p>Loading training plan...</p>;
        if (error) return <p>Error: {error}</p>;
        if (trainingWeeks.length === 0) return <p>No training plans assigned.</p>;
        return (
        <div>
            {trainingWeeks.map((week) => (
                <div onClick={() => (onWeekSelect(week.week_number), setDayId(null))}
                key={week.id}
                className={`max-w-sm m-2 p-1 border rounded ${week.week_number === selectedWeek ? 'bg-amber-100': 'bg-gray-50'}  dark:bg-gray-800 cursor-pointer`}
                >
                <p className="text-amber-600 font-bold text-xs">
                    Week {week.week_number} - {week.phase}
                </p>
            </div>
        ))}
    </div>
    );
};

export default TrainingWeeksList;