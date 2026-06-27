# ZakatChain

> Automated Zakat calculation and distribution on the Stellar network.

[![Stellar](https://img.shields.io/badge/Powered%20by-Stellar-3E38B0?logo=stellar&logoColor=white)](https://stellar.org)
[![Freighter](https://img.shields.io/badge/Wallet-Freighter-1A56DB)](https://freighter.app)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## What is ZakatChain?

ZakatChain is a decentralized application that automates the calculation, verification, and distribution of **Zakat** — a mandatory 2.5% wealth tax in Islam — using the Stellar blockchain.

Built for the **Stellar Challenge**, ZakatChain leverages Stellar's sub-5-second settlement, near-zero fees, and stablecoin rails (USDC, EURC, MGUSD) to make micro-distributions to beneficiaries across the globe economically viable and fully transparent.

---

## Why Stellar?

| Feature | Why It Matters for Zakat |
|---------|--------------------------|
| **Sub-5s Settlement** | Zakat must reach beneficiaries quickly — a religious obligation |
| **$0.00001 Fees** | Distribute $5 to a farmer in rural Pakistan without losing half to gas fees |
| **Native Stablecoins** | Avoid crypto volatility for religious compliance |
| **Soroban Smart Contracts** | Programmatic Zakat rules, scholar attestation, multi-sig governance |
| **ISO 20022 + Anchors** | Seamless fiat on/off-ramps via MoneyGram and banking partners |
| **Global Reach** | Built-in compliance for cross-border payments to 180+ countries |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js 14)                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Landing    │  │  Dashboard  │  │  Zakat Calculator   │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Distribute │  │  History    │  │  Settings           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Freighter Wallet                         │
│         (Browser Extension — Key Management)                │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Stellar SDK (Testnet)                    │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Account    │  │  Multi-Pay  │  │  Transaction        │  │
│  │  Balances   │  │  Builder    │  │  Submission         │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Soroban Smart Contracts                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Zakat Calc │  │  Distribution│  │  Shariah Oracle     │  │
│  │  Logic      │  │  Rules       │  │  (Multi-Sig)        │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    Stellar Network (Testnet)                │
│              ┌──────────┐          ┌──────────┐             │
│              │  Anchors │          │  Horizon │             │
│              │  (Fiat)  │          │  (Ledger)│             │
│              └──────────┘          └──────────┘             │
└─────────────────────────────────────────────────────────────┘
```

---

## Features

### For Donors
- **One-Click Calculation** — Connect your wallet or input assets manually; Zakat is calculated instantly using live nisab thresholds
- **Smart Distribution** — Split Zakat across 8 Quranic beneficiary categories with intuitive sliders
- **Full Transparency** — Every transaction is recorded on-chain; track your Zakat from wallet to beneficiary
- **Receipts & History** — Download tax-compliant receipts; view complete distribution history

### For Beneficiaries
- **Instant Access** — Receive distributions in seconds, cash out via MoneyGram or local anchors
- **No Bank Account Required** — A Stellar address is all you need
- **SMS Notifications** — Get alerted when funds arrive

### For Scholars & Institutions
- **Shariah Oracle** — Multi-sig governance lets councils attest contract compliance
- **Automated Nisab** — Gold/silver prices fetched via oracle; no manual threshold updates
- **Audit Trail** — Immutable ledger for institutional reporting

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Blockchain | Stellar SDK (@stellar/stellar-sdk) |
| Wallet | Freighter API |
| Smart Contracts | Soroban (Rust — mocked for demo) |
| State | React Context API |
| Icons | Lucide React |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Freighter Wallet](https://www.freighter.app/) browser extension
- A Stellar testnet account with XLM (get free XLM from the [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test))

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/zakatchain.git
cd zakatchain

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Stellar Network
NEXT_PUBLIC_STELLAR_NETWORK=TESTNET
NEXT_PUBLIC_HORIZON_URL=https://horizon-testnet.stellar.org

# Soroban (mocked for demo — replace with real contract IDs)
NEXT_PUBLIC_SOROBAN_RPC_URL=https://soroban-testnet.stellar.org
NEXT_PUBLIC_ZAKAT_CONTRACT_ID=mock_contract_id

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=
```

### Running Locally

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

### Building for Production

```bash
npm run build
npm start
```

---

## Freighter Wallet Setup

ZakatChain uses **Freighter** as its wallet provider. Follow these steps to get set up:

1. **Install Freighter**
   - Download from [freighter.app](https://www.freighter.app/)
   - Available for Chrome, Firefox, Brave, and Edge

2. **Create or Import an Account**
   - Follow the onboarding flow to create a new Stellar account
   - Or import an existing account using your secret key

3. **Switch to Testnet**
   - Open Freighter → Settings → Network
   - Select **Testnet**

4. **Fund Your Account**
   - Visit [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=test)
   - Enter your public key and click "Create Account"
   - You'll receive 10,000 test XLM

5. **Connect to ZakatChain**
   - Visit the app and click "Connect Wallet"
   - Approve the connection in Freighter
   - Your address will appear in the header

---

## Project Structure

```
zakatchain/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page
│   ├── layout.tsx                # Root layout with providers
│   ├── globals.css               # Global styles + Tailwind
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   └── layout.tsx            # Sidebar wrapper
│   ├── calculate/
│   │   └── page.tsx              # Zakat calculator wizard
│   ├── distribute/
│   │   └── page.tsx              # Distribution interface
│   ├── history/
│   │   └── page.tsx              # Transaction history
│   └── settings/
│       └── page.tsx              # User preferences
├── components/
│   ├── ui/                       # shadcn/ui components
│   ├── layout/
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   ├── Header.tsx            # Top bar with wallet
│   │   └── WalletButton.tsx      # Freighter connect/disconnect
│   ├── dashboard/
│   │   ├── StatCard.tsx          # Summary metric cards
│   │   ├── ActivityTable.tsx     # Recent transactions
│   │   └── DistributionMap.tsx   # Geographic visualization
│   ├── calculate/
│   │   ├── AssetInput.tsx        # Asset type input
│   │   ├── LiabilityInput.tsx    # Deduction inputs
│   │   └── ResultCard.tsx        # Final calculation display
│   └── distribute/
│       ├── CategoryCard.tsx      # Beneficiary category
│       └── DistributionPreview.tsx # TX summary modal
├── hooks/
│   ├── useFreighter.ts           # Freighter wallet integration
│   ├── useStellar.ts             # Stellar SDK operations
│   └── useZakatCalculator.ts     # Calculation logic
├── lib/
│   ├── stellar.ts                # Stellar client config
│   ├── soroban.ts                # Soroban contract interface
│   └── utils.ts                  # Helpers & formatters
├── context/
│   └── WalletContext.tsx         # Global wallet state
├── types/
│   └── index.ts                  # TypeScript definitions
├── public/
│   └── logo.svg                  # Brand asset
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## Core Concepts

### What is Zakat?

Zakat is one of the Five Pillars of Islam — a mandatory charitable contribution of 2.5% of eligible wealth held for one lunar year. It is distributed to 8 specific categories of beneficiaries defined in the Quran (9:60):

1. **The Poor** (*Al-Fuqara*)
2. **The Needy** (*Al-Masakin*)
3. **Zakat Administrators** (*Al-Amilina Alayha*)
4. **Those Whose Hearts Are to Be Reconciled** (*Al-Muallafati Qulubuhum*)
5. **Freeing Captives** (*Fir-Riqab*)
6. **The Debt-Ridden** (*Al-Gharimin*)
7. **In the Cause of Allah** (*Fi Sabilillah*)
8. **Wayfarers** (*Ibn As-Sabil*)

### Nisab Threshold

Zakat is only obligatory if total eligible wealth exceeds the **nisab** — the value of 87.48g of gold or 612.36g of silver. ZakatChain fetches live gold prices via oracle to determine eligibility automatically.

### Eligible Assets

| Asset Type | Zakat Eligible? | Notes |
|-----------|----------------|-------|
| Cash & Bank Balances | ✅ Yes | All currencies |
| Gold & Silver | ✅ Yes | Jewelry, bullion, coins |
| Stocks & Investments | ✅ Yes | At market value |
| Cryptocurrency | ✅ Yes | Held as investment |
| Business Inventory | ✅ Yes | At wholesale value |
| Debts Owed to You | ✅ Yes | If likely to be repaid |
| Personal Residence | ❌ No | Primary home exempt |
| Personal Vehicle | ❌ No | Daily use exempt |
| Debts You Owe | ❌ No | Deducted from total |

---

## Smart Contract Architecture (Soroban)

```rust
// contracts/zakat/src/lib.rs

pub struct ZakatContract;

#[contractimpl]
impl ZakatContract {
    /// Calculate Zakat due based on asset inputs
    pub fn calculate(env: Env, assets: Vec<AssetInput>, nisab: i128) -> i128 {
        let total = assets.iter().map(|a| a.value).sum::<i128>();
        if total >= nisab {
            total * 25 / 1000  // 2.5%
        } else {
            0
        }
    }

    /// Distribute Zakat to multiple beneficiaries
    pub fn distribute(
        env: Env,
        donor: Address,
        amount: i128,
        categories: Vec<CategorySplit>
    ) -> Vec<String> {
        // Validate splits sum to 100%
        // Transfer to each beneficiary
        // Emit distribution events
        // Return transaction hashes
    }

    /// Record Shariah council attestation
    pub fn attest(env: Env, council_member: Address, contract_id: BytesN<32>) {
        // Multi-sig logic
        // Require 3/5 signatures
    }
}
```

> **Note:** The Soroban contract is mocked in the current demo build. The interface is structured for seamless integration with a deployed contract.

---

## API Reference

### `useFreighter()` Hook

```typescript
const {
  isConnected,      // boolean — wallet connected?
  publicKey,        // string | null — G... address
  connect,          // () => Promise<string> — request connection
  disconnect,       // () => void — clear session
  signTransaction,  // (xdr: string) => Promise<string> — sign & return
} = useFreighter();
```

### `useStellar()` Hook

```typescript
const {
  getBalance,           // (address: string) => Promise<AssetBalance[]>
  buildPayment,         // (destinations: Destination[]) => Promise<string>
  submitTransaction,    // (signedXdr: string) => Promise<TransactionResult>
  getHistory,           // (address: string) => Promise<Transaction[]>
} = useStellar();
```

### `useZakatCalculator()` Hook

```typescript
const {
  assets,             // AssetInput[]
  liabilities,        // LiabilityInput[]
  addAsset,           // (asset: AssetInput) => void
  addLiability,       // (liability: LiabilityInput) => void
  calculate,          // () => ZakatCalculation
  isEligible,         // boolean
  zakatDue,           // number
} = useZakatCalculator();
```

---

## Screenshots

### Dashboard
> Clean summary of wealth, Zakat due, and distribution history

### Calculator
> Step-by-step wizard for accurate Zakat computation

### Distribution
> Intuitive sliders for splitting across 8 beneficiary categories

### History
> Full audit trail with Stellar explorer links

---

## Roadmap

- [x] Core calculator with nisab checking
- [x] Freighter wallet integration
- [x] Multi-payment transaction builder
- [x] Transaction history with explorer links
- [x] Responsive design + dark mode
- [ ] Soroban smart contract deployment
- [ ] Shariah council multi-sig governance
- [ ] MoneyGram anchor integration for fiat off-ramps
- [ ] Mobile app (React Native)
- [ ] Multi-language support (Arabic, Urdu, Indonesian, French)
- [ ] Institutional dashboard for mosques & charities
- [ ] Mainnet migration

---

## Contributing

We welcome contributions from developers, designers, and Islamic finance experts.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details on code style, testing, and commit conventions.

---

## Security

- **Never share your secret key.** ZakatChain only requests your public key from Freighter.
- **Verify transactions** before signing in Freighter. Review all destinations and amounts.
- **Testnet only** — This demo runs on Stellar testnet. Do not send real funds.

---

## License

MIT License — see [LICENSE](LICENSE) for details.

---

## Acknowledgments

- [Stellar Development Foundation](https://stellar.org) for the blockchain infrastructure
- [Freighter](https://freighter.app) for the wallet SDK
- [shadcn/ui](https://ui.shadcn.com) for the component library
- The global Islamic finance community for guidance on Zakat rules

---

<div align="center">

**Built with faith, code, and Stellar.**

[Website](https://zakatchain.vercel.app) · [Demo](https://zakatchain.vercel.app/demo) · [Twitter](https://twitter.com/zakatchain) · [Discord](https://discord.gg/zakatchain)

</div>
