import { useState, useContext } from "react";
import { prettyNumber, getShipFuelCount, sortAlphabetically, getShipCargoCount, insertOrUpdate } from "../../Utils";
import PlayerShipsContext from "../../Contexts/PlayerShipsContext";
import PlayerInfoContext from "../../Contexts/PlayerInfoContext";
import MarketDataContext from "../../Contexts/MarketDataContext";
import SystemsContext from "../../Contexts/SystemsContext";
import { toast } from "react-toastify";
import { placeBuySellOrder } from "../../Services/SpaceTraderApi"

import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Spinner from 'react-bootstrap/Spinner';
import ListGroup from 'react-bootstrap/ListGroup';
import MyPageTitle from "../MyPageTitle";
import MyPageSubTitle from "../MyPageSubTitle";

import MarketTradeFormLocationSelect from "./MarketTradeFormLocationSelect";
import MarketTradeFormShipSelect from "./MarketTradeFormShipSelect";
import MarketTradeFormGoodSelect from "./MarketTradeFormGoodSelect";


export default function MarketTradeForm(props) {
    const [marketData, setMarketData] = useContext(MarketDataContext);
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);
    const [systems, setSystems] = useContext(SystemsContext);

    const [selectedShip, setSelectedShip] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedGood, setSelectedGood] = useState(null);
    const [subForm, setSubForm] = useState(null);
    const [tradeValue, setTradeValue] = useState(false);

    function closeSubForm() {
        setSubForm(null);
    }

    let _locationID = props.locationID;
    let _shipID = props.shipID;
    let _goodID = props.goodID;

    if (!selectedShip && Array.isArray(playerShips) && _shipID) {
        let ship = playerShips.find((s) => s.id === _shipID);
        setSelectedShip({ ...ship });
    }

    if (!selectedLocation && Array.isArray(systems.all_locations) && _locationID) {
        let location = systems.all_locations.find((l) => l.symbol === _locationID);
        setSelectedLocation({ ...location });
    }

    if (!selectedGood && selectedLocation && _goodID) {
        let _locMd = marketData.find((md) => md.location == selectedLocation.symbol);
        if (_locMd && Array.isArray(_locMd.goods)) {
            let _good = _locMd.goods.find((md) => md.symbol === _goodID);
            if (_good) {
                setSelectedGood(_good);
            }
        }

    }

    // The form itself
    if (subForm === "location") {
        return (
            <MarketTradeFormLocationSelect
                selectedShip={selectedShip} setSelectedShip={setSelectedShip}
                selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
                selectedGood={selectedGood} setSelectedGood={setSelectedGood}
                closeSubForm={closeSubForm}
            />
        )
    }
    if (subForm === "ship") {
        return (
            <MarketTradeFormShipSelect
                selectedShip={selectedShip} setSelectedShip={setSelectedShip}
                selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
                selectedGood={selectedGood} setSelectedGood={setSelectedGood}
                closeSubForm={closeSubForm}
            />
        )
    }
    if (subForm === "good") {
        return (
            <MarketTradeFormGoodSelect
                selectedShip={selectedShip} setSelectedShip={setSelectedShip}
                selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
                selectedGood={selectedGood} setSelectedGood={setSelectedGood}
                closeSubForm={closeSubForm}
            />
        )
    }

    return (
        <MarketTradeFormMainForm
            selectedShip={selectedShip} setSelectedShip={setSelectedShip}
            selectedLocation={selectedLocation} setSelectedLocation={setSelectedLocation}
            selectedGood={selectedGood} setSelectedGood={setSelectedGood}
            setSubForm={setSubForm} closeForm={props.closeForm}
        />
    )

}

function MarketTradeFormMainForm(props) {
    const location = props.selectedLocation;
    const ship = props.selectedShip;
    const good = props.selectedGood;

    const [ships, setShips] = useContext(PlayerShipsContext);
    const [playerInfo, setPlayerInfo] = useContext(PlayerInfoContext);

    const [tradeAmount, setTradeAmount] = useState(0);

    const [isWorking, setWorking] = useState(false);
    const [tradeAction, _setTradeAction] = useState(props.tradeAction);

    function setTradeAction(a) {
        _setTradeAction(a);
    }

    function handleTradeClick(e) {
        if (isWorking) return;

        setWorking(true);
        placeBuySellOrder(tradeAction, ship.id, good.symbol, tradeAmount)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error making trade: " + stcResponse.errorPretty);
                    return;
                }

                // Trade successful
                let od = stcResponse.data.order;
                if (od) {
                    toast.success("Traded " + prettyNumber(od.quantity) + "x " + od.good + " for $" + prettyNumber(od.total) + " at $" + prettyNumber(od.pricePerUnit) + "/unit");

                    // Update contexts with response data
                    playerInfo.credits = od.credits;
                    
                    if (stcResponse.data.ship) {
                        insertOrUpdate(ships, stcResponse.data.ship, (_ship) => ship.id === stcResponse.data.ship.id) ;
                    }
                } else {
                    toast.warning("Trade completed, but response was missing trade info");
                }

                if (props.closeForm) props.closeForm();
            })
            .catch(error => {
                toast.error("Error making trade: " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }


    /*
    if (good) {
        if (tradeAction === "buy") {
            setMaxTradeAmount(good.quantityAvailable);
        }
        if (tradeAction === "sell") {
            // TODO set max to amount in ship cargo
            setMaxTradeAmount(999999);
        }
    }
    */

    let tradeBtnText = "Unknown trade action";
    let tradeBtnEnabled = false;
    let tradeValue = 0;
    let tradeAmountMax = 0;

    if (good && tradeAction) {
        if (tradeAction === "buy") {
            tradeValue = tradeAmount * good.purchasePricePerUnit;
            tradeBtnText = "Buy for $" + prettyNumber(tradeValue);
        }
        if (tradeAction === "sell") {
            tradeValue = tradeAmount * good.sellPricePerUnit;
            tradeBtnText = "Sell for $" + prettyNumber(tradeValue);
        }

        if (ship) {
            if (ship && tradeAction === "buy") {
                tradeAmountMax = good.quantityAvailable;
            }

            if (ship && tradeAction === "sell") {
                tradeAmountMax = getShipCargoCount(ship, good.symbol);
            }
        }
    }

    if (!isWorking && (tradeAction === "buy" || tradeAction === "sell") && tradeAmount > 0) {
        tradeBtnEnabled = true;
    }

    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text id="trade-location">
                    Location
                </InputGroup.Text>
                <Button variant={location ? "secondary" : "primary"} onClick={() => props.setSubForm("location")} className="text-start">
                    {location
                        ? "" + location.symbol + " (" + location.name + ")"
                        : "Select location..."}
                </Button>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="trade-ship">
                    Ship
                </InputGroup.Text>
                <Button variant={ship ? "secondary" : "primary"} onClick={() => props.setSubForm("ship")} className="text-start">
                    {ship
                        ?
                        <div>
                            <div>{ship.type}</div>
                            <div className="fw-lighter">
                                Cargo: ({prettyNumber(ship.spaceAvailable)}/{prettyNumber(ship.maxCargo)}) Fuel: {prettyNumber(getShipFuelCount(ship))}
                            </div>
                        </div>

                        : "Select ship..."}
                </Button>
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="trade-good">
                    Good
                </InputGroup.Text>
                <Button variant={good ? "secondary" : "primary"}
                    onClick={() => props.setSubForm("good")} className="text-start">
                    {good ? good.symbol : "Select good to trade..."}
                </Button>
            </InputGroup>

            {location && ship && good ? (
                <div>
                    <hr />
                    <div className="mb-3">
                        <div>Qty on market: {prettyNumber(good.quantityAvailable)}</div>
                        <div>Qty in cargo: {prettyNumber(getShipCargoCount(ship, good.symbol))}</div>
                        <div>Ship load speed: {prettyNumber(ship.loadingSpeed)}</div>
                    </div>
                    <InputGroup className="mb-3">
                        <Button variant={tradeAction === "buy" ? "secondary" : "outline-secondary"}
                            onClick={() => setTradeAction("buy")}>
                            Buy
                        </Button>
                        <Button variant={tradeAction === "sell" ? "secondary" : "outline-secondary"}
                            onClick={() => setTradeAction("sell")}>
                            Sell
                        </Button>
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="trade-amount">
                            Amount
                        </InputGroup.Text>
                        <Form.Control type="number" value={tradeAmount} onChange={(e) => setTradeAmount(e.currentTarget.value)} />
                    </InputGroup>
                    RANGE INPUT WOULD GO HERE
                    <Stack gap={3}>
                        <Button className="w-100" variant="warning" onClick={() => setTradeAmount(tradeAmountMax)}>Set max</Button>
                        <Button className="w-100" variant="primary" disabled={!tradeBtnEnabled} onClick={handleTradeClick}>
                            <Spinner size="sm" animation="border" role="status" hidden={!isWorking}>
                                <span className="visually-hidden">Working...</span>
                            </Spinner>
                            <span>{tradeBtnText}</span>
                        </Button>
                    </Stack>
                </div>
            ) : ""}

        </div>
    )
}