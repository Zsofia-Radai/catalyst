import { RouterProvider } from "react-router-dom";
import "./Catalyst.css";
import { router } from "./router";
import { SessionsProvider } from "./features/sessions/context/SessionsProvider";
import { HabitsProvider } from "./features/habits/context/HabitsProvider";

function Catalyst() {
  return (
    <HabitsProvider>
      <SessionsProvider>
        <RouterProvider router={router} />
      </SessionsProvider>
    </HabitsProvider>
  );
}

export default Catalyst;
