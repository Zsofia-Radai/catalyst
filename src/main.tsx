import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Catalyst from "./Catalyst.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Catalyst />
  </StrictMode>,
);
