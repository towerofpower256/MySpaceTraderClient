import { useState, useEffect } from "react";

import LoggedInUserInfoContext from "./Contexts/LoggedInUserInfoContext";
import LoggedInContext from "./Contexts/LoggedInContext";
import GameLoadingContext from "./Contexts/GameLoadingContext";
import SystemsContext from "./Contexts/SystemsContext";
import PlayerInfoContext from "./Contexts/PlayerInfoContext";
import PlayerShipsContext from "./Contexts/PlayerShipsContext";
import FlightPlansContext from "./Contexts/FlightPlansContext";
import MarketDataContext from "./Contexts/MarketDataContext";


import { getAuthToken, loadMarketData, saveMarketData, loadPlayerShipsData, savePlayerShipsData } from "./Services/LocalStorage";
import { getLocationMarketplace, getAllSystems, getFlightPlan, getPlayerInfo, getShips } from "./Services/SpaceTraderApi";
import { GAMELOADSTATE_ERROR, GAMELOADSTATE_LOADING, GAMELOADSTATE_NOTLOADED, GAMELOADSTATE_LOADED, AUTOREFRESH_DEFAULT } from "./Constants";
import { insertOrUpdate, readLocations } from "./Utils";

export default function ContextContainer(props) {
    const [isLoggedIn, setLoggedIn] = useState(!!getAuthToken()); // User is considered logged in if there's an auth token in storage
    const [autoRefreshDisabled, setAutoRefreshDisabled] = useState(false);
    const [autoRefreshWorking, setAutoRefreshWorking] = useState(false);

    // Setup contexts
    const [loggedInUserInfo, setLoggedInUserInfo] = useState({});
    const [systems, setSystems] = useState({});
    const [playerInfo, setPlayerInfo] = useState({});
    const [playerShips, setPlayerShips] = useState(loadPlayerShipsData());
    const [flightPlans, setFlightPlans] = useState([]);
    const [marketData, setMarketData] = useState(loadMarketData());

    let _playerShips = undefined;
    let autoRefreshTimer = undefined;

    function refreshPlayerInfo(resolve, reject) {
        console.log("Refreshing player info");
        getPlayerInfo()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    reject(stcResponse.errorPretty);
                }
                setPlayerInfo(stcResponse.data.user);
                console.log("Loaded player info", stcResponse.data.user);
                resolve();
            })
            .catch(error => {
                reject(error);
            })
    }

    function refreshSystems(resolve, reject) {
        console.log("Refreshing systems info");
        getAllSystems()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    reject(stcResponse.errorPretty);
                }
                const systemData = readLocations(stcResponse.data.systems);
                setSystems(systemData);
                console.log("Loaded systems", systemData);
                resolve();
            })
            .catch(error => {
                reject(error);
            });
    }

    function refreshPlayerShips(resolve, reject) {
        console.log("Refreshing player ships");
        getShips()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    reject(stcResponse.errorPretty);
                }
                _playerShips = stcResponse.data.ships; // Need access to this immediately before the state finishes updating
                savePlayerShipsData(_playerShips);
                setPlayerShips(_playerShips);
                console.log("Loaded player ships", stcResponse.data.ships);
                resolve();
            })
            .catch(error => {
                reject(error);
            })
    }

    function refreshFlightPlans(flightPlans) {
        return flightPlans.reduce((prevPromise, nextJob) => {
            return new Promise((resolve, reject) => {
                console.log("Refreshing flight plan", nextJob);
                getFlightPlan(nextJob)
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }

                        const newFP = stcResponse.data.flightPlan;
                        if (!newFP) {
                            reject("'flightPlan' is missing from response data");
                            return;
                        }

                        // TO DO update flight plan with result
                        const _flightPlans = insertOrUpdate([...flightPlans], newFP, (fp) => fp.id === nextJob);
                        setFlightPlans(_flightPlans);

                        resolve();
                    },
                        error => {
                            console.error("Error refreshing flight plan", nextJob, error);
                            reject(error);
                        })
            })
        }, Promise.resolve())

    }

    function refreshMarketData(marketLocations) {
        return marketLocations.reduce((prevPromise, nextJob) => {
            return new Promise((resolve, reject) => {
                console.log("Refreshing market data", nextJob);
                getLocationMarketplace(nextJob)
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                            return;
                        }

                        const newMD = stcResponse.data.marketplace;
                        if (!newMD) {
                            reject("'marketplace' is missing from response data");
                            return;
                        }

                        const md = {location: nextJob, updatedAt: new Date(), goods: newMD};
                        const _marketData = insertOrUpdate([...marketData], md, (md) => md.location == nextJob);
                        saveMarketData(_marketData);
                        setMarketData(_marketData);

                        resolve();
                    },
                        error => {
                            console.error("Error refreshing market data", nextJob, error);
                            reject(error);
                        })
            })
        }, Promise.resolve())
    }


    function autoRefreshData() {
        if (!isLoggedIn) {
            return; // User is not logged in, don't even try refreshing
        }

        if (autoRefreshWorking) {
            return; // Auto sync is already working, don't start refreshing again
        }

        if (autoRefreshDisabled) {
            return; // Auto refresh is disabled, don't refresh
        }

        setAutoRefreshWorking(true);
        console.log("Running autoRefreshData");

        const refreshError = false;
        const refreshBaseJobs = [];

        /*
        loadJobs.push({
            name: "DEBUG load job",
            func: (resolve, reject) => {
                throw "Test error";
            }
        });
        */

        refreshBaseJobs.push(refreshPlayerInfo);
        refreshBaseJobs.push(refreshSystems);
        refreshBaseJobs.push(refreshPlayerShips);

        console.log("Running base refresh jobs");

        refreshBaseJobs.reduce((prevPromise, nextJob) => {
            return prevPromise
                .then(value => {
                    return new Promise(nextJob);
                })
                .catch(error => {
                    console.log("Refresh job error", error);
                });

        }, Promise.resolve())
            .then(() => {
                // Post base job refresh
                // Now refresh the supplimental data
                console.log("Base refresh complete");

                const marketsToRefresh = [];
                const flightPlansToRefresh = [];

                _playerShips.forEach((ship, idx) => {
                    if (ship) {
                        if (ship.location && !marketsToRefresh.includes(ship.location)) {
                            marketsToRefresh.push(ship.location);
                        }

                        if (ship.flightPlanId && !flightPlansToRefresh.includes(ship.flightPlanId)) {
                            flightPlansToRefresh.push(ship.flightPlanId);
                        }
                    }
                });

                console.log("marketsToRefresh", marketsToRefresh);
                console.log("flightPlansToRefresh", flightPlansToRefresh);

                refreshFlightPlans(flightPlansToRefresh)
                    .then(refreshMarketData(marketsToRefresh)
                        .finally(() => {
                            // Setup the next loop
                            console.log("Refresh complete");
                            autoRefreshTimer = setTimeout(autoRefreshData, AUTOREFRESH_DEFAULT);
                            setAutoRefreshWorking(false);
                        })
                    )
            })
    }

    useEffect(() => {
        if (!isLoggedIn) {
            // If the user isn't logged in, don't do or load anything
            //return;
        }
        // remember logged in user

        if (isLoggedIn && !autoRefreshDisabled) {

            if (!autoRefreshTimer) {
                // Auto refresh timer is not set
                // Fire the auto refresh, it should setup the timer as its final action
                autoRefreshData();
            }

        } else {
            // Should not auto refresh.
            // Clear interval if needed.
            if (autoRefreshTimer) {
                console.log("Should not refresh, clearing auto refresh timer");
                clearTimeout(autoRefreshTimer);
            }
        }

    }, [isLoggedIn, autoRefreshDisabled]);

    return (
        <LoggedInUserInfoContext.Provider value={[loggedInUserInfo, setLoggedInUserInfo]}>
            <LoggedInContext.Provider value={[isLoggedIn, setLoggedIn]}>
                <SystemsContext.Provider value={[systems, setSystems]}>
                    <PlayerInfoContext.Provider value={[playerInfo, setPlayerInfo]}>
                        <PlayerShipsContext.Provider value={[playerShips, setPlayerShips]}>
                            <FlightPlansContext.Provider value={[flightPlans, setFlightPlans]}>
                                <MarketDataContext.Provider value={[marketData, setMarketData]}>
                                    {props.children}
                                </MarketDataContext.Provider>
                            </FlightPlansContext.Provider>
                        </PlayerShipsContext.Provider>
                    </PlayerInfoContext.Provider>
                </SystemsContext.Provider>
            </LoggedInContext.Provider>
        </LoggedInUserInfoContext.Provider>
    )
}