import prettyNumber from "../../Utils/prettyNumber"

import Table from "react-bootstrap/esm/Table";
import Timestamp from "../Timestamp";

export default function PlayerInfoSummary(props) {
    const playerInfo = props.playerInfo || {};

    return (
        <div>
            <Table size="sm" className="text-start">
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
                        <td>Ships:</td>
                        <td>{prettyNumber(playerInfo.shipCount)}</td>
                    </tr>
                    <tr>
                        <td>Structures:</td>
                        <td>{prettyNumber(playerInfo.structureCount)}</td>
                    </tr>
                    <tr>
                        <td>Joined:</td>
                        <td><Timestamp value={playerInfo.joinedAt} /></td>
                    </tr>
                </tbody>
            </Table>
        </div>
    )
}