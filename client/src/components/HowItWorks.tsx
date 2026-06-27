"use client";

import { Calculator, ShieldCheck, Send, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: Calculator,
    title: "Calculate",
    description:
      "Input your assets and liabilities. Our engine determines your Zakatable wealth and checks the Nisab threshold automatically.",
    color: "from-teal-500/10 to-teal-500/5",
    iconBg: "bg-teal-500/10 text-teal-600 dark:text-teal-400",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    description:
      "Review the full breakdown. Smart contracts verify the Nisab threshold and ensure complete Shariah compliance.",
    color: "from-cyan-500/10 to-cyan-500/5",
    iconBg: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  },
  {
    icon: Send,
    title: "Distribute",
    description:
      "Choose beneficiary categories and distribute directly on Stellar — full transparency, immutable records, near-zero fees.",
    color: "from-amber-500/10 to-amber-500/5",
    iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 md:py-32 relative" id="how-it-works">
      <div className="container-main">
        <div className="text-center mb-16">
          <p className="animate-fade-up text-xs font-semibold uppercase tracking-[0.2em] text-primary mb-4">
            How It Works
          </p>
          <h2 className="animate-fade-up delay-100 text-3xl md:text-4xl font-bold tracking-tight mb-5">
            Three Steps to Fulfillment
          </h2>
          <p className="animate-fade-up delay-200 text-text-muted max-w-lg mx-auto text-[15px] leading-relaxed">
            A streamlined, on-chain workflow from calculation to distribution
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className={`animate-fade-up delay-${(i + 3) * 100} group relative p-8 rounded-2xl border bg-gradient-to-b ${step.color} card-hover cursor-default`}
              >
                {/* Step number */}
                <div className="absolute top-6 right-6 text-[11px] font-bold text-text-muted/40 tracking-wider">
                  0{i + 1}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl ${step.iconBg} flex items-center justify-center mb-6 transition-transform duration-300 group-hover:scale-110`}>
                  <Icon className="w-5 h-5" />
                </div>

                <h3 className="text-lg font-bold mb-3 tracking-tight">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {step.description}
                </p>

                {/* Connector arrow (not on last) */}
                {i < steps.length - 1 && (
                  <div className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-card border shadow-sm items-center justify-center">
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
