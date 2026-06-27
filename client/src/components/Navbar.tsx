"use client";

import Link from "next/link";
import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { publicKey, connectWallet, disconnectWallet, isConnecting, error } =
    useWallet();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleConnect = async () => {
    await connectWallet();
  };

  return (
    <header className="border-b bg-card">
      <div className="container-main flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">Z</span>
          </div>
          <span className="font-bold text-lg tracking-tight hidden sm:block">
            ZakatChain
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-sm text-text-muted hover:text-text-main transition-colors"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-sm text-text-muted hover:text-text-main transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/calculate"
            className="text-sm text-text-muted hover:text-text-main transition-colors"
          >
            Calculate
          </Link>
          <Link
            href="/distribute"
            className="text-sm text-text-muted hover:text-text-main transition-colors"
          >
            Distribute
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {publicKey ? (
            <>
              <Badge variant="success" className="hidden sm:inline-flex gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {publicKey.slice(0, 6)}...{publicKey.slice(-4)}
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={disconnectWallet}
                className="hidden sm:flex"
                title="Disconnect"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConnect}
              disabled={isConnecting}
              size="sm"
              className="hidden sm:inline-flex gap-2"
            >
              <Wallet className="w-4 h-4" />
              {isConnecting ? "Connecting..." : "Connect Wallet"}
            </Button>
          )}
          <button
            className="md:hidden p-2"
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
          <p className="text-sm text-error bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        </div>
      )}

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t p-4 space-y-2">
          <Link
            href="/"
            className="block px-4 py-2 rounded-lg text-sm hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="block px-4 py-2 rounded-lg text-sm hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            href="/calculate"
            className="block px-4 py-2 rounded-lg text-sm hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Calculate
          </Link>
          <Link
            href="/distribute"
            className="block px-4 py-2 rounded-lg text-sm hover:bg-muted"
            onClick={() => setMobileOpen(false)}
          >
            Distribute
          </Link>
          {publicKey ? (
            <button
              onClick={() => {
                disconnectWallet();
                setMobileOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-sm text-destructive hover:bg-red-50"
            >
              Disconnect Wallet
            </button>
          ) : (
            <button
              onClick={() => {
                handleConnect();
                setMobileOpen(false);
              }}
              className="w-full text-left px-4 py-2 rounded-lg text-sm text-primary hover:bg-primary-light"
            >
              Connect Wallet
            </button>
          )}
        </div>
      )}
    </header>
  );
}
