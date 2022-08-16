import { useContext, useEffect, useState } from "react";
import PlayerInfoContext from "../Contexts/PlayerInfoContext.js";
import Page from "../Components/Page.js"
import { getPlayerInfo, readResponse } from "../Services/SpaceTraderApi.js";
import { prettyNumber } from "../Utils.js";
import Timestamp from "../Components/Timestamp.js";
import MyPageTitle from "../Components/MyPageTitle";
import MyPageSubTitle from "../Components/MyPageSubTitle";
import PlayerLoansList from "../Components/PlayerLoansList.js";
import Table from "react-bootstrap/esm/Table.js";

function PlayerInfoPage(props) {
    const [playerInfo, setPlayerInfo] = useContext(PlayerInfoContext);

    if (!playerInfo) {
        return (
            <div>No player data</div>
        );
    } else {
        return (
            <div id="player-info-page">
                <MyPageTitle>Player</MyPageTitle>
                <PlayerInfoSummary playerinfo={playerinfo} />
                <MyPageSubTitle>Loans</MyPageSubTitle>
                <PlayerLoansList />
            </div>
        );
    }
}

export default PlayerInfoPage;