import { GiJerrycan } from 'react-icons/gi';
import Badge from "react-bootstrap/esm/Badge";
import getShipFuelCount from "../Utils/getShipFuelCount";
import prettyNumber from "../Utils/prettyNumber";

export default function ShipFuelBadge(props) {
    const ship = props.ship;
    const classes = ["me-2", "fw-normal"];
    classes.push(ship && getShipFuelCount(ship) < 5 ? "text-danger" : "text-dark");

    return (
        <Badge bg="light" title={props.title ? props.title : "Fuel"} className={classes.join(" ")}>
            <GiJerrycan className="me-2" />{prettyNumber(getShipFuelCount(ship))}
        </Badge>
    )
}