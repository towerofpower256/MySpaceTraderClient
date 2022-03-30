import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import { getPlayerInfo, readResponse } from "../../Services/SpaceTraderApi.js";
import { prettyNumber } from "../../Utils.js";
import Timestamp from "../Common/Timestamp.js";

function PlayerInfoPage(props) {

    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [playerInfo, setPlayerInfo] = useState([]) // Create new state variable for user info data

    useEffect(() => {
        getPlayerInfo()
            .then(
                (response) => {
                    console.log("PlayerInfoPage Reponse ", response);
                    readResponse(response)
                        .then(
                            stcResponse => {
                                console.log("PlayerInfoPage StcResponse ", stcResponse);
                                if (!stcResponse.ok) {
                                    doError("(" + stcResponse.errorCode + ") " + stcResponse.error);
                                } else {
                                    setPlayerInfo(stcResponse.data);
                                    setLoaded(true);
                                }
                            }
                        );

                },
                (error) => {
                    doError(error);
                });
    }, []);

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    if (!isLoaded) {
        return (
            <Page title="Player info">
                <pre>It's loading</pre>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title="Player info">
                <pre>ERROR: {error}</pre>
            </Page>
        );
    }



    if (!playerInfo) {
        return(
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
                            <td>{playerInfo.user.username}</td>
                        </tr>
                        <tr>
                            <td>Ship count:</td>
                            <td>{playerInfo.user.shipCount}</td>
                        </tr>
                        <tr>
                            <td>Structure count:</td>
                            <td>{playerInfo.user.structureCount}</td>
                        </tr>
                        <tr>
                            <td>Joined:</td>
                            <td><Timestamp value={playerInfo.user.joinedAt} /></td>
                        </tr>
                        <tr>
                            <td>Credits:</td>
                            <td>{prettyNumber(playerInfo.user.credits)}</td>
                        </tr>
                    </tbody>
                </table>



            </Page >
        );
    }
}

export default PlayerInfoPage;