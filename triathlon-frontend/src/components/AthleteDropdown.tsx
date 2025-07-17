import { useEffect, useState } from "react";
import type { IState as IProps } from "../App";

type AthleteCoach = {
  id: number;
  coach_id: number;
  athlete_id: number;
  email: string;
}[];

type DisplayUserPropHeaders = {
  loggedInUser: IProps["loggedInUser"];
  setDisplayUser: React.Dispatch<
    React.SetStateAction<IProps["loggedInUser"]>
  >;
  minimiseSide: boolean
};

const AthleteDropdown: React.FC<DisplayUserPropHeaders> = ({setDisplayUser, loggedInUser, minimiseSide}) => {
  const [dropdownData, setDropdownData] = useState<AthleteCoach>([]);
  const [selectedAthleteId, setSelectedAthleteId] = useState<number | string>("");
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
  }, [loggedInUser?.id]);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const athleteId = event.target.value;
    setSelectedAthleteId(athleteId); // Set the selected athlete id in state

    setDisplayUser({
      id: Number(athleteId),
      name: '',
      email: '',
      role: "Athlete",
    });
  };

  if (loggedInUser?.role.toUpperCase() === "COACH") {
    return (
      <select className={`bg-gray-50 rounded-sm ml-2 mt-2 mr-1 ${minimiseSide && 'w-20 overflow-hidden whitespace-nowrap text-ellipsis'}`} value={selectedAthleteId} onChange={handleChange}>
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
  } else {
    // If the user is not a coach, just set the display user
    setDisplayUser(loggedInUser);
  }
};

export default AthleteDropdown;
