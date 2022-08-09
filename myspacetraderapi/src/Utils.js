export function prettyNumber(a) {
    if (!a) return a;
    return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function valOrDefault(val, def="(empty)") {
    if (!val || val === "") return def;
    return val;
}

export function getLocation(locationSymbol, systems) {
    if (!systems || !systems.all_locations || !systems.all_locations.length) return; // Systems is empty or not an array, return nothing

    return systems.all_locations.find(s => s.symbol === locationSymbol);
}

export function getLocationsBySystem(systemSymbol, systems) {
    if (!systems || !systems.all_locations || !systems.all_locations.length) return []; // Systems is empty or not an array, return nothing

    const r = [];
    systems.all_locations.forEach(location => {
        if (location.system === systemSymbol) {
            r.push({...location});
        }
    });

    return r;
}

// Credit to erebos
// https://github.com/Kaishiyoku/erebos/blob/dabf5933f88446be0babaca067c5b94e9b21c7ef/src/core/flight/calculateDistance.js
// Uses Pythagorean theorum to calculate it.
export function calcDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}

// Credit to erebos
// https://github.com/Kaishiyoku/erebos/blob/dabf5933f88446be0babaca067c5b94e9b21c7ef/src/core/flight/estimateRouteFuelCost.js
export function calcFuelCost(fromLocation, toLocation) {
    const penalty = fromLocation.type === 'PLANET' ? 2 : 0; // There's a fuel penalty when departing a planet
    const distance = calcDistance(fromLocation.x, fromLocation.y, toLocation.x, toLocation.y);

    return Math.round(Math.round(distance) / 4) + penalty + 1; // Round the distance down, divide by 4 (why?), round that down, apply the penalty, then add on 1 to round it up
}

export function calcTravel(fromLocation, toLocation) {
    const r = [];
    const distance = calcDistance(fromLocation.x, fromLocation.y, toLocation.x, toLocation.y);
    r.push(distance);

    const fuelPenalty = (fromLocation.type === 'PLANET' ? 2 : 0);
    const fuelCost = Math.round(Math.round(distance) / 4) + fuelPenalty + 1;
    r.push(fuelCost);

    // Calc travel time

    return r;
}

export function readLocations(systems) {
    const r = {};
    r.systems = systems;
    r.all_locations = [];
    systems.forEach((system) => {
        if (system.locations) {
            system.locations.forEach(location => {
                location.system = system.symbol;
                r.all_locations.push(location);
            })
        }
    });

    /*
    r._systems = {};
    r._locations = {};

    systems.forEach(system => {
        r._systems[system.symbol] = system;
        if (system.locations) {
            system.locations.forEach(location => {
                r._locations[location.symbol] = location;
                location.system = system;
            })
        }
    });
    */

    return r;
}

export function insertOrUpdate(arr, obj, findFunc) {
    if (!Array.isArray(arr)) return arr; // Do nothing

    let i = arr.findIndex(findFunc);
    if (i === -1) {
        arr.push(obj);
    } else {
        arr[i] = obj;
    }

    return arr;
}

export function updateMarketData(mdContext, locationSymbol, newMD) {
    let md = mdContext.find(md => md.location === locationSymbol);
    if (md) {
        md.updatedAt = new Date();
        md.goods = newMD;
    } else {
        md.push({
            location: locationSymbol,
            updatedAt: new Date(),
            goods: newMD
        });
    }
    
}