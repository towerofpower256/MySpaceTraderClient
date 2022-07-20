import { useState, useEffect } from "react";

import LoggedInUserInfoContext from "./Contexts/LoggedInUserInfoContext";
import LoggedInContext from "./Contexts/LoggedInContext";
import GameLoadingContext from "./Contexts/GameLoadingContext";
import SystemsContext from "./Contexts/SystemsContext";
import PlayerInfoContext from "./Contexts/PlayerInfoContext";
import PlayerShipsContext from "./Contexts/PlayerShipsContext";

import GameLoadingPage from "./Pages/GameLoadingPage";

import { getAuthToken } from "./Services/LocalStorage";
import { getAllSystems, getPlayerInfo, getShips } from "./Services/SpaceTraderApi";
import { GAMELOADSTATE_ERROR, GAMELOADSTATE_LOADING, GAMELOADSTATE_NOTLOADED, GAMELOADSTATE_LOADED } from "./Constants";
import { readLocations } from "./Utils";


export default function ContextContainer(props) {
    const [isLoggedIn, setLoggedIn] = useState(!!getAuthToken()); // User is considered logged in if there's an auth token in storage
    const [gameLoadState, setGameLoadState] = useState(GAMELOADSTATE_NOTLOADED);
    const [gameLoadingMsg, setGameLoadingMsg] = useState("");

    // Setup contexts
    const [loggedInUserInfo, setLoggedInUserInfo] = useState({});
    const [systems, setSystems] = useState({});
    const [playerInfo, setPlayerInfo] = useState({});
    const [playerShips, setPlayerShips] = useState({});

    useEffect(() => {
        if (!isLoggedIn) {
            // If the user isn't logged in, don't do or load anything
            return;
        }
        // remember logged in user


        if (gameLoadState === GAMELOADSTATE_NOTLOADED) {
            // Load game data, if needed
            setGameLoadState(GAMELOADSTATE_LOADING);

            const loadJobs = [];
            loadJobs.push({
                name: "Loading systems",
                func: (resolve, reject) => {

                    getAllSystems()
                        .then(stcResponse => {
                            const systemData = readLocations(stcResponse.data.systems);
                            setSystems(systemData);
                            console.log("Loaded systems", systemData);
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        })

                }
            });

            loadJobs.push({
                name: "Loading player info",
                func: (resolve, reject) => {
                    getPlayerInfo()
                        .then(stcResponse => {
                            setPlayerInfo(stcResponse.data.user);
                            console.log("Loaded player info", stcResponse.data.user);
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        })

                }
            });

            loadJobs.push({
                name: "Loading player ships",
                func: (resolve, reject) => {
                    getShips()
                        .then(stcResponse => {
                            setPlayerShips(stcResponse.data);
                            console.log("Loaded player ships", stcResponse.data.ships);
                            resolve();
                        })
                        .catch(error => {
                            reject(error);
                        })

                }
            });



            // Run the game load jobs
            console.log("Loading game");
            loadJobs.reduce((prevPromise, nextJob) => {
                return prevPromise
                    .then(() => {
                        console.log("Running load job: " + nextJob.name);
                        setGameLoadingMsg(nextJob.name);
                        return new Promise(nextJob.func)
                            .catch(error => {
                                console.error("Error running load job '" + nextJob.name + "': " + error);
                                setGameLoadState(GAMELOADSTATE_ERROR);
                                setGameLoadingMsg("Error loading game");
                            });
                    })
            }, Promise.resolve())
                .then(result => {
                    setGameLoadState(GAMELOADSTATE_LOADED);
                    setGameLoadingMsg("Game loaded"); // Probably not needed
                });
        }

    }, [isLoggedIn]);

    return (
        <LoggedInUserInfoContext.Provider value={[loggedInUserInfo, setLoggedInUserInfo]}>
            <LoggedInContext.Provider value={[isLoggedIn, setLoggedIn]}>
                <GameLoadingContext.Provider value={[gameLoadState, gameLoadingMsg]}>
                    <SystemsContext.Provider value={[systems, setSystems]}>
                        <PlayerInfoContext.Provider value={[playerInfo, setPlayerInfo]}>
                            <PlayerShipsContext.Provider value={[playerShips, setPlayerShips]}>
                            <GameLoadingPage>
                                {props.children}
                            </GameLoadingPage>
                            </PlayerShipsContext.Provider>
                        </PlayerInfoContext.Provider>
                    </SystemsContext.Provider>
                </GameLoadingContext.Provider>
            </LoggedInContext.Provider>
        </LoggedInUserInfoContext.Provider>
    )
}