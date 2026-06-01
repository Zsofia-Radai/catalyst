import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Catalyst from "./Catalyst.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Catalyst />
    </QueryClientProvider>
  </StrictMode>,
);
