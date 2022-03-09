import { useEffect, useState } from "react";
import Page from "../Common/Page.js"
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";
import LoanItem from "./LoanItem"
import TakeOutLoanForm from "./TakeOutLoanForm.js";

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

        const stClient = new SpaceTraderClient();
        stClient.getLoans()
            .then(
                (response) => {
                    if (!response.ok) {
                        response.text().then(text =>
                            doError(response.status + ", " + text)
                        );


                    } else {
                        response.json().then(
                            data => {
                                try {
                                    console.log("Loading loan data:", data);
                                    setLoanInfo(data);
                                    setLoaded(true);
                                } catch (ex) {
                                    doError(ex);
                                }

                            },
                            error => {
                                doError("Error reading the response payload: " + error);
                            }
                        );
                    }

                },
                (error) => {
                    doError(error);
                }
            );
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
        var loanItems = [];

        if (loansInfo.loans.length == 0) {
            loanItems.push(
                <LoanItem content="You don't have any loans" />
            )
        } else {
            loansInfo.loans.map((item, index) => (
                loanItems.push(
                    <LoanItem loan={item} />
                )
            ));
        }



        return (
            <Page title={pageName}>
                Loans info
                <pre>
                    Loans data:
                    {JSON.stringify(loansInfo)}
                </pre>

                Your loans

                <div class="list-group">
                    {loanItems}
                </div>

                Take out a new loan

                <TakeOutLoanForm loadLoansData={loadLoansData}/>
            </Page>
        );
    }
}

export default LoansPage;