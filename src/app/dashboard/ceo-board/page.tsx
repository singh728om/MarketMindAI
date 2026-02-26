"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Activity,
  RefreshCw,
  Sparkles,
  BarChart3,
  Loader2,
  TrendingUp,
  ShieldAlert,
  AlertCircle,
  Zap,
  Target,
  FileUp,
  HardDrive,
  History,
  Lock,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFirestore, useUser, useAuth } from "@/firebase";
import { query, collection, where, orderBy, limit, onSnapshot, doc, setDoc } from "firebase/firestore";
import { runAICeoAnalysis } from "@/ai/flows/ai-ceo-agent-flow";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError } from "@/firebase/errors";
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";

export default function CEOBoardroomPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [marketplace, setMarketplace] = useState("Amazon");
  const [isEnrolled, setIsEnrolled] = useState(false);
  
  const db = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
    
    const checkEnrollment = () => {
      try {
        const projectsStr = localStorage.getItem("marketmind_projects");
        if (projectsStr) {
          const projects = JSON.parse(projectsStr);
          const active = projects.some((p: any) => 
            p.status !== 'Canceled' && 
            (p.name === 'AI CEO & Chief Strategist' || p.name === 'Astra')
          );
          setIsEnrolled(active);
        }
      } catch (e) {}
    };

    checkEnrollment();
    window.addEventListener('storage', checkEnrollment);
    return () => window.removeEventListener('storage', checkEnrollment);
  }, []);

  useEffect(() => {
    if (!hasMounted || isUserLoading || !user || !db || !isEnrolled) {
      if (!isUserLoading && !user && hasMounted) setIsLoading(false);
      if (isEnrolled === false && hasMounted) setIsLoading(false);
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
      console.warn("Astra Sync Notice:", err.message);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, isUserLoading, hasMounted, isEnrolled]);

  const handleRunAudit = async () => {
    if (!user || !db) {
      if (auth) initiateAnonymousSignIn(auth);
      toast({ title: "Securing Node", description: "Establishing a secure session with Astra AS-S1-V4..." });
      return;
    }
    
    setIsAuditing(true);
    try {
      const keys = localStorage.getItem("marketmind_api_keys");
      const activeKey = keys ? JSON.parse(keys).gemini : "";

      if (!activeKey) {
        toast({ variant: "destructive", title: "Astra Offline", description: "API Key missing in System Config. Visit Ops Console." });
        setIsAuditing(false);
        return;
      }

      const result = await runAICeoAnalysis({
        marketplace: marketplace as any,
        reportSummary: `Ingested reports: ${uploadedFiles.join(", ")}. Initiating high-fidelity strategic synthesis.`,
        apiKey: activeKey
      });

      const analysisId = `audit-${Date.now()}`;
      const analysisRef = doc(db, "ceoAnalyses", analysisId);
      const data = {
        ...result,
        id: analysisId,
        userProfileId: user.uid,
        marketplace,
        createdAt: new Date().toISOString()
      };

      setDoc(analysisRef, data)
        .then(() => {
          toast({ title: "Boardroom Updated", description: "Astra Intelligence Node: AS-S1-V4 has synchronized strategic data." });
        })
        .catch(async (serverError) => {
          errorEmitter.emit('permission-error', new FirestorePermissionError({
            path: analysisRef.path,
            operation: 'write',
            requestResourceData: data,
          }));
        });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Synthesis Error", description: err.message });
    } finally {
      setIsAuditing(false);
    }
  };

  const handleFileChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => [...prev, file.name]);
      toast({ title: "Report Ingested", description: `${file.name} ready for audit.` });
    }
  };

  const calculateMetric = (metric: any) => {
    if (typeof metric === 'number') return metric;
    return 0;
  };

  if (!hasMounted || isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  if (!isEnrolled) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-700">
        <Card className="max-w-2xl w-full p-12 text-center space-y-8 bg-slate-900/50 border-white/5 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5">
            <Activity size={300} />
          </div>
          <div className="w-24 h-24 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 mx-auto shadow-2xl relative z-10">
            <Lock size={48} />
          </div>
          <div className="space-y-4 relative z-10">
            <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 uppercase font-bold tracking-widest text-[10px]">Premium Strategic Service</Badge>
            <h2 className="text-4xl font-headline font-bold text-white leading-tight">CEO Boardroom Locked</h2>
            <p className="text-slate-400 text-lg max-w-md mx-auto leading-relaxed">
              Recruit Astra (AI CEO) to unlock autonomous financial orchestration and high-fidelity strategic synthesis.
            </p>
          </div>
          <div className="pt-6 relative z-10">
            <Button size="lg" className="rounded-2xl h-16 px-10 text-lg font-bold bg-amber-500 text-black hover:bg-amber-600 shadow-2xl shadow-amber-500/20" asChild>
              <Link href="/dashboard/hire-ai">
                Recruit Astra Now <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-2xl">
            <Activity size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-headline font-bold text-white">CEO Boardroom</h1>
              <Badge className="bg-emerald-500 text-white font-bold text-[10px] uppercase tracking-widest border-none">Astra Online</Badge>
            </div>
            <p className="text-slate-400 text-sm">Astra Intelligence Node: AS-S1-V4</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-white/5 bg-slate-900 text-white h-12 px-6 rounded-xl" asChild>
            <Link href="/dashboard/orders">
              <History className="mr-2 w-4 h-4" /> History
            </Link>
          </Button>
          <Button 
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-8 rounded-xl"
            onClick={() => setAnalysis(null)}
          >
            Reset Workspace
          </Button>
        </div>
      </div>

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4">
          <Card className="rounded-[2.5rem] border-white/5 bg-slate-900/50 p-10 space-y-8">
            <div className="space-y-2">
              <Badge variant="outline" className="text-amber-500 border-amber-500/20 bg-amber-500/5 uppercase font-bold tracking-widest text-[10px]">Strategic Configuration</Badge>
              <h2 className="text-3xl font-headline font-bold text-white">Boardroom Parameters</h2>
              <p className="text-slate-400">Configure the scope for Astra Core v4 intelligence synthesis.</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Active Marketplace</label>
                <Select value={marketplace} onValueChange={setMarketplace}>
                  <SelectTrigger className="bg-slate-800 border-white/5 h-14 rounded-2xl text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                    <SelectItem value="Amazon">Amazon India</SelectItem>
                    <SelectItem value="Flipkart">Flipkart</SelectItem>
                    <SelectItem value="Myntra">Myntra</SelectItem>
                    <SelectItem value="Ajio">Ajio</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Ingest Reports</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { id: "sales", label: "Sales & Rev", icon: BarChart3 },
                    { id: "ads", label: "Ads & ROAS", icon: Zap },
                    { id: "returns", label: "Returns/CX", icon: ShieldAlert },
                    { id: "inventory", label: "Stock/SKU", icon: Target }
                  ].map((item) => (
                    <div key={item.id} className="p-4 rounded-2xl bg-slate-800/50 border border-white/5 flex items-center justify-between group hover:border-amber-500/30 transition-all">
                      <div className="flex items-center gap-3">
                        <item.icon size={16} className="text-amber-500" />
                        <span className="text-xs font-bold text-slate-200">{item.label}</span>
                      </div>
                      <input type="file" className="hidden" id={`file-${item.id}`} onChange={handleFileChange} />
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 rounded-lg" asChild>
                        <label htmlFor={`file-${item.id}`} className="cursor-pointer flex items-center justify-center">
                          <FileUp size={14} className="text-slate-500 group-hover:text-amber-500" />
                        </label>
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <Button 
              className="w-full h-16 rounded-2xl text-lg font-bold shadow-2xl shadow-amber-500/20 bg-amber-500 text-black hover:bg-amber-600" 
              disabled={isAuditing || uploadedFiles.length === 0}
              onClick={handleRunAudit}
            >
              {isAuditing ? <><RefreshCw className="mr-2 animate-spin" /> Astra Synthesizing...</> : <><Sparkles className="mr-2" /> Start Boardroom Audit</>}
            </Button>
          </Card>

          <Card className="rounded-[2.5rem] border-white/5 bg-slate-950 p-10 flex flex-col items-center justify-center text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-5">
              <Activity size={300} />
            </div>
            <div className="w-24 h-24 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 shadow-inner relative z-10">
              <Sparkles size={48} className="animate-pulse" />
            </div>
            <div className="space-y-2 relative z-10">
              <h3 className="text-2xl font-headline font-bold text-white">Boardroom Strategy</h3>
              <p className="text-slate-500 max-w-sm mx-auto">Proprietary CEO intelligence active. Ingest marketplace reports to begin high-fidelity analysis.</p>
            </div>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl border-white/5 bg-slate-900/50 overflow-hidden">
              <CardHeader className="p-8 pb-4">
                <CardTitle className="text-2xl md:text-3xl font-headline text-white">Executive Narrative</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-8">
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5">
                  <p className="text-slate-300 text-lg leading-relaxed italic">"{analysis.narrative || "Synthesis pending..."}"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={14} /> Revenue Accelerators
                    </h4>
                    {(analysis.pillars?.revenueGrowth || ["No data identified"]).map((item: string, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-200">{item}</div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <ShieldAlert size={14} /> Risk & Efficiency
                    </h4>
                    {(analysis.pillars?.costOptimization || ["No data identified"]).map((item: string, i: number) => (
                      <div key={i} className="p-4 rounded-xl bg-slate-900 border border-white/5 text-xs text-slate-200">{item}</div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/5 bg-slate-900/50 overflow-hidden">
              <CardHeader className="border-b border-white/5 p-8">
                <CardTitle className="font-headline text-xl flex items-center gap-2 text-white">
                  <ShieldAlert className="text-rose-500" /> Profit Leakage Audit
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {(analysis.leakageInsights || []).length > 0 ? analysis.leakageInsights.map((leak: any, i: number) => (
                    <div key={i} className="p-8 flex items-center justify-between gap-6 hover:bg-white/5 transition-colors">
                      <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                          <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white">{leak.reason}</h4>
                          <p className="text-sm text-slate-400">{leak.impact}</p>
                        </div>
                      </div>
                    </div>
                  )) : (
                    <div className="p-8 text-center text-slate-500 italic text-sm">No critical leakages detected in this cycle.</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                  <BarChart3 className="text-amber-500" size={18} /> Boardroom Pulse
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Net Profit Margin</span>
                    <span className="text-emerald-500">
                      {calculateMetric(analysis.metrics?.totalSales) > 0 
                        ? (calculateMetric(analysis.metrics.profit) / analysis.metrics.totalSales * 100).toFixed(1) 
                        : "0.0"}%
                    </span>
                  </div>
                  <Progress 
                    value={calculateMetric(analysis.metrics?.totalSales) > 0 ? (calculateMetric(analysis.metrics.profit) / analysis.metrics.totalSales * 100) : 0} 
                    className="h-1.5 bg-slate-800" 
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">ROAS Multiplier</span>
                    <span className="text-amber-500">{analysis.metrics?.roas || "0.0"}x</span>
                  </div>
                  <Progress 
                    value={Math.min(100, calculateMetric(analysis.metrics?.roas) * 10)} 
                    className="h-1.5 bg-slate-800" 
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/5 bg-slate-900 p-8 space-y-6">
              <h4 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Node Health</h4>
              <div className="space-y-6">
                {[
                  { icon: HardDrive, title: "Astra Core v4", desc: "Uptime: 99.99% • Active" },
                  { icon: Target, title: "Marketplace API", desc: "Sync: Regional-AS" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-amber-500 shrink-0">
                      <item.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white">{item.title}</p>
                      <p className="text-[10px] text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
