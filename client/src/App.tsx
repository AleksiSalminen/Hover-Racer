import { useState } from 'react';
import { Pages } from "./config/config";
import { Settings, Track, Ship, ControlType, Quality, HUD, Godmode, Difficulty } from './engine/config/Config';

import Home from "./pages/home/Home";
import Game from "./pages/game/Game";
import NotFound from "./pages/not_found/NotFound";


function App() {
  const [page, setPage] = useState(Pages.Home);
  const basicSettings: Settings = {
    track: Track.CITYSCAPE, ship: Ship.FEISAR, 
    controls: ControlType.KEYBOARD, quality: Quality.MEDIUM, 
    hud: HUD.ON, godmode: Godmode.ON, difficulty: Difficulty.NORMAL
  };
  const [settings, setSettings] = useState(basicSettings);

  const startGame = (settings: Settings) => {
    setSettings(settings);
    setPage(Pages.Game);
  }

  if (page === Pages.Home) {
    return (<Home startGame={startGame} />);
  }
  else if (page === Pages.Game) {
    return (<Game setPage={setPage} settings={settings} />);
  }
  else {
    return (<NotFound />);
  }
}

export default App;
