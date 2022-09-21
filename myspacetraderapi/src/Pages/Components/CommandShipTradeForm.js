import { useState, useEffect, useContext } from "react";
import { placeBuySellOrderHelper } from "../../Services/SpaceTraderApi";
import { toast } from "react-toastify";
import { loadPlayerShipsData, savePlayerShipsData, loadMarketData, loadPlayerInfo } from "../../Services/LocalStorage";

import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import Form from "react-bootstrap/esm/Form";
import InputGroup from "react-bootstrap/esm/InputGroup";
import ProgressBar from 'react-bootstrap/ProgressBar';

import prettyNumber from "../../Utils/prettyNumber";
import getGoodName from "../../Utils/getGoodName";
import updateTradeHistory from "../../Utils/updateTradeHistory";
import getShipCargoCount from "../../Utils/getShipCargoCount";
import insertOrUpdate from "../../Utils/insertOrUpdate";
import PlayerInfoContextSet from "../../Contexts/PlayerInfoContextSet";
import PlayerShipsContextSet from "../../Contexts/PlayerShipsContextSet";

export default function CommandShipTradeForm(props) {
    const [tradeAmount, _setTradeAmount] = useState(0);
    const [isMounted, setMounted] = useState(true);
    const [setPlayerInfo] = useContext(PlayerInfoContextSet);
    const [setPlayerShips] = useContext(PlayerShipsContextSet);

    useEffect(() => () => setMounted(false), []);

    function setTradeAmount(a) {
        if (isWorking) return;
        _setTradeAmount(a);
    }
    
    const ship = props.ship;
    const selectedGood = props.selectedGood;
    const tradeAction = props.tradeAction;
    const isWorking = props.isWorking;
    const setWorking = props.setWorking;
    const tradeProgress = props.tradeProgress;
    const setTradeProgress = props.setTradeProgress;
    const doOnComplete = props.doOnComplete;

    function doTrade() {
        if (isWorking) return;

        setWorking(true);
        placeBuySellOrderHelper(
            tradeAction,
            ship.id,
            selectedGood.symbol,
            tradeAmount,
            ship.loadingSpeed,
            onTradePageComplete
        )
            .then(totalValue => {
                toast.success(
                    [
                        (tradeAction === "buy" ? "Bought" : "Sold"),
                        prettyNumber(tradeAmount),
                        "x",
                        getGoodName(selectedGood.symbol),
                        "for",
                        "$" + prettyNumber(totalValue)
                    ].join(" ")
                );
                doOnComplete();
            })
            .catch(error => {
                toast.error(error || "There was an error completing the trade");
            })
            .finally(() => {
                setWorking(false);
            })
    }

    function onTradePageComplete(quantity, stcResponse) {
        if (isMounted) {
            // Prevent updates after form is closed;
            setTradeProgress(Math.round((tradeAmount - quantity) / tradeAmount * 100));
        }
        

        if (stcResponse.data.credits) {
            const playerInfo = loadPlayerInfo();
            playerInfo.credits = stcResponse.data.credits;
            setPlayerInfo(playerInfo);
        }

        const ship = stcResponse.data.ship;
        if (stcResponse.data.ship) {
            setPlayerShips(insertOrUpdate(loadPlayerShipsData(), ship, (_ship) => _ship.id === ship.id));
        }

        const od = stcResponse.data.order;
        if (od) {
            updateTradeHistory(od, tradeAction, ship.location);
        }
    }

    function setMaxTradeAmount() {
        if (!selectedGood) return;
        if (!ship) return;

        if (tradeAction === "buy") {
            setTradeAmount(Math.min(
                ship.spaceAvailable / selectedGood.volumePerUnit,
                selectedGood.quantityAvailable
            ))
        }
        if (tradeAction === "sell") {
            setTradeAmount(getShipCargoCount(ship, selectedGood.symbol));
        }

    }

    if (!selectedGood || !ship || !tradeAction) {
        return (<></>);
    }

    return (
        <div>
            <InputGroup className="mb-3">
                <InputGroup.Text>Amount</InputGroup.Text>
                <Form.Control
                    type="number" value={tradeAmount}
                    disabled={isWorking} onChange={(e) => setTradeAmount(e.target.value)} />
                <Button variant="secondary" onClick={() => setMaxTradeAmount()}>Max</Button>
            </InputGroup>

            <Button className="w-100 mb-3" variant={tradeAction === "buy" ? "success" : "primary"}
                disabled={isWorking || tradeAmount < 1}
                onClick={() => doTrade()}
            >
                {isWorking && <Spinner animation="border" role="status" size="sm" className="me-2">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>}
                {[
                    (tradeAction === "buy" ? "Buy" : "Sell"),
                    prettyNumber(tradeAmount),
                    "x",
                    getGoodName(selectedGood.symbol),
                    "for",
                    "$" + prettyNumber(tradeAmount * (tradeAction === "buy" ? selectedGood.purchasePricePerUnit : selectedGood.sellPricePerUnit))
                ].join(" ")}
            </Button>
            <ProgressBar now={tradeProgress} label={tradeProgress + "%"} hidden={!isWorking} />
        </div>
    )
}