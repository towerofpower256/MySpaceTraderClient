import { useState, useContext } from "react";
import { loadPlayerShipsData, saveFlightPlanData, loadFlightPlanData } from "../../Services/LocalStorage";
import { submitFlightPlan, attemptWarpJump } from "../../Services/SpaceTraderApi";
import { toast } from "react-toastify";
import { MdMoveToInbox, MdDoubleArrow, MdTimer } from "react-icons/md";
import { GiJerrycan } from 'react-icons/gi';
import { FaBoxes } from "react-icons/fa";
import { TbArrowBigRightLines } from "react-icons/tb";

import CommandShipLocation from "./CommandShipLocation";
import LocationPlayerShipCountBadge from "../../Components/LocationPlayerShipCountBadge";
import ShipFuelBadge from "../../Components/ShipFuelBadge";
import TimeDelta from "../../Components/TimeDelta";

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
import sortCompareNumerically from "../../Utils/sortCompareNumerically";
import LocationMarketVisibilityBadge from "../../Components/LocationMarketVisibilityBadge";
import ShipNameBadge from "../../Components/ShipNameBadge";


export default function CommandShipRouteModal(props) {
    const [isWorking, setWorking] = useState(false);
    const [setFlightPlans] = useContext(FlightPlansContextSet);

    const shipId = props.shipId;
    const ship = loadPlayerShipsData().find((_ship) => _ship.id === shipId);
    const destinations = (ship ? getDestinationsFromLocation(ship.location) : undefined);
    if (Array.isArray(destinations))
        destinations.sort((a, b) => sortCompareNumerically(a._distance, b._distance, false)); // Sort by distance

    function PageWrapper(props) {
        return (
            <>
                <Modal.Header closeButton>
                    <span className="me-2">Routing {ship && ship.type}</span><ShipNameBadge ship={ship} />
                </Modal.Header>
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
                        handleSuccessfulFlightPlan(_fp);
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

    function attemptWarpJumpClick() {
        if (isWorking) return;
        if (!ship) return;

        setWorking(true);
        attemptWarpJump(ship.id)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error attempting warp jump. " + stcResponse.errorPretty);
                    return;
                }

                const fp = stcResponse.data.flightPlan;
                if (!fp) {
                    toast.warn("Warp jump successful, but response was missing flight plan details.");
                } else {
                    handleSuccessfulFlightPlan(fp);
                }

                doOnComplete();
            })
            .catch(error => {
                toast.error("Error attempting warp jump. " + error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    function handleSuccessfulFlightPlan(newFp) {
        toast.success([
            "Flight plan submited to",
            getLocationName(newFp.destination),
            "for",
            prettyNumber(newFp.fuelConsumed),
            "fuel"
        ].join(" "));

        setFlightPlans(insertOrUpdate(loadFlightPlanData(), newFp, (fp) => fp.id === newFp.id));
        updateFlightPlanHistory(newFp);
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
            <div className="mt-3">
                <Button variant="secondary" className="w-100" size="sm" disabled={isWorking}
                    onClick={() => attemptWarpJumpClick()}
                >
                    {isWorking && <Spinner animation="border" role="status" size="sm">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>}
                    Attempt warp jump
                </Button>
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
                                    <div>
                                        <LocationMarketVisibilityBadge locationId={dest.symbol} />
                                        <LocationPlayerShipCountBadge locationId={dest.symbol} />
                                    </div>
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
                                    <Badge bg="light" className="text-dark me-2" title="Travel time">
                                        <MdTimer className="me-2 fw-normal" />
                                        <TimeDelta variant="hms" value={dest._travel_time * 1000} />
                                    </Badge>
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