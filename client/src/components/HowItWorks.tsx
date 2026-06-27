"use client";

import { Calculator, ShieldCheck, Send } from "lucide-react";

const steps = [
  {
    icon: Calculator,
    title: "Calculate",
    description:
      "Add your assets and liabilities. Our engine automatically determines your Zakatable wealth and checks the Nisab threshold.",
  },
  {
    icon: ShieldCheck,
    title: "Verify",
    description:
      "Review the calculation breakdown. Smart contracts verify the Nisab threshold and ensure Shariah compliance.",
  },
  {
    icon: Send,
    title: "Distribute",
    description:
      "Choose beneficiary categories and distribute directly on the Stellar network with full transparency and traceability.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-secondary" id="how-it-works">
      <div className="container-main">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-4">
          How It Works
        </h2>
        <p className="text-text-muted text-center max-w-xl mx-auto mb-12">
          Three simple steps to fulfill your Zakat obligation
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <div
                key={step.title}
                className="text-center p-8 rounded-xl bg-card border shadow-sm"
              >
                <div className="w-14 h-14 rounded-xl bg-primary-light flex items-center justify-center mx-auto mb-5">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                <p className="text-text-muted text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
