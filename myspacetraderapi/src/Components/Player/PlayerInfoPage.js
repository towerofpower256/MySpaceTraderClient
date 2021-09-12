import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";

function PlayerInfoPage(props) {

    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [playerInfo, setPlayerInfo] = useState([]) // Create new state variable for user info data

    useEffect(() => {
        const stClient = new SpaceTraderClient();
        stClient.getPlayerInfo()
            .then(
                (data) => {
                    console.log("Loading user data:", data);
                    setPlayerInfo(data);
                    setLoaded(true);
                },
                (error) => {
                    console.log("ERROR", error);
                    setLoaded(true);
                    setError(error);
                }
            );
    }, []);

    if (!isLoaded) {
        return (
            <Page title="Player info">
                <pre>It's loading</pre>
            </Page>
        );
    }

    if (error) {
        return (
            <page title="Player info">
                <pre>ERROR: {error}</pre>
            </page>
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

                <table class="table table-striped">
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
                            <td>{playerInfo.user.credits}</td>
                        </tr>
                    </tbody>
                </table>



            </Page >
        );
    }
}

export default PlayerInfoPage;