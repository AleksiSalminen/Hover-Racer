import { useEffect } from "react";
import { Pages, Props } from "../../config/config";

import Engine from "../../engine/Engine";

function Game(props: Props) {

    useEffect(() => {
        initGame();
    }, []);

    const initGame = () => {
        const controlType = Engine.getControlTypeInfo().KEYBOARD;
        const quality = Engine.getQualityInfo().LOW;
        const hud = Engine.getHUDInfo().ON;
        const godmode = Engine.getGodmodeInfo().ON;
        const difficulty = Engine.getDifficultyInfo().NORMAL;
        const container = document.getElementById('main');
        const overlay = document.getElementById('overlay');
        const track = "Cityscape";
        Engine.start(controlType, quality, hud, godmode, endGame, container, overlay, track, difficulty);
    }

    const endGame = () => {
        returnToHomePage();
    }

    const returnToHomePage = () => {
        props.setPage(Pages.Home);
    }

    return <>
        <div id="overlay"></div>
        <div id="main"></div>
    </>
}

export default Game;
