import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Catalyst from "./Catalyst.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { supabase } from "./lib/supabase.ts";
import { seedDemoData } from "./utils/demoData.ts";

const queryClient = new QueryClient();

export async function initializeAuth() {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    const { error } = await supabase.auth.signInAnonymously();

    if (error) throw error;
  }
}

await initializeAuth();
await seedDemoData();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <Catalyst />
    </QueryClientProvider>
  </StrictMode>,
);
