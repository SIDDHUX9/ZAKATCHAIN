"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
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
} from "lucide-react";

interface AssetCategory {
  id: string;
  label: string;
  enabled: boolean;
  value: string;
  currency: string;
}

const CURRENCIES = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "SAR", label: "SAR (﷼)" },
  { value: "AED", label: "AED (د.إ)" },
];

const ASSET_TYPES: Omit<AssetCategory, "enabled" | "value" | "currency">[] = [
  { id: "cash", label: "Cash & Bank" },
  { id: "gold", label: "Gold & Silver" },
  { id: "stocks", label: "Stocks & Shares" },
  { id: "crypto", label: "Cryptocurrency" },
  { id: "business", label: "Business Inventory" },
  { id: "debts_owed", label: "Debts Owed to You" },
];

// Gold nisab threshold (~85g gold at ~$85/g as of 2026)
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
  const zakatDue = netWorth > 0 ? netWorth * 0.025 : 0;
  const isAboveNisab = netWorth >= NISAB_GOLD_USD;

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
      date: new Date().toISOString(),
    };
    localStorage.setItem("zakatchain_last_calculation", JSON.stringify(calcData));
    alert("Calculation saved!");
  };

  return (
    <div className="container-main py-8">
      <div className="max-w-3xl mx-auto">
        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-8">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  s <= step
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-text-muted"
                }`}
              >
                {s < step ? <CheckCircle2 className="w-4 h-4" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`flex-1 h-0.5 ${
                    s < step ? "bg-primary" : "bg-muted"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <h1 className="text-2xl font-bold tracking-tight mb-2">
          Zakat Calculator
        </h1>
        <p className="text-text-muted text-sm mb-8">
          Step {step} of 4:{" "}
          {step === 1
            ? "Select your assets"
            : step === 2
            ? "Enter your liabilities"
            : step === 3
            ? "Nisab check"
            : "Your Zakat amount"}
        </p>

        {/* Step 1: Assets */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Select Your Assets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {assets.map((asset) => (
                <div
                  key={asset.id}
                  className={`p-4 rounded-xl border transition-colors ${
                    asset.enabled
                      ? "border-primary bg-primary-light/30"
                      : "hover:border-muted-foreground/30"
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <label className="flex items-center gap-3 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={asset.enabled}
                        onChange={() => toggleAsset(asset.id)}
                        className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">{asset.label}</span>
                    </label>
                    <Badge
                      variant={asset.enabled ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {asset.enabled ? "Selected" : "Off"}
                    </Badge>
                  </div>
                  {asset.enabled && (
                    <div className="flex gap-2 pl-7">
                      <div className="flex-1">
                        <Input
                          type="number"
                          placeholder="Enter amount"
                          value={asset.value}
                          onChange={(e) =>
                            updateAssetValue(asset.id, e.target.value)
                          }
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <Select
                        options={CURRENCIES}
                        value={asset.currency}
                        onChange={(e) =>
                          updateAssetCurrency(asset.id, e.target.value)
                        }
                        className="w-28"
                      />
                    </div>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Total Assets Selected</span>
                  <span className="font-semibold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalAssets)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="ghost" onClick={() => router.push("/dashboard")}>
                Cancel
              </Button>
              <Button onClick={() => setStep(2)} className="gap-2">
                Next: Liabilities
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 2: Liabilities */}
        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Deduct Liabilities</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Debts & Loans
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Enter total debts"
                      value={debts}
                      onChange={(e) => setDebts(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Select
                    options={CURRENCIES}
                    value={debtsCurrency}
                    onChange={(e) => setDebtsCurrency(e.target.value)}
                    className="w-28"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Monthly Expenses Due
                </label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="number"
                      placeholder="Enter expenses"
                      value={expenses}
                      onChange={(e) => setExpenses(e.target.value)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <Select
                    options={CURRENCIES}
                    value={expensesCurrency}
                    onChange={(e) => setExpensesCurrency(e.target.value)}
                    className="w-28"
                  />
                </div>
              </div>
              <div className="pt-4 border-t space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Total Assets</span>
                  <span className="font-semibold text-primary">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalAssets)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Total Liabilities</span>
                  <span className="font-semibold text-destructive">
                    -
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalLiabilities)}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold pt-2 border-t">
                  <span>Net Worth</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(netWorth)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={() => setStep(3)} className="gap-2">
                Check Nisab
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 3: Nisab Check */}
        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Nisab Threshold Check</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-xs text-text-muted mb-1">Gold Nisab</p>
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(NISAB_GOLD_USD)}
                  </p>
                  <p className="text-xs text-text-muted">~85g gold</p>
                </div>
                <div className="p-4 rounded-xl border bg-card">
                  <p className="text-xs text-text-muted mb-1">Silver Nisab</p>
                  <p className="text-lg font-bold">
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(NISAB_SILVER_USD)}
                  </p>
                  <p className="text-xs text-text-muted">~595g silver</p>
                </div>
              </div>

              <div
                className={`p-6 rounded-xl flex items-center gap-4 ${
                  isAboveNisab
                    ? "bg-emerald-50 border border-emerald-200"
                    : "bg-amber-50 border border-amber-200"
                }`}
              >
                {isAboveNisab ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-600 flex-shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-base">
                    {isAboveNisab
                      ? "You are above the Nisab threshold"
                      : "Zakat is not required at this time"}
                  </p>
                  <p className="text-sm text-text-muted mt-1">
                    {isAboveNisab
                      ? `Your net worth of ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(netWorth)} exceeds the Nisab.`
                      : `Your net worth of ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(netWorth)} is below the Nisab threshold of ${new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(NISAB_GOLD_USD)}.`}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="justify-between">
              <Button variant="outline" onClick={() => setStep(2)} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep(4)}
                disabled={!isAboveNisab}
                className="gap-2"
              >
                See Your Zakat
                <ArrowRight className="w-4 h-4" />
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Step 4: Result */}
        {step === 4 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Zakat Amount</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mx-auto mb-4">
                  <Calculator className="w-8 h-8 text-primary" />
                </div>
                <p className="text-sm text-text-muted mb-2">
                  Your Zakat Due (2.5% of net worth)
                </p>
                <p className="text-4xl font-bold text-primary">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(zakatDue)}
                </p>
                <p className="text-xs text-text-muted mt-2">
                  Based on net worth of{" "}
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(netWorth)}
                </p>
              </div>

              <div className="bg-muted p-4 rounded-xl space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Assets</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalAssets)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Total Liabilities</span>
                  <span className="text-destructive">
                    -
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalLiabilities)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold pt-2 border-t">
                  <span>Net Worth</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(netWorth)}
                  </span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t text-primary">
                  <span>Zakat Due (2.5%)</span>
                  <span>
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(zakatDue)}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                className="w-full sm:w-auto gap-2"
                onClick={handleSave}
              >
                <Save className="w-4 h-4" />
                Save Calculation
              </Button>
              <Button
                className="w-full sm:w-auto gap-2"
                onClick={() =>
                  router.push(
                    `/distribute?amount=${zakatDue.toFixed(2)}&netWorth=${netWorth.toFixed(2)}`
                  )
                }
              >
                <DollarSign className="w-4 h-4" />
                Distribute Now
              </Button>
              <Button
                variant="ghost"
                className="w-full sm:w-auto"
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
