import { useState, useEffect } from "react";

import LoggedInUserInfoContext from "./Components/Contexts/LoggedInUserInfoContext";
import LoggedInContext from "./Components/Contexts/LoggedInContext";

export default function ContextContainer(props) {
    // Setup contexts
    const [isLoggedIn, setLoggedIn] = useState(false);
    const [loggedInUserInfo, setLoggedInUserInfo] = useState({});



    return (
        <LoggedInUserInfoContext.Provider value={[loggedInUserInfo, setLoggedInUserInfo]}>
            <LoggedInContext value={[isLoggedIn, setLoggedIn]}>
                {props.children}
            </LoggedInContext>
        </LoggedInUserInfoContext.Provider>
    )
}