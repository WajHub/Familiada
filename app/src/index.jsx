import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./style/css/bootstrap.css";
import "./style/js/bootstrap.bundle.js";
import "./style/index.css";
// import "./style/js/bootstrap.js";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
