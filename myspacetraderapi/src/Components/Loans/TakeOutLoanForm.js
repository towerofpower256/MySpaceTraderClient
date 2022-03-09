import { isValidElement, useState } from "react";
import SpaceTraderClient from "../../Services/SpaceTraderApi.js";
import LoanTypes from "../../Data/LoanTypes.js";

export default function TakeOutLoanForm(props) {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isWorking, setWorking] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);


    const loanTypeOptions = [];
    LoanTypes.loans.map((loanType, index) => {
        loanTypeOptions.push(
            <option key={loanType.type} value={loanType.type}>{loanType.type} (${loanType.amount})</option>
        )
        return loanType;
    });

    function handleLoanTypeChange(e) {
        let selectedLoanKey = e.target.value;
        setSelectedLoan(LoanTypes.loans.find(l => l.type === selectedLoanKey));
    }

    function handleTakeOutLoan(e) {
        setWorking(true);
        setErrorMsg(null);

        if (!selectedLoan) {
            console.error("Can't take out a loan when a loan isn't selected");
            setWorking(false);
            return;
        }

        // Make the request
        var stc = new SpaceTraderClient();
        stc.takeOutLoan(selectedLoan.type)
            .then(
                response => {
                    if (!response.ok) {
                        response.text().then(text =>
                            doTakeOutError(response.status + ", " + text)
                        );
                    } else {
                        response.json().then(
                            data => {
                                if (data.error) {
                                    doTakeOutError(JSON.stringify(data.error));
                                } else {
                                    setSelectedLoan(null);
                                    setWorking(false);
                                    props.loadLoansData();
                                }
                            },
                            error => {
                                doTakeOutError("Error reading the response payload: " + error);
                            }
                        );
                    }
                },
                error => {

                }
            );
    }

    function doTakeOutError(error) {
        console.error("doTakeOutError: " + error);
        setErrorMsg(error);
        setWorking(false);
    }

    let selectedLoanSection = (
        <div>
            Select a loan
        </div>
    );

    let errorSection = undefined;
    if (errorMsg)
        errorSection =
            <div style={{ color: "red" }}>
                There was an error taking out the loan:<br />
                {errorMsg}
            </div>

    let buttonTakeOutLoan;
    if (isWorking) {
        buttonTakeOutLoan =
            <button type="button"
                className="btn btn-warning"
                disabled={isWorking}
                onClick={handleTakeOutLoan}
            >Working...</button>
    } else {
        buttonTakeOutLoan =
            <button type="button"
                className="btn btn-warning w100"
                disabled={isWorking}
                onClick={handleTakeOutLoan}
            >Take out loan</button>
    }


    if (selectedLoan) {

        selectedLoanSection =
            <div>
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <td>Loan type:</td>
                            <td>{selectedLoan.type}</td>
                        </tr>
                        <tr>
                            <td>Amount:</td>
                            <td>{selectedLoan.amount}</td>
                        </tr>
                        <tr>
                            <td>Interest rate:</td>
                            <td>{selectedLoan.rate}%</td>
                        </tr>
                        <tr>
                            <td>Term:</td>
                            <td>{selectedLoan.termInDays} days</td>
                        </tr>
                        <tr>
                            <td>Collateral required:</td>
                            <td>{selectedLoan.collateralRequired.toString()}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                {buttonTakeOutLoan}
                                {errorSection}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
    }

    return (
        <div className="form-take-out-loan">
            <div>
                <label htmlFor="">Loan type</label>
                <select className="form-select" onChange={handleLoanTypeChange}>
                    <option value="">--- Select a loan ---</option>
                    {loanTypeOptions}
                </select>
            </div>
            {selectedLoanSection}
        </div>
    )
}