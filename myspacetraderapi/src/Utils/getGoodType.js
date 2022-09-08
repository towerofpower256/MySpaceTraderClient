import { loadGoodTypes } from "../Services/LocalStorage";


export default function getGoodType(symbol) {
    return loadGoodTypes().find(g => g.symbol === symbol);
}