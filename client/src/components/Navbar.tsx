"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Wallet, LogOut, Menu, X, Shield, ArrowRight, Activity } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
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
    <header className="sticky top-0 z-40 w-full border-b bg-card/85 backdrop-blur-md">
      <div className="container-main flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <span className="text-primary-foreground font-black text-base">Z</span>
          </div>
          <span className="font-extrabold text-xl tracking-tight text-gradient">
            ZakatChain
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-sm font-semibold text-text-muted hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-text-muted hover:text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/calculate"
            className="text-sm font-semibold text-text-muted hover:text-primary transition-colors"
          >
            Calculate
          </Link>
          <Link
            href="/distribute"
            className="text-sm font-semibold text-text-muted hover:text-primary transition-colors"
          >
            Distribute
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {publicKey ? (
            <>
              <Badge
                variant={isDemo ? "secondary" : "success"}
                className={cn(
                  "hidden sm:inline-flex gap-1.5 py-1 px-3 items-center rounded-full font-medium border text-xs shadow-sm",
                  isDemo
                    ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/25"
                    : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/25"
                )}
              >
                <div
                  className={cn(
                    "w-2 h-2 rounded-full animate-pulse",
                    isDemo ? "bg-amber-500" : "bg-emerald-500"
                  )}
                />
                {isDemo ? "Demo" : "Testnet"}: {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={disconnectWallet}
                className="hidden sm:flex hover:bg-destructive/10 hover:text-destructive rounded-lg"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setConnectOpen(true)}
              disabled={isConnecting}
              size="sm"
              className="hidden sm:inline-flex gap-2 shadow-sm rounded-lg"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-muted"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="container-main pb-3">
          <p className="text-sm text-error bg-red-50 dark:bg-red-950/20 px-4 py-2 rounded-lg border border-red-200/50">
            {error}
          </p>
        </div>
      )}

      {/* Wallet Connection Modal */}
      <Dialog open={connectOpen} onOpenChange={setConnectOpen}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Connect your Wallet</DialogTitle>
          <DialogDescription className="text-sm">
            Select a connection method to access ZakatChain dashboard and calculations.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-4">
          <button
            onClick={handleConnectFreighter}
            className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-primary hover:bg-primary-light/5 dark:hover:bg-primary-light/2 transition-all text-left group"
          >
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-primary-light dark:bg-primary-light/10 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-text-main">Freighter Wallet</p>
                <p className="text-xs text-text-muted">Use Stellar Freighter browser extension</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
          </button>

          <button
            onClick={handleConnectDemo}
            className="flex items-center justify-between p-4 rounded-xl border bg-card hover:border-accent hover:bg-secondary/5 transition-all text-left group"
          >
            <div className="flex gap-4 items-center">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/30 flex items-center justify-center text-accent group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-sm text-text-main">Demo Sandbox Mode</p>
                <p className="text-xs text-text-muted">Instant preview sandbox using a test address</p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
          </button>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setConnectOpen(false)} className="rounded-lg">
            Cancel
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-2 bg-card">
          <Link
            href="/"
            className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/calculate"
            className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Calculate
          </Link>
          <Link
            href="/distribute"
            className="block px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Distribute
          </Link>
          {publicKey ? (
            <div className="pt-2 border-t mt-2 space-y-2">
              <div className="flex items-center gap-2 px-4 py-2">
                <Activity className="w-4 h-4 text-text-muted" />
                <span className="text-xs font-semibold text-text-muted truncate">
                  {isDemo ? "Demo" : "Testnet"}: {publicKey}
                </span>
              </div>
              <button
                onClick={() => {
                  disconnectWallet();
                  setMobileOpen(false);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm font-bold text-destructive hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Disconnect Wallet
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t mt-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setConnectOpen(true);
                }}
                className="w-full text-left px-4 py-2 rounded-lg text-sm font-bold text-primary hover:bg-primary-light"
              >
                Connect Wallet
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
