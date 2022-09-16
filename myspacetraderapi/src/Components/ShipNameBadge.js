import Badge from "react-bootstrap/esm/Badge";

export default function ShipNameBadge(props) {
    const ship = props.ship || {};

    return (
        <Badge bg="success" className="text-light fw-normal">{ship._name}</Badge>
    )

}