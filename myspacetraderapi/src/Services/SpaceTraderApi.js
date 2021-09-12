

class SpaceTraderClient {
    BASEPATH = "https://api.spacetraders.io/"

    async getPlayerInfo() {
        return this._doRequest("my/account", "GET");
    }

    async _doRequest(url, method, options) {
        if (!options) options = {};
        const fullUrl = this.getUri(url);
        console.log("Making request", "URL: " + fullUrl, "Method: " + method, "Options:", options);

        return fetch(fullUrl, {
            method: method,
            //mode: 'cors',
            //credentials: 
            headers: {
                "Authorization": "Bearer d9394b3a-9faf-4743-a503-1352b117708c", // Hard code for now, come back to this later
            },
            body: options.body,
        })
            .then(response => {
                console.log("Response: ", response);
                if (!response.ok) {
                    this.handleResponseError(response);
                }
                return response.json();
            })
            .catch(error => {
                this.handleError(error);
            });
    }

    getUri(relativePath) {
        return this.BASEPATH+relativePath;
    }

    handleError(error) {
        console.error("SpaceTraderClient ERROR: ", error);
    }

    log() {
        console.log("SpaceTraderClient: ", arguments);
    }
};

export default SpaceTraderClient;