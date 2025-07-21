import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CustomCalendar from './components/Calendar';
import Login from './pages/Login';
import LoginForm from "./components/LoginForm";

export interface IState {
  loggedInUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  } | null; // loggedInUser can be null initially

  displayUser: {
    id: number;
    name: string;
    email: string;
    role: string;
  };

  login: {
    email: string;
    password: string;
  };

  register: {
    name: string;
    email: string;
    password: string;
    plan_length: number;
    selected_coach: number;
    role: string;
    start_date: string;
  };
}

const App: React.FC = () => {
  const [loggedInUser, setLoggedInUser] = useState<IState['loggedInUser']>(null);  // initialized to null
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    if (userId !== null) {
      console.log("Fetching UserId");

      const fetchUserData = async () => {
        try {
          console.log(`loggedInUserID ${userId}`)
          const res = await fetch(`http://localhost:3000/api/users?userId=${userId}`);
          const data = await res.json();

          if (data) {
            setLoggedInUser(data[0]);
            console.log(loggedInUser?.name)
          }
        } catch (error) {
          console.error("Error fetching user details:", error);
        }
      };

      fetchUserData();
    }
  }, [userId]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            loggedInUser !== null ? <CustomCalendar loggedInUser={loggedInUser} /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/login"
          element={
            loggedInUser === null ? <LoginForm setUserId={setUserId} /> : <Navigate to="/" replace />
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
