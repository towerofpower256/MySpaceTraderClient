import { useContext, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getSystemDockedShips, getSystemFlightPlans } from "../../Services/SpaceTraderApi";
import { toast } from "react-toastify";

import Table from "react-bootstrap/esm/Table";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Button from "react-bootstrap/esm/Button";
import Modal from "react-bootstrap/esm/Modal";
import PlaceholderTableRows from "../../Components/PlaceholderTableRows.js";

import SystemsContext from "../../Contexts/SystemsContext";
import getSystem from "../../Utils/getSystem";
import getLocationName from "../../Utils/getLocationName";
import prettyNumber from "../../Utils/prettyNumber";
import sortCompareAlphabetically from "../../Utils/sortCompareAlphabetically";


export default function MarketDashboardSystemInfo(props) {
    let parms = useParams();
    const systemId = parms.systemid;
    const [systemData, setSystemData] = useContext(SystemsContext);
    const system = getSystem(systemId, systemData);
    const [modalState, setModalState] = useState();

    if (!systemId) {
        return (
            <div></div>
        )
    }

    if (!system) {
        return (
            <div>Unknown system: {systemId}</div>
        )
    }

    function showShipsModal() {
        setModalState("ships");
    }

    function showFlightPlansModal() {
        setModalState("fp");
    }

    function closeModal() {
        setModalState();
    }

    return (

        <Card className="w-100 mb-3">
            <Card.Header>
                {getLocationName(system)}
            </Card.Header>
            <Card.Body>
                <Button className="me-3" variant="secondary" onClick={() => showFlightPlansModal()}>Flight plans in system</Button>
                <Button className="me-3" variant="secondary" onClick={() => showShipsModal()}>Ships in system</Button>
                Map goes here
            </Card.Body>

            <Modal show={modalState === "ships"} onHide={closeModal}>
                <Modal.Header>Ships docked in {getLocationName(system)}</Modal.Header>
                <Modal.Body>
                    <ShipsInSystemModal system={system.symbol} />
                </Modal.Body>
            </Modal>

            <Modal show={modalState === "fp"} onHide={closeModal}>
                <Modal.Header>Active flight plans in {getLocationName(system)}</Modal.Header>
                <Modal.Body>
                    <FlightPlansInSystemModal system={system.symbol} />
                </Modal.Body>
            </Modal>

        </Card>

    )
}

function FlightPlansInSystemModal(props) {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const systemId = props.system;

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        if (isLoading) return;

        setLoading(true);
        getSystemFlightPlans(systemId)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Failed to get system flight plans. " + stcResponse.errorPretty);
                    return;
                }

                const flightPlans = stcResponse.data.flightPlans;
                if (Array.isArray(flightPlans)) {
                    flightPlans.sort((a, b) => sortCompareAlphabetically(a.username, b.username));
                }
                setData(flightPlans);
            })
            .catch(error => toast.error("Failed to get system flight plans. " + error))
            .finally(() => setLoading(false))
    }

    return (
        <div>
            <div>Flight plans: {prettyNumber(data.length)}</div>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Ship type</th>
                        <th>From</th>
                        <th>To</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && <PlaceholderTableRows rowCount={6} colCount={4} />}
                    {!isLoading && data.map((row, idx) => {
                        return (
                            <tr key={idx}>
                                <td className="w-25 text-break">{row.username}</td>
                                <td className="w-25 text-break">{row.shipType}</td>
                                <td className="w-25 text-break">{getLocationName(row.departure)}</td>
                                <td className="w-25 text-break">{getLocationName(row.destination)}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    );
}

function ShipsInSystemModal(props) {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);
    const systemId = props.system;

    useEffect(() => {
        loadData();
    }, []);

    function loadData() {
        if (isLoading) return;

        setLoading(true);
        getSystemDockedShips(systemId)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Failed to get docked ships in system. " + stcResponse.errorPretty);
                    return;
                }

                const ships = stcResponse.data.ships;
                if (Array.isArray(ships)) {
                    ships.sort((a, b) => sortCompareAlphabetically(a.username, b.username));
                }
                setData(stcResponse.data.ships);
            })
            .catch(error => toast.error("Failed to get docked ships in system. " + error))
            .finally(() => setLoading(false))
    }

    return (
        <div>
            <div>Ships: {prettyNumber(data.length)}</div>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Ship type</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && <PlaceholderTableRows rowCount={6} colCount={2} />}
                    {!isLoading && data.map((row, idx) => {
                        return (
                            <tr key={idx}>
                                <td className="w-50 text-break">{row.username}</td>
                                <td className="w-50 text-break">{row.shipType}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    );
}