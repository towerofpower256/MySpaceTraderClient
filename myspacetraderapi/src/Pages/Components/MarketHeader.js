import { NavLink, Link } from "react-router-dom";
import MyPageTitle from "../../Components/MyPageTitle";
import Button from "react-bootstrap/esm/Button";
import ButtonGroup from "react-bootstrap/esm/Button";


export default function MarketHeader(props) {

    return (
        <div>
            <MyPageTitle>Markets</MyPageTitle>
            <div className="mb-3">
                <NavLink to="/market/" className={({ isActive }) => {return "me-4 pb-1"+(isActive ? " sub-menu-link-active" : "")}}>Dashboard</NavLink>
                <NavLink to="/market/report" className={({ isActive }) => {return "me-4 pb-1"+(isActive ? " sub-menu-link-active" : "")}}>Report</NavLink>
                <NavLink to="/market/finder" className={({ isActive }) => {return "me-4 pb-1"+(isActive ? " sub-menu-link-active" : "")}}>Deal finder</NavLink>
                <NavLink to="/market/ship" className={({ isActive }) => {return "me-4 pb-1"+(isActive ? " sub-menu-link-active" : "")}}>Ship market</NavLink>
            </div>
            {props.children}
        </div>
    )
}