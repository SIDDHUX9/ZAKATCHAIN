"use client";

import { useEffect, useState } from "react";
import { Coins, Users, Heart } from "lucide-react";
import { useContract } from "@/hooks/contract";

interface Stats {
  totalDistributed: string;
  activeDonors: string;
  beneficiaries: string;
}

export default function StatsRow() {
  const { getPlatformStats } = useContract();
  const [stats, setStats] = useState<Stats>({
    totalDistributed: "...",
    activeDonors: "...",
    beneficiaries: "...",
  });

  useEffect(() => {
    async function fetchStats() {
      try {
        const platformStats = await getPlatformStats();

        setStats({
          totalDistributed: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(Number(platformStats.totalDistributed) / 100), // Dividing by 100 for cents conversion
          activeDonors: Number(platformStats.donorCount).toLocaleString(),
          beneficiaries: Number(platformStats.beneficiaryCount).toLocaleString(),
        });
      } catch {
        setStats({
          totalDistributed: "$--",
          activeDonors: "--",
          beneficiaries: "--",
        });
      }
    }
    fetchStats();
  }, [getPlatformStats]);

  const items = [
    {
      icon: Coins,
      label: "Total Distributed",
      value: stats.totalDistributed,
    },
    {
      icon: Users,
      label: "Active Donors",
      value: stats.activeDonors,
    },
    {
      icon: Heart,
      label: "Beneficiaries Helped",
      value: stats.beneficiaries,
    },
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
