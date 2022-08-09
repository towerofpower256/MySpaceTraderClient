import React, { useContext } from 'react';
import { NavLink } from "react-router-dom";
import PlayerInfoContext from '../Contexts/PlayerInfoContext';
import { prettyNumber, valOrDefault } from '../Utils';

// <a class="nav-link active" aria-current="page" href="/account">Account</a>

export default function AppNavHeader(props) {
    const [playerInfo, setPlayerinfo] = useContext(PlayerInfoContext);

    let playerCredits = "";
    if (playerInfo && playerInfo.credits) playerCredits = "$" + valOrDefault(prettyNumber(playerInfo.credits));

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">MySpaceTraderApi</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <NavLink to="/player" aria-current="page" activeclassname="nav-link active" className="nav-link">Player</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/loans" aria-current="page" activeclassname="nav-link active" className="nav-link">Loans</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/ship" aria-current="page" activeclassname="nav-link active" className="nav-link">Ships</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/shipmarket" aria-current="page" activeclassname="nav-link active" className="nav-link">Ship market</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/systems" aria-current="page" activeclassname="nav-link active" className="nav-link">Systems</NavLink>
                        </li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Dev Tools
                            </a>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                                <li><NavLink to="/tools/context" aria-current="page" activeclassname="nav-link active" className="dropdown-item">App Contexts</NavLink></li>
                                <li><NavLink to="/tools/webcalls" aria-current="page" activeclassname="nav-link active" className="dropdown-item">Web Calls</NavLink></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <NavLink to="/logout" aria-current="page" activeclassname="nav-link active" className="nav-link">Log out</NavLink>
                        </li>

                    </ul>
                    <form className="d-flex">
                        {playerCredits}
                    </form>
                </div>
            </div >
        </nav >
    )
}