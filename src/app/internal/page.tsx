"use client";

import { 
  Users, 
  ClipboardList, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  AlertCircle,
  ArrowUpRight,
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

const STATS = [
  { title: "Active Projects", value: "24", sub: "+3 today", icon: ClipboardList, color: "text-blue-500" },
  { title: "Pending Tickets", value: "12", sub: "4 urgent", icon: AlertCircle, color: "text-amber-500" },
  { title: "Fulfilled Orders", value: "142", sub: "Oct 2023", icon: CheckCircle2, color: "text-emerald-500" },
  { title: "System Uptime", value: "99.9%", sub: "Gemini 1.5 Pro", icon: Activity, color: "text-purple-500" },
];

const RECENT_ORDERS = [
  { id: "ORD-8821", client: "CHIC ELAN", service: "Myntra Onboarding", status: "In Progress", urgency: "High" },
  { id: "ORD-8822", client: "Vibe Fashion", service: "AI Photoshoot", status: "Pending", urgency: "Medium" },
  { id: "ORD-8823", client: "Urban Threads", service: "Listing Creation", status: "Completed", urgency: "Low" },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-1">Operations Overview</h1>
        <p className="text-slate-400">Welcome back, Admin. Here's what needs your attention today.</p>
      </div>

      {/* High Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATS.map((stat) => (
          <Card key={stat.title} className="bg-slate-900 border-white/5 hover:border-accent/30 transition-all">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[10px]">{stat.sub}</Badge>
              </div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{stat.title}</p>
              <h3 className="text-3xl font-headline font-bold text-white">{stat.value}</h3>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Queue */}
        <Card className="lg:col-span-2 bg-slate-900 border-white/5">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <div>
              <CardTitle className="text-xl font-headline font-bold">Priority Service Queue</CardTitle>
              <CardDescription className="text-slate-400">Client orders awaiting fulfillment or action.</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="bg-slate-800 border-white/5 text-xs h-8">View All Orders</Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-800/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-white/5">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Client / Brand</th>
                    <th className="px-6 py-4">Requested Service</th>
                    <th className="px-6 py-4">Urgency</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {RECENT_ORDERS.map((order) => (
                    <tr key={order.id} className="hover:bg-accent/5 transition-colors group">
                      <td className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-accent">{order.id}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-bold text-sm text-slate-200">{order.client}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-400">{order.service}</span>
                      </td>
                      <td className="px-6 py-4">
                        <Badge className={cn(
                          "text-[10px] font-bold uppercase",
                          order.urgency === 'High' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
                          order.urgency === 'Medium' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : 
                          "bg-slate-800 text-slate-400"
                        )}>
                          {order.urgency}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full hover:bg-accent hover:text-accent-foreground">
                          <ArrowUpRight size={14} />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* System Health / Gemini */}
        <div className="space-y-6">
          <Card className="bg-slate-900 border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline font-bold">AI Node Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Gemini 1.5 API Quota</span>
                  <span className="text-accent font-bold">72% Available</span>
                </div>
                <Progress value={72} className="h-1.5 bg-slate-800" />
              </div>
              
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-3">
                <div className="flex items-center gap-2 text-accent font-bold text-xs uppercase tracking-widest">
                  <TrendingUp size={14} /> Efficiency Tip
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Bulk listings for "Fashion" category are currently processing 15% faster using the optimized SEO prompt v2.4.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-white/5">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline font-bold">Staff Broadcast</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0 mt-1.5 shadow-[0_0_8px_rgba(244,63,94,0.5)]" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">Myntra Maintenance</p>
                  <p className="text-[10px] text-slate-500">API sync will be down from 2 AM to 4 AM IST.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 mt-1.5" />
                <div className="space-y-1">
                  <p className="text-xs font-bold text-white">New AI Model Deployed</p>
                  <p className="text-[10px] text-slate-500">Photoshoot v3 is now active for all Ethnic wear.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
