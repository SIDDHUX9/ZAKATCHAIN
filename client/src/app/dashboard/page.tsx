"use client";

import { useEffect, useState } from "react";
import DashboardSummary from "@/components/DashboardSummary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw, Calculator, DollarSign, Gift } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useRouter } from "next/navigation";

const initialBeneficiaries = [
  { name: "Alleviate Poverty Fund", location: "Global Relief", category: "The Poor" },
  { name: "Education for All", location: "Southeast Asia", category: "Wayfarers" },
  { name: "Debt Relief Initiative", location: "Middle East", category: "The Debt-Ridden" },
];

export default function DashboardPage() {
  const { publicKey, isDemo } = useWallet();
  const router = useRouter();
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const [lastCalc, setLastCalc] = useState<any>(null);

  const loadDashboardData = () => {
    // Load last calculation
    const calcData = localStorage.getItem("zakatchain_last_calculation");
    if (calcData) {
      try {
        setLastCalc(JSON.parse(calcData));
      } catch {
        // Silent fail
      }
    }

    // Load local distributions
    const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
    let list = savedTxList ? JSON.parse(savedTxList) : [];

    // Map format
    const mappedList = list.map((item: any) => ({
      date: item.date,
      type: "Zakat Distribution",
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(item.amount) / 100),
      status: item.status,
      txHash: item.txHash,
    }));

    // Add calculations to activity list if any
    if (calcData) {
      try {
        const parsedCalc = JSON.parse(calcData);
        mappedList.push({
          date: parsedCalc.date.split("T")[0],
          type: "Zakat Calculation",
          amount: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(parsedCalc.zakatDue),
          status: "success",
          txHash: null,
        });
      } catch {}
    }

    // Sort by date desc
    mappedList.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivity(mappedList.slice(0, 5));
  };

  useEffect(() => {
    loadDashboardData();
  }, [publicKey, isDemo]);

  return (
    <div className="p-6 lg:p-8 space-y-8 max-w-7xl mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">
            Overview of your Shariah-compliant Zakat metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadDashboardData} className="gap-2 rounded-lg">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Button size="sm" onClick={() => router.push("/calculate")} className="gap-2 rounded-lg bg-primary text-white">
            <Calculator className="w-4 h-4" />
            Calculate Zakat
          </Button>
        </div>
      </div>

      <DashboardSummary />

      {/* Quick Nisab & Calc Check */}
      {lastCalc && (
        <Card className="bg-gradient-to-r from-primary-light/40 to-teal-50 dark:from-teal-950/20 dark:to-slate-900 border border-primary/20 rounded-2xl shadow-sm">
          <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1">
              <span className="text-xs font-bold text-primary tracking-wider uppercase">Saved Calculation Status</span>
              <h2 className="text-xl font-bold">
                Your Zakat Due:{" "}
                <span className="text-primary font-black text-2xl">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(lastCalc.zakatDue)}
                </span>
              </h2>
              <p className="text-xs text-text-muted">
                Calculated on {new Date(lastCalc.date).toLocaleDateString()} • Nisab threshold of $7,225 (Gold standard) met
              </p>
            </div>
            {lastCalc.zakatDue > 0 && (
              <Button
                onClick={() => router.push(`/distribute?amount=${lastCalc.zakatDue}`)}
                className="gap-2 rounded-xl bg-accent text-white hover:bg-accent-hover w-full md:w-auto shadow-md"
              >
                <DollarSign className="w-4 h-4" />
                Distribute Now
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 shadow-sm rounded-2xl">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Gift className="w-4 h-4 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {recentActivity.length === 0 ? (
              <div className="text-center py-12 space-y-3">
                <p className="text-sm text-text-muted">
                  No recent activity found. Connect your wallet and make your first calculation or distribution!
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-4 first:pt-0 last:pb-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-text-main">{activity.type}</p>
                      <p className="text-xs text-text-muted">{activity.date}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right space-y-1">
                        <p className="text-sm font-extrabold text-primary">{activity.amount}</p>
                        <Badge
                          variant={activity.status === "success" ? "success" : "warning"}
                          className="text-[10px] uppercase font-extrabold tracking-wider py-0.5 px-2 rounded-full"
                        >
                          {activity.status}
                        </Badge>
                      </div>
                      {activity.txHash && (
                        <a
                          href={isDemo ? "#" : `https://stellar.expert/explorer/testnet/tx/${activity.txHash}`}
                          target={isDemo ? undefined : "_blank"}
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg border text-text-muted hover:text-primary hover:border-primary transition-all bg-card"
                          title="View Explorer"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribution Map / Beneficiaries */}
        <Card className="shadow-sm rounded-2xl">
          <CardHeader className="border-b px-6 py-4">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Gift className="w-4 h-4 text-accent" />
              Eligible Beneficiaries
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {initialBeneficiaries.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl border bg-card/50 hover:bg-card transition-colors shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary-light dark:bg-primary-light/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-primary font-black text-sm">
                      {b.category[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-text-main truncate">{b.name}</p>
                    <p className="text-xs text-text-muted truncate">{b.location}</p>
                  </div>
                  <Badge variant="secondary" className="text-[10px] font-bold rounded-full">
                    {b.category}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
