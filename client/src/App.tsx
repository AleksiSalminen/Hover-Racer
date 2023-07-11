import { useState } from 'react';
import { Pages } from "./config/config";

import Home from "./pages/home/Home";
import Game from "./pages/game/Game";
import NotFound from "./pages/not_found/NotFound";


function App() {
  const [page, setPage] = useState(Pages.Home);

  if (page === Pages.Home) {
    return (<Home setPage={setPage} />);
  }
  else if (page === Pages.Game) {
    return (<Game setPage={setPage} />);
  }
  else {
    return (<NotFound />);
  }
}

export default App;
