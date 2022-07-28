import MyButton from "../MyButton";

export default function ToolsWebCallBase(props) {

    const btnText = (props.isWorking ? "Working" : "Execute");

    return (
        <div className="tools-web-call">
            <div className="text-start">
                <h3>{props.name}</h3>
                <div>
                    {props.controls}
                </div>
                <MyButton className="btn-primary" onClick={props.onClick} disabled={props.isWorking} loading={props.isWorking}>
                    {btnText}
                </MyButton>
            </div>
            <textarea className="w-100 bg-transparent" style={{"height": "15em"}} value={props.value} readOnly></textarea>
        </div>
    )
}