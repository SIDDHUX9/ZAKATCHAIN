"use client";

import { useEffect, useState } from "react";
import { Coins, Users, Heart } from "lucide-react";

interface Stats {
  totalDistributed: string;
  activeDonors: string;
  beneficiaries: string;
}

const BASE_STATS = {
  totalDistributed: 4250000,
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
    {
      icon: Coins,
      label: "Total Distributed",
      value: stats.totalDistributed,
      color: "text-teal-600 dark:text-teal-400",
      bg: "bg-teal-500/8",
    },
    {
      icon: Users,
      label: "Active Donors",
      value: stats.activeDonors,
      color: "text-cyan-600 dark:text-cyan-400",
      bg: "bg-cyan-500/8",
    },
    {
      icon: Heart,
      label: "Beneficiaries Helped",
      value: stats.beneficiaries,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/8",
    },
  ];

  return (
    <section className="py-16 border-y bg-card/50">
      <div className="container-main">
        <div className="grid md:grid-cols-3 gap-6 lg:gap-10">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className={`animate-fade-up delay-${(i + 1) * 100} flex items-center gap-5 p-6 rounded-2xl border bg-card shadow-sm card-hover`}
              >
                <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold tracking-tight">
                    {item.value}
                  </p>
                  <p className="text-xs text-text-muted font-medium mt-0.5">{item.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
