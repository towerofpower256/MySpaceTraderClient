import { useContext, useEffect, useState } from "react";
import SystemsContext from "../../Contexts/SystemsContext";
import { submitFlightPlan } from "../../Services/SpaceTraderApi";
import { toast } from "react-toastify";

export default function ShipNewFlightPlan(props) {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [isWorking, setIsWorking] = useState(false);
    const [systems, setSystems] = useContext(SystemsContext);

    function handleLocationChange(e) {
        let selectedLocationKey = e.target.value;
        setSelectedLocation(systems._locations[selectedLocationKey]);
    }

    function handleSubmit(e) {
        console.log("selectedLocation", selectedLocation);
        if (selectedLocation) {
            const shipID = props.ship.id;
            const destinationID = selectedLocation.symbol;
            setIsWorking(true);
            submitFlightPlan(shipID, destinationID)
                .then(stcResponse => {
                    if (!stcResponse.ok) {
                        toast.error("Error submitting new flight plan: "+stcResponse.errorPretty);
                    } else {
                        toast.success("Flight plan submitted: " + shipID + " -> " + destinationID);
                    }
                })
                .finally(() => {
                    setIsWorking(false);
                    // Reload the ship data
                    props.loadShipData();
                })
        }
    }

    let btnSubmitDisabled = isWorking || !selectedLocation;
    let btnSubmitSpinner = undefined;
    if (isWorking) {
        btnSubmitSpinner = (
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        )
    }
    const btnSubmit = (
        <button type="button"
            className="btn btn-warning btn-sm"
            disabled={btnSubmitDisabled}
            onClick={handleSubmit}
        >{btnSubmitSpinner}Submit flight plan</button>
    );

    const locationOptions = [];
    let shipLocation = systems._locations[props.ship.location];
    if (shipLocation) {
        shipLocation.system.locations.forEach(location => {
            if (shipLocation.system.symbol === location.system.symbol) {
                let locationLabel = [location.symbol, location.name, location.type].join(" / ");
                locationOptions.push(
                    <option key={location.symbol} value={location.symbol}>{locationLabel}</option>
                )
            }
        })
    }

    return (
        <div className="card">
            <div className="card-header">
                Submit a flight plan
            </div>
            <div className="card-body">
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th>Ship</th>
                            <td>{props.ship.id}</td>
                        </tr>
                        <tr>
                            <th>Location</th>
                            <td>
                                <select className="form-select" onChange={handleLocationChange}>
                                    <option value="">--- Select a location ---</option>
                                    {locationOptions}
                                </select>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="card-footer text-end">
                {btnSubmit}
            </div>
        </div>
    );
}