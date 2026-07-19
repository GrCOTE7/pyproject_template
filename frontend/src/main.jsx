import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./assets/styles.css";
import App from "./App.jsx";
import { BackendProvider } from "./context/BackendContext";

import About from "./pages/About.jsx";
import Learn1 from "./pages/Learn1.jsx";
import Learn2 from "./pages/Learn2.jsx";
import TicTacToe from "./pages/TicTacToe.jsx";
import Learn3 from "./pages/Learn3.jsx";
import Learn4 from "./pages/Learn4.jsx";
import Learn5 from "./pages/Learn5.tsx";
import Learn6 from "./pages/Learn6.tsx";
import Learn7 from "./pages/Learn7.tsx";
import Learn8 from "./pages/Learn8.tsx";
import Monitoring from "./pages/Monitoring.jsx";
import Tasks from "./pages/Tasks.jsx";
import Teck from "./pages/Teck.jsx";
import NotFound from "./pages/NotFound.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <BackendProvider>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/about" element={<About />} />
          <Route path="/learn1" element={<Learn1 />} />
          <Route path="/learn2" element={<Learn2 />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/learn3" element={<Learn3 />} />
          <Route path="/learn4" element={<Learn4 />} />
          <Route path="/learn5" element={<Learn5 />} />
          <Route path="/learn6" element={<Learn6 />} />
          <Route path="/learn7" element={<Learn7 />} />
          <Route path="/learn8" element={<Learn8 />} />
          <Route path="/monitoring" element={<Monitoring />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/teck" element={<Teck />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BackendProvider>
    </BrowserRouter>
  </StrictMode>,
);

