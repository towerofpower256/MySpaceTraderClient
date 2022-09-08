import MarketReport from "./Components/MarketReport";
import MarketHeader from "./Components/MarketHeader";
import { useEffect } from "react";
import setPageTitle from "../Utils/setPageTitle";

export default function MarketReportPage(props) {
    useEffect(() => {setPageTitle("Market Report")})
    return(
        <>
            <MarketHeader />
            <MarketReport />
        </>
    )
}