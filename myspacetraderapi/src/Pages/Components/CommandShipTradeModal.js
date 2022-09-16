import { useState, useEffect } from "react";
import { loadPlayerShipsData, loadMarketData } from "../../Services/LocalStorage";

import { MdMoveToInbox, MdDoubleArrow } from "react-icons/md";
import { GiJerrycan } from 'react-icons/gi';
import { FaBoxes } from "react-icons/fa";
import { TbBox } from "react-icons/tb";

import CommandShipLocation from "./CommandShipLocation";
import CommandShipTradeForm from "./CommandShipTradeForm";

import Badge from "react-bootstrap/esm/Badge";
import Button from "react-bootstrap/esm/Button";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

import prettyNumber from "../../Utils/prettyNumber";
import getGoodName from "../../Utils/getGoodName";
import getShipFuelCount from "../../Utils/getShipFuelCount";
import sortCompareAlphabetically from "../../Utils/sortCompareAlphabetically";
import getShipCargoCount from "../../Utils/getShipCargoCount";
import ShipNameBadge from "../../Components/ShipNameBadge";
import ShipCargoBadge from "../../Components/ShipCargoBadge";
import ShipFuelBadge from "../../Components/ShipFuelBadge";
import ShipLoadingSpeedBadge from "../../Components/ShipLoadingSpeedBadge";


export default function CommandShipTradeModal(props) {
    const [isWorking, setWorking] = useState(false);
    const [ship, setShip] = useState(null);
    const [selectedGood, _setSelectedGood] = useState(null);
    const [tradeAction, setTradeAction] = useState(null);
    const [tradeProgress, setTradeProgress] = useState(0);

    function setSelectedGood(a) {
        if (isWorking) return;
        _setSelectedGood(a);
    }

    function doOnComplete() {
        if (typeof props.onComplete === "function") props.onComplete();
    }

    function PageWrapper(props) {
        return (
            <>
                <Modal.Header closeButton>
                    <span className="me-2">Trading {ship && ship.type}</span><ShipNameBadge ship={ship} />
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </>
        )
    }

    useEffect(() => {
        setShip(loadPlayerShipsData().find((_ship) => _ship.id === props.shipId));
        setSelectedGood(null);
        setTradeAction(null);
    }, [props.shipId]);

    if (!ship) {
        return (
            <PageWrapper>

            </PageWrapper>
        )
    }

    if (!ship.location) {
        return (
            <PageWrapper>
                Ship is in transit. Wait for ship to arrive at its destination and try again.
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div>
                <Badge bg="light" className="text-dark">
                    <CommandShipLocation ship={ship} />
                </Badge>
            </div>
            <div>
                <ShipCargoBadge ship={ship} />
                <ShipFuelBadge ship={ship} />
                <ShipLoadingSpeedBadge ship={ship} />
                <ShipLoadingSpeedBadge ship={ship} />
            </div>
            {selectedGood && <div className="mu-3">
                <hr />
                <CommandShipTradeGoodCard marketData={selectedGood} ship={ship} />
                <Button variant="" onClick={() => setSelectedGood(undefined)}>&lt;&lt;&lt; Select a different good</Button>
            </div>}
            <hr />
            {!selectedGood && <CommandShipTradeSelectGood
                location={ship.location}
                ship={ship}
                setSelectedGood={setSelectedGood}
                setTradeAction={setTradeAction}
            />}
            <CommandShipTradeForm className="d-none"
                ship={ship}
                selectedGood={selectedGood}
                tradeAction={tradeAction}
                isWorking={isWorking}
                setWorking={setWorking}
                doOnComplete={doOnComplete}
                tradeProgress={tradeProgress}
                setTradeProgress={setTradeProgress}
            />
        </PageWrapper>
    )

}



function CommandShipTradeSelectGood(props) {
    const [availGoods, setAvailGoods] = useState([]);
    const locationSymbol = props.location;
    const ship = props.ship;

    useEffect(() => {
        const md = loadMarketData().find((md) => md.location === locationSymbol);
        if (md && Array.isArray(md.goods)) {
            setAvailGoods(
                md.goods
                    .sort((a, b) => sortCompareAlphabetically(a.symbol, b.symbol))
            );
        }

    }, [props.location]);

    return (
        <Table hover size="sm">
            <tbody>
                {availGoods.map((good) => {
                    return (
                        <tr key={good.symbol}>
                            <td>
                                <CommandShipTradeGoodCard marketData={good} ship={ship} />
                            </td>
                            <td className="align-middle">
                                <Button variant="" className={good.quantityAvailable > 0 ? "text-success" : "text-muted"}
                                    onClick={() => {
                                        props.setSelectedGood(good);
                                        props.setTradeAction("buy");
                                    }}
                                >Buy</Button>
                            </td>
                            <td className="align-middle">
                                <Button variant="" className={getShipCargoCount(ship, good.symbol) > 0 ? "text-primary" : "text-muted"}
                                    onClick={() => {
                                        props.setSelectedGood(good);
                                        props.setTradeAction("sell");
                                    }}
                                >Sell</Button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </Table>
    )
}

function CommandShipTradeGoodCard(props) {
    const md = props.marketData;
    const ship = props.ship;

    if (!md) {
        return (<></>);
    }

    return (
        <>
            <div><span className="fw-bold">{getGoodName(md.symbol)} </span></div>
            <div>
                <Badge bg="light" className="text-dark fw-normal me-2" title="Quantity available at location">
                    Qty {prettyNumber(md.quantityAvailable)}
                </Badge>
                <Badge bg="light" className={"fw-normal me-2" + (getShipCargoCount(ship, md.symbol) === 0 ? " text-muted" : " text-dark")}>
                    <FaBoxes className="me-2" />
                    {prettyNumber(getShipCargoCount(ship, md.symbol))} in cargo
                </Badge>

            </div>
            <div>
                <Badge bg="light" className="text-success fw-normal me-2">Buy ${prettyNumber(md.purchasePricePerUnit)}</Badge>
                <Badge bg="light" className="text-primary fw-normal me-2">Sell ${prettyNumber(md.sellPricePerUnit)}</Badge>
                <Badge bg="light" className="text-dark fw-normal me-2" title="Volume per unit">
                    <TbBox className="me-2" />{prettyNumber(md.volumePerUnit)} m3
                </Badge>
            </div>
        </>
    )
}