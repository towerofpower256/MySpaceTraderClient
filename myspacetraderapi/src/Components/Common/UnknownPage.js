import React from 'react';

import {
    useLocation
} from "react-router-dom";

export default function UnknownPage() {
    let location = useLocation();

    return (
        <div>
            The route <code>{location.pathname}</code> is not a valid route.
        </div>
    );
}