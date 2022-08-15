export default function MyPageSubTitle(props) {
    return (
        <h3 className="text-start text-decoration-underline">
            {props.children}
        </h3>
    )
}