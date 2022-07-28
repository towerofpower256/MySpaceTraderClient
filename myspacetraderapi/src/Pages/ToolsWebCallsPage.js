import Page from "../Components/Page";
import ToolWebCallGameStatus from "../Components/Tools/ToolWebCallGameStatus";
import ToolWebCallAccountDetails from "../Components/Tools/ToolWebCallAccountDetails";


export default function ToolsWebCallsPage(props) {
    const pageName = "Tools - Web Calls";

    const pageItems = [];
    pageItems.push(<ToolWebCallGameStatus />);
    pageItems.push(<ToolWebCallAccountDetails />);

    const pageItemsHtml = pageItems.map((item, idx) => {
        return(
            <tr key={idx}>
                <td>
                    {item}
                </td>
            </tr>
        )
    });

    return (
        <Page title={pageName}>
            <table className="table table-striped">
                <tbody>
                    {pageItemsHtml}
                </tbody>
            </table>
        </Page>
    )
}