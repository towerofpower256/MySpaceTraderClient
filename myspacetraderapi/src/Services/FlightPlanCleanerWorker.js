import { useContext, useEffect, useState } from "react";
import FlightPlansContextSet from "../Contexts/FlightPlansContextSet";
import PlayerShipsContextSet from "../Contexts/PlayerShipsContextSet";
import insertOrUpdate from "../Utils/insertOrUpdate";
import { loadFlightPlanData, loadPlayerShipsData } from "./LocalStorage";
import { getShipInfo } from "./SpaceTraderApi";


export default function FlightPlanCleanerWorker(props) {
    const [setFlightPlans] = useContext(FlightPlansContextSet);
    const [setPlayerShips] = useContext(PlayerShipsContextSet);

    useEffect(() => {
        cleanFlightPlans();
        const timerId = setInterval(cleanFlightPlans, 1000)

        return (() => {
            // On unmount
            //console.log("Timer dismount");
            clearInterval(timerId);
        })
    }, []);

    function cleanFlightPlans() {
        let didUpdate = false;
        const _flightPlans = [];
        const shipsToRefresh = []

        // remove any flight plans where the arrivesAt is in the past
        loadFlightPlanData().forEach((fp) => {
            if (new Date(fp.arrivesAt) > new Date()) {
                _flightPlans.push(fp);
            } else {
                // Only update ships if the flight plan recently timed out. 10 secs.
                // Don't want to smash the update for every ship when the user opens the browser
                // and there's 50 expired flight plans that were in-flight when the app was closed.
                if (new Date() - new Date(fp.arrivesAt) < 10e3) {
                    shipsToRefresh.push(fp.shipId);
                }
                
                didUpdate = true;
            }
        });

        if (didUpdate) {
            console.log("Cleaned flight plans, refreshing", shipsToRefresh.length, "ships");
            setFlightPlans(_flightPlans);
        } 

        // TODO update ships after their flight plan is removed
        shipsToRefresh.reduce((prevPromise, nextJob) => {
            return prevPromise
            .then(value => {
                new Promise((resolve, reject) => {
                    console.log("Refresh ship from finished flight plan", nextJob);
                    getShipInfo(nextJob)
                    .then(stcResponse => {
                        if (!stcResponse.ok) {
                            reject(stcResponse.errorPretty);
                            return;
                        }

                        const ship = stcResponse.data.ship;
                        if (ship) {
                            setPlayerShips(insertOrUpdate(loadPlayerShipsData(), ship, s => s.id === ship.id));
                        }

                        setTimeout(resolve, 1000);
                    })
                    .catch(error=> {
                        reject(error);
                    })
                })
            });

        }, Promise.resolve());
    }

    return (<>{props.children}</>);
}