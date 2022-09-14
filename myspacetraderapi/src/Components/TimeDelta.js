import timeDelta from "../Utils/timeDelta";


export default function TimeDelta(props) {
    return(<span data-value={props.value}>{timeDelta(props.value, {...props})}</span>)
}