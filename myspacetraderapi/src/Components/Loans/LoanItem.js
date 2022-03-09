import { useEffect, useState } from "react";

function LoanItem(props) {

    if (props.content) {
        return (
            <div className="list-group-item" key="CONTENT">
                {props.content}
            </div>
        );
    }

    return (
        <div className="list-group-item" key={props.loan.id}>
            <div>ID: {props.loan.id}</div>
            <div>Status: {props.loan.status}</div>
            <div>Due: {props.loan.due}</div>
            <div>Repayment amount: {props.loan.repaymentAmount}</div>
            <div>Type: {props.loan.type}</div>
            <div className="btn-group" role="group">
                <button type="button" className="btn btn-primary">Pay off loan</button>
            </div>
        </div>
    );
};

export default LoanItem;