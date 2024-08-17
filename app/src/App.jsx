import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import HomePage from "./pages/HomePage.jsx";
import QuestionsPanelPage from "./pages/QuestionsPanelPage.jsx";
import "./style/index.css";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<HomePage />}></Route>
        <Route
          exact
          path="/QuestionsPanel"
          element={<QuestionsPanelPage />}
        ></Route>
      </Routes>
    </Router>
  );
};

export default App;
