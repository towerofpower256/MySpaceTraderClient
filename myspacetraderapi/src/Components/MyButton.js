import Button from 'react-bootstrap/Button'

export default function MyButton(props) {

    function handleClick(e) {
        if (props.onClick && typeof props.onClick === "function") {
            props.onClick(e);
        }
    }

    const classes = [];
    classes.push("btn");
    if (props.className) {
    classes.push(props.className);
    }
    
    let disabled = (props.disabled === true);

    let btnSpinner;
    if (props.loading === true) {
        btnSpinner = (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        );
    }

    const extraProps = {};
    Object.keys(props).forEach(propName => {
        if (propName.indexOf("data-") === 0) {
            // If the prop starts with "data-"
            extraProps[propName] = props[propName];
        }
    });

    return (
        <button className={classes.join(" ")} onClick={handleClick} disabled={disabled} {...extraProps}>
            {btnSpinner}
            {props.children}
        </button>
    )
}