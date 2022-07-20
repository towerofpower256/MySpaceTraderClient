import { useEffect, useState } from "react";
import Page from "../Components/Page.js"
import ShipNewFlightPlan from "../Components/Ships/ShipNewFlightPlan";
import { getShipInfo, readResponse } from "../Services/SpaceTraderApi.js";
import { useParams } from "react-router-dom";
import { valOrDefault } from "../Utils.js";

export default function ShipDetailPage(props) {
    let params = useParams();

    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [shipData, setShipData] = useState(null)

    useEffect(() => {
        loadShipData();
    }, []);

    function loadShipData() {
        setLoaded(false);
        setError(null);
        setShipData(null);

        getShipInfo(params.shipId)
            .then(stcResponse => {
                console.log("Loading ship data:", stcResponse);
                setShipData(stcResponse.data);
                setLoaded(true);
            },
                ex => {
                    doError("Error reading the response payload: " + error);
                });
    }

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    let shipName = "";
    if (shipData) {
        shipName = shipData.ship.type;
    }
    let PAGE_NAME = `Ship - ${shipName || ""} - ${params.shipId}`;

    if (!isLoaded) {
        return (
            <Page title={PAGE_NAME}>
                <pre>It's loading</pre>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title={PAGE_NAME}>
                <pre>ERROR: {error}</pre>
            </Page>
        );
    }

    if (shipData) {

        let ship = shipData.ship;

        return (
            <Page title={PAGE_NAME}>
                <table className="table table-striped table-hover">
                    <tbody>
                        <tr>
                            <td>ID</td>
                            <td>{ship.id}</td>
                        </tr>
                        <tr>
                            <td>Ship type</td>
                            <td>{ship.type}</td>
                        </tr>
                        <tr>
                            <td>Location</td>
                            <td>{valOrDefault(ship.location, "(in transit)")}</td>
                        </tr>
                        <tr>
                            <td>Class</td>
                            <td>{ship.class}</td>
                        </tr>
                        <tr>
                            <td>Manufacturer</td>
                            <td>{ship.manufacturer}</td>
                        </tr>
                        <tr>
                            <td>Cargo</td>
                            <td>{ship.spaceAvailable} / {ship.maxCargo}</td>
                        </tr>
                        <tr>
                            <td>Speed / Plating / Weapons</td>
                            <td>{ship.speed} / {ship.plating} / {ship.weapons}</td>
                        </tr>
                    </tbody>
                </table>
                <ShipNewFlightPlan ship={ship} loadShipData={loadShipData}></ShipNewFlightPlan>
            </Page>
        );
    }
}