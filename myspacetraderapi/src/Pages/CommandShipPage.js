import { useContext, useEffect, useState } from "react";
import { loadPlayerShipsData, savePlayerShipsData, loadSystemsData } from "../Services/LocalStorage";
import { getShipInfo } from "../Services/SpaceTraderApi";

import insertOrUpdate from "../Utils/insertOrUpdate";
import sortCompareAlphabetically from "../Utils/sortCompareAlphabetically";

import CommandShipRow from "./Components/CommandShipRow";
import CommandShipTradeModal from "./Components/CommandShipTradeModal";
import CommandShipRouteModal from "./Components/CommandShipRouteModal";
import CommandShipManageModal from "./Components/CommandShipManageModal";
import MyPageTitle from "../Components/MyPageTitle";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import Table from "react-bootstrap/esm/Table";
import Modal from "react-bootstrap/esm/Modal";
import getShipsInSystem from "../Utils/getShipsInSystem";
import Form from "react-bootstrap/esm/Form";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import prettyNumber from "../Utils/prettyNumber";


export default function CommandShipPage(props) {
    const [routeModalState, setRouteModalState] = useState({});
    const [tradeModalState, setTradeModalState] = useState({});
    const [manageModalState, setManageModalState] = useState({});
    const [listSettings, setListSettings] = useState({ sort: "type" });
    const [systemList, setSystemList] = useState([]);
    const [data, setData] = useState(getShipList());

    useEffect(() => {
        reloadData();
    }, [listSettings]);

    useEffect(() => {
        // Setup system list
        let systemData = loadSystemsData();
        if (Array.isArray(systemData.systems)) {
            setSystemList(systemData.systems.map((s) => { return { name: s.name, symbol: s.symbol }; }));
        }
    }, []);

    function reloadData() {
        setData(getShipList());
    }

    function getShipList() {
        let data = loadPlayerShipsData();

        // Filter
        if (listSettings.filterSystem) data = getShipsInSystem(listSettings.filterSystem, data);
        if (listSettings.search) {
            const searchParm = ("" + listSettings.search).toLowerCase();
            data = data.filter(s => {
                return ("" + s.type).toLowerCase().startsWith(searchParm)
                    || ("" + s.manufacturer).toLowerCase().startsWith(searchParm)
                    || ("" + s._name).toLowerCase().startsWith(searchParm)
            });
        }

        // Sort
        if (listSettings.sort === "type") {
            data.sort((a, b) => sortCompareAlphabetically(a.type, b.type));
        }

        // Done
        return data;
    }

    function setListSetting(key, value) {
        listSettings[key] = value;
        setListSettings({ ...listSettings });
    }

    function refreshShipData(shipId) {
        return getShipInfo(shipId)
            .then(stcResult => {
                if (stcResult.ok) {
                    savePlayerShipsData(insertOrUpdate(loadPlayerShipsData(), stcResult.data.ship, (ship) => ship.id === stcResult.data.ship.id));
                }
            })
    }

    function showRouteModal(shipId) {
        routeModalState.show = true;
        routeModalState.shipId = shipId;
        setRouteModalState({ ...routeModalState });
    }

    function closeRouteModal() {
        routeModalState.show = false;
        routeModalState.shipId = null;
        setRouteModalState({ ...routeModalState });
    }

    function showManageModal(shipId) {
        manageModalState.show = true;
        manageModalState.shipId = shipId;
        setManageModalState({ ...manageModalState });
    }

    function closeManageModal() {
        manageModalState.show = false;
        manageModalState.shipId = null;
        setManageModalState({ ...manageModalState });
    }

    function showTradeModal(shipId) {
        tradeModalState.show = true;
        tradeModalState.shipId = shipId;
        setTradeModalState({ ...tradeModalState });
    }

    function closeTradeModal() {
        tradeModalState.show = false;
        tradeModalState.shipId = null;
        setTradeModalState({ ...tradeModalState });
    }

    return (
        <div>
            <MyPageTitle>Command</MyPageTitle>
            <MyPageSubTitle>Ships</MyPageSubTitle>
            <Container>
                <Row>
                    <Form.Group className="col-sm-12 col-md-4 mb-3">
                        <Form.Label>Search</Form.Label>
                        <Form.Control type="text" className="w-100" value={listSettings.search} onChange={(e) => { setListSetting("search", e.target.value) }}>

                        </Form.Control>
                    </Form.Group>
                    <Form.Group className="col-sm-12 col-md-4 mb-3">
                        <Form.Label>System</Form.Label>
                        <Form.Select value={listSettings.filterSystem} onChange={(e) => { setListSetting("filterSystem", e.target.value) }}>
                            <option value="">(all)</option>
                            {systemList.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} ({s.name})</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="col-sm-12 col-md-4 mb-3">
                        <Form.Label>Sort by</Form.Label>
                        <Form.Select value={listSettings.sort} onChange={(e) => { setListSetting("sort", e.target.value) }}>
                            <option value="type">Ship type</option>
                        </Form.Select>
                    </Form.Group>
                </Row>
            </Container>
            <Table striped hover responsive className="mt-3">
                <tbody>
                    <tr><td colSpan="100%" className="fw-light">Ships: {prettyNumber(data.length)}</td></tr>
                    {data.map((ship, idx) => {
                        return (
                            <CommandShipRow key={idx} shipId={ship.id} showTradeModal={showTradeModal} showRouteModal={showRouteModal} showManageModal={showManageModal} />
                        )
                    })}
                </tbody>
            </Table>

            <Modal show={manageModalState.show} onHide={() => closeManageModal()}>
                <CommandShipManageModal
                    shipId={manageModalState.shipId}
                    onComplete={() => { closeManageModal(); reloadData(); }}
                    close={closeManageModal} />
            </Modal>



            <Modal show={routeModalState.show} onHide={() => closeRouteModal()}>
                <CommandShipRouteModal
                    shipId={routeModalState.shipId}
                    onComplete={() => { refreshShipData(routeModalState.shipId).then(() => reloadData()); closeRouteModal(); reloadData(); }}
                    close={closeRouteModal}
                />
            </Modal>

            <Modal show={tradeModalState.show} onHide={() => closeTradeModal()}>
                <CommandShipTradeModal
                    shipId={tradeModalState.shipId}
                    onComplete={() => { closeTradeModal(); reloadData(); }}
                    close={closeTradeModal} />
            </Modal>
        </div>
    )
}