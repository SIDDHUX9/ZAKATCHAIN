"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Wallet, LogOut, Menu, X, Shield, ArrowRight, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/calculate", label: "Calculate" },
  { href: "/distribute", label: "Distribute" },
];

export default function Navbar() {
  const pathname = usePathname();
  const {
    publicKey,
    connectWallet,
    connectDemoWallet,
    disconnectWallet,
    isConnecting,
    isDemo,
    error,
  } = useWallet();
  
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connectOpen, setConnectOpen] = useState(false);

  const handleConnectFreighter = async () => {
    setConnectOpen(false);
    await connectWallet();
  };

  const handleConnectDemo = async () => {
    setConnectOpen(false);
    await connectDemoWallet();
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/80 backdrop-blur-xl">
      <div className="container-main flex items-center justify-between h-[60px]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm transition-transform duration-200 group-hover:scale-105">
            <span className="text-primary-foreground font-bold text-sm">Z</span>
          </div>
          <span className="font-bold text-lg tracking-tight text-gradient">
            ZakatChain
          </span>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                pathname === link.href
                  ? "text-primary bg-primary/8"
                  : "text-text-muted hover:text-text-main hover:bg-muted/50"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2.5">
          {publicKey ? (
            <>
              <div
                className={cn(
                  "hidden sm:flex items-center gap-2 py-1.5 px-3.5 rounded-full text-xs font-medium border shadow-sm",
                  isDemo
                    ? "bg-amber-500/8 text-amber-600 dark:text-amber-400 border-amber-500/20"
                    : "bg-emerald-500/8 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                )}
              >
                <div
                  className={cn(
                    "w-1.5 h-1.5 rounded-full animate-pulse",
                    isDemo ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
                {isDemo ? "Demo" : "Testnet"}: {publicKey.slice(0, 4)}...{publicKey.slice(-4)}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={disconnectWallet}
                className="hidden sm:flex h-8 w-8 rounded-lg hover:bg-destructive/8 hover:text-destructive"
                title="Disconnect"
              >
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setConnectOpen(true)}
              disabled={isConnecting}
              size="sm"
              className="hidden sm:inline-flex gap-2 rounded-xl shadow-sm text-xs font-semibold px-4"
            >
              <Wallet className="w-3.5 h-3.5" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="container-main pb-3">
          <p className="text-xs text-destructive bg-destructive/5 px-4 py-2 rounded-lg border border-destructive/10">
            {error}
          </p>
        </div>
      )}

      {/* Connect Dialog */}
      <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Connect Wallet</DialogTitle>
          <DialogDescription className="text-sm">
            Choose how you'd like to access ZakatChain.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-5">
          <button
            onClick={handleConnectFreighter}
            className="flex items-center justify-between p-5 rounded-2xl border bg-card hover:border-primary/40 transition-all duration-200 text-left group"
          >
            <div className="flex gap-4 items-center">
              <div className="w-11 h-11 rounded-xl bg-primary/8 flex items-center justify-center text-primary transition-transform duration-200 group-hover:scale-110">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Freighter Wallet</p>
                <p className="text-xs text-text-muted mt-0.5">Stellar browser extension</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={handleConnectDemo}
            className="flex items-center justify-between p-5 rounded-2xl border bg-card hover:border-accent/40 transition-all duration-200 text-left group"
          >
            <div className="flex gap-4 items-center">
              <div className="w-11 h-11 rounded-xl bg-amber-500/8 flex items-center justify-center text-accent transition-transform duration-200 group-hover:scale-110">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm">Demo Sandbox</p>
                <p className="text-xs text-text-muted mt-0.5">Preview with test data, no extension needed</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
          </button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setConnectOpen(false)} className="rounded-xl text-xs">
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-1 bg-card animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-primary/8 text-primary"
                  : "text-text-muted hover:bg-muted"
              )}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-3 border-t mt-3">
            {publicKey ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2 px-4 py-2">
                  <Activity className="w-3.5 h-3.5 text-text-muted" />
                  <span className="text-xs font-medium text-text-muted truncate">
                    {isDemo ? "Demo" : "Testnet"}: {publicKey.slice(0, 10)}...
                  </span>
                </div>
                <button
                  onClick={() => { disconnectWallet(); setMobileOpen(false); }}
                  className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setMobileOpen(false); setConnectOpen(true); }}
                className="w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
