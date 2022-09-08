import getLocationName from "../Utils/getLocationName";
import { Link } from "react-router-dom";

export default function LocationText(props) {

    let locationText = getLocationName(props.value);

    return (
        <Link to={"/locations/"+props.value} data-location={props.value}>{locationText}</Link>
    )
}