import { useState, useEffect } from "react";

import LoggedInUserInfoContext from "./Components/Contexts/LoggedInUserInfoContext";
import LoggedInContext from "./Components/Contexts/LoggedInContext";
import { getAuthToken } from "./Services/LocalStorage";

export default function ContextContainer(props) {
    const [isLoggedIn, setLoggedIn] = useState(!!getAuthToken()); // User is considered logged in if there's an auth token in storage
    const [isGameLoading, setGameLoading] = useState(false);
    
    // Setup contexts
    const [loggedInUserInfo, setLoggedInUserInfo] = useState({});

    useEffect(() => {
        if (!isLoggedIn) {
            // If the user isn't logged in, don't do or load anything
            return;
        }
        // remember logged in user
    }, [isLoggedIn, isGameLoaded]);

    // Load global game data, like ship types
    function loadGameData() {
        
    }

    return (
        <LoggedInUserInfoContext.Provider value={[loggedInUserInfo, setLoggedInUserInfo]}>
            <LoggedInContext.Provider value={[isLoggedIn, setLoggedIn]}>
                {props.children}
            </LoggedInContext.Provider>
        </LoggedInUserInfoContext.Provider>
    )
}