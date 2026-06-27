"use client";

import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight, Sparkles, Globe, Shield } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LandingHero() {
  const { connectWallet, isConnecting, publicKey } = useWallet();
  const router = useRouter();

  const handleCta = async () => {
    if (publicKey) {
      router.push("/dashboard");
    } else {
      const result = await connectWallet();
      if (result) {
        router.push("/dashboard");
      }
    }
  };

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden mesh-gradient">
      {/* Floating orbs */}
      <div className="absolute top-[15%] left-[10%] w-72 h-72 rounded-full bg-primary/8 blur-[100px] animate-float pointer-events-none" />
      <div className="absolute bottom-[10%] right-[15%] w-96 h-96 rounded-full bg-cyan-400/6 blur-[120px] animate-float delay-300 pointer-events-none" />
      <div className="absolute top-[40%] right-[30%] w-48 h-48 rounded-full bg-accent/5 blur-[80px] animate-float delay-600 pointer-events-none" />

      <div className="container-main relative z-10 py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="animate-fade-up inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-card border border-border/60 text-xs font-semibold tracking-wide text-text-muted shadow-sm mb-10">
            <Sparkles className="w-3.5 h-3.5 text-primary" />
            <span>Shariah-Compliant</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Stellar Blockchain</span>
            <span className="w-1 h-1 rounded-full bg-border" />
            <span>Open Source</span>
          </div>

          {/* Heading */}
          <h1 className="animate-fade-up delay-100 text-[3.25rem] sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-7">
            Zakat, Reimagined
            <br />
            <span className="text-gradient">On-Chain</span>
          </h1>

          {/* Description */}
          <p className="animate-fade-up delay-200 text-lg md:text-xl text-text-muted max-w-xl mx-auto mb-12 leading-relaxed">
            Calculate your obligation, verify Nisab compliance, and distribute
            directly on Stellar — transparent, instant, zero middlemen.
          </p>

          {/* CTAs */}
          <div className="animate-fade-up delay-300 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleCta}
              disabled={isConnecting}
              className="w-full sm:w-auto gap-3 text-[15px] shadow-lg shadow-primary/20 rounded-2xl font-semibold bg-primary hover:bg-primary-hover text-white px-8 py-6 transition-all duration-300 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5"
            >
              <Wallet className="w-5 h-5" />
              {isConnecting
                ? "Connecting..."
                : publicKey
                ? "Go to Dashboard"
                : "Connect Wallet"}
              <ArrowRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              onClick={() => router.push("/calculate")}
              className="w-full sm:w-auto text-[15px] rounded-2xl font-semibold border-border/60 hover:bg-card hover:border-primary/30 px-8 py-6 transition-all duration-300 hover:-translate-y-0.5"
            >
              Try the Calculator
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="animate-fade-up delay-500 mt-16 flex items-center justify-center gap-8 text-text-muted">
            <div className="flex items-center gap-2 text-xs font-medium">
              <Shield className="w-4 h-4 text-primary/60" />
              <span>Shariah Verified</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs font-medium">
              <Globe className="w-4 h-4 text-primary/60" />
              <span>Stellar Testnet</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-xs font-medium">
              <Sparkles className="w-4 h-4 text-primary/60" />
              <span>Sub-5s Settlement</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
