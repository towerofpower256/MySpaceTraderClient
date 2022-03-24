import { toast } from 'react-toastify';
import SpaceTraderApiResponse from './SpaceTraderApiResponse';


class SpaceTraderClient {
    BASEPATH = "https://api.spacetraders.io/"
    //BASEPATH = "/dummyapi/"

    async getPlayerInfo() {
        return this._doRequest("my/account", "GET");
    }

    async getLoans() {
        return this._doRequest("my/loans", "GET");
    }

    async payLoan(loanID) {
        return this._doRequest("my/loans/" + encodeURIComponent(loanID), "PUT");
    }

    async takeOutLoan(loanID) {
        return this._doRequest("my/loans/?type=" + encodeURIComponent(loanID), "POST");
    }

    async getShips() {
        return this._doRequest("my/ships", "GET");
    }

    async getShipInfo(id) {
        return this._doRequest("my/ships/" + id, "GET");
    }

    // Get a list of all available ships, and where you can buy them & for how much
    async getShipMarket() {
        return this._doRequest("game/ships", "GET");
    }

    async buyNewShip(locationID, typeID) {
        return this._doRequest("my/ships?location=" + encodeURIComponent(locationID) + "&type=" + encodeURIComponent(typeID), "POST");
    }

    async getAllSystems() {
        return this._doRequest("/game/systems", "GET");
    }

    async _doRequest(url, method, options) {
        if (!options) options = {};
        const fullUrl = this.getUri(url);
        console.log("Making request", "URL: " + fullUrl, "Method: " + method, "Options:", options);

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
            },
            error => {
                toast.error("Connection error: " + error);
                this.handleError(error);
            }
        );

        return req;
    }

    async readResponse(response) {
        var promise = new Promise((resolve, reject) => {
            try {
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
                }
                );
            }
            catch (ex) {
                reject(ex);
            }

        });

        return promise;
    }

    getUri(relativePath) {
        return this.BASEPATH + relativePath;
    }

    handleError(error) {
        console.error("SpaceTraderClient ERROR: ", error);
    }

    log() {
        console.log("SpaceTraderClient: ", arguments);
    }
};

export default SpaceTraderClient;