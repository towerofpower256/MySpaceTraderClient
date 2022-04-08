import { prettyNumber } from "../Utils";


export default function MarketDataTable(props) {
    

    const md = props.marketData || [];
    const mdRows = md.map((item, index) => {
        <MarketDataTableRow key={index} item={item} />
    })

    return (
        <table className="table table-striped table-hover table-sm">
            <tbody>
                {mdRows}
            </tbody>
        </table>
    )

}

function MarketDataTableRow(props) {
    const item = props.item;

    function handleBuyItem(e) {

    }

    function handleSellItem(e) {

    }

    return(
        <tr data-good={item.symbol} data-buy={item.purchasePricePerUnit} data-sell={item.sellPricePerUnit} >
            <th>{item.symbol}</th>
            <td>Avail.: {prettyNumber(item.quantityAvailable)}</td>
            <td>Buy: ${prettyNumber(item.purchasePricePerUnit)}</td>
            <td>Sell: ${prettyNumber(item.sellPricePerUnit)}</td>
            <td>Spread: ${prettyNumber(item.spread)}</td>
            <td>
                <button className="btn btn-sm" onClick={handleBuyItem}>Buy</button>
                <button className="btn btn-sm" onClick={handleSellItem}>Sell</button>
            </td>
        </tr>
    )
}