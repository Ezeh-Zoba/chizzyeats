"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { ChevronRight, Home, LogOut, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { auth } from "@/lib/firebase/client";
import { ADMIN_SIDEBAR_NAV } from "@/lib/admin-data";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  collapsed: boolean;
  onToggleCollapsed: () => void;
  mobileOpen: boolean;
  onClose: () => void;
}

function NavContent({
  activeSection,
  onSectionChange,
  collapsed,
  onClose,
}: {
  activeSection: string;
  onSectionChange: (id: string) => void;
  collapsed: boolean;
  onClose?: () => void;
}) {
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    await fetch("/api/auth/session", { method: "DELETE" });
    router.push("/admin/login");
  };

  const handleNav = (id: string) => {
    onSectionChange(id);
    onClose?.();
  };

  return (
    <>
      <nav className="flex-1 py-4 space-y-1 px-2 overflow-y-auto">
        {ADMIN_SIDEBAR_NAV.map(({ icon: Icon, label, id }) => (
          <button
            key={id}
            onClick={() => handleNav(id)}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm transition-all duration-200"
            style={{
              backgroundColor: activeSection === id ? "rgba(255,199,44,0.2)" : "transparent",
              color: activeSection === id ? "#FFC72C" : "rgba(255,248,231,0.7)",
              fontWeight: activeSection === id ? 600 : 400,
            }}
            onMouseEnter={(e) => {
              if (activeSection !== id) (e.currentTarget as HTMLElement).style.backgroundColor = "rgba(255,255,255,0.06)";
            }}
            onMouseLeave={(e) => {
              if (activeSection !== id) (e.currentTarget as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            <Icon size={18} style={{ flexShrink: 0 }} />
            {!collapsed && <span className="truncate">{label}</span>}
          </button>
        ))}
      </nav>

      <div className="px-2 pb-4 space-y-1 border-t pt-4" style={{ borderColor: "rgba(255,199,44,0.15)" }}>
        <Link href="/" className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm" style={{ color: "rgba(255,248,231,0.6)" }}>
          <Home size={18} />
          {!collapsed && <span>View Site</span>}
        </Link>
        <button onClick={handleSignOut} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm" style={{ color: "rgba(255,248,231,0.5)" }}>
          <LogOut size={18} />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </>
  );
}

export function AdminSidebar({ activeSection, onSectionChange, collapsed, onToggleCollapsed, mobileOpen, onClose }: AdminSidebarProps) {
  return (
    <>
      {/* Mobile overlay drawer */}
      <div className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "block" : "hidden"}`}>
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <aside
          className="absolute left-0 top-0 h-full w-[220px] flex flex-col"
          style={{ backgroundColor: "var(--ce-bg-admin-sidebar)" }}
        >
          <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: "rgba(255,199,44,0.15)" }}>
            <Logo variant="white" size="sm" />
            <button onClick={onClose} className="p-1.5 rounded-lg" style={{ color: "rgba(255,248,231,0.6)" }}>
              <X size={16} />
            </button>
          </div>
          <NavContent activeSection={activeSection} onSectionChange={onSectionChange} collapsed={false} onClose={onClose} />
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside
        className="hidden md:flex flex-col"
        style={{ width: collapsed ? "64px" : "220px", backgroundColor: "var(--ce-bg-admin-sidebar)", transition: "width 0.25s ease", flexShrink: 0 }}
      >
        <div className="flex items-center justify-between px-4 py-5 border-b" style={{ borderColor: "rgba(255,199,44,0.15)" }}>
          {!collapsed && <Logo variant="white" size="sm" />}
          <button
            onClick={onToggleCollapsed}
            className="p-1.5 rounded-lg transition-colors flex-shrink-0"
            style={{ color: "rgba(255,248,231,0.6)" }}
          >
            <ChevronRight size={16} style={{ transform: collapsed ? "rotate(0)" : "rotate(180deg)", transition: "transform 0.25s" }} />
          </button>
        </div>
        <NavContent activeSection={activeSection} onSectionChange={onSectionChange} collapsed={collapsed} />
      </aside>
    </>
  );
}
