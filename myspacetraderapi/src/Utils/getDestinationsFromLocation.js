import { loadSystemsData } from "../Services/LocalStorage";
import calcTravel from "./calcTravel";
import getLocation from "./getLocation";
import getLocationsBySystem from "./getLocationsBySystem";

export default function getDestinationsFromLocation(startLocationSymbol, systemData) {
    if (!systemData) systemData = loadSystemsData();
    const startLocation = getLocation(startLocationSymbol);
    if (!startLocation) return [];
    const destinations = getLocationsBySystem(startLocation.system).filter((loc) => loc.symbol !== startLocationSymbol);
    if (!destinations) return [];

    // Calculate distance from start location
    destinations.forEach(location => {
        if (location.symbol === startLocationSymbol) return;
        const [distance, fuelCost, travelTime] = calcTravel(startLocation, location);
        location._distance = distance;
        location._fuel_cost = fuelCost;
        location._travel_time = travelTime;
    });

    // Sort based on distance (shortest to largest)
    destinations.sort((a, b) => { return a._distance - b._distance });

    return destinations;
}