import Table from "react-bootstrap/Table";

import ToolWebCallGameStatus from "./ToolWebCallGameStatus";
import ToolWebCallAccountDetails from "./ToolWebCallAccountDetails";

export default function ToolWebCalls(props) {

    const pageItems = [];
    pageItems.push(<ToolWebCallGameStatus />);
    pageItems.push(<ToolWebCallAccountDetails />);

    return (
        <Table striped>
            <tbody>
                {pageItems.map((item, idx) => {
                    return (
                        <tr key={idx}><td>{item}</td></tr>
                    )
                })}
            </tbody>
        </Table>
    )
}