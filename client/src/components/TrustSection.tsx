"use client";

import { Shield, Eye, Globe, Zap, Lock, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Shariah-Compliant",
    description:
      "Built in consultation with Islamic scholars. All calculations follow Quranic principles and Fiqh al-Zakat methodology.",
  },
  {
    icon: Eye,
    title: "Fully Transparent",
    description:
      "Every distribution is recorded on-chain. Anyone can verify any transaction publicly on the Stellar explorer.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    description:
      "Stellar's network enables cross-border transfers in seconds. Reach beneficiaries anywhere with near-zero fees.",
  },
  {
    icon: Zap,
    title: "Instant Settlement",
    description:
      "Sub-5-second finality. No waiting days for bank clearance — your Zakat reaches beneficiaries almost immediately.",
  },
  {
    icon: Lock,
    title: "Non-Custodial",
    description:
      "Your keys, your funds. ZakatChain never holds your assets. Sign transactions directly from your Freighter wallet.",
  },
  {
    icon: Users,
    title: "8 Asnaf Categories",
    description:
      "Distribute across all eight Shariah-mandated categories with custom or equal allocation strategies.",
  },
];

export default function TrustSection() {
  return (
    <section className="py-24 md:py-32 relative mesh-gradient">
      <div className="container-main relative z-10">
        <div className="text-center mb-16">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            Why ZakatChain
          </p>
          <h2 className="animate-fade-up delay-100 text-3xl md:text-4xl font-bold tracking-tight mb-5">
            Trust Built Into Every Layer
          </h2>
          <p className="animate-fade-up delay-200 text-text-muted max-w-lg mx-auto text-[15px] leading-relaxed">
            Open-source, verifiable technology combined with Islamic finance principles
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feature, i) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`animate-fade-up delay-${(i + 2) * 100} group p-7 rounded-2xl border bg-card/60 backdrop-blur-sm card-hover`}
              >
                <div className="w-10 h-10 rounded-xl bg-primary/8 flex items-center justify-center mb-5 transition-all duration-300 group-hover:bg-primary/15 group-hover:scale-105">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-[15px] font-bold mb-2 tracking-tight">{feature.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
