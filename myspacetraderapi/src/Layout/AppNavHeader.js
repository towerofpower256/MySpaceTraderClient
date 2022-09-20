import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Form from 'react-bootstrap/Form';
import { FaUserCircle, FaGithub } from "react-icons/fa";
import { CgWebsite } from "react-icons/cg";

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
        <div>
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

                        <Navbar.Text className="me-3">
                            <SyncButton />
                        </Navbar.Text>

                        <Navbar.Text>
                            <div className="w-100 text-end">
                                <span className="text-center fw-light align-middle">
                                    <span className="me-2">By David McDonald</span>
                                    <a href="https://github.com/towerofpower256/MySpaceTraderClient" target="_blank"><FaGithub className="me-2" /></a>
                                    <a href="https://davidmac.pro" target="_blank"><CgWebsite /></a>
                                </span>
                            </div>
                            <AppNavPlayer />
                        </Navbar.Text>
                    </Navbar.Collapse>
                </Container>

            </Navbar>
        </div>

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

    function setAutoSync(a) {
        const _appSettings = { ...appSettings };
        _appSettings[SETTING_AUTO_REFRESH_ENABLED] = Boolean(a);
        setAppSettings(_appSettings);
    }

    return (
        <div className="w-100 text-end">
            <Form.Check
                className="d-inline-block"
                type="switch" id="autosync-toggle"
                label={"Auto sync " + (syncEnabled ? "on" : "off")}
                checked={syncEnabled}
                onChange={() => setAutoSync(!syncEnabled)} />
        </div>
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
                    <Dropdown.Item disabled>
                        <div className="fw-bold">Username</div>
                        <div>{playerInfo.username}</div>
                    </Dropdown.Item>
                    <Dropdown.Item disabled>
                        <div className="fw-bold">Joined</div>
                        <Timestamp value={playerInfo.joinedAt} />
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={() => { setShowMenu(false); navigate("/logout") }}>Logout</Dropdown.Item>
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

    function handleClick(e) {
        e.preventDefault();
        setRevealToken(!revealToken);
    }

    return (
        <div onClick={handleClick}>
            {
                revealToken ?
                    <div className="overflow-auto"><pre>{getAuthToken()}</pre></div>
                    :
                    "Click to reveal user token"
            }
        </div>
    )
}