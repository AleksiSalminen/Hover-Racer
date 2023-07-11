import { Pages, Props } from "../../config/config";
import "./css/global.css";
import "./css/fonts.css";
import "./css/multi.css";


function Home(props: Props) {

    const startGame = () => {
        props.setPage(Pages.Game);
    }

    return <>
        <div id="step-1">
            <div id="global"></div>
            <div id="title">
            </div>
            <div id="menucontainer">
                <div id="menu">
                    <div id="start" onClick={() => startGame()}>Start</div>
                    <div id="s-controlType">Controls: Keyboard</div>
                    <div id="s-quality">Quality: High</div>
                    <div id="s-hud">HUD: On</div>
                    <div id="s-godmode">Godmode: Off</div>
                    <div id="s-credits">Credits</div>
                </div>
            </div>
        </div>
    </>
}

export default Home;
