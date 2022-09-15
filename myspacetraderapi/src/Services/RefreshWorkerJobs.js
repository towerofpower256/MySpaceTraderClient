import { useContext, useEffect } from "react";
import {
    getLocationMarketplace,
    getAllSystems,
    getFlightPlan,
    getPlayerInfo,
    getShips,
    getAllGoodTypes,
    getAllShipTypes,
    getAllStructureTypes
} from "../Services/SpaceTraderApi";
import {
    loadMarketData,
    saveMarketData,
    saveFlightPlanData,
    loadFlightPlanData,
    saveGoodTypes,
    saveStructureTypes,
    saveShipTypes,
    loadPlayerShipsData
} from "../Services/LocalStorage";
import insertOrUpdate from "../Utils/insertOrUpdate";
import readLocations from "../Utils/readLocations";
import RefreshWorkerContext from "../Contexts/RefreshWorkerContext";
import AppSettingsContext from "../Contexts/AppSettingsContext";
import SystemsContext from "../Contexts/SystemsContext";
import PlayerShipsContext from "../Contexts/PlayerShipsContext";
import FlightPlansContext from "../Contexts/FlightPlansContext";
import MarketDataContext from "../Contexts/MarketDataContext";
import PlayerInfoContext from "../Contexts/PlayerInfoContext";

export default function RefreshWorkerJobs(props) {
    const addJob = props.addJob;
    const [systems, setSystems] = useContext(SystemsContext);
    const [playerInfo, setPlayerInfo] = useContext(PlayerInfoContext);
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);
    const [flightPlans, setFlightPlans] = useContext(FlightPlansContext);
    const [marketData, setMarketData] = useContext(MarketDataContext);

    // On mount
    useEffect(() => {
        addJob({
            name: "flight_plan_cleaner",
            interval: 1000, // 1 second
            func: function (resolve, reject) {
                let didUpdate = false;
                const _flightPlans = [];

                // remove any flight plans where the arrivesAt is in the past
                loadFlightPlanData().forEach((fp) => {
                    if (new Date(fp.arrivesAt) > new Date()) {
                        _flightPlans.push(fp);
                    } else {
                        didUpdate = true;
                    }
                });
                if (didUpdate) setFlightPlans(_flightPlans);

                resolve();
            }
        });

        addJob({
            name: "player_info",
            interval: 1e4, // 10 seconds
            func: function (resolve, reject) {
                getPlayerInfo()
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }
                        setPlayerInfo(stcResponse.data.user);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });

        addJob({
            name: "systems",
            interval: 6e5, // 10 mins
            func: function (resolve, reject) {
                getAllSystems()
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }
                        const systemData = readLocations(stcResponse.data.systems);
                        setSystems(systemData);
                        //console.log("Loaded systems", systemData);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    });
            }
        });

        addJob({
            name: "player_ships",
            interval: 1e4, // 10 seconds
            func: function (resolve, reject) {
                getShips()
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }
                        setPlayerShips(stcResponse.data.ships);
                        //console.log("Loaded player ships", stcResponse.data.ships);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });

        addJob({
            name: "player_flight_plans",
            interval: 1e4, // 10 seconds
            func: function (resolve, reject) {
                // Get a list of ships to fetch flight plans for
                const flightPlansToUpdate = [];
                loadPlayerShipsData().forEach((ship, idx) => {
                    if (ship.flightPlanId && !flightPlansToUpdate.includes(ship.flightPlanId)) {
                        flightPlansToUpdate.push(ship.flightPlanId);
                    }
                });

                console.log("flightPlansToUpdate", flightPlansToUpdate);

                flightPlansToUpdate.reduce((prevPromise, nextJob) => {
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

                                let _flightPlans = insertOrUpdate([...loadFlightPlanData()], newFP, (fp) => fp.id === nextJob);

                                setFlightPlans(_flightPlans);

                                resolve();
                            },
                                error => {
                                    console.error("Error refreshing flight plan", nextJob, error);
                                    reject(error);
                                })
                    })
                }, Promise.resolve())
                    .then(result => resolve(result), error => reject(error)); // resolve, we're finished updating flight plans
            }
        });

        addJob({
            name: "market_data",
            interval: 1e4, // 10 seconds
            func: function (resolve, reject) {
                // Get a list of ships to fetch flight plans for
                const marketsToRefresh = [];

                loadPlayerShipsData().forEach((ship, idx) => {
                    if (ship.location && !marketsToRefresh.includes(ship.location)) {
                        marketsToRefresh.push(ship.location);
                    }
                });

                console.log("marketsToRefresh", marketsToRefresh);

                marketsToRefresh.reduce((prevPromise, nextJob) => {
                    return prevPromise
                    .then(value => {
                        return new Promise((_resolve, _reject) => {
                            console.log("Refreshing market data", nextJob);
                            getLocationMarketplace(nextJob)
                                .then(stcResponse => {
                                    if (!stcResponse.ok) {
                                        _reject(stcResponse.errorPretty);
                                        return;
                                    }

                                    const newMD = stcResponse.data.marketplace;
                                    if (!newMD) {
                                        reject("'marketplace' is missing from response data");
                                        return;
                                    }

                                    const md = { location: nextJob, updatedAt: new Date(), goods: newMD };
                                    const _marketData = insertOrUpdate([...loadMarketData()], md, (md) => md.location == nextJob);
                                    setMarketData(_marketData);

                                    setTimeout(() => { _resolve() }, 500);
                                    //_resolve();
                                },
                                    error => {
                                        console.error("Error refreshing market data", nextJob, error);
                                        _reject(error);
                                    })
                        })
                    })

                }, Promise.resolve())
                    .then(result => resolve(result), error => reject(error)); // resolve, we're finished updating market data

            }
        })

        addJob({
            name: "good_types",
            interval: 60480e5, // 1 week
            func: function (resolve, reject) {
                getAllGoodTypes()
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }
                        saveGoodTypes(stcResponse.data.goods);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });

        addJob({
            name: "good_types",
            interval: 60480e5, // 1 week
            func: function (resolve, reject) {
                getAllGoodTypes()
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }
                        saveGoodTypes(stcResponse.data.goods);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });

        addJob({
            name: "structure_types",
            interval: 60480e5, // 1 week
            func: function (resolve, reject) {
                getAllStructureTypes()
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }
                        saveStructureTypes(stcResponse.data.structures);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });

        addJob({
            name: "ship_types",
            interval: 60480e5, // 1 week
            func: function (resolve, reject) {
                getAllShipTypes()
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                        }
                        saveShipTypes(stcResponse.data.ships);
                        resolve();
                    })
                    .catch(error => {
                        reject(error);
                    })
            }
        });


    }, []);

    return (
        <>
            {props.children}
        </>
    )
}