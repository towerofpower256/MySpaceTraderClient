import React from 'react';
import { NavLink } from "react-router-dom";

// <a class="nav-link active" aria-current="page" href="/account">Account</a>

export default function AppNavHeader(props) {
    return (
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="/">MySpaceTraderApi</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <NavLink to="/player" aria-current="page" activeClassName="nav-link active" className="nav-link">Player</NavLink>
                        </li>
                        <li class="nav-item">
                            <NavLink to="/loans" aria-current="page" activeClassName="nav-link active" className="nav-link">Loans</NavLink>
                        </li>
                        <li class="nav-item">
                            <NavLink to="/ships" aria-current="page" activeClassName="nav-link active" className="nav-link">Ships</NavLink>

                        </li>
                    </ul>
                </div>
            </div >
        </nav >
    )
}