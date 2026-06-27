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
    <section className="py-20 md:py-28">
      <div className="container-main">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-light text-primary text-sm font-medium mb-6">
            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
            Shariah-Compliant • Powered by Stellar
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6">
            Automated Zakat for the{" "}
            <span className="text-primary">Modern World</span>
          </h1>

          <p className="text-lg md:text-xl text-text-muted max-w-2xl mx-auto mb-10 leading-relaxed">
            Calculate, verify, and distribute your Zakat directly on the Stellar
            network. Transparent, efficient, and fully Shariah-compliant —
            no intermediaries, full control.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleCta}
              disabled={isConnecting}
              className="gap-2 text-base"
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
              className="text-base"
            >
              Try the Calculator
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
