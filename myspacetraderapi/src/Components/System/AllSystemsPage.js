import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";

export default function AllSystemsPage(props) {


    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [data, setData] = useState([]) // Create new state variable for user info data

    useEffect(() => {

    }, []);

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    if (!isLoaded) {
        return (
            <Page title="Player info">
                <pre>It's loading</pre>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title="Player info">
                <pre>ERROR: {error}</pre>
            </Page>
        );
    }

    if (!data) {
        return(
            <div>No data</div>
        );
    } else {
        
    }
}