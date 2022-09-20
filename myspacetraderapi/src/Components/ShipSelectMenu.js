

import { useEffect, useState } from "react";
import { loadPlayerShipsData } from "../Services/LocalStorage";
import sortCompareAlphabetically from "../Utils/sortCompareAlphabetically";
import ShipNameBadge from "./ShipNameBadge";
import ShipSpeedBadge from "./ShipSpeedBadge";
import ShipCargoBadge from "./ShipCargoBadge";
import ShipFuelBadge from "./ShipFuelBadge";
import ShipLoadingSpeedBadge from "./ShipLoadingSpeedBadge";
import Dropdown from "react-bootstrap/esm/Dropdown";
import Button from "react-bootstrap/esm/Button";

export default function ShipSelectMenu(props) {
    const onSelect = props.onSelect;
    const filterFunc = props.filter;
    const sortFunc = props.sort;
    const disabled = props.disabled;

    const [selectedShipId, setSelectedShipId] = useState();
    const [selectedShip, _setSelectedShip] = useState();
    const [shipList, setShipList] = useState(updateShipList());

    useEffect(() => {
        if (!selectedShipId) {
            setSelectedShip()
        } else {
            setSelectedShip(loadPlayerShipsData().find(s => s.id === selectedShipId));
        }
    }, [selectedShipId]);

    function setSelectedShip(a) {
        doOnSelect(a);
        _setSelectedShip(a);
    }

    function updateShipList() {
        let r = loadPlayerShipsData();

        if (typeof filterFunc === "function") r = r.filter(filterFunc);

        if (typeof sortFunc === "function") {
            r.sort((a, b) => sortFunc(a, b));
        } else {
            r.sort((a, b) => sortCompareAlphabetically(a._name, b._name));
        }

        return r;
    }

    function doOnSelect(...args) {
        if (typeof onSelect === "function") onSelect(...args);
    }

    return (
        <Dropdown 
        align="start"
        onSelect={(eventKey, event) => setSelectedShipId(event.currentTarget.dataset.shipId)}>
            <Dropdown.Toggle variant="">
                {!selectedShip && "Select a ship"}
                {selectedShip &&
                    <div>
                        <div className="d-flex flex-row flex-wrap">
                            <div>
                                <ShipNameBadge ship={selectedShip} />
                                <div className="fw-bold me-3">{selectedShip.type}</div>
                                <div className="text-muted">{selectedShip.manufacturer}</div>
                            </div>
                            <div className="d-flex">
                                <div>
                                    <ShipCargoBadge ship={selectedShip} />
                                    <ShipFuelBadge ship={selectedShip} />
                                    <ShipLoadingSpeedBadge ship={selectedShip} />
                                    <ShipSpeedBadge ship={selectedShip} />
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Dropdown.Toggle>
            <Dropdown.Menu>
                {shipList.length === 0 && 
                <Dropdown.Item disabled={true}>
                    No ships available
                </Dropdown.Item>
                
                }
                {shipList.map((ship, idx) => {
                    return (
                        <Dropdown.Item key={idx} data-ship-id={ship.id}>
                            <div className="d-flex flex-row flex-wrap">
                                <div>
                                    <ShipNameBadge ship={ship} />
                                    <div className="fw-bold me-3">{ship.type}</div>
                                    <div className="text-muted">{ship.manufacturer}</div>
                                </div>
                                <div className="d-flex">
                                    <div>
                                        <ShipCargoBadge ship={ship} />
                                        <ShipFuelBadge ship={ship} />
                                        <ShipLoadingSpeedBadge ship={ship} />
                                        <ShipSpeedBadge ship={ship} />
                                    </div>
                                </div>
                            </div>
                        </Dropdown.Item>
                    )
                })}

            </Dropdown.Menu>
        </Dropdown>
    )
}