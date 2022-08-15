import { useContext } from "react";
import { toast } from 'react-toastify';
import Button from 'react-bootstrap/Button';

import PlayerInfoContext from "../../Contexts/PlayerInfoContext";
import PlayerShipsContext from "../../Contexts/PlayerShipsContext";
import SystemsContext from "../../Contexts/SystemsContext";
import MarketDataContext from "../../Contexts/MarketDataContext";
import FlightPlansContext from "../../Contexts/FlightPlansContext";

function logContext(name, value) {
    console.log(name, value);
    toast.info("" + name + " dumped to browser console");
}

function LogContextHtml(props) {
    return (
        <div className="mb-3">
            <Button variant="primary" onClick={() => { logContext(props.name, props.data); }}>Log {props.name}</Button>
        </div>
    );
}

export default function ToolsContextViewer(props) {
    const [systems, setSystems] = useContext(SystemsContext);
    const [playerInfo, setPlayerInfo] = useContext(PlayerInfoContext);
    const [playerShips, setPlayerShips] = useContext(PlayerShipsContext);
    const [marketData, setMarketData] = useContext(MarketDataContext);
    const [flightPlans, setFlightPlans] = useContext(FlightPlansContext);

    return (
        <div className="text-start">
            <LogContextHtml name="SystemsContext" data={systems} />
            <LogContextHtml name="PlayerInfoContext" data={playerInfo} />
            <LogContextHtml name="PlayerShipsContext" data={playerShips} />
            <LogContextHtml name="MarketDataContext" data={marketData} />
            <LogContextHtml name="FlightPlansContext" data={flightPlans} />
        </div>
    )
}