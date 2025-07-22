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
    case 'run': return '#9b59b6';
    case 'cycle':
    case 'cycling': return '#f1c40f';
    case 'swim':
    case 'swimming': return '#3498db';
    default: return '#95a5a6';
  }
}

function getActivityIcon(type: string) {
  switch (type.toLowerCase()) {
    case 'run': return faRunning;
    case 'cycle':
    case 'cycling': return faBicycle;
    case 'swim':
    case 'swimming': return faSwimmer;
    default: return faRunning;
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
  const [dataToUpdate, setDataToUpdate] = useState<TrainingDay>({
    id: -1,
    activity_date: '',
    activity: '',
    activity_type: '',
    activity_subtype: '',
    distance: '',
    description: '',
    notes: '',
    completed: false,
    phase: ''
  });
  const [displayUserId, setDisplayUserId] = useState<number>(-1);

  const fetchUserData = async () => {
    try {
      let res: Response | null = null;
      if (loggedInUser?.role === "Athlete") {
        res = await fetch(`http://localhost:3000/api/training-days?userId=${loggedInUser?.id}`);
      } else if (displayUserId !== -1) {
        res = await fetch(`http://localhost:3000/api/training-days?userId=${displayUserId}`);
      }

      if (res) {
        const data = await res.json();
        setTrainingDayData(data);
        console.log("Fetched training data:", data);
      } else {
        console.error('No response received from API');
      }
    } catch (error) {
      console.error("Error fetching training data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:3000/api/update-training-day-item?id=${dataToUpdate.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToUpdate),
        }
      );
      fetchUserData();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error updating training day:", error);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = event.target;
    setDataToUpdate((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (loggedInUser?.role.toUpperCase() === "COACH") {
      const fetchCoachAthletes = async () => {
        try {
          const res = await fetch(`http://localhost:3000/api/athlete-coach?coachId=${loggedInUser.id}`);
          const data = await res.json();
          if (data.length > 0) setDropdownData(data);
        } catch (error) {
          console.error("Error fetching athlete dropdown:", error);
        }
      };
      fetchCoachAthletes();
    }
  }, [loggedInUser]);

  useEffect(() => {
    if (loggedInUser?.role === "Athlete" || loggedInUser?.role === "Coach") {
      fetchUserData();
    }
  }, [loggedInUser?.id, displayUserId]);

  const handleDropdownChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const athleteId = event.target.value;
    setSelectedAthleteId(athleteId); 
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
          setDataToUpdate({
            id: parseInt(eventData.id), // assuming it's a string, convert to number
            activity_date: eventData.date,
            activity: eventData.activity,
            activity_type: eventData.activityType,
            activity_subtype: eventData.activitySubtype ?? '', // fallback for optional
            distance: eventData.distance,
            description: eventData.description,
            notes: eventData.notes,
            completed: eventData.completed,
            phase: eventData.phase,
          });

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
            {selectedEvent && (
              <>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="activity" className="block mb-1 font-medium text-gray-700">
                      Activity
                    </label>
                    <input
                      type="text"
                      id="activity"
                      name="activity"
                      value={dataToUpdate.activity}
                      onChange={handleChange}
                      disabled={loggedInUser?.role.toUpperCase() === "ATHLETE"}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="activity_type" className="block mb-1 font-medium text-gray-700">
                        Activity Type
                      </label>
                      <select
                        id="activity_type"
                        name="activity_type"
                        value={dataToUpdate.activity_type}
                        onChange={handleChange}
                        disabled={loggedInUser?.role.toUpperCase() === "ATHLETE"}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {activityTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="activity_subtype" className="block mb-1 font-medium text-gray-700">
                        Activity Subtype
                      </label>
                      <select
                        id="activity_subtype"
                        name="activity_subtype"
                        value={dataToUpdate.activity_subtype || ''}
                        onChange={handleChange}
                        disabled={loggedInUser?.role.toUpperCase() === "ATHLETE"}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {activitySubtypes.map((subtype) => (
                          <option key={subtype} value={subtype}>
                            {subtype}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="phase" className="block mb-1 font-medium text-gray-700">
                        Phase
                      </label>
                      <select
                        id="phase"
                        name="phase"
                        value={dataToUpdate.phase}
                        onChange={handleChange}
                        disabled={loggedInUser?.role.toUpperCase() === "ATHLETE"}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                      >
                        {phases.map((phase) => (
                          <option key={phase} value={phase}>
                            {phase}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="completed" className="block mb-1 font-medium text-gray-700">
                        Completed
                      </label>
                      <select
                        id="completed"
                        name="completed"
                        value={dataToUpdate.completed ? 'Yes' : 'No'}
                        onChange={(e) =>
                          setDataToUpdate((prev) => ({
                            ...prev,
                            completed: e.target.value === 'Yes',
                          }))
                        }
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                      >
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="distance" className="block mb-1 font-medium text-gray-700">
                      Distance
                    </label>
                    <input
                      type="text"
                      id="distance"
                      name="distance"
                      value={dataToUpdate.distance}
                      onChange={handleChange}
                      disabled={loggedInUser?.role.toUpperCase()=== "ATHLETE"}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block mb-1 font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={dataToUpdate.description}
                      onChange={handleChange}
                      disabled={loggedInUser?.role.toUpperCase() === "ATHLETE"}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div>
                    <label htmlFor="notes" className="block mb-1 font-medium text-gray-700">
                      Notes
                    </label>
                    <input
                      type="text"
                      id="notes"
                      name="notes"
                      value={dataToUpdate.notes}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2"
                    />
                  </div>

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={handleSubmit}
                      className="px-5 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                      Submit
                    </button>
                  </div>
                </form>

              </>
            )}
          </div>
        </div>
      </Dialog>
    </div>
  );
};

export default CustomCalendar;
