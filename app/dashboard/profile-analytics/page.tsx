"use client";

import * as React from "react";
import {
  IconSearch,
  IconUser,
  IconAlertTriangle,
  IconMessageCircle,
  IconSend,
  IconRobot,
  IconUserShield,
  IconChartBar,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// ── Types ────────────────────────────────────────────────────────────────────

interface Client {
  id: string;
  name: string;
  accountNumber: string;
  riskScore: number;
  flags: string[];
  lastActive: string;
  avatarInitials: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: React.ReactNode;
  timestamp: string;
}

// ── Seed Data ─────────────────────────────────────────────────────────────────

const SUSPICIOUS_CLIENTS: Client[] = [
  {
    id: "c-1001",
    name: "Emeka Ojukwu",
    accountNumber: "0234918822",
    riskScore: 94,
    flags: ["Velocity Spike", "IP Anomaly"],
    lastActive: "10 mins ago",
    avatarInitials: "EO",
  },
  {
    id: "c-1002",
    name: "Aisha Bello",
    accountNumber: "0182736455",
    riskScore: 88,
    flags: ["Large Amount", "Structuring"],
    lastActive: "1 hour ago",
    avatarInitials: "AB",
  },
  {
    id: "c-1003",
    name: "Chinedu Eze",
    accountNumber: "0099887766",
    riskScore: 97,
    flags: ["Account Takeover", "Crypto Funnel"],
    lastActive: "Just now",
    avatarInitials: "CE",
  },
  {
    id: "c-1004",
    name: "Ngozi Okafor",
    accountNumber: "0123456789",
    riskScore: 82,
    flags: ["Dormant Reactivation"],
    lastActive: "3 hours ago",
    avatarInitials: "NO",
  },
  {
    id: "c-1005",
    name: "Babajide Sanwo",
    accountNumber: "0456123789",
    riskScore: 91,
    flags: ["Cross-Border Wash", "Multiple Devices"],
    lastActive: "20 mins ago",
    avatarInitials: "BS",
  },
];

// Mock Chart Data
const transactionVolumeData = [
  { time: "Mon", incoming: 120, outgoing: 15 },
  { time: "Tue", incoming: 150, outgoing: 20 },
  { time: "Wed", incoming: 80, outgoing: 10 },
  { time: "Thu", incoming: 450, outgoing: 420 }, // Spike!
  { time: "Fri", incoming: 50, outgoing: 45 },
  { time: "Sat", incoming: 10, outgoing: 5 },
  { time: "Sun", incoming: 0, outgoing: 0 },
];

const geoActivityData = [
  { country: "Nigeria", count: 45 },
  { country: "UAE", count: 12 },
  { country: "UK", count: 8 },
  { country: "Russia", count: 3 }, // Suspicious
];

// ── Components ────────────────────────────────────────────────────────────────

function ChatChart({ type }: { type: "volume" | "geo" }) {
  if (type === "volume") {
    return (
      <div className="h-48 w-full mt-3 bg-background/50 rounded-lg p-2 border border-border/50">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={transactionVolumeData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorIncoming" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorOutgoing" x1="0" y1="0" x2="0" y2="1">
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
            <Area type="monotone" dataKey="incoming" stroke="#3b82f6" fillOpacity={1} fill="url(#colorIncoming)" />
            <Area type="monotone" dataKey="outgoing" stroke="#ef4444" fillOpacity={1} fill="url(#colorOutgoing)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
    <div className="h-48 w-full mt-3 bg-background/50 rounded-lg p-2 border border-border/50">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={geoActivityData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="opacity-10" />
          <XAxis dataKey="country" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
          <Tooltip
            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", fontSize: "12px" }}
            cursor={{ fill: "currentColor", opacity: 0.05 }}
          />
          <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ── Page Component ────────────────────────────────────────────────────────────

export default function ProfileAnalyticsPage() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [clients, setClients] = React.useState(SUSPICIOUS_CLIENTS);
  const [selectedClient, setSelectedClient] = React.useState<Client | null>(null);
  const [chatInput, setChatInput] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);

  // Filter clients based on search
  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.accountNumber.includes(searchQuery)
  );

  // Initialize chat when a client is selected
  React.useEffect(() => {
    if (selectedClient) {
      setMessages([
        {
          id: "init-1",
          role: "assistant",
          content: (
            <div>
              <p>
                I have loaded the profile for <strong>{selectedClient.name}</strong> (Account:{" "}
                {selectedClient.accountNumber}).
              </p>
              <p className="mt-2">
                This account currently has a <strong>Critical Risk Score of {selectedClient.riskScore}</strong>. 
                Recent flags include: {selectedClient.flags.join(", ")}.
              </p>
              <p className="mt-2">How would you like to proceed with this investigation?</p>
            </div>
          ),
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } else {
      setMessages([]);
    }
  }, [selectedClient]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || !selectedClient) return;

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
      let aiContent: React.ReactNode = "I'm analyzing the transaction patterns...";

      if (lowerInput.includes("transaction") || lowerInput.includes("volume") || lowerInput.includes("spike")) {
        aiContent = (
          <div>
            <p>
              I found a massive anomaly in transaction volume occurring last Thursday. There was an incoming transfer of ₦450k immediately followed by multiple outgoing transfers totaling ₦420k.
            </p>
            <ChatChart type="volume" />
            <p className="mt-2 text-xs text-muted-foreground">
              This rapid in-and-out pattern strongly indicates layering or smurfing behaviour.
            </p>
          </div>
        );
      } else if (lowerInput.includes("location") || lowerInput.includes("geo") || lowerInput.includes("ip")) {
        aiContent = (
          <div>
            <p>
              Analyzing the IP logs for the past 7 days, there are logins from unexpected jurisdictions that do not match the account's historical baseline.
            </p>
            <ChatChart type="geo" />
            <p className="mt-2 text-xs text-muted-foreground">
              The logins from Russia align with the timing of the suspicious outgoing transfers.
            </p>
          </div>
        );
      } else {
        aiContent = (
          <div>
            <p>
              Based on the risk profile, I recommend restricting the account pending KYC verification. Would you like me to pull the device fingerprint logs or show the geographical login history?
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

  const handleAction = (action: "approved" | "blacklisted") => {
    if (!selectedClient) return;

    setClients((prev) => prev.filter((c) => c.id !== selectedClient.id));
    setSelectedClient(null);
    
    toast.success(`Profile for ${selectedClient.name} has been ${action}.`);
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
          
          {/* Left Panel: Client List */}
          <div className="w-full md:w-80 lg:w-96 border-r flex flex-col bg-muted/10 h-[calc(100vh-var(--header-height))]">
            <div className="p-4 border-b bg-background">
              <h2 className="font-semibold mb-3 flex items-center gap-2">
                <IconAlertTriangle className="size-5 text-destructive" />
                Suspicious Profiles
              </h2>
              <div className="relative">
                <IconSearch className="absolute left-2.5 top-2.5 size-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search name or account..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="p-3 flex flex-col gap-2">
                {filteredClients.map((client) => (
                  <button
                    key={client.id}
                    onClick={() => setSelectedClient(client)}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-left transition-colors ${
                      selectedClient?.id === client.id
                        ? "bg-primary/10 border-primary/30 ring-1 ring-primary/20"
                        : "bg-background hover:bg-muted/50 border-transparent hover:border-border"
                    }`}
                  >
                    <Avatar className="size-10 border bg-muted">
                      <AvatarFallback className="text-xs font-medium">
                        {client.avatarInitials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="font-medium text-sm truncate">{client.name}</span>
                        <span className="text-[10px] font-bold text-destructive bg-destructive/10 px-1.5 py-0.5 rounded">
                          {client.riskScore}
                        </span>
                      </div>
                      <div className="text-xs text-muted-foreground mb-1.5 font-mono">
                        {client.accountNumber}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {client.flags.map((flag) => (
                          <Badge key={flag} variant="secondary" className="text-[9px] px-1 py-0 h-4 font-normal">
                            {flag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </button>
                ))}
                {filteredClients.length === 0 && (
                  <div className="p-8 text-center text-sm text-muted-foreground">
                    No clients found.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Panel: Chat Interface */}
          <div className="flex-1 flex flex-col bg-background h-[calc(100vh-var(--header-height))] relative">
            {!selectedClient ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconUserShield className="size-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Profile Investigation Chat</h3>
                <p className="text-muted-foreground max-w-md">
                  Select a suspicious client from the list to begin an AI-assisted investigation into their account activities, transaction history, and risk indicators.
                </p>
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="h-14 border-b flex items-center px-4 shrink-0 bg-background/95 backdrop-blur z-10 justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="size-8">
                      <AvatarFallback className="text-xs">{selectedClient.avatarInitials}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-sm font-semibold leading-none">{selectedClient.name}</h3>
                      <p className="text-xs text-muted-foreground mt-1">Investigation Context Active</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-destructive border-destructive/30 mr-2">
                      Risk Score: {selectedClient.riskScore}
                    </Badge>
                    <Button size="sm" variant="outline" className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-950/30" onClick={() => handleAction("approved")}>
                      <IconCheck className="size-4 mr-1" /> Approve
                    </Button>
                    <Button size="sm" variant="destructive" className="h-8" onClick={() => handleAction("blacklisted")}>
                      <IconBan className="size-4 mr-1" /> Blacklist
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
                        placeholder={`Ask AI about ${selectedClient.name}'s transactions, locations, or flags...`}
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
                      <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-full" onClick={() => setChatInput("Show me recent transaction volume anomalies")}>
                        Show volume anomalies
                      </Button>
                      <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-full" onClick={() => setChatInput("Where are the recent logins originating from?")}>
                        Check IP locations
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
