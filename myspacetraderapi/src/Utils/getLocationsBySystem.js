export default function getLocationsBySystem(systemSymbol, systems) {
    if (!systems || !systems.all_locations || !systems.all_locations.length) return []; // Systems is empty or not an array, return nothing

    const r = [];
    systems.all_locations.forEach(location => {
        if (location.system === systemSymbol) {
            r.push({...location});
        }
    });

    return r;
}