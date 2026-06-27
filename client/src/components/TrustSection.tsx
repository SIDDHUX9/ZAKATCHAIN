"use client";

import { Shield, Star, Globe } from "lucide-react";

const badges = [
  {
    icon: Shield,
    title: "Shariah-Compliant",
    description:
      "Built in consultation with Islamic scholars to ensure all calculations and distributions follow Quranic principles.",
  },
  {
    icon: Star,
    title: "Fully Transparent",
    description:
      "Every transaction is recorded on the Stellar blockchain. Verify any distribution publicly.",
  },
  {
    icon: Globe,
    title: "Powered by Stellar",
    description:
      "Built on the Stellar network for fast, low-cost, and secure cross-border transactions.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-20">
      <div className="container-main">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
          Trust &amp; Transparency
        </h2>
        <p className="text-text-muted text-center max-w-xl mx-auto mb-12">
          Built on open, verifiable technology with Islamic finance principles
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {badges.map((badge) => {
            const Icon = badge.icon;
            return (
              <div
                key={badge.title}
                className="p-8 rounded-xl border bg-card shadow-sm"
              >
                <Icon className="w-10 h-10 text-primary mb-4" />
                <h3 className="text-lg font-semibold mb-2">{badge.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {badge.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
