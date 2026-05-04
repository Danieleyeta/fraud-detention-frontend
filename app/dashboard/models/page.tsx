"use client";

import * as React from "react";
import {
  IconBrain,
  IconCheck,
  IconServer,
  IconClock,
  IconChartLine,
  IconRocket,
  IconShieldCheck,
  IconAlertCircle,
  IconTrendingUp,
  IconTrendingDown,
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
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// ── Types ────────────────────────────────────────────────────────────────────

interface ModelMetrics {
  precision: number;
  recall: number;
  f1Score: number;
  latencyMs: number;
  transactionsProcessed: number;
  falsePositiveRate: number;
}

interface AIModel {
  id: string;
  name: string;
  version: string;
  architecture: string;
  status: "active" | "testing" | "queued";
  trainedOn: string; // e.g. "2M transactions (Jan-Mar)"
  metrics: ModelMetrics;
  baselineDiffs?: Partial<ModelMetrics>; // Difference compared to baseline/active
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const ACTIVE_MODEL: AIModel = {
  id: "model-xg-v2.4",
  name: "XGBoost Core Ensemble",
  version: "v2.4.1",
  architecture: "XGBoost + TabNet",
  status: "active",
  trainedOn: "14.5M transactions (Q3-Q4)",
  metrics: {
    precision: 0.94,
    recall: 0.88,
    f1Score: 0.91,
    latencyMs: 42,
    transactionsProcessed: 1245000,
    falsePositiveRate: 0.045,
  },
};

const QUEUED_MODELS: AIModel[] = [
  {
    id: "model-nn-v3.0-rc1",
    name: "Deep Fraud Net",
    version: "v3.0.0-rc1",
    architecture: "PyTorch Deep Neural Network",
    status: "testing",
    trainedOn: "16M transactions + New Nigerian IP Features",
    metrics: {
      precision: 0.96,
      recall: 0.92,
      f1Score: 0.94,
      latencyMs: 55,
      transactionsProcessed: 250000, // in shadow mode
      falsePositiveRate: 0.031,
    },
    baselineDiffs: {
      precision: +0.02,
      recall: +0.04,
      f1Score: +0.03,
      latencyMs: +13,
      falsePositiveRate: -0.014,
    },
  },
  {
    id: "model-lg-v1.8",
    name: "LightGBM Fast Responder",
    version: "v1.8.2",
    architecture: "LightGBM",
    status: "queued",
    trainedOn: "14.5M transactions (Q3-Q4)",
    metrics: {
      precision: 0.92,
      recall: 0.85,
      f1Score: 0.88,
      latencyMs: 18,
      transactionsProcessed: 50000,
      falsePositiveRate: 0.052,
    },
    baselineDiffs: {
      precision: -0.02,
      recall: -0.03,
      f1Score: -0.03,
      latencyMs: -24,
      falsePositiveRate: +0.007,
    },
  },
  {
    id: "model-rf-v2.1",
    name: "Random Forest Baseline",
    version: "v2.1.0",
    architecture: "Random Forest",
    status: "queued",
    trainedOn: "12M transactions (Q1-Q3)",
    metrics: {
      precision: 0.89,
      recall: 0.82,
      f1Score: 0.85,
      latencyMs: 35,
      transactionsProcessed: 10000,
      falsePositiveRate: 0.065,
    },
    baselineDiffs: {
      precision: -0.05,
      recall: -0.06,
      f1Score: -0.06,
      latencyMs: -7,
      falsePositiveRate: +0.02,
    },
  },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtPercent(val: number) {
  return `${(val * 100).toFixed(1)}%`;
}

function fmtNumber(val: number) {
  return val.toLocaleString();
}

function MetricDiff({ diff, inverse = false }: { diff?: number; inverse?: boolean }) {
  if (diff === undefined || diff === 0) return null;
  const isPositiveChange = diff > 0;
  // For latency and FPR, going down is "good", so we inverse the color logic.
  const isGood = inverse ? !isPositiveChange : isPositiveChange;
  
  return (
    <div
      className={`flex items-center text-[10px] font-medium ml-1.5 ${
        isGood ? "text-green-600 dark:text-green-400" : "text-destructive"
      }`}
    >
      {isPositiveChange ? <IconTrendingUp className="size-3 mr-0.5" /> : <IconTrendingDown className="size-3 mr-0.5" />}
      {isPositiveChange ? "+" : ""}
      {Math.abs(diff * 100) < 1 ? diff : fmtPercent(Math.abs(diff))}
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function AIModelsPage() {
  const [activeModel, setActiveModel] = React.useState(ACTIVE_MODEL);
  const [queuedModels, setQueuedModels] = React.useState(QUEUED_MODELS);
  const [isDeploying, setIsDeploying] = React.useState<string | null>(null);

  const handleDeploy = (modelId: string) => {
    setIsDeploying(modelId);
    
    // Simulate deployment delay
    setTimeout(() => {
      const modelToDeploy = queuedModels.find(m => m.id === modelId);
      if (modelToDeploy) {
        // Move current active to queue
        const prevActive = { ...activeModel, status: "queued" as const, baselineDiffs: {} };
        // Clean up the newly deployed model's diffs
        const newActive = { ...modelToDeploy, status: "active" as const, baselineDiffs: undefined };
        
        setActiveModel(newActive);
        
        // Re-calculate diffs for the queue against the new active model
        const newQueue = queuedModels
          .filter(m => m.id !== modelId)
          .concat(prevActive)
          .map(m => ({
            ...m,
            baselineDiffs: {
              precision: m.metrics.precision - newActive.metrics.precision,
              recall: m.metrics.recall - newActive.metrics.recall,
              f1Score: m.metrics.f1Score - newActive.metrics.f1Score,
              latencyMs: m.metrics.latencyMs - newActive.metrics.latencyMs,
              falsePositiveRate: m.metrics.falsePositiveRate - newActive.metrics.falsePositiveRate,
            }
          }));
          
        setQueuedModels(newQueue);
        toast.success(`Successfully deployed ${newActive.name} (${newActive.version})`);
      }
      setIsDeploying(null);
    }, 1500);
  };

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
                <h2 className="text-xl font-semibold">AI Models Management</h2>
                <p className="text-sm text-muted-foreground">
                  Monitor the actively deployed fraud detection model and manage the deployment of newly trained challenger models.
                </p>
              </div>

              {/* Currently Running Model */}
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <IconServer className="size-5 text-primary" />
                  Currently Running Model
                </h3>
                <Card className="border-primary/20 bg-primary/5 shadow-sm">
                  <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-primary/10 rounded-lg shrink-0">
                          <IconBrain className="size-8 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-xl">{activeModel.name}</CardTitle>
                            <Badge className="bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30">
                              Active
                            </Badge>
                            <Badge variant="outline">{activeModel.version}</Badge>
                          </div>
                          <CardDescription>
                            Architecture: <strong>{activeModel.architecture}</strong> • Trained on: {activeModel.trainedOn}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground mb-1">Transactions Processed</div>
                        <div className="text-2xl font-bold tabular-nums">
                          {fmtNumber(activeModel.metrics.transactionsProcessed)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <Separator className="bg-primary/10" />
                  <CardContent className="pt-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <IconCheck className="size-4" /> Precision
                        </span>
                        <span className="text-2xl font-semibold tabular-nums">{fmtPercent(activeModel.metrics.precision)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <IconChartLine className="size-4" /> Recall
                        </span>
                        <span className="text-2xl font-semibold tabular-nums">{fmtPercent(activeModel.metrics.recall)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <IconShieldCheck className="size-4" /> F1 Score
                        </span>
                        <span className="text-2xl font-semibold tabular-nums">{fmtPercent(activeModel.metrics.f1Score)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <IconAlertCircle className="size-4" /> False Positive Rate
                        </span>
                        <span className="text-2xl font-semibold tabular-nums">{fmtPercent(activeModel.metrics.falsePositiveRate)}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                          <IconClock className="size-4" /> Avg Latency
                        </span>
                        <span className="text-2xl font-semibold tabular-nums">{activeModel.metrics.latencyMs} ms</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Model Queue */}
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                  <IconRocket className="size-5 text-muted-foreground" />
                  Model Queue & Challenger Models
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {queuedModels.map((model) => (
                    <Card key={model.id} className="flex flex-col overflow-hidden">
                      <div className="flex flex-col md:flex-row border-b">
                        {/* Info Section */}
                        <div className="flex-1 p-5 border-r md:max-w-xs xl:max-w-sm flex flex-col justify-between">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <h4 className="font-semibold text-base">{model.name}</h4>
                              <Badge variant="outline" className="text-xs">{model.version}</Badge>
                              {model.status === "testing" && (
                                <Badge variant="secondary" className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20">Shadow Testing</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                              {model.architecture}<br/>
                              <span className="opacity-70">Trained on: {model.trainedOn}</span>
                            </p>
                          </div>
                          
                          <Button 
                            className="w-full mt-4" 
                            disabled={isDeploying !== null}
                            onClick={() => handleDeploy(model.id)}
                          >
                            {isDeploying === model.id ? "Deploying..." : "Override Active Model"}
                          </Button>
                        </div>
                        
                        {/* Metrics Section */}
                        <div className="flex-1 p-5 bg-muted/10">
                          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 h-full content-center">
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-1">Precision</span>
                              <div className="flex items-end">
                                <span className="text-lg font-semibold tabular-nums">{fmtPercent(model.metrics.precision)}</span>
                                <MetricDiff diff={model.baselineDiffs?.precision} />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-1">Recall</span>
                              <div className="flex items-end">
                                <span className="text-lg font-semibold tabular-nums">{fmtPercent(model.metrics.recall)}</span>
                                <MetricDiff diff={model.baselineDiffs?.recall} />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-1">F1 Score</span>
                              <div className="flex items-end">
                                <span className="text-lg font-semibold tabular-nums">{fmtPercent(model.metrics.f1Score)}</span>
                                <MetricDiff diff={model.baselineDiffs?.f1Score} />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-1">FP Rate</span>
                              <div className="flex items-end">
                                <span className="text-lg font-semibold tabular-nums">{fmtPercent(model.metrics.falsePositiveRate)}</span>
                                <MetricDiff diff={model.baselineDiffs?.falsePositiveRate} inverse />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground mb-1">Latency</span>
                              <div className="flex items-end">
                                <span className="text-lg font-semibold tabular-nums">{model.metrics.latencyMs} ms</span>
                                <MetricDiff diff={model.baselineDiffs?.latencyMs} inverse />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
