import { useContext } from "react";
import { useParams } from "react-router-dom";
import MyPageTitle from "../Components/MyPageTitle";
import getLocationName from "../Utils/getLocationName";
import SystemsContext from "../Contexts/SystemsContext";
import Table from "react-bootstrap/esm/Table";


export default function Locationpage(props) {
    let params = useParams();

    const [systems, setSystems] = useContext(SystemsContext);

    function PageWrapper(props) {
        const locationName = (props.location ? getLocationName(props.location) : "");
        return (
            <div>
                <MyPageTitle>Location - {locationName}</MyPageTitle>
                {props.children}
            </div>
        )
    }

    if (!systems || !Array.isArray(systems.all_locations)) {
        return (
            <PageWrapper>
                No systems data
            </PageWrapper>
        )
    }

    const location = systems.all_locations.find((l) => l.symbol === params.locationid);

    if (!location) {
        return (
            <PageWrapper>
                Unknown location '{params.locationid}';
            </PageWrapper>
        )
    }

    return (
        <PageWrapper location={location}>
            <table>
                <tbody>
                    <tr>
                        <th>Symbol:</th>
                        <td>{location.symbol}</td>
                    </tr>
                    <tr>
                        <th>Name:</th>
                        <td>{location.name}</td>
                    </tr>
                    <tr>
                        <th>Type:</th>
                        <td>{location.type}</td>
                    </tr>
                    <tr>
                        <th>Location</th>
                        <td>X: {location.x}, Y: {location.y}</td>
                    </tr>
                </tbody>
            </table>
        </PageWrapper>
    )
}

/*
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

    function PageWrapper(props) {
        return (
            <div>
                <MyPageTitle>Location {getLocationName(props.location)}</MyPageTitle>
                {props.children}
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <PageWrapper>
                <pre>It's loading</pre>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <pre>ERROR: {error}</pre>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <div data-id={locationInfo.symbol} className="col row">
                <div className="col-md-6">
                    <LocationPageInfo location={locationInfo} />
                </div>
            </div>
        </PageWrapper>
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
                    <td>{l.dockedShips}</td>
                </tr>
            </tbody>
        </table>
    )
}
*/