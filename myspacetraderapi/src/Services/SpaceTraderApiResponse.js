

class SpaceTraderApiResponse {
    constructor() {
        this.ok = true;
        this.error = "";
        this.errorCode = 0;
        this.errorPretty = "";
        this.errorData = {};
        this.data = {};
    }

    readResponse(_response) {
        //this.response = _response;
        if (!_response.ok) {
            this.setError(_response.status, "HTTP error: " + _response.status + " " + _response.url);
        }
    }

    readData(data) {
        this.data = data;

        if (data && data.error) {
            this.setError(data.error.code, data.error.message, data.error.data);
            console.error("API error: (" + this.errorCode + ") " + this.error);
        }
    }

    setError(code, err, errData) {
        this.ok = false;
        this.error = err;
        this.errorCode = parseInt(code);
        this.errorData = errData || {};
        if (!this.errorCode || isNaN(this.errorCode)) {
            console.error("Invalid error code: " + code);
            this.errorCode = -1;
        }

        this.errorPretty = "("+this.errorCode+") "+this.error+"."+(Array.isArray(this.errorData) ? " Error data: "+JSON.stringify(this.errorData) : "");

        console.error(this.errorCode + " " + this.error);
    }
}

export default SpaceTraderApiResponse;