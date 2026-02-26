"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  TrendingUp, 
  TrendingDown, 
  Plus,
  Zap,
  Clock,
  Sparkles,
  X,
  Loader2,
  Video,
  RefreshCw,
  BarChart3,
  ArrowRight,
  Activity,
  MousePointer2,
  Flame,
  ShoppingBag
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
import { KPI_DATA as STATIC_KPI, PERFORMANCE_CHART } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PRICE_MAP: Record<string, number> = {
  "Myntra Onboarding": 29999,
  "Nykaa Onboarding": 24999,
  "Ajio Onboarding": 19999,
  "Amazon Onboarding": 8999,
  "Flipkart Onboarding": 8999,
  "Listing SEO Optimized": 39,
  "AI Photoshoot (5 Images)": 199,
  "AI UGC Ad Video": 1999,
  "Amazon/Flipkart Ads Mgmt": 21999,
  "Meta/Google Ads Mgmt": 19999,
  "Multi-Platform Ads Mgmt": 39999,
  "Basic Static Website": 15000,
  "Shopify Store Starter": 44999,
  "Enterprise E-com Setup": 129999,
  "AI CEO & Chief Strategist": 24999,
  "AI Social Media Manager": 9999,
  "AI Listing Architect": 7999,
  "AI Customer Success Lead": 5999,
  "AI Creative Director": 12999
};

export default function Dashboard() {
  const [showTrialBanner, setShowTrialBanner] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  
  useEffect(() => {
    setHasMounted(true);
    const loadProjects = () => {
      try {
        const saved = localStorage.getItem("marketmind_projects");
        const parsed = saved ? JSON.parse(saved) : [];
        setProjects(parsed);
        // Only show banner if on free trial (no active projects)
        if (parsed.filter((p: any) => p.status !== 'Canceled').length === 0) {
          setShowTrialBanner(true);
        }
      } catch (e) {}
    };
    loadProjects();
    window.addEventListener('storage', loadProjects);
    return () => window.removeEventListener('storage', loadProjects);
  }, []);

  const currentPlan = useMemo(() => {
    const active = projects.filter(p => p.status !== 'Canceled');
    if (active.length === 0) return { name: "Free Trial", color: "bg-primary" };
    
    const totalValue = active.reduce((sum, p) => sum + (Number(p.price) || PRICE_MAP[p.name] || 0), 0);
    
    if (totalValue >= 100000) return { name: "Enterprise Plan", color: "bg-indigo-500" };
    if (totalValue >= 30000) return { name: "Pro Plan", color: "bg-amber-500" };
    
    return { name: "Plus Plan", color: "bg-emerald-500" };
  }, [projects]);

  if (!hasMounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showTrialBanner && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 border border-primary/20 p-6 md:p-8">
          <div className="absolute top-0 right-0 p-4">
            <button className="h-8 w-8 rounded-full hover:bg-white/10 flex items-center justify-center transition-colors text-slate-400" onClick={() => setShowTrialBanner(false)}>
              <X size={16} />
            </button>
          </div>
          
          <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center text-primary shrink-0 shadow-inner">
              <Clock size={32} className="animate-pulse" />
            </div>
            
            <div className="flex-1 text-center md:text-left space-y-2">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <span className="bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">Trial Active</span>
                <h2 className="text-xl font-headline font-bold text-white">7 Days Remaining in Your Free Trial</h2>
              </div>
              <p className="text-slate-400 max-w-2xl text-sm">
                Unlock unlimited AI Content generation and growth intelligence with a premium node.
              </p>
            </div>
            
            <Button size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-bold text-white" asChild>
              <Link href="/pricing">
                <Sparkles size={14} className="mr-2" /> Upgrade Now
              </Link>
            </Button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold text-white mb-1">Brand Overview</h1>
          <p className="text-slate-400 text-sm">Real-time marketplace performance optimized for growth.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={cn("px-4 py-1.5 rounded-xl border-none text-white font-bold uppercase tracking-widest text-[10px]", currentPlan.color)}>
            {currentPlan.name} Tier
          </Badge>
          <Button size="sm" variant="outline" className="border-white/5 bg-slate-900 text-white" asChild>
            <Link href="/dashboard/projects">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {STATIC_KPI.map((kpi) => (
          <Card key={kpi.title} className="rounded-2xl border-white/5 bg-slate-900/50">
            <CardContent className="p-6">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">{kpi.title}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-2xl font-bold font-headline text-white">{kpi.value}</h3>
                <div className={`flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  kpi.trend === 'up' ? 'text-emerald-500 bg-emerald-500/10' : 'text-rose-500 bg-rose-500/10'
                }`}>
                  {kpi.trend === 'up' ? <TrendingUp size={10} className="mr-1" /> : <TrendingDown size={10} className="mr-1" />}
                  {kpi.change}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-2xl border-white/5 bg-slate-900/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-headline text-white">Marketplace Velocity</CardTitle>
                  <CardDescription className="text-slate-500">Correlation between ad spend and conversion.</CardDescription>
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[10px]">
                  <Activity size={12} className="mr-1" /> Real-time
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
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '12px'}}
                      itemStyle={{color: '#fff'}}
                    />
                    <Area type="monotone" dataKey="sales" stroke="#4f46e5" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="rounded-2xl border-white/5 bg-slate-900/50 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                  <BarChart3 className="text-primary" size={18} /> Marketplace Health
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pt-4">
                {[
                  { label: "Price Index", value: 82, color: "bg-emerald-500" },
                  { label: "SEO Strength", value: 64, color: "bg-amber-500" },
                  { label: "UX Sentiment", value: 45, color: "bg-primary" }
                ].map((item) => (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                      <span>{item.label}</span>
                      <span>{item.value}%</span>
                    </div>
                    <Progress value={item.value} className="h-1.5 bg-slate-800" />
                  </div>
                ))}
              </CardContent>
              <CardFooter className="bg-white/5 p-4">
                <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary" asChild>
                  <Link href="/dashboard/growth">View Deep Intel <ArrowRight size={12} className="ml-1" /></Link>
                </Button>
              </CardFooter>
            </Card>

            <Card className="rounded-2xl border-white/5 bg-slate-900/50 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                  <TrendingUp className="text-emerald-500" size={18} /> Revenue Lift
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 flex flex-col items-center justify-center min-h-[120px] text-center">
                <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Untapped Potential</p>
                <h3 className="text-3xl font-headline font-bold text-emerald-500">₹12.4L</h3>
                <p className="text-[10px] text-slate-400 mt-2">Targeted monthly lift via AI optimization.</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl border-white/5 bg-slate-900/50 overflow-hidden shadow-xl">
            <CardHeader className="pb-3 border-b border-white/5 bg-primary/5">
              <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                <Flame size={18} className="text-orange-500" /> Strategic Feed
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              {[
                { badge: "Pricing", text: "Ethnic Wear prices up 15%. Adjust SKU-X for +₹24k profit.", color: "text-emerald-500" },
                { badge: "Inventory", text: "Velvet Lehenga selling 2.4x faster. Restock soon.", color: "text-rose-500" }
              ].map((item, i) => (
                <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-white/5 space-y-2 group cursor-pointer hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-center">
                    <Badge variant="secondary" className={cn("text-[8px] bg-slate-900", item.color)}>{item.badge}</Badge>
                    <MousePointer2 size={10} className="text-slate-600 opacity-0 group-hover:opacity-100" />
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{item.text}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-white/5 bg-slate-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline text-white">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              {[
                { icon: Video, label: "Create AI Ad", href: "/dashboard/agents?agent=video", color: "text-rose-500" },
                { icon: ShoppingBag, label: "New Project", href: "/dashboard/projects", color: "text-emerald-500" }
              ].map((link) => (
                <Button key={link.label} variant="secondary" className="w-full justify-start h-12 rounded-xl group bg-slate-800/50 hover:bg-slate-800 border-white/5" asChild>
                  <Link href={link.href}>
                    <link.icon className={cn("w-5 h-5 mr-3", link.color)} />
                    <span className="font-bold text-sm text-white">{link.label}</span>
                    <ArrowRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 transition-all" />
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
