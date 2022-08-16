import getShipCargoCount from "./getShipCargoCount";

export default function getShipFuelCount(shipObj) {
    return getShipCargoCount(shipObj, "FUEL");
}