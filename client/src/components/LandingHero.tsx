"use client";

import { useWallet } from "@/context/WalletContext";
import { Button } from "@/components/ui/button";
import { Wallet, ArrowRight } from "lucide-react";
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
    <section className="relative py-24 md:py-36 overflow-hidden">
      {/* Background Decorative Blurs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full bg-accent/5 blur-[100px] pointer-events-none -z-10 animate-pulse" />

      <div className="container-main">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light/50 dark:bg-primary-light/10 text-primary dark:text-primary-hover text-xs md:text-sm font-bold border border-primary/20 mb-8 animate-fade-in shadow-sm">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Shariah-Compliant • Powered by Stellar Soroban
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-8">
            Automated Zakat for the <br className="hidden sm:inline" />
            <span className="text-gradient">Modern Digital Era</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
            Calculate, verify, and distribute your Zakat directly on the Stellar
            blockchain. Transparent, secure, and fully Shariah-compliant —
            no intermediaries, pure clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleCta}
              disabled={isConnecting}
              className="w-full sm:w-auto gap-2.5 text-base shadow-lg rounded-xl font-bold bg-primary hover:bg-primary-hover text-white transition-all transform hover:-translate-y-0.5 duration-200"
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
              className="w-full sm:w-auto text-base rounded-xl font-bold border-border/80 hover:bg-muted/30 transition-all transform hover:-translate-y-0.5 duration-200"
            >
              Try the Calculator
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
