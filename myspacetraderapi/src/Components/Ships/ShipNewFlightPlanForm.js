import { useContext, useState } from "react";
import { getLocationsBySystem, getLocation, calcTravel } from "../../Utils";
import SystemsContext from "../../Contexts/SystemsContext";
import PlayerShipsContext from "../../Contexts/PlayerShipsContext";
import MyButton from "../MyButton"
import { submitFlightPlan } from "../../Services/SpaceTraderApi";
import { toast } from "react-toastify";

function getDestinationsFromLocation(startLocationSymbol, systemList) {
    // Get the location & destinations
    const startLocation = getLocation(startLocationSymbol, systemList);
    if (!startLocation) return [];
    const destinations = getLocationsBySystem(startLocation.system, systemList);
    if (!destinations) return [];

    // Calculate distance from start location
    destinations.forEach(location => {
        const [distance, fuelCost, travelTime] = calcTravel(startLocation, location);
        location._distance = distance;
        location._fuel_cost = fuelCost;
        location._travel_time = travelTime;
    });

    // Sort based on distance (shortest to largest)
    destinations.sort((a, b) => {return a._distance - b._distance});

    return destinations;
}

export default function ShipNewFlightPlanForm(props) {
    const [isWorking, setIsWorking] = useState(false);
    const [systems, setSystems] = useContext(SystemsContext);
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);

    function handleClick(e) {
        if (isWorking) return;

        const shipId = e.target.dataset.ship;
        const locationSymbol = e.target.dataset.location;

        setIsWorking(true);
        submitFlightPlan(shipId, locationSymbol)
        .then(stcResult => {
            if (!stcResult.ok) {
                toast.error("Error creating flight plan: "+stcResult.error);
            } else {
                let _fp=stcResult.data.flightPlan;
                if (!_fp) {
                    toast.warning("Flight plan submited, but flight plan details missing from response");
                } else {
                    toast.success("Flight plan submited for "+_fp.fuelConsumed+" fuel");
                    // TODO add new flight plan to the flight plan context
                }
                
            }

            setIsWorking(false);
        },
        error => {
            console.log(error);
            toast.error("Error creating flight plan: "+error);
            setIsWorking(false);
        })

    }

    function hideModal() {
        
    }

    const destinations = getDestinationsFromLocation(props.ship.location, systems);

    let destinationsHtml = (
        <tr><td colSpan="5">No valid destinations</td></tr>
    );
    if (destinations.length > 0) {
        destinationsHtml = destinations.map((d, idx) => {
            const distanceText = (d._distance === 0 ? "Current location" : "~ "+Math.ceil(d._distance));
            return (
                <tr key={idx}>
                    <td>{d.symbol}</td>
                    <td>{distanceText}</td>
                    <td>{d._travel_time}</td>
                    <td>~ {d._fuel_cost}</td>
                    <td>
                        <MyButton className="btn-primary" disabled={isWorking} onClick={handleClick} data-ship={props.ship.id} data-location={d.symbol}>Go</MyButton>
                    </td>
                </tr>
            );
        });
    }

    return (
        <div>
            <div className="mb-3">
                <label htmlFor="newFlightPlanSelectedShip" className="form-label">{props.ship.id} in {props.ship.location}</label>

            </div>
            <div className="mb-3">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <td>Location</td>
                            <td>Distance</td>
                            <td>Time</td>
                            <td>Fuel</td>
                            <td></td>
                        </tr>
                    </thead>
                    <tbody>
                        {destinationsHtml}
                    </tbody>
                </table>
            </div>
        </div>
    )
}