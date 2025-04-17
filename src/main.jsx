// src/main.jsx

import React from "react";
import ReactDOM from "react-dom/client";
import { registerSW } from "virtual:pwa-register";

import QuitKitApp from "./QuitKitApp";
import "./index.css";

// Registrar el service worker para que la PWA funcione offline
const updateSW = registerSW({
  onNeedRefresh() {
    console.log("Nueva versión disponible. Recarga la página para actualizar.");
  },
  onOfflineReady() {
    console.log("App lista para funcionar offline.");
  }
});

ReactDOM
  .createRoot(document.getElementById("root"))
  .render(
    <React.StrictMode>
      <QuitKitApp />
    </React.StrictMode>
  );
