import { RouterProvider } from "react-router-dom";
import "./Catalyst.css";
import { router } from "./router";
import { SessionsProvider } from "./features/sessions/context/SessionsProvider";
import { HabitsProvider } from "./features/habits/context/HabitsProvider";
import { ToastProvider } from "./context/ToastContext";

function Catalyst() {
  return (
    <HabitsProvider>
      <SessionsProvider>
        <ToastProvider>
          <RouterProvider router={router} />
        </ToastProvider>
      </SessionsProvider>
    </HabitsProvider>
  );
}

export default Catalyst;
