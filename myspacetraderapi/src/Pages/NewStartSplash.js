import { useState } from 'react';
import { useNavigate } from "react-router-dom";

import Modal from "react-bootstrap/esm/Modal";
import Button from "react-bootstrap/esm/Button";
import { getAuthToken, getLocalStorageItem, loadPlayerInfo, setLocalStorageItem } from '../Services/LocalStorage';

export default function NewStartSplash(props) {
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(shouldShowFirstTimeSplash());

    function shouldShowFirstTimeSplash() {
        let splashAckFlag = getLocalStorageItem("welcome_splash");
        if (splashAckFlag) return false;
        else {
            let playerInfo = loadPlayerInfo();
            return (typeof playerInfo.credits != "number" || playerInfo.credits === 0);
        }
    }

    function doHelp() {
        setShowModal(false);
        ackSplash();
        navigate("/help");
    }

    function ackSplash() {
        setLocalStorageItem("welcome_splash", true);
    }

    return (
        <Modal show={showModal} onHide={() => { setShowModal(false); ackSplash(); }}>
            <Modal.Header closeButton>
                <h3>New account</h3>
            </Modal.Header>
            <Modal.Body>
                <p>Welcome to Space Traders!</p>
                <p>This is your login token. Don't lose it, you'll need it to log in again! You can find it again on the <b>Player</b> page.</p>
                <p className="text-center"><pre>{getAuthToken()}</pre></p>
                <p>If you're new to the game, would you like to learn how to play?</p>
                <Button variant="primary" className="w-100" onClick={() => doHelp()}>
                    Show me how to play
                </Button>
            </Modal.Body>
        </Modal>
    )
}