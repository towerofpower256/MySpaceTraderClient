import { TRADE_HISTORY_LENGTH } from "../Constants";
import { loadTradeHistory, saveTradeHistory } from "../Services/LocalStorage";


export default function updateTradeHistory(newTradeOrder, orderType, location, createdAt) {
    if (!createdAt) createdAt = new Date().toISOString();

    const to = {...newTradeOrder};
    to.createdAt = createdAt;
    to.orderType = orderType;
    to.location = location;

    const tradeHistory = loadTradeHistory();
    tradeHistory.unshift(to);

    // Limit
    saveTradeHistory(tradeHistory.slice(0, TRADE_HISTORY_LENGTH));
}