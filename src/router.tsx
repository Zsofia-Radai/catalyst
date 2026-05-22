import { createBrowserRouter } from "react-router-dom";
import { DasboardPage } from "./pages/DashboardPage";
import { HabitsPage } from "./pages/HabitsPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";
import { AppLayout } from "./layout/AppLayout";
import { SessionsPage } from "./pages/SessionsPage";
import { ErrorPage } from "./pages/ErrorPage/ErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <DasboardPage /> },
      { path: "/habits", element: <HabitsPage /> },
      { path: "/sessions", element: <SessionsPage /> },
      { path: "/analytics", element: <AnalyticsPage /> },
    ],
  },
]);
