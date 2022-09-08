import { FaBoxes } from "react-icons/fa";
import Badge from "react-bootstrap/esm/Badge";
import prettyNumber from "../Utils/prettyNumber";

export default function ShipCargoBadge(props) {
    const ship = props.ship;
    const classes = ["me-2", "fw-normal"];
    if (ship) {
        if (ship.spaceAvailable === ship.maxCargo) {
            classes.push("text-danger");
        } else if (ship.spaceAvailable === 0) {
            classes.push("text-success");
        } else {
            classes.push("text-dark");
        }
    }

    return (
        <Badge bg="light" title={props.title ? props.title : "Cargo / Max Cargo"} className={classes.join(" ")}>
            <FaBoxes className="me-2" />{prettyNumber(ship.maxCargo - ship.spaceAvailable)} / {prettyNumber(ship.maxCargo)}
        </Badge>
    )
}