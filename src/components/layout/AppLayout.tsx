import { ReactNode, useState } from "react";
import { Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { useApp } from "@/context/AppContext";
import { cn } from "@/lib/utils";

export const AppLayout = ({ children }: { children: ReactNode }) => {
  const { user } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (!user) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-canvas">
      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-foreground/30 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <div className="md:hidden animate-slide-in-right">
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      <div className={cn("md:ml-20 p-3 md:p-5")}>
        <div className="bg-card rounded-3xl shadow-card overflow-hidden min-h-[calc(100vh-2.5rem)]">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="p-5 md:p-8 animate-fade-in">{children}</main>
        </div>
      </div>
    </div>
  );
};
