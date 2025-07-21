import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBicycle, faRunning, faSwimmer } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import type { IState as IProps } from "../App";

interface IPropsDashboard {
  loggedInUser: IProps["loggedInUser"];
}

interface TrainingDay {
  id: number;
  activity_date: string;
  activity: string;
  activity_type: string;
  activity_subtype?: string;
  distance: string;
  description: string;
  notes: string;
  completed: boolean;
  phase: string;
}

type AthleteCoach = {
  id: number;
  coach_id: number;
  athlete_id: number;
  email: string;
}[];

function getActivityColor(type: string): string {
  switch (type.toLowerCase()) {
    case 'run':
      return '#9b59b6'; // purple
    case 'cycle':
    case 'cycling':
      return '#f1c40f'; // yellow
    case 'swim':
    case 'swimming':
      return '#3498db'; // blue
    default:
      return '#95a5a6'; // grey fallback
  }
}

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'run':
      return faRunning;
    case 'cycle':
    case 'cycling':
      return faBicycle;
    case 'swim':
    case 'swimming':
      return faSwimmer;
    default:
      return faRunning; // fallback icon
  }
}

const CustomCalendar: React.FC<IPropsDashboard> = ({ loggedInUser }) => {
  const activityTypes = ["Run", "Swim", "Cycle", "Brick", "Rest"] as const;
  const activitySubtypes = ["Interval", "Tempo", "Easy", "Recovery", "Long", "Other"] as const;
  const phases = ["Build", "Peak", "Base", "Race Week"] as const;

  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trainingDayData, setTrainingDayData] = useState<TrainingDay[]>([]);
  const [dropdownData, setDropdownData] = useState<AthleteCoach>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | string>("");

  const [displayUserId, setDisplayUserId] = useState<number>(-1); // This should be declared inside the component

  useEffect(() => {
      //get athlete data from db when coach selects athlete from dropdown
      if (loggedInUser?.role.toUpperCase() === "COACH") {
        const fetchUserData = async () => {
          try {
  
            const res = await fetch(
              `http://localhost:3000/api/athlete-coach?coachId=${loggedInUser.id}`
            );
            const data = await res.json();
  
            if (data.length > 0) {
              setDropdownData(data);
            }
          } catch (error) {
            console.error("Error fetching athletes related to this coach id: ", error);
          }
        };
        fetchUserData();
      }
    }, []);

  // Move the useEffect out of the conditional check
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        let res: Response | null = null;
        if (loggedInUser?.role === "Athlete") {
          res = await fetch(`http://localhost:3000/api/training-days?userId=${loggedInUser?.id}`);
        } else if (displayUserId !== -1) { // You can check displayUserId here
          res = await fetch(`http://localhost:3000/api/training-days?userId=${displayUserId}`);
        }

        if (res) {
          const data = await res.json();
          setTrainingDayData(data);
          console.log(data);
        } else {
          console.error('No response received from the API');
        }
      } catch (error) {
        console.error("Error fetching training data:", error);
      }
    };

    if (loggedInUser?.role === "Athlete" || loggedInUser?.role === "Coach") {
      fetchUserData();
    }
  }, [loggedInUser?.id, displayUserId]); // Add displayUserId to the dependency array

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const athleteId = event.target.value;
    setSelectedAthleteId(athleteId); // Set the selected athlete id in state
    setDisplayUserId(parseInt(athleteId));
  };

  const displayDropdown = () => {
    return (
      <select
        className={`bg-gray-50 rounded-sm ml-2 mt-2 mr-1`}
        value={selectedAthleteId}
        onChange={handleDropdownChange}
      >
        <option value="" disabled>
          Select Athlete
        </option>
        {dropdownData.map((d) => (
          <option key={d.athlete_id} value={d.athlete_id}>
            {d.email}
          </option>
        ))}
      </select>
    );
  };

  const events = trainingDayData.map((day) => ({
    id: String(day.id),
    title: `${day.activity}`,
    start: day.activity_date,
    color: getActivityColor(day.activity_type),
    extendedProps: {
      description: day.description,
      notes: day.notes,
      icon: getActivityIcon(day.activity_type),
      completed: day.completed,
      activityType: day.activity_type,
      activity: day.activity,
      activitySubtype: day.activity_subtype,
      phase: day.phase,
      distance: day.distance,
    }
  }));

  return (
    <div>
      {loggedInUser?.role === "Coach" && displayDropdown()}
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridWeek"
        height="100vh"
        headerToolbar={{
          start: 'today prev,next',
          center: 'title',
          end: 'dayGridMonth,dayGridWeek',
        }}
        events={events}
        eventClick={(info) => {
          const eventData = {
            id: info.event.id,
            title: info.event.title,
            date: info.event.startStr,
            description: info.event.extendedProps.description,
            notes: info.event.extendedProps.notes,
            completed: info.event.extendedProps.completed,
            activityType: info.event.extendedProps.activityType,
            activity: info.event.extendedProps.activity,
            activitySubtype: info.event.extendedProps.activitySubtype,
            phase: info.event.extendedProps.phase,
            distance: info.event.extendedProps.distance
          };
          setSelectedEvent(eventData);
          setIsModalOpen(true);
        }}
        eventContent={(arg) => {
          const { event } = arg;
          const icon = event.extendedProps.icon;
          return (
            <div className="flex items-center cursor-pointer">
              <FontAwesomeIcon icon={icon} className="mr-2 ml-2" />
              <span>{event.title}</span>
            </div>
          );
        }}
      />
      <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl rounded bg-white p-6 shadow-lg">
            {/* Modal content */}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CustomCalendar;
