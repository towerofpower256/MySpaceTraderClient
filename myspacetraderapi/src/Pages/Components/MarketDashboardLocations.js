import { useContext } from "react";
import { useParams } from "react-router-dom";
import { TbBuildingFactory2 } from "react-icons/tb";
import { loadSystemsData } from "../../Services/LocalStorage";

import SystemsContext from "../../Contexts/SystemsContext";
import ListGroupItem from "react-bootstrap/esm/ListGroupItem";
import ListGroup from "react-bootstrap/esm/ListGroup";
import Card from "react-bootstrap/esm/Card";
import Container from "react-bootstrap/esm/Container";
import Row from "react-bootstrap/esm/Row";
import Col from "react-bootstrap/esm/Col";
import Table from "react-bootstrap/esm/Table";

import getLocation from "../../Utils/getLocation";
import getLocationsBySystem from "../../Utils/getLocationsBySystem";
import getLocationName from "../../Utils/getLocationName";
import prettyNumber from "../../Utils/prettyNumber";
import getGoodName from "../../Utils/getGoodName";
import MarketDataContext from "../../Contexts/MarketDataContext";
import TimestampCount from "../../Components/TimestampCount";
import sortCompareAlphabetically from "../../Utils/sortCompareAlphabetically";
import LocationPlayerShipCountBadge from "../../Components/LocationPlayerShipCountBadge";
import Badge from "react-bootstrap/esm/Badge";
import LocationMarketVisibilityBadge from "../../Components/LocationMarketVisibilityBadge";

export default function MarketDashboardLocations(props) {
    let parms = useParams();
    const locations = getLocationsBySystem(parms.systemid);

    return (
        <Container>
            <Row>
                {locations.map((loc, idx) => {
                    return (
                        <Col lg={3} md={4} sm={6} xs={12} key={loc.symbol}>
                            <MarketDashboardLocationCard location={loc.symbol} />
                        </Col>
                    )
                })}
            </Row>
        </Container>
    )
}

function MarketDashboardLocationCard(props) {
    const [systemData, setSystemData] = useContext(SystemsContext);
    const locId = props.location;
    const loc = getLocation(locId, systemData);

    if (!loc) {
        return (
            <div className="d-none">Unknown location: {locId}</div>
        )
    }

    return (
        <Card className="mb-3">
            <Card.Header>
                {getLocationName(loc)}
                <div>
                    <LocationMarketVisibilityBadge locationId={loc.symbol} />
                    <LocationPlayerShipCountBadge locationId={loc.symbol} />
                </div>
            </Card.Header>
            <Card.Body className="p-0">
                <ListGroup variant="flush">
                    <ListGroupItem>
                        <div className="float-end">X: {loc.x} Y: {loc.y}</div>
                        <div>{loc.type}</div>

                        <div className={"" + (!loc.allowsConstruction ? " text-muted" : "")}>
                            <TbBuildingFactory2 className="me-2" />Construction{!loc.allowsConstruction ? " not" : ""} allowed
                        </div>
                    </ListGroupItem>
                    <ListGroupItem>
                        <div>Traits</div>
                        <div className={!Array.isArray(loc.traits) && "text-muted"}>
                            {!Array.isArray(loc.traits) ? "Unknown" :
                                (loc.traits.length < 1
                                    ? "(none)"
                                    : loc.traits.join(", ")
                                )}
                        </div>
                    </ListGroupItem>
                    <ListGroupItem>
                        <MarketDashboardLocationMarket location={loc.symbol} />
                    </ListGroupItem>
                </ListGroup>

            </Card.Body>
        </Card>
    )
}

function MarketDashboardLocationMarket(props) {
    const locId = props.location;
    const [marketData, setMarketData] = useContext(MarketDataContext);
    const locMarketData = marketData.find(md => md.location === locId);

    if (!locMarketData || !Array.isArray(locMarketData.goods)) {
        return (
            <small className="text-muted">
                <span className="text-muted">No data</span>
            </small>
        )
    }

    locMarketData.goods.sort((a, b) => sortCompareAlphabetically(a.good, b.good))

    return (
        <div>


            <Table striped size="sm">
                <tbody>
                    <tr>
                        <td>
                            <small className="float-end text-muted">
                                <TimestampCount value={locMarketData.updatedAt} placeholder="" options={{ hide_seconds: true, suffix_past: "ago" }} />
                            </small>
                        </td>
                    </tr>
                    {locMarketData.goods.map((good, idx) => {
                        return (
                            <tr key={good.symbol}>
                                <td>
                                    <div className="row" key={good.symbol}>
                                        <div className="col-12">
                                            <span className="fw-bold">{getGoodName(good.symbol)}</span>
                                        </div>

                                        <div className="col-6 text-primary">Buy: <span className="fw-light">${prettyNumber(good.purchasePricePerUnit)}</span></div>
                                        <div className="col-6">Qty: <span className="fw-light">{prettyNumber(good.quantityAvailable)}</span></div>
                                        <div className="col-6 text-success">Sell: <span className="fw-light">${prettyNumber(good.sellPricePerUnit)}</span></div>
                                        <div className="col-6">Spread: <span className="fw-light">&plusmn; ${prettyNumber(good.spread)}</span></div>

                                    </div>
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>
        </div>
    )
}