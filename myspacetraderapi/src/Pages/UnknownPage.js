import setPageTitle from "../Utils/setPageTitle";
import MyPageTitle from "../Components/MyPageTitle";
import { useEffect } from "react";

import {
    useLocation
} from "react-router-dom";


export default function UnknownPage() {
    let location = useLocation();

    useEffect(() => {setPageTitle("Unknown page")});

    return (
        <div>
            <MyPageTitle>Unknown page</MyPageTitle>
            The route <code>{location.pathname}</code> is not a valid route.
        </div>
    );
}