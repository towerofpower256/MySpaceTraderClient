import ToolsWebCallBase from './ToolsWebCallBase';
import { useState } from 'react';
import { getPlayerInfo } from '../../Services/SpaceTraderApi';

export default function ToolWebCallAccountDetails(props) {
    const [result, setResult] = useState("");
    const [isWorking, setIsWorking] = useState(false);

    function handleClick(e) {
        if (isWorking) return; // Don't execute again if it's already running

        setIsWorking(true);
        setResult("");
        try {
            getPlayerInfo()
                .then(
                    stcResponse => {
                        setResult(JSON.stringify(stcResponse, null, 2));
                        setIsWorking(false);
                    },
                    error => {
                        console.error(error);
                        setResult("An error occurred: " + error);
                        setIsWorking(false);
                    }
                );
        }
        catch (error) {
            console.error(error);
            setResult("An error occurred: " + error);
            setIsWorking(false);
        }
    }

    return (
        <ToolsWebCallBase 
            name="Get account details"
            onClick={handleClick}
            value={result}
            isWorking={isWorking}
        />
    );
}