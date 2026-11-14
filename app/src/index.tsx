import "./style/css/index.css";
import { createRoot } from "react-dom/client";
import App from "./App";
import { installPreviewApi } from "./host/previewApi";

installPreviewApi();

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
