import { useContext } from "react"
import LoggedInContext from "../Contexts/LoggedInContext"
import LoginPage from "../Pages/LoginPage";

export default function LoginWrapper(props) {
    const [isLoggedIn] = useContext(LoggedInContext);

    if (!isLoggedIn) {
        return (
            <LoginPage />
        )
    }
    
    return props.children;
}