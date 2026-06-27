"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, DollarSign, TrendingUp } from "lucide-react";
import { useWallet } from "@/context/WalletContext";
import { useContract } from "@/hooks/contract";

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

export default function DashboardSummary() {
  const { publicKey } = useWallet();
  const { getDonorTotal, getTotalDistributed } = useContract();
  const [donorTotal, setDonorTotal] = useState<string>("--");
  const [platformTotal, setPlatformTotal] = useState<string>("--");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        if (publicKey) {
          const total = await getDonorTotal(publicKey);
          setDonorTotal(
            new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(Number(total) / 100) // Divide by 100 since contract stores cents
          );
        } else {
          setDonorTotal("$0");
        }
        const distributed = await getTotalDistributed();
        setPlatformTotal(
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Number(distributed) / 100) // Divide by 100 since contract stores cents
        );
      } catch {
        // Silent fail — show "--" if data can't be fetched
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [publicKey, getDonorTotal, getTotalDistributed]);

  const cards = [
    {
      title: "Total Wealth",
      value: loading ? "..." : donorTotal,
      subtitle: publicKey ? `Wallet: ${publicKey.slice(0, 8)}...` : "Connect wallet to see",
      icon: Wallet,
    },
    {
      title: "Platform Distributed",
      value: loading ? "..." : platformTotal,
      subtitle: "Total Zakat distributed via ZakatChain",
      icon: TrendingUp,
    },
    {
      title: "Your Giving",
      value: loading ? "..." : donorTotal,
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
