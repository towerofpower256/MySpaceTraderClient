import { useContext, useEffect, useState } from "react";
import { loadPlayerShipsData, savePlayerShipsData } from "../Services/LocalStorage";
import { getShipInfo } from "../Services/SpaceTraderApi";

import insertOrUpdate from "../Utils/insertOrUpdate";
import groupBy from "../Utils/groupBy";
import sortCompareAlphabetically from "../Utils/sortCompareAlphabetically";

import CommandShipRow from "./Components/CommandShipRow";
import CommandShipTradeModal from "./Components/CommandShipTradeModal";
import CommandShipRouteModal from "./Components/CommandShipRouteModal";
import CommandShipManageModal from "./Components/CommandShipManageModal";
import MyPageTitle from "../Components/MyPageTitle";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import Table from "react-bootstrap/esm/Table";
import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";


export default function CommandShipPage(props) {
    const [data, setData] = useState(loadPlayerShipsData());
    const [routeModalState, setRouteModalState] = useState({});
    const [tradeModalState, setTradeModalState] = useState({});
    const [manageModalState, setManageModalState] = useState({});

    
    function reloadData() {
        let shipData = (loadPlayerShipsData() || []);
        shipData.sort((a, b) => sortCompareAlphabetically(a.type, b.type));

        setData(shipData);
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
            <Table striped hover responsive className="mt-3">
                <tbody>
                    {!data || !data.length && <tr><td>You don't own any ships.</td></tr>}
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
                    close={closeManageModal}/>
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
                    close={closeTradeModal}/>
            </Modal>
        </div>
    )
}











