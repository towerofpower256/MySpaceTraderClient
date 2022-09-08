import { useState, useContext } from "react";
import prettyNumber from "../../Utils/prettyNumber";
import sortAlphabetically from "../../Utils/sortAlphabetically";
import MarketDataContext from "../../Contexts/MarketDataContext";

import Stack from "react-bootstrap/esm/Stack";
import Button from "react-bootstrap/esm/Button";

export default function MarketTradeFormGoodSelect(props) {
    const [marketData, setMarketData] = useContext(MarketDataContext);
    const _location = props.selectedLocation;
    const _closeSubForm = props.closeSubForm;

    function changeGood(good) {
        props.setSelectedGood(good);
        _closeSubForm();
    }

    function FormWrapper(props) {
        return (
            <div>
                <div className="w-100">
                    <h3>Select good to trade</h3>
                    <div>{_location ? "" + _location.symbol + " (" + _location.name + ")" : ""}</div>
                    <Button variant="outline-secondary" size="sm" className="float-right"
                        onClick={() => _closeSubForm()}>Back</Button>
                </div>
                {props.children}
            </div>
        )
    }

    if (!_location) {
        return (
            <FormWrapper>
                Select a location first.
            </FormWrapper>
        )
    }

    if (!Array.isArray(marketData)) {
        return (
            <FormWrapper>
                No market data.
            </FormWrapper>
        )
    }

    let _locMarketData = marketData.find((md) => md.location === _location.symbol);

    if (!_locMarketData || !Array.isArray(_locMarketData.goods)) {
        return (
            <FormWrapper>
                No market data for this location.
            </FormWrapper>
        )
    }

    if (_locMarketData.goods.length == 0) {
        return (
            <FormWrapper>
                No goods are available at this location.
            </FormWrapper>
        )
    }

    let _locGoods = [..._locMarketData.goods];
    sortAlphabetically(_locGoods, "symbol");

    // The actual form
    return (
        <FormWrapper>
            <Stack gap={3}>
                {_locGoods.map((good) => {
                    return (
                        <Button variant="secondary" className="text-start"
                            data-good-id={good.symbol}
                            onClick={() => changeGood(good)}
                        >
                            <div className="fw-bold">{good.symbol}</div>
                            <div className="pl-2 fw-lighter">Qty: {prettyNumber(good.quantityAvailable)}</div>
                            <div className="pl-2 fw-lighter">Buy: ${prettyNumber(good.purchasePricePerUnit)}</div>
                            <div className="pl-2 fw-lighter">Sell: ${prettyNumber(good.sellPricePerUnit)}</div>
                        </Button>
                    )
                })}
            </Stack>
        </FormWrapper>
    )


}