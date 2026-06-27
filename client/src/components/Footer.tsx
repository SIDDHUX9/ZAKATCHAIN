"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-card">
      <div className="container-main py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">Z</span>
            </div>
            <span className="text-sm font-semibold tracking-tight">
              ZakatChain
            </span>
          </div>

          <div className="flex items-center gap-6 text-sm text-text-muted">
            <Link
              href="https://developers.stellar.org"
              target="_blank"
              className="hover:text-text-main transition-colors"
            >
              Docs
            </Link>
            <Link
              href="https://github.com"
              target="_blank"
              className="hover:text-text-main transition-colors"
            >
              GitHub
            </Link>
            <Link
              href="https://stellar.expert/explorer/testnet"
              target="_blank"
              className="hover:text-text-main transition-colors"
            >
              Stellar Explorer
            </Link>
          </div>

          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} ZakatChain. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
