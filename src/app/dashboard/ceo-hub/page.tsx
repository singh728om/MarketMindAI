
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Briefcase, 
  TrendingUp, 
  Zap, 
  ShieldAlert, 
  Target, 
  Boxes, 
  RefreshCw, 
  ArrowLeft,
  Sparkles,
  BarChart3,
  Loader2,
  PieChart,
  History,
  CheckCircle2,
  Activity,
  ArrowUpRight,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { query, collection, where, orderBy, limit, onSnapshot } from "firebase/firestore";
import { useFirestore, useUser, useAuth, initiateAnonymousSignIn } from "@/firebase";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";

export default function CommandCenterPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  
  const db = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    if (isUserLoading || !hasMounted || !user || !db) {
      if (!isUserLoading && !user) setIsLoading(false);
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
        setAnalysis(snapshot.docs[0].data());
      }
      setIsLoading(false);
    }, (err) => {
      errorEmitter.emit('permission-error', new FirestorePermissionError({
        path: analysesRef.path,
        operation: 'list',
      }));
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, isUserLoading, hasMounted]);

  if (!hasMounted || isLoading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-primary w-12 h-12" />
        <p className="text-slate-400 font-medium font-headline uppercase tracking-widest text-xs text-center">Summoning Operational Data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full text-slate-400 hover:text-white" asChild>
            <Link href="/dashboard">
              <ArrowLeft size={24} />
            </Link>
          </Button>
          <div className="w-16 h-16 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-2xl">
            <Activity size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-headline font-bold text-white">Command Center</h1>
              <Badge className="bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest">System Online</Badge>
            </div>
            <p className="text-slate-400">Mission-critical brand monitoring node.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/5 bg-slate-900 text-white h-12 px-6 rounded-xl" asChild>
            <Link href="/dashboard/agents?agent=ceo">
              <RefreshCw className="mr-2 w-4 h-4" /> Run New Audit
            </Link>
          </Button>
        </div>
      </div>

      {!analysis ? (
        <Card className="rounded-[2.5rem] border-white/5 bg-slate-900 overflow-hidden shadow-2xl border-dashed border-2 p-12 text-center space-y-6">
          <div className="mx-auto w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-4">
            <Target size={40} />
          </div>
          <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Intelligence Required</h2>
          <p className="text-slate-400 max-w-md mx-auto leading-relaxed">
            Your command center is offline. Initiate a boardroom audit via Astra to populate your strategic HUD.
          </p>
          <Button className="rounded-xl h-14 px-8 font-bold text-lg" asChild>
            <Link href="/dashboard/agents?agent=ceo">
              Open Astra Core <ArrowUpRight className="ml-2" />
            </Link>
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={18} className="text-primary" />
                  <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">Operational Briefing</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-headline">Intelligence Feed</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
                  <p className="text-slate-300 text-lg leading-relaxed italic">"{analysis.summary}"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={14} /> Revenue Accelerators
                    </h4>
                    {(analysis.pillars?.revenueGrowth || []).map((rec: string, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-white/5 text-xs text-slate-300">
                        {rec}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert size={14} /> Risk & Efficiency
                    </h4>
                    {(analysis.pillars?.costOptimization || []).map((rec: string, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-800/50 border border-white/5 text-xs text-slate-300">
                        {rec}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden">
              <CardHeader className="border-b border-white/5 p-8 bg-slate-800/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <ShieldAlert className="text-rose-500" /> Margin Leakage Audit
                  </CardTitle>
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-3 py-1 font-bold uppercase">Critical</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {(analysis.leakageInsights || []).length > 0 ? analysis.leakageInsights.map((leak: any, i: number) => (
                    <div key={i} className="p-8 flex items-center justify-between gap-6 hover:bg-white/5 transition-colors group">
                      <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-110 transition-transform">
                          <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white">{leak.reason}</h4>
                          <p className="text-sm text-slate-400">{leak.impact}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0 text-right">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Monthly Leakage</span>
                        <span className="text-xl font-headline font-bold text-rose-500">₹{((analysis.metrics?.loss || 0) / 100000).toFixed(1)}L</span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-slate-500 italic">No critical leakage identified.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                  <BarChart3 className="text-primary" size={18} /> Strategic HUD
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Net Profitability</span>
                    <span className="text-emerald-500">{analysis.metrics?.totalSales > 0 ? (analysis.metrics.profit / analysis.metrics.totalSales * 100).toFixed(1) : "0"}%</span>
                  </div>
                  <Progress value={analysis.metrics?.totalSales > 0 ? (analysis.metrics.profit / analysis.metrics.totalSales * 100) : 0} className="h-1.5 bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">ROAS Efficiency</span>
                    <span className="text-primary">{analysis.metrics?.roas || 0}x</span>
                  </div>
                  <Progress value={Math.min(100, (analysis.metrics?.roas || 0) * 10)} className="h-1.5 bg-slate-800" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/5 bg-slate-900 p-8 space-y-6">
              <h4 className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Operational Scope</h4>
              <div className="space-y-6">
                {[
                  { icon: TrendingUp, title: "Growth Velocity", desc: "Correlation between search intent and GMV." },
                  { icon: Boxes, title: "Inventory Logic", desc: "Capital reallocation based on SKU velocity." },
                  { icon: Target, title: "Marketplace Health", desc: "Buy Box monitoring and compliance logic." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 group">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{item.title}</p>
                      <p className="text-[10px] text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-4">
              <h4 className="text-[10px] font-bold text-primary uppercase flex items-center gap-2 tracking-[0.2em]">
                <PieChart size={14} /> Quick Actions
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button className="w-full justify-start h-12 bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl group transition-all">
                  <PieChart className="mr-3 w-4 h-4 text-primary" /> 
                  <span className="text-sm font-bold">Export Audit PDF</span>
                </Button>
                <Button className="w-full justify-start h-12 bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl group transition-all" asChild>
                  <Link href="/dashboard/growth">
                    <TrendingUp className="mr-3 w-4 h-4 text-emerald-500" /> 
                    <span className="text-sm font-bold">Market Share Intel</span>
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
