"use client";

import { 
  TrendingUp, 
  BarChart4, 
  Search, 
  Target, 
  ShieldCheck, 
  Zap, 
  History,
  ArrowUpRight,
  Filter
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";

const INTELLIGENCE_MODULES = [
  { id: 1, title: "Keyword Research", icon: Search, value: "High Intent", score: 88 },
  { id: 2, title: "Listing SEO Score", icon: ShieldCheck, value: "Optimization Needed", score: 62 },
  { id: 3, title: "Brand Health", icon: Zap, value: "Excellent", score: 94 },
  { id: 4, title: "Competitor Intel", icon: Target, value: "Market Leader", score: 75 }
];

export default function GrowthPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Growth Intelligence</h1>
          <p className="text-muted-foreground">Predictive analysis to outpace your competition.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><History className="w-4 h-4 mr-2" /> History</Button>
          <Button><Filter className="w-4 h-4 mr-2" /> Adjust Strategy</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {INTELLIGENCE_MODULES.map((module) => (
          <Card key={module.id} className="rounded-2xl border-white/5 bg-card overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <module.icon size={20} />
                </div>
                <Badge variant={module.score > 80 ? "default" : "secondary"}>{module.score}%</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-1 font-medium">{module.title}</p>
              <h3 className="text-lg font-bold font-headline mb-4">{module.value}</h3>
              <Progress value={module.score} className="h-1.5" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border-white/5 bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-headline">Competitor Benchmark</CardTitle>
              <CardDescription>Price and volume tracking vs Top 5 brands in Fashion.</CardDescription>
            </div>
            <BarChart4 size={24} className="text-muted-foreground/50" />
          </CardHeader>
          <CardContent>
             <div className="space-y-6 pt-4">
                {[
                  { brand: "CHIC ELAN (You)", price: "₹2,499", share: "12%", status: "up" },
                  { brand: "Ethnic Roots", price: "₹2,199", share: "24%", status: "down" },
                  { brand: "Vibe Fashion", price: "₹2,899", share: "18%", status: "up" },
                  { brand: "Urban Threads", price: "₹1,999", share: "31%", status: "neutral" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground">{i+1}</div>
                      <div>
                        <p className="font-bold text-sm">{item.brand}</p>
                        <p className="text-xs text-muted-foreground">Price: {item.price}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{item.share} Share</p>
                      <div className={`text-[10px] flex items-center justify-end ${
                        item.status === 'up' ? 'text-emerald-500' : item.status === 'down' ? 'text-rose-500' : 'text-muted-foreground'
                      }`}>
                         {item.status !== 'neutral' && <TrendingUp size={10} className="mr-1" />}
                         {item.status.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/20 bg-primary/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={120} strokeWidth={1} />
          </div>
          <CardHeader>
            <CardTitle className="font-headline text-primary flex items-center gap-2">
              <Zap size={20} /> AI Recommendations
            </CardTitle>
            <CardDescription className="text-primary/70">Highest impact actions for this week.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            <div className="p-4 rounded-xl bg-background/50 border border-primary/10 group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-primary uppercase">Pricing</span>
                <ArrowUpRight size={14} className="text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium leading-snug">Lower "Silk Kurta" price to ₹2,299 to capture 15% more search volume.</p>
            </div>
            <div className="p-4 rounded-xl bg-background/50 border border-primary/10 group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-primary uppercase">Content</span>
                <ArrowUpRight size={14} className="text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium leading-snug">Refresh main image for "Velvet Lehenga" using Ethnic Wear AI Model.</p>
            </div>
            <Button className="w-full rounded-xl bg-primary shadow-xl shadow-primary/20">Apply All Actions</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
