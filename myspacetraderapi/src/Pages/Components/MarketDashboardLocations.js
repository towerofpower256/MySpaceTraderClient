import { useContext } from "react";
import { useParams } from "react-router-dom";
import { TbBuildingFactory2 } from "react-icons/tb";
import { loadSystemsData } from "../../Services/LocalStorage";

import SystemsContext from "../../Contexts/SystemsContext";
import MarketDashboardLocationCard from "./MarketDashboardLocationCard";
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
import humanizeString from "../../Utils/humanizeString";
import getLocationTrait from "../../Utils/getLocationTrait";

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

