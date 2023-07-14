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
        const track = settings.track;
        const ship = settings.ship;
        const controlType = settings.controls;
        const quality = settings.quality;
        const hud = settings.hud;
        const godmode = settings.godmode;
        const difficulty = settings.difficulty;
        const container = document.getElementById('main');
        const overlay = document.getElementById('overlay');
        Engine.start(track, ship, difficulty, controlType, quality, hud, godmode, endGame, container, overlay);
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
