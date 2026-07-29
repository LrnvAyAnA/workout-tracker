import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./theme/font.css";
import "./theme/normalize.css";
import { initializeDatabase } from "./database/migrations";
import { Capacitor } from "@capacitor/core";

async function bootstrap() {
  if (Capacitor.isNativePlatform()) {
    try {
      console.log("BOOTSTRAP START");

      await initializeDatabase();

      console.log("DATABASE INIT DONE");

      createRoot(document.getElementById("root")!).render(<App />);
    } catch (e) {
      console.error("BOOTSTRAP ERROR", e);
    }
  }
  const container = document.getElementById("root");
  const root = createRoot(container!);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

bootstrap();
