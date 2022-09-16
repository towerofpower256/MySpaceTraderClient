import { loadFlightPlanData, loadPlayerShipsData } from "../Services/LocalStorage";
import getSystemFromLocationName from "./getSystemFromLocationName";

// Get a list of ships (or filter an existing list of ships)
// that either:
// - have a location within that system
// - have a flight plan within that system
export default function getShipsInSystem(systemSymbol, shipList) {
    if (!systemSymbol) return []; // herpa derp
    if (!shipList) shipList = loadPlayerShipsData();

    const flightPlans = loadFlightPlanData().filter(fp => getSystemFromLocationName(fp.destination) === systemSymbol);

    return shipList.filter(s => getSystemFromLocationName(s.location) === systemSymbol || flightPlans.find(fp => fp.id === s.flightPlanId));
}