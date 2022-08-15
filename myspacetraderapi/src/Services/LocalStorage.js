import { STORAGE_ACCESS_TOKEN, STORAGE_USER_NAME, STORAGE_MARKET_DATA, STORAGE_PLAYER_SHIPS, STORAGE_LOAN_TYPES } from "../Constants";

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