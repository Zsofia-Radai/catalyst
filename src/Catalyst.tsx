import { RouterProvider } from "react-router-dom";
import "./Catalyst.css";
import { router } from "./router";
import { ToastProvider } from "./context/ToastContext";

function Catalyst() {
  return (
    <ToastProvider>
      <RouterProvider router={router} />
    </ToastProvider>
  );
}

export default Catalyst;
