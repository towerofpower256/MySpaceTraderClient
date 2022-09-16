import { useState, useEffect } from "react";

import LoggedInUserInfoContext from "./Contexts/LoggedInUserInfoContext";
import LoggedInContext from "./Contexts/LoggedInContext";
import SystemsContext from "./Contexts/SystemsContext";
import PlayerInfoContext from "./Contexts/PlayerInfoContext";
import PlayerInfoContextSet from "./Contexts/PlayerInfoContextSet";
import PlayerShipsContext from "./Contexts/PlayerShipsContext";
import PlayerShipsContextSet from "./Contexts/PlayerShipsContextSet";
import FlightPlansContext from "./Contexts/FlightPlansContext";
import FlightPlansContextSet from "./Contexts/FlightPlansContextSet";
import MarketDataContext from "./Contexts/MarketDataContext";
import AppSettingsContext from "./Contexts/AppSettingsContext";
import RefreshWorkerContext from "./Contexts/RefreshWorkerContext";
import RefreshWorker from "./Services/RefreshWorker";
import populateShipNames from "./Utils/populateShipNames";

import {
    getAuthToken,
    loadMarketData,
    saveMarketData,
    loadPlayerShipsData,
    savePlayerShipsData,
    saveLoanTypes,
    loadLoanTypes,
    saveAppSettings,
    loadAppSettings,
    saveSystemsData,
    loadSystemsData,
    saveFlightPlanData,
    loadFlightPlanData,
    savePlayerInfo,
    loadPlayerInfo
} from "./Services/LocalStorage";
import updateFlightPlanHistory from "./Utils/updateFlightPlanHistory";
import FlightPlanCleanerWorker from "./Services/FlightPlanCleanerWorker";

export default function ContextContainer(props) {
    const [isLoggedIn, setLoggedIn] = useState(!!getAuthToken()); // User is considered logged in if there's an auth token in storage
    const [autoRefreshWorking, setAutoRefreshWorking] = useState(false);

    // Setup contexts
    const [appSettings, _setAppSettings] = useState(loadAppSettings());
    const [loggedInUserInfo, setLoggedInUserInfo] = useState({});
    const [systems, _setSystems] = useState(loadSystemsData());
    const [playerInfo, _setPlayerInfo] = useState(loadPlayerInfo());
    const [playerShips, _setPlayerShips] = useState(loadPlayerShipsData());
    const [flightPlans, _setFlightPlans] = useState(loadFlightPlanData());
    const [marketData, _setMarketData] = useState(loadMarketData());
    const [refreshWorkerState, setRefreshWorkerState] = useState({});

    function setPlayerInfo(a) {
        savePlayerInfo(a);
        _setPlayerInfo(a);
    }

    function setAppSettings(a) {
        saveAppSettings(a);
        _setAppSettings(a);
    }

    function setFlightPlans(a) {
        saveFlightPlanData(a);
        if (Array.isArray(a)) {
            a.forEach((fp) => updateFlightPlanHistory(fp)); // Feels sloppy, going through everything in the context.
        }
        _setFlightPlans(a);
    }

    function setPlayerShips(a) {
        populateShipNames(a);
        savePlayerShipsData(a);
        _setPlayerShips(a);
    }

    function setSystems(a) {
        saveSystemsData(a);
        _setSystems(a);
    }

    function setMarketData(a) {
        saveMarketData(a);
        _setMarketData(a);
    }

    useEffect(() => {
        if (!isLoggedIn) {
            // If the user isn't logged in, don't do or load anything
            //return;
        }
        // remember logged in user

    }, [isLoggedIn]);

    return (
        <AppSettingsContext.Provider value={[appSettings, setAppSettings]}>
            <LoggedInUserInfoContext.Provider value={[loggedInUserInfo, setLoggedInUserInfo]}>
                <LoggedInContext.Provider value={[isLoggedIn, setLoggedIn]}>
                    <SystemsContext.Provider value={[systems, setSystems]}>
                        <PlayerInfoContext.Provider value={[playerInfo, setPlayerInfo]}>
                            <PlayerInfoContextSet.Provider value={[setPlayerInfo]}>
                                <PlayerShipsContext.Provider value={[playerShips, setPlayerShips]}>
                                    <PlayerShipsContextSet.Provider value={[setPlayerShips]}>
                                        <FlightPlansContext.Provider value={[flightPlans, setFlightPlans]}>
                                            <FlightPlansContextSet.Provider value={[setFlightPlans]} >
                                            <MarketDataContext.Provider value={[marketData, setMarketData]}>
                                                <RefreshWorkerContext.Provider value={[refreshWorkerState, setRefreshWorkerState]}>
                                                    <RefreshWorker />
                                                    <FlightPlanCleanerWorker />
                                                    {props.children}
                                                </RefreshWorkerContext.Provider>
                                            </MarketDataContext.Provider>
                                            </FlightPlansContextSet.Provider>
                                        </FlightPlansContext.Provider>
                                    </PlayerShipsContextSet.Provider>
                                </PlayerShipsContext.Provider>
                            </PlayerInfoContextSet.Provider>
                        </PlayerInfoContext.Provider>
                    </SystemsContext.Provider>
                </LoggedInContext.Provider>
            </LoggedInUserInfoContext.Provider>
        </AppSettingsContext.Provider>
    )
}