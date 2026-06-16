import { Route, Routes } from "react-router-dom";
import { HomePage } from "./pages/HomePage";
import { CreateGamePage } from "./pages/CreateGamePage";
import { JoinGamePage } from "./pages/JoinGamePage";
import { LobbyPage } from "./pages/LobbyPage";
import { GamePage } from "./pages/GamePage";
import { GameOverPage } from "./pages/GameOverPage";
import { RulesPage } from "./pages/RulesPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/loo" element={<CreateGamePage />} />
      <Route path="/liitu" element={<JoinGamePage />} />
      <Route path="/lobby" element={<LobbyPage />} />
      <Route path="/mang" element={<GamePage />} />
      <Route path="/mang-labi" element={<GameOverPage />} />
      <Route path="/reeglid" element={<RulesPage />} />
    </Routes>
  );
}

export default App;
