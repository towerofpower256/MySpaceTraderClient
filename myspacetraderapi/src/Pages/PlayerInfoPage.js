import { useContext, useEffect, useState } from "react";
import PlayerInfoContext from "../Contexts/PlayerInfoContext.js";
import { getPlayerInfo, readResponse } from "../Services/SpaceTraderApi.js";
import prettyNumber from "../Utils/prettyNumber";
import Timestamp from "../Components/Timestamp.js";
import MyPageTitle from "../Components/MyPageTitle";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import PlayerLoansList from "../Components/Player/PlayerLoansList";
import PlayerInfoSummary from "../Components/Player/PlayerInfoSummary"
import Table from "react-bootstrap/esm/Table.js";
import setPageTitle from "../Utils/setPageTitle";

function PlayerInfoPage(props) {
    const [playerInfo, setPlayerInfo] = useContext(PlayerInfoContext);

    useEffect(() => {setPageTitle("Player")});

    if (!playerInfo) {
        return (
            <div>No player data</div>
        );
    } else {
        return (
            <div id="player-info-page">
                <MyPageTitle>Player</MyPageTitle>
                <PlayerInfoSummary playerInfo={playerInfo} />
                <MyPageSubTitle>Loans</MyPageSubTitle>
                <PlayerLoansList />
            </div>
        );
    }
}

export default PlayerInfoPage;