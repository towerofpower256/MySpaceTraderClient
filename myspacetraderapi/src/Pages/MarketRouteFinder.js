import { useState, useContext, useEffect } from "react";
import MarketDataContext from "../Contexts/MarketDataContext";
import MarketHeader from "./Components/MarketHeader";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import MyPageTitle from "../Components/MyPageTitle";
import setPageTitle from "../Utils/setPageTitle";
import calcTravel from "../Utils/calcTravel";
import getGoodType from "../Utils/getGoodType";
import getLocation from "../Utils/getLocation";

import Table from "react-bootstrap/esm/Table";
import Button from "react-bootstrap/esm/Button";
import sortCompareNumerically from "../Utils/sortCompareNumerically";
import prettyNumber from "../Utils/prettyNumber";
import getGoodName from "../Utils/getGoodName";
import findGoodTradeRoutes from "../Utils/findGoodTradeRoutes";
import { loadRouteFinderResults, saveRouteFinderResults } from "../Services/LocalStorage";



const STORAGE_ROUTE_FINDER_LAST_RESULT = "route_finder_last_report";
export default function MarketRouteFinderPage(props) {
    const [filterSection, setFilterSection] = useState({});
    const [reportData, _setReportData] = useState(loadRouteFinderResults());
    const [marketData, setMarketData] = useContext(MarketDataContext);

    useEffect(() => {
        // On mount
        setPageTitle("Deal Finder");

    });

    function setReportData(val) {
        saveRouteFinderResults(val);
        _setReportData(val);
    }

    function setupFilters() {

    }

    function PageWrapper(props) {
        return (
            <MarketHeader>
                <MyPageSubTitle>Deal Finder</MyPageSubTitle>
                {props.children}
            </MarketHeader>
        )
    }

    function doReport() {
        setReportData(findGoodTradeRoutes(marketData, { result_limit: 10 }).routes);
    }

    const columns = [
        { name: "good", label: "Good", formater: (a) => getGoodName(a) },
        { name: "good_volume", label: "Volume/unit" },
        { name: "profit", label: "Profit", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(a) },
        { name: "profit_per_volume_per_fuel", cellClassName: "text-end", label: "Profit/vol&dist", formatter: (a) => "$" + (a.toFixed(4)) },
        { name: "quantity", label: "Qty", cellClassName: "text-end", formatter: (a) => prettyNumber(a)},
        { name: "buy_location", label: "Buy location" },
        { name: "buy_price", label: "Buy price", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(a) },
        { name: "sell_location", label: "Sell location" },
        { name: "sell_price", label: "Sell price", cellClassName: "text-end", formatter: (a) => "$" + prettyNumber(a) },
        { name: "distance", label: "Distance", cellClassName: "text-end", formatter: (a) => prettyNumber(a.toFixed(2))},
        { name: "fuel_cost", label: "Fuel", cellClassName: "text-end", formatter: (a) => "~"+a},
    ]

    return (
        <PageWrapper>
            Filters go here.
            Data goes here.
            <Button variant="primary" onClick={() => doReport()}>Do it</Button>
            <DataTable columns={columns} rows={reportData} />
        </PageWrapper>
    )
}

function DataTable(props) {
    let columns = props.columns;
    let rows = props.rows;

    return (
        <Table striped id={props.id} size="sm">
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