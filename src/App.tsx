import { useState } from "react";
import "./App.css";
import TriangleGame from "./games/TriangleGame/TriangleGame";

type GameType = "triangle" | null;

function App() {
  const [selectedGame, setSelectedGame] = useState<GameType>(null);

  const games = [{ id: "triangle" as const, name: "Triangle Game" }];

  const renderGame = () => {
    switch (selectedGame) {
      case "triangle":
        return <TriangleGame />;
      default:
        return (
          <div className="game-select">
            <h1>Select a Game</h1>
            <p>Choose a game from the dropdown above</p>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <div className="game-selector">
        <select
          value={selectedGame || ""}
          onChange={(e) => setSelectedGame(e.target.value as GameType)}
          className="game-dropdown"
        >
          <option value="">-- Select a Game --</option>
          {games.map((game) => (
            <option key={game.id} value={game.id}>
              {game.name}
            </option>
          ))}
        </select>
      </div>
      {renderGame()}
    </div>
  );
}

export default App;
