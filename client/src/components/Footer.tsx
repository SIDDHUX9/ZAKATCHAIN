"use client";

import Link from "next/link";
import { ExternalLink, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-card/50 backdrop-blur-sm">
      <div className="container-main py-12">
        <div className="grid sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shadow-sm transition-transform group-hover:scale-105">
                <span className="text-primary-foreground font-bold text-sm">Z</span>
              </div>
              <span className="font-bold text-lg tracking-tight">ZakatChain</span>
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              Shariah-compliant Zakat automation built on the Stellar blockchain. Open source, transparent, and non-custodial.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">Resources</h4>
            <div className="space-y-3">
              <Link href="https://developers.stellar.org" target="_blank" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group">
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                Stellar Docs
              </Link>
              <Link href="https://github.com/SIDDHUX9/ZAKATCHAIN" target="_blank" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group">
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                GitHub Repo
              </Link>
              <Link href="https://stellar.expert/explorer/testnet" target="_blank" className="flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group">
                <ExternalLink className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
                Stellar Explorer
              </Link>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-text-muted mb-4">Product</h4>
            <div className="space-y-3">
              <Link href="/calculate" className="block text-sm text-text-muted hover:text-primary transition-colors">
                Zakat Calculator
              </Link>
              <Link href="/distribute" className="block text-sm text-text-muted hover:text-primary transition-colors">
                Distribute Zakat
              </Link>
              <Link href="/dashboard" className="block text-sm text-text-muted hover:text-primary transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="section-divider mt-10 mb-6" />
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} ZakatChain. Built for the Stellar Challenge.
          </p>
          <p className="text-xs text-text-muted flex items-center gap-1.5">
            Made with <Heart className="w-3 h-3 text-rose-400" /> on Stellar
          </p>
        </div>
      </div>
    </footer>
  );
}
