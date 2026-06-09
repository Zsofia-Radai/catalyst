import { NavLink, Outlet } from "react-router-dom";
import { BarChart3, CalendarDays, Clock3, ListChecks } from "lucide-react";
import layout from "./AppLayout.module.css";
import catalystLogo from "../assets/catalyst-logo.png";
import { Button } from "../ui/Button/Button";
import { seedDemoData } from "../utils/demoData";
import { useQueryClient } from "@tanstack/react-query";

export function AppLayout() {
  const queryClient = useQueryClient();
  const navItems = [
    { to: "/", label: "Dashboard", icon: CalendarDays },
    { to: "/habits", label: "Habits", icon: ListChecks },
    { to: "/sessions", label: "Sessions", icon: Clock3 },
    { to: "/analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className={layout.page}>
      <aside className={layout.sidebar}>
        <div className={layout.logoWrapper}>
          <h1 className={layout.projectTitle}>Catalyst</h1>
          <img
            className={layout.logo}
            src={catalystLogo}
            alt="Catalyst logo"
          ></img>
        </div>
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
        <Button
          onClick={async () => {
            await seedDemoData({ reset: true });
            await queryClient.invalidateQueries({ queryKey: ["habits"] });
            await queryClient.invalidateQueries({ queryKey: ["sessions"] });
          }}
        >
          Reset demo data
        </Button>
      </aside>

      <main className={layout.content}>
        <Outlet />
      </main>
    </div>
  );
}
