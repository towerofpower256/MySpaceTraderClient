import { useEffect } from "react";
import Table from "react-bootstrap/esm/Table";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import { loadShipTypes } from "../Services/LocalStorage";
import calcTravel from "../Utils/calcTravel";
import getLocation from "../Utils/getLocation";
import humanizeString from "../Utils/humanizeString";
import prettyNumber from "../Utils/prettyNumber";
import setPageTitle from "../Utils/setPageTitle";


export default function TestCalcsPage(props) {
    useEffect(() => {setPageTitle("Test Calculations")}, []);

    return (
        <div>
            <MyPageSubTitle>Travel calcs</MyPageSubTitle>
            <Table striped>
                <thead>
                    <tr>
                        <th>Test</th>
                        <th>Expected</th>
                        <th>Calculated</th>
                    </tr>
                </thead>
                <tbody>
                    <TestTravelTemplate start="XV-ST-BG" end="XV-OS" ship="DR-MK-I" expectedFuel={6} expectedTime={141} expectedDistance={37} />
                    <TestTravelTemplate start="OE-PM" end="OE-KO" ship="DR-MK-I" expectedFuel={9} expectedTime={120} expectedDistance={30} />
                    <TestTravelTemplate start="OE-KO" end="OE-PM" ship="GR-MK-III" expectedFuel={9} expectedTime={120} expectedDistance={30} />
                    <TestTravelTemplate start="OE-UC" end="OE-CR" ship="HM-MK-III" expectedFuel={8} expectedTime={77} expectedDistance={63} />
                </tbody>
            </Table>
        </div>
    )
}

function TestTravelTemplate(props) {
    const startLocationId = props.start;
    const startLocation = getLocation(startLocationId);
    const endLocationId = props.end;
    const endLocation = getLocation(endLocationId);
    const ship = loadShipTypes().find(s => s.type === props.ship);
    const expectedFuel = props.expectedFuel;
    const expectedTime = props.expectedTime;
    const expectedDistance = props.expectedDistance;

    const [actualDistance, actualFuel, actualTime] = calcTravel(startLocation, endLocation, ship.speed);

    return(
        <tr>
            <td>
                <div>Start: {startLocationId} ({humanizeString(startLocation.type)})</div>
                <div>End: {endLocationId}</div>
                <div>Ship: {ship.type} (speed {ship.speed})</div>
            </td>
            <td>
                <div>Distance: {prettyNumber(expectedDistance)}</div>
                <div>Fuel: {prettyNumber(expectedFuel)}</div>
                <div>Time: {prettyNumber(expectedTime)}s</div>
            </td>
            <td>
                <div>Distance: {prettyNumber(Math.ceil(actualDistance))}</div>
                <div>Fuel: {prettyNumber(actualFuel)}</div>
                <div>Time: {prettyNumber(actualTime)}s</div>
            </td>
        </tr>
    )
}