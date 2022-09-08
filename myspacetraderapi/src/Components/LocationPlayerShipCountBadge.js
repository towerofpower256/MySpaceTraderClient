import { useContext } from "react";
import PlayerShipsContext from "../Contexts/PlayerShipsContext";
import { loadSystemsData } from "../Services/LocalStorage";
import ShipCountBadge from "./ShipCountBadge";

export default function LocationPlayerShipCountBadge(props) {
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);

    const shipCount = playerShips.filter((s) => s.location === props.locationId).length;

    return(
        <ShipCountBadge title="Ships at location">{shipCount}</ShipCountBadge>
    )
}