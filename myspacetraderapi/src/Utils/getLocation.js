import { loadSystemsData } from "../Services/LocalStorage";

export default function getLocation(locationSymbol, systems) {
    if (!systems) systems = loadSystemsData();
    if (!systems || !systems.all_locations || !systems.all_locations.length) return; // Systems is empty or not an array, return nothing

    return systems.all_locations.find(s => s.symbol === locationSymbol);
}