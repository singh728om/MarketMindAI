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
  BadgeCheck,
  Sparkles,
  BarChart3,
  Clock,
  Loader2,
  PieChart,
  History,
  FileUp,
  CheckCircle2,
  Cpu
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { query, collection, where, orderBy, limit, onSnapshot, doc, setDoc } from "firebase/firestore";
import { useFirestore, useUser, useAuth, initiateAnonymousSignIn } from "@/firebase";
import { cn } from "@/lib/utils";
import { errorEmitter } from "@/firebase/error-emitter";
import { FirestorePermissionError, type SecurityRuleContext } from "@/firebase/errors";
import { runAICeoAnalysis } from "@/ai/flows/ai-ceo-agent-flow";
import { useToast } from "@/hooks/use-toast";

export default function CEOHubPage() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuditing, setIsAuditing] = useState(false);
  const [marketplace, setMarketplace] = useState("Amazon");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const db = useFirestore();
  const auth = useAuth();
  const { user, isUserLoading } = useUser();
  const { toast } = useToast();

  // Background Auth Stabilization
  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [isUserLoading, user, auth]);

  useEffect(() => {
    if (isUserLoading) return;
    
    if (!user || !db) {
      setIsLoading(false);
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
    }, async (err) => {
      // Index errors are common in prototypes, handle silently or via emitter
      const permissionError = new FirestorePermissionError({
        path: analysesRef.path,
        operation: 'list',
      } satisfies SecurityRuleContext);
      errorEmitter.emit('permission-error', permissionError);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [db, user, isUserLoading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFiles(prev => [...prev, file.name]);
      toast({ title: "Signal Ingested", description: `${file.name} queued for synthesis.` });
    }
  };

  const handleRunAudit = async () => {
    if (!user) {
      if (auth) initiateAnonymousSignIn(auth);
      toast({ title: "Securing Node", description: "Establishing Astra encrypted session..." });
      return;
    }
    
    setIsAuditing(true);

    try {
      const keysStr = localStorage.getItem("marketmind_api_keys");
      const keys = keysStr ? JSON.parse(keysStr) : null;
      const apiKey = keys?.gemini;

      if (!apiKey) {
        toast({
          variant: "destructive",
          title: "Node Offline",
          description: "Astra Core requires an API key. Update in Ops Console."
        });
        setIsAuditing(false);
        return;
      }

      const result = await runAICeoAnalysis({
        marketplace: marketplace as any,
        reportSummary: `Analysis of: ${uploadedFiles.join(', ')}. Mode: Astra Boardroom Synthesis AS-S1-V4.`,
        apiKey: apiKey
      });

      const analysisId = `ceo-${Date.now()}`;
      const analysisRef = doc(db, "ceoAnalyses", analysisId);
      const data = {
        id: analysisId,
        userProfileId: user.uid,
        marketplace: marketplace,
        metrics: result.metrics,
        pillars: result.pillars,
        recommendations: [
          ...(result.pillars?.revenueGrowth || []), 
          ...(result.pillars?.costOptimization || [])
        ],
        summary: result.narrative,
        leakageInsights: result.leakageInsights || [],
        createdAt: new Date().toISOString()
      };

      // Non-blocking save
      setDoc(analysisRef, data).catch(async (serverError) => {
        const permissionError = new FirestorePermissionError({
          path: analysisRef.path,
          operation: 'write',
          requestResourceData: data,
        } satisfies SecurityRuleContext);
        errorEmitter.emit('permission-error', permissionError);
      });
      
      toast({ title: "Synthesis Complete", description: "Strategic insights mirrored to Hub." });
      setUploadedFiles([]);
    } catch (err: any) {
      console.error(err);
      toast({ 
        variant: "destructive", 
        title: "Synthesis Error", 
        description: err.message || "Astra node busy. Retry in 10s." 
      });
    } finally {
      setIsAuditing(false);
    }
  };

  const metrics = useMemo(() => analysis?.metrics || null, [analysis]);

  if (isLoading || isUserLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="animate-spin text-amber-500 w-12 h-12" />
        <p className="text-slate-400 font-medium font-headline uppercase tracking-widest text-xs">Summoning Boardroom Intelligence...</p>
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
          <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-2xl">
            <Briefcase size={32} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-3xl font-headline font-bold text-white">CEO Department Hub</h1>
              <Badge className="bg-amber-500 text-black font-bold text-[10px] uppercase">Node: AS-S1-V4 Active</Badge>
            </div>
            <p className="text-slate-400">Boardroom orchestration operated by Astra Intelligence.</p>
          </div>
        </div>
        {analysis && (
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-white/5 bg-slate-900 text-white h-12 px-6 rounded-xl">
              <History className="mr-2 w-4 h-4" /> Audit Logs
            </Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold h-12 px-8 rounded-xl shadow-xl shadow-amber-500/20"
              onClick={() => setAnalysis(null)}
            >
              <RefreshCw className="mr-2 w-4 h-4" /> New Strategic Audit
            </Button>
          </div>
        )}
      </div>

      {!analysis ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Card className="lg:col-span-2 rounded-[2.5rem] border-white/5 bg-slate-900 overflow-hidden shadow-2xl border-dashed border-2">
            <div className="p-8 md:p-12 space-y-8 bg-gradient-to-br from-amber-500/5 to-transparent">
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Target size={32} className={isAuditing ? "animate-pulse" : ""} />
              </div>
              <div className="space-y-4">
                <h2 className="text-3xl font-headline font-bold text-white tracking-tight">Initiate Boardroom Synthesis</h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Astra correlates departmental signals to identify margin leakage and growth paths. Upload reports to begin.
                </p>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Marketplace</Label>
                  <Select value={marketplace} onValueChange={setMarketplace}>
                    <SelectTrigger className="bg-slate-800 border-white/5 h-14 rounded-xl text-white text-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/10 text-white">
                      <SelectItem value="Amazon">Amazon India</SelectItem>
                      <SelectItem value="Flipkart">Flipkart Commerce</SelectItem>
                      <SelectItem value="Myntra">Myntra Lifestyle</SelectItem>
                      <SelectItem value="Ajio">Ajio Premium</SelectItem>
                      <SelectItem value="Nykaa">Nykaa Beauty</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ingest Signals (Reports)</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <ReportUploadButton id="r1" label="Sales & GMV" onFile={handleFileChange} />
                    <ReportUploadButton id="r2" label="Ad Performance" onFile={handleFileChange} />
                    <ReportUploadButton id="r3" label="Returns & RTO" onFile={handleFileChange} />
                    <ReportUploadButton id="r4" label="Stock Levels" onFile={handleFileChange} />
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {uploadedFiles.map(f => (
                        <Badge key={f} variant="outline" className="bg-emerald-500/10 border-emerald-500/20 text-emerald-500 text-[9px] px-3 py-1 font-bold">
                          <CheckCircle2 className="mr-1 size-3" /> {f}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <Button 
                  className="w-full h-16 rounded-2xl text-xl font-bold bg-amber-500 text-black hover:bg-amber-600 shadow-xl shadow-amber-500/20 transition-all"
                  disabled={isAuditing || uploadedFiles.length === 0}
                  onClick={handleRunAudit}
                >
                  {isAuditing ? (
                    <><RefreshCw className="mr-2 h-6 w-6 animate-spin" /> Astra Core Processing...</>
                  ) : uploadedFiles.length === 0 ? (
                    <><FileUp className="mr-2 h-6 w-6" /> Ingest Signals to Begin</>
                  ) : (
                    <><Zap className="mr-2 h-6 w-6" /> Run Strategic Synthesis</>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="rounded-[2rem] border-white/5 bg-slate-900 p-8 space-y-8">
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Synthesis Scope</h4>
                <p className="text-slate-500 text-sm italic">Multi-Node Correlation</p>
              </div>
              
              <div className="space-y-8">
                <AuditBenefit icon={TrendingUp} title="Growth Velocity" desc="Detecting organic ranking shifts relative to ad budget spikes." />
                <AuditBenefit icon={ShieldAlert} title="Leakage Protection" desc="Identifying margin erosion in RTO and logistics handling." />
                <AuditBenefit icon={Boxes} title="Inventory Logic" desc="Predictive capital reallocation based on SKU velocity." />
              </div>

              <div className="pt-6 border-t border-white/5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-amber-500">
                    <Cpu size={16} />
                  </div>
                  <p className="text-xs font-bold text-slate-300">Node: AS-S1-V4</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="lg:col-span-2 space-y-8">
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-amber-500/10 to-transparent p-8 pb-4">
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <span className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em]">Executive Strategic Pulse</span>
                </div>
                <CardTitle className="text-2xl md:text-3xl font-headline">Intelligence Briefing</CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <div className="p-6 rounded-2xl bg-black/20 border border-white/5 mb-8">
                  <p className="text-slate-300 text-lg leading-relaxed italic">"{analysis.summary}"</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-white/5">
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <TrendingUp size={14} /> Revenue Accelerators
                    </h4>
                    {(analysis.pillars?.revenueGrowth || []).map((rec: string, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm font-medium hover:border-primary/30 transition-colors">
                        {rec}
                      </div>
                    ))}
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                      <TrendingDown size={14} /> Efficiency Risks
                    </h4>
                    {(analysis.pillars?.costOptimization || []).map((rec: string, i: number) => (
                      <div key={i} className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 text-sm font-medium hover:border-rose-500/30 transition-colors">
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
                  <Badge variant="outline" className="bg-rose-500/10 text-rose-500 border-rose-500/20 px-3 py-1 font-bold uppercase">Critical Monitoring</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-white/5">
                  {(analysis.leakageInsights || []).length > 0 ? (analysis.leakageInsights || []).map((leak: any, i: number) => (
                    <div key={i} className="p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-white/5 transition-colors group">
                      <div className="flex gap-6 items-start">
                        <div className="w-12 h-12 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0 group-hover:scale-110 transition-transform">
                          <AlertCircle size={24} />
                        </div>
                        <div className="space-y-1">
                          <h4 className="text-lg font-bold text-white">{leak.reason}</h4>
                          <p className="text-sm text-slate-400">{leak.impact}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end shrink-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase">Est. Monthly Leakage</span>
                        <span className="text-xl font-headline font-bold text-rose-500">₹{metrics ? (metrics.loss * 0.3).toLocaleString() : '0'}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="p-12 text-center text-slate-500 italic">No critical leakage identified in current cycle.</div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="rounded-3xl border-white/5 bg-slate-900 p-8 space-y-6">
                <h4 className="text-lg font-headline font-bold flex items-center gap-2">
                  <Target className="text-emerald-500" /> Capital Logic
                </h4>
                <div className="space-y-4">
                  {(analysis.pillars?.inventoryPlanning || []).map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-xs text-slate-300">
                      <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="rounded-3xl border-white/5 bg-slate-900 p-8 space-y-6">
                <h4 className="text-lg font-headline font-bold flex items-center gap-2">
                  <Boxes className="text-blue-500" /> Risk Governance
                </h4>
                <div className="space-y-4">
                  {(analysis.pillars?.riskMonitoring || []).map((item: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-xs text-slate-300">
                      <Clock size={16} className="text-blue-500 shrink-0 mt-0.5" />
                      {item}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden shadow-2xl">
              <CardContent className="p-8 text-center space-y-4">
                <div className="mx-auto w-24 h-24 rounded-full bg-amber-500/10 border-4 border-slate-800 flex items-center justify-center relative">
                  <Briefcase size={40} className="text-amber-500" />
                  <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-emerald-500 border-4 border-card flex items-center justify-center">
                    <BadgeCheck size={16} className="text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold text-white">Astra</h3>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-[0.2em]">Boardroom Lead Agent</p>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-center gap-6">
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Uptime</p>
                    <p className="text-sm font-bold text-white">100%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Latency</p>
                    <p className="text-sm font-bold text-white">0.8ms</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden shadow-xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                  <BarChart3 className="text-primary" size={18} /> Boardroom Pulse (HUD)
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-4 space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">Margin Health</span>
                    <span className="text-emerald-500">{metrics && metrics.totalSales > 0 ? ((metrics.profit / metrics.totalSales) * 100).toFixed(1) : 0}%</span>
                  </div>
                  <Progress value={metrics && metrics.totalSales > 0 ? (metrics.profit / metrics.totalSales) * 100 : 0} className="h-1.5 bg-slate-800" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-slate-500">ROAS Multiplier</span>
                    <span className="text-primary">{metrics ? metrics.roas : 0}x</span>
                  </div>
                  <Progress value={metrics ? Math.min(100, metrics.roas * 10) : 0} className="h-1.5 bg-slate-800" />
                </div>
                <div className="space-y-2 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Active Intelligence Node</span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-none text-[8px] font-bold uppercase">AS-S1-V4</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/20 space-y-4">
              <h4 className="text-[10px] font-bold text-primary uppercase flex items-center gap-2 tracking-[0.2em]">
                <PieChart size={14} /> Global Boardroom Actions
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <Button className="w-full justify-start h-12 bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl group transition-all">
                  <PieChart className="mr-3 w-4 h-4 text-primary" /> 
                  <span className="text-sm font-bold">Export Financial Audit</span>
                </Button>
                <Button className="w-full justify-start h-12 bg-white/5 border-white/5 hover:bg-white/10 text-white rounded-xl group transition-all">
                  <Sparkles className="mr-3 w-4 h-4 text-amber-500" /> 
                  <span className="text-sm font-bold">Share Strategy PDF</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ReportUploadButton({ id, label, onFile }: { id: string, label: string, onFile: any }) {
  return (
    <div className="p-4 rounded-xl bg-slate-800 border border-white/5 flex flex-col items-center gap-3 hover:bg-slate-700 transition-colors cursor-pointer group relative">
      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={onFile} />
      <FileUp size={20} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
      <span className="text-[10px] font-bold uppercase text-slate-400 group-hover:text-white transition-colors text-center">{label}</span>
    </div>
  );
}

function AuditBenefit({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <div className="flex gap-4 group">
      <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary/10 transition-colors">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-bold text-white group-hover:text-primary transition-colors">{title}</p>
        <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}
