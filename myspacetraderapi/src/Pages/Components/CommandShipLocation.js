import { useContext } from "react";
import { MdAnchor, MdFlight } from "react-icons/md";
import FlightPlansContext from "../../Contexts/FlightPlansContext";
import TimestampCount from "../../Components/TimestampCount";
import LocationText from "../../Components/LocationText";

export default function CommandShipLocation(props) {
    const [flightPlans, setFlightPlans] = useContext(FlightPlansContext);
    const ship = props.ship;

    let fp = flightPlans.find((_fp) => _fp.shipId === ship.id);
    if (fp) {
        if (new Date(fp.arrivesAt) > new Date()) {
            return (
                <span>
                    <MdFlight />
                    <TimestampCount value={fp.arrivesAt} variant="raw" formatter={(a) => <>{a} until <LocationText value={fp.destination} /></>} />
                </span>
            );
        }
    }

    if (ship.location && ship.location !== "") {
        return (
            <span>
                <MdAnchor />
                Docked at <LocationText value={ship.location} />
            </span>
        )
    }

    return (
        <span>
            <MdFlight />
            (in transit)
        </span>
    )
}