import { useEffect } from "react";
import { Pages, Props } from "../../config/config";

import Engine from "../../engine/Engine";

function Game(props: Props) {

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        let defaultControls, url, settings;
        url = Engine.getURLParameter();
        defaultControls = Engine.getDefaultControls();
        settings = [['controlType', ['KEYBOARD', 'TOUCH', 'LEAP MOTION CONTROLLER', 'GAMEPAD'], defaultControls, defaultControls, 'Controls: '], ['quality', ['LOW', 'MID', 'HIGH', 'VERY HIGH'], 3, 3, 'Quality: '], ['hud', ['OFF', 'ON'], 1, 1, 'HUD: '], ['godmode', ['OFF', 'ON'], 0, 1, 'Godmode: ']];
        // TODO: Improve settings
        Engine.start(settings[0][3], settings[1][3], settings[2][3], settings[3][3]);
    }

    const returnToHomePage = () => {
        props.setPage(Pages.Home);
    }

    return <>
        <div id="overlay"></div>
        <div id="progressbar"></div>
        <div id="main"></div>
        <p onClick={() => returnToHomePage()}>Game</p>
    </>
}

export default Game;
