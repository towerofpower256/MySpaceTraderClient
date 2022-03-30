import { STORAGE_ACCESS_TOKEN, STORAGE_USER_NAME } from "../Constants";

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
        return JSON.parse(getLocalStorageItem(key));
    } catch (ex) {
        return defaultValue || null;
    }
}

export function setLocalStorageItemAsJson(key, value) {
    setLocalStorageItem(key, JSON.stringify(value));
}

export function getAuthToken(a) {
    return atob(getLocalStorageItem(STORAGE_ACCESS_TOKEN));
}

export function setAuthToken(a) {
    setLocalStorageItem(STORAGE_ACCESS_TOKEN, btoa(a));
}

export function getUserName(a) {
    return atob(getLocalStorageItem(STORAGE_USER_NAME));
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