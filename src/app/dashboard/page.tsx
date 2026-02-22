"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from "recharts";
import { 
  TrendingUp, 
  TrendingDown, 
  ArrowUpRight, 
  ExternalLink,
  Plus,
  Zap,
  Package,
  FileText,
  Clock,
  Sparkles,
  X,
  Headphones
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPI_DATA, PERFORMANCE_CHART, ACTIVITY_FEED } from "@/lib/mock-data";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [showTrialBanner, setShowTrialBanner] = useState(true);
  const { toast } = useToast();

  const handleContactSupport = () => {
    toast({
      title: "Connecting to Agent",
      description: "An expert account manager will be with you shortly.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Trial Period Banner */}
      {showTrialBanner && (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary/20 via-accent/20 to-primary/10 border border-primary/20 p-6 md:p-8 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="absolute top-0 right-0 p-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-full hover:bg-white/10" 
              onClick={() => setShowTrialBanner(false)}
            >
              <X size={16} className="text-muted-foreground" />
            </Button>
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
                Experience the full power of MarketMind AI. Upgrade now to unlock unlimited AI Photoshoots, bulk catalog automation, and advanced growth intelligence for all your marketplaces.
              </p>
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <Link href="/pricing">
                <Button size="lg" className="rounded-xl px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 font-bold">
                  <Sparkles size={18} className="mr-2" /> Upgrade to Premium
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Decorative background elements */}
          <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-12 -left-12 w-48 h-48 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Brand Overview</h1>
          <p className="text-muted-foreground">Welcome back. Performance is up 12% this week.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex" onClick={handleContactSupport}>
            <Headphones className="w-4 h-4 mr-2" /> Contact Support
          </Button>
          <Link href="/dashboard/projects">
            <Button size="sm" className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" /> New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KPI_DATA.map((kpi) => (
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
        {/* Performance Chart */}
        <Card className="lg:col-span-2 rounded-2xl border-white/5 bg-card">
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

        {/* Quick Actions & Feed */}
        <div className="space-y-6">
          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg font-headline">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 gap-2">
              <Link href="/dashboard/agents">
                <Button variant="secondary" className="w-full justify-start h-12 rounded-xl group">
                  <FileText className="w-5 h-5 mr-3 text-primary" /> Generate Listing
                </Button>
              </Link>
              <Link href="/dashboard/agents">
                <Button variant="secondary" className="w-full justify-start h-12 rounded-xl">
                  <Zap className="w-5 h-5 mr-3 text-accent" /> Create Ad Video
                </Button>
              </Link>
              <Button variant="secondary" className="justify-start h-12 rounded-xl" onClick={handleContactSupport}>
                <Headphones className="w-5 h-5 mr-3 text-emerald-500" /> Contact Support
              </Button>
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
