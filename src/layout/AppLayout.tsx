import { NavLink, Outlet } from "react-router-dom";
import layout from "./AppLayout.module.css";

export function AppLayout() {
  return (
    <div className={layout.page}>
      <h1>Catalyst</h1>
      <nav className={layout.tabs}>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${layout.tab} ${layout.activeTab}` : layout.tab
          }
          to="/"
        >
          Dashboard
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${layout.tab} ${layout.activeTab}` : layout.tab
          }
          to="/habits"
        >
          Habits
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${layout.tab} ${layout.activeTab}` : layout.tab
          }
          to="/sessions"
        >
          Sessions
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            isActive ? `${layout.tab} ${layout.activeTab}` : layout.tab
          }
          to="/analytics"
        >
          Analytics
        </NavLink>
      </nav>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
