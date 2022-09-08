import { useEffect, useState } from "react";
import MarketHeader from "./Components/MarketHeader.js";
import MyPageSubTitle from "../Components/MyPageSubTitle.js";
import MyPageTitle from "../Components/MyPageTitle.js"
import { getShipMarket, buyNewShip } from "../Services/SpaceTraderApi.js";
import prettyNumber from "../Utils/prettyNumber.js";
import { loadPlayerShipsData, savePlayerShipsData } from "../Services/LocalStorage.js";
import insertOrUpdate from "../Utils/insertOrUpdate.js";
import { toast } from "react-toastify";
import Button from "react-bootstrap/esm/Button.js";

export default function ShipMarketPage(props) {
    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [shipsData, setShipsData] = useState(null);

    useEffect(() => {
        loadAvailableShips();
    }, []);

    function loadAvailableShips() {
        setLoaded(false);
        setError(null);
        setShipsData(null);

        getShipMarket()
            .then(stcResponse => {
                console.log("Loading ship market data:", stcResponse);
                setShipsData(stcResponse.data);
                setLoaded(true);
            })
            .catch(ex => {
                doError("Error reading the response payload: " + error);
            });
    }

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    function PageWrapper(props) {
        return (
            <div>
                <MarketHeader />
                <MyPageSubTitle>Ship Market</MyPageSubTitle>
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

    if (shipsData) {

        let shipItems = shipsData.ships.map((ship, index) => {
            return (
                <ShipMarketItem key={index} ship={ship} />
            );
        });

        return (
            <PageWrapper>
                <div className="container">
                    <div className="row">
                        {shipItems}
                    </div>
                </div>
            </PageWrapper>
        );
    }
}

function ShipMarketItem(props) {
    const [isWorking, setWorking] = useState(false);

    let st = props.ship;

    let purchaseLocationItems = st.purchaseLocations.map((pl, index) => {
        return (
            <tr key={index}>
                <td>{pl.system}</td>
                <td>{pl.location}</td>
                <td>{prettyNumber(pl.price)}</td>
                <td>
                    <Button size="sm" variant="info" disabled={isWorking}
                        data-ship={st.type} data-location={pl.location} data-price={pl.price}
                        onClick={handleBuyShipClick}
                    >Buy</Button>
                </td>
            </tr>
        );
    });

    function handleBuyShipClick(e) {
        purchaseShip(e.target.dataset.location, e.target.dataset.ship);
    }

    function purchaseShip(location, shipType) {
        if (isWorking) return;

        buyNewShip(location, shipType)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error(stcResponse.errorPretty);
                    return;
                }

                // TODO update player credits
                //const credits = stcResponse.data.credits

                const newShip = stcResponse.data.ship;
                if (newShip) {
                    savePlayerShipsData(insertOrUpdate(loadPlayerShipsData(), newShip, (ship) => ship.id === newShip.id));
                    toast.success("Purchased new ship: " + newShip.type);
                } else {
                    toast.warn("Purchase was successful, but ship details were missing from the response");
                }
            })
            .finally(() => {
                setWorking(false);
            })
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