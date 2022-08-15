import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';

import MyPageTitle from "../Components/MyPageTitle"
import MyPageSubTitle from "../Components/MyPageSubTitle"
import SystemsContext from "../Contexts/SystemsContext";
import MarketDataContext from "../Contexts/MarketDataContext";
import { useContext, useState } from "react";
import { sortAlphabetically, prettyNumber } from "../Utils"
import MarketTradeForm from "../Components/MarketTradeForm/MarketTradeForm";


function MarketPageSystemCard(props) {
    const [showTradeModal, setShowTradeModal] = useState(false);
    const [tradeFormLocation, setTradeFormLocation] = useState(null);
    const [tradeFormGood, setTradeFormGood] = useState(null);
    const [tradeFormAction, setTradeFormAction] = useState(null);
    const [marketData, setMarketData] = useContext(MarketDataContext);

    function handleTradeClose(e) {
        setShowTradeModal(false);
        setTradeFormLocation(null);
        setTradeFormGood(null);
    }

    function handleTradeClick(e) {
        setTradeFormLocation(e.currentTarget.dataset.locationId);
        setTradeFormGood(e.currentTarget.dataset.goodId);
        setShowTradeModal(true);
    }

    const md = marketData.find((md) => { return md.location === props.location.symbol });

    let lastUpdated = "";

    if (md) {
        lastUpdated = "Updated ";
    }

    let goodsItems = [];
    if (md && Array.isArray(md.goods)) {
        const _goods = md.goods;
        sortAlphabetically(_goods, "symbol");
        goodsItems = _goods.map((good) => {
            return (
                <div key={good.symbol} className="text-sm mb-3">
                    <div className="fw-bold">
                        {good.symbol}

                    </div>
                    <div className="pl-2">
                        <Button size="sm" className="me-1" variant="outline-primary"
                            data-location-id={props.location.symbol} data-good-id={good.symbol}
                            onClick={handleTradeClick}>Trade</Button>
                    </div>
                    <div className="pl-2">Qty: {prettyNumber(good.quantityAvailable)}</div>
                    <div className="pl-2">Buy: ${prettyNumber(good.purchasePricePerUnit)}</div>
                    <div className="pl-2">Sell: ${prettyNumber(good.sellPricePerUnit)}</div>
                    <div className="pl-2">Spread: &plusmn; ${prettyNumber(good.spread)}</div>
                </div>
            );
        })
    }

    return (
        <Card className="mb-3">
            <Card.Header className="text-start">
                {props.location.symbol} ({props.location.name})
                <small className="float-end text-muted">{lastUpdated}</small>
            </Card.Header>
            <Card.Body>
                <div className="text-start">
                    {!md || !md.goods ? <span className="text-muted">No data</span> : goodsItems}
                </div>

                <Modal show={showTradeModal} onHide={handleTradeClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Market Trade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MarketTradeForm locationID={tradeFormLocation} goodID={tradeFormGood} action={tradeFormAction}/>
                    </Modal.Body>
                </Modal>
            </Card.Body>
        </Card>
    )
}

function MarketPageSystem(props) {
    const [systems, setSystems] = useContext(SystemsContext);

    let items = [];
    if (Array.isArray(systems.all_locations)) {
        let _locations = systems.all_locations.filter((l) => l.system === props.systemID);
        sortAlphabetically(_locations, "symbol");

        items = _locations.map((location, idx) => {
            return (
                <Col md={3} sm={6} xs={12} key={idx}>
                    <MarketPageSystemCard location={location} key={location.symbol} />
                </Col>
            )
        });
    }

    return (
        <Container fluid>
            <Row>
                {items}
            </Row>
        </Container>
    )

}

export default function MarketPage(props) {
    const [systems, setSystems] = useContext(SystemsContext);

    if (!systems || !systems.systems) {
        return (
            <div>
                <MyPageTitle>Markets</MyPageTitle>
                <div>
                    <MyPageSubTitle>System</MyPageSubTitle>
                    Systems data hasn't been loaded yet.
                </div>
            </div>
        )
    }

    const defaultTab = systems.systems[0].symbol;
    const marketTabs = systems.systems.map((system) => {
        return (
            <Tab eventKey={system.symbol} key={system.symbol} title={"" + system.name + " (" + system.symbol + ")"}>
                <MarketPageSystem systemID={system.symbol} />
            </Tab>
        )
    })

    return (
        <div>
            <MyPageTitle>Markets</MyPageTitle>
            <div>
                <MyPageSubTitle>System</MyPageSubTitle>
                <Tabs
                    defaultActiveKey={defaultTab}
                    id="market-tabs"
                    className="mb-3">
                    {marketTabs}
                </Tabs>
            </div>
        </div>
    )
}