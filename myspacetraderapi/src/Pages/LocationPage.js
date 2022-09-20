import { useEffect } from "react";
import { useParams } from "react-router-dom"
import getLocation from "../Utils/getLocation";
import setPageTitle from "../Utils/setPageTitle";
import MarketDashboardLocationCard from "./Components/MarketDashboardLocationCard";


export default function LocationPage(props) {
    const params = useParams();
    const locId = params.locationid;
    const loc = getLocation(locId);

    useEffect(() => {setPageTitle(locId)}, [])

    if (!loc) {
        return (
            <div>
                Unknown location: {locId}
            </div>
        )
    }

    return (
        <MarketDashboardLocationCard location={locId} />
    )
}