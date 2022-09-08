import { SETTING_AUTO_REFRESH_ENABLED } from "../Constants";

export default function isAutoRefreshEnabled(appSettings) {
    return (appSettings[SETTING_AUTO_REFRESH_ENABLED] === undefined || appSettings[SETTING_AUTO_REFRESH_ENABLED] === true); // TRUE by default
}