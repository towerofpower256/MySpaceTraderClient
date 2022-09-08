import prettyNumber from "../../Utils/prettyNumber"

import Table from "react-bootstrap/esm/Table";
import Timestamp from "../Timestamp";

export default function PlayerInfoSummary(props) {
    const playerInfo = props.playerInfo || {};

    return (
        <div>
            <table>
                <tbody>
                    <tr>
                        <th>Username:</th>
                        <td>{playerInfo.username}</td>
                    </tr>
                    <tr>
                        <th>Credits:</th>
                        <td>${prettyNumber(playerInfo.credits)}</td>
                    </tr>
                    <tr>
                        <th>Ships:</th>
                        <td>{prettyNumber(playerInfo.shipCount)}</td>
                    </tr>
                    <tr>
                        <th>Structures:</th>
                        <td>{prettyNumber(playerInfo.structureCount)}</td>
                    </tr>
                    <tr>
                        <th>Joined:</th>
                        <td><Timestamp value={playerInfo.joinedAt} /></td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}