import { useContext } from "react"
import MyPageTitle from "../Components/MyPageTitle";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import prettyNumber from "../Utils/prettyNumber";
import {
    loadShipTypes,
    loadGoodTypes,
    loadStructureTypes
} from "../Services/LocalStorage";

import Container from "react-bootstrap/esm/Container"
import Row from "react-bootstrap/esm/Row"
import Col from "react-bootstrap/esm/Col"
import Card from "react-bootstrap/esm/Card"
import Table from "react-bootstrap/esm/Table"
import sortCompareAlphabetically from "../Utils/sortCompareAlphabetically";
import sortAlphabetically from "../Utils/sortAlphabetically";
import getGoodName from "../Utils/getGoodName";
import setPageTitle from "../Utils/setPageTitle";

export default function HelpTypesPage(props) {
    setPageTitle("Types");
    return (
        <div>
            <MyPageTitle>Types</MyPageTitle>
            <ShipTypesSection />
            <GoodTypesSection />
            <StructureTypesSection />
        </div>
    )
}

function TypesGrid(props) {
    return (
        <div>
            <MyPageSubTitle>{props.title}</MyPageSubTitle>
            {!Array.isArray(props.items) || props.items <= 0 ? "No types known" : ""}
            <Container>
                <Row>
                    {props.items.map((item) => {
                        return (
                            <Col md={4} sm={1}>
                                <Card className="mb-3">
                                    <Card.Body>
                                        {item}
                                    </Card.Body>
                                </Card>
                            </Col>
                        )
                    })}
                </Row>
            </Container>
        </div>
    )
}

function ShipTypesSection(props) {
    const shipTypes = loadShipTypes();
    shipTypes.sort((a, b) => sortCompareAlphabetically(a.type, b.type));
    const items = shipTypes.map((ship) => {
        return (
            <Table striped size="sm">
                <tbody>
                    <tr>
                        <th>Type:</th>
                        <td>{ship.type}</td>
                    </tr>
                    <tr>
                        <th>Class:</th>
                        <td>{ship.class}</td>
                    </tr>
                    <tr>
                        <th>Manufacturer:</th>
                        <td>{ship.manufacturer}</td>
                    </tr>
                    <tr>
                        <th>Max cargo:</th>
                        <td>{prettyNumber(ship.maxCargo)}</td>
                    </tr>
                    <tr>
                        <th>Cargo loading speed:</th>
                        <td>{prettyNumber(ship.loadingSpeed)}</td>
                    </tr>
                    <tr>
                        <th>Speed:</th>
                        <td>{prettyNumber(ship.speed)}</td>
                    </tr>
                    <tr>
                        <th>Armour plating:</th>
                        <td>{prettyNumber(ship.plating)}</td>
                    </tr>
                    <tr>
                        <th>Weapons:</th>
                        <td>{prettyNumber(ship.weapons)}</td>
                    </tr>
                </tbody>
            </Table>
        )
    })

    return (
        <TypesGrid title="Ship Types" items={items} />
    )
}

function GoodTypesSection(props) {
    const goodTypes = loadGoodTypes();
    goodTypes.sort((a, b) => sortAlphabetically(a.name, b.name));

    const items = goodTypes.map((good) => {
        return (
            <Table striped size="sm">
                <tbody>
                    <tr>
                        <th>Name:</th>
                        <td>{good.name}</td>
                    </tr>
                    <tr>
                        <th>Symbol:</th>
                        <td>{good.symbol}</td>
                    </tr>
                    <tr>
                        <th>Volume:</th>
                        <td>{prettyNumber(good.volumePerUnit)}</td>
                    </tr>
                </tbody>
            </Table>
        )
    });

    return (
        <TypesGrid title="Good Types" items={items} />
    )
}

function StructureTypesSection(props) {
    const structureTypes = loadStructureTypes();
    structureTypes.sort((a, b) => sortAlphabetically(a.name, b.name));

    const items = structureTypes.map((structure) => {
        return (
            <Table striped size="sm">
                <tbody>
                    <tr>
                        <th>Name:</th>
                        <td>{structure.name}</td>
                    </tr>
                    <tr>
                        <th>Type:</th>
                        <td>{structure.type}</td>
                    </tr>
                    <tr>
                        <th>Price:</th>
                        <td>{prettyNumber(structure.price)}</td>
                    </tr>
                    <tr>
                        <th>Location types:</th>
                        <td>
                        {!Array.isArray(structure.allowedLocationTypes) || structure.allowedLocationTypes.length <= 0 ? "(empty)" : ""}
                            <ul>
                                {structure.allowedLocationTypes.map((a) => <li>{a}</li>)}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Location traits:</th>
                        <td>
                            {!Array.isArray(structure.allowedPlanetTraits) || structure.allowedPlanetTraits.length <= 0 ? "(empty)" : ""}
                            <ul>
                                {structure.allowedPlanetTraits.map((a) => <li>{a}</li>)}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Consumes:</th>
                        <td>
                            {!Array.isArray(structure.consumes) || structure.consumes.length <= 0 ? "(empty)" : ""}
                            <ul>
                                {structure.consumes.map((a) => <li>{getGoodName(a)}</li>)}
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>Produces:</th>
                        <td>
                            {!Array.isArray(structure.produces) || structure.produces.length <= 0 ? "(empty)" : ""}
                            <ul>
                                {structure.produces.map((a) => <li>{getGoodName(a)}</li>)}
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </Table>
        )
    });

    return (
        <TypesGrid title="Structure Types" items={items} />
    )
}