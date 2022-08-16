import { useEffect, useState } from "react";
import { getLoans, payLoan, takeOutLoan } from "../Services/SpaceTraderApi";
import { toast } from "react-toastify";
import { prettyNumber, valOrDefault } from "../Utils";
import Timestamp from "./Timestamp";
import LoanTypes from "../Data/LoanTypes.js";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Spinner from 'react-bootstrap/Spinner';

function NewLoanForm(props) {
    const [selectedLoan, setSelectedLoan] = useState(null);
    const [selectedLoanId, setSelectedLoanId] = useState(null);

    function handleLoanTypeChange(e) {
        setSelectedLoanId(e.target.value);
        const loanObj = LoanTypes.loans.find((l) => l.type === e.target.value);
        setSelectedLoan(loanObj);
    }

    function handleTakeOutLoanClick(e) {
        if (props.isWorking) return;
        if (!selectedLoanId || selectedLoanId === "") return;

        props.setWorking(true);

        takeOutLoan(selectedLoanId)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error(stcResponse.errorPretty);
                    return;
                }

                toast.success("Took out new loan");
                props.loadLoansData();
            })
            .catch(error => {
                toast.error(error);
            })
            .finally(() => props.setWorking(false))
    }


    return (
        <Card className="h-100">
            <Card.Body>
                <Card.Title>Apply for a new loan</Card.Title>
                <Form>
                    <Form.Select aria-label="Loan type" onChange={handleLoanTypeChange} disabled={props.isWorking}>
                        <option value="">--- Select a loan ---</option>
                        {LoanTypes.loans.map((loan) => {
                            return (
                                <option value={loan.type} key={loan.type}>{loan.type}</option>
                            )
                        })
                        }
                    </Form.Select>
                    <Table striped>
                        <tbody>
                            <tr>
                                <th>Interest rate</th>
                                <td>{selectedLoan ? selectedLoan.rate : "-"}%</td>
                            </tr>
                            <tr>
                                <th>Term (days)</th>
                                <td>{selectedLoan ? selectedLoan.termInDays : "-"}</td>
                            </tr>
                            <tr>
                                <th>Repayment amount</th>
                                <td>${selectedLoan ? prettyNumber(selectedLoan.amount) : "-"}</td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="warning" onClick={handleTakeOutLoanClick} disabled={props.isWorking}>
                        <Spinner animation="border" role="status" hidden={!props.isWorking} aria-hidden={!props.isWorking} size="sm" />
                        {props.isWorking ? "Working" : "Take out loan"}
                    </Button>
                </Form>
            </Card.Body>
        </Card>
    );
}

function LoanItem(props) {

    return (
        <Card className="h-100" data-loan-id={props.loan.id} data-loan-type={props.loan.type}>
            <Card.Body>
                <Card.Title>{props.loan.type}</Card.Title>
                <Table striped>
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
                            <td>${prettyNumber(props.loan.repaymentAmount)}</td>
                        </tr>
                    </tbody>
                </Table>
                <Button variant="warning"
                    disabled={props.isWorking}
                    onClick={props.handlePayOffClick}
                    data-loan-id={props.loan.id} data-loan-type={props.loan.type}>
                    <Spinner animation="border" role="status" hidden={!props.isWorking} aria-hidden={!props.isWorking} size="sm" />
                    <span>{props.isWorking ? "Working" : "Pay off loan"}</span>
                </Button>
            </Card.Body>
        </Card>
    )
}

export default function PlayerLoansList(props) {
    const [isLoading, setLoading] = useState(false);
    const [isLoaded, setLoaded] = useState(false)
    const [loansInfo, setLoanInfo] = useState(null); // Create new state variable for user info data
    const [isWorking, setWorking] = useState(false);

    function handlePayOffClick(e) {
        if (isWorking) return;

        setWorking(true);

        const loanId = e.currentTarget.dataset["loanId"];

        if (!loanId) {
            console.error("Couldn't get the loanId from the target HTML element.");
            return;
        }

        payLoan(loanId)
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    toast.error(stcResponse.errorPretty);
                    return;
                }

                toast.success("Loan paid off");
                loadLoansData();
            })
            .catch(error => {
                toast.error(error);
            })
            .finally(() => {
                setWorking(false);
            })
    }

    useEffect(() => {
        if (!loansInfo) loadLoansData();
    }, []);

    function loadLoansData() {
        if (isLoading) return;

        setLoading(true);

        getLoans()
            .then(stcResponse => {
                if (!stcResponse.ok) {
                    doError("(" + stcResponse.errorCode + ") " + stcResponse.error);
                } else {
                    setLoanInfo(stcResponse.data.loans);
                }
            })
            .finally(() => {
                setLoading(false);
            })
    }

    function doError(error) {
        //setError(error);
        //setLoaded(true);
    }


    const loanItems = [];
    if (Array.isArray(loansInfo)) {
        loansInfo.forEach((loan) => {
            loanItems.push(
                <LoanItem loan={loan} key={loan.id} isWorking={isWorking} handlePayOffClick={handlePayOffClick} loadLoansData={loadLoansData} />
            );
        });
    }

    if (!isLoading) {
        loanItems.push(<NewLoanForm isWorking={isWorking} setWorking={setWorking} key="NEW" loadLoansData={loadLoansData} />)
    }

    return (
        <Container fluid>
            <Row>
                {loanItems.map((item, idx) => {
                    return (<Col md={3} key={idx}>
                        {item}
                    </Col>
                    );
                })}
            </Row>
        </Container>
    )
}