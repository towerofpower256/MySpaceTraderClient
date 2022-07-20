import GameLoadingContext from "../Contexts/GameLoadingContext";
import { GAMELOADSTATE_ERROR, GAMELOADSTATE_LOADING, GAMELOADSTATE_NOTLOADED, GAMELOADSTATE_LOADED } from "../Constants";
import { useContext } from "react";

export default function GameLoadingPage(props) {
    const [gameLoadState, gameLoadingMsg] = useContext(GameLoadingContext);

    if (gameLoadState === GAMELOADSTATE_LOADED) {
        return (props.children);
    } else {
        return (
            <div>
                {gameLoadingMsg}<br />
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }
}