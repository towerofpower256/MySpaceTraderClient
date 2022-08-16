// Credit to erebos
// https://github.com/Kaishiyoku/erebos/blob/dabf5933f88446be0babaca067c5b94e9b21c7ef/src/core/flight/estimateRouteFuelCost.js
export default function calcFuelCost(fromLocation, toLocation) {
    const penalty = fromLocation.type === 'PLANET' ? 2 : 0; // There's a fuel penalty when departing a planet
    const distance = calcDistance(fromLocation.x, fromLocation.y, toLocation.x, toLocation.y);

    return Math.round(Math.round(distance) / 4) + penalty + 1; // Round the distance down, divide by 4 (why?), round that down, apply the penalty, then add on 1 to round it up
}