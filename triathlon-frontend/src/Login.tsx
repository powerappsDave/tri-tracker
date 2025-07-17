import LoginForm from "./components/LoginForm"
import type { IState as IProps } from "./App"
import React, { useEffect, useState } from "react"

type loginUser = {
    loginDetails: IProps['login']
}

const Login:React.FC<loginUser> = ({loginDetails}) => {
    const [loginUserDetails, setLoginUserDetails] = useState<IProps['login']>({
        email: '',
        password: ''
    });

    const [registerUserDetails, setRegisterUserDetails] = useState<IProps['register']>({
        name: '',
        email: '',
        password: '',
        planLength: -1,
        selectedCoach: -1,
        role: ''
    });

    return(
        
        <>
            <div className="bg-gray-900">
                <LoginForm />
            </div>
        </>
    )
}

export default Login