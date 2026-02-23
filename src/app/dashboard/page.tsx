
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  Plus,
  Zap,
  FileText,
  Clock,
  Sparkles,
  X,
  Ticket,
  Loader2,
  Video,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Target,
  History,
  ShoppingBag,
  XCircle
} from "lucide-react";
import { 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { query, collection, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useFirestore, useUser, useMemoFirebase } from "@/firebase";
import { KPI_DATA as STATIC_KPI, PERFORMANCE_CHART, ACTIVITY_FEED } from "@/lib/mock-data";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export default function Dashboard() {
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [ceoAnalysis, setCeoAnalysis] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  const [orderStats, setOrderStats] = useState({ enrolled: 0, canceled: 0, active: 0 });
  const router = useRouter();
  const db = useFirestore();
  const { user } = useUser();

  // Load Order Stats from localStorage
  useEffect(() => {
    try {
      const projectsStr = localStorage.getItem("marketmind_projects");
      if (projectsStr) {
        const projects = JSON.parse(projectsStr);
        const enrolled = projects.length;
        const active = projects.filter((p: any) => p.status === 'In Progress' || p.status === 'Initial Setup').length;
        // Mock canceled count since deletion usually removes from local list in this prototype
        // We'll simulate a persistent canceled count for the UI
        setOrderStats({
          enrolled: enrolled + 2, // simulation
          active: active,
          canceled: 1 // simulation
        });
      } else {
        setOrderStats({ enrolled: 2, active: 2, canceled: 0 });
      }
    } catch (e) {
      console.error("Failed to load order stats", e);
    }
  }, []);

  // Fetch latest AI CEO Analysis from Firestore
  useEffect(() => {
    if (!db || !user) return;

    const analysesRef = collection(db, "ceoAnalyses");
    const q = query(
      analysesRef,
      where("userProfileId", "==", user.uid),
      orderBy("createdAt", "desc"),
      limit(1)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        setCeoAnalysis(snapshot.docs[0].data());
      }
      setIsLoadingAnalysis(false);
    }, async (err) => {
      const permissionError = new FirestorePermissionError({
        path: analysesRef.path,
        operation: 'list',
      } satisfies SecurityRuleContext);
      
      errorEmitter.emit('permission-error', permissionError);
      setIsLoadingAnalysis(false);
    });

    return () => unsubscribe();
  }, [db, user]);

  const kpis = useMemo(() => {
    if (!ceoAnalysis) return STATIC_KPI;
    const m = ceoAnalysis.metrics;
    return [
      { title: "Total Sales", value: `₹${((m.totalSales || 0) / 100000).toFixed(1)}L`, change: "+12.5%", trend: "up" },
      { title: "CTR", value: `${m.ctr || 0}%`, change: "+0.4%", trend: "up" },
      { title: "Return Rate", value: `${m.returnRate || 0}%`, change: (m.returnRate || 0) > 20 ? "+2.1%" : "-0.2%", trend: (m.returnRate || 0) > 20 ? "up" : "down" },
      { title: "ROAS", value: `${m.roas || 0}x`, change: "+0.5x", trend: "up" }
    ];
  }, [ceoAnalysis]);

  return (
    <div className="space-y-8">
      {/* Trial Period Banner */}
      {showTrialBanner && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 border border-primary/20 p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 p-4">
            <button className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors" onClick={() => setShowTrialBanner(false)}>
              <X size={16} className="text-muted-foreground" />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
              <Clock size={32} className="animate-pulse" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Trial Active</span>
                <h2 className="text-xl font-headline font-bold">7 Days Remaining in Your Free Trial</h2>
              </div>
              <p className="text-muted-foreground max-w-2xl">
                Experience the full power of MarketMind AI. Upgrade now to unlock unlimited AI Photoshoots, bulk catalog automation, and advanced growth intelligence.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/pricing">
                <Button size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-bold">
                  <Sparkles size={14} className="mr-2" /> Upgrade to Premium
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-headline font-bold text-white">Brand Overview</h1>
            {ceoAnalysis && (
              <Badge variant="outline" className="bg-amber-500/10 text-amber-500 border-amber-500/30 font-bold text-[10px] uppercase tracking-tighter">
                <Briefcase size={10} className="mr-1" /> Powered by AI CEO Analysis
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Welcome back. Performance is {ceoAnalysis ? `calibrated for ${ceoAnalysis.marketplace}` : 'up 12% this week'}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/agents?agent=ceo">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black font-bold">
              <RefreshCw className="w-4 h-4 mr-2" /> Re-run CEO Analysis
            </Button>
          </Link>
          <Link href="/dashboard/projects">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi) => (
          <Card key={kpi.title} className="rounded-2xl border-white/5 bg-card overflow-hidden">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">{kpi.title}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold font-headline">{kpi.value}</h3>
                <div className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${
                  kpi.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
                  {kpi.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Performance Chart / CEO Insights */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="font-headline">Weekly Sales & CTR</CardTitle>
              <CardDescription>Correlation between ads and direct conversion.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={PERFORMANCE_CHART}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: 'hsl(var(--muted-foreground))', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: 'hsl(var(--card))', borderColor: 'hsl(var(--border))', borderRadius: '12px'}}
                      itemStyle={{color: 'hsl(var(--foreground))'}}
                    />
                    <Area type="monotone" dataKey="sales" stroke="hsl(var(--primary))" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {ceoAnalysis && (
            <Card className="rounded-3xl border-amber-500/20 bg-amber-500/5 overflow-hidden">
              <CardHeader className="bg-amber-500/10 border-b border-amber-500/10">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl font-headline font-bold text-amber-500 flex items-center gap-2">
                    <Zap size={20} /> AI CEO Strategic Briefing
                  </CardTitle>
                  <Badge className="bg-amber-500 text-black text-[10px]">{ceoAnalysis.marketplace} Insights</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="p-4 rounded-xl bg-black/40 border border-white/5">
                  <p className="text-sm text-slate-300 leading-relaxed font-medium italic">"{ceoAnalysis.summary}"</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} className="text-rose-500" /> Critical Leakage Identified
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ceoAnalysis.leakageInsights && ceoAnalysis.leakageInsights.map((leak: any, i: number) => (
                      <div key={i} className="flex flex-col p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                        <span className="text-xs font-bold text-rose-500 uppercase mb-1">{leak.reason}</span>
                        <span className="text-sm text-slate-200 font-medium">{leak.impact}</span>
                      </div>
                    ))}
                    {!ceoAnalysis.leakageInsights?.length && (
                      <div className="col-span-2 text-center py-4 text-slate-500 text-xs italic">
                        No critical style-level leakage detected in this report cycle.
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4 pt-4">
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Target size={14} className="text-emerald-500" /> High-Impact Recommendations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {ceoAnalysis.recommendations?.map((rec: string, i: number) => (
                      <div key={i} className="flex gap-3 p-4 bg-slate-900/50 rounded-2xl text-xs border border-white/5 hover:border-amber-500/30 transition-colors">
                        <CheckCircle2 className="text-amber-500 size-4 shrink-0 mt-0.5" />
                        <span className="text-slate-200">{rec}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Actions & Feed */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline">Service Fulfillment Stats</CardTitle>
              <CardDescription>Order History Overview</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <ShoppingBag size={16} className="text-primary mb-1" />
                  <span className="text-lg font-bold">{orderStats.enrolled}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Enrolled</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <CheckCircle2 size={16} className="text-emerald-500 mb-1" />
                  <span className="text-lg font-bold">{orderStats.active}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Active</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <XCircle size={16} className="text-rose-500 mb-1" />
                  <span className="text-lg font-bold">{orderStats.canceled}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Canceled</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-wider text-primary hover:bg-primary/5" asChild>
                <Link href="/dashboard/orders">View Full History <ChevronRight size={14} className="ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Button variant="secondary" className="w-full justify-start h-12 rounded-xl group" asChild>
                <Link href="/dashboard/agents?agent=ceo">
                  <Briefcase className="w-5 h-5 mr-3 text-amber-500" /> AI CEO Analysis
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start h-12 rounded-xl group" asChild>
                <Link href="/dashboard/agents?agent=listing">
                  <FileText className="w-5 h-5 mr-3 text-primary" /> AI Listing Agent
                </Link>
              </Button>
              <Button variant="secondary" className="w-full justify-start h-12 rounded-xl group" asChild>
                <Link href="/dashboard/agents?agent=video">
                  <Video className="w-5 h-5 mr-3 text-rose-500" /> AI UGC Ads
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline text-white">Financial Pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <span className="text-xs text-emerald-500 font-bold uppercase tracking-widest">Est. Profit</span>
                <span className="font-bold text-emerald-500">₹{ceoAnalysis ? ((ceoAnalysis.metrics?.profit || 0) / 100000).toFixed(1) : '8.4'}L</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <span className="text-xs text-rose-500 font-bold uppercase tracking-widest">Est. Loss</span>
                <span className="font-bold text-rose-500">₹{ceoAnalysis ? ((ceoAnalysis.metrics?.loss || 0) / 100000).toFixed(1) : '1.2'}L</span>
              </div>
              {!ceoAnalysis && (
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
                  <AlertCircle className="text-amber-500 size-4 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-500 leading-relaxed">
                    Upload Sales & Returns reports in the AI Studio to calculate real-time Profit/Loss and identify leakage.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline">Activity Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {ACTIVITY_FEED.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between group">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.status === 'Completed' ? 'bg-emerald-500' : 
                      activity.status === 'Running' ? 'bg-amber-500 animate-pulse' : 'bg-muted'
                    }`} />
                    <div>
                      <p className="text-sm font-medium">{activity.name}</p>
                      <p className="text-xs text-muted-foreground">{activity.type} • {activity.time}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
