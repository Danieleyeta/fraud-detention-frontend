"use client";

import * as React from "react";
import {
  IconShieldBolt,
  IconAlertTriangle,
  IconMapPin,
  IconClock,
  IconCurrencyDollar,
  IconDeviceDesktop,
  IconRefresh,
  IconCircleCheck,
  IconCircleX,
  IconFlame,
  IconTrendingUp,
  IconTrendingDown,
  IconEdit,
  IconCheck,
  IconX,
  IconSparkles,
} from "@tabler/icons-react";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

// ── Types ────────────────────────────────────────────────────────────────────

interface RuleThreshold {
  key: string;
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  step: number;
  description: string;
  aiSuggested: number;
  aiRationale: string;
}

interface FraudRule {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  status: "active" | "disabled" | "review";
  severity: "critical" | "high" | "medium" | "low";
  caught: number;
  caughtDelta: number; // % change vs last period
  falsePositives: number;
  lastTriggered: string;
  thresholds: RuleThreshold[];
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const initialRules: FraudRule[] = [
  {
    id: "velocity-spike",
    name: "Velocity Spike",
    description:
      "Triggers when a customer exceeds the maximum number of transactions within a rolling time window.",
    icon: IconFlame,
    status: "active",
    severity: "high",
    caught: 1842,
    caughtDelta: +18.3,
    falsePositives: 74,
    lastTriggered: "2 minutes ago",
    thresholds: [
      {
        key: "max_tx_per_window",
        label: "Max transactions per window",
        value: 5,
        unit: "txns",
        min: 1,
        max: 50,
        step: 1,
        description: "Maximum number of transactions allowed in the time window",
        aiSuggested: 4,
        aiRationale: "Lowering to 4 reduces false-negative rate by ~11% based on 90-day transaction patterns.",
      },
      {
        key: "window_seconds",
        label: "Rolling window",
        value: 60,
        unit: "seconds",
        min: 10,
        max: 3600,
        step: 10,
        description: "Duration of the rolling time window in seconds",
        aiSuggested: 45,
        aiRationale: "A 45 s window better captures burst fraud patterns seen in recent attack clusters.",
      },
      {
        key: "cooldown_minutes",
        label: "Block cooldown",
        value: 30,
        unit: "minutes",
        min: 1,
        max: 1440,
        step: 1,
        description: "How long to block the account after the rule fires",
        aiSuggested: 45,
        aiRationale: "Extending to 45 min aligns with the median fraudster retry interval observed historically.",
      },
    ],
  },
  {
    id: "large-amount",
    name: "Large Amount",
    description:
      "Blocks or flags transactions that exceed the configured single-transaction or daily cumulative limit.",
    icon: IconCurrencyDollar,
    status: "active",
    severity: "critical",
    caught: 3217,
    caughtDelta: +6.1,
    falsePositives: 112,
    lastTriggered: "4 minutes ago",
    thresholds: [
      {
        key: "single_tx_limit",
        label: "Single transaction limit",
        value: 5000000,
        unit: "₦",
        min: 100000,
        max: 100000000,
        step: 100000,
        description: "Maximum allowed amount for a single transaction (₦)",
        aiSuggested: 3500000,
        aiRationale: "₦3.5M threshold reduces high-value fraud exposure by 23% with minimal impact on legitimate transfers.",
      },
      {
        key: "daily_cumulative_limit",
        label: "Daily cumulative limit",
        value: 10000000,
        unit: "₦",
        min: 500000,
        max: 500000000,
        step: 500000,
        description: "Maximum total transaction volume per account per day (₦)",
        aiSuggested: 8000000,
        aiRationale: "₦8M daily cap covers 97.4% of legitimate user behaviour while blocking known mule patterns.",
      },
      {
        key: "review_threshold",
        label: "Manual review threshold",
        value: 2000000,
        unit: "₦",
        min: 100000,
        max: 50000000,
        step: 100000,
        description: "Amounts above this are routed to human review queue (₦)",
        aiSuggested: 1500000,
        aiRationale: "Dropping to ₦1.5M catches an additional 8% of confirmed fraud cases with acceptable queue load.",
      },
    ],
  },
  {
    id: "ip-geo-anomaly",
    name: "IP / Geo Anomaly",
    description:
      "Detects transactions originating from blacklisted IPs, Tor exit nodes, or geographic locations inconsistent with the account's baseline.",
    icon: IconMapPin,
    status: "active",
    severity: "critical",
    caught: 2104,
    caughtDelta: +22.7,
    falsePositives: 39,
    lastTriggered: "just now",
    thresholds: [
      {
        key: "max_country_distance_km",
        label: "Max geo-shift distance",
        value: 500,
        unit: "km",
        min: 50,
        max: 20000,
        step: 50,
        description:
          "Maximum km between the account's home country centroid and the transaction IP location",
        aiSuggested: 300,
        aiRationale: "300 km tightens geo-fencing to match Nigerian inter-state travel norms and cuts anomaly misses by 17%.",
      },
      {
        key: "risk_score_cutoff",
        label: "IP risk score cutoff",
        value: 70,
        unit: "/ 100",
        min: 0,
        max: 100,
        step: 1,
        description:
          "IPs with a risk score above this value are blocked (0 = allow all, 100 = block all)",
        aiSuggested: 62,
        aiRationale: "Score of 62 captures an extra 14% of malicious IPs seen in recent attack feeds with low FP increase.",
      },
      {
        key: "vpn_tor_action",
        label: "VPN / Tor action",
        value: 1,
        unit: "(0=allow, 1=review, 2=block)",
        min: 0,
        max: 2,
        step: 1,
        description:
          "Action to take when a VPN or Tor exit node is detected (0 allow, 1 review, 2 block)",
        aiSuggested: 2,
        aiRationale: "Blocking (2) is recommended — 98.3% of recent fraud events used Tor; no legitimate use case identified.",
      },
    ],
  },
  {
    id: "account-takeover",
    name: "Account Takeover",
    description:
      "Fires when device fingerprint, location, or login pattern deviates significantly from the account's historical baseline.",
    icon: IconDeviceDesktop,
    status: "active",
    severity: "high",
    caught: 987,
    caughtDelta: -4.2,
    falsePositives: 51,
    lastTriggered: "18 minutes ago",
    thresholds: [
      {
        key: "device_mismatch_score",
        label: "Device mismatch score",
        value: 60,
        unit: "/ 100",
        min: 0,
        max: 100,
        step: 1,
        description:
          "Minimum device-fingerprint deviation score to trigger the rule",
        aiSuggested: 52,
        aiRationale: "Score 52 catches 91% of ATO attempts; current value of 60 is missing fast-rotating device attacks.",
      },
      {
        key: "new_device_hold_hours",
        label: "New device hold period",
        value: 24,
        unit: "hours",
        min: 1,
        max: 168,
        step: 1,
        description:
          "Hours to restrict high-value transfers from a newly registered device",
        aiSuggested: 48,
        aiRationale: "48-hour hold reduces ATO success rate by 61% based on attack timing distribution analysis.",
      },
    ],
  },
  {
    id: "structuring",
    name: "Structuring / Smurfing",
    description:
      "Identifies deliberate splitting of large amounts into smaller sub-threshold transactions to evade detection (AML pattern).",
    icon: IconRefresh,
    status: "active",
    severity: "high",
    caught: 651,
    caughtDelta: +11.4,
    falsePositives: 28,
    lastTriggered: "1 hour ago",
    thresholds: [
      {
        key: "smurf_window_hours",
        label: "Aggregation window",
        value: 24,
        unit: "hours",
        min: 1,
        max: 72,
        step: 1,
        description: "Hours over which sub-transactions are aggregated",
        aiSuggested: 36,
        aiRationale: "Extending to 36 h catches slow-burn structuring patterns that execute over multiple business days.",
      },
      {
        key: "smurf_total_limit",
        label: "Aggregate limit",
        value: 4900000,
        unit: "₦",
        min: 500000,
        max: 50000000,
        step: 100000,
        description:
          "If the sum of split transactions exceeds this value within the window, the rule fires",
        aiSuggested: 3500000,
        aiRationale: "₦3.5M aggregate aligns with NFIU reporting threshold; current ₦4.9M misses a known evasion bracket.",
      },
      {
        key: "min_split_count",
        label: "Minimum split count",
        value: 3,
        unit: "txns",
        min: 2,
        max: 20,
        step: 1,
        description: "Minimum number of linked transactions required to trigger",
        aiSuggested: 2,
        aiRationale: "Lowering to 2 transactions catches early-stage structuring before it matures into a full pattern.",
      },
    ],
  },
  {
    id: "dormant-reactivation",
    name: "Dormant Account Activity",
    description:
      "Flags sudden high-value activity on accounts that have been inactive beyond the configured dormancy period.",
    icon: IconClock,
    status: "review",
    severity: "medium",
    caught: 312,
    caughtDelta: -1.8,
    falsePositives: 94,
    lastTriggered: "3 hours ago",
    thresholds: [
      {
        key: "dormancy_days",
        label: "Dormancy threshold",
        value: 90,
        unit: "days",
        min: 7,
        max: 730,
        step: 7,
        description:
          "Account inactivity period (days) before it is considered dormant",
        aiSuggested: 60,
        aiRationale: "60-day dormancy window matches industry standard and reduces false-negative reactivation fraud by 19%.",
      },
      {
        key: "reactivation_limit",
        label: "Post-reactivation limit",
        value: 1000000,
        unit: "₦",
        min: 100000,
        max: 10000000,
        step: 100000,
        description:
          "Maximum allowed single transaction on reactivation before enhanced review",
        aiSuggested: 500000,
        aiRationale: "₦500k limit on reactivation reduces account-takeover losses by 44% based on historical case data.",
      },
    ],
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function severityColor(s: FraudRule["severity"]) {
  return {
    critical: "text-destructive border-destructive/40 bg-destructive/10",
    high: "text-orange-600 border-orange-400/40 bg-orange-500/10 dark:text-orange-400",
    medium: "text-yellow-600 border-yellow-400/40 bg-yellow-500/10 dark:text-yellow-400",
    low: "text-muted-foreground",
  }[s];
}

function statusBadge(s: FraudRule["status"]) {
  if (s === "active")
    return <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30">Active</Badge>;
  if (s === "review")
    return <Badge className="bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/30">Under Review</Badge>;
  return <Badge variant="outline" className="text-muted-foreground">Disabled</Badge>;
}

function fmt(n: number) {
  return n.toLocaleString();
}

// ── Threshold Editor ─────────────────────────────────────────────────────────

function ThresholdEditor({
  threshold,
  onChange,
}: {
  threshold: RuleThreshold;
  onChange: (key: string, value: number) => void;
}) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(String(threshold.value));

  function commit() {
    const n = parseFloat(draft);
    if (!isNaN(n) && n >= threshold.min && n <= threshold.max) {
      onChange(threshold.key, n);
      setEditing(false);
      toast.success(`Updated "${threshold.label}" to ${n} ${threshold.unit}`);
    } else {
      toast.error(`Value must be between ${threshold.min} and ${threshold.max}`);
    }
  }

  function cancel() {
    setDraft(String(threshold.value));
    setEditing(false);
  }

  function applyAI() {
    onChange(threshold.key, threshold.aiSuggested);
    toast.success(
      `Applied AI suggestion: "${threshold.label}" → ${fmt(threshold.aiSuggested)} ${threshold.unit}`
    );
  }

  const aiDiff = threshold.aiSuggested - threshold.value;
  const aiIsHigher = aiDiff > 0;

  return (
    <div className="rounded-lg border bg-muted/30 px-4 py-3 flex flex-col gap-2">
      {/* Top row: label + current value + edit button */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p className="text-sm font-medium leading-none">{threshold.label}</p>
          <p className="text-xs text-muted-foreground mt-1">{threshold.description}</p>
        </div>
        {!editing ? (
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-sm font-semibold tabular-nums">
              {fmt(threshold.value)}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                {threshold.unit}
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground hover:text-foreground"
              onClick={() => {
                setDraft(String(threshold.value));
                setEditing(true);
              }}
            >
              <IconEdit className="size-3.5" />
              <span className="sr-only">Edit {threshold.label}</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1">
                <Input
                  type="number"
                  min={threshold.min}
                  max={threshold.max}
                  step={threshold.step}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") cancel();
                  }}
                  autoFocus
                  className="h-7 w-28 text-right text-sm"
                />
                <span className="text-xs text-muted-foreground whitespace-nowrap">
                  {threshold.unit}
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Range: {fmt(threshold.min)} – {fmt(threshold.max)}
              </p>
            </div>
            <Button size="icon" className="size-7" onClick={commit}>
              <IconCheck className="size-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="size-7 text-muted-foreground"
              onClick={cancel}
            >
              <IconX className="size-3.5" />
            </Button>
          </div>
        )}
      </div>

      {/* AI suggestion row */}
      <div className="flex items-start justify-between gap-2 rounded-md border border-violet-400/30 bg-violet-500/5 px-3 py-2">
        <div className="flex items-start gap-1.5 flex-1 min-w-0">
          <IconSparkles className="size-3.5 shrink-0 mt-0.5 text-violet-500 dark:text-violet-400" />
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] font-semibold uppercase tracking-wide text-violet-600 dark:text-violet-400">
              AI Suggested
            </span>
            <span className="text-xs text-muted-foreground leading-snug">
              {threshold.aiRationale}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 ml-2">
          <span
            className={`text-sm font-bold tabular-nums ${
              aiIsHigher
                ? "text-orange-600 dark:text-orange-400"
                : "text-green-600 dark:text-green-400"
            }`}
          >
            {fmt(threshold.aiSuggested)}
            <span className="text-[10px] font-normal text-muted-foreground ml-0.5">
              {threshold.unit}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-[10px] font-medium border-violet-400/40 text-violet-700 hover:bg-violet-500/10 hover:text-violet-700 dark:text-violet-400 dark:hover:text-violet-300"
            onClick={applyAI}
          >
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}

// ── Rule Card ─────────────────────────────────────────────────────────────────

function RuleCard({ rule: initialRule }: { rule: FraudRule }) {
  const [rule, setRule] = React.useState(initialRule);
  const [expanded, setExpanded] = React.useState(false);
  const [status, setStatus] = React.useState(initialRule.status);

  function handleThresholdChange(key: string, value: number) {
    setRule((r) => ({
      ...r,
      thresholds: r.thresholds.map((t) => (t.key === key ? { ...t, value } : t)),
    }));
  }

  function handleStatusChange(val: string) {
    setStatus(val as FraudRule["status"]);
    toast.success(`Rule "${rule.name}" status set to ${val}`);
  }

  const Icon = rule.icon;
  const positive = rule.caughtDelta >= 0;

  return (
    <Card className="@container/rule flex flex-col gap-0 overflow-hidden">
      {/* Header row */}
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <div
            className={`flex size-9 shrink-0 items-center justify-center rounded-lg border ${severityColor(rule.severity)}`}
          >
            <Icon className="size-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <CardTitle className="text-sm font-semibold">{rule.name}</CardTitle>
              {statusBadge(status)}
              <Badge
                variant="outline"
                className={`text-xs capitalize ${severityColor(rule.severity)}`}
              >
                {rule.severity}
              </Badge>
            </div>
            <CardDescription className="mt-1 text-xs leading-snug line-clamp-2">
              {rule.description}
            </CardDescription>
          </div>
          {/* Status toggle */}
          <div className="shrink-0">
            <Select value={status} onValueChange={handleStatusChange}>
              <SelectTrigger size="sm" className="h-7 w-28 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="review">Review</SelectItem>
                <SelectItem value="disabled">Disabled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      {/* Stats row */}
      <CardContent className="pt-0 pb-3">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-md border bg-muted/30 py-2">
            <p className="text-xs text-muted-foreground">Transactions caught</p>
            <p className="text-lg font-bold tabular-nums mt-0.5">{fmt(rule.caught)}</p>
            <div
              className={`flex items-center justify-center gap-0.5 text-[10px] font-medium mt-0.5 ${
                positive ? "text-green-600 dark:text-green-400" : "text-destructive"
              }`}
            >
              {positive ? (
                <IconTrendingUp className="size-3" />
              ) : (
                <IconTrendingDown className="size-3" />
              )}
              {positive ? "+" : ""}
              {rule.caughtDelta}% vs last period
            </div>
          </div>
          <div className="rounded-md border bg-muted/30 py-2">
            <p className="text-xs text-muted-foreground">False positives</p>
            <p className="text-lg font-bold tabular-nums mt-0.5">{fmt(rule.falsePositives)}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {((rule.falsePositives / rule.caught) * 100).toFixed(1)}% FP rate
            </p>
          </div>
          <div className="rounded-md border bg-muted/30 py-2">
            <p className="text-xs text-muted-foreground">Last triggered</p>
            <p className="text-sm font-semibold tabular-nums mt-0.5 leading-snug">
              {rule.lastTriggered}
            </p>
            <p className="text-[10px] text-muted-foreground mt-0.5">
              {rule.thresholds.length} threshold{rule.thresholds.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </CardContent>

      <Separator />

      {/* Threshold section */}
      <CardContent className="pt-3 pb-4">
        <button
          className="flex w-full items-center justify-between text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setExpanded((v) => !v)}
        >
          <span>Thresholds &amp; Configuration</span>
          <span className="text-xs">{expanded ? "▲ collapse" : "▼ expand"}</span>
        </button>

        {expanded && (
          <div className="mt-3 flex flex-col gap-2">
            {rule.thresholds.map((t) => (
              <ThresholdEditor
                key={t.key}
                threshold={t}
                onChange={handleThresholdChange}
              />
            ))}
            <Button
              className="mt-1 w-full"
              size="sm"
              onClick={() =>
                toast.promise(
                  new Promise<void>((res) => setTimeout(res, 800)),
                  {
                    loading: `Saving "${rule.name}" configuration…`,
                    success: "Rule configuration saved successfully.",
                    error: "Failed to save.",
                  }
                )
              }
            >
              Save Rule Configuration
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ── Summary Stats ─────────────────────────────────────────────────────────────

function SummaryStats({ rules }: { rules: FraudRule[] }) {
  const totalCaught = rules.reduce((s, r) => s + r.caught, 0);
  const totalFP = rules.reduce((s, r) => s + r.falsePositives, 0);
  const active = rules.filter((r) => r.status === "active").length;
  const fpRate = ((totalFP / totalCaught) * 100).toFixed(1);

  const stats = [
    {
      label: "Total Transactions Blocked",
      value: fmt(totalCaught),
      sub: "across all active rules",
      icon: IconShieldBolt,
      accent: "text-primary",
    },
    {
      label: "Active Rules",
      value: String(active),
      sub: `${rules.length - active} disabled / in review`,
      icon: IconCircleCheck,
      accent: "text-green-600 dark:text-green-400",
    },
    {
      label: "False Positive Rate",
      value: `${fpRate}%`,
      sub: `${fmt(totalFP)} false positives total`,
      icon: IconCircleX,
      accent: "text-yellow-600 dark:text-yellow-400",
    },
    {
      label: "Critical Severity Rules",
      value: String(rules.filter((r) => r.severity === "critical").length),
      sub: "require immediate attention",
      icon: IconAlertTriangle,
      accent: "text-destructive",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} className="@container/card">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1.5 text-xs">
              <s.icon className={`size-3.5 ${s.accent}`} />
              {s.label}
            </CardDescription>
            <CardTitle className="text-2xl font-bold tabular-nums @[200px]/card:text-3xl">
              {s.value}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{s.sub}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function RulesPage() {
  const [rules] = React.useState(initialRules);
  const [filter, setFilter] = React.useState<"all" | FraudRule["severity"] | FraudRule["status"]>(
    "all"
  );

  const filtered = filter === "all" ? rules : rules.filter((r) => r.severity === filter || r.status === filter);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-6 py-4 md:py-6 px-4 lg:px-6">

              {/* Page title */}
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold">Rules Management</h2>
                <p className="text-sm text-muted-foreground">
                  Monitor detection rule performance and tune thresholds for your fraud prevention engine.
                </p>
              </div>

              {/* Summary KPI strip */}
              <SummaryStats rules={rules} />

              {/* Filter bar */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-sm text-muted-foreground mr-1">Filter:</span>
                {(
                  [
                    { val: "all", label: "All Rules" },
                    { val: "active", label: "Active" },
                    { val: "review", label: "Under Review" },
                    { val: "critical", label: "Critical" },
                    { val: "high", label: "High" },
                    { val: "medium", label: "Medium" },
                  ] as { val: typeof filter; label: string }[]
                ).map(({ val, label }) => (
                  <Button
                    key={val}
                    variant={filter === val ? "default" : "outline"}
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setFilter(val)}
                  >
                    {label}
                  </Button>
                ))}
              </div>

              {/* Rules grid */}
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                {filtered.map((rule) => (
                  <RuleCard key={rule.id} rule={rule} />
                ))}
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
