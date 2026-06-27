"use client";

import { useEffect, useState } from "react";
import { Coins, Users, Heart } from "lucide-react";

interface Stats {
  totalDistributed: string;
  activeDonors: string;
  beneficiaries: string;
}

export default function StatsRow() {
  const [stats] = useState<Stats>({
    totalDistributed: "124,850",
    activeDonors: "2,347",
    beneficiaries: "8,912",
  });

  const items = [
    {
      icon: Coins,
      label: "Total Distributed",
      value: `$${stats.totalDistributed}`,
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
              <div
                key={item.label}
                className="text-center p-6 rounded-xl"
              >
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
