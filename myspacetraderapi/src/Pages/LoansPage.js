import { useEffect, useState } from "react";
import Page from "../Components/Page.js"
import { getLoans, readResponse } from "../Services/SpaceTraderApi.js";
import LoanItem from "../Components/Loans/LoanItem"
import TakeOutLoanForm from "../Components/Loans/TakeOutLoanForm.js";

function LoansPage(props) {
    const pageName = "Loans";

    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [loansInfo, setLoanInfo] = useState([]) // Create new state variable for user info data

    useEffect(() => {
        loadLoansData();
    }, []);

    function loadLoansData() {
        setError(null);
        setLoaded(false);

        getLoans()
            .then(stcResponse => {
                console.log("LoansPage StcResponse ", stcResponse);
                if (!stcResponse.ok) {
                    doError("(" + stcResponse.errorCode + ") " + stcResponse.error);
                } else {
                    setLoanInfo(stcResponse.data);
                    setLoaded(true);
                }
            })
    }

    function doError(error) {
        console.error("ERROR", error);
        setError(error);
        setLoaded(true);
    }

    if (!isLoaded) {
        return (
            <Page title={pageName}>
                <pre>It's loading</pre>
            </Page>
        );
    }

    if (error) {
        return (
            <Page title={pageName}>
                <pre>ERROR: {error}</pre>
            </Page>
        );
    }

    if (loansInfo) {
        var loanItems = loansInfo.loans.map((item, index) => {
            return (
                <div className="col-md-4 col-xs-12 h-100" key={item.id}>
                    <LoanItem loan={item} />
                </div>
            );
        });

        loanItems.push(
            <div className="col-md-4 col-xs-12 h-100" key="TAKEOUTLOAN" >
                <TakeOutLoanForm />
            </div>
        );



        return (
            <Page title={pageName}>

                <div className="column">
                    <div className="row">
                        {loanItems}
                    </div>

                </div>
            </Page>
        );
    }
}

export default LoansPage;