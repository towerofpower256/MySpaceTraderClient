import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoggedInContext from "../Contexts/LoggedInContext";
import { clearAuth } from "../Services/LocalStorage";
import { toast } from "react-toastify";
import setPageTitle from "../Utils/setPageTitle";


export default function LogoutPage(props) {
    const [isLoggedIn, setLoggedIn] = useContext(LoggedInContext);
    const navigate = useNavigate();

    useEffect(() => {
        setPageTitle("Logout");
    })

    function handleLogoutClick(e) {
        e.preventDefault();
        navigate("/");
        clearAuth();
        setLoggedIn(false);
        toast.warn("Log out complete");
    }

    return (
        <div>
            Are you sure you want to log out?
            <button type="submit" className="btn btn-danger" onClick={handleLogoutClick}>Log out</button>
        </div>
    )
}