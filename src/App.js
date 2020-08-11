import React from "react";
import Game from "./Game";

import "./App.css";

function App() {
  return (
    <div className="app">
      <h1 className="app__title">CONWAY'S GAME OF LIFE</h1>

      <Game />
    </div>
  );
}

export default App;
