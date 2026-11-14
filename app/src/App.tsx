import { Navigate, Route, Routes } from "react-router-dom";
import { HashRouter as Router } from "react-router-dom";
import BoardPanelPage from "./pages/BoardPanelPage.jsx";
import { HostShell } from "./host/HostShell";
import { LibraryPage } from "./host/library/LibraryPage";
import { ShowPage } from "./host/show/ShowPage";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/BoardPanel" element={<BoardPanelPage />} />
        <Route element={<HostShell />}>
          <Route path="/" element={<LibraryPage />} />
          <Route path="/show" element={<ShowPage />} />
          <Route path="/QuestionsPanel" element={<Navigate to="/" replace />} />
          <Route path="/GamePanel" element={<Navigate to="/show" replace />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
