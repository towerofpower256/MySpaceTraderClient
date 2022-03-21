import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";
import { Link } from "react-router-dom";

export default function ShipListPage(props) {
    const PAGE_NAME = "Ship list";
    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [shipsData, setShipsData] = useState(null)

    useEffect(() => {
        loadShipList();
    }, []);

    function loadShipList() {
        setLoaded(false);
        setError(null);
        setShipsData(null);

        const stc = new SpaceTraderClient();
        stc.getShips()
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
                                    console.log("Loading ships data:", data);
                                    setShipsData(data);
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

    if (shipsData) {

        return (
            <Page title={PAGE_NAME}>
                <table className="table table-striped table-hover">
                    <thead>
                        <tr>
                            <td>ID</td>
                            <td>Ship type</td>
                            <td>Location</td>
                            <td>Class</td>
                            <td>Manufacturer</td>
                            <td>Cargo</td>
                            <td>S / P / W</td>
                        </tr>
                    </thead>
                    <tbody>
                        {shipsData.ships.map((ship, index) => {
                            return (
                                <tr key={ship.id}>
                                    <td><Link to={ship.id}>{ship.id}</Link></td>
                                    <td>{ship.type}</td>
                                    <td>{ship.location}</td>
                                    <td>{ship.class}</td>
                                    <td>{ship.manufacturer}</td>
                                    <td>{ship.spaceAvailable} / {ship.maxCargo}</td>
                                    <td>{ship.speed} / {ship.plating} / {ship.weapons}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Page>
        )
    }
}