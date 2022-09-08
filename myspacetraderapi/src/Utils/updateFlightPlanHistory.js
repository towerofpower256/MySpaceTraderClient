import { FLIGHT_PLAN_HISTORY_LENGTH } from "../Constants";
import { loadFlightPlanHistory, saveFlightPlanHistory } from "../Services/LocalStorage"
import insertOrUpdate from "./insertOrUpdate";

export default function updateFlightPlanHistory(newFlightPlan) {
    const flightPlanHistory = loadFlightPlanHistory();
    insertOrUpdate(flightPlanHistory, newFlightPlan, (fp) => fp.id === newFlightPlan.id); // Add if it's missing, update if it's already there

    flightPlanHistory.sort((a, b) => new Date(a.createdAt) < new Date(b.createdAt)); // Sort by createdAt

    const activeFlightPlans = [];
    const inactiveFlightPlans = [];
    flightPlanHistory.forEach((fp) => {
        if (new Date(fp.arrivesAt) > new Date()) {
            activeFlightPlans.push(fp);
        } else {
            inactiveFlightPlans.push(fp);
        }
    });

    // Always keep flight plans that haven't finished yet (arrival in the future)
    const _fpHistory = activeFlightPlans;

    // Include any inactive flight plans, up to the limit
    for (let i=0; i < inactiveFlightPlans.length && _fpHistory.length < FLIGHT_PLAN_HISTORY_LENGTH; i++) {
        _fpHistory.push(inactiveFlightPlans[i]);
    }

    // Save
    saveFlightPlanHistory(_fpHistory);
}