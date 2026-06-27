"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, DollarSign, TrendingUp } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
}

function SummaryCard({ title, value, subtitle, icon: Icon }: SummaryCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-text-muted">{title}</p>
            <p className="text-2xl font-bold tracking-tight">{value}</p>
            {subtitle && (
              <p className="text-xs text-text-muted">{subtitle}</p>
            )}
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
            <Icon className="w-5 h-5 text-primary" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

const BASE_PLATFORM_TOTAL = 4250000; // $42,500 in cents

export default function DashboardSummary() {
  const { publicKey } = useWallet();
  const [donorTotal, setDonorTotal] = useState<string>("$0");
  const [platformTotal, setPlatformTotal] = useState<string>("$42,500");

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
      const list = savedTxList ? JSON.parse(savedTxList) : [];

      const userSum = list.reduce((acc: number, item: any) => acc + Number(item.amount), 0);
      setDonorTotal(
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
          .format(userSum / 100)
      );

      const platformCents = BASE_PLATFORM_TOTAL + userSum;
      setPlatformTotal(
        new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })
          .format(platformCents / 100)
      );
    } catch {
      // Keep defaults
    }
  }, [publicKey]);

  const cards = [
    {
      title: "Your Total Given",
      value: donorTotal,
      subtitle: publicKey ? `Wallet: ${publicKey.slice(0, 8)}...` : "Connect wallet to see",
      icon: Wallet,
    },
    {
      title: "Platform Distributed",
      value: platformTotal,
      subtitle: "Total Zakat distributed via ZakatChain",
      icon: TrendingUp,
    },
    {
      title: "Your Giving",
      value: donorTotal,
      subtitle: publicKey ? "Your total distributions" : "Connect wallet to see",
      icon: DollarSign,
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {cards.map((card) => (
        <SummaryCard key={card.title} {...card} />
      ))}
    </div>
  );
}
