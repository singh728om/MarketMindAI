
"use client";

import { useState } from "react";
import { 
  MessageSquare, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  MoreVertical,
  ChevronRight,
  User,
  ShieldAlert,
  Ticket
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TICKETS = [
  { id: "MM-4821", client: "CHIC ELAN", subject: "Myntra Onboarding Delay", status: "In Progress", priority: "High", time: "2h ago" },
  { id: "MM-9023", client: "Amazon Direct", subject: "API Integration Error", status: "Pending", priority: "High", time: "Just now" },
  { id: "MM-1290", client: "Vibe Fashion", subject: "Photoshoot Background Grain", status: "Resolved", priority: "Medium", time: "1 day ago" },
  { id: "MM-3341", client: "Urban Threads", subject: "SEO Refresh Frequency", status: "Resolved", priority: "Low", time: "3 days ago" },
];

export default function InternalSupportQueue() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-1 text-white">Staff Support Queue</h1>
        <p className="text-slate-400">Resolve customer queries and technical marketplace hurdles.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Open Tickets" value="12" icon={Ticket} color="text-accent" />
        <StatCard title="Urgent Help" value="4" icon={ShieldAlert} color="text-rose-500" />
        <StatCard title="Avg. Response" value="1.4h" icon={Clock} color="text-emerald-500" />
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <Input 
          placeholder="Search support tickets..." 
          className="pl-12 h-14 rounded-2xl bg-slate-900 border-white/5 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="space-y-4">
        {TICKETS.map((ticket) => (
          <Card key={ticket.id} className="bg-slate-900 border-white/5 hover:border-accent/30 transition-all group cursor-pointer">
            <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                ticket.status === 'Resolved' ? "bg-emerald-500/10 text-emerald-500" : 
                ticket.status === 'In Progress' ? "bg-amber-500/10 text-amber-500" : "bg-accent/10 text-accent"
              )}>
                {ticket.status === 'Resolved' ? <CheckCircle2 size={24} /> : 
                 ticket.status === 'In Progress' ? <Clock size={24} className="animate-pulse" /> : <AlertCircle size={24} />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">{ticket.id}</span>
                  <Badge variant={ticket.priority === 'High' ? 'destructive' : 'secondary'} className="text-[8px] h-4">
                    {ticket.priority} PRIORITY
                  </Badge>
                </div>
                <h3 className="font-bold font-headline text-lg text-white group-hover:text-accent transition-colors">{ticket.subject}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <User size={12} /> {ticket.client}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock size={12} /> Received {ticket.time}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button className="bg-accent text-accent-foreground font-bold rounded-lg h-9 px-4">
                  Reply
                </Button>
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <Card className="bg-slate-900 border-white/5">
      <CardContent className="p-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{title}</p>
          <h3 className="text-3xl font-headline font-bold text-white">{value}</h3>
        </div>
        <div className={cn("w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center", color)}>
          <Icon size={24} />
        </div>
      </CardContent>
    </Card>
  );
}
