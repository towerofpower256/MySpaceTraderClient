import { useEffect, useState } from "react";

function LoanItem(props) {


    return(
        <div class="list-group-item">
            <div>ID: {props.loan.id}</div>
            <div>Status: {props.loan.status}</div>
            <div>Due: {props.loan.due}</div>
            <div>Repayment amount: {props.loan.repaymentAmount}</div>
            <div>Type: {props.loan.type}</div>
            <div class="btn-group" role="group">
                <button type="button" class="btn btn-primary">Pay off loan</button>
            </div>
        </div>
    );
};

export default LoanItem;