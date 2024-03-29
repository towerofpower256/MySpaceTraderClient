import { loadSystemsData } from "../Services/LocalStorage";
import calcTravel from "./calcTravel";
import getLocation from "./getLocation";
import getLocationsBySystem from "./getLocationsBySystem";

export default function getDestinationsFromLocation(startLocationSymbol, shipSpeed, systemData) {
    if (!systemData) systemData = loadSystemsData();
    const startLocation = getLocation(startLocationSymbol);
    if (!startLocation) return [];
    const destinations = getLocationsBySystem(startLocation.system).filter((loc) => loc.symbol !== startLocationSymbol);
    if (!destinations) return [];

    // Calculate distance from start location
    destinations.forEach(location => {
        if (location.symbol === startLocationSymbol) return;
        const [distance, fuelCost, travelTime] = calcTravel(startLocation, location, shipSpeed);
        location._distance = distance;
        location._fuel_cost = fuelCost;
        location._travel_time = travelTime;
    });

    return destinations;
}