import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";
import { prettyNumber } from "../../Utils.js";

function PlayerInfoPage(props) {

    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [playerInfo, setPlayerInfo] = useState([]) // Create new state variable for user info data

    useEffect(() => {
        const stClient = new SpaceTraderClient();
        stClient.getPlayerInfo()
            .then(
                (response) => {
                    console.log("PlayerInfoPage Reponse ", response);
                    stClient.readResponse(response)
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
        /*
            .then(
                (response) => {
                    if (!response.ok) {
                        response.text().then(text =>
                            doError(response.status + ", " + text)
                        );


                    } else {
                        response.json().then(
                            data => {
                                try {
                                    console.log("Loading user data:", data);
                                    setPlayerInfo(data);
                                    setLoaded(true);
                                } catch (ex) {
                                    doError(ex);
                                }

                            },
                            error => {
                                doError("Error reading the response payload: " + error);
                            }
                        );
                    }

                },
                (error) => {
                    doError(error);
                }
            );
            */
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



    if (playerInfo) {
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
                            <td>{playerInfo.user.joinedAt}</td>
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