import Badge from "react-bootstrap/esm/Badge";
import { MdDoubleArrow } from "react-icons/md";

export default function ShipLoadingSpeedBadge(props) {
    const ship = props.ship || {};

    return (
        <Badge bg="light" title="Speed" className="text-dark me-2  fw-normal">
            <MdDoubleArrow className="me-2" />{ship.speed}
        </Badge>
    )
}