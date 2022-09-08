import { useContext, useEffect, useState } from "react";
import RefreshWorkerJobs from "./RefreshWorkerJobs";
import AppSettingsContext from "../Contexts/AppSettingsContext";
import LoggedInContext from "../Contexts/LoggedInContext";
import RefreshWorkerContext from "../Contexts/RefreshWorkerContext";
import isAutoRefreshEnabled from "../Utils/isAutoRefreshEnabled";

import {
    getLocalStorageItem,
    setLocalStorageItem
} from "../Services/LocalStorage";



// Worker class to refresh data at regular intervals.
// Should support
// - Definition data, just once, unless told to again.
// - Transactional data, at regular intervals
// - Cleaning activities
export default function RefreshWorker(props) {
    const [workerState, setWorkerState] = useState({});
    const [isLoggedIn, setLoggedIn] = useContext(LoggedInContext);
    const [appSettings, setAppSettings] = useContext(AppSettingsContext);
    const [refreshTimerToken, setRefreshTimerToken] = useState(undefined);
    const [refreshJobs, setRefreshJobs] = useState([]);

    useEffect(() => {
        // If not logged in, don't sync
        // If auto sync disabled, don't sync
        const shouldSync = (isLoggedIn === true && isAutoRefreshEnabled(appSettings));

        // If heartbeat already started, don't start it again
        if (shouldSync && (!refreshTimerToken || !workerState.enabled)) {
            // Should refresh, but timer hasn't started
            enableWorker();
        }
        if (!shouldSync && (refreshTimerToken || workerState.enabled)) {
            disableWorker();
        }

    }, [isLoggedIn, appSettings]);

    // On mount
    useEffect(() => {

    }, []);

    // On unmount
    useEffect(() => () => {
        console.log("Unmounting refresh worker");
        disableWorker();
    }, []);

    function enableWorker() {
        console.log("Enabling refresh worker");
        workerState.enabled = true;
        setWorkerState({ ...workerState });
        setRefreshTimerToken(setInterval(runWorker, 1000));
        runWorker();
    }

    function disableWorker() {
        console.log("Disabling refresh worker");
        workerState.enabled = false;
        setWorkerState({ ...workerState });
        clearInterval(refreshTimerToken);
        setRefreshTimerToken(null);
    }

    function runWorker() {
        if (!workerState.enabled) {
            // Worker not enabled
            return;
        }

        if (workerState.working) {
            // Is already working, don't start again
            return;
        }

        //console.log("=== Running refresh worker");
        workerState.working = true;
        setWorkerState(workerState);

        // TODO find a way to abort in-flight refresh jobs

        refreshJobs.reduce((prevPromise, nextJob) => {

            return prevPromise
                .then(value => {
                    // Check if this jobs should be run.
                    if (!hasJobIntervalPassed(loadJobTimestamp(nextJob.name), nextJob.interval)) {
                        return prevPromise;
                    }

                    console.log("=== Running refresh job: ", nextJob.name);

                    return new Promise(nextJob.func)
                        .catch(error => {
                            console.error("Refresh job error: ", nextJob.name, error);
                        })
                        .finally(() => {
                            saveJobTimestamp(nextJob.name);
                        })
                })
        }, Promise.resolve())
            .then(result => {
                // Refresh run complete
            })
            .catch(error => {
                // Refresh job error
            })
            .finally(() => {
                //console.log("=== Refresh worker complete");
                workerState.working = false;
                setWorkerState({ ...workerState });
            })
    }

    function saveJobTimestamp(jobName, a) {
        if (!a) a = new Date();
        setLocalStorageItem("job." + jobName + ".last_run", a.toISOString());
    }

    function loadJobTimestamp(jobName) {
        return getLocalStorageItem("job." + jobName + ".last_run");
    }

    function hasJobIntervalPassed(lastRun, interval) {
        if (!lastRun) return true;
        const thresh = (new Date(lastRun).setMilliseconds(interval));
        return (thresh < new Date());
    }

    function addJob(newJob) {
        refreshJobs.push(newJob);
        setRefreshJobs(refreshJobs);
    }

    return (
        <RefreshWorkerJobs addJob={addJob} />
    )
}