import { useState, useContext } from "react";
import { loadPlayerShipsData, saveFlightPlanData, loadFlightPlanData } from "../../Services/LocalStorage";
import { submitFlightPlan } from "../../Services/SpaceTraderApi";
import { toast } from "react-toastify";
import { MdMoveToInbox, MdDoubleArrow } from "react-icons/md";
import { GiJerrycan } from 'react-icons/gi';
import { FaBoxes } from "react-icons/fa";
import { TbArrowBigRightLines } from "react-icons/tb";

import CommandShipLocation from "./CommandShipLocation";
import LocationPlayerShipCountBadge from "../../Components/LocationPlayerShipCountBadge";
import ShipFuelBadge from "../../Components/ShipFuelBadge";

import Badge from "react-bootstrap/esm/Badge";
import Button from "react-bootstrap/esm/Button";
import Spinner from "react-bootstrap/esm/Spinner";
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';

import prettyNumber from "../../Utils/prettyNumber";
import getLocationName from "../../Utils/getLocationName";
import getShipFuelCount from "../../Utils/getShipFuelCount";
import getDestinationsFromLocation from "../../Utils/getDestinationsFromLocation";
import updateFlightPlanHistory from "../../Utils/updateFlightPlanHistory";
import insertOrUpdate from "../../Utils/insertOrUpdate";
import FlightPlansContextSet from "../../Contexts/FlightPlansContextSet";


export default function CommandShipRouteModal(props) {
    const [isWorking, setWorking] = useState(false);
    const [setFlightPlans] = useContext(FlightPlansContextSet);

    const shipId = props.shipId;
    const ship = loadPlayerShipsData().find((_ship) => _ship.id === shipId);
    const destinations = (ship ? getDestinationsFromLocation(ship.location) : undefined);

    function PageWrapper(props) {
        return (
            <>
                <Modal.Header closeButton>Routing {ship && ship.type}</Modal.Header>
                <Modal.Body>
                    {props.children}
                </Modal.Body>
            </>
        )
    }

    function doOnComplete() {
        if (typeof props.onComplete === "function") props.onComplete();
    }

    function handleRouteClick(e) {
        if (isWorking) return;

        try {
            setWorking(true);

            const destSymbol = e.currentTarget.dataset.locationId;
            if (!destSymbol) {
                throw "Destination ID is missing";
            }

            submitFlightPlan(shipId, destSymbol)
                .then(stcResponse => {
                    if (!stcResponse.ok) {
                        toast.error(stcResponse.errorPretty);
                        return;
                    }

                    // Good request
                    let _fp = stcResponse.data.flightPlan;
                    if (!_fp) {
                        toast.warning("Flight plan submited, but flight plan details missing from response");
                    } else {
                        toast.success([
                            "Flight plan submited to",
                            getLocationName(_fp.destination),
                            "for",
                            prettyNumber(_fp.fuelConsumed),
                            "fuel"
                        ].join(" "));

                        setFlightPlans(insertOrUpdate(loadFlightPlanData(), _fp, (fp) => fp.id === _fp.id));
                        updateFlightPlanHistory(_fp);
                    }

                    doOnComplete();
                })
                .catch(error => {
                    console.error("Error submitting new flight plan", error);
                    toast.error("There was an error submitting the flight plan: " + error);
                })
                .finally(() => {
                    setWorking(false);
                })
        }
        catch (ex) {
            console.error(ex);
            setWorking(false);
        }



    }



    if (!shipId || shipId === "") {
        return (
            <PageWrapper>

            </PageWrapper>
        )
    }

    if (!ship) {
        return (
            <PageWrapper>
                You don't have a ship with the ID '{shipId}'.
            </PageWrapper>
        )
    }

    if (!ship.location) {
        return (
            <PageWrapper>
                Ship is in transit. Wait for ship to arrive at its destination and try again.
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <div>Routing ship <span className="fw-bold">{ship.type}</span></div>
            <div>
                <Badge bg="light" className="text-dark">
                    <CommandShipLocation ship={ship} />
                </Badge>
            </div>
            <div>
                <Badge bg="light" title="Cargo / Max Cargo" className="text-dark me-2 fw-normal">
                    <FaBoxes className="me-2" />{prettyNumber(ship.maxCargo - ship.spaceAvailable)} / {prettyNumber(ship.maxCargo)}
                </Badge>
                <ShipFuelBadge ship={ship} />
                <Badge bg="light" title="Loading speed" className="text-dark me-2 fw-normal">
                    <MdMoveToInbox className="me-2" />{prettyNumber(ship.loadingSpeed)}
                </Badge>
                <Badge bg="light" title="Speed" className="text-dark me-2 fw-normal">
                    <MdDoubleArrow className="me-2" />{ship.speed}
                </Badge>
            </div>
            <hr />
            <h3>Destination</h3>

            <Table size="sm" hover>
                <tbody>
                    {destinations.map((dest) => {
                        return (
                            <tr key={dest.symbol}>
                                <td className="align-middle">
                                    <span className="me-2">{getLocationName(dest)}</span>
                                </td>
                                <td>
                                    <Badge bg="light" className="text-dark me-2" title="Fuel cost">
                                        <GiJerrycan className="me-2 fw-normal" />
                                        ~{prettyNumber(dest._fuel_cost)}
                                    </Badge>
                                    <Badge bg="light" className="text-dark me-2" title="Distance">
                                        <TbArrowBigRightLines className="me-2 fw-normal" />
                                        {prettyNumber(Math.ceil(dest._distance))}
                                    </Badge>
                                    <LocationPlayerShipCountBadge locationId={dest.symbol} />
                                </td>
                                <td className="align-middle">
                                    <Button onClick={handleRouteClick} variant="" disabled={isWorking} data-location-id={dest.symbol}>
                                        {isWorking && <Spinner animation="border" role="status" size="sm">
                                            <span className="visually-hidden">Loading...</span>
                                        </Spinner>}
                                        Move
                                    </Button>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </PageWrapper >
    )
}