"use client";

import { Suspense, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useWallet } from "@/context/WalletContext";
import { useContract } from "@/hooks/contract";
import { cn } from "@/lib/utils";
import {
  Send,
  Users,
  Heart,
  Briefcase,
  Handshake,
  Shield,
  Scale,
  Globe,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  DollarSign,
  AlertCircle,
} from "lucide-react";

const CATEGORIES = [
  { id: "poor", label: "The Poor", icon: Heart, desc: "Those in need" },
  { id: "needy", label: "The Needy", icon: Users, desc: "Those in difficulty" },
  { id: "administrators", label: "Zakat Administrators", icon: Briefcase, desc: "Those who collect & distribute" },
  { id: "reconciled", label: "Those Whose Hearts Are to Be Reconciled", icon: Handshake, desc: "New Muslims & allies" },
  { id: "captives", label: "Freeing Captives", icon: Shield, desc: "Freeing slaves & captives" },
  { id: "debt_ridden", label: "The Debt-Ridden", icon: Scale, desc: "Those overwhelmed by debt" },
  { id: "cause_of_allah", label: "In the Cause of Allah", icon: Globe, desc: "For the public good" },
  { id: "wayfarers", label: "Wayfarers", icon: Send, desc: "Travelers in need" },
];

const DEFAULT_PERCENTAGE = 12.5;

function DistributeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { publicKey, isDemo } = useWallet();
  const { recordDistribution } = useContract();

  const amountParam = searchParams.get("amount");
  const defaultAmount = amountParam ? parseFloat(amountParam) : 0;

  const [amount, setAmount] = useState(defaultAmount.toString());
  const [percentages, setPercentages] = useState<Record<string, number>>({});
  const [mode, setMode] = useState<"equal" | "custom">("equal");
  const [showPreview, setShowPreview] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [isSending, setIsSending] = useState(false);

  const totalAmount = parseFloat(amount) || 0;

  const setCategoryPercentage = (id: string, value: number) => {
    setPercentages((prev) => ({ ...prev, [id]: Math.min(100, Math.max(0, value)) }));
  };

  const totalPercentage = useMemo(() => {
    if (mode === "equal") return 100;
    return Object.values(percentages).reduce((sum, v) => sum + v, 0);
  }, [mode, percentages]);

  const distribution = useMemo(() => {
    if (mode === "equal") {
      return CATEGORIES.map((cat) => ({
        ...cat,
        percentage: DEFAULT_PERCENTAGE,
        amount: totalAmount * (DEFAULT_PERCENTAGE / 100),
      }));
    }
    return CATEGORIES.map((cat) => ({
      ...cat,
      percentage: percentages[cat.id] || 0,
      amount: totalAmount * ((percentages[cat.id] || 0) / 100),
    }));
  }, [mode, percentages, totalAmount]);

  const handleConfirm = async () => {
    if (!publicKey) {
      alert("Please connect your wallet first.");
      return;
    }
    setIsSending(true);
    try {
      const cats = distribution
        .filter((d) => d.amount > 0)
        .map((d) => d.label)
        .join(", ");
      const txHashStr = "tx_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

      await recordDistribution(
        publicKey,
        BigInt(Math.round(totalAmount * 100)), // i128 in smallest unit (cents)
        cats,
        txHashStr
      );

      setTxHash(txHashStr);
      setShowPreview(false);
      setShowSuccess(true);
    } catch (err) {
      alert("Transaction failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSending(false);
    }
  };

  const CATEGORY_COLORS = [
    "bg-teal-600 dark:bg-teal-500",
    "bg-emerald-500 dark:bg-emerald-400",
    "bg-amber-500 dark:bg-amber-400",
    "bg-cyan-500 dark:bg-cyan-400",
    "bg-indigo-500 dark:bg-indigo-400",
    "bg-purple-500 dark:bg-purple-400",
    "bg-pink-500 dark:bg-pink-400",
    "bg-rose-500 dark:bg-rose-400",
  ];

  return (
    <div className="container-main py-10 max-w-5xl">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Distribute Zakat</h1>
          <p className="text-text-muted text-sm mt-1">
            Allocate your Zakat funds across the eight Shariah-mandated categories (Asnaf)
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-sm rounded-2xl">
              <CardHeader className="border-b px-6 py-5">
                <CardTitle className="text-base font-bold">Zakat Split Strategy</CardTitle>
                <div className="flex gap-2 mt-3">
                  <Button
                    variant={mode === "equal" ? "default" : "outline"}
                    onClick={() => setMode("equal")}
                    size="sm"
                    className="rounded-lg text-xs font-bold"
                  >
                    Equal Split (12.5% each)
                  </Button>
                  <Button
                    variant={mode === "custom" ? "default" : "outline"}
                    onClick={() => setMode("custom")}
                    size="sm"
                    className="rounded-lg text-xs font-bold"
                  >
                    Custom Allocation
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {CATEGORIES.map((cat, idx) => {
                    const Icon = cat.icon;
                    const pct = mode === "equal" ? DEFAULT_PERCENTAGE : (percentages[cat.id] || 0);
                    const catAmount = totalAmount * (pct / 100);
                    return (
                      <div
                        key={cat.id}
                        className={cn(
                          "p-4 rounded-xl border transition-all flex flex-col justify-between h-36 bg-card",
                          pct > 0 ? "border-primary/40 bg-primary-light/5" : "border-border/60 hover:border-border"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg bg-primary-light dark:bg-primary-light/10 flex items-center justify-center flex-shrink-0 text-primary">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-text-main truncate">{cat.label}</h3>
                            <p className="text-[10px] text-text-muted leading-tight mt-0.5">{cat.desc}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-end justify-between gap-2 mt-4 pt-3 border-t border-border/30">
                          {mode === "custom" ? (
                            <div className="flex items-center gap-1.5">
                              <Input
                                type="number"
                                placeholder="0"
                                value={percentages[cat.id] || ""}
                                onChange={(e) =>
                                  setCategoryPercentage(cat.id, parseFloat(e.target.value) || 0)
                                }
                                min="0"
                                max="100"
                                className="w-14 h-8 px-2 text-center rounded-lg text-xs font-bold"
                              />
                              <span className="text-xs text-text-muted font-bold">%</span>
                            </div>
                          ) : (
                            <span className="text-xs font-bold text-text-muted">{DEFAULT_PERCENTAGE}%</span>
                          )}
                          <span className="text-sm font-extrabold text-primary">
                            ${catAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Summary Column */}
          <div className="space-y-6">
            <Card className="shadow-sm rounded-2xl sticky top-20 border">
              <CardHeader className="border-b px-6 py-5">
                <CardTitle className="text-base font-bold">Distribution Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div>
                  <label className="text-xs font-bold text-text-muted block uppercase tracking-wider mb-2">Total Amount to Distribute</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input
                      type="number"
                      placeholder="Amount in USD"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      min="0"
                      step="0.01"
                      className="pl-9 rounded-xl font-bold border-2 border-primary/20 focus:border-primary"
                    />
                  </div>
                </div>

                {/* Split segment bar */}
                <div>
                  <span className="text-xs font-bold text-text-muted block uppercase tracking-wider mb-2">Split Breakdown</span>
                  <div className="w-full h-3.5 rounded-full bg-muted border overflow-hidden flex shadow-inner">
                    {distribution
                      .filter((d) => d.percentage > 0)
                      .map((d, i) => (
                        <div
                          key={d.id}
                          className={`${CATEGORY_COLORS[i % CATEGORY_COLORS.length]} h-full transition-all duration-300`}
                          style={{ width: `${d.percentage}%` }}
                          title={`${d.label}: ${d.percentage.toFixed(1)}%`}
                        />
                      ))}
                  </div>
                  {mode === "custom" && (
                    <div className="flex justify-between items-center text-xs mt-2 font-bold">
                      <span className="text-text-muted">Total Allocated</span>
                      <span className={Math.abs(totalPercentage - 100) < 0.01 ? "text-primary font-black" : "text-destructive font-black"}>
                        {totalPercentage.toFixed(1)}% / 100%
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 border-t pt-4 text-sm font-semibold">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Total Funds</span>
                    <span className="font-extrabold">${totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Connected Account</span>
                    <span className="text-xs font-mono max-w-[120px] truncate" title={publicKey || ""}>
                      {publicKey ? `${publicKey.slice(0, 6)}...${publicKey.slice(-4)}` : "None"}
                    </span>
                  </div>
                </div>

                {mode === "custom" && Math.abs(totalPercentage - 100) > 0.01 && (
                  <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-600 flex items-start gap-2 leading-relaxed">
                    <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>Please adjust the slider percentages to total exactly 100% in order to distribute.</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4 bg-muted/20 rounded-b-2xl flex flex-col gap-2">
                <Button
                  onClick={() => setShowPreview(true)}
                  disabled={totalAmount <= 0 || (mode === "custom" && Math.abs(totalPercentage - 100) > 0.01)}
                  className="w-full gap-2 rounded-xl bg-primary hover:bg-primary-hover text-white py-6 text-sm font-bold shadow-md transform hover:-translate-y-0.5 transition-all"
                >
                  Preview & Confirm
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => router.push("/calculate")}
                  className="w-full text-xs"
                >
                  Recalculate Wealth
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>

      {/* Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Confirm Zakat Distribution</DialogTitle>
          <DialogDescription className="text-sm">
            Review the breakdown. Fulfilling your Zakat splits directly on-chain.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 max-h-80 overflow-y-auto py-2 pr-1">
          {distribution
            .filter((d) => d.amount > 0)
            .map((d, i) => {
              const Icon = d.icon;
              return (
                <div key={d.id} className="flex items-center justify-between p-3.5 rounded-xl border bg-card shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-white", CATEGORY_COLORS[i % CATEGORY_COLORS.length].split(" ")[0])}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-text-main">{d.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-extrabold text-primary">${d.amount.toFixed(2)}</p>
                    <p className="text-xs text-text-muted font-bold">{d.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
        </div>

        <div className="flex justify-between items-center pt-4 border-t mt-4 font-black">
          <span className="text-text-main">Total Zakat Flipped</span>
          <span className="text-xl text-primary">${totalAmount.toFixed(2)}</span>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => setShowPreview(false)} className="rounded-lg">Adjust</Button>
          <Button onClick={handleConfirm} disabled={isSending} className="gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white shadow-md">
            <Send className="w-4 h-4" />
            {isSending ? "Authorizing..." : "Confirm & Send"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600 font-extrabold text-xl">
            <CheckCircle2 className="w-6 h-6" />
            Distribution Successful
          </DialogTitle>
          <DialogDescription className="text-sm">
            Your Zakat has been securely logged on the Stellar network.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-1">Amount Distributed</p>
            <p className="text-3xl font-black text-emerald-600">${totalAmount.toFixed(2)}</p>
          </div>

          <div className="space-y-2">
            <p className="text-xs font-bold text-text-muted uppercase tracking-wider">Transaction Status</p>
            <div className="flex items-center gap-2 p-3.5 rounded-xl bg-muted border">
              <code className="text-xs flex-1 break-all font-mono text-text-main">{txHash}</code>
              {isDemo ? (
                <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">Demo Sandbox</span>
              ) : (
                <a
                  href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-lg hover:bg-primary/10 text-primary transition-colors"
                  title="View Stellar Expert"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={() => { setShowSuccess(false); router.push("/history"); }} className="rounded-lg">
            View History
          </Button>
          <Button onClick={() => { setShowSuccess(false); router.push("/dashboard"); }} className="rounded-lg bg-primary hover:bg-primary-hover text-white">
            Go to Dashboard
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}

export default function DistributePage() {
  return (
    <Suspense fallback={
      <div className="container-main py-8">
        <div className="max-w-4xl mx-auto text-center py-20">
          <p className="text-text-muted">Loading...</p>
        </div>
      </div>
    }>
      <DistributeContent />
    </Suspense>
  );
}
