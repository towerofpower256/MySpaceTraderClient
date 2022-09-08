import { useContext, useEffect, useState } from "react";
import { getShips, readResponse } from "../Services/SpaceTraderApi.js";
import { Link } from "react-router-dom";
import PlayerShipsContext from "../Contexts/PlayerShipsContext.js";
import MyPageTitle from "../Components/MyPageTitle.js";
import setPageTitle from "../Utils/setPageTitle.js";

export default function ShipListPage(props) {
    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(true)
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);

    useEffect(() => {setPageTitle("Ships")});

    function PageWrapper(props) {
        return(
            <div>
                <MyPageTitle>Ships</MyPageTitle>
                {props.children}
            </div>
        )
    }

    if (!isLoaded) {
        return (
            <PageWrapper>
                <pre>It's loading</pre>
            </PageWrapper>
        );
    }

    if (error) {
        return (
            <PageWrapper>
                <pre>ERROR: {error}</pre>
            </PageWrapper>
        );
    }

    return (
        <PageWrapper>
            <table className="table table-striped table-hover">
                <thead>
                    <tr>
                        <td>ID</td>
                        <td>Ship type</td>
                        <td>Location</td>
                        <td>Class</td>
                        <td>Manufacturer</td>
                        <td>Cargo</td>
                        <td>S / P / W</td>
                    </tr>
                </thead>
                <tbody>
                    {playerShips.map((ship, index) => {
                        return (
                            <tr key={ship.id}>
                                <td><Link to={ship.id}>{ship.id}</Link></td>
                                <td>{ship.type}</td>
                                <td>{ship.location}</td>
                                <td>{ship.class}</td>
                                <td>{ship.manufacturer}</td>
                                <td>{ship.spaceAvailable} / {ship.maxCargo}</td>
                                <td>{ship.speed} / {ship.plating} / {ship.weapons}</td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </PageWrapper>
    )
}