import { loadGoodTypes } from "../Services/LocalStorage";

export default function getGoodName(a) {
    
    return loadGoodTypes().find((type) => type.symbol === a).name || a;
}