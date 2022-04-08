import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Page from "../Components/Page.js"
import { getAllSystems, readResponse } from "../Services/SpaceTraderApi.js";

export default function AllSystemsPage(props) {


    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [data, setData] = useState([]) // Create new state variable for user info data

    useEffect(() => {
        getSystemData();
    }, []);

    function getSystemData() {
        setLoaded(false);
        setError(null);

        getAllSystems()
            .then(stcResponse => {
                console.log("AllSystemsPage StcResponse ", stcResponse);
                if (!stcResponse.ok) {
                    doError(stcResponse.errorPretty);
                } else {
                    setData(stcResponse.data);
                    setLoaded(true);
                }
            })
            .catch(error => {
                doError(error);
            });
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

    if (!data) {
        return (
            <div>No data</div>
        );
    } else {
        const systems = data.systems.map((s, index) => {
            return (
                <div className="col-md-6" key={index}>
                    <SystemCard system={s} />
                </div>
            );
        });

        return (
            <Page title="Systems">
                <div className="col row">
                    {systems}
                </div>
            </Page>
        )
    }
}

function SystemCard(props) {
    const s = props.system;
    const ls = s.locations.map((l, index) => {
        return (
            <tr key={index}>
                <th><Link to={"/location/"+l.symbol}>{l.symbol}</Link></th>
                <td>{l.name}</td>
                <td>{l.type}</td>
                <td>X: {l.x}, Y: {l.y}</td>
            </tr>
        );
    });


    return (
        <div className="card">
            <div className="card-header">
                <h3>({s.symbol}) {s.name}</h3>
            </div>
            <div className="card-body">
                <table className="table table-striped table-hover">
                    <tbody>
                        {ls}
                    </tbody>
                </table>
            </div>
        </div>
    )
}