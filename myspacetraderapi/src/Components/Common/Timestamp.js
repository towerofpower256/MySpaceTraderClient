

function Timestamp(props) {
    var ts = props.value;
    var dv = ts;
    try {
        dv = new Date(ts).toLocaleString(undefined);
    } catch (ex) {
        console.error("Timestamp error", ts, ex);
    }

    return (<span data-value={ts}>{dv}</span>)
}

export default Timestamp;