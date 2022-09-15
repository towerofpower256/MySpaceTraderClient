import { API_BASE_URL } from '../Constants';
import { getAuthToken } from './LocalStorage';
import SpaceTraderApiResponse from './SpaceTraderApiResponse';

export async function getPlayerInfo() {
    return _doRequest("my/account", "GET");
}

export async function getLoans() {
    return _doRequest("my/loans", "GET");
}

export async function payLoan(loanID) {
    return _doRequest("my/loans/" + encodeURIComponent(loanID), "PUT");
}

export async function takeOutLoan(loanID) {
    return _doRequest("my/loans/?type=" + encodeURIComponent(loanID), "POST");
}

export async function getShips() {
    return _doRequest("my/ships", "GET");
}

export async function getShipInfo(id) {
    return _doRequest("my/ships/" + id, "GET");
}

export async function submitFlightPlan(shipId, destination) {
    return _doRequest("my/flight-plans", "POST", {
        body: { shipId: shipId, destination: destination }
    });
}

export async function getFlightPlan(flightPlanId) {
    return _doRequest("my/flight-plans/" + flightPlanId, "GET");
}

export async function attemptWarpJump(shipId) {
    return _doRequest("my/warp-jumps/?shipId=" + shipId, "POST");
}

// Get a list of all available ships, and where you can buy them & for how much
export async function getShipMarket() {
    return _doRequest("game/ships", "GET");
}

export async function buyNewShip(locationID, typeID) {
    return _doRequest("my/ships?location=" + encodeURIComponent(locationID) + "&type=" + encodeURIComponent(typeID), "POST");
}

export async function jettisonCargo(shipId, good, quantity) {
    return _doRequest("my/ships/" + shipId + "/jettison", "POST", {
        body: {
            good: good, quantity: quantity
        }
    })
}

export async function transferCargoBetweenShips(fromShipId, toShipId, good, quantity) {
    return _doRequest("my/ships/" + fromShipId + "/transfer", "POST", {
        body: {
            toShipId: toShipId, good: good, quantity: quantity
        }
    })
}

export async function scrapShip(shipId) {
    return _doRequest("my/ships/" + shipId, "DELETE");
}

export async function getAllSystems() {
    return _doRequest("game/systems", "GET");
}

export async function getAllGoodTypes() {
    return _doRequest("types/goods", "GET");
}

export async function getAllLoanTypes() {
    return _doRequest("types/loans", "GET");
}

export async function getAllStructureTypes() {
    return _doRequest("types/structures", "GET");
}

export async function getAllShipTypes() {
    return _doRequest("types/ships", "GET");
}

export async function getLocationInfo(locationSymbol) {
    return _doRequest("locations/" + locationSymbol, "GET");
}

export async function getLocationMarketplace(locationSymbol) {
    return _doRequest("locations/" + locationSymbol + "/marketplace", "GET");
}

export async function getGameStatus() {
    return _doRequest("game/status", "GET");
}

export async function getSystemDockedShips(systemId) {
    return _doRequest("systems/" + systemId + "/ships", "GET");
}

export async function getSystemFlightPlans(systemId) {
    return _doRequest("systems/" + systemId + "/flight-plans", "GET");
}

export async function getSystemLocations(systemId) {
    return _doRequest("systems/" + systemId + "/locations", "GET");
}

export async function getGameLeaderboard() {
    return _doRequest("game/leaderboard/net-worth", "GET");
}

export async function registerUsername(username) {
    return _doRequest("users/" + username + "/claim", "POST", { ignore_auth: true })
}


export async function placeBuySellOrderHelper(action, shipID, goodID, quantity, loadingSpeed, onPageComplete) {
    return new Promise(async (resolve, reject) => {
        try {
            let totalValue = 0;
            loadingSpeed = parseInt(loadingSpeed);
            if (!loadingSpeed || isNaN(loadingSpeed) || loadingSpeed < 1) {
                throw "loadingSpeed is not a valid number greater than 0";
            }

            let stcResponse;
            while (quantity > 0) {
                stcResponse = await placeBuySellOrder(action, shipID, goodID, Math.min(quantity, loadingSpeed));
                if (!stcResponse.ok) {
                    throw stcResponse.errorPretty;
                }

                let od = stcResponse.data.order;
                if (od) {
                    totalValue += parseInt(od.total);
                }

                quantity -= loadingSpeed;

                if (typeof onPageComplete === "function")
                    onPageComplete(quantity, stcResponse);
            }
            resolve(totalValue); // Successful trade
        } catch (error) {
            reject(error);
        }
    });
}

export async function placeBuySellOrder(action, shipID, goodID, quantity) {
    let endpoint;
    if (action === "buy") endpoint = "purchase-orders";
    else if (action === "sell") endpoint = "sell-orders";
    else throw ("Invalid action: " + action);

    return _doRequest("my/" + endpoint, "POST", {
        body: {
            "shipId": shipID,
            "good": goodID,
            "quantity": quantity
        }
    });
}

export async function placeSellOrder(shipID, goodID, quantity) {
    return placeBuySellOrder("sell", shipID, goodID, quantity);
}

export async function placeBuyOrder(shipID, goodID, quantity) {
    return placeBuySellOrder("buy", shipID, goodID, quantity);
}

export async function isGameReady() {
    let isOK = false;

    await getGameStatus()
        .then(stcResponse => {
            isOK = stcResponse.ok;
        }, error => {
            isOK = false;
        });

    console.log("isGameReady: " + isOK);
    return isOK;
}

async function _doRequest(url, method, options) {
    if (!options) options = {};

    const promise = new Promise((resolve, reject) => {
        const fullUrl = _getUri(url);
        //console.log("Making request", "URL: " + fullUrl, "Method: " + method, "Options:", options);
        const stcReponse = new SpaceTraderApiResponse();

        // Get the auth token, handle if it's missing
        const authToken = getAuthToken();
        if (!options.ignore_auth && (!authToken || authToken == "")) {
            const missingTokenMsg = "Auth token is missing. Is the user logged in?";
            console.error(missingTokenMsg)
            reject(missingTokenMsg);
            return;
        }

        const reqOptions = {
            method: method,
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Authorization": "Bearer " + authToken,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };
        if (options.body) {
            reqOptions.body = JSON.stringify(options.body);
        }

        const req = fetch(fullUrl, reqOptions);
        req.then(
            response => {
                //console.log("Response: ", response);

                const stcResponse = new SpaceTraderApiResponse();
                stcResponse.readResponse(response);
                // try to read the response JSON payload, see if there's an error in it
                const promises = [];
                promises.push(response.json().then(
                    data => {
                        stcResponse.readData(data);
                    },
                    error => {
                        stcResponse.setError(-1, "Error reading response data: " + error);
                    }
                ));

                Promise.allSettled(promises).then(() => {
                    resolve(stcResponse);
                });
            },
            error => {
                _handleError(error);
                reject(error);
            }
        );
    });

    return promise;
}

function _getUri(relativePath) {
    return API_BASE_URL + relativePath;
}

function _handleError(error) {
    console.error("SpaceTraderClient ERROR: ", error);
}