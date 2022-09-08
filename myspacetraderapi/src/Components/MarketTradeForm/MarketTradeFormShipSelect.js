import { useState, useContext } from "react";
import prettyNumber from "../../Utils/prettyNumber";
import sortAlphabetically from "../../Utils/sortAlphabetically";
import getShipFuelCount from "../../Utils/getShipFuelCount";

import SystemsContext from "../../Contexts/SystemsContext";
import PlayerShipsContext from "../../Contexts/PlayerShipsContext";
import Stack from "react-bootstrap/esm/Stack";
import Button from "react-bootstrap/esm/Button";

export default function MarketTradeFormShipSelect(props) {
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);
    const _closeSubForm = props.closeSubForm;
    const _location = props.selectedLocation;

    function changeShip(ship) {
        props.setSelectedShip(ship);
        _closeSubForm();
    }

    function FormWrapper(props) {
        return (
            <div>
                <div className="w-100">
                    <h3>Select ship</h3>
                    <div>{_location ? "" + _location.symbol + " (" + _location.name + ")" : ""}</div>
                    <Button variant="outline-secondary" size="sm" className="float-right"
                        onClick={() => _closeSubForm()}>Back</Button>
                </div>
                {props.children}
            </div>
        )
    }

    if (!Array.isArray(playerShips)) {
        return (
            <FormWrapper>
                No ships data.
            </FormWrapper>
        )
    }

    if (!_location) {
        return (
            <FormWrapper>
                Select a location first.
            </FormWrapper>
        )
    }

    let locShips = playerShips.filter((ship) => ship.location === _location.symbol);
    if (locShips.length == 0) {
        return (
            <FormWrapper>
                No ships at this location.
            </FormWrapper>
        )
    }
    return (
        <FormWrapper>
            {locShips.map((ship) => {
                return (
                    <Button key={ship.id} variant="secondary" className="text-start"
                        onClick={() => changeShip(ship)}
                    >
                        <div>{ship.type}</div>
                        <div className="fw-lighter">
                            Cargo: ({prettyNumber(ship.spaceAvailable)}/{prettyNumber(ship.maxCargo)}) Fuel: {prettyNumber(getShipFuelCount(ship))}
                        </div>
                    </Button>
                );
            })}
        </FormWrapper>
    )
}