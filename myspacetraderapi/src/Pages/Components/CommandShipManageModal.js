// Form to perform misc management activities on ships
// Capabilities:
// - Manage cargo, incl. jetteson, transfer to other ships
// - Attempt warp
// - Scrap this ship

import { useState, useEffect, useContext } from "react";
import { loadPlayerShipsData } from "../../Services/LocalStorage";
import { MdMoveToInbox, MdDoubleArrow } from "react-icons/md";
import { TbTrashX } from "react-icons/tb";
import { jettisonCargo, transferCargoBetweenShips, scrapShip } from "../../Services/SpaceTraderApi";
import { toast } from "react-toastify";
import CommandShipLocation from "./CommandShipLocation";
import ShipFuelBadge from "../../Components/ShipFuelBadge";
import ShipCargoBadge from "../../Components/ShipCargoBadge";
import ShipNameBadge from "../../Components/ShipNameBadge";
import ShipLoadingSpeedBadge from "../../Components/ShipLoadingSpeedBadge";
import ShipSpeedBadge from "../../Components/ShipSpeedBadge";
import Modal from "react-bootstrap/esm/Modal";
import Badge from "react-bootstrap/esm/Badge";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import Spinner from "react-bootstrap/esm/Spinner";
import InputGroup from "react-bootstrap/esm/InputGroup";

import prettyNumber from "../../Utils/prettyNumber";
import Table from "react-bootstrap/esm/Table";
import getGoodName from "../../Utils/getGoodName";
import getShipName from "../../Utils/getShipName";
import insertOrUpdate from "../../Utils/insertOrUpdate";
import PlayerShipsContextSet from "../../Contexts/PlayerShipsContextSet";
import ShipSelectMenu from "../../Components/ShipSelectMenu";


export default function CommandShipManageModal(props) {
    const [subForm, setSubForm] = useState();
    const [selectedCargo, setSelectedCargo] = useState();
    const shipId = props.shipId;
    const ship = loadPlayerShipsData().find(s => s.id === shipId);

    function doOnComplete(...args) {
        if (typeof props.onComplete === "function") props.onComplete(...args);
    }

    function PageWrapper(props) {
        return (
            <>
                <Modal.Header closeButton>
                    <span className="me-2">Managing {ship && ship.type}</span><ShipNameBadge ship={ship} />
                </Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </>
        )
    }

    if (!ship) {
        return (
            <PageWrapper>
                Couldn't manage that ship. Try again.
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div className="float-end">
                <Button variant="" className="text-danger" onClick={() => { setSubForm("scrap") }}>
                    <TbTrashX />
                </Button>
            </div>
            <div>
                <Badge bg="light" className="text-dark">
                    <CommandShipLocation ship={ship} />
                </Badge>
            </div>
            <div>
                <ShipCargoBadge ship={ship} />
                <ShipFuelBadge ship={ship} />
                <ShipLoadingSpeedBadge ship={ship} />
                <ShipSpeedBadge ship={ship} />
            </div>
            <hr />
            <div>Cargo</div>
            <Table size="sm" striped>
                <thead>
                    <tr>
                        <th>Good</th>
                        <th>Qty</th>
                        <th>Volume</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(ship.cargo) &&
                        ship.cargo.map((c, idx) => {
                            return (
                                <tr key={c.good} className="align-middle">
                                    <td className="w-auto">{getGoodName(c.good)}</td>
                                    <td>{prettyNumber(c.quantity)}</td>
                                    <td>{prettyNumber(c.totalVolume)}</td>
                                    <td className="text-end">
                                        <Button variant="" className="text-primary" onClick={() => { setSubForm("transfer"); setSelectedCargo(c) }}>
                                            Transfer
                                        </Button>
                                        <Button variant="" className="text-danger" onClick={() => { setSubForm("jettison"); setSelectedCargo(c) }}>
                                            Jettison
                                        </Button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </Table>

            {subForm && <hr />}
            {subForm === "jettison" && <SubFormJettisonCargo ship={ship} selectedCargo={selectedCargo} onComplete={() => setSubForm()} />}
            {subForm === "transfer" && <SubFormTransferCargo ship={ship} selectedCargo={selectedCargo} onComplete={() => setSubForm()} />}
            {subForm === "scrap" && <SubFormScrapShip ship={ship} onComplete={() => { setSubForm();   }} />}
        </PageWrapper>
    )
}

function SubFormScrapShip(props) {
    const [isWorking, _setWorking] = useState(false);
    const [isMounted, setMounted] = useState(true);
    const [setShipsData] = useContext(PlayerShipsContextSet);
    const ship = props.ship;

    useEffect(() => () => setMounted(false), []); //onDismount

    function setWorking(a) {
        if (!isMounted) return;
        _setWorking(a);
    }

    function doOnComplete(...args) {
        if (typeof props.onComplete === "function") props.onComplete(...args);
    }

    function scrapShipClick() {
        if (isWorking) return;
        if (!ship) return;

        scrapShip(ship.id)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error scrapping ship. " + stcResponse.errorPretty);
                    return;
                }

                setShipsData(loadPlayerShipsData().filter(s => s !== ship.id)); // Update the ship list, remove this ship
                toast.success(stcResponse.data.success || "Ship scrapped");

                doOnComplete();
            })
            .catch(error => {
                toast.error("Error scrapping ship. " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    return (
        <Button className="w-100" variant="danger" disabled={isWorking} onClick={scrapShipClick}>
            {isWorking && <Spinner animation="border" role="status" size="sm">
                <span className="visually-hidden">Loading...</span>
            </Spinner>}
            Scrap {getShipName(ship)}
        </Button>
    )
}

function SubFormTransferCargo(props) {
    const [val, _setVal] = useState(0);
    const [isWorking, _setWorking] = useState(false);
    const [isMounted, setMounted] = useState(true);
    const [targetShip, setTargetShip] = useState();
    const [setShipsData] = useContext(PlayerShipsContextSet);
    const ship = props.ship;
    const selectedCargo = props.selectedCargo;

    useEffect(() => () => setMounted(false), []); //onDismount

    function setWorking(a) {
        if (!isMounted) return;
        _setWorking(a);
    }

    function setVal(a) {
        if (isWorking) return;
        _setVal(a);
    }

    function setMax() {
        if (!ship || !selectedCargo) return;

        if (ship && !targetShip) {
            setVal(selectedCargo.quantity);
        }

        setVal(Math.min(selectedCargo.quantity, targetShip.spaceAvailable));
    }

    function doOnComplete(...args) {
        if (typeof props.onComplete === "function") props.onComplete(...args);
    }

    function transferCargoClick() {
        if (isWorking) return;
        if (!ship || !selectedCargo || !targetShip) return;

        setWorking(true);
        transferCargoBetweenShips(ship.id, targetShip.id, selectedCargo.good, val)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error transferring cargo. " + stcResponse.errorPretty);
                    return;
                }

                toast.success([
                    "Transferred",
                    prettyNumber(val),
                    getGoodName(selectedCargo.good),
                    "from",
                    getShipName(ship),
                    "to",
                    getShipName(targetShip)
                ].join(" "));

                const dataFromShip = stcResponse.data.fromShip;
                const dataToShip = stcResponse.data.toShip;


                let shipData = loadPlayerShipsData();
                let didChange = false;
                // Responses are incomplete, missing location data. Find and merge the cargo objects only.

                let fromShip = shipData.find(s => dataFromShip.id === s.id);
                if (fromShip) {
                    fromShip.cargo = dataFromShip.cargo;
                    didChange = true;
                }
                let toShip = shipData.find(s => dataToShip.id === s.id);
                if (toShip) {
                    toShip.cargo = dataToShip.cargo;
                    didChange = true;
                }
                
                if (didChange) setShipsData(shipData);

                doOnComplete();
            })
            .catch(error => {
                toast.error("Error transferring cargo. " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    return (
        <div>
            <Form.Group>
                <Form.Text>Ship to transfer cargo to</Form.Text>
                    <ShipSelectMenu 
                    filter={(s) => s.location === ship.location && s.id !== ship.id}
                    onSelect={(ship) => setTargetShip(ship)}/>
                <Form.Text>Quantity</Form.Text>
                <InputGroup className="mb-3">
                    <Form.Control type="number" value={val} onChange={(e) => setVal(e.currentTarget.value)} />
                    <Button variant="secondary" onClick={() => setMax()} disabled={isWorking}>Max</Button>
                </InputGroup>
                <Button className="w-100" disabled={isWorking || !val || val < 0} onClick={transferCargoClick}>
                    {isWorking && <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                    Transfer {val} {selectedCargo.good}
                </Button>
            </Form.Group>
        </div>
    )
}

function SubFormJettisonCargo(props) {
    const [val, _setVal] = useState(0);
    const [isWorking, _setWorking] = useState(false);
    const [isMounted, setMounted] = useState(true);
    const ship = props.ship;
    const selectedCargo = props.selectedCargo;

    useEffect(() => () => setMounted(false), []); //onDismount

    function setWorking(a) {
        if (!isMounted) return;
        _setWorking(a);
    }

    function setVal(a) {
        if (isWorking) return;
        _setVal(a);
    }

    function setMax() {
        if (!ship || !selectedCargo) return;

        setVal(selectedCargo.quantity);
    }

    function jettisonCargoClick() {
        if (isWorking) return;
        if (val < 0) return;

        setWorking(true);
        jettisonCargo(ship.id, selectedCargo.good, val)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error jettisoning cargo. " + stcResponse.errorPretty);
                    return;
                }

                toast.success([
                    "Jettisoned",
                    "x" + prettyNumber(val),
                    getGoodName(selectedCargo.good),
                    "from",
                    getShipName(ship)
                ].join(" "));

                doOnComplete();
            })
            .catch(error => {
                toast.error("Error jettisoning cargo. " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    function doOnComplete(...args) {
        if (typeof props.onComplete === "function") props.onComplete(...args);
    }

    return (
        <div>
            <Form.Group>
                <Form.Text>Quantity</Form.Text>
                <InputGroup className="mb-3">
                    <Form.Control type="number" value={val} onChange={(e) => setVal(e.currentTarget.value)} />
                    <Button variant="secondary" onClick={() => setMax()} disabled={isWorking}>Max</Button>
                </InputGroup>

                <Button variant="danger" className="w-100" disabled={isWorking || !val || val < 0} onClick={jettisonCargoClick}>
                    {isWorking && <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                    Jettison {val} {selectedCargo.good}
                </Button>
            </Form.Group>

        </div>
    )
}