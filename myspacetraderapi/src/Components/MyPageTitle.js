export default function MyPageTitle(props) {
    return (
        <h2 className="text-start text-decoration-underline">
            {props.children}
        </h2>
    )
}