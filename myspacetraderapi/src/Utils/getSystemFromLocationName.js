export default function getSystemFromLocationName(locName) {
    locName = ""+locName;
    return locName.split("-")[0];
}