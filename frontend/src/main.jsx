import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { BackendProvider } from "./context/BackendContext";
import About from "./pages/About.jsx";
import Monitoring from "./pages/Monitoring.jsx";
import Teck from "./pages/Teck.jsx";
import NotFound from "./pages/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BackendProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/teck" element={<Teck />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BackendProvider>
    </BrowserRouter>
  </StrictMode>,
);

