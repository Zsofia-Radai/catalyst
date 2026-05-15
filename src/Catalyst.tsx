import { RouterProvider } from "react-router-dom";
import "./Catalyst.css";
import { router } from "./router";

function Catalyst() {
  return <RouterProvider router={router} />;
}

export default Catalyst;
