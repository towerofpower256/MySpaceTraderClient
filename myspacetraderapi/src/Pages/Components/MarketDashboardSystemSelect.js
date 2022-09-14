import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GiOrbital } from "react-icons/gi";

import SystemsContext from "../../Contexts/SystemsContext";

import Button from "react-bootstrap/esm/Button";
import getLocationName from "../../Utils/getLocationName";
import getSystemFromLocationName from "../../Utils/getSystemFromLocationName";
import PlayerShipsContext from "../../Contexts/PlayerShipsContext";


export default function LocationsPageSystemSelect(props) {
    const [systems, setSystems] = useContext(SystemsContext);

    if (!systems || !Array.isArray(systems.systems)) {
        return (<div>No systems data available</div>);
    }

    return (
        <div className="d-flex flex-wrap mb-3">
            {systems.systems.map((system, idx) => {
                return (
                    <LocationsPageSystemSelectButton system={system} key={idx} />
                )
            })}

        </div>
    )
}

function LocationsPageSystemSelectButton(props) {
    const [shipData, setShipData] = useContext(PlayerShipsContext);
    const [shipCount, setShipCount] = useState(0);
    const system = props.system;

    let navigate = useNavigate();
    
    useEffect(() => {
        let shipsInSystem = shipData.filter(s => getSystemFromLocationName(s.location) === system.symbol);
        setShipCount(shipsInSystem.length);
    }, [system]);

    

    return (
        <Button onClick={() => navigate("/market/" + system.symbol)} key={system.symbol} variant="primary" className="me-2 mb-2">
            <div>
                <GiOrbital className="me-2" />
                {getLocationName(system)}
            </div>
            <div className="fw-light">
                {system.locations.length} locations / {shipCount} ships
            </div>
        </Button>
    )
}