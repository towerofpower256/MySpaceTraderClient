import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import { FaUserCircle } from "react-icons/fa";

import { useContext, useState } from 'react';
import { NavLink, useNavigate } from "react-router-dom";
import isAutoRefreshEnabled from '../Utils/isAutoRefreshEnabled';
import { SETTING_AUTO_REFRESH_ENABLED } from "../Constants"
import { getAuthToken } from "../Services/LocalStorage";

import PlayerInfoContext from '../Contexts/PlayerInfoContext';
import AppSettingsContext from '../Contexts/AppSettingsContext';
import LoggedInContext from '../Contexts/LoggedInContext';

import Timestamp from "../Components/Timestamp";
import prettyNumber from "../Utils/prettyNumber";
import valOrDefault from "../Utils/valOrDefault";
import Button from 'react-bootstrap/esm/Button';

export default function AppNavHeader(props) {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="/">
                    MySpaceTraderClient
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={NavLink} to="/game">Game</Nav.Link>
                        <Nav.Link as={NavLink} to="/player">Player</Nav.Link>
                        <Nav.Link as={NavLink} to="/command">Command</Nav.Link>
                        <Nav.Link as={NavLink} to="/market/">Market</Nav.Link>
                        <Nav.Link as={NavLink} to="/history">History</Nav.Link>
                        <NavDropdown title="Help" id="basic-nav-dropdown-help">
                            <NavDropdown.Item as={NavLink} to="/help">Help</NavDropdown.Item>
                            <NavDropdown.Item as={NavLink} to="/help/types">Types</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    <Navbar.Text>
                        <SyncButton />
                    </Navbar.Text>
                    <Navbar.Text>

                        <AppNavPlayer />
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

function SyncButton(props) {
    const [appSettings, setAppSettings] = useContext(AppSettingsContext);

    const syncEnabled = isAutoRefreshEnabled(appSettings);

    function handleClick(e) {
        const _appSettings = { ...appSettings };
        _appSettings[SETTING_AUTO_REFRESH_ENABLED] = !syncEnabled;
        setAppSettings(_appSettings);
    }

    return (
        <Button className="me-3" variant="outline-secondary"
            onClick={handleClick}>
            <span style={{ "backgroundColor": (syncEnabled ? "green" : "red"), "borderRadius": "50%", "height": "1em", "width": "1em", "display": "inline-block" }}></span>
            Auto sync {syncEnabled ? "on" : "off"}
        </Button>
    )

    return (
        <Button className="me-3" variant={syncEnabled ? "secondary" : "outline-secondary"}
            onClick={handleClick}
        >

        </Button>
    )
}

function AppNavPlayer(props) {
    const [playerInfo, setPlayerinfo] = useContext(PlayerInfoContext);
    const [loggedIn, setLoggedIn] = useContext(LoggedInContext);
    const [showMenu, setShowMenu] = useState(false);
    const navigate = useNavigate();

    let playerCredits = "";
    if (playerInfo) playerCredits = "$" + valOrDefault(prettyNumber(playerInfo.credits), 0);

    if (!loggedIn) {
        return (<div className="d-none">Not logged in</div>);
    }

    return (
        <div className="w-100 text-end">

            <Dropdown autoClose="outside" show={showMenu} onToggle={show => setShowMenu(show)} align="end">
                <Dropdown.Toggle id="nav-player-dropdown" variant="" onClick={() => setShowMenu(true)}>
                    <span id="player-credits" data-credits={playerInfo ? playerInfo.credits : ""} className="me-2">{playerCredits}</span>
                    <FaUserCircle />
                </Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item>
                        <div className="fw-bold">Username</div>
                        <div>{playerInfo.username}</div>
                    </Dropdown.Item>
                    <Dropdown.Item>
                        <div className="fw-bold">Joined</div>
                        <Timestamp value={playerInfo.joinedAt} />
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item>
                        <UserTokenItem />
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => {setShowMenu(false); navigate("/logout")}}>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    )

    return (
        <Dropdown>
            <Dropdown.Toggle id="nav-player-dropdown" variant="secondary">
                <div>
                    <div>{playerInfo.username}</div>
                    <div>{playerCredits}</div>
                </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
                <Dropdown.Item>
                    <Nav.Link as={NavLink} to="/logout">Logout</Nav.Link>
                </Dropdown.Item>
            </Dropdown.Menu>
        </Dropdown>
    )
}

function UserTokenItem(props) {
    const [revealToken, setRevealToken] = useState(false);

    return (
        <div onClick={() => setRevealToken(!revealToken)}>
            {
                revealToken ?
                    <pre>{getAuthToken()}</pre>
                    :
                    "Click to reveal user token"
            }
        </div>
    )
}