"use client";

import { useState, useMemo, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ExternalLink, Download, Search, Filter, History } from "lucide-react";
import { useWallet } from "@/context/WalletContext";

interface Transaction {
  date: string;
  type: string;
  amount: string;
  beneficiaries: string;
  txHash: string;
  status: "success" | "pending" | "failed";
}

const STATUS_FILTERS = ["all", "success", "pending", "failed"] as const;

export default function HistoryPage() {
  const { publicKey, isDemo } = useWallet();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  useEffect(() => {
    // Load local distributions
    const savedTxList = localStorage.getItem("zakatchain_demo_distributions");
    let list = savedTxList ? JSON.parse(savedTxList) : [];

    // Map list
    let mappedList = list.map((item: any) => ({
      date: item.date,
      type: "Zakat Distribution",
      amount: new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(Number(item.amount) / 100),
      beneficiaries: item.beneficiaries,
      txHash: item.txHash,
      status: item.status as "success" | "pending" | "failed",
    }));

    // If empty, add mock transactions so it looks populated
    if (mappedList.length === 0) {
      mappedList = [
        {
          date: "2026-06-25",
          type: "Zakat Distribution",
          amount: "$1,250.00",
          beneficiaries: "The Poor, The Needy, Wayfarers",
          txHash: "tx_kh2j5k2l",
          status: "success",
        },
        {
          date: "2026-06-20",
          type: "Zakat Distribution",
          amount: "$3,500.00",
          beneficiaries: "The Debt-Ridden, In the Cause of Allah",
          txHash: "tx_m3n4b5v6",
          status: "success",
        },
      ];
    }
    setTransactions(mappedList);
  }, [publicKey, isDemo]);

  const filtered = useMemo(() => {
    return transactions.filter((tx) => {
      if (statusFilter !== "all" && tx.status !== statusFilter) return false;
      if (search && !tx.txHash.toLowerCase().includes(search.toLowerCase()) &&
          !tx.beneficiaries.toLowerCase().includes(search.toLowerCase())) {
        return false;
      }
      if (dateFrom && tx.date < dateFrom) return false;
      if (dateTo && tx.date > dateTo) return false;
      return true;
    });
  }, [transactions, search, statusFilter, dateFrom, dateTo]);

  const exportCsv = () => {
    const headers = "Date,Type,Amount,Beneficiaries,TX Hash,Status\n";
    const rows = filtered
      .map((tx) =>
        [tx.date, tx.type, tx.amount, tx.beneficiaries, tx.txHash, tx.status].join(",")
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `zakatchain_history_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container-main py-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">History</h1>
            <p className="text-text-muted text-sm mt-1">
              View all your Zakat distributions
            </p>
          </div>
          <Button variant="outline" onClick={exportCsv} className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-5">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="text-xs text-text-muted mb-1 block">
                  Search
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    placeholder="Search by TX hash or beneficiary..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">
                  Status
                </label>
                <div className="flex gap-1">
                  {STATUS_FILTERS.map((s) => (
                    <Button
                      key={s}
                      variant={statusFilter === s ? "default" : "outline"}
                      size="sm"
                      onClick={() => setStatusFilter(s)}
                      className="capitalize"
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">From</label>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-36"
                />
              </div>
              <div>
                <label className="text-xs text-text-muted mb-1 block">To</label>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-36"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Table */}
        <Card>
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-text-muted">No transactions found</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                        Date
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                        Type
                      </th>
                      <th className="text-right p-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                        Beneficiaries
                      </th>
                      <th className="text-left p-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                        TX Hash
                      </th>
                      <th className="text-center p-4 text-xs font-medium text-text-muted uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filtered.map((tx, i) => (
                      <tr key={i} className="hover:bg-muted/50 transition-colors">
                        <td className="p-4 text-sm">{tx.date}</td>
                        <td className="p-4 text-sm">{tx.type}</td>
                        <td className="p-4 text-sm text-right font-semibold">
                          {tx.amount}
                        </td>
                        <td className="p-4 text-sm text-text-muted max-w-[200px] truncate">
                          {tx.beneficiaries}
                        </td>
                        <td className="p-4">
                          {tx.txHash.startsWith("tx_") ? (
                            <span className="text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20" title="Sandbox Local Log">
                              {tx.txHash.slice(0, 8)}... (Sandbox)
                            </span>
                          ) : (
                            <a
                              href={`https://stellar.expert/explorer/testnet/tx/${tx.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              {tx.txHash.slice(0, 8)}...
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </td>
                        <td className="p-4 text-center">
                          <Badge
                            variant={
                              tx.status === "success"
                                ? "success"
                                : tx.status === "pending"
                                ? "warning"
                                : "destructive"
                            }
                            className="capitalize"
                          >
                            {tx.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
