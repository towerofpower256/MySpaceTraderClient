import { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { GiOrbital } from "react-icons/gi";
import { TbBuildingFactory2 } from 'react-icons/tb';
import { loadSystemsData } from "../Services/LocalStorage";
import MyPageTitle from "../Components/MyPageTitle";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import SystemMapDiagram from "../Components/SystemMapDiagram";
import getLocationName from "../Utils/getLocationName";
import SystemsContext from "../Contexts/SystemsContext";
import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/esm/Card";
import ListGroup from "react-bootstrap/ListGroup"
import ListGroupItem from "react-bootstrap/ListGroupItem"


export default function LocationsPage(props) {
    let params = useParams();

    const systemSymbol = params.systemid;
    const systems = loadSystemsData();
    const system = (systems.systems || []).find((s) => s.symbol === systemSymbol);

    return (
        <div>
            <MyPageTitle>Map</MyPageTitle>
            <MyPageSubTitle>Systems</MyPageSubTitle>
            <LocationsPageSystemSelect />
            <SystemMapDiagram system="OE" />
            {system &&
                <Container>
                    <Row>
                        {Array.isArray(system.locations) && system.locations.map((loc, idx) => {
                            return (
                                <Col md={4} sm={6} xs={12} key={idx}>
                                    <LocationsPageCard location={loc} />
                                </Col>
                            )
                        })
                        }

                    </Row>
                </Container>
            }
        </div>
    )

}

function LocationsPageCard(props) {
    const loc = props.location;

    if (!loc) {
        return (<div></div>);
    }

    return (
        <Card className="mb-3">
            <Card.Header>
                {getLocationName(loc)}
            </Card.Header>
            <Card.Body>
                <LocationDetails location={loc} />
            </Card.Body>
        </Card>
    )
}

function LocationDetails(props) {
    const loc = props.location;

    if (!loc) {
        return (<div data-error="loc is undefined"></div>);
    }

    return (
        <ListGroup variant="flush">
            <ListGroupItem>
                <div>{loc.type}</div>
                <div>X: {loc.x} Y: {loc.y}</div>
                <div className={"" + (!loc.allowsConstruction ? "" : " text-muted")}>
                    <TbBuildingFactory2 className="me-2" />Construction{loc.allowsConstruction ? " not" : ""} allowed
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
                <div>Structures TODO</div>
            </ListGroupItem>
        </ListGroup>
    )
}

function LocationsPageSystemSelect(props) {
    const [systems, setSystems] = useContext(SystemsContext);

    let navigate = useNavigate();

    if (!systems || !Array.isArray(systems.systems)) {
        return (<div>No systems data available</div>);
    }

    return (
        <div className="d-flex flex-wrap mb-3">
            {systems.systems.map((system) => {
                return (
                    <Button onClick={() => navigate("/locations/system/" + system.symbol)} key={system.symbol} variant="primary" className="me-2">
                        <div>
                            <GiOrbital className="me-2" />
                            {getLocationName(system)}
                        </div>
                        <div className="fw-light">
                            {system.locations.length} locations
                        </div>
                    </Button>
                )
            })}

        </div>
    )
}