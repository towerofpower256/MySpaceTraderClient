export default function getShipCargoCount(shipObj, cargoSymbol) {
    if (!shipObj || !Array.isArray(shipObj.cargo)) {
        return;
    }

    const cargo = shipObj.cargo.find((c) => c.good === cargoSymbol);
    if (!cargo) return 0;
    return cargo.quantity;
}