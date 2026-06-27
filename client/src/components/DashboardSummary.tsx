"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Wallet, DollarSign, TrendingUp } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface SummaryCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ElementType;
  trend?: "up" | "down" | "neutral";
}

function SummaryCard({ title, value, subtitle, icon: Icon, trend }: SummaryCardProps) {
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

export default function DashboardSummary() {
  const { publicKey } = useWallet();

  const cards = [
    {
      title: "Total Wealth",
      value: "$--",
      subtitle: "Connected: " + (publicKey ? publicKey.slice(0, 8) + "..." : "N/A"),
      icon: Wallet,
    },
    {
      title: "Zakat Due",
      value: "$--",
      subtitle: "2.5% of eligible assets",
      icon: DollarSign,
    },
    {
      title: "Distributed This Year",
      value: "$--",
      subtitle: "No distributions yet",
      icon: TrendingUp,
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
