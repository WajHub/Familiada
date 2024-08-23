import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import QuestionsPanelPage from "./pages/QuestionsPanelPage.jsx";
import "./style/index.css";
import GamePanelPage from "./pages/GamePanelPage.jsx";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/QuestionsPanel" element={<QuestionsPanelPage />}></Route>
        <Route path="/GamePanel" element={<GamePanelPage />}></Route>
      </Routes>
    </Router>
  );
};

export default App;
