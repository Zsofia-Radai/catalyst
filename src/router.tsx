import { createBrowserRouter } from "react-router-dom";
import { DasboardPage } from "./pages/DashboardPage";
import { HabitsPage } from "./pages/HabitsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AppLayout } from "./layout/AppLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <DasboardPage /> },
      { path: "/habits", element: <HabitsPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
    ],
  },
]);
