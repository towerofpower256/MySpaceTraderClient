import { loadSystemsData } from "../Services/LocalStorage";

export default function getLocationsBySystem(systemSymbol, systems) {
    if (!systems) systems = loadSystemsData();
    if (!systems || !systems.all_locations || !systems.all_locations.length) return []; // Systems is empty or not an array, return nothing
    systemSymbol = (""+systemSymbol).toLowerCase();

    const r = [];
    systems.all_locations.forEach(location => {
        if ((""+location.system).toLowerCase() === systemSymbol) {
            r.push({...location});
        }
    });

    return r;
}