"use client";

import { useEffect, useState } from "react";
import { Coins, Users, Heart } from "lucide-react";

interface Stats {
  totalDistributed: string;
  activeDonors: string;
  beneficiaries: string;
}

// Static base values — augmented by demo transactions from localStorage
const BASE_STATS = {
  totalDistributed: 4250000, // $42,500 in cents
  activeDonors: 12,
  beneficiaries: 88,
};

export default function StatsRow() {
  const [stats, setStats] = useState<Stats>({
    totalDistributed: "$42,500",
    activeDonors: "12",
    beneficiaries: "88",
  });

  useEffect(() => {
    try {
      const savedTxList =
        typeof window !== "undefined"
          ? localStorage.getItem("zakatchain_demo_distributions")
          : null;
      const list = savedTxList ? JSON.parse(savedTxList) : [];
      const extraAmount = list.reduce(
        (acc: number, item: any) => acc + Number(item.amount),
        0
      );
      const totalCents = BASE_STATS.totalDistributed + extraAmount;

      setStats({
        totalDistributed: new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(totalCents / 100),
        activeDonors: (BASE_STATS.activeDonors + (list.length > 0 ? 1 : 0)).toLocaleString(),
        beneficiaries: (BASE_STATS.beneficiaries + list.length).toLocaleString(),
      });
    } catch {
      // Keep defaults
    }
  }, []);

  const items = [
    { icon: Coins, label: "Total Distributed", value: stats.totalDistributed },
    { icon: Users, label: "Active Donors", value: stats.activeDonors },
    { icon: Heart, label: "Beneficiaries Helped", value: stats.beneficiaries },
  ];

  return (
    <section className="py-12 bg-card border-y">
      <div className="container-main">
        <div className="grid md:grid-cols-3 gap-8">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center p-6 rounded-xl">
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <p className="text-3xl font-bold tracking-tight mb-1">
                  {item.value}
                </p>
                <p className="text-sm text-text-muted">{item.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
