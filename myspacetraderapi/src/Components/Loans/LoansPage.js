import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";
import LoanItem from "./LoanItem"

function LoansPage(props) {
    const pageName = "Loans";

    const [error, setError] = useState(null)
    const [isLoaded, setLoaded] = useState(false)
    const [loansInfo, setLoanInfo] = useState([]) // Create new state variable for user info data

    useEffect(() => {
        const stClient = new SpaceTraderClient();
        stClient.getLoans()
            .then(
                (data) => {
                    console.log("Loading loan data:", data);
                    setLoanInfo(data);
                    setLoaded(true);
                },
                (error) => {
                    console.log("ERROR", error);
                    setLoaded(true);
                    setError(error);
                }
            );
    }, []);

    if (!isLoaded) {
        return (
            <Page title={pageName}>
                <pre>It's loading</pre>
            </Page>
        );
    }

    if (error) {
        return (
            <page title={pageName}>
                <pre>ERROR: {error}</pre>
            </page>
        );
    }

    if (loansInfo) {
        var loanItems = [];
        loanItems.push(
            <div class="list-group-item">
                <button type="button" class="btn btn-warning">Take out a loan</button>
            </div>
        );

        loansInfo.loans.map((item, index) => (
            loanItems.push(
                <LoanItem loan={item} />
            )
        ));
        

        return (
            <page title={pageName}>
                Loans info
                <pre>
                    Loans data:
                    {JSON.stringify(loansInfo)}
                </pre>

                <div class="list-group">
                    {loanItems}
                </div>
            </page>
        );
    }
}

export default LoansPage;