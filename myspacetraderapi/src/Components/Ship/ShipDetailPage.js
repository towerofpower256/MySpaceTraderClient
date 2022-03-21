import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";
import {  useParams } from "react-router-dom";

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

        const stc = new SpaceTraderClient();
        stc.getShipInfo(params.shipId)
            .then(
                response => {
                    if (!response.ok) {
                        response.text().then(text =>
                            doError(response.status + ", " + text)
                        );


                    } else {
                        response.json().then(
                            data => {
                                try {
                                    console.log("Loading ship data:", data);
                                    setShipData(data);
                                    setLoaded(true);
                                } catch (ex) {
                                    doError(ex);
                                }

                            },
                            error => {
                                doError("Error reading the response payload: " + error);
                            }
                        );
                    }
                },
                error => {
                    doError(error);
                }
            )
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
                            <td>{ship.location}</td>
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
            </Page>
        );
    }
}