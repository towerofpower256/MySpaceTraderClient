export function prettyNumber(a) {
    if (!a) return a;
    return a.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export function valOrDefault(val, def="(empty)") {
    if (!val || val === "") return def;
    return val;
}

export function readLocations(systems) {
    const r = systems;

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

    return r;
}