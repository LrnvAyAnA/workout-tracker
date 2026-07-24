import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./theme/font.css";
import "./theme/normalize.css";

const container = document.getElementById("root");
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
