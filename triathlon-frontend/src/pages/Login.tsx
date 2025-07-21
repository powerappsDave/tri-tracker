import LoginForm from "../components/LoginForm"

export type ILoginProps = {
    setUserId: React.Dispatch<React.SetStateAction<number | null>>
}

const Login: React.FC<ILoginProps> = ({setUserId}) => {

    return(
        
        <>
            <div className="bg-gray-900">
                <LoginForm setUserId={setUserId} />
            </div>
        </>
    )
}

export default Login