import { useContext } from "react"
import LoggedInContext from "../Contexts/LoggedInContext"

export default function LoginPage(props) {
    const [isLoggedIn] = useContext(LoggedInContext);
    const [isSubmitting, setSubmitting] = useState(false);
    const [loginToken, setLoginToken] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [loginError, setLoginError] = useState("");
    
    function handleLoginTokenChange(e) {
        setLoginError(false);
        setLoginToken = e.target.value;
    }

    function handleRegisterUsernameChange(e) {
        setRegisterUsername = e.target.value;
    }

    function handleLoginClick(e) {
        e.preventDefault();

        setSubmitting(true);
        try {

        }
        finally {
            setSubmitting(false);
        }
    }

    function doLogin(userToken) {

    }

    if (isLoggedIn) {
        return (
            <div>
                You are already logged in. Why are you at the login page?
            </div>
        )
    }

    return (
        <form>
            <ul className="list-group">
                <li className="list-group-item active">
                    <h3>Login to existing user</h3>
                    <label htmlFor="loginToken" className="form-label">Token</label>
                    <input type="password" className="form-control" id="loginToken" disabled={isSubmitting} onChange={handleLoginTokenChange}/>
                    <button type="submit" className="btn btn-primary" onClick={handleLoginClick} disabled={isSubmitting}>Log in</button>
                    <div id="loginError" className="form-text text-danger">{loginError}</div>
                </li>
            </ul>
        </form>
    )
}

