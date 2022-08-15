import { useState, useContext } from "react";
import { prettyNumber } from "../Utils";
import PlayerShipsContext from "../Contexts/PlayerShipsContext";
import MarketDataContext from "../Contexts/MarketDataContext";
import SystemsContext from "../Contexts/SystemsContext";
import { toast } from "react-toastify";

import Button from "react-bootstrap/Button";
import Stack from 'react-bootstrap/Stack';
import ListGroup from 'react-bootstrap/ListGroup';
import MyPageSubTitle from "./MyPageSubTitle";

function MarketTradeFormShipSelect(props) {
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);

    function handleClickShip(e) {
        let _ship = playerShips.find((s) => s.id === e.currentTarget.dataset.shipId);
        if (_ship) {
            props.setSelectedShip({ ..._ship });
            props.setTradeAmount(0);
        } else {
            toast.error("Invalid ship selection");
        }
    }

    return (
        <div>
            <MyPageSubTitle>Ship</MyPageSubTitle>
            <div className="text-muted mb-3">Location: {props.selectedLocation.symbol}</div>
            {playerShips.filter((s) => s.location === props.selectedLocation.symbol).map((ship) => {
                return (
                    <Button variant="outline-secondary" onClick={handleClickShip}
                        data-ship-id={ship.id} className="text-start w-100"
                    >
                        <div className="font-weight-bold">{ship.type}</div>
                        <small>Cargo: {ship.spaceAvailable} / {ship.maxCargo}</small>
                    </Button>
                )
            })}
        </div>
    )
}

function MarketTradeFormGoodSelect(props) {
    function FormWrapper(props) {
        return (
            <div>
                <MyPageSubTitle>Good</MyPageSubTitle>
                <div className="text-muted">Location: {props.selectedLocation.symbol}</div>
                {props.children}
            </div>
        )
    }

    const [mdLoc, setMdLoc] = useState(null);
    const [marketData, setMarketData] = useContext(MarketDataContext);

    function handleClickGood(e) {

    }

    if (!mdLoc) {
        let _mdLoc = marketData.find((md) => md.location == props.selectedLocation);

        if (!mdLoc) {
            return (
                <FormWrapper>
                    <div className="text-muted">
                        No market data for this location.
                    </div>
                </FormWrapper>
            )
        }

        _mdLoc = {..._mdLoc};

        return (<div></div>);
    }

    
    

    if (mdLoc.goods.length === 0) {
        return (
            <FormWrapper>
                <div className="text-muted">
                    Location trades no goods.
                </div>
            </FormWrapper>
        )
    }

    return (
        <FormWrapper>
            <ListGroup>
                {mdLoc.goods.map((good) => {
                    return (
                        <ListGroup.Item key={good.symbol}>
                            <div>{good.symbol}</div>
                            <div className="pl-2">Qty: {prettyNumber(good.quantityAvailable)}</div>
                            <div className="pl-2">Buy: ${prettyNumber(good.purchasePricePerUnit)}</div>
                            <div className="pl-2">Sell: ${prettyNumber(good.sellPricePerUnit)}</div>
                            <Button variant="primary" className="float-right"
                                data-good-id={good.symbol} data-action="buy"
                                handleClick={handleClickGood}
                            >Buy</Button>
                            <Button variant="critical" className="float-right"
                                data-good-id={good.symbol} data-action="sell"
                                handleClick={handleClickGood}
                            >Sell</Button>
                        </ListGroup.Item>
                    );
                })}
            </ListGroup>
        </FormWrapper>
    )
}

function MarketTradeFormLocationSelect(props) {
    const [systems, setSystems] = useContext(SystemsContext);
    const [marketData, setMarketData] = useContext(MarketDataContext);

    function handleClickLocation(e) {
        let _location = systems.all_locations.find((l) => l.symbol === e.currentTarget.dataset.locationId);
        if (_location) {
            props.setSelectedLocation({ ..._location });
            props.setTradeAmount(0);
        } else {
            toast.error("Invalid location selection");
        }
    }

    return (
        <div>
            <MyPageSubTitle>Location</MyPageSubTitle>
            {systems.systems.map((system) => {
                return (
                    <div key={system.symbol}>
                        <h4>{system.symbol} ({system.name})</h4>
                        {system.locations.map(location => {
                            return (
                                <Button variant="outline-secondary" onClick={handleClickLocation}
                                    data-location-id={location.symbol}
                                >
                                    {location.symbol} ({location.name})
                                </Button>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default function MarketTradeForm(props) {
    const [marketData, setMarketData] = useContext(MarketDataContext);
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);
    const [systems, setSystems] = useContext(SystemsContext);
    const [selectedShip, setSelectedShip] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedGood, setSelectedGood] = useState(null);
    const [tradeAmount, setTradeAmount] = useState(0);

    let _locationID = props.locationID;
    let _shipID = props.shipID;
    let _goodID = props.goodID;

    // Try to select the ship by the supplied ID
    if (!selectedShip && Array.isArray(playerShips) && _shipID) {
        let ship = playerShips.find((s) => s.id === _shipID);
        setSelectedShip({ ...ship });
    }

    if (!selectedLocation && Array.isArray(systems.all_locations) && _locationID) {
        let location = systems.all_locations.find((l) => l.symbol === _locationID);
        setSelectedLocation({ ...location });
    }

    if (!selectedGood && _goodID) {
        setSelectedGood(_goodID);
    }

    if (!selectedLocation) {
        return (
            <MarketTradeFormLocationSelect setSelectedLocation={setSelectedLocation} setTradeAmount={setTradeAmount} />
        )
    }

    if (!selectedShip) {
        return (
            <MarketTradeFormShipSelect selectedLocation={selectedLocation} setSelectedShip={setSelectedShip} setTradeAmount={setTradeAmount} />
        )
    }

    if (!selectedGood || !props.action) {
        return (
            <MarketTradeFormGoodSelect selectedLocation={selectedLocation} setTradeAmount={setTradeAmount} setSelectedGood={setSelectedGood}/>
        )
    }

    if (props.action !== "buy" && props.action !== "sell") {
        return (
            <div>
                Invalid action: {props.action}
            </div>
        )
    }

    // The final trade window
    // TODO
    let value = 0;
    let submitBtn = undefined;
    if (props.action === "buy") {

        submitBtn = (
            <Button variant="primary">Buy for ${prettyNumber(value)}</Button>
        );
    }

    return (
        <div>

            {submitBtn}
        </div>
    )
}