import MarketDashboardSystemInfo from "./Components/MarketDashboardSystemInfo";
import MarketHeader from "./Components/MarketHeader";
import MarketDashboardSystemSelect from "./Components/MarketDashboardSystemSelect";
import { useEffect } from "react";
import setPageTitle from "../Utils/setPageTitle";
import MarketDashboardLocations from "./Components/MarketDashboardLocations";



export default function MarketDashboardPage(props) {

    useEffect(() => {
        setPageTitle("Market Dashboard");
    })

    return(
        <>
            <MarketHeader />

            <MarketDashboardSystemSelect />
            <MarketDashboardSystemInfo />
            <MarketDashboardLocations />
        </>
    )
}