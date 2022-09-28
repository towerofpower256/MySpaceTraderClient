import sortCompareNumerically from "../Utils/sortCompareNumerically";
import calcTravelTime from "../Utils/calcTravelTime";
import calcDistance from "../Utils/calcDistance";
import calcTravel from "./calcTravel";
import getSystemFromLocationName from "./getSystemFromLocationName";
import calcFuelCost from "./calcFuelCost";
import getLocation from "./getLocation";

const WORMHOLE_TRAVEL_TIME = 100; // It always takes 100 seconds to traverse a wormhole between systems

export default function findGoodTradeRoutesV2(marketData, systemData, options) {
    if (!options) options = {};

    console.log("Starting trade route search");

    let mdQueue = [...marketData] // Clone market datatype
        .filter(md => {
            if (Array.isArray(options.filter_locations) && !options.filter_locations.includes(md.location)) {
                return false;
            }

            return true;
        })



    const r = {};
    r.routes = [];

    console.log("Building route graphs");

    const systemGraphs = [].concat(systemData.systems.map((system) => buildSystemGraph(system.locations, options)));
    const universeGraph = buildUniverseGraph(systemData.systems, systemGraphs, options);

    console.log("Finding good deals");

    for (let i1 = 0; i1 < mdQueue.length; i1++) {
        let md1 = mdQueue[i1];
        let md1System = getSystemFromLocationName(md1.location);
        for (let i2 = i1 + 1; i2 < mdQueue.length; i2++) {
            let md2 = mdQueue[i2];
            let md2System = getSystemFromLocationName(md2.location);

            if (!options.multi_system && md1System !== md2System) continue; // Only allow routes in the same system

            console.log("Scanning ", md1.location, "<->", md2.location);

            for (let iGood1 = 0; iGood1 < md1.goods.length; iGood1++) {
                let mdGood1 = md1.goods[iGood1];

                if (Array.isArray(options.filter_goods) && !options.filter_goods.includes(mdGood1.symbol)) {
                    continue; // Skip this one, not one of the good types we want
                }

                for (let iGood2 = 0; iGood2 < md2.goods.length; iGood2++) {
                    let mdGood2 = md2.goods[iGood2];

                    if (mdGood1.symbol === mdGood2.symbol) {
                        // Good traded at both locations. Add to the list of routes

                        let newTrade = createTradeRoute(mdGood1, md1.location, mdGood2, md2.location, options, systemGraphs, universeGraph);
                        if (newTrade) {
                            r.routes.push(newTrade); // Only add if filtering didn't prevent it (e.g. no trade value)
                        }
                    }
                }
            }
        }
    }

    // Sort
    // TODO configurable sort
    const sortBy = options.sort_by || "profit_per_volume_per_fuel";
    r.routes.sort((a, b) => sortCompareNumerically(a[sortBy], b[sortBy], true));

    // Limit results
    if (options.result_limit)
        r.routes = r.routes.slice(0, options.result_limit);

    return r;
}

function createTradeRoute(mdGood1, mdGood1LocationName, mdGood2, mdGood2LocationName, options, systemGraphs, universeGraph) {
    let r = {};
    r.good = mdGood1.symbol;
    r.good_volume = mdGood1.volumePerUnit;
    r.profit = 0;

    let atobValue = mdGood2.sellPricePerUnit - mdGood1.purchasePricePerUnit;
    let btoaValue = mdGood1.sellPricePerUnit - mdGood2.purchasePricePerUnit;
    if (atobValue <= 0 && btoaValue <= 0) {
        // Either way is a loss
        return;
    }
    if (atobValue == 0 && btoaValue == 0) {
        // No value in trade, either way
        return;
    }

    let mdGood1Location = getLocation(mdGood1LocationName);
    if (!mdGood1Location) {
        throw ("Unknown location named: " + mdGood1LocationName);
    }
    let mdGood2Location = getLocation(mdGood2LocationName);
    if (!mdGood2Location) {
        throw ("Unknown location named: " + mdGood2LocationName);
    }

    const shipSpeed = parseInt(options.ship_speed);
    const shipCargoSize = parseInt(options.ship_cargo_size);

    if (atobValue > btoaValue) { // TODO additional conditions

        let [distance, fuelCost, travelTime, route] = calcTravelAdvanced(mdGood1Location, mdGood2Location, shipSpeed, systemGraphs, universeGraph);
        r.route = route;
        r.buy_location = mdGood1Location.symbol;
        r.buy_price = mdGood1.purchasePricePerUnit;
        r.sell_location = mdGood2Location.symbol;
        r.sell_price = mdGood2.sellPricePerUnit;
        r.profit = atobValue;
        r.quantity = mdGood1.quantityAvailable;
        r.distance = distance;
        r.fuel_cost = fuelCost;
        if (shipSpeed) r.travel_time = travelTime;
    }
    if (btoaValue > atobValue) { // TODO additional conditions
        let [distance, fuelCost, travelTime, route] = calcTravelAdvanced(mdGood2Location, mdGood1Location, shipSpeed, systemGraphs, universeGraph);
        r.route = route;
        r.buy_location = mdGood2Location.symbol;
        r.buy_price = mdGood2.purchasePricePerUnit;
        r.sell_location = mdGood1Location.symbol;
        r.sell_price = mdGood1.sellPricePerUnit;
        r.profit = btoaValue;
        r.quantity = mdGood2.quantityAvailable;
        r.distance = distance;
        r.fuel_cost = fuelCost;
        if (shipSpeed) r.travel_time = travelTime;
    }

    // Calc other stuff
    r.profit_per_volume = (r.profit / r.good_volume);
    r.profit_per_volume_per_distance = (r.profit_per_volume / r.distance);
    r.profit_per_volume_per_fuel = (r.profit_per_volume / r.fuel_cost);

    if (shipSpeed && shipCargoSize) {
        // How many units the ship can carry in a single run
        // (Cargo hold capacity - fuel for a return trip) / good volume, rounded down
        r.trade_run_quantity = Math.floor((shipCargoSize - (r.fuel_cost * 2)) / r.good_volume);
        r.trade_run_profit = (r.trade_run_quantity * r.profit);

        // Profit per return trip, assuming empty cargo hold on the way back.
        r.trade_run_profit_per_second = (r.trade_run_profit / (r.travel_time * 2));
    }

    // TODO filtering logic for weak or undesirable trades

    console.log("Trade route", r);
    return r;
}

function calcTravelAdvanced(startLoc, endLoc, shipSpeed, systemGraphs, universeGraph) {
    const startLocSystem = startLoc.symbol.split("-")[0];
    const endLocSystem = endLoc.symbol.split("-")[0];

    if (startLocSystem === endLocSystem) {
        // Is in the same system
        return calcTravel(startLoc, endLoc, shipSpeed).concat([[startLoc.symbol, endLoc.symbol]]);
    }

    // Start and end are not in the same system
    // Find the route
    const rootSystemGraph = universeGraph.find(g => g.system === startLocSystem);
    const universeRoute = rootSystemGraph.routes.find(r => r.system === endLocSystem);

    // Start the counts with the system traveling counts
    let distance = universeRoute.distance;
    let fuelCost = universeRoute.fuelCost;
    let travelTime = universeRoute.travelTime;

    // Then, add the travel from start to 1st gateway
    let [startDistance, startFuelCost, startTravelTime] = calcTravel(startLoc, getLocation(universeRoute.route[0]), shipSpeed);
    distance += startDistance;
    fuelCost += startFuelCost;
    travelTime += startTravelTime;

    // Then, add the travel from last gateway to end
    let [endDistance, endFuelCost, endTravelTime] = calcTravel(getLocation(universeRoute.route[0]), endLoc, shipSpeed);
    distance += endDistance;
    fuelCost += endFuelCost;
    travelTime += endTravelTime;

    let route = [].concat([startLoc.symbol], universeRoute.route, [endLoc.symbol]);

    return [distance, fuelCost, travelTime, route];
}

function buildUniverseGraph(systemData, systemGraphs, options) {
    // Bugger it, just hard code the graph for now
    const shipSpeed = options.ship_speed || 1;
    return [
        {
            system: "OE",
            neighbours: [
                {
                    system: "XV",
                    gateway: "OE-W-XV"
                }
            ],
            routes: [
                {
                    system: "XV",
                    distance: 0,
                    fuelCost: 0,
                    travelTime: (WORMHOLE_TRAVEL_TIME),
                    route: ["OE-W-XV", "XV-W-OE"]
                },
                {
                    system: "ZY1",
                    distance: 95.131488,
                    fuelCost: Math.round(Math.floor(95.131488) / 8) + 1,
                    travelTime: (WORMHOLE_TRAVEL_TIME + calcTravelTime(95.131488, shipSpeed) + WORMHOLE_TRAVEL_TIME),
                    route: ["OE-W-XV", "XV-W-OE", "XV-W-ZY1", "ZY1-W-XV"]
                },
                {
                    system: "NA7",
                    distance: 292.972333,
                    fuelCost: Math.round(Math.floor(292.972333) / 8) + 1,
                    travelTime: (WORMHOLE_TRAVEL_TIME + calcTravelTime(95.131488, shipSpeed) + WORMHOLE_TRAVEL_TIME + calcTravelTime(197.840845, shipSpeed) + WORMHOLE_TRAVEL_TIME),
                    route: ["OE-W-XV", "XV-W-OE", "XV-W-ZY1", "ZY1-W-XV", "ZY1-W-NA7", "NA7-W-ZY1"]
                }
            ]
        },
        {
            system: "XV",
            neighbours: [
                {
                    system: "OE",
                    gateway: "XV-W-OE"
                },
                {
                    system: "ZY1",
                    gateway: "XV-W-Z1"
                }
            ],
            routes: [
                {
                    system: "OE",
                    distance: 0,
                    fuelCost: 0,
                    travelTime: (WORMHOLE_TRAVEL_TIME),
                    route: ["XV-W-OE", "OE-W-XV"]
                },
                {
                    system: "ZY1",
                    distance: 0,
                    fuelCost: 0,
                    travelTime: (WORMHOLE_TRAVEL_TIME),
                    route: ["XV-W-ZY1", "ZY1-W-XV"]
                },
                {
                    system: "NA7",
                    distance: 197.840845,
                    fuelCost: Math.round(Math.floor(197.840845) / 8) + 1,
                    travelTime: (WORMHOLE_TRAVEL_TIME + calcTravelTime(197.840845, shipSpeed) + WORMHOLE_TRAVEL_TIME),
                    route: ["XV-W-ZY1", "ZY1-W-XV", "ZY1-W-NA7", "NA7-W-ZY1"]
                }
            ]
        },
        {
            system: "ZY1",
            neighbours: [
                {
                    system: "XV",
                    gateway: "ZY1-W-XV"
                },
                {
                    system: "NA7",
                    gateway: "ZY1-W-NA7"
                }
            ],
            routes: [
                {
                    system: "OE",
                    distance: 95.131488,
                    fuelCost: Math.round(Math.floor(95.131488) / 8) + 1,
                    travelTime: (WORMHOLE_TRAVEL_TIME + calcTravelTime(95.131488, shipSpeed) + WORMHOLE_TRAVEL_TIME),
                    route: ["ZY1-W-XV", "XV-W-ZY1", "XV-W-OE", "OE-W-XV"]
                },
                {
                    system: "XV",
                    distance: 0,
                    fuelCost: 0,
                    travelTime: (WORMHOLE_TRAVEL_TIME),
                    route: ["ZY1-W-XV", "XV-W-ZY1"]
                },
                {
                    system: "NA7",
                    distance: 0,
                    fuelCost: 0,
                    travelTime: (WORMHOLE_TRAVEL_TIME),
                    route: ["ZY1-W-NA7", "NA7-W-ZY1"]
                }
            ]
        },
        {
            system: "NA7",
            neighbours: [
                {
                    system: "ZY1",
                    gateway: "NA7-W-NA7"
                }
            ],
            routes: [
                {
                    system: "OE",
                    distance: 292.972333,
                    fuelCost: Math.round(Math.floor(292.972333) / 8) + 1,
                    travelTime: (WORMHOLE_TRAVEL_TIME + calcTravelTime(197.840845, shipSpeed) + WORMHOLE_TRAVEL_TIME + calcTravelTime(95.131488, shipSpeed) + WORMHOLE_TRAVEL_TIME),
                    route: ["NA7-W-ZY1", "ZY1-W-NA7", "ZY1-W-XV", "XV-W-ZY1", "XV-W-OE", "OE-W-XV"]
                },
                {
                    system: "XV",
                    distance: 197.840845,
                    fuelCost: Math.round(Math.floor(197.840845) / 8) + 1,
                    travelTime: (WORMHOLE_TRAVEL_TIME + calcTravelTime(197.840845, shipSpeed) + WORMHOLE_TRAVEL_TIME),
                    route: ["NA7-W-ZY1", "ZY1-W-NA7", "ZY1-W-XV", "XV-W-ZY1"]
                },
                {
                    system: "ZY1",
                    distance: 0,
                    fuelCost: 0,
                    travelTime: (WORMHOLE_TRAVEL_TIME),
                    route: ["NA7-W-ZY1", "ZY1-W-NA7"]
                }
            ]
        }
    ]
}

function getWormholeTargetSystemName(whName) {
    let whNameSplit = ("" + whName).split("-");
    if (whNameSplit.length !== 3) return;
    return whNameSplit[3];
}

function buildSystemGraph(systemLocations, options) {
    let r = [];
    const shipSpeed = options.ship_speed || 1;

    let locQueue = systemLocations.slice();
    while (locQueue.length > 0) {
        let rootLoc = locQueue.pop();
        let rLoc = [];
        for (let iLoc = 0; iLoc < systemLocations.length; iLoc++) {
            let nextLoc = systemLocations[iLoc];
            if (nextLoc.symbol === rootLoc.symbol) continue; // Don't measure distance to yourself

            let [distance, fuelCost, travelTime] = calcTravel(rootLoc, nextLoc, shipSpeed);
            rLoc.push({
                dest: nextLoc.symbol,
                distance: distance,
                fuelCost: fuelCost,
                travelTime: travelTime
            })
        }

        r.push({ location: rootLoc.symbol, links: rLoc });
    }

    return r;
}