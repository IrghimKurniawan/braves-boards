import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import Dashboard from "./Dashboard.jsx";
import Boards from "./Boards.jsx";
import Reports from "./Reports.jsx";
import Timetracker from "./Timetracker.jsx";
import Projects from "./Projects.jsx";
import Team from "./Team.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/boards" element={<Boards />} />
      <Route path="/tracker" element={<Timetracker />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/team" element={<Team />} />
    </Routes>
  </BrowserRouter>
);