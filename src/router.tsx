import { createBrowserRouter } from "react-router-dom";
import { DashboardPage } from "./pages/DashboardPage";
import { HabitsPage } from "./pages/HabitsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage/AnalyticsPage";
import { AppLayout } from "./layout/AppLayout";
import { SessionsPage } from "./pages/SessionsPage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: "/habits", element: <HabitsPage /> },
      { path: "/sessions", element: <SessionsPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
    ],
  },
]);
