import { useState } from "react";
import { getAuthToken } from "../../Services/LocalStorage";
import prettyNumber from "../../Utils/prettyNumber";

import Table from "react-bootstrap/esm/Table";
import Timestamp from "../Timestamp";


export default function PlayerInfoSummary(props) {
    const playerInfo = props.playerInfo || {};
    const [revealToken, setRevealToken] = useState(false);

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th className="pe-3">Username:</th>
                        <td>{playerInfo.username}</td>
                    </tr>
                    <tr>
                        <th className="pe-3">Credits:</th>
                        <td>${prettyNumber(playerInfo.credits)}</td>
                    </tr>
                    <tr>
                        <th className="pe-3">Ships:</th>
                        <td>{prettyNumber(playerInfo.shipCount)}</td>
                    </tr>
                    <tr>
                        <th className="pe-3">Structures:</th>
                        <td>{prettyNumber(playerInfo.structureCount)}</td>
                    </tr>
                    <tr>
                        <th className="pe-3">Joined:</th>
                        <td><Timestamp value={playerInfo.joinedAt} /></td>
                    </tr>
                    <tr>
                        <th className="pe-3">Login token:</th>
                        <td onClick={() => setRevealToken(true)}>
                            {
                                revealToken ?
                                    getAuthToken()
                                    :
                                    "Click to reveal user token"
                            }
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}