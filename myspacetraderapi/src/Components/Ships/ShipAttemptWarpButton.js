import {useContext, useState} from "react";
import FlightPlansContext from "../../Contexts/FlightPlansContext";
import { toast } from "react-toastify";
import { attemptWarpJump } from "../../Services/SpaceTraderApi";
import insertOrUpdate from "../../Utils/insertOrUpdate"
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";

export default function ShipAttemptWarpButton(props) {
    const [flightPlans, setFlightPlans] = useContext(FlightPlansContext);
    const [isWorking, setWorking] = useState(false);

    function handleClick(e) {
        if (isWorking) return;
        if (!props.ship) return;

        setWorking(true);

        attemptWarpJump(props.ship.id)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error attempting warp jump: " + stcResponse.errorPretty);
                    return;
                }

                toast.success("" + props.ship.type + " warp jumped successfully.");
                const fp = stcResponse.data.flightPlan;
                if (fp) {
                    // Update flight plan in result to flight plan context
                    setFlightPlans(insertOrUpdate([...flightPlans], fp, (_fp) => _fp.id === fp.id));
                }
            })
            .catch(error => {
                toast.error("Error attemping warp jump: " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    return (
        <Button onClick={handleClick} >
            <Spinner hidden={!isWorking} animation="border" size="sm" role="status">
                <span className="visually-hidden">Working...</span>
            </Spinner>
            <span>
                {isWorking ? "Working..." : "Attempt warp"}
            </span>
        </Button>
    )
}