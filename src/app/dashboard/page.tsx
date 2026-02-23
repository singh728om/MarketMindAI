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
  Loader2,
  Video,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Target,
  ShoppingBag,
  XCircle,
  ChevronRight,
  BarChart3,
  Search,
  ArrowRight,
  ShieldCheck,
  Activity,
  MousePointer2,
  ZapOff,
  Flame
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
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { query, collection, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { KPI_DATA as STATIC_KPI, PERFORMANCE_CHART, ACTIVITY_FEED } from "@/lib/mock-data";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const [ceoAnalysis, setCeoAnalysis] = useState<any>(null);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(true);
  const [orderStats, setOrderStats] = useState({ enrolled: 0, canceled: 0, active: 0 });
  const [hasMounted, setHasMounted] = useState(false);
  
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;
    const loadStats = () => {
      try {
        const projectsStr = localStorage.getItem("marketmind_projects");
        if (projectsStr) {
          const projects = JSON.parse(projectsStr);
          const enrolled = projects.length;
          const active = projects.filter((p: any) => p.status !== 'Canceled' && p.status !== 'Completed').length;
          const canceled = projects.filter((p: any) => p.status === 'Canceled').length;
          setOrderStats({ enrolled, active, canceled });
        }
      } catch (e) {
        console.error("Failed to load order stats", e);
      }
    };

    loadStats();
    window.addEventListener('storage', loadStats);
    return () => window.removeEventListener('storage', loadStats);
  }, [hasMounted]);

  useEffect(() => {
    if (isUserLoading || !hasMounted || !user || !db) {
      if (!isUserLoading && !user) setIsLoadingAnalysis(false);
      return;
    }

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
    }, (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: analysesRef.path,
        operation: 'list',
      }));
      setIsLoadingAnalysis(false);
    });

    return () => unsubscribe();
  }, [db, user, isUserLoading, hasMounted]);

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

  if (!hasMounted || (isLoadingAnalysis && isUserLoading)) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
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
              <Button size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-bold text-white" asChild>
                <Link href="/pricing">
                  <Sparkles size={14} className="mr-2" /> Upgrade to Premium
                </Link>
              </Button>
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
                <Briefcase size={10} className="mr-1" /> Powered by Astra Intelligence
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground">Welcome back. Performance is {ceoAnalysis ? `calibrated for ${ceoAnalysis.marketplace}` : 'up 12% this week'}.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20" asChild>
            <Link href="/dashboard/ceo-hub">
              <RefreshCw className="w-4 h-4 mr-2" /> Run Audit
            </Link>
          </Button>
          <Button size="sm" variant="outline" className="border-white/5 bg-slate-900 text-white shadow-lg shadow-primary/20" asChild>
            <Link href="/dashboard/projects">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Link>
          </Button>
        </div>
      </div>

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
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline">Weekly Sales & CTR</CardTitle>
                  <CardDescription>Correlation between ads and direct conversion.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                  <Activity size={12} className="mr-1" /> Live Sync
                </Badge>
              </div>
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-white/5 bg-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <BarChart3 className="text-primary" size={18} /> Category Benchmark
                </CardTitle>
                <CardDescription>Performance vs. Marketplace Average</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {[
                  { label: "Price Competitiveness", value: 82, color: "bg-emerald-500" },
                  { label: "Listing Quality Score", value: 64, color: "bg-amber-500" },
                  { label: "Review Velocity", value: 45, color: "bg-primary" }
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-1.5" />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-muted/10 p-4">
                <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary" asChild>
                  <Link href="/dashboard/growth">View Competitor Intel <ArrowRight size={12} className="ml-1" /></Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-2xl border-white/5 bg-card overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <TrendingUp className="text-emerald-500" size={18} /> Revenue Potential
                </CardTitle>
                <CardDescription>Monthly Growth Opportunities</CardDescription>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center justify-center min-h-[120px] text-center">
                <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Estimated Gap</p>
                <h3 className="text-3xl font-headline font-bold text-emerald-500">₹{(ceoAnalysis ? (ceoAnalysis.metrics.totalSales * 0.4 / 100000).toFixed(1) : '12.4')}L</h3>
                <p className="text-xs text-slate-400 mt-2 max-w-[180px]">Predicted monthly revenue lift via AI SEO & UGC Ads.</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  <Badge className="bg-primary/10 text-primary border-none text-[8px] flex-1 justify-center py-1">AD SCALING</Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] flex-1 justify-center py-1">SEO GAP</Badge>
                </div>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-bold text-white flex items-center gap-2">
                <Flame size={20} className="text-orange-500" /> Intelligence Feed
              </h3>
              <Badge variant="outline" className="bg-slate-900 text-[10px] font-bold border-white/5 uppercase tracking-widest text-slate-500">Live Sync</Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { badge: "Pricing Gap", title: "Ethnic Wear Arbitrage", text: "Competitors have raised prices by 15%. Adjusting your entry-level SKU could yield +₹24k/mo.", color: "text-emerald-500" },
                { badge: "Search Trend", title: "Keyword Dominance", text: "High volume identified for 'Eco-friendly Cotton' on Myntra. Current listings are missing this attribute.", color: "text-primary" },
                { badge: "Inventory Alert", title: "Velocity Stock-out", text: "Your 'Velvet Lehenga' is selling 2.4x faster than predicted. Stock-out expected in 4 days.", color: "text-rose-500" },
                { badge: "Ad Tuning", title: "Creative Sentiment", text: "UGC-style ads are seeing 35% higher CTR than studio shots in your niche. Update recommended.", color: "text-amber-500" }
              ].map((item, i) => (
                <Card key={i} className="rounded-2xl border-white/5 bg-slate-900/50 hover:border-primary/30 transition-all cursor-pointer group">
                  <CardHeader className="pb-3">
                    <div className="flex justify-between items-start">
                      <Badge className={cn("border-none text-[8px] px-2 py-0.5 uppercase mb-2 bg-slate-800", item.color)}>{item.badge}</Badge>
                      <MousePointer2 size={12} className="text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    <CardTitle className="text-base font-headline">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="pb-4">
                    <p className="text-xs text-slate-400 leading-relaxed">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-white/5 bg-card shadow-xl overflow-hidden">
            <CardHeader className="pb-3 border-b border-white/5 bg-primary/5">
              <CardTitle className="text-lg font-headline flex items-center gap-2">
                <ShoppingBag size={18} className="text-primary" /> Enrollment Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-6">
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-3 rounded-xl bg-primary/5 border border-primary/10">
                  <span className="text-lg font-bold">{orderStats.enrolled}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Total</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                  <span className="text-lg font-bold text-emerald-500">{orderStats.active}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Live</span>
                </div>
                <div className="flex flex-col items-center p-3 rounded-xl bg-rose-500/5 border border-rose-500/10">
                  <span className="text-lg font-bold text-rose-500">{orderStats.canceled}</span>
                  <span className="text-[8px] font-bold text-muted-foreground uppercase">Closed</span>
                </div>
              </div>
              <Button variant="ghost" className="w-full h-10 rounded-lg text-[10px] font-bold uppercase tracking-wider border border-white/5 hover:bg-white/5" asChild>
                <Link href="/dashboard/orders">Fulfillment Audit <ChevronRight size={12} className="ml-1" /></Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/5 bg-card overflow-hidden">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline">Financial Pulse</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Est. Profit</span>
                  <p className="text-2xl font-headline font-bold text-emerald-500">₹{ceoAnalysis ? ((ceoAnalysis.metrics?.profit || 0) / 100000).toFixed(1) : '8.4'}L</p>
                </div>
                <TrendingUp size={24} className="text-emerald-500 opacity-20" />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-rose-500/5 border border-rose-500/10">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Margin Leakage</span>
                  <p className="text-2xl font-headline font-bold text-rose-500">₹{ceoAnalysis ? ((ceoAnalysis.metrics?.loss || 0) / 100000).toFixed(1) : '1.2'}L</p>
                </div>
                <TrendingDown size={24} className="text-rose-500 opacity-20" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline">Quick Hub</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              {[
                { icon: Briefcase, label: "Command Center", color: "text-primary", href: "/dashboard/ceo-hub" },
                { icon: FileText, label: "SEO Architect", color: "text-blue-500", href: "/dashboard/agents?agent=listing" },
                { icon: Video, label: "Ads Creative", color: "text-rose-500", href: "/dashboard/agents?agent=video" },
                { icon: ShieldCheck, label: "Compliance", color: "text-emerald-500", href: "/dashboard/settings" }
              ].map((link) => (
                <Button key={link.label} variant="secondary" className="w-full justify-start h-12 rounded-xl group hover:bg-secondary/80" asChild>
                  <Link href={link.href}>
                    <link.icon className={cn("w-5 h-5 mr-3", link.color)} />
                    <span className="font-bold text-sm">{link.label}</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                  </Link>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
