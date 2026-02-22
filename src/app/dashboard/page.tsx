"use client";

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
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { KPI_DATA, PERFORMANCE_CHART, ACTIVITY_FEED } from "@/lib/mock-data";

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Brand Overview</h1>
          <p className="text-muted-foreground">Welcome back. Performance is up 12% this week.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:inline-flex">
            <ExternalLink className="w-4 h-4 mr-2" /> Marketplace Views
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Plus className="w-4 h-4 mr-2" /> New Project
          </Button>
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
              <Button variant="secondary" className="justify-start h-12 rounded-xl group">
                <FileText className="w-5 h-5 mr-3 text-primary" /> Generate Listing
              </Button>
              <Button variant="secondary" className="justify-start h-12 rounded-xl">
                <Zap className="w-5 h-5 mr-3 text-accent" /> Create Ad Video
              </Button>
              <Button variant="secondary" className="justify-start h-12 rounded-xl">
                <Package className="w-5 h-5 mr-3 text-emerald-500" /> Catalog Sheet
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
