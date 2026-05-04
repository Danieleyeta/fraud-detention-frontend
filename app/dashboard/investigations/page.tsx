"use client";

import * as React from "react";
import {
  IconSearch,
  IconUser,
  IconAlertTriangle,
  IconMessageCircle,
  IconSend,
  IconRobot,
  IconReceipt,
  IconCheck,
  IconBan,
} from "@tabler/icons-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from "recharts";
import { toast } from "sonner";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

// ── Types ────────────────────────────────────────────────────────────────────

interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: string;
  riskScore: number;
  flags: string[];
  timestamp: string;
  status: "pending" | "approved" | "blocked";
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
  timestamp: string;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const PENDING_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-00482",
    sender: "Emeka Ojukwu",
    receiver: "CryptoDesk LLC",
    amount: "₦4,850,000",
    riskScore: 94,
    flags: ["Bulk Transfer", "Velocity Spike"],
    timestamp: "10 mins ago",
    status: "pending",
  },
  {
    id: "TXN-00511",
    sender: "Aisha Bello",
    receiver: "Unknown Wallet",
    amount: "₦7,300,000",
    riskScore: 97,
    flags: ["Account Takeover Attempt"],
    timestamp: "1 hour ago",
    status: "pending",
  },
  {
    id: "TXN-00618",
    sender: "Chinedu Eze",
    receiver: "Bet9ja Account",
    amount: "₦2,100,000",
    riskScore: 82,
    flags: ["Structuring Pattern"],
    timestamp: "Just now",
    status: "pending",
  },
  {
    id: "TXN-00829",
    sender: "Ngozi Okafor",
    receiver: "Binance P2P",
    amount: "₦9,600,000",
    riskScore: 98,
    flags: ["Synthetic Identity", "Crypto Funnel"],
    timestamp: "3 hours ago",
    status: "pending",
  },
  {
    id: "TXN-01032",
    sender: "Babajide Sanwo",
    receiver: "Mule Account A",
    amount: "₦3,400,000",
    riskScore: 91,
    flags: ["ML Model Flag"],
    timestamp: "20 mins ago",
    status: "pending",
  },
];

// Mock Chart Data
const velocityData = [
  { time: "08:00", count: 1 },
  { time: "09:00", count: 2 },
  { time: "10:00", count: 1 },
  { time: "11:00", count: 15 }, // Spike!
  { time: "12:00", count: 22 },
  { time: "13:00", count: 3 },
  { time: "14:00", count: 0 },
];

const riskFactorsData = [
  { factor: "IP Anomaly", score: 85 },
  { factor: "Velocity", score: 95 },
  { factor: "Device Match", score: 40 },
  { factor: "Amount Size", score: 90 },
];

// ── Components ────────────────────────────────────────────────────────────────

function ChatChart({ type }: { type: "velocity" | "risk" }) {
  if (type === "velocity") {
    return (
      <div className="h-48 w-full mt-3 bg-background/50 rounded-lg p-2 border border-border/50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={velocityData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
            <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
            <Tooltip
              contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", fontSize: "12px" }}
              itemStyle={{ padding: 0 }}
            />
            <Area type="monotone" dataKey="count" stroke="#ef4444" fillOpacity={1} fill="url(#colorCount)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-48 w-full mt-3 bg-background/50 rounded-lg p-2 border border-border/50">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={riskFactorsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
          <XAxis dataKey="factor" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", fontSize: "12px" }}
            cursor={{ fill: "currentColor", opacity: 0.05 }}
          />
          <Bar dataKey="score" fill="#f97316" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function InvestigationsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [transactions, setTransactions] = React.useState(PENDING_TRANSACTIONS);
  const [selectedTxn, setSelectedTxn] = React.useState<Transaction | null>(null);
  const [chatInput, setChatInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  // Filter transactions based on search
  const filteredTransactions = transactions.filter(
    (t) =>
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.receiver.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Initialize chat when a transaction is selected
  React.useEffect(() => {
    if (selectedTxn) {
      setMessages([
        {
          id: "init-1",
          role: "assistant",
          content: (
            <div>
              <p>
                I have loaded the context for transaction <strong>{selectedTxn.id}</strong>.
              </p>
              <ul className="mt-2 list-disc list-inside text-sm text-muted-foreground">
                <li><strong>Amount:</strong> {selectedTxn.amount}</li>
                <li><strong>Sender:</strong> {selectedTxn.sender}</li>
                <li><strong>Receiver:</strong> {selectedTxn.receiver}</li>
                <li><strong>Risk Score:</strong> <span className="text-destructive font-bold">{selectedTxn.riskScore}</span></li>
              </ul>
              <p className="mt-2">
                This transaction triggered the following rules: {selectedTxn.flags.join(", ")}.
              </p>
              <p className="mt-2">How would you like to investigate this transfer?</p>
            </div>
          ),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedTxn]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedTxn) return;

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: chatInput,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setChatInput("");

    // Simulate AI response based on keywords
    setTimeout(() => {
      const lowerInput = newUserMsg.content?.toString().toLowerCase() || "";
      let aiContent: React.ReactNode = "I'm analyzing the transaction parameters...";

      if (lowerInput.includes("velocity") || lowerInput.includes("history") || lowerInput.includes("spike")) {
        aiContent = (
          <div>
            <p>
              I found a severe velocity spike on the sender's account. Within the last 3 hours, the account attempted 37 transactions compared to a baseline of 2 per day.
            </p>
            <ChatChart type="velocity" />
            <p className="mt-2 text-xs text-muted-foreground">
              Most of these attempts were directed towards crypto-exchanges and betting platforms.
            </p>
          </div>
        );
      } else if (lowerInput.includes("risk") || lowerInput.includes("factor") || lowerInput.includes("why")) {
        aiContent = (
          <div>
            <p>
              The high risk score ({selectedTxn.riskScore}) is driven primarily by an IP anomaly and the transaction velocity.
            </p>
            <ChatChart type="risk" />
            <p className="mt-2 text-xs text-muted-foreground">
              The device footprint matches the user's historical profile, but the IP address resolves to a known VPN exit node in Russia.
            </p>
          </div>
        );
      } else {
        aiContent = (
          <div>
            <p>
              Based on the risk profile and the receiver's history (marked as high-risk), I recommend blocking this transaction to prevent potential loss. Would you like me to show the detailed risk factors or the velocity chart?
            </p>
          </div>
        );
      }

      const newAiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: aiContent,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, newAiMsg]);
    }, 1000);
  };

  const handleAction = (action: "approved" | "blocked") => {
    if (!selectedTxn) return;

    // Remove from the local list
    setTransactions((prev) => prev.filter((t) => t.id !== selectedTxn.id));
    setSelectedTxn(null);
    
    toast.success(`Transaction ${selectedTxn.id} has been ${action}.`);
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
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Panel: Transaction List */}
          <div className="w-full md:w-80 lg:w-96 border-r flex flex-col bg-muted/10 h-[calc(100vh-var(--header-height))]">
            <div className="p-4 border-b bg-background">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <IconAlertTriangle className="size-5 text-destructive" />
                Pending Investigations
              </h2>
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search TXN ID or names..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 flex flex-col gap-2">
                {filteredTransactions.map((txn) => (
                  <button
                    key={txn.id}
                    onClick={() => setSelectedTxn(txn)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                      selectedTxn?.id === txn.id
                        ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
                        : "bg-background hover:bg-muted/50 border-transparent hover:border-border"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-bold text-sm truncate">{txn.id}</span>
                        <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                          {txn.riskScore}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1">
                        {txn.sender} → {txn.receiver}
                      </div>
                      <div className="text-sm font-semibold mb-1.5">{txn.amount}</div>
                      <div className="flex flex-wrap gap-1">
                        {txn.flags.map((flag) => (
                          <Badge key={flag} variant="secondary" className="text-[9px] px-1 py-0 h-4 font-normal">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredTransactions.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No pending transactions found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Interface */}
          <div className="flex-1 flex flex-col bg-background h-[calc(100vh-var(--header-height))] relative">
            {!selectedTxn ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconReceipt className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Transaction Investigation Chat</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a pending transaction from the list to begin an AI-assisted investigation and take action.
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="h-14 border-b flex items-center px-4 shrink-0 bg-background/95 backdrop-blur z-10 justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <h3 className="text-sm font-semibold leading-none">{selectedTxn.id}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{selectedTxn.amount}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-destructive border-destructive/30 mr-2">
                      Risk Score: {selectedTxn.riskScore}
                    </Badge>
                    <Button size="sm" variant="outline" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30" onClick={() => handleAction("approved")}>
                      <IconCheck className="size-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="h-8" onClick={() => handleAction("blocked")}>
                      <IconBan className="size-4 mr-1" /> Block
                    </Button>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="flex flex-col gap-6 pb-4 max-w-3xl mx-auto">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex gap-3 ${
                          msg.role === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div
                          className={`size-8 rounded-full flex items-center justify-center shrink-0 ${
                            msg.role === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400 border border-violet-200 dark:border-violet-800"
                          }`}
                        >
                          {msg.role === "user" ? (
                            <IconUser className="size-4" />
                          ) : (
                            <IconRobot className="size-4" />
                          )}
                        </div>
                        <div
                          className={`flex flex-col gap-1 max-w-[85%] ${
                            msg.role === "user" ? "items-end" : "items-start"
                          }`}
                        >
                          <div className="flex items-center gap-2 px-1">
                            <span className="text-xs font-medium">
                              {msg.role === "user" ? "Investigator" : "Fraud AI"}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                          </div>
                          <div
                            className={`px-4 py-3 rounded-2xl text-sm shadow-sm ${
                              msg.role === "user"
                                ? "bg-primary text-primary-foreground rounded-tr-sm"
                                : "bg-card border rounded-tl-sm text-card-foreground"
                            }`}
                          >
                            {msg.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 bg-background border-t">
                  <div className="max-w-3xl mx-auto">
                    <form
                      onSubmit={handleSendMessage}
                      className="flex items-center gap-2 bg-muted/50 border rounded-full p-1 pl-4 focus-within:ring-1 focus-within:ring-primary/50 transition-shadow"
                    >
                      <Input
                        className="flex-1 border-0 bg-transparent shadow-none focus-visible:ring-0 px-0 h-10"
                        placeholder={`Ask AI about transaction ${selectedTxn.id}...`}
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                      />
                      <Button
                        type="submit"
                        size="icon"
                        className="rounded-full size-10 shrink-0"
                        disabled={!chatInput.trim()}
                      >
                        <IconSend className="size-4 ml-0.5" />
                      </Button>
                    </form>
                    <div className="flex justify-center gap-2 mt-3">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-full" onClick={() => setChatInput("Show me the velocity history")}>
                        Check Velocity
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-full" onClick={() => setChatInput("What are the main risk factors?")}>
                        Show Risk Factors
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
