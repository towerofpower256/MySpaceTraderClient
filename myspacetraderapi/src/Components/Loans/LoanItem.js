import { useEffect, useState } from "react";
import { prettyNumber } from "../../Utils";
import Timestamp from "../Common/Timestamp";

function LoanItem(props) {

    if (props.content) {
        return (
            <div className="card h100">
                {props.content}
            </div>
        );
    }

    return (
        <div className="card h100" key={props.loan.id}>
            <div className="card-header">
                {props.loan.type}
            </div>
            <div className="card-body">
                <table className="table table-striped">
                    <tbody>
                        <tr>
                            <th>Status</th>
                            <td>{props.loan.status}</td>
                        </tr>
                        <tr>
                            <th>Due</th>
                            <td><Timestamp value={props.loan.due} /></td>
                        </tr>
                        <tr>
                            <th>Repayment amount</th>
                            <td>{prettyNumber(props.loan.repaymentAmount)}</td>
                        </tr>
                        <tr>
                            <th>Type</th>
                            <td>{props.loan.type}</td>
                        </tr>

                    </tbody>
                </table>
            </div>
            <div className="card-footer text-end">
                <button type="button" className="btn btn-primary btn-sm" data-id={props.loan.id}>Pay off loan</button>
            </div>
        </div>
    );
};

export default LoanItem;