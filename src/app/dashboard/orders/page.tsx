"use client";

import { useState, useEffect, useMemo } from "react";
import { 
  Search, 
  ShoppingBag, 
  XCircle, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ChevronRight,
  Loader2,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";

const STATUS_MAP = {
  'In Progress': { color: 'text-amber-500 bg-amber-500/10', icon: Clock },
  'Completed': { color: 'text-emerald-500 bg-emerald-500/10', icon: CheckCircle2 },
  'Canceled': { color: 'text-rose-500 bg-rose-500/10', icon: XCircle },
  'Enrolled': { color: 'text-primary bg-primary/10', icon: ShoppingBag },
  'Initial Setup': { color: 'text-blue-500 bg-blue-500/10', icon: History },
  'Drafting': { color: 'text-amber-400 bg-amber-400/10', icon: Clock }
};

export default function OrderHistoryPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("marketmind_projects");
      if (saved) {
        const allProjects = JSON.parse(saved);
        // Show only active or canceled orders as requested
        const filtered = allProjects.filter((p: any) => 
          ['In Progress', 'Initial Setup', 'Drafting', 'Canceled'].includes(p.status)
        );
        setOrders(filtered);
      }
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => 
      o.name?.toLowerCase().includes(search.toLowerCase()) || 
      o.id?.toLowerCase().includes(search.toLowerCase())
    );
  }, [orders, search]);

  const stats = useMemo(() => ({
    total: orders.length,
    active: orders.filter(o => o.status !== 'Canceled' && o.status !== 'Completed').length,
    canceled: orders.filter(o => o.status === 'Canceled').length
  }), [orders]);

  if (isLoading) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">Order History</h1>
          <p className="text-muted-foreground">Audit your active and canceled marketplace service enrollments.</p>
        </div>
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2 bg-slate-900 border-white/5 flex items-center gap-6">
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Active</p>
              <p className="text-lg font-bold text-primary">{stats.active}</p>
            </div>
            <div className="w-px h-8 bg-white/5" />
            <div className="text-center">
              <p className="text-[10px] font-bold text-slate-500 uppercase">Canceled</p>
              <p className="text-lg font-bold text-rose-500">{stats.canceled}</p>
            </div>
          </Card>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <Input 
          placeholder="Search by Service Name or ID..." 
          className="pl-12 h-14 rounded-2xl bg-slate-900 border-white/5 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-white/5">
                <th className="px-8 py-4">Service Details</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4 text-center">Lifecycle Status</th>
                <th className="px-8 py-4">Timeline</th>
                <th className="px-8 py-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const config = (STATUS_MAP as any)[order.status] || STATUS_MAP['Initial Setup'];
                const Icon = config.icon;
                
                return (
                  <tr key={order.id} className="group hover:bg-primary/5 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">{order.name}</span>
                        <span className="text-[10px] text-muted-foreground font-mono uppercase tracking-tighter">{order.id}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <Badge variant="outline" className="text-[10px] border-white/10">{order.type || "Service"}</Badge>
                    </td>
                    <td className="px-8 py-5">
                      <div className={cn("flex items-center justify-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase mx-auto w-fit", config.color)}>
                        <Icon size={12} />
                        {order.status}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-xs text-muted-foreground">
                      Updated {order.updatedAt || "recently"}
                    </td>
                    <td className="px-8 py-5 text-right">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href="/dashboard/projects">
                          Details <ChevronRight size={14} className="ml-1" />
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic">
                    No active or canceled order records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <CardFooter className="p-6 bg-muted/10 flex justify-between border-t border-white/5">
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">
            MarketMind AI Fulfillment Node: AS-SOUTH-1
          </p>
          <Button variant="link" className="text-xs font-bold uppercase text-primary">
            Export Audit Log <ExternalLink size={12} className="ml-2" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}