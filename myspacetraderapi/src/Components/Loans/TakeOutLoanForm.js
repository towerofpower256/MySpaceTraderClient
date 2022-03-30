import { useState } from "react";
import { readResponse, takeOutLoan } from "../../Services/SpaceTraderApi.js";
import LoanTypes from "../../Data/LoanTypes.js";
import { toast } from "react-toastify";

export default function TakeOutLoanForm(props) {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [isWorking, setWorking] = useState(false);


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

        if (!selectedLoan) {
            console.error("Can't take out a loan when a loan isn't selected");
            setWorking(false);
            return;
        }

        // Make the request
        takeOutLoan(selectedLoan.type)
            .then(
                response => {
                    readResponse(response)
                        .then(
                            stcResponse => {
                                if (!stcResponse.ok) {
                                    doTakeOutError(stcResponse.errorPretty);
                                } else {
                                    setSelectedLoan(null);
                                    setWorking(false);
                                    props.loadLoansData();
                                    const loan = stcResponse.data.loan;
                                    toast.success("Took out loan: "+loan.type+" "+loan.repaymentAmount);
                                }
                            },
                            error => {
                                doTakeOutError("Error reading the response payload: " + error);
                            }
                        );

                },
                error => {
                    doTakeOutError(error);
                });
    }

    function doTakeOutError(error) {
        console.error("doTakeOutError: " + error);
        toast.error("Error taking out loan: "+error);
        setWorking(false);
    }

    let selectedLoanSection = (
        <div>
            Select a loan
        </div>
    );

    let buttonTakeOutLoan;
    let btnDisabled = !selectedLoan || isWorking;
    if (isWorking) {
        buttonTakeOutLoan =
            <button type="button"
                className="btn btn-warning btn-sm"
                disabled={btnDisabled}
                onClick={handleTakeOutLoan}
            >Working...</button>
    } else {
        buttonTakeOutLoan =
            <button type="button"
                className="btn btn-warning btn-sm"
                disabled={btnDisabled}
                onClick={handleTakeOutLoan}
            >Take out loan</button>
    }


    if (selectedLoan) {

        selectedLoanSection =
            <div>
                <table class="table table-striped">
                    <tbody>
                        <tr>
                            <th>Loan type:</th>
                            <td>{selectedLoan.type}</td>
                        </tr>
                        <tr>
                            <th>Amount:</th>
                            <td>{selectedLoan.amount}</td>
                        </tr>
                        <tr>
                            <th>Interest rate:</th>
                            <td>{selectedLoan.rate}%</td>
                        </tr>
                        <tr>
                            <th>Term:</th>
                            <td>{selectedLoan.termInDays} days</td>
                        </tr>
                        <tr>
                            <th>Collateral required:</th>
                            <td>{selectedLoan.collateralRequired.toString()}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
    }

    return (
        <div className="card">
            <div className="card-header">
                Take out a loan
            </div>
            <div className="card-body">

                <div>
                    <label htmlFor="">Loan type</label>
                    <select className="form-select" onChange={handleLoanTypeChange}>
                        <option value="">--- Select a loan ---</option>
                        {loanTypeOptions}
                    </select>
                </div>
                {selectedLoanSection}

            </div>
            <div className="card-footer text-end">
                {buttonTakeOutLoan}
            </div>
        </div>
    )
}