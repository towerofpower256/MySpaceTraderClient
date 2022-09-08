import {
    loadFlightPlanHistory,
    loadTradeHistory
} from "../Services/LocalStorage";
import { useEffect, useState } from "react";
import timeDelta from "../Utils/timeDelta";
import getGoodName from "../Utils/getGoodName";
import getLocationName from "../Utils/getLocationName";
import prettyNumber from "../Utils/prettyNumber";


import Timestamp from "../Components/Timestamp";
import LocationText from "../Components/LocationText";
import MyPageTitle from "../Components/MyPageTitle";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";

export default function HistoryPage(props) {

    function PageWrapper(props) {
        return (
            <div>
                <MyPageTitle>History</MyPageTitle>
                {props.children}
            </div>
        )
    }

    return (
        <PageWrapper>
            <FlightPlanHistory />
            <TradeHistory />
        </PageWrapper>
    )
}

function TradeHistory(props) {
    const [data, setData] = useState(loadTradeHistory());

    function updateData() {
        setData(loadTradeHistory());
    }

    return (
        <div>
            <MyPageSubTitle>Trade History</MyPageSubTitle>
            <Button variant="primary" onClick={() => updateData()}>Refresh</Button>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th>When</th>
                        <th>Type</th>
                        <th>Good</th>
                        <th>Total</th>
                        <th>Price/unit</th>
                        <th>Units</th>
                        <th>Location</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) ? data.map((row, idx) => {
                        return (
                            <tr key={idx}>
                                <td><Timestamp value={row.createdAt} /></td>
                                <td>{row.orderType}</td>
                                <td>{getGoodName(row.good)}</td>
                                <td>${prettyNumber(row.total)}</td>
                                <td>${prettyNumber(row.pricePerUnit)}</td>
                                <td>{prettyNumber(row.quantity)}</td>
                                <td><LocationText value={row.location} /></td>
                            </tr>
                        )
                    })
                        : undefined}
                </tbody>
            </Table>
        </div>
    )
}

function FlightPlanHistory(props) {
    const [data, setData] = useState(loadFlightPlanHistory());

    useEffect(() => {

    }, []);

    function updateData() {
        setData(loadFlightPlanHistory());
    }

    return (
        <div>
            <MyPageSubTitle>Flight Plan History</MyPageSubTitle>
            <Button variant="primary" onClick={() => updateData()}>Refresh</Button>
            <Table striped size="sm">
                <thead>
                    <tr>
                        <th>Departure</th>
                        <th>Created</th>
                        <th>Destination</th>
                        <th>Arrives at</th>
                        <th>Travel time</th>
                        <th>Distance</th>
                        <th>Fuel</th>
                        <th>Ship</th>
                    </tr>
                </thead>
                <tbody>
                    {Array.isArray(data) ? data.map((fp, idx) => {
                        return (
                            <tr key={idx}>
                                <td>{fp.departure}</td>
                                <td><Timestamp value={fp.createdAt} /></td>
                                <td>{fp.destination}</td>
                                <td><Timestamp value={fp.arrivesAt} /></td>
                                <td>{timeDelta(new Date(fp.arrivesAt), new Date(fp.createdAt))} </td>
                                <td>{prettyNumber(fp.distance)}</td>
                                <td>{prettyNumber(fp.fuelConsumed)}</td>
                                <td>{fp.shipId}</td>
                            </tr>
                        )
                    })
                        : undefined}
                </tbody>
            </Table>
        </div>
    )
}