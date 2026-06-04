import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, CalendarDays, Clock3, ListChecks } from "lucide-react";
import layout from "./AppLayout.module.css";

export function AppLayout() {
  const navItems = [
    { to: "/", label: "Dashboard", icon: CalendarDays },
    { to: "/habits", label: "Habits", icon: ListChecks },
    { to: "/sessions", label: "Sessions", icon: Clock3 },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className={layout.page}>
      <aside className={layout.sidebar}>
        <h1 className={layout.projectTitle}>Catalyst</h1>
        <nav className={layout.tabs}>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              className={({ isActive }) =>
                isActive ? `${layout.tab} ${layout.activeTab}` : layout.tab
              }
              to={to}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className={layout.content}>
        <Outlet />
      </main>
    </div>
  );
}
