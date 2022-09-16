import { MdAnchor, MdFlight, MdMoveToInbox, MdDoubleArrow } from "react-icons/md";
import { GiWoodenCrate, GiJerrycan } from 'react-icons/gi';
import { FaBoxes } from "react-icons/fa";
import { TbArrowBigRightLines, TbBox } from "react-icons/tb";

import { useContext } from "react";

import PlayerShipsContext from "../../Contexts/PlayerShipsContext";

import prettyNumber from "../../Utils/prettyNumber";
import getShipFuelCount from "../../Utils/getShipFuelCount";

import Badge from "react-bootstrap/esm/Badge";
import Button from "react-bootstrap/esm/Button";
import CommandShipLocation from "./CommandShipLocation";
import ShipCargoBadge from "../../Components/ShipCargoBadge";
import ShipFuelBadge from "../../Components/ShipFuelBadge";

import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import ShipNameBadge from "../../Components/ShipNameBadge";
import ShipLoadingSpeedBadge from "../../Components/ShipLoadingSpeedBadge";

export default function CommandShipRow(props) {
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);
    const shipId = props.shipId;

    const ship = (playerShips || []).find((s) => s.id === shipId);

    if (!ship) {
        // TODO maybe handle more gracefully?
        return (
            <tr data-ship={shipId}>

            </tr>
        )
    }

    return (
        <tr data-ship={shipId}>
            <td className="align-middle">
                <div className="d-flex flex-row flex-wrap">
                    <div>
                        <ShipNameBadge ship={ship} />
                        <div className="fw-bold me-3">{ship.type}</div>
                        <div className="text-muted">{ship.manufacturer}</div>
                    </div>
                    <div className="d-flex">
                        <div>
                            <ShipCargoBadge ship={ship} />
                            <ShipFuelBadge ship={ship} />
                            <ShipLoadingSpeedBadge ship={ship} />
                            <ShipLoadingSpeedBadge ship={ship} />
                        </div>
                    </div>
                </div>



            </td>
            <td className="align-middle">
                <CommandShipLocation ship={ship} />
            </td>
            <td className="align-middle">
                <Button className="text-primary" variant=""
                    onClick={() => { props.showTradeModal(shipId) }}
                >Trade</Button>
                <Button className="text-primary" variant=""
                    onClick={() => { props.showManageModal(shipId) }}
                >Manage</Button>
                <Button className="text-primary" variant=""
                    onClick={() => { props.showRouteModal(shipId) }}
                >Move</Button>
            </td>
        </tr>
    )
}