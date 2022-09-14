import { useContext, useEffect, useState } from "react";
import { getShips, readResponse } from "../Services/SpaceTraderApi.js";
import { Link } from "react-router-dom";
import TimestampCount from "../Components/TimestampCount";
import PlayerShipsContext from "../Contexts/PlayerShipsContext.js";
import FlightPlansContext from "../Contexts/FlightPlansContext.js";
import MyPageTitle from "../Components/MyPageTitle.js";
import setPageTitle from "../Utils/setPageTitle.js";
import getShipFuelCount from "../Utils/getShipFuelCount.js";
import valOrDefault from "../Utils/valOrDefault.js";

import Button from "react-bootstrap/esm/Button.js";
import ButtonGroup from "react-bootstrap/esm/ButtonGroup.js";
import Card from "react-bootstrap/esm/Card.js";
import Col from "react-bootstrap/esm/Col";
import Container from "react-bootstrap/esm/Container.js";
import Row from "react-bootstrap/esm/Row.js";

export default function ShipListPage(props) {
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);

    useEffect(() => { setPageTitle("Ships") }, []);

    function PageWrapper(props) {
        return (
            <div>
                <MyPageTitle>Ships</MyPageTitle>
                {props.children}
            </div>
        )
    }

    return (
        <PageWrapper>
            <Container>
                <Row>
                    {playerShips.map((ship) => {
                        return <Col xs={12} sm={6} md={3} key={ship.id}>
                            <ShipListCard ship={ship} />
                        </Col>
                    })}
                </Row>
            </Container>


            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Ship type</td>
                        <td>Location</td>
                        <td>Class</td>
                        <td>Manufacturer</td>
                        <td>Cargo</td>
                        <td>S / P / W</td>
                    </tr>
                </thead>
                <tbody>
                    {playerShips.map((ship, index) => {
                        return (
                            <tr key={ship.id}>
                                <td><Link to={ship.id}>{ship.id}</Link></td>
                                <td>{ship.type}</td>
                                <td>{ship.location}</td>
                                <td>{ship.class}</td>
                                <td>{ship.manufacturer}</td>
                                <td>{ship.spaceAvailable} / {ship.maxCargo}</td>
                                <td>{ship.speed} / {ship.plating} / {ship.weapons}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </PageWrapper>
    )
}

function ShipListCard(props) {
    const ship = props.ship;

    const [flightPlans, setFlightPlans] = useContext(FlightPlansContext);
    const [location, setLocation] = useState(getLocationValue());

    useEffect(() => {
        setLocation(getLocationValue());
    }, [flightPlans]);

    function getLocationValue() {
        let fp = flightPlans.find((_fp) => _fp.shipId === ship.id);
        if (fp) {
            if (new Date(fp.arrivesAt) > new Date()) {
                return <TimestampCount value={fp.arrivesAt} variant="raw" formatter={(a) => a + " until " + fp.destination} />;
            }
        } else {
            return <span>{valOrDefault(props.ship.location, "(in transit)")}</span>;
        }
    }

    return (
        <Card data-id={ship.id}>
            <Card.Body>
                <Card.Title>{ship.type}</Card.Title>
                <div>Location: {location}</div>
                <div>Cargo: {ship.spaceAvailable} / {ship.maxCargo}</div>
                <div>Fuel: {getShipFuelCount(ship)}</div>
            </Card.Body>
            <Card.Footer>
                <ButtonGroup className="w-100">
                    <Button variant="outline-secondary">Move</Button>
                    <Button variant="outline-secondary">Trade</Button>
                    <Button variant="outline-secondary">Manage</Button>
                </ButtonGroup>
            </Card.Footer>
        </Card>
    )
}