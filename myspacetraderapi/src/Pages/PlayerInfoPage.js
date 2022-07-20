import { useContext, useEffect, useState } from "react";
import PlayerInfoContext from "../Contexts/PlayerInfoContext.js";
import Page from "../Components/Page.js"
import { getPlayerInfo, readResponse } from "../Services/SpaceTraderApi.js";
import { prettyNumber } from "../Utils.js";
import Timestamp from "../Components/Timestamp.js";

function PlayerInfoPage(props) {

    const [playerInfo, setPlayerInfo] = useContext(PlayerInfoContext);

    console.log("Player info page: ", playerInfo);

    if (!playerInfo) {
        return (
            <div>No data</div>
        );
    } else {
        return (
            <Page title="Player info">
                This is the player info page.

                <pre>
                    Player info data:
                    {JSON.stringify(playerInfo)}
                </pre>

                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <td>Username:</td>
                            <td>{playerInfo.username}</td>
                        </tr>
                        <tr>
                            <td>Ship count:</td>
                            <td>{playerInfo.shipCount}</td>
                        </tr>
                        <tr>
                            <td>Structure count:</td>
                            <td>{playerInfo.structureCount}</td>
                        </tr>
                        <tr>
                            <td>Joined:</td>
                            <td><Timestamp value={playerInfo.joinedAt} /></td>
                        </tr>
                        <tr>
                            <td>Credits:</td>
                            <td>{prettyNumber(playerInfo.credits)}</td>
                        </tr>
                    </tbody>
                </table>



            </Page >
        );
    }
}

export default PlayerInfoPage;