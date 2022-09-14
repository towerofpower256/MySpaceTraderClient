import { useContext, useState, useEffect } from "react"
import { toast } from "react-toastify";
import { setAuthToken, setUserName } from "../Services/LocalStorage";
import { getPlayerInfo, registerUsername } from "../Services/SpaceTraderApi";
import LoggedInContext from "../Contexts/LoggedInContext"
import LoggedInUserInfoContext from "../Contexts/LoggedInUserInfoContext";
import setPageTitle from "../Utils/setPageTitle";

import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Card from "react-bootstrap/esm/Card";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";

export default function LoginPage(props) {
    const [loggedInUserInfo, setLoggedInUserInfo] = useContext(LoggedInUserInfoContext)
    const [isLoggedIn, setLoggedIn] = useContext(LoggedInContext);
    const [isSubmitting, setSubmitting] = useState(false);
    const [loginToken, _setLoginToken] = useState("");
    const [registerUsernameValue, setRegisterUsernameValue] = useState("");
    const [loginError, setLoginError] = useState("");
    const [registerError, setRegisterError] = useState("");
    const [isWorking, setWorking] = useState(false);


    function handleLoginTokenChange(e) {
        setLoginError(false);
        setLoginToken(e.target.value);
    }

    function setLoginToken(a) {
        setLoginError(false);
        _setLoginToken(a);
    }

    useEffect(() => {
        setPageTitle("Login");
    })

    function handleRegisterClick(e) {
        if (isWorking) return;
        if (!registerUsername || ("" + registerUsername).trim() === "") return;
        e.preventDefault();

        setWorking(true);
        registerUsername(registerUsernameValue)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Failed to register new user. " + stcResponse.errorPretty);
                    return;
                }

                const token = stcResponse.data.token;
                if (!token) {
                    toast.warning("Registration successful, but the response didn't have the new token. What?");
                    return;
                } else {
                    setAuthToken(token);
                    toast.success("New user created. Don't lose your new user token! You can find it under the user menu in the top bar.");
                }

                const userData = stcResponse.data.user;
                if (userData) {
                    setUserName(stcResponse.data.username);
                    setLoggedInUserInfo(stcResponse.data.user);
                    setLoggedIn(true);
                } else {
                    toast.warning("Registration successful, but the response didn't have the details of the new user. What?");
                    return;
                }
            })
            .catch(error => {
                toast.error("Failed to register new user. " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    function handleLoginClick(e) {
        if (isWorking) return;
        e.preventDefault();

        setWorking(true);
        setAuthToken(loginToken);
        getPlayerInfo()
            .then(
                stcResponse => {
                    if (!stcResponse.ok) {
                        if (stcResponse.errorCode === 40101) {
                            doLoginError("Login failed, that token was invalid");
                        } else {
                            doLoginError(stcResponse.errorPretty);
                        }
                    } else {
                        // Successful login
                        setUserName(stcResponse.data.username);
                        setLoggedInUserInfo(stcResponse.data.user);
                        setLoggedIn(true);
                        toast.success("Logged in, welcome captain");
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
        <Container className="mt-3">
            <Row>
                <Col md={6} sm={12}>
                    <Card>
                        <Card.Header>
                            Log into existing user
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Account token</Form.Label>
                                <Form.Control type="text" disabled={isWorking} value={loginToken} onChange={e => setLoginToken(e.currentTarget.value)} />
                            </Form.Group>
                            <Button variant="primary" className="w-100" disabled={isWorking} onClick={handleLoginClick}>
                                Log in
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6} sm={12}>
                    <Card>
                        <Card.Header>
                            Register a new user
                        </Card.Header>
                        <Card.Body>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Username</Form.Label>
                                <Form.Control type="text" disabled={isWorking} value={registerUsernameValue} onChange={e => setRegisterUsernameValue(e.currentTarget.value)} />
                            </Form.Group>
                            <Button variant="primary" className="w-100" disabled={isWorking} onClick={handleRegisterClick}>
                                Claim username
                            </Button>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    )
}

