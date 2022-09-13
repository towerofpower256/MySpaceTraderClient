import { useState, useContext, useEffect } from "react";

import Button from "react-bootstrap/esm/Button";
import Table from "react-bootstrap/esm/Table";
import InputGroup from "react-bootstrap/esm/InputGroup";
import Form from "react-bootstrap/esm/Form";

import MyPageSubTitle from "../../Components/MyPageSubTitle";
import SystemsContext from "../../Contexts/SystemsContext";
import MarketDataContext from "../../Contexts/MarketDataContext";
import getGoodName from "../../Utils/getGoodName";
import prettyNumber from "../../Utils/prettyNumber";
import durationString from "../../Utils/durationString";
import { loadGoodTypes, loadMarketData } from "../../Services/LocalStorage";


export default function MarketReport(props) {
    //const [systems, setSystems] = useContext(SystemsContext);
    //const [marketData, setMarketData] = useContext(MarketDataContext);
    const [state, setState] = useState({});
    const [reportData, setReportData] = useState([]);


    useEffect(() => {
        // On mount
        //refreshReport();
    }, []);

    useEffect(() => {
        refreshReport();
    }, [state]);

    function handleColumnClick(e) {
        const colName = e.currentTarget.dataset.colName;
        const colDataType = e.currentTarget.dataset.colDataType;

        if (state.sortBy === colName) {
            state.sortAscending = !state.sortAscending;
        } else {
            state.sortBy = colName;
            state.sortAscending = true;
            state.sortType = colDataType;
        }

        setState({ ...state });
    }

    function setGoodFilter(a) {
        state.filterGood = a;
        setState({ ...state });
    }

    function PageWrapper(props) {
        return (
            <div>
                <MyPageSubTitle>Report</MyPageSubTitle>
                {props.children}
            </div>
        )
    }

    function refreshReport() {
        // GET
        let _reportData = [];
        loadMarketData().forEach((md) => {
            md.goods.forEach((good) => {
                _reportData.push({
                    ...good,
                    updatedAt: md.updatedAt,
                    location: md.location
                })
            });
        })

        // FILTER
        if (state.filterGood) {
            _reportData = _reportData.filter((good) => good.symbol === state.filterGood);
        }

        // SORT
        if (state.sortBy) {
            if (state.sortType === "number") {
                _reportData.sort((a, b) => { return compareNumber(a, b, state.sortAscending, state.sortBy) });
            } else if (state.sortType === "date") {
                // TODO
            } else {
                _reportData.sort((a, b) => { return compareAlphabetically(a, b, state.sortAscending, state.sortBy) });
            }
        }

        // Save it
        setReportData(_reportData);

        function compareAlphabetically(a, b, ascending, propName) {
            const _a = (ascending ? a : b);
            const _b = (ascending ? b : a);
            return ("" + _a[propName]).localeCompare("" + _b[propName]);
        }

        function compareNumber(a, b, ascending, propName) {
            const _a = parseInt(ascending ? a[propName] : b[propName]);
            const _b = parseInt(ascending ? b[propName] : a[propName]);
            return (_a - _b);
        }
    }

    /*
    if (!systems || !Array.isArray(systems.all_locations) || !Array.isArray(systems.systems)) {
        return (<PageWrapper>
            No systems data.
        </PageWrapper>)
    }
    */

    /*
    if (!Array.isArray(marketData)) {
        return (<PageWrapper>
            No market data.
        </PageWrapper>)
    }
    */



    function ReportColHeader(props) {
        let colSortIcon = "";
        if (state.sortBy === props.name) {
            colSortIcon = (state.sortAscending ? <>&#129083;</> : <>&#129081;</>);
        }
        return (
            <th className={props.className}
                data-col-name={props.name}
                data-col-data-type={props.datatype}
                active={(state.sortBy === props.name)+""}
                onClick={handleColumnClick}
            >
                <div>
                    {props.children}
                    {colSortIcon}
                </div>
            </th>
        )
    }

    return (
        <PageWrapper>
            <div className="w-auto">
                <InputGroup className="mb-3">
                    <InputGroup.Text id="filter-good">Good</InputGroup.Text>
                    <Form.Select aria-label="Filter by good" value={state.filterGood} onChange={(e) => setGoodFilter(e.currentTarget.value)}>
                        <option value="">(all)</option>
                        {loadGoodTypes().map((type) => {
                            return (
                                <option value={type.symbol}>{type.name}</option>
                            )
                        })}
                    </Form.Select>
                </InputGroup>
                <Button variant="primary" onClick={() => refreshReport()}>Refresh report</Button>
            </div>
            <Table striped id="market-report-table" size="sm" responsive>
                <thead>
                    <tr>
                        <ReportColHeader name="location" datatype="string">Location</ReportColHeader>
                        <ReportColHeader name="symbol" datatype="string">Good</ReportColHeader>
                        <ReportColHeader name="quantityAvailable" className="text-end" datatype="number">Qty</ReportColHeader>
                        <ReportColHeader name="purchasePricePerUnit" className="text-end" datatype="number">Buy</ReportColHeader>
                        <ReportColHeader name="sellPricePerUnit" className="text-end" datatype="number">Sell</ReportColHeader>
                        <ReportColHeader name="spread" className="text-end" datatype="number">Spread</ReportColHeader>
                        <th className="text-end" datatype="date">Last seen</th>
                    </tr>
                </thead>
                <tbody className="fw-light">
                    {reportData.map((mdGood) => {
                        return (
                            <tr>
                                <td>{mdGood.location}</td>
                                <td>{getGoodName(mdGood.symbol)}</td>
                                <td className="text-end">{prettyNumber(mdGood.quantityAvailable)}</td>
                                <td className="text-end">${prettyNumber(mdGood.purchasePricePerUnit)}</td>
                                <td className="text-end">${prettyNumber(mdGood.sellPricePerUnit)}</td>
                                <td className="text-end">&plusmn; ${prettyNumber(mdGood.spread)}</td>
                                <td className="text-end">{durationString(new Date(mdGood.updatedAt) - new Date(), { hide_seconds: true })}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </Table>

        </PageWrapper>
    )
}