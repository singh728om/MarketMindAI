"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Sparkles, 
  Camera, 
  Video, 
  FileText, 
  LayoutGrid, 
  FileSearch,
  Users,
  ChevronRight,
  Loader2,
  Download,
  Upload,
  Zap,
  CheckCircle2,
  Search,
  Globe,
  RefreshCw,
  Copy,
  FileDown,
  BarChart3,
  Mail,
  ExternalLink,
  X
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
import { generateClientReportNarrative } from "@/ai/flows/generate-client-report-narrative";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

const AGENTS = [
  { id: "photoshoot", title: "AI Photoshoot Studio", icon: Camera, desc: "Professional studio reshoots with model and environment control.", color: "text-purple-500" },
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and descriptions.", color: "text-blue-500" },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500" },
  { id: "video", title: "Video Ad Agent", icon: Video, desc: "Storyboard + text-to-video prompt generation.", color: "text-rose-500" },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "Creative hooks + detailed scripts.", color: "text-orange-500" },
  { id: "report", title: "Client Report Narrator", icon: FileSearch, desc: "Weekly performance analysis into narrative.", color: "text-indigo-500" },
  { id: "ranking", title: "Ranking Keyword Finder", icon: Search, desc: "Discover high-intent keywords to boost visibility.", color: "text-amber-500" },
  { id: "leads", title: "Lead Generation Agent", icon: Globe, desc: "Extract B2B leads via location or website analysis.", color: "text-cyan-500" },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [modelType, setModelType] = useState<string>("none");
  const [isApiActive, setIsApiActive] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("");
  
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    productDescription: "",
    marketplace: "Amazon",
    targetAudience: "DTC Shoppers",
    keyFeatures: "Premium Quality, Handcrafted",
    shotAngle: "front",
    background: "pro-studio",
    base64Image: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkKeys = () => {
      const keys = localStorage.getItem("marketmind_api_keys");
      if (keys) {
        try {
          const parsed = JSON.parse(keys);
          if (parsed.gemini && parsed.gemini.trim() !== "") {
            setIsApiActive(true);
            setActiveKey(parsed.gemini);
            return;
          }
        } catch (e) {
          console.error("Failed to check API keys", e);
        }
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, base64Image: reader.result as string }));
        toast({
          title: "Product Ingested",
          description: "Photo ready for professional reshoot.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiActive) {
      toast({
        variant: "destructive",
        title: "AI Studio Error",
        description: "AI Gent node is offline check with admin",
      });
      return;
    }

    setIsRunning(true);
    
    try {
      let result: any;

      switch (selectedAgent.id) {
        case 'photoshoot':
          result = await generatePhotoshoot({
            photoDataUri: formData.base64Image || undefined,
            productType: formData.productName,
            shotAngle: formData.shotAngle,
            modelType: modelType,
            background: formData.background,
            style: "high-fashion commercial editorial, professional studio lighting, extremely detailed, 8k resolution",
            apiKey: activeKey
          });
          setOutput({ imageUrl: result.generatedImageDataUri, type: 'creative' });
          break;

        case 'listing':
          result = await optimizeProductListing({
            productName: formData.productName,
            category: formData.category,
            keyFeatures: formData.keyFeatures.split(','),
            targetAudience: formData.targetAudience,
            marketplace: formData.marketplace as any,
            existingDescription: formData.productDescription,
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

        case 'video':
          result = await generateVideoAdContent({
            productName: formData.productName,
            productDescription: formData.productDescription,
            targetAudience: formData.targetAudience,
            adGoal: "Increase Sales",
            callToAction: "Shop Now",
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'video' });
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

        case 'report':
          result = await generateClientReportNarrative({
            clientName: "CHIC ELAN",
            reportPeriod: "Last 7 Days",
            kpis: { sales: "+15%", ctr: "4.2%", conversion: "3.1%", roas: "4.5x" },
            weeklyPerformanceData: JSON.stringify({ visits: 4500, orders: 120 }),
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'report' });
          break;

        case 'ranking':
          await new Promise(r => setTimeout(r, 1500));
          setOutput({ 
            type: 'ranking',
            keywords: [
              { term: `${formData.productName} for festive season`, volume: "12.5k", difficulty: "Medium" },
              { term: `Best ${formData.category} under 2000`, volume: "45k", difficulty: "High" },
              { term: `Handcrafted ${formData.productName}`, volume: "3.2k", difficulty: "Low" },
              { term: `${formData.marketplace} fashion trends 2024`, volume: "89k", difficulty: "Very High" }
            ]
          });
          break;

        case 'leads':
          await new Promise(r => setTimeout(r, 1500));
          setOutput({
            type: 'leads',
            results: [
              { company: "Ethnic Elegance Exports", contact: "Vikram Mehta", email: "v.exports@elegance.com", website: "eleganceexports.in" },
              { company: "Vastra Boutique Group", contact: "Ananya Iyer", email: "buying@vastra.com", website: "vastraboutique.in" },
              { company: "Retail Core India", contact: "Sameer Shah", email: "vendor@retailcore.co.in", website: "retailcore.in" }
            ]
          });
          break;

        default:
          throw new Error("This agent is currently in private beta.");
      }

      toast({
        title: "Agent Execution Complete",
        description: `${selectedAgent.title} has generated the output.`,
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "Agent Error",
        description: err.message || "Failed to execute agent. Please verify your API key.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const resetForm = () => {
    setSelectedAgent(null);
    setOutput(null);
    setModelType("none");
    setFormData({ 
      productName: "", 
      category: "", 
      productDescription: "",
      marketplace: "Amazon",
      targetAudience: "DTC Shoppers",
      keyFeatures: "Premium Quality, Handcrafted",
      shotAngle: "front",
      background: "pro-studio",
      base64Image: null
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
            Production Ready
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
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-2xl md:rounded-3xl overflow-hidden max-h-[95vh] flex flex-col p-0 text-white shadow-2xl">
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
                <div className="p-5 md:p-8 pt-4 pb-20">
                  {!output ? (
                    <form onSubmit={handleRunAgent} className="space-y-6 md:space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Name</Label>
                          <Input 
                            placeholder="e.g. Silk Kurta" 
                            required 
                            className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm"
                            value={formData.productName}
                            onChange={(e) => handleInputChange("productName", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category</Label>
                          <Select onValueChange={(val) => handleInputChange("category", val)} required>
                            <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                              <SelectValue placeholder="Select Segment" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="Fashion">Fashion</SelectItem>
                              <SelectItem value="Electronics">Electronics</SelectItem>
                              <SelectItem value="Home">Home & Decor</SelectItem>
                              <SelectItem value="Beauty">Beauty</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="md:col-span-2 space-y-2">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Description / Details</Label>
                          <Input 
                            placeholder="Brief details about the product..." 
                            className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm"
                            value={formData.productDescription}
                            onChange={(e) => handleInputChange("productDescription", e.target.value)}
                          />
                        </div>
                      </div>

                      {selectedAgent.id === 'photoshoot' && (
                        <div className="space-y-6 bg-slate-800/30 p-4 md:p-8 rounded-2xl border border-white/5 animate-in fade-in slide-in-from-top-2">
                          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className={cn(
                              "border-2 border-dashed rounded-2xl p-6 md:p-12 flex flex-col items-center justify-center gap-3 hover:bg-slate-800 transition-all cursor-pointer group overflow-hidden",
                              formData.base64Image ? "border-primary/50 bg-primary/5" : "border-white/10"
                            )}
                          >
                             {formData.base64Image ? (
                               <img src={formData.base64Image} alt="Input" className="w-full max-w-[180px] aspect-square object-contain rounded-xl shadow-2xl" />
                             ) : (
                               <><Upload size={24} className="text-primary" /><p className="text-xs md:text-sm font-bold">Upload Product Photo</p></>
                             )}
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Model</Label>
                              <Select onValueChange={(val) => setModelType(val)} defaultValue="none">
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl text-white text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                  <SelectItem value="male">Male</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="kids">Kids</SelectItem>
                                  <SelectItem value="none">Product Only</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lens / Angle</Label>
                              <Select onValueChange={(val) => handleInputChange("shotAngle", val)} defaultValue="front">
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl text-white text-sm"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                  <SelectItem value="front">Eye Level (Front)</SelectItem>
                                  <SelectItem value="back">Back View</SelectItem>
                                  <SelectItem value="zoom">Macro Close-up</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="pt-4">
                        <Button 
                          type="submit" 
                          className="w-full h-12 md:h-14 rounded-xl text-sm md:text-lg font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20" 
                          disabled={isRunning}
                        >
                          {isRunning ? <><RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Orchestrating AI...</> : <><Zap className="mr-2 h-5 w-5" /> Start Production</>}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="p-5 md:p-10 rounded-2xl md:rounded-3xl bg-slate-800/50 border border-white/5 space-y-6 md:space-y-8">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold font-headline text-lg md:text-xl">Output Generated</h4>
                          <Badge className="bg-emerald-500 text-[10px]">Production Ready</Badge>
                        </div>
                        
                        {output.imageUrl && (
                          <div className="w-full max-w-lg mx-auto aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-900">
                            <img src={output.imageUrl} alt="AI Result" className="w-full h-full object-cover" />
                          </div>
                        )}

                        {output.type === 'listing' && (
                          <div className="space-y-4 md:space-y-6">
                            <div className="p-4 bg-slate-900 rounded-xl space-y-2 border border-white/5">
                              <Label className="text-[10px] font-bold uppercase text-slate-500">Optimized Title</Label>
                              <p className="font-bold text-sm md:text-base leading-snug">{output.title}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-2">
                              {output.bulletPoints.map((b: string, i: number) => (
                                <div key={i} className="flex gap-3 p-3 bg-slate-900 rounded-xl text-xs md:text-sm border border-white/5">
                                  <CheckCircle2 className="text-emerald-500 size-4 shrink-0 mt-0.5" /> {b}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {output.type === 'catalog' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-900 rounded-xl font-mono text-[10px] md:text-xs overflow-x-auto whitespace-pre border border-white/5">
                              {output.templateContent}
                            </div>
                            <p className="text-[10px] md:text-xs text-slate-400 italic leading-relaxed">{output.notes}</p>
                          </div>
                        )}

                        {output.type === 'video' && (
                          <div className="space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 gap-3">
                              {output.storyboard.map((s: any) => (
                                <div key={s.sceneNumber} className="p-4 bg-slate-900 rounded-xl border border-white/5">
                                  <p className="text-[10px] font-bold text-rose-400 mb-1 uppercase">Scene {s.sceneNumber}</p>
                                  <p className="text-xs md:text-sm font-medium leading-relaxed">{s.description}</p>
                                  <p className="text-[10px] text-slate-500 mt-2 italic">{s.visualElements}</p>
                                </div>
                              ))}
                            </div>
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                              <Label className="text-[10px] font-bold uppercase text-rose-400">Generation Prompt</Label>
                              <p className="text-[10px] md:text-xs italic mt-1 leading-relaxed">{output.videoGenerationPrompt}</p>
                            </div>
                          </div>
                        )}

                        {output.type === 'ugc' && (
                          <div className="space-y-6">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase text-orange-500">Creative Hooks</Label>
                              <div className="flex flex-wrap gap-2">
                                {output.creativeHooks.map((h: string, i: number) => (
                                  <Badge key={i} variant="secondary" className="bg-slate-900 text-[10px] py-1 border border-white/5">{h}</Badge>
                                ))}
                              </div>
                            </div>
                            <div className="p-4 bg-slate-900 rounded-xl border border-white/5">
                              <Label className="text-[10px] font-bold uppercase text-orange-500">Creator Brief</Label>
                              <p className="text-[10px] md:text-xs mt-2 leading-relaxed whitespace-pre-wrap text-slate-300">{output.creatorBrief}</p>
                            </div>
                          </div>
                        )}

                        {output.type === 'report' && (
                          <div className="p-5 md:p-6 bg-slate-900 rounded-2xl border border-white/5">
                            <p className="text-xs md:text-sm leading-relaxed whitespace-pre-wrap text-slate-300">{output.narrativeSummary}</p>
                          </div>
                        )}

                        {output.type === 'ranking' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-2 md:gap-3">
                              {output.keywords.map((k: any, i: number) => (
                                <div key={i} className="flex items-center justify-between p-3 md:p-4 bg-slate-900 rounded-xl border border-white/5">
                                  <div className="flex items-center gap-3 min-w-0">
                                    <BarChart3 className="text-amber-500 size-4 shrink-0" />
                                    <span className="font-bold text-xs md:text-sm truncate">{k.term}</span>
                                  </div>
                                  <div className="flex gap-3 md:gap-4 shrink-0">
                                    <div className="text-right">
                                      <p className="text-[8px] uppercase text-slate-500 font-bold">Vol</p>
                                      <p className="text-[10px] md:text-xs font-mono">{k.volume}</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                      <p className="text-[8px] uppercase text-slate-500 font-bold">Diff</p>
                                      <Badge variant="outline" className="text-[8px] h-4 py-0 border-white/10">{k.difficulty}</Badge>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {output.type === 'leads' && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-2 md:gap-3">
                              {output.results.map((l: any, i: number) => (
                                <div key={i} className="p-3 md:p-4 bg-slate-900 rounded-xl border border-white/5 flex items-center justify-between">
                                  <div className="space-y-0.5 min-w-0 flex-1 mr-2">
                                    <p className="font-bold text-xs md:text-sm text-cyan-400 truncate">{l.company}</p>
                                    <p className="text-[10px] text-slate-400 flex items-center gap-1"><Users size={10} /> {l.contact}</p>
                                  </div>
                                  <div className="flex gap-1 md:gap-2 shrink-0">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" title="Email Lead">
                                      <Mail size={12} />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" title="Visit Site">
                                      <ExternalLink size={12} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pb-8">
                        <Button variant="outline" className="flex-1 h-11 md:h-12 rounded-xl border-white/10" onClick={() => setOutput(null)}>New Session</Button>
                        <Button className="flex-1 h-11 md:h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold">
                          <FileDown size={18} className="mr-2" /> Download Assets
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
