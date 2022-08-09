
export default function ToolsContextViewerBase(props) {
    let _value = (typeof props.value === "object" ? JSON.stringify(props.value, null, 2) : props.value);

    return (
        <div className="mb-3">
            <label className="form-label">{props.label}</label>
            <textarea class="w-100" rows="15" readonly value={_value}></textarea>
        </div>
    )
}