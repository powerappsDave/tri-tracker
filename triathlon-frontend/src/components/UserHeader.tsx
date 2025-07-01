import { useState, useEffect } from 'react';
import type { IState as IProps } from '../App';

interface IUserProps {
  userId: number; // Define the user prop based on IState
  setUser: React.Dispatch<React.SetStateAction<IProps['loggedInUser']>>; // Make sure setUser is typed correctly
}

const UserHeader: React.FC<IUserProps> = ({ userId, setUser }) => {
  const [userDetails, setUserDetails] = useState<IProps['loggedInUser'] | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/users?userId=${userId}`);
        const data: IProps['loggedInUser'][] = await res.json();

        if (data.length > 0) {
          const userData = data[0];
          setUserDetails(userData); // Set the user details locally
          setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            role: userData.role
          }); // Update the global user state
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [userId, setUser]);

  return (
  <div className="text-white bg-amber-600 pb-4 pt-4">
    <h1 className="text-xl ml-4 font-bold">{userDetails?.role} - {userDetails?.name}</h1>
  </div>) 
};

export default UserHeader;
