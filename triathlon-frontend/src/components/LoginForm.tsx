import { useEffect, useState } from "react"
import type {IState as IProps} from '../App'

type loginProps = {
    /* setLoginUserDetails: React.Dispatch<React.SetStateAction<IProps['login']>>,
    setRegistrationDetails: React.Dispatch<React.SetStateAction<IProps['register']>> */
}

type Coaches = {
    id: number,
    name: string
}[];

const LoginForm: React.FC<loginProps> = ({}) => {
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        planLength: '',
        password: '',
        selectedCoach: ''
    })
    const [userDetailsEntered, setUserDetailsEntered] = useState<IProps['login']>(
        {
            email: '',
            password: ''
        }
    );
    const [registerUserDetails, setRegisterUserDetails] = useState<IProps['register']>({
        name: '',
        email: '',
        password: '',
        planLength: -1,
        selectedCoach: -1,
        role: 'Athlete'
    });

    const validation = () => {
         const newErrors = { name: '', email: '', planLength: '', password: '', selectedCoach: '' };

    {registerUserDetails.name.trim() === '' && (newErrors.name = 'Name cannot be blank')}
    {registerUserDetails.email.trim() === '' && (newErrors.email = 'Email cannot be blank')}
    {registerUserDetails.planLength === -1 && (newErrors.planLength = 'Selection of Plan Length required')}
    {registerUserDetails.selectedCoach === -1 && (newErrors.selectedCoach = 'Selection of Plan Length required')}
    {registerUserDetails.password === '' && (newErrors.password = 'Password required')}
    

    setErrors(newErrors);
    }

    const [dropdownData, setDropdownData] = useState<Coaches>([]);

    const [displayLoginForm, setDisplayLoginForm] = useState<boolean>(false);

    const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
        

        event.preventDefault;
        /* {displayLoginForm ? (setLoginUserDetails({
            email: userDetailsEntered.email,
            password: userDetailsEntered.password
        })) : ( console.log("nill")
        )} */

        if (displayLoginForm)
        {
            console.log(userDetailsEntered);
             const response = await fetch(
                `http://localhost:3000/api/login-user`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(userDetailsEntered)
                }
            );

            const data = await response.json();
            console.log(data);
        }

        else{
            validation();
            const response = await fetch(
                `http://localhost:3000/api/register-user`,
                {
                    method: "POST",
                    headers: { "Content-type": "application/json" },
                    body: JSON.stringify(registerUserDetails)
                }
            );

            const data = await response.json();
            console.log(data);
        }
    }
    const [passwordMatching, setPasswordMacthing] = useState<boolean>(true);
    const [retypePassword, setRetypePassword] = useState<string>('');

    useEffect(() => {
        const fetchCoachData = async () => {
            try {
                const res = await fetch(`http://localhost:3000/api/coaches`);

                const data = await res.json();
                console.log(data)
                if (data.length > 0) {
                    //set dropdowndata
                    setDropdownData(data);
                }
            }

            catch (error) {
                console.error("Error fetching coaches: ", error)
            };
        }

        fetchCoachData();
    }, []);

    const changeForm = () => {
        setUserDetailsEntered({
            email: '',
            password: ''
        })

        setRegisterUserDetails({
            name: '',
            email: '',
            password: '',
            planLength: -1,
            selectedCoach: -1,
            role: 'Athlete'
        })

        setDisplayLoginForm(prev => !prev)

    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const {name, value} = event.target;

        if (displayLoginForm) {
        setUserDetailsEntered((prevState) => {
            return ({
                ...prevState,
                [name]: value
             })
            })
        }
        else {
            if (name === 'retypePassword')
            {
                setRetypePassword(value);
                {value === registerUserDetails.password ? setPasswordMacthing(true) : setPasswordMacthing(false)}
            }
            else {setRegisterUserDetails((prevState) => {
            return ({
                ...prevState,
                [name]: name === 'planLength' || name === 'selectedCoach' ? Number(value) : value
                
             })
            })
        }
        }
    }

    return(
        <>
            <div className="flex justify-center items-center min-h-screen">
                <div className="border-2 border-amber-300 p-4">
                    <h2 className="text-white m-2 p-1 align items-center">Login</h2>
                    {!displayLoginForm && <input type="text" placeholder="Full Name" onChange={handleChange} name="name" value={registerUserDetails.name} className="bg-white block m-2 p-1 rounded-md" />}
                    {errors.name && <label className='ml-2 text-red-500'>{errors.name}</label>}
                    <input type="text" placeholder="Email" onChange={handleChange} name="email" value={displayLoginForm ? userDetailsEntered.email : registerUserDetails.email} className="bg-white block m-2 p-1 rounded-md"/>
                    {errors.email && <label className='ml-2 text-red-500'>{errors.email}</label>}
                    <input type="password" placeholder="Type Password" onChange={handleChange} name="password" value={displayLoginForm ? userDetailsEntered.password : registerUserDetails.password} className="bg-white block m-2 p-1 rounded-md" />
                    {errors.password && <label className='ml-2 text-red-500'>{errors.password}</label>}
                    {!displayLoginForm && <input type="password" placeholder="Retype Password" onChange={handleChange} name="retypePassword" value={retypePassword} className={`bg-white block m-2 p-1 rounded-md `} readOnly={registerUserDetails.password === ''} />}
                    {!passwordMatching && <label className="text-red-500 ml-2">Password is not matching</label>}
                    {!displayLoginForm && 
                    <select name="planLength" className="bg-white m-2 p-1 rounded-md block" value={registerUserDetails.planLength} onChange={handleChange}>
                        <option disabled value={-1}>Training Plan Length</option>
                        <option value={4}>4</option>
                        <option value={8}>8</option>
                        <option value={12}>12</option>
                    </select>}
                    {errors.planLength && <label className='ml-2 text-red-500'>{errors.planLength}</label>}
                    {!displayLoginForm && 
                    <select className="bg-white m-2 p-1 rounded-md block" name="selectedCoach" value={registerUserDetails.selectedCoach} onChange={handleChange}>
                        <option disabled value={-1}>Select Coach</option>
                        {dropdownData.map((d) => (
                            <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                    </select>}
                    {errors.selectedCoach && <label className='ml-2 text-red-500'>{errors.selectedCoach}</label>}
                    <button onClick={handleSubmit} className="bg-green-600 text-lg p-2 text-gray-900 rounded-lg font-medium block m-2 cursor-pointer">Submit</button>
                    {displayLoginForm ? <label className="m-2 p-1 text-white">No account? <span className="text-blue-700 underline cursor-pointer" onClick={() => changeForm()}>Register here</span></label> : <label className="m-2 p-1 text-white">Already Registered <span className="text-blue-700 underline cursor-pointer" onClick={() => changeForm()}>Login here</span></label>}
                </div>
            </div>
        </>
    )
}

export default LoginForm

