"use client";

import DashboardSummary from "@/components/DashboardSummary";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, RefreshCw } from "lucide-react";

const recentActivity = [
  {
    date: "2026-06-25",
    type: "Distribution",
    amount: "$1,250.00",
    status: "success" as const,
    txHash: "abc...def",
  },
  {
    date: "2026-06-20",
    type: "Calculation",
    amount: "$5,000.00",
    status: "success" as const,
    txHash: null,
  },
];

const beneficiaries = [
  { name: "Alleviate Poverty Fund", location: "Global", category: "The Poor" },
  { name: "Education for All", location: "Southeast Asia", category: "Wayfarers" },
  { name: "Debt Relief Initiative", location: "Middle East", category: "The Debt-Ridden" },
];

export default function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">
            Welcome to your Zakat dashboard
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>

      <DashboardSummary />

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">
                No recent activity. Connect your wallet and make your first
                distribution.
              </p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between py-3 border-b last:border-0"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{activity.type}</p>
                      <p className="text-xs text-text-muted">{activity.date}</p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-sm font-semibold">{activity.amount}</p>
                      <Badge variant={activity.status === "success" ? "success" : "warning"}>
                        {activity.status}
                      </Badge>
                    </div>
                    {activity.txHash && (
                      <a
                        href={`https://stellar.expert/explorer/testnet/tx/${activity.txHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="ml-3 text-text-muted hover:text-primary transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Distribution Map / Beneficiaries */}
        <Card>
          <CardHeader>
            <CardTitle>Past Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {beneficiaries.map((b, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-lg border bg-card"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary-light flex items-center justify-center">
                    <span className="text-primary font-bold text-sm">
                      {b.category[0]}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{b.name}</p>
                    <p className="text-xs text-text-muted">{b.location}</p>
                  </div>
                  <Badge variant="secondary">{b.category}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
