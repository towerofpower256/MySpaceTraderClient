export default function readLocations(systems) {
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

    return r;
}