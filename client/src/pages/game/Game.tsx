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
        const controlType = Engine.getControlTypeInfo().KEYBOARD;
        const quality = Engine.getQualityInfo().LOW;
        const hud = Engine.getHUDInfo().ON;
        const godmode = Engine.getGodmodeInfo().ON;
        Engine.start(controlType, quality, hud, godmode, endGame);
    }

    const endGame = () => {
        returnToHomePage();
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
