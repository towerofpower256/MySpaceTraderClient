import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import { getShipMarket, readResponse } from "../../Services/SpaceTraderApi.js";
import { prettyNumber } from "../../Utils.js";

export default function ShipMarketPage(props) {
    const PAGE_NAME = "Buy a new ship";
    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [shipsData, setShipsData] = useState(null)

    useEffect(() => {
        loadAvailableShips();
    }, []);

    function loadAvailableShips() {
        setLoaded(false);
        setError(null);
        setShipsData(null);

        getShipMarket()
            .then(
                response => {
                    if (!response.ok) {
                        response.text().then(text =>
                            doError(response.status + ", " + text)
                        );
                    } else {
                        readResponse(response)
                            .then(stcResponse => {
                                console.log("Loading ship market data:", stcResponse);
                                setShipsData(stcResponse.data);
                                setLoaded(true);
                            })
                            .catch(ex => {
                                doError("Error reading the response payload: " + error);
                            });
                    }
                },
                (error) => {
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

        let shipItems = shipsData.ships.map((ship, index) => {
            return (
                <ShipMarketItem key={index} ship={ship} />
            );
        });

        return (
            <Page title={PAGE_NAME}>
                <div className="container">
                    <div className="row">
                        {shipItems}
                    </div>
                </div>
            </Page>
        );
    }
}

function ShipMarketItem(props) {
    let st = props.ship;

    let purchaseLocationItems = st.purchaseLocations.map((pl, index) => {
        return (
            <tr key={index}>
                <td>{pl.system}</td>
                <td>{pl.location}</td>
                <td>{prettyNumber(pl.price)}</td>
                <td><button className="btn btn-info btn-sm" data-ship={st.type} data-location={pl.location} data-price={pl.price} onClick={handleBuyShipClick}>Buy</button></td>
            </tr>
        );
    });

    function handleBuyShipClick(e) {

    }

    return (
        <div className="col-md-6 col-xs-12" style={{ "margin-bottom": "15px" }}>
            <div className="card">
                <div className="card-header">
                    <h4>{st.type}</h4>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <tbody>
                            <tr>
                                <th>Type</th>
                                <td>{st.type}</td>
                                <th>Max cargo</th>
                                <td>{st.maxCargo}</td>
                            </tr>
                            <tr>
                                <th>Manufacturer</th>
                                <td>{st.manufacturer}</td>
                                <th>Cargo loading speed</th>
                                <td>{st.loadingSpeed}</td>
                            </tr>
                            <tr>
                                <th>Class</th>
                                <td>{st.class}</td>
                                <th>Speed</th>
                                <td>{st.speed}</td>
                            </tr>
                            <tr>
                                <th>Plating</th>
                                <td>{st.plating}</td>
                                <th>Weapons</th>
                                <td>{st.weapons}</td>
                            </tr>
                        </tbody>
                    </table>

                    <h4>Purchase locations</h4>
                    <table className="table table-striped table-hover table-sm">
                        <thead>
                            <tr>
                                <td>System</td>
                                <td>Location</td>
                                <td>Price</td>
                                <td></td>
                            </tr>
                        </thead>
                        <tbody>
                            {purchaseLocationItems}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}