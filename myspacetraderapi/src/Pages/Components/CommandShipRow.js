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


export default function CommandShipRow(props) {
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);
    const shipId = props.shipId;

    const ship = playerShips.find((s) => s.id === shipId);

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
                <div>
                    <span className="fw-bold me-3">{ship.type}</span>
                    <ShipCargoBadge ship={ship} />
                    <ShipFuelBadge ship={ship} />
                    <Badge bg="light" title="Loading speed" className="text-dark me-2">
                        <MdMoveToInbox className="me-2" />{ship.loadingSpeed}
                    </Badge>
                    <Badge bg="light" title="Speed" className="text-dark me-2">
                        <MdDoubleArrow className="me-2" />{ship.speed}
                    </Badge>
                </div>
                <div>
                    <span className="text-muted">{ship.manufacturer}</span>


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
                    onClick={() => { props.showManageModal(shipId)}}
                >Manage</Button>
                <Button className="text-primary" variant=""
                    onClick={() => { props.showRouteModal(shipId) }}
                >Move</Button>
            </td>
        </tr>
    )
}