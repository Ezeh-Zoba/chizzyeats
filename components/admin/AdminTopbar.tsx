"use client";

import Image from "next/image";
import { Bell, Menu, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ADMIN_SIDEBAR_NAV } from "@/lib/admin-data";

interface AdminNotification {
  id: string;
  text: string;
  time: string;
}

interface AdminTopbarProps {
  activeSection: string;
  onCreateRecipe: () => void;
  notifications: AdminNotification[];
  onMenuClick?: () => void;
}

export function AdminTopbar({ activeSection, onCreateRecipe, notifications, onMenuClick }: AdminTopbarProps) {
  return (
    <header
      className="flex items-center justify-between px-3 sm:px-6 py-3 sm:py-4 flex-shrink-0"
      style={{ backgroundColor: "var(--ce-bg-card)", borderBottom: "1px solid var(--ce-border)", boxShadow: "0 1px 8px var(--ce-shadow)" }}
    >
      <div className="flex items-center gap-3">
        {/* Hamburger — mobile only */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-xl"
          style={{ color: "var(--ce-text-muted)", backgroundColor: "var(--ce-bg-surface)" }}
          aria-label="Open menu"
        >
          <Menu size={18} />
        </button>

        <div>
          <h1 className="truncate text-base md:text-lg" style={{ fontFamily: "'Dancing Script', cursive", color: "var(--ce-text)", fontWeight: 700 }}>
            {ADMIN_SIDEBAR_NAV.find((n) => n.id === activeSection)?.label || "Dashboard"}
          </h1>
          <p className="text-xs hidden sm:block" style={{ color: "var(--ce-text-muted)" }}>Welcome back, Chizzy 👋</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onCreateRecipe}
          className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-sm"
          style={{ background: "linear-gradient(135deg, #FFC72C, #FF8C42)", color: "#5C4033", fontWeight: 700, boxShadow: "0 2px 12px rgba(255,199,44,0.35)" }}
        >
          <Plus size={15} /> New Recipe
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-9 h-9 rounded-full flex items-center justify-center" style={{ backgroundColor: "var(--ce-bg-surface)" }}>
              <Bell size={16} style={{ color: "#FF8C42" }} />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" style={{ width: "min(18rem, 90vw)" }}>
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <DropdownMenuItem disabled className="text-sm text-muted-foreground">
                No pending comments
              </DropdownMenuItem>
            ) : (
              notifications.map((n) => (
                <DropdownMenuItem key={n.id} className="flex flex-col items-start gap-0.5 whitespace-normal">
                  <span className="text-sm">{n.text}</span>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="relative w-9 h-9 rounded-full overflow-hidden flex-shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1636647511729-6703539ba71f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100"
            alt="Admin"
            fill
            sizes="36px"
            className="object-cover"
          />
        </div>
      </div>
    </header>
  );
}
