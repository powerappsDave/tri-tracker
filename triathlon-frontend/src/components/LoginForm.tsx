import { useEffect, useState } from "react";
import type { IState as IProps } from "../App";

export type ILoginProps = {
    setUserId: React.Dispatch<React.SetStateAction<number | null>>
}

type Coaches = {
  id: number;
  name: string;
}[];

const LoginForm: React.FC<ILoginProps> = ({ setUserId }) => {
  const [loginUserDetails, setLoginUserDetails] = useState<IProps['login']>({
    email: '',
    password: ''
  });

  const [registerUserDetails, setRegisterUserDetails] = useState<IProps['register']>({
    name: '',
    email: '',
    password: '',
    plan_length: -1,
    selected_coach: -1,
    role: 'Athlete', // Default role
    start_date: ''
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    plan_length: '',
    password: '',
    selected_coach: '',
    start_date: ''
  });

  const [dropdownData, setDropdownData] = useState<Coaches>([]);
  const [displayLoginForm, setDisplayLoginForm] = useState<boolean>(false);
  const [passwordMatching, setPasswordMacthing] = useState<boolean>(true);
  const [retypePassword, setRetypePassword] = useState<string>('');

  const validateLoginForm = (): boolean => {
    let valid = true;
    const newErrors = { name: '', email: '', plan_length: '', password: '', selected_coach: '', start_date: '' };

    if (loginUserDetails.email.trim() === '') {
      newErrors.email = 'Email cannot be blank';
      valid = false;
    }
    if (loginUserDetails.password.trim() === '') {
      newErrors.password = 'Password is required';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const validateRegisterForm = (): boolean => {
    let valid = true;
    const newErrors = { name: '', email: '', plan_length: '', password: '', selected_coach: '', start_date: '' };

    if (registerUserDetails.name.trim() === '') {
      newErrors.name = 'Name cannot be blank';
      valid = false;
    }
    if (registerUserDetails.email.trim() === '') {
      newErrors.email = 'Email cannot be blank';
      valid = false;
    }
    if (registerUserDetails.password === '') {
      newErrors.password = 'Password required';
      valid = false;
    }
    if (registerUserDetails.role === 'Athlete' && registerUserDetails.plan_length === -1) {
      newErrors.plan_length = 'Selection of Plan Length required';
      valid = false;
    }
    if (registerUserDetails.role === 'Athlete' && registerUserDetails.selected_coach === -1) {
      newErrors.selected_coach = 'Selection of Coach required';
      valid = false;
    }
    if (registerUserDetails.role === 'Athlete' && registerUserDetails.start_date === '') {
      newErrors.start_date = 'Date required';
      valid = false;
    }
    if (registerUserDetails.password !== retypePassword) {
      setPasswordMacthing(false);
      valid = false;
    } else {
      setPasswordMacthing(true);
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
  event.preventDefault();
    console.log("clicked")
  if (displayLoginForm) {
    const isValid = validateLoginForm();
    if (!isValid) return;

    try {
      const response = await fetch(`http://localhost:3000/api/login-user`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(loginUserDetails)
      });

      const data = await response.json();
      if (data?.user?.id) {
        console.log("setting user Id")
        setUserId(data.user.id);
      } else {
        alert("Login failed. Check credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
    }
  } else {
    console.log(registerUserDetails)
    const isValid = validateRegisterForm();
    if (!isValid) return;

    try {
      const response = await fetch(`http://localhost:3000/api/register-user`, {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(registerUserDetails)
      });

      const data = await response.json();
      if (data.success === true) {
        alert("Successful creation of account, login now");
        changeForm();
      } else {
        alert("Account creation failed. Please try again.");
      }
    } catch (err) {
      console.error("Register error:", err);
      alert("There was an error with registration.");
    }
  }
};


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;

    if (displayLoginForm) {
      setLoginUserDetails((prevState) => ({
        ...prevState,
        [name]: value
      }));
    } else {
      if (name === 'retypePassword') {
        setRetypePassword(value);
        setPasswordMacthing(value === registerUserDetails.password);
      } else {
        setRegisterUserDetails((prevState) => ({
          ...prevState,
          [name]: name === 'plan_length' || name === 'selected_coach' ? Number(value) : value
        }));
      }
    }
  };

  const changeForm = () => {
    setLoginUserDetails({
      email: '',
      password: ''
    });

    setRegisterUserDetails({
      name: '',
      email: '',
      password: '',
      plan_length: -1,
      selected_coach: -1,
      role: 'Athlete',
      start_date: ''
    });

    setRetypePassword('');
    setErrors({
      name: '',
      email: '',
      plan_length: '',
      password: '',
      selected_coach: '',
      start_date:''
    });

    setPasswordMacthing(true);
    setDisplayLoginForm(prev => !prev);
  };

  useEffect(() => {
    const fetchCoachData = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/coaches`);
        const data = await res.json();
        if (data.length > 0) {
          setDropdownData(data);
        }
      } catch (error) {
        console.error("Error fetching coaches: ", error);
      }
    };

    fetchCoachData();
  }, []);

  return (
    <div className="bg-gray-900">
    <div className="flex justify-center items-center min-h-screen">
      <div className="border-2 border-amber-300 p-4">
        <h2 className="text-white m-2 p-1 align items-center">Login</h2>

        {!displayLoginForm && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              onChange={handleChange}
              name="name"
              value={registerUserDetails.name}
              className="bg-white block m-2 p-1 rounded-md"
            />
            {errors.name && <label className='ml-2 text-red-500'>{errors.name}</label>}
          </>
        )}

        <input
          type="text"
          placeholder="Email"
          onChange={handleChange}
          name="email"
          value={displayLoginForm ? loginUserDetails.email : registerUserDetails.email}
          className="bg-white block m-2 p-1 rounded-md"
        />
        {errors.email && <label className='ml-2 text-red-500'>{errors.email}</label>}

        <input
          type="password"
          placeholder="Type Password"
          onChange={handleChange}
          name="password"
          value={displayLoginForm ? loginUserDetails.password : registerUserDetails.password}
          className="bg-white block m-2 p-1 rounded-md"
        />
        {errors.password && <label className='ml-2 text-red-500'>{errors.password}</label>}

        {!displayLoginForm && (
          <>
            <input
              type="password"
              placeholder="Retype Password"
              onChange={handleChange}
              name="retypePassword"
              value={retypePassword}
              className="bg-white block m-2 p-1 rounded-md"
              readOnly={registerUserDetails.password === ''}
            />
            {!passwordMatching && <label className="text-red-500 ml-2">Password is not matching</label>}
          </>
        )}

        {/* Role dropdown */}
        {!displayLoginForm && (
          <>
            <select
              name="role"
              value={registerUserDetails.role}
              onChange={handleChange}
              className="bg-white m-2 p-1 rounded-md block"
            >
              <option value="Athlete">Athlete</option>
              <option value="Coach">Coach</option>
            </select>
          </>
        )}

        {/* Plan length and coach selection */}
        {!displayLoginForm && registerUserDetails.role === 'Athlete' && (
          <>
            <select
              name="plan_length"
              className="bg-white m-2 p-1 rounded-md block"
              value={registerUserDetails.plan_length}
              onChange={handleChange}
            >
              <option disabled value={-1}>Training Plan Length</option>
              <option value={4}>4</option>
            </select>
            {errors.plan_length && <label className='ml-2 text-red-500'>{errors.plan_length}</label>}

            <select
              className="bg-white m-2 p-1 rounded-md block"
              name="selected_coach"
              value={registerUserDetails.selected_coach}
              onChange={handleChange}
            >
              <option disabled value={-1}>Select Coach</option>
              {dropdownData.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            {errors.selected_coach && <label className='ml-2 text-red-500'>{errors.selected_coach}</label>}
          </>
        )}

        {/* Start date for the athlete */}
        {!displayLoginForm && registerUserDetails.role === 'Athlete' && (
          <>
            <label>Choose a start date for your training plan:</label>
            <input
              type="date"
              id="startDate"
              name="start_date"
              value={registerUserDetails.start_date}
              onChange={handleChange}
              required
              className="bg-white m-2 p-1 rounded-md block"
            />
            {errors.start_date && <label className="ml-2 text-red-500">{errors.start_date}</label>}
          </>
        )}

        <button
          onClick={handleSubmit}
          className="bg-green-600 text-lg p-2 text-gray-900 rounded-lg font-medium block m-2 cursor-pointer"
        >
          Submit
        </button>

        {displayLoginForm ? (
          <label className="m-2 p-1 text-white">
            No account? <span className="text-blue-700 underline cursor-pointer" onClick={changeForm}>Register here</span>
          </label>
        ) : (
          <label className="m-2 p-1 text-white">
            Already Registered? <span className="text-blue-700 underline cursor-pointer" onClick={changeForm}>Login here</span>
          </label>
        )}
      </div>
    </div>
    </div>
  );
};

export default LoginForm;
