import { useContext, useState } from "react"
import { toast } from "react-toastify";
import { setAuthToken, setUserName } from "../Services/LocalStorage";
import { getPlayerInfo, readResponse } from "../Services/SpaceTraderApi";
import LoggedInContext from "../Contexts/LoggedInContext"
import LoggedInUserInfoContext from "../Contexts/LoggedInUserInfoContext";

export default function LoginPage(props) {
    const [loggedInUserInfo, setLoggedInUserInfo] = useContext(LoggedInUserInfoContext)
    const [isLoggedIn, setLoggedIn] = useContext(LoggedInContext);
    const [isSubmitting, setSubmitting] = useState(false);
    const [loginToken, setLoginToken] = useState("");
    const [registerUsername, setRegisterUsername] = useState("");
    const [loginError, setLoginError] = useState("");
    const [registerError, setRegisterError] = useState("");

    function handleLoginTokenChange(e) {
        setLoginError(false);
        setLoginToken(e.target.value);
    }

    function handleRegisterUsernameChange(e) {
        setRegisterUsername = e.target.value;
    }

    function handleRegisterClick(e) {
        e.preventDefault();

        setSubmitting(true);
        try {

        } finally {
            setSubmitting(false);
        }
    }

    function handleLoginClick(e) {
        e.preventDefault();

        setSubmitting(true);
        setAuthToken(loginToken);
        getPlayerInfo()
            .then(
                stcResponse => {
                    if (!stcResponse.ok) {
                        doLoginError(stcResponse.errorPretty);
                    } else {
                        // Successful login
                        setUserName(stcResponse.data.username);
                        setLoggedInUserInfo(stcResponse.data.user);
                        setLoggedIn(true);
                        toast.success("Logged in: " + loggedInUserInfo.username);
                        // Shouldn't need to set submitting to false, 
                        // because the user should be automatically redirected away from the login page.
                    }
                },
                error => {
                    doLoginError(error)
                }

            );
    }

    function doLoginError(error) {
        console.error("Login error: ", error);
        setLoginError(error);
        setSubmitting(false);
    }

    if (isLoggedIn) {
        return (
            <div>
                You are already logged in. Why are you at the login page?
            </div>
        )
    }

    return (
        <div className="column row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h3>Login to existing user</h3>
                    </div>
                    <div className="card-body">
                        <form>
                            <div>
                                <label htmlFor="loginToken" className="form-label">Token</label>
                                <input type="password" className="form-control" id="loginToken" disabled={isSubmitting} onChange={handleLoginTokenChange} />
                                <button type="submit" className="btn btn-primary" onClick={handleLoginClick} disabled={isSubmitting}>Log in</button>
                                <div id="loginError" className="form-text text-danger">{loginError}</div>
                            </div>
                        </form>
                    </div>

                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header">
                        <h3>Register new user</h3>
                    </div>
                    <div className="card-body"></div>
                    <form>
                        <div>
                            <label htmlFor="registerUsername" className="form-label">Label</label>
                            <input type="text" className="form-control" id="registerUsername" disabled={isSubmitting} onChange={handleLoginTokenChange} />
                            <button type="submit" className="btn btn-warning" onClick={handleRegisterClick} disabled={isSubmitting}>Create username</button>
                            <div id="registerError" className="form-text text-danger">{registerError}</div>
                        </div>

                    </form>
                </div>
            </div>
        </div >
    )
}

