import { useState, useContext } from "react";
import { prettyNumber, sortAlphabetically } from "../../Utils";

import SystemsContext from "../../Contexts/SystemsContext";
import Stack from "react-bootstrap/esm/Stack";
import Button from "react-bootstrap/esm/Button";

export default function MarketTradeFormLocationSelect(props) {
    const [systems, setSystems] = useContext(SystemsContext);

    function changeLocation(location) {
        props.setSelectedLocation(location);
        props.closeSubForm();
    }

    function FormWrapper(props) {
        return (
            <div>
                <h3>Select location</h3>
                {props.children}
            </div>
        )
    }

    if (!systems || !Array.isArray(systems.systems)) {
        return (
            <FormWrapper>
                No system data.
            </FormWrapper>
        )
    }

    return (
        <FormWrapper>
            {systems.systems.map((system) => {
                return (
                    <Stack key={system.symbol} gap={3}>
                        <div className="fw-bold text-decoration-underline">{system.symbol} ({system.name})</div>
                        {system.locations.map((location) => {
                            return (
                                <Button key={location.symbol} variant="secondary" className="text-start"
                                    onClick={() => changeLocation(location)}
                                >
                                    {location.symbol} ({location.name})
                                </Button>
                            )
                        })}

                    </Stack>
                )
            })}
        </FormWrapper>
    )
}