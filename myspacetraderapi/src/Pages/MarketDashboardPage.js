import MarketDashboard from "./Components/MarketDashboard";
import MarketHeader from "./Components/MarketHeader";
import { useEffect } from "react";
import setPageTitle from "../Utils/setPageTitle";


export default function MarketDashboardPage(props) {

    useEffect(() => {
        setPageTitle("Market Dashboard");
    })

    return(
        <>
            <MarketHeader />
            <MarketDashboard />
        </>
    )
}