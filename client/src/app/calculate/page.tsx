"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import {
  Calculator,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  DollarSign,
  Save,
  Coins,
  ShieldAlert,
  Info,
} from "lucide-react";

interface AssetCategory {
  id: string;
  label: string;
  enabled: boolean;
  value: string;
  currency: string;
  desc: string;
}

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "SAR", label: "SAR (﷼)" },
  { value: "AED", label: "AED (د.إ)" },
];

const ASSET_TYPES: Omit<AssetCategory, "enabled" | "value" | "currency">[] = [
  { id: "cash", label: "Cash & Bank Balances", desc: "Cash at hand, in bank accounts, or savings" },
  { id: "gold", label: "Gold & Silver", desc: "Value of jewelry, coins, or bullion you own" },
  { id: "stocks", label: "Stocks & Investments", desc: "Current value of shares, mutual funds, or pensions" },
  { id: "crypto", label: "Cryptocurrency", desc: "Value of liquid crypto assets and stablecoins" },
  { id: "business", label: "Business Inventory", desc: "Net value of wholesale goods, cash balance, and stock" },
  { id: "debts_owed", label: "Debts Owed to You", desc: "Money lent to others that you are confident will be repaid" },
];

const NISAB_GOLD_USD = 7225;
const NISAB_SILVER_USD = 650;

export default function CalculatePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [assets, setAssets] = useState<AssetCategory[]>(
    ASSET_TYPES.map((a) => ({ ...a, enabled: false, value: "", currency: "USD" }))
  );
  const [debts, setDebts] = useState("");
  const [debtsCurrency, setDebtsCurrency] = useState("USD");
  const [expenses, setExpenses] = useState("");
  const [expensesCurrency, setExpensesCurrency] = useState("USD");
  const [nisabStandard, setNisabStandard] = useState<"gold" | "silver">("gold");

  const toggleAsset = (id: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  const updateAssetValue = (id: string, value: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, value } : a))
    );
  };

  const updateAssetCurrency = (id: string, currency: string) => {
    setAssets((prev) =>
      prev.map((a) => (a.id === id ? { ...a, currency } : a))
    );
  };

  const totalAssets = assets
    .filter((a) => a.enabled && a.value)
    .reduce((sum, a) => sum + (parseFloat(a.value) || 0), 0);

  const totalLiabilities =
    (parseFloat(debts) || 0) + (parseFloat(expenses) || 0);

  const netWorth = totalAssets - totalLiabilities;
  
  const nisabThreshold = nisabStandard === "gold" ? NISAB_GOLD_USD : NISAB_SILVER_USD;
  const isAboveNisab = netWorth >= nisabThreshold;
  const zakatDue = isAboveNisab && netWorth > 0 ? netWorth * 0.025 : 0;

  const handleSave = () => {
    const calcData = {
      assets,
      debts,
      expenses,
      totalAssets,
      totalLiabilities,
      netWorth,
      zakatDue,
      isAboveNisab,
      nisabStandard,
      date: new Date().toISOString(),
    };
    localStorage.setItem("zakatchain_last_calculation", JSON.stringify(calcData));
    alert("Zakat calculation saved to dashboard!");
  };

  return (
    <div className="container-main py-10">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Step indicator */}
        <div className="flex items-center justify-between gap-3 bg-card border rounded-2xl p-4 shadow-sm">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1 last:flex-initial">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm font-extrabold transition-colors ${
                  s === step
                    ? "bg-primary text-white shadow-md ring-2 ring-primary-light"
                    : s < step
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "bg-muted text-text-muted border"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-5 h-5 text-primary" /> : s}
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-[10px] text-text-muted block leading-none font-bold uppercase tracking-wider">Step 0{s}</span>
                <span className="text-xs font-extrabold text-text-main">
                  {s === 1 ? "Assets" : s === 2 ? "Liabilities" : s === 3 ? "Nisab Check" : "Result"}
                </span>
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-0.5 ml-2 hidden sm:block ${
                    s < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center sm:text-left space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight">Zakat Calculator</h1>
          <p className="text-text-muted text-sm font-medium">
            Shariah-compliant calculator with instant local Nisab valuation
          </p>
        </div>

        {/* Step 1: Assets */}
        {step === 1 && (
          <Card className="shadow-md rounded-2xl border">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Coins className="w-5 h-5 text-primary" />
                Select & Enter Assets
              </CardTitle>
              <CardDescription>
                Select all categories of wealth that you have held for a full lunar year (Hawl).
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`p-4 rounded-2xl border-2 transition-all ${
                    asset.enabled
                      ? "border-primary bg-primary-light/10 dark:bg-primary-light/5 shadow-sm"
                      : "border-border/60 hover:border-border hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <label className="flex items-start gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={asset.enabled}
                        onChange={() => toggleAsset(asset.id)}
                        className="w-4 h-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                      />
                      <div className="space-y-0.5">
                        <span className="text-sm font-bold text-text-main block">{asset.label}</span>
                        <span className="text-xs text-text-muted block leading-snug">{asset.desc}</span>
                      </div>
                    </label>
                    <Badge
                      variant={asset.enabled ? "default" : "secondary"}
                      className={`text-[10px] font-bold uppercase ${
                        asset.enabled ? "bg-primary text-white" : ""
                      }`}
                    >
                      {asset.enabled ? "Active" : "Excluded"}
                    </Badge>
                  </div>
                  {asset.enabled && (
                    <div className="flex gap-2 pl-7 mt-3">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                        <Input
                          type="number"
                          placeholder="Enter valuation"
                          value={asset.value}
                          onChange={(e) =>
                            updateAssetValue(asset.id, e.target.value)
                          }
                          min="0"
                          step="0.01"
                          className="pl-9 rounded-xl border border-input focus:ring-primary"
                        />
                      </div>
                      <Select
                        options={CURRENCIES}
                        value={asset.currency}
                        onChange={(e) =>
                          updateAssetCurrency(asset.id, e.target.value)
                        }
                        className="w-28 rounded-xl"
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4 border-t flex justify-between items-center text-sm">
                <span className="text-text-muted font-semibold">Total Assets Value</span>
                <span className="font-black text-lg text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(totalAssets)}
                </span>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 justify-between bg-muted/20 rounded-b-2xl">
              <Button variant="ghost" onClick={() => router.push("/dashboard")} className="rounded-lg">
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} className="gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white">
                Next: Liabilities
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Liabilities */}
        {step === 2 && (
          <Card className="shadow-md rounded-2xl border">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-accent" />
                Deduct Permissible Liabilities
              </CardTitle>
              <CardDescription>
                Deduct debts, outstanding loans, or household expenses due immediately.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                  Debts & Outstanding Loans
                  <span className="text-[10px] text-text-muted font-normal">(due short-term)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input
                      type="number"
                      placeholder="Enter outstanding loans"
                      value={debts}
                      onChange={(e) => setDebts(e.target.value)}
                      min="0"
                      step="0.01"
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <Select
                    options={CURRENCIES}
                    value={debtsCurrency}
                    onChange={(e) => setDebtsCurrency(e.target.value)}
                    className="w-28 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-text-main flex items-center gap-1.5">
                  Monthly Expenses
                  <span className="text-[10px] text-text-muted font-normal">(rent, utilities, immediate living needs)</span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input
                      type="number"
                      placeholder="Enter expenses"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                      min="0"
                      step="0.01"
                      className="pl-9 rounded-xl"
                    />
                  </div>
                  <Select
                    options={CURRENCIES}
                    value={expensesCurrency}
                    onChange={(e) => setExpensesCurrency(e.target.value)}
                    className="w-28 rounded-xl"
                  />
                </div>
              </div>

              <div className="pt-6 border-t space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-semibold">Total Cumulative Assets</span>
                  <span className="font-bold text-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalAssets)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted font-semibold">Deductible Liabilities</span>
                  <span className="font-bold text-destructive">
                    -
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalLiabilities)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-black pt-3 border-t">
                  <span>Net Zakatable Worth</span>
                  <span className={netWorth >= 0 ? "text-primary text-lg" : "text-destructive text-lg"}>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(netWorth)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 justify-between bg-muted/20 rounded-b-2xl">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white">
                Check Nisab
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Nisab Check */}
        {step === 3 && (
          <Card className="shadow-md rounded-2xl border">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Info className="w-5 h-5 text-accent" />
                Nisab Threshold Calculation
              </CardTitle>
              <CardDescription>
                Choose between the gold or silver standard to check Zakat eligibility.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              {/* Standard Selector */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setNisabStandard("gold")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    nisabStandard === "gold"
                      ? "border-primary bg-primary-light/10 dark:bg-primary-light/5"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase text-primary block tracking-wider">Gold Nisab</span>
                  <span className="text-xl font-black text-text-main block mt-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(NISAB_GOLD_USD)}
                  </span>
                  <span className="text-xs text-text-muted mt-1 block">Based on ~85g gold</span>
                </button>

                <button
                  onClick={() => setNisabStandard("silver")}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${
                    nisabStandard === "silver"
                      ? "border-primary bg-primary-light/10 dark:bg-primary-light/5"
                      : "border-border hover:bg-muted/40"
                  }`}
                >
                  <span className="text-xs font-extrabold uppercase text-primary block tracking-wider">Silver Nisab</span>
                  <span className="text-xl font-black text-text-main block mt-1">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(NISAB_SILVER_USD)}
                  </span>
                  <span className="text-xs text-text-muted mt-1 block">Based on ~595g silver</span>
                </button>
              </div>

              {/* Status banner */}
              <div
                className={`p-6 rounded-2xl flex flex-col sm:flex-row items-center sm:items-start gap-4 border ${
                  isAboveNisab
                    ? "bg-emerald-500/5 dark:bg-emerald-950/20 border-emerald-500/20 text-emerald-800 dark:text-emerald-400"
                    : "bg-amber-500/5 dark:bg-amber-950/20 border-amber-500/20 text-amber-800 dark:text-amber-400"
                }`}
              >
                {isAboveNisab ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 dark:text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                )}
                <div className="space-y-1 text-center sm:text-left">
                  <p className="font-extrabold text-base">
                    {isAboveNisab
                      ? "You exceed the Nisab limit"
                      : "Zakat is not due on your wealth"}
                  </p>
                  <p className="text-xs leading-relaxed opacity-90">
                    {isAboveNisab
                      ? `Your net worth of ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(netWorth)} is above the Nisab limit of ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(nisabThreshold)} using the ${nisabStandard} standard. You are obligated to pay 2.5%.`
                      : `Your net worth of ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(netWorth)} is below the Nisab threshold of ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(nisabThreshold)}. You are encouraged to distribute voluntary charity (Sadaqah) instead.`}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4 justify-between bg-muted/20 rounded-b-2xl">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2 rounded-lg">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!isAboveNisab}
                className="gap-2 rounded-lg bg-primary hover:bg-primary-hover text-white shadow-sm"
              >
                Show Zakat Calculation
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <Card className="shadow-md rounded-2xl border">
            <CardHeader className="border-b px-6 py-5">
              <CardTitle className="text-xl font-bold flex items-center gap-2">
                <Calculator className="w-5 h-5 text-primary" />
                Zakat Assessment Receipt
              </CardTitle>
              <CardDescription>
                Summary of your calculation. You can save this calculation and proceed to distribution.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              
              <div className="text-center py-8 bg-muted/30 dark:bg-muted/10 border border-dashed rounded-2xl">
                <p className="text-xs text-text-muted font-bold tracking-wider uppercase mb-1">
                  Your Required Zakat (2.5%)
                </p>
                <p className="text-5xl font-black text-primary tracking-tight">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(zakatDue)}
                </p>
                <p className="text-xs text-text-muted mt-3">
                  Based on net worth of{" "}
                  <span className="font-bold text-text-main">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(netWorth)}
                  </span>
                </p>
              </div>

              <div className="space-y-3 text-sm p-4 rounded-xl border bg-card">
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Cumulative Assets</span>
                  <span className="font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalAssets)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted font-medium">Liabilities Deductions</span>
                  <span className="font-bold text-destructive">
                    -
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalLiabilities)}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5 border-t">
                  <span className="text-text-muted font-medium">Net Zakatable Worth</span>
                  <span className="font-bold text-text-main">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(netWorth)}
                  </span>
                </div>
                <div className="flex justify-between pt-2.5 border-t font-black text-primary">
                  <span>Final Zakat Due (2.5%)</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(zakatDue)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-5 flex-col sm:flex-row gap-3 bg-muted/20 rounded-b-2xl">
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2 rounded-lg"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Save to Dashboard
              </Button>
              <Button
                className="w-full sm:w-auto gap-2 rounded-lg bg-accent hover:bg-accent-hover text-white ml-auto"
                onClick={() =>
                  router.push(
                    `/distribute?amount=${zakatDue.toFixed(2)}&netWorth=${netWorth.toFixed(2)}`
                  )
                }
              >
                <DollarSign className="w-4 h-4" />
                Proceed to Distribution
              </Button>
              <Button
                variant="ghost"
                className="w-full sm:w-auto rounded-lg text-xs"
                onClick={() => setStep(1)}
              >
                Recalculate
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
}
