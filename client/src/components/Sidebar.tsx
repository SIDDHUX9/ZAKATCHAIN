"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useWallet } from "@/context/WalletContext";
import {
  LayoutDashboard,
  Calculator,
  Send,
  History,
  Settings,
  Wallet,
  LogOut,
} from "lucide-react";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calculate", label: "Calculate Zakat", icon: Calculator },
  { href: "/distribute", label: "Distribute", icon: Send },
  { href: "/history", label: "History", icon: History },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { publicKey, disconnectWallet, isDemo } = useWallet();

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r bg-sidebar-bg min-h-screen">
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">Z</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-text-main">
            ZakatChain
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-text-muted hover:bg-muted hover:text-text-main"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t space-y-3">
        {publicKey && (
          <div className="flex flex-col gap-2 p-3 rounded-lg bg-muted border">
            <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full animate-pulse", isDemo ? "bg-amber-500" : "bg-emerald-500")} />
              <span className="text-xs font-bold text-text-muted capitalize">
                {isDemo ? "Demo Sandbox" : "Testnet Wallet"}
              </span>
            </div>
            <p className="text-xs font-mono text-text-muted truncate select-all" title={publicKey}>
              {publicKey}
            </p>
          </div>
        )}
        <button
          onClick={disconnectWallet}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-text-muted hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="w-4 h-4" />
          Disconnect
        </button>
      </div>
    </aside>
  );
}
