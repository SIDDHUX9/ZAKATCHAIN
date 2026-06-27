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
  const { publicKey } = useWallet();
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
      const txHash = "tx_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

      await recordDistribution(
        publicKey,
        BigInt(Math.round(totalAmount * 100)), // i128 in smallest unit
        cats,
        txHash
      );

      setTxHash(txHash);
      setShowPreview(false);
      setShowSuccess(true);
    } catch (err) {
      alert("Transaction failed: " + (err instanceof Error ? err.message : "Unknown error"));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="container-main py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold tracking-tight mb-2">Distribute Zakat</h1>
        <p className="text-text-muted text-sm mb-8">
          Allocate your Zakat across the eight eligible categories
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Total Zakat Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  placeholder="Enter amount in USD"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="0.01"
                />
              </div>
              <Badge variant="secondary" className="flex items-center px-4">
                USD
              </Badge>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 mb-6">
          <Button
            variant={mode === "equal" ? "default" : "outline"}
            onClick={() => setMode("equal")}
            size="sm"
          >
            Equal Split (12.5% each)
          </Button>
          <Button
            variant={mode === "custom" ? "default" : "outline"}
            onClick={() => setMode("custom")}
            size="sm"
          >
            Custom Split
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const pct = mode === "equal" ? DEFAULT_PERCENTAGE : (percentages[cat.id] || 0);
            const catAmount = totalAmount * (pct / 100);
            return (
              <Card key={cat.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold">{cat.label}</h3>
                      <p className="text-xs text-text-muted">{cat.desc}</p>
                    </div>
                  </div>
                  {mode === "custom" && (
                    <div className="mt-4 flex items-center gap-2">
                      <Input
                        type="number"
                        placeholder="%"
                        value={percentages[cat.id] || ""}
                        onChange={(e) =>
                          setCategoryPercentage(cat.id, parseFloat(e.target.value) || 0)
                        }
                        min="0"
                        max="100"
                        className="w-20 text-center"
                      />
                      <span className="text-sm text-text-muted">%</span>
                      <span className="text-sm font-semibold ml-auto">
                        ${catAmount.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {mode === "equal" && (
                    <div className="mt-3 flex justify-between text-sm">
                      <span className="text-text-muted">{DEFAULT_PERCENTAGE}%</span>
                      <span className="font-semibold">${catAmount.toFixed(2)}</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mb-8">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-muted">Total Distribution</p>
                <p className="text-xl font-bold">${totalAmount.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-text-muted">Allocated</p>
                <p className="text-xl font-bold">{totalPercentage.toFixed(1)}%</p>
              </div>
            </div>
            {mode === "custom" && Math.abs(totalPercentage - 100) > 0.01 && (
              <div className="mt-3 p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
                Total percentage is {totalPercentage.toFixed(1)}%. Please adjust to reach 100%.
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => router.push("/calculate")}>
            Back to Calculator
          </Button>
          <Button
            onClick={() => setShowPreview(true)}
            disabled={totalAmount <= 0 || (mode === "custom" && Math.abs(totalPercentage - 100) > 0.01)}
            className="gap-2"
          >
            Preview Distribution
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogHeader>
          <DialogTitle>Distribution Preview</DialogTitle>
          <DialogDescription>
            Review your Zakat distribution across all categories
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {distribution
            .filter((d) => d.amount > 0)
            .map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{d.label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">${d.amount.toFixed(2)}</p>
                    <p className="text-xs text-text-muted">{d.percentage.toFixed(1)}%</p>
                  </div>
                </div>
              );
            })}
        </div>
        <div className="flex justify-between pt-4 border-t mt-4">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-primary">${totalAmount.toFixed(2)}</span>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowPreview(false)}>Adjust</Button>
          <Button onClick={handleConfirm} disabled={isSending} className="gap-2">
            <Send className="w-4 h-4" />
            {isSending ? "Sending..." : "Confirm & Send"}
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-emerald-600">
            <CheckCircle2 className="w-6 h-6" />
            Distribution Successful
          </DialogTitle>
          <DialogDescription>
            Your Zakat has been distributed on the Stellar network.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200">
            <p className="text-sm text-text-muted mb-1">Amount Distributed</p>
            <p className="text-2xl font-bold text-emerald-700">${totalAmount.toFixed(2)}</p>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Transaction Hash</p>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-muted">
              <code className="text-xs flex-1 break-all">{txHash}</code>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => { setShowSuccess(false); router.push("/history"); }}>
            View History
          </Button>
          <Button onClick={() => { setShowSuccess(false); router.push("/dashboard"); }}>
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
