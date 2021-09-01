import Page from "./Page.js"

import {
    useLocation
} from "react-router-dom";

export default function UnknownPage() {
    let location = useLocation();

    return (
        <Page title="Unknown page">
            The route <code>{location.pathname}</code> is not a valid route.
        </Page>
    );
}