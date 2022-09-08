import { NavLink } from "react-router-dom";
import { useContext } from "react";
import MyPageSubTitle from "../Components/MyPageSubTitle"
import MyPageTitle from "../Components/MyPageTitle"
import SystemsContext from "../Contexts/SystemsContext"
import getLocationName from "../Utils/getLocationName";

function SystemPageSystemSection(props) {
    const system = props.system;

    return (
        <div>
            <MyPageSubTitle>{system.name}</MyPageSubTitle>
            <ul>
                {!Array.isArray(system.locations) || system.locations.length===0 ? <li>No locations in this system</li> :
                system.locations.map((location) => {
                    return(
                        <li key={location.symbol}>
                            <div><NavLink to={location.symbol}>{getLocationName(location)}</NavLink></div>
                            <div className="text-muted">Type: {location.type}</div>
                        </li>
                    )
                })
                }
            </ul>
        </div>
    );
}

export default function SystemsPage(props) {
    const [systems, setSystems] = useContext(SystemsContext)

    function PageWrapper(props) {
        return (
            <div>
                <MyPageTitle>All Systems</MyPageTitle>
                {props.children}
            </div>
        )
    }

    if (!systems || !Array.isArray(systems.systems)) {
        return (
            <PageWrapper>
                No system data available.
            </PageWrapper>
        )
    }

    return (
        <PageWrapper>
            {systems.systems.map((system) => {
                return (
                    <SystemPageSystemSection system={system} />
                )
            })}
        </PageWrapper>
    );
}