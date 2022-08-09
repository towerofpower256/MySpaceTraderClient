import { toast } from 'react-toastify';
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
        body: {shipId: shipId, destination: destination}
    });
}

export async function getFlightPlan(flightPlanId) {
    return _doRequest("my/flight-plans/" + flightPlanId, "GET");
}

export async function attemptWarpJump(shipId) {
    return _doRequest("my/warp-jumps/?shipId=" + shipId, "Post");
}

// Get a list of all available ships, and where you can buy them & for how much
export async function getShipMarket() {
    return _doRequest("game/ships", "GET");
}

export async function buyNewShip(locationID, typeID) {
    return _doRequest("my/ships?location=" + encodeURIComponent(locationID) + "&type=" + encodeURIComponent(typeID), "POST");
}

export async function getAllSystems() {
    return _doRequest("game/systems", "GET");
}

export async function getLocationInfo(locationSymbol) {
    return _doRequest("locations/" + locationSymbol, "GET");
}

export async function getLocationMarketplace(locationSymbol) {
    return _doRequest("locations/"+locationSymbol+"/marketplace", "GET");
}

export async function getGameStatus() {
    return _doRequest("game/status", "GET");
}

export async function isGameReady() {
    let isOK = false;

    await getGameStatus()
        .then(stcResponse => {
            isOK = stcResponse.ok;
        }, error => {
            isOK = false;
        });

    console.log("isGameReady: "+isOK);
    return isOK;
}

async function _doRequest(url, method, options) {
    if (!options) options = {};

    const promise = new Promise((resolve, reject) => {
        const fullUrl = _getUri(url);
        console.log("Making request", "URL: " + fullUrl, "Method: " + method, "Options:", options);
        const stcReponse = new SpaceTraderApiResponse();

        // Get the auth token, handle if it's missing
        const authToken = getAuthToken();
        if (!authToken || authToken == "") {
            const missingTokenMsg = "Auth token is missing. Is the user logged in?";
            console.error(missingTokenMsg)
            reject(missingTokenMsg);
            return;
        }

        const reqOptions = {
            method: method,
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            headers: {
                "Authorization": "Bearer "+authToken,
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
                console.log("Response: ", response);

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
                    if (!stcReponse.ok) {
                        toast.error(stcReponse.errorPretty);
                    }
                    resolve(stcResponse);
                });
            },
            error => {
                toast.error("Connection error: " + error);
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