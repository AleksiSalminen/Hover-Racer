import { useEffect } from "react";
import { Pages } from "../../config/config";

import { Settings } from '../../engine/config/Config';
import Engine from "../../engine/Engine";

type Props = {
    setPage: Function,
    settings: Settings
}


function Game(props: Props) {

    useEffect(() => {
        initGame(props.settings);
    }, []);

    const initGame = (settings: Settings) => {
        const controlType = settings.controls;
        const quality = settings.quality;
        const hud = settings.hud;
        const godmode = settings.godmode;
        const difficulty = settings.difficulty;
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
