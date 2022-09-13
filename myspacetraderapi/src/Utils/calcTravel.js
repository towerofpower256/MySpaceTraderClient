import calcDistance from "./calcDistance";
import calcTravelTime from "./calcTraveTime";

// Credit to erebos
// https://github.com/Kaishiyoku/erebos/blob/dabf5933f88446be0babaca067c5b94e9b21c7ef/src/core/flight/estimateRouteFuelCost.js
// https://github.com/Kaishiyoku/erebos/blob/dabf5933f88446be0babaca067c5b94e9b21c7ef/src/core/flight/calculateDistance.js
export default function calcTravel(fromLocation, toLocation, shipSpeed) {
    if (shipSpeed) shipSpeed = 1;

    const r = [];
    const distance = calcDistance(fromLocation.x, fromLocation.y, toLocation.x, toLocation.y);
    r.push(distance);

    const fuelPenalty = (fromLocation.type === 'PLANET' ? 2 : 0);
    const fuelCost = Math.round(Math.floor(distance) / 8) + fuelPenalty + 1;
    r.push(fuelCost);

    const travelTime = calcTravelTime(distance, shipSpeed);
    r.push(travelTime);


    return r;
}