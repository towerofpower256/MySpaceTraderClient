

class SpaceTraderApiResponse {
    constructor() {
        this.reponse = null;
        this.ok = true;
        this.error = "";
        this.errorCode = 0;
        this.data = {};
    }

    readResponse(_response) {
        this.response = _response;
        if (!_response.ok) {
            this.setError(_response.status, "HTTP error: " + _response.status);
        }
    }

    readData(data) {
        this.data = data;

        if (data && data.error) {
            this.setError(data.error.message, data.error.code);
            console.error("API error: (" + this.errorCode + ") " + this.error);
        }
    }

    setError(code, err) {
        this.ok = false;
        this.error = err;
        this.errorCode = parseInt(code);
        if (this.errorCode) {
            console.error("Invalid error code: " + code);
            this.errorCode = -1;
        }

        console.error(this.errorCode + " " + this.error);
    }
}

export default SpaceTraderApiResponse;