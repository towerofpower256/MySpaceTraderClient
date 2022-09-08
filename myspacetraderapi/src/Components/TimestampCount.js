import { useEffect, useState } from "react";
import durationString from "../Utils/durationString";
import timeDelta from "../Utils/timeDelta";


export default function TimestampCount(props) {
    const [text, setText] = useState("");

    useEffect(() => {
        // On mount
        updateText();
        const timerId = setInterval(updateText, 1000)
        
        return (() => {
            // On unmount
            //console.log("Timer dismount");
            clearInterval(timerId);
        })
    }, []);

    function updateText() {
        let _text = props.placeholder;
        if (props.value) {
            if (props.variant === "raw") {
                _text = timeDelta(props.value, new Date(), props.options);
            } else {
                _text = durationString(new Date(props.value) - new Date(), props.options);
            }
        }
        
        //console.log("Timestamp tick", _text);
        setText(_text);
    }

    return(
        <span data-value={props.value}>{typeof props.formatter == "function" ? props.formatter(text) : text}</span>
    )
}