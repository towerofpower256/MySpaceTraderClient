import getLocation from "./getLocation";

export default function getLocationName(locObj) {
    if (typeof locObj == "string") locObj = getLocation(locObj);
    if (!locObj) return "";
    return [locObj.symbol, " (", locObj.name, ")"].join("");
}