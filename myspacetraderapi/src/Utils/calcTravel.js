import calcDistance from "./calcDistance";

// Credit to erebos
// https://github.com/Kaishiyoku/erebos/blob/dabf5933f88446be0babaca067c5b94e9b21c7ef/src/core/flight/estimateRouteFuelCost.js
// https://github.com/Kaishiyoku/erebos/blob/dabf5933f88446be0babaca067c5b94e9b21c7ef/src/core/flight/calculateDistance.js
export default function calcTravel(fromLocation, toLocation) {
    const r = [];
    const distance = calcDistance(fromLocation.x, fromLocation.y, toLocation.x, toLocation.y);
    r.push(distance);

    const fuelPenalty = (fromLocation.type === 'PLANET' ? 2 : 0);
    const fuelCost = Math.round(Math.round(distance) / 4) + fuelPenalty + 1;
    r.push(fuelCost);

    // Calc travel time

    return r;
}