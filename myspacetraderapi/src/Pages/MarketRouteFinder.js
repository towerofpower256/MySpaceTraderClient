import { useState, useContext, useEffect } from "react";
import MarketDataContext from "../Contexts/MarketDataContext";
import MarketHeader from "./Components/MarketHeader";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import MyPageTitle from "../Components/MyPageTitle";
import setPageTitle from "../Utils/setPageTitle";
import calcTravel from "../Utils/calcTravel";
import getGoodType from "../Utils/getGoodType";
import getLocation from "../Utils/getLocation";

import Form from "react-bootstrap/esm/Form";
import Table from "react-bootstrap/esm/Table";
import Button from "react-bootstrap/esm/Button";
import Container from "react-bootstrap/esm/Container";
import Col from "react-bootstrap/esm/Col";
import Row from "react-bootstrap/esm/Row";
import sortCompareNumerically from "../Utils/sortCompareNumerically";
import sortCompareAlphabetically from "../Utils/sortCompareAlphabetically";
import prettyNumber from "../Utils/prettyNumber";
import getGoodName from "../Utils/getGoodName";
import findGoodTradeRoutes from "../Utils/findGoodTradeRoutes";
import { loadGoodTypes, loadMarketData, loadRouteFinderResults, loadSystemsData, saveRouteFinderResults } from "../Services/LocalStorage";

function PageWrapper(props) {
    return (
        <MarketHeader>
            <MyPageSubTitle>Deal Finder</MyPageSubTitle>
            {props.children}
        </MarketHeader>
    )
}

const STORAGE_ROUTE_FINDER_LAST_RESULT = "route_finder_last_report";
export default function MarketRouteFinderPage(props) {
    const [filterSection, setFilterSection] = useState({});
    const [reportData, _setReportData] = useState(loadRouteFinderResults());
    const [shipSpeed, setShipSpeed] = useState(1);
    const [shipCargoSize, setShipCargoSize] = useState(25);
    const [columns, setColumns] = useState(setupColumns());
    const [systemList, setSystemList] = useState([]);
    const [filterSystem, setFilterSystem] = useState();
    const [goodList, setGoodList] = useState(loadGoodTypes().sort((a, b) => sortCompareAlphabetically(a.name, b.name)));
    const [filterGood, setFilterGood] = useState();
    const [orderBy, setOrderBy] = useState("profit_per_volume_per_fuel");
    //const [marketData, setMarketData] = useContext(MarketDataContext);

    useEffect(() => {
        // On mount
        setPageTitle("Deal Finder");
        setupFilters();
    }, []);

    function setReportData(val) {
        saveRouteFinderResults(val);
        _setReportData(val);
    }

    function setupFilters() {
        let systemData = loadSystemsData();
        if (Array.isArray(systemData.systems)) {
            setSystemList(systemData.systems.map((s) => { return { name: s.name, symbol: s.symbol }; }));
        }
    }

    function doReport() {
        let options = {
            result_limit: 10,
            ship_speed: shipSpeed,
            ship_cargo_size: shipCargoSize
        }

        if (orderBy) options.sort_by = orderBy;

        if (filterSystem) {
            let systemData = loadSystemsData();
            if (Array.isArray(systemData.systems)) {
                let system = systemData.systems.find(s => s.symbol === filterSystem);
                if (system && Array.isArray(system.locations)) {
                    options.filter_locations = system.locations.map(loc => loc.symbol);
                }
            }
        }

        if (filterGood) {
            options.filter_goods = [filterGood];
        }

        let r = findGoodTradeRoutes(loadMarketData(), options);

        console.log("Trade finder result", r);
        setReportData(r.routes);
    }

    function setupColumns() {
        const columns = [
            { name: "good", label: "Good", formatter: (a) => getGoodName(a) },
            { name: "good_volume", label: "Volume/unit" },
            { name: "profit", label: "Profit", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(a) },
            { name: "profit_per_volume_per_fuel", cellClassName: "text-end", label: "Profit/vol&dist", formatter: (a) => "$" + (a.toFixed(4)) },
            { name: "quantity", label: "Qty", cellClassName: "text-end", formatter: (a) => prettyNumber(a) },
            { name: "buy_location", label: "Buy location" },
            { name: "buy_price", label: "Buy price", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(a) },
            { name: "sell_location", label: "Sell location" },
            { name: "sell_price", label: "Sell price", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(a) },
            { name: "distance", label: "Distance", cellClassName: "text-end", formatter: (a) => prettyNumber(a.toFixed(2)) },
            { name: "fuel_cost", label: "Fuel", cellClassName: "text-end", formatter: (a) => "~" + a },
            { name: "travel_time", label: "Travel time", cellClassName: "text-end", formatter: (a) => prettyNumber(a || "-") + " sec" },
            { name: "trade_run_profit", label: "Run profit", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(parseFloat(a).toFixed(2)) },
            { name: "trade_run_profit_per_second", label: "Run profit/second", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(a ? a.toFixed(2) : "-") + " sec" },
        ];
        return columns;
    }

    return (
        <PageWrapper>
            <Container>
                <Row>
                    <Form.Group className="col-md-4 col-sm-12 mb-3">
                        <Form.Label>Order by</Form.Label>
                        <Form.Select value={orderBy} onChange={(e) => setOrderBy(e.target.value)}>
                            <option value="profit_per_volume">Profit per volume</option>
                            <option value="profit_per_volume_per_fuel">Profit per volume per fuel</option>
                            <option value="trade_run_profit">Trade run profit</option>
                            <option value="trade_run_profit_per_second">Trade run profit per second</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="col-md-4 col-sm-12 mb-3">
                        <Form.Label>System</Form.Label>
                        <Form.Select value={filterSystem} onChange={(e) => setFilterSystem(e.target.value)}>
                            <option value="">(all)</option>
                            {systemList.map(s => <option key={s.symbol} value={s.symbol}>{s.symbol} ({s.name})</option>)}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="col-md-4 col-sm-12 mb-3">
                        <Form.Label>Good</Form.Label>
                        <Form.Select value={filterGood} onChange={(e) => setFilterGood(e.target.value)}>
                            <option value="">(all)</option>
                            {goodList.map(g => <option key={g.symbol} value={g.symbol}>{g.name}</option>)}
                        </Form.Select>
                    </Form.Group>
                </Row>
                <Row>

                    <Form.Group className="col-md-4 col-sm-12 mb-3">
                        <Form.Label>Ship speed</Form.Label>
                        <Form.Control type="number" value={shipSpeed} onChange={(e) => setShipSpeed(e.target.value)} />
                    </Form.Group>
                    <Form.Group className="col-md-4 col-sm-12 mb-3">
                        <Form.Label>Ship cargo hold size</Form.Label>
                        <Form.Control type="number" value={shipCargoSize} onChange={(e) => setShipCargoSize(e.target.value)} />
                    </Form.Group>
                </Row>
            </Container>
            <Button variant="primary" className="mb-3" onClick={() => doReport()}>Do it</Button>
            <DataTable columns={columns} rows={reportData} />
        </PageWrapper>
    )
}

function DataTable(props) {
    let columns = props.columns;
    let rows = props.rows;

    return (
        <Table bordered striped id={props.id} size="sm" responsive >
            <thead>
                <tr>
                    {columns.map((col) => {
                        return <DataTableColHeader
                            key={col.name}
                            name={col.name}
                        >
                            {col.label}
                        </DataTableColHeader>
                    })}
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.rows) ?
                    props.rows.map((row, idx) => {
                        return <DataTableRow key={idx} row={row} columns={columns} />
                    })
                    :
                    undefined
                }
            </tbody>
        </Table>
    )
}

function DataTableRow(props) {
    const columns = props.columns;
    const row = props.row;

    return (
        <tr>
            {columns.map((col) => {
                let colName = col.name;
                let cellValue = row[colName] || "";
                let cellDisplayLabel = (typeof col.formatter == "function" ? col.formatter(cellValue) : cellValue);

                return (
                    <td key={colName} className={col.cellClassName} data-value={cellValue}>{cellDisplayLabel}</td>
                )
            })}
        </tr>
    )
}

function DataTableColHeader(props) {

    return (
        <th className={props.className}
            data-col-name={props.name}
        >
            {props.children}
        </th>
    )
}

/*
function DataTableColHeader(props) {
    let colSortIcon = "";
    if (state.sortBy === props.name) {
        colSortIcon = (state.sortAscending ? <>&#129083;</> : <>&#129081;</>);
    }
    return (
        <th className={props.className}
            data-col-name={props.name}
            data-col-data-type={props.datatype}
            active={(state.sortBy === props.name) + ""}
            onClick={handleColumnClick}
        >
            <div>
                {props.children}
                {colSortIcon}
            </div>
        </th>
    )
}
*/