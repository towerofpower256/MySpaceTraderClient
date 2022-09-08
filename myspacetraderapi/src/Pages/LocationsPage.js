import { useContext } from "react";
import { TbBuildingFactory2 } from "react-icons/tb";

import SystemsContext from "../Contexts/SystemsContext";
import PlayerShipsContext from "../Contexts/PlayerShipsContext";

import MyPageTitle from "../Components/MyPageTitle";

import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import Card from "react-bootstrap/esm/Row";
import getLocationName from "../Utils/getLocationName";


export default function LocationsPage(props) {
    const [systems, setSystems] = useContext(SystemsContext);

    return (
        <div>
            <MyPageTitle>Locations</MyPageTitle>
            System selector here
            <Container>
                <Row>
                    {systems.map((system, idx) => {
                        return (
                            <Col md={4} sm={6} xs={12} key={idx}>
                                <LocationsPageCard location={location} />
                            </Col>
                        )
                    })}

                </Row>
            </Container>
        </div>
    )
}

function LocationsPageCard(props) {
    const location = props.location;

    if (!location) {
        return (<div></div>);
    }

    return (
        <Card>
            <Card.Header>
                {getLocationName(location)}
            </Card.Header>
            <Card.Body>
                <div>
                    {location.type}
                </div>
                <div className={"" + (!location.allowsConstruction ? " text-muted" : "")}>
                    <TbBuildingFactory2 className="me-2" />Construction{location.allowsConstruction ? " not" : ""} allowed
                </div>
                <div>
                    <div>Traits</div>
                    <div>
                        {!Array.isArray(location.traits) || location.traits.length < 1
                            ? "(none)"
                            : location.traits.join(", ")}
                    </div>
                </div>
            </Card.Body>
        </Card>
    )
}