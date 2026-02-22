"use client";

import { useState, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Sparkles, 
  Camera, 
  Video, 
  FileText, 
  LayoutGrid, 
  Users, 
  ChevronRight,
  Loader2,
  Upload,
  Zap,
  Search,
  Globe,
  RefreshCw,
  FileDown,
  Layout,
  Briefcase,
  FileUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { generatePhotoshoot } from "@/ai/flows/generate-photoshoot-prompts";
import { optimizeProductListing } from "@/ai/flows/optimize-product-listing-flow";
import { generateCatalogTemplate } from "@/ai/flows/generate-catalog-template";
import { generateVideoAdContent } from "@/ai/flows/generate-video-ad-content";
import { generateUgcCampaignAssets } from "@/ai/flows/generate-ugc-campaign-assets";
import { findRankingKeywords } from "@/ai/flows/find-ranking-keywords";
import { generateB2BLeads } from "@/ai/flows/generate-b2b-leads";
import { generateWebsite } from "@/ai/flows/generate-website-flow";
import { runAICeoAnalysis } from "@/ai/flows/ai-ceo-agent-flow";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { doc, setDoc } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";

const AGENTS = [
  { id: "ceo", title: "AI CEO Agent", icon: Briefcase, desc: "Analyze Sales, Ads, & Returns to drive Dashboard metrics.", color: "text-amber-400" },
  { id: "photoshoot", title: "AI Photoshoot Studio", icon: Camera, desc: "Professional studio reshoots with model and environment control.", color: "text-purple-500" },
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and descriptions via Gemini Vision.", color: "text-blue-500" },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500" },
  { id: "video", title: "Product to AI Video Ads", icon: Video, desc: "Transform product images into 5s cinematic UGC video ads.", color: "text-rose-500" },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "Creative hooks + detailed scripts.", color: "text-orange-500" },
  { id: "ranking", title: "Ranking Keyword Finder", icon: Search, desc: "Discover 10 high-intent keywords to boost visibility.", color: "text-amber-500" },
  { id: "leads", title: "Lead Generation Agent", icon: Globe, desc: "Extract B2B leads via location or website analysis.", color: "text-cyan-500" },
  { id: "webbuilder", title: "AI Website Builder", icon: Layout, desc: "Generate a fully responsive, optimized brand landing page.", color: "text-indigo-400" },
];

function AgentsContent() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSavingWeb, setIsSavingWeb] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [modelType, setModelType] = useState<string>("none");
  const [isApiActive, setIsApiActive] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  
  const searchParams = useSearchParams();
  const initialAgentId = searchParams.get("agent");

  const [formData, setFormData] = useState({
    productName: "",
    category: "Fashion",
    color: "",
    productDescription: "",
    marketplace: "Amazon",
    targetAudience: "DTC Shoppers",
    keyFeatures: "Premium Quality, Handcrafted",
    shotAngle: "front",
    background: "professional-studio",
    kidAge: "5",
    kidGender: "boy",
    base64Image: null as string | null,
    location: "",
    country: "India",
    websiteUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

  useEffect(() => {
    if (initialAgentId) {
      const agent = AGENTS.find(a => a.id === initialAgentId);
      if (agent) setSelectedAgent(agent);
    }
  }, [initialAgentId]);

  useEffect(() => {
    const checkKeys = () => {
      try {
        const keys = localStorage.getItem("marketmind_api_keys");
        if (keys) {
          const parsed = JSON.parse(keys);
          if (parsed.gemini && parsed.gemini.trim() !== "") {
            setIsApiActive(true);
            setActiveKey(parsed.gemini);
            return;
          }
        }
      } catch (e) {
        console.error("Failed to check API keys", e);
      }
      setIsApiActive(false);
      setActiveKey("");
    };

    checkKeys();
    window.addEventListener('storage', checkKeys);
    return () => window.removeEventListener('storage', checkKeys);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (selectedAgent?.id === 'ceo') {
        setUploadedFiles(prev => [...prev, file.name]);
        toast({ title: "Report Ingested", description: `${file.name} added to analysis queue.` });
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData(prev => ({ ...prev, base64Image: reader.result as string }));
          toast({
            title: "Asset Ingested",
            description: "Photo ready for AI processing.",
          });
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleSaveToDashboard = async () => {
    if (!output?.metrics || !user || !db) return;
    setIsSavingWeb(true);
    try {
      const analysisId = `ceo-${Date.now()}`;
      const analysisRef = doc(db, "ceoAnalyses", analysisId);
      await setDoc(analysisRef, {
        id: analysisId,
        userProfileId: user.uid,
        marketplace: formData.marketplace,
        metrics: output.metrics,
        recommendations: output.recommendations,
        summary: output.narrative,
        createdAt: new Date().toISOString()
      });
      toast({ title: "Intelligence Synced", description: "Dashboard has been updated with CEO Agent data." });
    } catch (err) {
      toast({ variant: "destructive", title: "Sync Failed", description: "Failed to connect to Firestore." });
    } finally {
      setIsSavingWeb(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;
    const text = JSON.stringify(output, null, 2);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `marketmind-${selectedAgent.id}-${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast({ title: "Download Started" });
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiActive) {
      toast({ variant: "destructive", title: "AI Studio Error", description: "AI Gent node is offline check with admin" });
      return;
    }

    setIsRunning(true);
    
    try {
      let result: any;

      switch (selectedAgent.id) {
        case 'ceo':
          if (uploadedFiles.length === 0) {
            toast({ variant: "destructive", title: "Missing Reports", description: "Please upload at least one performance report (Sales/Ads/Returns)." });
            setIsRunning(false);
            return;
          }
          result = await runAICeoAnalysis({
            marketplace: formData.marketplace as any,
            reportSummary: `Reports Uploaded: ${uploadedFiles.join(', ')}`,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'ceo' });
          break;

        case 'photoshoot':
          result = await generatePhotoshoot({
            photoDataUri: formData.base64Image || undefined,
            productType: formData.productName,
            category: formData.category,
            shotAngle: formData.shotAngle,
            modelType: modelType,
            kidAge: modelType === 'kids' ? formData.kidAge : undefined,
            kidGender: modelType === 'kids' ? formData.kidGender : undefined,
            background: formData.background,
            style: "high-fashion commercial editorial, professional studio lighting, extremely detailed, 8k resolution",
            apiKey: activeKey
          });
          setOutput({ imageUrl: result.generatedImageDataUri, type: 'creative' });
          break;

        case 'video':
          if (!formData.base64Image) {
            toast({ variant: "destructive", title: "Missing Asset", description: "Please upload a product photo for video generation." });
            setIsRunning(false);
            return;
          }
          result = await generateVideoAdContent({
            productName: formData.productName,
            productCategory: formData.category,
            background: formData.background,
            marketingText: formData.productDescription,
            photoDataUri: formData.base64Image,
            apiKey: activeKey
          });
          setOutput({ videoUrl: result.videoDataUri, type: 'video' });
          break;

        case 'webbuilder':
          result = await generateWebsite({
            brandName: formData.productName,
            niche: formData.category,
            requirements: formData.productDescription,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'webbuilder' });
          break;

        case 'listing':
          result = await optimizeProductListing({
            productName: formData.productName,
            category: formData.category,
            color: formData.color,
            marketplace: formData.marketplace as any,
            photoDataUri: formData.base64Image || undefined,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'listing' });
          break;

        case 'catalog':
          result = await generateCatalogTemplate({
            marketplaces: [formData.marketplace],
            productType: formData.category,
            desiredAttributes: formData.keyFeatures.split(','),
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'catalog' });
          break;

        case 'ugc':
          result = await generateUgcCampaignAssets({
            productDescription: formData.productDescription,
            targetAudience: formData.targetAudience,
            campaignGoal: "Brand Awareness",
            keyFeatures: formData.keyFeatures.split(','),
            desiredTone: "Relatable & Authentic",
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'ugc' });
          break;

        case 'ranking':
          result = await findRankingKeywords({
            productName: formData.productName,
            category: formData.category,
            color: formData.color,
            marketplace: formData.marketplace,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'ranking' });
          break;

        case 'leads':
          result = await generateB2BLeads({
            niche: formData.category,
            location: `${formData.location}, ${formData.country}`,
            websiteUrl: formData.websiteUrl || undefined,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'leads' });
          break;

        default:
          throw new Error("This agent is currently in private beta.");
      }

      toast({ title: "Agent Execution Complete" });
    } catch (err: any) {
      console.error(err);
      toast({ variant: "destructive", title: "Agent Error", description: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  const resetForm = () => {
    setSelectedAgent(null);
    setOutput(null);
    setUploadedFiles([]);
    setModelType("none");
    setFormData({ 
      productName: "", 
      category: "Fashion", 
      color: "",
      productDescription: "",
      marketplace: "Amazon",
      targetAudience: "DTC Shoppers",
      keyFeatures: "Premium Quality, Handcrafted",
      shotAngle: "front",
      background: "professional-studio",
      kidAge: "5",
      kidGender: "boy",
      base64Image: null,
      location: "",
      country: "India",
      websiteUrl: ""
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">AI Studio</h1>
          <p className="text-muted-foreground text-sm md:text-base">Scale your marketplace presence with specialized AI agents.</p>
        </div>
        {isApiActive && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Authenticated AI Instance active
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent) => (
          <Card key={agent.id} className="group hover:border-primary/50 transition-all rounded-2xl border-white/5 bg-card overflow-hidden cursor-pointer shadow-xl" onClick={() => setSelectedAgent(agent)}>
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 ${agent.color}`}>
                <agent.icon size={24} />
              </div>
              <CardTitle className="font-headline text-lg md:text-xl text-white">{agent.title}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">{agent.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 justify-between">
              <span className="text-[10px] font-bold text-emerald-500 flex items-center uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2 animate-pulse" /> Agent Ready
              </span>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                Execute <ChevronRight size={14} className="ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden max-h-[95vh] flex flex-col p-0 text-white shadow-2xl">
          {selectedAgent && (
            <>
              <DialogHeader className="p-5 md:p-8 pb-4 shrink-0 border-b border-white/5 relative">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800 flex items-center justify-center ${selectedAgent.color}`}>
                    <selectedAgent.icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1 pr-8">
                    <DialogTitle className="text-lg md:text-2xl font-headline font-bold text-white truncate">{selectedAgent.title}</DialogTitle>
                    <DialogDescription className="text-slate-400 text-[10px] md:text-sm truncate">{selectedAgent.desc}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-5 md:p-8 pt-4 pb-24">
                  {!output ? (
                    <form onSubmit={handleRunAgent} className="space-y-6 md:space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Marketplace</Label>
                          <Select value={formData.marketplace} onValueChange={(val) => handleInputChange("marketplace", val)} required>
                            <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="Amazon">Amazon India</SelectItem>
                              <SelectItem value="Flipkart">Flipkart</SelectItem>
                              <SelectItem value="Myntra">Myntra</SelectItem>
                              <SelectItem value="Ajio">Ajio</SelectItem>
                              <SelectItem value="Nykaa">Nykaa</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {selectedAgent.id === 'ceo' ? (
                          <div className="md:col-span-2 space-y-4">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Ingest Business Intelligence Reports</Label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="p-4 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold">Sales Report</span>
                                <input type="file" className="hidden" id="sales-up" onChange={handleFileChange} />
                                <Button size="sm" variant="outline" className="h-8 text-[10px]" asChild>
                                  <label htmlFor="sales-up" className="cursor-pointer"><FileUp size={12} className="mr-1" /> Upload</label>
                                </Button>
                              </div>
                              <div className="p-4 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold">Inventory Data</span>
                                <input type="file" className="hidden" id="inv-up" onChange={handleFileChange} />
                                <Button size="sm" variant="outline" className="h-8 text-[10px]" asChild>
                                  <label htmlFor="inv-up" className="cursor-pointer"><FileUp size={12} className="mr-1" /> Upload</label>
                                </Button>
                              </div>
                              <div className="p-4 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold">Returns Report</span>
                                <input type="file" className="hidden" id="ret-up" onChange={handleFileChange} />
                                <Button size="sm" variant="outline" className="h-8 text-[10px]" asChild>
                                  <label htmlFor="ret-up" className="cursor-pointer"><FileUp size={12} className="mr-1" /> Upload</label>
                                </Button>
                              </div>
                              <div className="p-4 rounded-xl bg-slate-800 border border-white/5 flex items-center justify-between">
                                <span className="text-xs font-bold">Ads Performance</span>
                                <input type="file" className="hidden" id="ads-up" onChange={handleFileChange} />
                                <Button size="sm" variant="outline" className="h-8 text-[10px]" asChild>
                                  <label htmlFor="ads-up" className="cursor-pointer"><FileUp size={12} className="mr-1" /> Upload</label>
                                </Button>
                              </div>
                            </div>
                            {uploadedFiles.length > 0 && (
                              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 space-y-2">
                                <p className="text-[10px] font-bold text-emerald-500 uppercase">Uploaded Files ({uploadedFiles.length})</p>
                                <div className="flex flex-wrap gap-2">
                                  {uploadedFiles.map(f => (
                                    <Badge key={f} variant="outline" className="bg-slate-900 border-emerald-500/30 text-[8px]">{f}</Badge>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            {selectedAgent.id !== 'leads' && (
                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  {selectedAgent.id === 'webbuilder' ? 'Brand Name' : 'Product Name'}
                                </Label>
                                <Input 
                                  placeholder={selectedAgent.id === 'webbuilder' ? "e.g. Silk Elegance" : "e.g. Silk Kurta"}
                                  required 
                                  className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm"
                                  value={formData.productName}
                                  onChange={(e) => handleInputChange("productName", e.target.value)}
                                />
                              </div>
                            )}
                            <div className={cn("space-y-2", selectedAgent.id === 'leads' && "md:col-span-2")}>
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                {selectedAgent.id === 'leads' ? 'Target Industry' : 'Category / Niche'}
                              </Label>
                              <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)} required>
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                  <SelectValue placeholder="Select Segment" />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                  <SelectItem value="Fashion">Fashion</SelectItem>
                                  <SelectItem value="Home Decor">Home Decor</SelectItem>
                                  <SelectItem value="Electronics">Electronics</SelectItem>
                                  <SelectItem value="Health & Beauty">Health & Beauty</SelectItem>
                                  <SelectItem value="Custom">Custom</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </>
                        )}

                        {(selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video' || selectedAgent.id === 'listing') && (
                          <div className="md:col-span-2 space-y-6">
                            <div className="space-y-4 bg-slate-800/30 p-4 md:p-6 rounded-2xl border border-white/5">
                              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                              <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={cn(
                                  "border-2 border-dashed rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition-all cursor-pointer group overflow-hidden",
                                  formData.base64Image ? "border-primary/50 bg-primary/5" : "border-white/10"
                                )}
                              >
                                {formData.base64Image ? (
                                  <img src={formData.base64Image} alt="Input" className="w-full max-w-[150px] aspect-square object-contain rounded-xl shadow-2xl" />
                                ) : (
                                  <><Upload size={24} className="text-primary" /><p className="text-xs md:text-sm font-bold">Upload Product Asset</p></>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full h-12 md:h-14 rounded-xl text-sm md:text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" 
                          disabled={isRunning}
                        >
                          {isRunning ? <><RefreshCw className="mr-2 h-5 w-5 animate-spin" /> {selectedAgent.id === 'ceo' ? 'Analyzing Financial Data...' : 'Orchestrating AI...'}</> : <><Zap className="mr-2 h-5 w-5" /> Start Production</>}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="p-5 md:p-10 rounded-2xl md:rounded-3xl bg-slate-800/50 border border-white/5 space-y-6 md:space-y-8">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold font-headline text-lg md:text-xl text-white">Output Generated</h4>
                          <Badge className="bg-emerald-500 text-[10px]">Production Ready</Badge>
                        </div>
                        
                        {output.type === 'ceo' && (
                          <div className="space-y-8">
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                              <Card className="bg-slate-900 border-white/5 p-4 rounded-xl">
                                <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">Total Sales</p>
                                <p className="text-lg font-bold text-white">₹{output.metrics.totalSales.toLocaleString()}</p>
                              </Card>
                              <Card className="bg-slate-900 border-white/5 p-4 rounded-xl">
                                <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">Net Profit</p>
                                <p className="text-lg font-bold text-emerald-500">₹{output.metrics.profit.toLocaleString()}</p>
                              </Card>
                              <Card className="bg-slate-900 border-white/5 p-4 rounded-xl">
                                <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">Identified Loss</p>
                                <p className="text-lg font-bold text-rose-500">₹{output.metrics.loss.toLocaleString()}</p>
                              </Card>
                              <Card className="bg-slate-900 border-white/5 p-4 rounded-xl">
                                <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">Return Rate</p>
                                <p className="text-lg font-bold text-amber-500">{output.metrics.returnRate}%</p>
                              </Card>
                              <Card className="bg-slate-900 border-white/5 p-4 rounded-xl">
                                <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">CTR</p>
                                <p className="text-lg font-bold text-blue-500">{output.metrics.ctr}%</p>
                              </Card>
                              <Card className="bg-slate-900 border-white/5 p-4 rounded-xl">
                                <p className="text-[8px] uppercase text-slate-500 font-bold mb-1">ROAS</p>
                                <p className="text-lg font-bold text-indigo-500">{output.metrics.roas}x</p>
                              </Card>
                            </div>

                            <div className="space-y-4">
                              <Label className="text-[10px] font-bold uppercase text-amber-400">CEO Strategic Recommendations</Label>
                              <div className="grid grid-cols-1 gap-2">
                                {output.recommendations.map((r: string, i: number) => (
                                  <div key={i} className="flex gap-3 p-4 bg-slate-900 rounded-xl text-xs border border-white/5 border-l-amber-500/50 border-l-4">
                                    <Zap className="text-amber-400 size-4 shrink-0" /> {r}
                                  </div>
                                ))}
                              </div>
                            </div>

                            <div className="p-5 bg-slate-900 rounded-2xl border border-white/5 space-y-2">
                              <Label className="text-[10px] font-bold uppercase text-slate-500">Executive Narrative</Label>
                              <p className="text-xs md:text-sm text-slate-300 leading-relaxed italic">"{output.narrative}"</p>
                            </div>
                          </div>
                        )}

                        {output.imageUrl && (
                          <div className="w-full max-w-lg mx-auto aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-900">
                            <img src={output.imageUrl} alt="AI Result" className="w-full h-full object-cover" />
                          </div>
                        )}

                        {output.videoUrl && (
                          <div className="w-full max-w-lg mx-auto aspect-[9/16] rounded-2xl md:rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-900 group relative">
                            <video src={output.videoUrl} className="w-full h-full object-cover" autoPlay loop muted controls />
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pb-12">
                        <Button variant="outline" className="flex-1 h-11 md:h-12 rounded-xl border-white/10 text-white" onClick={() => setOutput(null)}>New Session</Button>
                        
                        {output.type === 'ceo' && (
                          <Button 
                            className="flex-1 h-11 md:h-12 rounded-xl bg-amber-600 hover:bg-amber-700 shadow-lg font-bold text-white"
                            onClick={handleSaveToDashboard}
                            disabled={isSavingWeb}
                          >
                            {isSavingWeb ? <Loader2 className="animate-spin mr-2" /> : <RefreshCw size={18} className="mr-2" />} 
                            Sync to Dashboard Overview
                          </Button>
                        )}

                        <Button className="flex-1 h-11 md:h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold text-white" onClick={handleDownload}>
                          <FileDown size={18} className="mr-2" /> Download Report
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="p-3 md:p-4 bg-slate-950/50 border-t border-white/5 flex items-center justify-center gap-2 shrink-0">
                <div className={`w-1.5 h-1.5 rounded-full ${isApiActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-[8px] md:text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                  {isApiActive ? 'AI Production Pipeline Active' : 'Internal Node Offline - Demo Only'}
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>}>
      <AgentsContent />
    </Suspense>
  );
}
