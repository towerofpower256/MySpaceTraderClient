import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../Components/Page";
import { getLocationInfo } from "../Services/SpaceTraderApi";


export default function LocationPage(props) {
    const params = useParams();

    const [error, setError] = useState(null);
    const [isLoaded, setLoaded] = useState(false);
    const [locationInfo, setLocationInfo] = useState({});

    useEffect(() => {
        getLocationData();
    }, []);

    function getLocationData() {
        if (!params.locationid) {
            let err = "locationid is empty";
            setError(err);
            setLoaded(true);
            console.error(err);
            return;
        }

        setLoaded(false);
        setError(null);
        setLocationInfo({});

        getLocationInfo()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    doError(stcResponse.errorPretty);
                } else {
                    setLocationInfo(stcResponse.data.location);
                    setLoaded(true);
                }
            })
            .catch(error => {
                doError(error);
            })
    }

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    if (!isLoaded) {
        return (
            <Page title="Systems">
                <pre>It's loading</pre>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title="Systems">
                <pre>ERROR: {error}</pre>
            </Page>
        );
    }

    return (
        <div data-id={locationInfo.symbol} className="col row">
            <div className="col-md-6">
                <LocationPageInfo location={locationInfo} />
            </div>
        </div>
    )
}

function LocationPageInfo(props) {
    const l = props.location;

    return (
        <table className="table table-striped table-hover table-sm">
            <tbody>
                <tr>
                    <th>ID</th>
                    <td>{l.symbol}</td>
                </tr>
                <tr>
                    <th>Name</th>
                    <td>{l.name}</td>
                </tr>
                <tr>
                    <th>Type</th>
                    <td>{l.type}</td>
                </tr>
                <tr>
                    <th>Location</th>
                    <td>X {l.x}, Y {l.y}</td>
                </tr>
                <tr>
                    <th>Construction allowed</th>
                    <td>{l.allowsConstruction}</td>
                </tr>
                <tr>
                    <th>Traits</th>
                    <td>{l.traits.join(", ")}</td>
                </tr>
                <tr>
                    <th>Docked ships</th>
                    <td>{l.docketShips}</td>
                </tr>
            </tbody>
        </table>
    )
}