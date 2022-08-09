import { useContext, useEffect, useState } from "react";
import Page from "../Components/Page.js"
import { getShipInfo, readResponse } from "../Services/SpaceTraderApi.js";
import { useParams } from "react-router-dom";
import { prettyNumber, valOrDefault } from "../Utils.js";
import ShipNewFlightPlanForm from "../Components/Ships/ShipNewFlightPlanForm.js";
import PlayerShipsContext from "../Contexts/PlayerShipsContext.js";
import MarketDataContext from "../Contexts/MarketDataContext.js";

function ShipInfo(props) {
    return (
        <table className="table table-striped table-hover table-sm">
            <tbody>
                <tr>
                    <td>ID</td>
                    <td>{props.ship.id}</td>
                </tr>
                <tr>
                    <td>Ship type</td>
                    <td>{props.ship.type}</td>
                </tr>
                <tr>
                    <td>Location</td>
                    <td>{valOrDefault(props.ship.location, "(in transit)")}</td>
                </tr>
                <tr>
                    <td>Class</td>
                    <td>{props.ship.class}</td>
                </tr>
                <tr>
                    <td>Manufacturer</td>
                    <td>{props.ship.manufacturer}</td>
                </tr>
                <tr>
                    <td>Cargo</td>
                    <td>{props.ship.spaceAvailable} / {props.ship.maxCargo}</td>
                </tr>
                <tr>
                    <td>Speed / Plating / Weapons</td>
                    <td>{props.ship.speed} / {props.ship.plating} / {props.ship.weapons}</td>
                </tr>
            </tbody>
        </table>
    );
}

function ShipCargo(props) {
    const cargoItemsHtml = [];
    if (props.ship.cargo || props.ship.cargo.length > 0) {
        props.ship.cargo.forEach((cargo, idx) => {
            cargoItemsHtml.push(
                <tr key={idx}>
                    <td>{cargo.good}</td>
                    <td>{prettyNumber(cargo.quantity)}</td>
                    <td>{prettyNumber(cargo.totalVolume)}</td>
                </tr>
            );
        });
    } else {
        cargoItemsHtml.push(
            <tr>
                <td colSpan="3">Cargo empty</td>
            </tr>
        )
    }

    return (
        <table className="table table-striped table-sm">
            <thead>
                <tr>
                    <td>Cargo</td>
                    <td>Qty</td>
                    <td>Volume</td>
                </tr>
            </thead>
            <tbody>
                {cargoItemsHtml}
            </tbody>
        </table>
    );
}

function ShipMarketplace(props) {
    const [isMarketWorking, setMarketWorking] = useState(false);
    const [marketData, setMarketData] = useContext(MarketDataContext);

    let marketUnavailableMsg;
    const md = marketData.find(md => md.location === props.location);
    const marketItems = (md ? md.goods.sort(md => md.symbol) : []);

    if (marketItems.length === 0) {
        marketUnavailableMsg = "Market unavailable";
    }

    function handleClick(e) {
        if (isMarketWorking) return;

        setMarketWorking(true);
    }

    return (
        <div>
            <table className="table table-striped table-sm">
                <thead>
                    <tr>
                        <td>Good</td>
                        <td>Avail</td>
                        <td>Buy</td>
                        <td>Sell</td>
                    </tr>
                </thead>
                <tbody>
                    {marketItems.map(item => {
                        return (
                            <tr>
                                <td>{item.symbol}</td>
                                <td>{prettyNumber(item.quantityAvailable)}</td>
                                <td>
                                    <button className="btn btn-info btn-sm w-100"
                                        disabled={isMarketWorking}
                                        data-action="buy" data-ship={props.ship.id} data-location={props.location} data-good={item.symbol}
                                        onClick={handleClick}
                                    >${item.purchasePricePerUnit}</button>
                                </td>
                                <td>
                                    <button className="btn btn-warning btn-sm w-100"
                                        disabled={isMarketWorking}
                                        data-action="sell" data-ship={props.ship.id} data-location={props.location} data-good={item.symbol}
                                        onClick={handleClick}
                                    >${item.sellPricePerUnit}</button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
            <div>{marketUnavailableMsg}</div>
        </div>
    )
}

export default function ShipDetailPage(props) {
    let params = useParams();

    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(true)
    const [shipData, setShipData] = useState(null)
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);

    /*
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
    */

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    const ship = playerShips.find(ship => ship.id === params.shipId);


    let shipName = "";
    if (ship) {
        shipName = ship.type;
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

    if (!ship) {
        return (
            <Page title={PAGE_NAME}>
                Unknown ship: {params.shipId}
            </Page>
        )
    }

    if (ship) {

        //let ship = shipData.ship;

        return (
            <Page title={PAGE_NAME}>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6 p-2">
                            <div className="card">
                                <h3>Ship Info</h3>
                                <ShipInfo ship={ship} />
                            </div>
                        </div>
                        <div className="col-md-6 p-2">
                            <div className="card">
                                <h3>Cargo</h3>
                                <ShipCargo ship={ship} />
                            </div>
                        </div>
                        <div className="col-md-6 p-2">
                            <div className="card">
                                <h3>Marketplace - {ship.location}</h3>
                                <ShipMarketplace ship={ship} location={ship.location} />
                            </div>
                        </div>
                    </div>
                </div>

                <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#newFlightPlanModal">New flight plan</button>


                <div className="modal fade" id="newFlightPlanModal" tabIndex="-1" aria-labelledby="newFlightPlanModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="myExampleModalLabel">New flight plan</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <ShipNewFlightPlanForm ship={ship} />
                            </div>
                        </div>
                    </div>
                </div>
            </Page>
        );
    }
}