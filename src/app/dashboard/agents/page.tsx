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
  Layout,
  Briefcase,
  Download,
  HardDrive,
  Copy,
  CheckCircle2,
  Cpu
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
import { generateVideoAdContent } from "@/ai/flows/generate-video-ad-content";
import { findRankingKeywords } from "@/ai/flows/find-ranking-keywords";
import { generateB2BLeads } from "@/ai/flows/generate-b2b-leads";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";

const AGENTS = [
  { id: "photoshoot", title: "AI Photoshoot Studio", icon: Camera, desc: "Professional studio reshoots with model and environment control.", color: "text-purple-500" },
  { id: "video", title: "Product to AI Video Ads", icon: Video, desc: "Transform product images into 5s cinematic UGC video ads.", color: "text-rose-500" },
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and descriptions via Gemini Vision.", color: "text-blue-500" },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500" },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "Creative hooks + detailed scripts.", color: "text-orange-500" },
  { id: "ranking", title: "Ranking Keyword Finder", icon: Search, desc: "Discover 10 high-intent keywords to boost visibility.", color: "text-amber-500" },
  { id: "leads", title: "Lead Generation Agent", icon: Globe, desc: "Extract B2B leads via location or website analysis.", color: "text-cyan-500" },
  { id: "webbuilder", title: "AI Website Builder", icon: Layout, desc: "Generate a fully responsive, optimized brand landing page.", color: "text-indigo-400" },
];

function AgentsContent() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isVaulting, setIsVaulting] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [isApiActive, setIsApiActive] = useState(false);
  const [activeKeys, setActiveKeys] = useState<{ gemini: string; openai: string }>({ gemini: "", openai: "" });
  const [hasMounted, setHasMounted] = useState(false);
  
  const searchParams = useSearchParams();
  const initialAgentId = searchParams.get("agent");

  const [formData, setFormData] = useState({
    productName: "",
    category: "Fashion",
    color: "",
    productDescription: "",
    marketplace: "Amazon",
    shotAngle: "front",
    background: "studio",
    modelType: "none",
    kidAge: "5",
    base64Image: null as string | null,
    location: "",
    country: "India",
    websiteUrl: "",
    style: "high-end commercial editorial, extremely detailed, realistic lighting",
    aiEngine: "gemini",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
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
          setActiveKeys({
            gemini: parsed.gemini || "",
            openai: parsed.openai || ""
          });
          if (parsed.gemini && parsed.gemini.trim() !== "") {
            setIsApiActive(true);
          }
        }
      } catch (e) {}
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
        toast({ title: "Asset Ingested", description: "Ready for AI processing." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVaultOutput = () => {
    if (!output) return;
    setIsVaulting(true);
    
    setTimeout(() => {
      try {
        const savedFilesStr = localStorage.getItem("marketmind_vault_files");
        const files = savedFilesStr ? JSON.parse(savedFilesStr) : [];
        
        const newFile = {
          id: Date.now(),
          name: `${selectedAgent.title}_Result_${Date.now().toString().slice(-4)}.${output.type === 'video' ? 'mp4' : 'png'}`,
          type: output.type === 'video' ? 'VIDEO' : 'IMAGE',
          size: "1.2 MB",
          date: "Just now",
          status: "Stored",
          url: output.imageUrl || output.videoUrl
        };
        
        localStorage.setItem("marketmind_vault_files", JSON.stringify([newFile, ...files]));
        localStorage.setItem("marketmind_vault_active", "true");
        
        toast({
          title: "Secured in Vault",
          description: "This asset has been added to your storage service.",
        });
      } catch (err) {
        console.error(err);
      } finally {
        setIsVaulting(false);
      }
    }, 1000);
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiActive) {
      toast({ variant: "destructive", title: "API Node Offline", description: "Please enter your Gemini API Key in System Config." });
      return;
    }

    if (formData.aiEngine === 'openai' && !activeKeys.openai) {
      toast({ variant: "destructive", title: "OpenAI Node Offline", description: "Please enter your OpenAI API Key in System Config." });
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
            category: formData.category,
            shotAngle: formData.shotAngle,
            modelType: formData.modelType,
            kidAge: formData.modelType === 'kids' ? formData.kidAge : undefined,
            background: formData.background,
            style: formData.style,
            apiKey: activeKeys.gemini,
            openaiApiKey: activeKeys.openai,
            aiEngine: formData.aiEngine as any
          });
          setOutput({ imageUrl: result.generatedImageDataUri, type: 'creative' });
          break;
        case 'video':
          if (!formData.base64Image) {
            throw new Error("Base product photo required for video generation.");
          }
          result = await generateVideoAdContent({
            productName: formData.productName,
            productCategory: formData.category,
            background: formData.background,
            photoDataUri: formData.base64Image,
            apiKey: activeKeys.gemini
          });
          setOutput({ videoUrl: result.videoDataUri, type: 'video' });
          break;
        case 'listing':
          result = await optimizeProductListing({
            productName: formData.productName,
            category: formData.category,
            marketplace: formData.marketplace as any,
            photoDataUri: formData.base64Image || undefined,
            apiKey: activeKeys.gemini
          });
          setOutput({ ...result, type: 'listing' });
          break;
        case 'ranking':
          result = await findRankingKeywords({
            productName: formData.productName,
            category: formData.category,
            marketplace: formData.marketplace,
            apiKey: activeKeys.gemini
          });
          setOutput({ ...result, type: 'ranking' });
          break;
        case 'leads':
          result = await generateB2BLeads({
            niche: formData.category,
            location: formData.location,
            apiKey: activeKeys.gemini
          });
          setOutput({ ...result, type: 'leads' });
          break;
        default:
          throw new Error("Agent logic currently under maintenance.");
      }
      toast({ title: "Execution Complete", description: "Agent has delivered the output." });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Execution Failed", description: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">AI Studio</h1>
          <p className="text-muted-foreground">Scale your presence with specialized AI agents.</p>
        </div>
        {isApiActive && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            AI Node Active
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent) => (
          <Card key={agent.id} className="group hover:border-primary/50 transition-all rounded-2xl border-white/5 bg-card overflow-hidden cursor-pointer shadow-xl" onClick={() => { setOutput(null); setSelectedAgent(agent); }}>
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 ${agent.color}`}>
                <agent.icon size={24} />
              </div>
              <CardTitle className="font-headline text-lg text-white">{agent.title}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">{agent.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 justify-between">
              <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Ready</span>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Configure <ChevronRight size={14} className="ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden max-h-[95vh] flex flex-col p-0 text-white shadow-2xl">
          {selectedAgent && (
            <>
              <DialogHeader className="p-6 md:p-8 border-b border-white/5 bg-slate-900/50 shrink-0">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800 flex items-center justify-center ${selectedAgent.color}`}>
                    <selectedAgent.icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <DialogTitle className="text-xl md:text-2xl font-headline font-bold truncate">{selectedAgent.title}</DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs md:text-sm truncate">{selectedAgent.desc}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1">
                <div className="p-6 md:p-8">
                  {!output ? (
                    <form onSubmit={handleRunAgent} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5">
                        {/* AI Engine Selection for Photoshoot */}
                        {selectedAgent.id === 'photoshoot' && (
                          <div className="md:col-span-2 space-y-2 pb-2 border-b border-white/5">
                            <Label className="text-[10px] uppercase font-bold text-primary tracking-widest flex items-center gap-2 mb-1">
                              <Cpu size={12} /> AI Generation Engine
                            </Label>
                            <Select value={formData.aiEngine} onValueChange={(val) => handleInputChange("aiEngine", val)}>
                              <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                              <SelectContent className="bg-slate-800 border-white/10 text-white">
                                <SelectItem value="gemini">Google Gemini (Astra Core)</SelectItem>
                                <SelectItem value="openai">OpenAI DALL-E 3</SelectItem>
                              </SelectContent>
                            </Select>
                            <p className="text-[10px] text-slate-500 italic">OpenAI offers high-detail commercial renders; Gemini excels at photorealism.</p>
                          </div>
                        )}

                        {/* Common Fields Grouped */}
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Marketplace Context</Label>
                          <Select value={formData.marketplace} onValueChange={(val) => handleInputChange("marketplace", val)}>
                            <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="Amazon">Amazon India</SelectItem>
                              <SelectItem value="Flipkart">Flipkart</SelectItem>
                              <SelectItem value="Myntra">Myntra</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Product Name</Label>
                          <Input placeholder="e.g. Premium Silk Kurta" className="bg-slate-800 border-white/5 h-11 rounded-xl" value={formData.productName} onChange={(e) => handleInputChange("productName", e.target.value)} required />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Category</Label>
                          <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                            <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="Fashion">Fashion & Apparel</SelectItem>
                              <SelectItem value="Home Decor">Home Decor</SelectItem>
                              <SelectItem value="Electronics">Electronics</SelectItem>
                              <SelectItem value="Beauty">Beauty & Wellness</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Photoshoot Specific Fields */}
                        {selectedAgent.id === 'photoshoot' && (
                          <>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Shot Angle</Label>
                              <Select value={formData.shotAngle} onValueChange={(val) => handleInputChange("shotAngle", val)}>
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                  <SelectItem value="front">Straight Front</SelectItem>
                                  <SelectItem value="back">Back View</SelectItem>
                                  <SelectItem value="left-side">Left Side</SelectItem>
                                  <SelectItem value="right-side">Right Side</SelectItem>
                                  <SelectItem value="close">Macro Texture</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Model Type</Label>
                              <Select value={formData.modelType} onValueChange={(val) => handleInputChange("modelType", val)}>
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                  <SelectItem value="none">None (Product Only)</SelectItem>
                                  <SelectItem value="mens">Male Model</SelectItem>
                                  <SelectItem value="womens">Female Model</SelectItem>
                                  <SelectItem value="kids">Child Model</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            {formData.modelType === 'kids' && (
                              <div className="space-y-2">
                                <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Age Group</Label>
                                <Input type="number" placeholder="5" className="bg-slate-800 border-white/5 h-11 rounded-xl" value={formData.kidAge} onChange={(e) => handleInputChange("kidAge", e.target.value)} />
                              </div>
                            )}
                            <div className="space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Background</Label>
                              <Select value={formData.background} onValueChange={(val) => handleInputChange("background", val)}>
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                  <SelectItem value="studio">Studio</SelectItem>
                                  <SelectItem value="outdoor">Urban Street</SelectItem>
                                  <SelectItem value="sport">Gym / Fitness</SelectItem>
                                  <SelectItem value="nature">Garden / Park</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="md:col-span-2 space-y-2">
                              <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Style Direction</Label>
                              <Textarea placeholder="e.g. cinematic lighting, vogue aesthetic..." className="bg-slate-800 border-white/5 rounded-xl min-h-[70px] text-sm" value={formData.style} onChange={(e) => handleInputChange("style", e.target.value)} />
                            </div>
                          </>
                        )}

                        {/* Video Specific Fields */}
                        {selectedAgent.id === 'video' && (
                          <div className="space-y-2">
                            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Scene Environment</Label>
                            <Select value={formData.background} onValueChange={(val) => handleInputChange("background", val)}>
                              <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl"><SelectValue /></SelectTrigger>
                              <SelectContent className="bg-slate-800 border-white/10 text-white">
                                <SelectItem value="luxury lounge">Luxury Lounge</SelectItem>
                                <SelectItem value="modern kitchen">Modern Kitchen</SelectItem>
                                <SelectItem value="bright studio">Bright Studio</SelectItem>
                                <SelectItem value="nature park">Morning Nature Park</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}

                        {/* Asset Upload */}
                        {(selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video' || selectedAgent.id === 'listing') && (
                          <div className="md:col-span-2 space-y-3">
                            <Label className="text-[10px] uppercase font-bold text-slate-500 tracking-widest">Raw Product Image</Label>
                            <div onClick={() => fileInputRef.current?.click()} className={cn("border-2 border-dashed rounded-2xl p-6 md:p-10 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all", formData.base64Image ? "border-primary bg-primary/5" : "border-white/10 bg-slate-800/30 hover:bg-slate-800/50")}>
                              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                              {formData.base64Image ? (
                                <div className="relative group">
                                  <img src={formData.base64Image} className="w-24 h-24 md:w-32 md:h-32 object-contain rounded-lg" />
                                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                                    <p className="text-[10px] font-bold uppercase">Change</p>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Upload size={20} />
                                  </div>
                                  <div className="text-center">
                                    <p className="text-sm font-bold">Upload product photo</p>
                                    <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tighter">PNG, JPG (Max 5MB)</p>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="pt-4 pb-12">
                        <Button type="submit" className="w-full h-14 md:h-16 rounded-2xl font-bold shadow-2xl shadow-primary/20 text-lg" disabled={isRunning}>
                          {isRunning ? <><RefreshCw className="mr-2 animate-spin" /> Astra Processing...</> : <><Zap className="mr-2" /> Execute Agent</>}
                        </Button>
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 pb-12">
                      <div className="p-6 md:p-10 rounded-[2.5rem] bg-slate-800/50 border border-white/5 space-y-8">
                        <div className="text-center space-y-2">
                          <Badge className="bg-emerald-500 text-white uppercase font-bold text-[10px] tracking-widest mb-2">Success</Badge>
                          <h3 className="text-2xl md:text-3xl font-headline font-bold">Astra Intelligence Delivery</h3>
                          <p className="text-slate-400 text-sm md:text-base">The agent has processed your request based on marketplace parameters.</p>
                        </div>

                        {output.imageUrl && (
                          <div className="relative group max-w-lg mx-auto">
                            <img src={output.imageUrl} className="w-full rounded-[2rem] shadow-2xl" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors rounded-[2rem]" />
                          </div>
                        )}
                        {output.videoUrl && (
                          <video src={output.videoUrl} className="w-full max-w-lg mx-auto rounded-[2rem] shadow-2xl" controls autoPlay loop />
                        )}
                        
                        {output.type === 'listing' && (
                          <div className="space-y-6 max-w-2xl mx-auto">
                            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
                              <Label className="text-[10px] uppercase font-bold text-primary tracking-widest mb-2 block">SEO Title</Label>
                              <p className="text-lg font-bold">{output.title}</p>
                            </div>
                            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5">
                              <Label className="text-[10px] uppercase font-bold text-primary tracking-widest mb-4 block">Key Performance Bullets</Label>
                              <ul className="space-y-3">
                                {output.bulletPoints?.map((b: string, i: number) => (
                                  <li key={i} className="flex gap-3 text-sm">
                                    <CheckCircle2 size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                                    <span className="text-slate-300">{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                        <Button variant="outline" className="flex-1 h-14 rounded-2xl border-white/10" onClick={() => setOutput(null)}>
                          Discard Result
                        </Button>
                        <Button className="flex-1 h-14 rounded-2xl font-bold shadow-xl shadow-primary/20" onClick={handleVaultOutput} disabled={isVaulting}>
                          {isVaulting ? <><Loader2 className="mr-2 animate-spin" /> Securing...</> : <><HardDrive className="mr-2" /> Vault Asset</>}
                        </Button>
                        <Button variant="secondary" className="flex-1 h-14 rounded-2xl font-bold" onClick={() => toast({ title: "Initiating Download..." })}>
                          <Download className="mr-2" /> Download
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>}>
      <AgentsContent />
    </Suspense>
  );
}
