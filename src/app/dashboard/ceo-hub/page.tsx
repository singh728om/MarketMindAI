
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Zap, 
  ShieldAlert, 
  Target, 
  Boxes, 
  RefreshCw, 
  ArrowLeft,
  ChevronRight,
  FileText,
  BadgeCheck,
  Sparkles,
  BarChart3,
  Clock,
  ExternalLink,
  Loader2,
  PieChart,
  History,
  Info
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { query, collection, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";

export default function CEOHubPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const db = useFirestore();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    // If auth check is complete and no user exists, stop loading
    if (!isUserLoading && !user) {
      setIsLoading(false);
      return;
    }

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
        setAnalysis(snapshot.docs[0].data());
      }
      setIsLoading(false);
    }, async (err) => {
      const permissionError = new FirestorePermissionError({
        path: analysesRef.path,
        operation: 'list',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, isUserLoading]);

  const metrics = useMemo(() => {
    if (!analysis) return null;
    return analysis.metrics;
  }, [analysis]);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
        <p className="text-slate-400 font-medium">Summoning Boardroom Intelligence...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/hire-ai">
            <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-2xl shadow-amber-500/10 border border-amber-500/20">
            <Briefcase size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-headline font-bold text-white">CEO Department Hub</h1>
              <Badge className="bg-amber-500 text-black font-bold text-[10px] uppercase">Astra Active</Badge>
            </div>
            <p className="text-slate-400">Top-level strategic command & board-room reporting.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/5 bg-slate-900 text-white h-12 px-6 rounded-xl">
            <History className="mr-2 w-4 h-4" /> Reports History
          </Button>
          <Link href="/dashboard/agents?agent=ceo">
            <Button className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-8 rounded-xl shadow-xl shadow-amber-500/20">
              <RefreshCw className="mr-2 w-4 h-4" /> Re-run Audit
            </Button>
          </Link>
        </div>
      </div>

      {!analysis ? (
        <Card className="rounded-[2.5rem] border-white/5 bg-slate-900 p-12 text-center border-dashed border-2">
          <div className="mx-auto w-24 h-24 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500 mb-8">
            <Target size={48} className="animate-pulse" />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-4">Intelligence Required</h2>
          <p className="text-slate-400 max-w-md mx-auto mb-10 text-lg">
            Astra is ready to analyze your brand, but she needs your latest marketplace data. Run the CEO analysis to generate your first boardroom brief.
          </p>
          <Link href="/dashboard/agents?agent=ceo">
            <Button size="lg" className="rounded-2xl h-16 px-10 text-xl font-bold bg-amber-500 text-black hover:bg-amber-600">
              Trigger Boardroom Audit
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Executive Briefing */}
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden group">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Astra's Executive Summary</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-headline">Strategic Brand Pulse</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <p className="text-slate-300 text-lg leading-relaxed italic">"{analysis.summary}"</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={14} /> Revenue Drivers
                    </h4>
                    {analysis.recommendations?.slice(0, 2).map((rec: string, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm font-medium">
                        {rec}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingDown size={14} /> Efficiency Gaps
                    </h4>
                    {analysis.recommendations?.slice(2, 4).map((rec: string, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-sm font-medium">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Profit & Loss Leakage Audit */}
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden">
              <CardHeader className="border-b border-white/5 p-8 bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-headline text-xl flex items-center gap-2">
                      <ShieldAlert className="text-rose-500" /> Financial Leakage Audit
                    </CardTitle>
                    <CardDescription>Identifying operational inefficiencies and margin erosion.</CardDescription>
                  </div>
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-3 py-1 font-bold">AUDIT ACTIVE</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {analysis.leakageInsights && analysis.leakageInsights.length > 0 ? analysis.leakageInsights.map((leak: any, i: number) => (
                    <div key={i} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                      <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                          <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white">{leak.reason}</h4>
                          <p className="text-sm text-slate-400">{leak.impact}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Monthly Loss</span>
                        <span className="text-xl font-headline font-bold text-rose-500">₹{(metrics.loss * 0.3).toLocaleString()}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center">
                      <p className="text-slate-500 italic">No critical leakage identified in current cycle.</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="bg-rose-500/5 p-6 border-t border-white/5">
                <div className="flex items-center gap-3 text-xs text-rose-400">
                  <Info size={14} />
                  <span>Astra suggests running the **Ad Tuning Flow** to recapture ~₹{(metrics.loss * 0.4 / 1000).toFixed(1)}k this week.</span>
                </div>
              </CardFooter>
            </Card>

            {/* Business Improvement Roadmap */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-3xl border-white/5 bg-slate-900 p-8 space-y-6">
                <h4 className="text-lg font-headline font-bold flex items-center gap-2">
                  <Target className="text-emerald-500" /> Growth Acceleration
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">Expand budget for Top 5 Kurtas by 20% to capture weekend spikes.</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">Launch 3 new UGC campaigns targeting Tier-2 cities on Instagram.</p>
                  </div>
                </div>
              </Card>

              <Card className="rounded-3xl border-white/5 bg-slate-900 p-8 space-y-6">
                <h4 className="text-lg font-headline font-bold flex items-center gap-2">
                  <Boxes className="text-blue-500" /> Supply Chain Logic
                </h4>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <Clock size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">Restock Designer Silk styles before stock-out in 4 days.</p>
                  </div>
                  <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10">
                    <Clock size={16} className="text-blue-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-slate-300">Liquidate 200 units of Cotton Saree - Batch B to free up ₹5L capital.</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-8">
            {/* Astra Mini-Profile */}
            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-24 h-24 rounded-full bg-amber-500/10 border-4 border-slate-800 flex items-center justify-center relative">
                  <Briefcase size={40} className="text-amber-500" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center">
                    <BadgeCheck size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold">Astra</h3>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-widest">AI CEO & Strategist</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Uptime</p>
                    <p className="text-sm font-bold text-white">24/7</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Nodes</p>
                    <p className="text-sm font-bold text-white">AS-S1</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Latency</p>
                    <p className="text-sm font-bold text-white">~1.2s</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Department Performance */}
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <BarChart3 className="text-primary" size={18} /> CEO Metrics Pulse
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Margin Health</span>
                    <span className="text-emerald-500">{analysis ? ((metrics.profit / metrics.totalSales) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <Progress value={analysis ? (metrics.profit / metrics.totalSales) * 100 : 0} className="h-1.5 bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-500">ROAS Efficiency</span>
                    <span className="text-primary">{analysis ? metrics.roas : 0}x</span>
                  </div>
                  <Progress value={analysis ? metrics.roas * 10 : 0} className="h-1.5 bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Capital Free-flow</span>
                    <span className="text-amber-500">72%</span>
                  </div>
                  <Progress value={72} className="h-1.5 bg-slate-800" />
                </div>
              </CardContent>
            </Card>

            {/* Delay & Compliance Alerts */}
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden">
              <CardHeader className="pb-3 bg-amber-500/5">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <Clock className="text-amber-500" size={18} /> Operational Delays
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0">
                    <Zap size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">Brand Registry Pending</p>
                    <p className="text-[10px] text-slate-500">Myntra verification delay detected. Expected resolution: 48h.</p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-4">
                  <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0">
                    <FileText size={16} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white">A+ Content Waitlist</p>
                    <p className="text-[10px] text-slate-500">Amazon listing enhancement queued. Node: AS-S1.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-6 pt-0">
                <Button variant="ghost" className="w-full text-xs font-bold text-primary group" asChild>
                  <Link href="/dashboard/tickets">
                    Raise Fulfillment Ticket <ChevronRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>

            {/* Quick Actions */}
            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-4">
              <h4 className="text-xs font-bold text-primary uppercase flex items-center gap-2">
                <PieChart size={14} /> Boardroom Actions
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button className="w-full justify-start h-12 bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl">
                  <PieChart className="mr-3 w-4 h-4 text-primary" /> Export Financial Brief
                </Button>
                <Button className="w-full justify-start h-12 bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl">
                  <Sparkles className="mr-3 w-4 h-4 text-amber-500" /> Share Strategic Roadmap
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
