import { loadSystemsData } from "../Services/LocalStorage";

export default function getSystem(systemSymbol, systemData) {
    if (!systemData) systemData = loadSystemsData();
    systemSymbol = (""+systemSymbol).toLowerCase();

    if (!Array.isArray(systemData.systems)) return;
    return systemData.systems.find(s => (""+s.symbol).toLowerCase() === systemSymbol);
}