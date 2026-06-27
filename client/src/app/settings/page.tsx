"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/context/WalletContext";
import { Wallet, LogOut, Bell, Palette, Currency, Copy, CheckCircle2, Shield } from "lucide-react";

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "SAR", label: "SAR (﷼)" },
  { value: "AED", label: "AED (د.إ)" },
];

export default function SettingsPage() {
  const { publicKey, disconnectWallet, connectWallet, connectDemoWallet, isDemo } = useWallet();
  const [currency, setCurrency] = useState("USD");
  const [email, setEmail] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <div className="container-main py-8 max-w-3xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
          <p className="text-text-muted text-sm mt-1">
            Manage your account wallet connection, local currency settings, and preferences
          </p>
        </div>

        {/* Wallet Management */}
        <Card className="shadow-sm rounded-2xl">
          <CardHeader className="border-b px-6 py-5">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              Wallet Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {publicKey ? (
              <>
                <div className="flex flex-col gap-2 p-4 rounded-xl bg-muted border">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-text-muted capitalize">
                      {isDemo ? "Demo Sandbox Account" : "Connected Testnet Wallet"}
                    </span>
                    <Badge variant={isDemo ? "secondary" : "success"} className="text-[10px] uppercase font-bold">
                      {isDemo ? "Demo" : "Live"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between gap-3 mt-1">
                    <p className="text-xs font-mono text-text-muted truncate select-all">{publicKey}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={copyAddress}
                      className="h-8 w-8 rounded-lg"
                      title="Copy Address"
                    >
                      {copied ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <Button
                  variant="destructive"
                  onClick={disconnectWallet}
                  className="gap-2 rounded-lg text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Disconnect Wallet
                </Button>
              </>
            ) : (
              <div className="text-center py-8 space-y-4">
                <p className="text-text-muted text-sm">
                  No wallet currently linked to ZakatChain. Choose a connection option:
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <Button onClick={connectWallet} className="gap-2 rounded-lg bg-primary text-white font-bold">
                    <Wallet className="w-4 h-4" />
                    Connect Freighter Wallet
                  </Button>
                  <Button variant="outline" onClick={connectDemoWallet} className="gap-2 rounded-lg font-bold border-border/80">
                    <Shield className="w-4 h-4 text-accent" />
                    Use Demo Sandbox Wallet
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Currency Preference */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Currency className="w-5 h-5" />
              Currency Preference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="max-w-xs">
              <label className="text-sm text-text-muted mb-2 block">
                Display Currency
              </label>
              <Select
                options={CURRENCIES}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <label className="text-sm text-text-muted mb-2 block">
              Email for confirmations (optional)
            </label>
            <div className="flex gap-2 max-w-md">
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button variant="outline">Save</Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5" />
              Appearance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Dark Mode</p>
                <p className="text-xs text-text-muted">
                  Toggle between light and dark themes
                </p>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  darkMode ? "bg-primary" : "bg-muted-foreground/30"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    darkMode ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
