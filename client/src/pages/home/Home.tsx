import { useState } from "react";
import { Pages, Props } from "../../config/config";
import Engine from "../../engine/Engine.ts";
import "./css/global.css";
import "./css/fonts.css";
import "./css/multi.css";


function Home(props: Props) {
    const config = Engine.getConfig();
    const [controls, setControls] = useState(config.controls.KEYBOARD);
    const [quality, setQuality] = useState(config.quality.LOW);
    const [hud, setHud] = useState(config.hud.ON);
    const [godmode, setGodmode] = useState(config.godmode.ON);

    const startGame = () => {
        props.setPage(Pages.Game);
    }

    const getEnumNextElem = (elem: string, enumm: any) => {
        let elemsLen = Object.keys(enumm).length;
        for (let i = 0;i < elemsLen;i++) {
            if (elem === Object.keys(enumm)[i]) {
                if (i === elemsLen-1) {
                    return Object.keys(enumm)[0];
                }
                else {
                    return Object.keys(enumm)[i+1]
                }
            }
        }
    }

    const changeControls = () => {
        let nextElem = getEnumNextElem(controls, config.controls);
        setControls(eval("config.controls." + nextElem));
    }

    const changeQuality = () => {
        let nextElem = getEnumNextElem(quality, config.quality);
        setQuality(eval("config.quality." + nextElem));
    }

    const changeHUD = () => {
        let nextElem = getEnumNextElem(hud, config.hud);
        setHud(eval("config.hud." + nextElem));
    }

    const changeGodmode = () => {
        let nextElem = getEnumNextElem(godmode, config.godmode);
        setGodmode(eval("config.godmode." + nextElem));
    }

    return <>
        <div id="step-1">
            <div id="global"></div>
            <div id="title">
            </div>
            <div id="menucontainer">
                <div id="menu">
                    <div id="start" onClick={() => startGame()}>Start</div>
                    <div id="s-controlType" onClick={() => changeControls()}>Controls: {controls}</div>
                    <div id="s-quality" onClick={() => changeQuality()}>Quality: {quality}</div>
                    <div id="s-hud" onClick={() => changeHUD()}>HUD: {hud}</div>
                    <div id="s-godmode" onClick={() => changeGodmode()}>Godmode: {godmode}</div>
                    <div id="s-credits">Credits</div>
                </div>
            </div>
        </div>
    </>
}

export default Home;
