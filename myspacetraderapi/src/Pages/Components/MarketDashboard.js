import { useContext, useState, useEffect } from "react";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Modal from 'react-bootstrap/Modal';

import MyPageTitle from "../../Components/MyPageTitle"
import MyPageSubTitle from "../../Components/MyPageSubTitle"
import SystemsContext from "../../Contexts/SystemsContext";
import MarketDataContext from "../../Contexts/MarketDataContext";
import sortAlphabetically from "../../Utils/sortAlphabetically";
import durationString from "../../Utils/durationString";
import prettyNumber from "../../Utils/prettyNumber";
import getLocationName from "../../Utils/getLocationName";
import MarketTradeForm from "../../Components/MarketTradeForm/MarketTradeForm";
import MarketHeader from "./MarketHeader";
import TimestampCount from "../../Components/TimestampCount";

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
        lastUpdated = md.updatedAt;
    }

    let goodsItems = [];
    if (md && Array.isArray(md.goods)) {
        goodsItems = [...md.goods];
        sortAlphabetically(goodsItems, "symbol");
    }

    return (
        <Card className="mb-3">
            <Card.Header className="text-start">
                {getLocationName(props.location)}
                <small className="float-end text-muted"><TimestampCount value={lastUpdated} placeholder="" options={{ hide_seconds: true, suffix_past: "ago" }} /></small>
            </Card.Header>
            <Card.Body>
                <div className="text-start">
                    {!md || !md.goods ? <span className="text-muted">No data</span> : undefined}
                    <Table striped>
                        <tbody>
                            {goodsItems.map((good) => {
                                return (
                                    <tr key={good.symbol}>
                                        <td>
                                            <div className="row" key={good.symbol}>
                                                <div className="col-12">
                                                    <span className="fw-bold">{good.symbol}</span>
                                                    <div className="float-end">
                                                        <Button size="sm" className="me-1" variant="outline-primary"
                                                            data-location-id={props.location.symbol} data-good-id={good.symbol}
                                                            onClick={handleTradeClick}>
                                                            Trade
                                                        </Button>
                                                    </div>
                                                </div>

                                                <div className="col-6">Buy: <span className="fw-light">${prettyNumber(good.purchasePricePerUnit)}</span></div>
                                                <div className="col-6">Qty: <span className="fw-light">{prettyNumber(good.quantityAvailable)}</span></div>
                                                <div className="col-6">Sell: <span className="fw-light">${prettyNumber(good.sellPricePerUnit)}</span></div>
                                                <div className="col-6">Spread: <span className="fw-light">&plusmn; ${prettyNumber(good.spread)}</span></div>

                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                            }
                        </tbody>
                    </Table>
                </div>

                <Modal show={showTradeModal} onHide={handleTradeClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Market Trade</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <MarketTradeForm locationID={tradeFormLocation} goodID={tradeFormGood} action={tradeFormAction} />
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
                <Col lg={3} md={4} sm={6} xs={12} key={location.symbol}>
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

export default function MarketDashboard(props) {
    const [systems, setSystems] = useContext(SystemsContext);
    const [state, setState] = useState([]);
    const [activeKey, setActiveKey] = useState(null);

    useEffect(() => {
        // On mount

        state.defaultTab = systems.systems[0].symbol;
        state.marketTabs = systems.systems.map((system) => {
            return (
                <Tab eventKey={system.symbol} key={system.symbol} title={"" + system.name + " (" + system.symbol + ")"}>
                    <MarketPageSystem systemID={system.symbol} />
                </Tab>
            )
        });
        setState({ ...state });
        setActiveKey(state.defaultTab);
    }, []);

    function PageWrapper(props) {
        return (
            <div>
                {props.children}
            </div>
        )
    }

    if (!systems || !systems.systems) {
        return (
            <PageWrapper>
                Systems data hasn't been loaded yet.
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            <Tabs
                defaultActiveKey={state.defaultTab}
                activeKey={activeKey}
                onSelect={(k) => setActiveKey(k)}
                id="market-dashboard-tabs"
                className="mb-3"
            >
                {state.marketTabs}
            </Tabs>
        </PageWrapper>
    )
}