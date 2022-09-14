import { 
    STORAGE_ACCESS_TOKEN,
    STORAGE_USER_NAME, 
    STORAGE_MARKET_DATA, 
    STORAGE_PLAYER_INFO, 
    STORAGE_PLAYER_SHIPS, 
    STORAGE_LOAN_TYPES,
    STORAGE_APP_SETTINGS,
    STORAGE_SYSTEMS,
    STORAGE_FLIGHT_PLANS,
    STORAGE_GOOD_TYPES,
    STORAGE_STRUCTURE_TYPES,
    STORAGE_SHIP_TYPES,
    STORAGE_ROUTE_FINDER_LAST_RESULT,
    STORAGE_ROUTE_FINDER_SETTINGS,
    STORAGE_TRADE_HISTORY,
    STORAGE_FLIGHT_PLAN_HISTORY
} from "../Constants";

export function getLocalStorageItem(key) {
    return localStorage.getItem(key);
}

export function setLocalStorageItem(key, value) {
    localStorage.setItem(key, value);
}

export function removeLocalStorageItem(key) {
    localStorage.removeItem(key);
}

export function getLocalStorageItemAsJson(key, defaultValue) {
    try {
        const a = getLocalStorageItem(key);
        if (a == null) return defaultValue; // Handle values not in storage
        return JSON.parse(a);
    } catch (ex) {
        return defaultValue || null;
    }
}

export function setLocalStorageItemAsJson(key, value) {
    setLocalStorageItem(key, JSON.stringify(value));
}

export function getSessionStorageItem(key) {
    return sessionStorage.getItem(key);
}

export function setSessionStorageItem(key, value) {
    sessionStorage.setItem(key, value);
}

export function removeSessionStorageItem(key) {
    sessionStorage.removeItem(key);
}

export function getSessionStorageItemAsJson(key, defaultValue) {
    try {
        const a = getSessionStorageItem(key);
        if (a == null) return defaultValue; // Handle values not in storage
        return JSON.parse(a);
    } catch (ex) {
        return defaultValue || null;
    }
}

export function setSessionStorageItemAsJson(key, value) {
    setSessionStorageItem(key, JSON.stringify(value));
}

export function getAuthToken() {
    let token = getLocalStorageItem(STORAGE_ACCESS_TOKEN);
    if (!token) return token;
    return atob(token);
}

export function setAuthToken(a) {
    setLocalStorageItem(STORAGE_ACCESS_TOKEN, btoa(a));
}

export function getUserName() {
    let username = getLocalStorageItem(STORAGE_USER_NAME);
    if (!username) return username;
    return atob(username);
}

export function setUserName(a) {
    setLocalStorageItem(STORAGE_USER_NAME, btoa(a));
}

export function setLogin(authToken, userName) {
    setAuthToken(authToken);
    setUserName(userName);
}

export function clearAuth() {
    removeLocalStorageItem(STORAGE_USER_NAME);
    removeLocalStorageItem(STORAGE_ACCESS_TOKEN);
}

export function saveMarketData(a) {
    setLocalStorageItemAsJson(STORAGE_MARKET_DATA, a);
}

export function loadMarketData() {
    return getLocalStorageItemAsJson(STORAGE_MARKET_DATA, []);
}

export function savePlayerInfo(a) {
    setLocalStorageItemAsJson(STORAGE_PLAYER_INFO, a);
}

export function loadPlayerInfo() {
    return getLocalStorageItemAsJson(STORAGE_PLAYER_INFO, {});
}

export function savePlayerShipsData(a) {
    setLocalStorageItemAsJson(STORAGE_PLAYER_SHIPS, a);
}

export function loadPlayerShipsData() {
    return getLocalStorageItemAsJson(STORAGE_PLAYER_SHIPS, []);
}

export function saveLoanTypes(a) {
    setLocalStorageItemAsJson(STORAGE_LOAN_TYPES, a);
}

export function loadLoanTypes() {
    return getLocalStorageItemAsJson(STORAGE_LOAN_TYPES, []);
}

export function saveAppSettings(a) {
    setLocalStorageItemAsJson(STORAGE_APP_SETTINGS, a);
}

export function loadAppSettings() {
    return getLocalStorageItemAsJson(STORAGE_APP_SETTINGS, {});
}

export function saveSystemsData(a) {
    setLocalStorageItemAsJson(STORAGE_SYSTEMS, a);
}

export function loadSystemsData() {
    return getLocalStorageItemAsJson(STORAGE_SYSTEMS, {});
}

export function saveFlightPlanData(a) {
    setLocalStorageItemAsJson(STORAGE_FLIGHT_PLANS, a);
}

export function loadFlightPlanData() {
    return getLocalStorageItemAsJson(STORAGE_FLIGHT_PLANS, []);
}

export function saveGoodTypes(a) {
    setLocalStorageItemAsJson(STORAGE_GOOD_TYPES, a);
}

export function loadGoodTypes() {
    return getLocalStorageItemAsJson(STORAGE_GOOD_TYPES, []);
}

export function saveStructureTypes(a) {
    setLocalStorageItemAsJson(STORAGE_STRUCTURE_TYPES, a);
}

export function loadStructureTypes() {
    return getLocalStorageItemAsJson(STORAGE_STRUCTURE_TYPES, []);
}

export function saveShipTypes(a) {
    setLocalStorageItemAsJson(STORAGE_SHIP_TYPES, a);
}

export function loadShipTypes() {
    return getLocalStorageItemAsJson(STORAGE_SHIP_TYPES, []);
}

export function saveRouteFinderResults(a) {
    setSessionStorageItemAsJson(STORAGE_ROUTE_FINDER_LAST_RESULT, a);
}

export function loadRouteFinderResults() {
    return getSessionStorageItemAsJson(STORAGE_ROUTE_FINDER_LAST_RESULT, []);
}

export function saveRouteFinderSettings(a) {
    setSessionStorageItemAsJson(STORAGE_ROUTE_FINDER_SETTINGS, a);
}

export function loadRouteFinderSettings() {
    return getSessionStorageItemAsJson(STORAGE_ROUTE_FINDER_SETTINGS, {
        shipSpeed: 1,
        shipCargoSize: 250,
        orderBy: "trade_run_profit_per_second"
    });
}

export function saveTradeHistory(a) {
    setLocalStorageItemAsJson(STORAGE_TRADE_HISTORY, a);
}

export function loadTradeHistory() {
    return getLocalStorageItemAsJson(STORAGE_TRADE_HISTORY, []);
}

export function saveFlightPlanHistory(a) {
    setLocalStorageItemAsJson(STORAGE_FLIGHT_PLAN_HISTORY, a);
}

export function loadFlightPlanHistory() {
    return getLocalStorageItemAsJson(STORAGE_FLIGHT_PLAN_HISTORY, []);
}