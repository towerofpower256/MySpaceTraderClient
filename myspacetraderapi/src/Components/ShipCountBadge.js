import { FaRocket } from "react-icons/fa";

import Badge from "react-bootstrap/esm/Badge";

export default function ShipCountBadge(props) {
    return(
        <Badge bg="light" className="me-2 text-dark">
            <FaRocket className="me-2" />{props.children}
        </Badge>
    )
}