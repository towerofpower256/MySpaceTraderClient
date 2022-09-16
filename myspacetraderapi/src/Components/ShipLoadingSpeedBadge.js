import Badge from "react-bootstrap/esm/Badge";
import { MdMoveToInbox } from "react-icons/md";

import prettyNumber from "../Utils/prettyNumber";

export default function ShipLoadingSpeedBadge(props) {
    const ship = props.ship || {};

    return (
        <Badge bg="light" title="Loading speed" className="text-dark me-2  fw-normal">
            <MdMoveToInbox className="me-2" />{prettyNumber(ship.loadingSpeed)}
        </Badge>
    )
}