import generateShipName from "./generateShipName";

export default function populateShipNames(shipArr) {
    if (!Array.isArray(shipArr)) return shipArr;

    shipArr.forEach(s => {
        if (!s._name) {
            s._name = generateShipName(s.id);
        }
    })

    return shipArr;
}