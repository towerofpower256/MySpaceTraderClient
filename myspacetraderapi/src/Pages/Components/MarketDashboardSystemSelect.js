import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { GiOrbital } from "react-icons/gi";

import SystemsContext from "../../Contexts/SystemsContext";

import Button from "react-bootstrap/esm/Button";
import getLocationName from "../../Utils/getLocationName";


export default function LocationsPageSystemSelect(props) {
    const [systems, setSystems] = useContext(SystemsContext);

    let navigate = useNavigate();

    if (!systems || !Array.isArray(systems.systems)) {
        return (<div>No systems data available</div>);
    }

    return (
        <div className="d-flex flex-wrap mb-3">
            {systems.systems.map((system) => {
                return (
                    <Button onClick={() => navigate("/market/" + system.symbol)} key={system.symbol} variant="primary" className="me-2">
                        <div>
                            <GiOrbital className="me-2" />
                            {getLocationName(system)}
                        </div>
                        <div className="fw-light">
                            {system.locations.length} locations
                        </div>
                    </Button>
                )
            })}

        </div>
    )
}