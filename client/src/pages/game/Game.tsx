import { Pages, Props } from "../../config/config";


function Game(props: Props) {

    const startGame = () => {
        props.setPage(Pages.Home);
    }

    return <>
        <div id="overlay"></div>
        <p onClick={() => startGame()}>Game</p>
        <div id="main"></div>
    </>
}

export default Game;
