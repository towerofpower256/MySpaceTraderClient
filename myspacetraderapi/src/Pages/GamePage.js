import { useEffect, useState } from "react";
import { getGameStatus, getGameLeaderboard } from "../Services/SpaceTraderApi";
import { toast } from "react-toastify";
import PlaceholderLoading from "react-placeholder-loading";
import PlaceholderTableRows from "../Components/PlaceholderTableRows";
import Table from "react-bootstrap/esm/Table";

import prettyNumber from "../Utils/prettyNumber";
import insertOrUpdate from "../Utils/insertOrUpdate";
import { loadPlayerInfo } from "../Services/LocalStorage";


export default function GamePage(props) {

    return (
        <div>
            <GameState />
            <GameLeaderboard />
        </div>
    )


}

function GameLeaderboard(props) {
    const [data, setData] = useState([]);
    const [isLoading, setLoading] = useState(false);

    useState(() => {
        updateLeaderboard()
    }, []);

    function updateLeaderboard() {
        if (isLoading) return;

        setLoading(true);
        setData();
        getGameLeaderboard()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Failed to get the leaderboard. " + stcResponse.errorPretty);
                    return;
                }

                let newData = [];

                const netWorth = stcResponse.data.netWorth;
                if (Array.isArray(netWorth)) newData = netWorth;

                const userNetWorth = stcResponse.data.userNetWorth;
                if (userNetWorth) {
                    insertOrUpdate(newData, userNetWorth, r => r.username === userNetWorth.username);
                }

                setData(newData);
            })
            .catch(error => toast.error("Failed to get the leaderboard. " + error))
            .finally(() => setLoading(false))
    }

    return (
        <div>
            <h2>Leaderboard</h2>
            <Table>
                <thead>
                    <tr>
                        <th>Rank</th>
                        <th>Username</th>
                        <th className="text-end">Net worth</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading && <PlaceholderTableRows colCount={3} rowCount={10} />}
                    {!isLoading && Array.isArray(data) ? data.map((row, idx) => {
                        return (
                            <tr key={idx} className={loadPlayerInfo().username === row.username ? "fw-bold" : ""}>
                                <td>{row.rank}</td>
                                <td>{row.username}</td>
                                <td className="text-end">${prettyNumber(row.netWorth)}</td>
                            </tr>
                        )
                    }) : undefined}
                </tbody>
            </Table>

        </div>
    )
}

function GameState(props) {
    const [gameState, setGameState] = useState();
    const [isLoading, setLoading] = useState(false);

    useEffect(() => {
        // Get the game state
        updateGameStatus();
    }, []);

    function updateGameStatus() {
        if (isLoading) return;

        setLoading(true);
        setGameState();
        getGameStatus()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error("Error getting game status. " + stcResponse.errorPretty);
                    return;
                }

                setGameState(stcResponse.data.status);
            })
            .catch(error => toast.error("Error getting game status. " + error))
            .finally(() => setLoading(false))
    }

    return (
        <div className="w-100 text-center">
            <h2>Game Status</h2>
            {isLoading ?
                <PlaceholderLoading shape="rect" width="100%" height="3em" />
                :
                <div className="w-100">
                    {gameState}
                </div>
            }
        </div>
    )
}