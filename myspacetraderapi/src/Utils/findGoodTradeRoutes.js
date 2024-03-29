import sortCompareNumerically from "../Utils/sortCompareNumerically";
import calcTravel from "../Utils/calcTravel";
import getLocation from "../Utils/getLocation";
import getSystemFromLocationName from "./getSystemFromLocationName";

export default function findGoodTradeRoutes(marketData, options) {
    if (!options) options = {};
    let mdQueue = [...marketData] // Clone market datatype
        .filter(md => {
            if (Array.isArray(options.filter_locations) && !options.filter_locations.includes(md.location)) {
                return false;
            }

            return true;
        })

    console.log("Starting trade route search");

    const r = {};
    r.routes = [];

    // Scan through market data, all locations
    // Identify trade routes
    // Good, buy location, buy price, sell location, sell price, profit, distance, fuel cost, profit per volume profit per volume per distance
    for (let i1 = 0; i1 < mdQueue.length; i1++) {
        // TODO filter by location
        let md1 = mdQueue[i1];
        let md1System = getSystemFromLocationName(md1.location);
        for (let i2 = i1 + 1; i2 < mdQueue.length; i2++) {
            let md2 = mdQueue[i2];
            let md2System = getSystemFromLocationName(md2.location);

            if (md1System != md2System) continue; // Only check for locations in the same system.

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
                        let newTrade = createTradeRoute(mdGood1, md1.location, mdGood2, md2.location, options);
                        if (newTrade) {
                            r.routes.push(newTrade); // Only add if filtering didn't prevent it (e.g. no trade value)
                        }
                    }
                }
            }
        }
    };

    // Sort
    // TODO configurable sort
    const sortBy = options.sort_by || "profit_per_volume_per_fuel";
    r.routes.sort((a, b) => sortCompareNumerically(a[sortBy], b[sortBy], true));

    // Limit results
    if (options.result_limit)
        r.routes = r.routes.slice(0, options.result_limit);

    return r;
}

function createTradeRoute(mdGood1, mdGood1LocationName, mdGood2, mdGood2LocationName, options) {
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
        let [distance, fuelCost, travelTime] = calcTravel(mdGood1Location, mdGood2Location, shipSpeed);
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
        let [distance, fuelCost, travelTime] = calcTravel(mdGood2Location, mdGood1Location, shipSpeed);
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