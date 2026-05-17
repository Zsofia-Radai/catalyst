import { RouterProvider } from "react-router-dom";
import "./Catalyst.css";
import { router } from "./router";
import { SessionsProvider } from "./context/SessionsProvider";
import { HabitsProvider } from "./context/HabitsProvider";

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
