import PlaceholderLoading from "react-placeholder-loading";

export default function PlaceholderTableRows(props) {
    const colCount = props.colCount || 8;
    const rowCount = props.rowCount || 3;

    const phRows = [];
    const phRow = [];

    for (var iCol = 0; iCol < colCount; iCol++) {
        phRow.push(
            <td><PlaceholderLoading shape="rect" width="100%" height="0.5em" /></td>
        )
    }
    for (var iRow = 0; iRow < rowCount; iRow++) {
        phRows.push(<tr>{phRow}</tr>);
    }

    return (phRows);
}