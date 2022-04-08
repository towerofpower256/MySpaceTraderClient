import { toast } from 'react-toastify';
import { API_BASE_URL } from '../Constants';
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

async function _doRequest(url, method, options) {
    if (!options) options = {};

    const promise = new Promise((resolve, reject) => {
        const fullUrl = _getUri(url);
        console.log("Making request", "URL: " + fullUrl, "Method: " + method, "Options:", options);
        const stcReponse = new SpaceTraderApiResponse();

        const req = fetch(fullUrl, {
            method: method,
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            //mode: 'cors',
            //credentials: 
            headers: {
                "Authorization": "Bearer 0c5123a3-8ea2-4dad-b539-d1f8d8da16f1", // Hard code for now, come back to this later
            },
            body: options.body,
        });
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