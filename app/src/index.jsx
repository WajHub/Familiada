import "./style/css/bootstrap.css";
import "./style/css/index.css";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installPreviewApi } from "./host/previewApi";

installPreviewApi();

const container = document.getElementById("root");
const root = createRoot(container);

root.render(<App />);
