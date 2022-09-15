import { useEffect, useContext, useState } from "react";
import { FaEye, FaRegEyeSlash } from "react-icons/fa";
import { BsEye } from "react-icons/bs";
import Badge from "react-bootstrap/esm/Badge";
import MarketDataContext from "../Contexts/MarketDataContext";
import PlayerShipsContext from "../Contexts/PlayerShipsContext";

export default function LocationMarketVisibilityBadge(props) {
    const [marketData, setMarketData] = useContext(MarketDataContext);
    const [shipData, setShipData] = useContext(PlayerShipsContext);
    const locId = props.locationId;
    const [vis, setVis] = useState(calcVis());

    useEffect(() => {
        setVis(calcVis());
    }, [locId])

    function calcVis() {
        let vis = 0; // No visibility

        if (Array.isArray(marketData) && marketData.find(md => md.location === locId)) vis = 1; // Old visibilty, have market data but no ship
        if (Array.isArray(shipData) && shipData.find(s => s.location === locId)) vis = 2; // Full visibility, there is a ship there
        
        return vis;
    }

    return (
        <Badge bg="light" className="me-2 text-dark"
        >
            {vis === 0 && <FaRegEyeSlash/>}
            {vis === 1 && <BsEye/>}
            {vis === 2 && <FaEye/>}
        </Badge>
    )
}