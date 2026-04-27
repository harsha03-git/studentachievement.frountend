import { NavLink } from "react-router-dom";
import { LayoutDashboard, Plus, ListChecks, BarChart3, Trophy, User, Sparkles, LogOut, Settings, Users } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const adminNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/students", label: "Manage Students", icon: Users },
  { to: "/admin/manage", label: "Review", icon: ListChecks },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
];

const teacherNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/teacher/students", label: "My Students", icon: Users },
];

const studentNav = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/student/achievements", label: "My Achievements", icon: Trophy },
  { to: "/student/add", label: "Submit", icon: Plus },
  { to: "/student/profile", label: "Profile", icon: User },
];

export const Sidebar = ({ onNavigate }: { onNavigate?: () => void }) => {
  const { user, logout } = useApp();
  const navigate = useNavigate();
  const items = user?.role === "admin" ? adminNav : user?.role === "teacher" ? teacherNav : studentNav;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-20 bg-sidebar border-r border-sidebar-border flex flex-col items-center py-6 shadow-card">
      {/* Logo */}
      <div className="h-12 w-12 rounded-2xl gradient-primary flex items-center justify-center shadow-glow mb-10">
        <Sparkles className="h-6 w-6 text-white" />
      </div>

      {/* Nav icons */}
      <nav className="flex flex-col items-center gap-3 flex-1">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={item.label}
            className={({ isActive }) =>
              cn(
                "group relative h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm scale-105"
                  : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute -left-3 top-1/2 -translate-y-1/2 h-6 w-1 rounded-r-full gradient-primary" />
                )}
                <item.icon className="h-5 w-5 transition-transform group-hover:scale-110" />
                <span className="absolute left-full ml-3 px-2.5 py-1 rounded-md bg-foreground text-background text-xs font-medium whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity hidden lg:block z-50">
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex flex-col items-center gap-3">
        <button
          title="Settings"
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground transition-all"
        >
          <Settings className="h-5 w-5" />
        </button>
        <button
          title="Logout"
          onClick={handleLogout}
          className="h-12 w-12 rounded-2xl flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-all"
        >
          <LogOut className="h-5 w-5" />
        </button>
      </div>
    </aside>
  );
};
