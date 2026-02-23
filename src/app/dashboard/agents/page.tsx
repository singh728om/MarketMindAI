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
  Copy
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
  const [isVaulting, setIsVaulting] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [isApiActive, setIsApiActive] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("");
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
          if (parsed.gemini && parsed.gemini.trim() !== "") {
            setIsApiActive(true);
            setActiveKey(parsed.gemini);
            return;
          }
        }
      } catch (e) {}
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
        toast({ title: "Asset Ingested", description: "Ready for AI processing." });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to Clipboard" });
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiActive) {
      toast({ variant: "destructive", title: "API Node Offline", description: "Please check your settings." });
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
            apiKey: activeKey
          });
          setOutput({ imageUrl: result.generatedImageDataUri, type: 'creative' });
          break;
        case 'video':
          result = await generateVideoAdContent({
            productName: formData.productName,
            productCategory: formData.category,
            background: formData.background,
            photoDataUri: formData.base64Image!,
            apiKey: activeKey
          });
          setOutput({ videoUrl: result.videoDataUri, type: 'video' });
          break;
        case 'listing':
          result = await optimizeProductListing({
            productName: formData.productName,
            category: formData.category,
            marketplace: formData.marketplace as any,
            photoDataUri: formData.base64Image || undefined,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'listing' });
          break;
        case 'ranking':
          result = await findRankingKeywords({
            productName: formData.productName,
            category: formData.category,
            marketplace: formData.marketplace,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'ranking' });
          break;
        case 'leads':
          result = await generateB2BLeads({
            niche: formData.category,
            location: formData.location,
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'leads' });
          break;
        default:
          throw new Error("Coming soon.");
      }
      toast({ title: "Execution Complete" });
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.message });
    } finally {
      setIsRunning(false);
    }
  };

  if (!hasMounted) return null;

  return (
    <div className="space-y-8">
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
          <Card key={agent.id} className="group hover:border-primary/50 transition-all rounded-2xl border-white/5 bg-card overflow-hidden cursor-pointer shadow-xl" onClick={() => setSelectedAgent(agent)}>
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 ${agent.color}`}>
                <agent.icon size={24} />
              </div>
              <CardTitle className="font-headline text-lg text-white">{agent.title}</CardTitle>
              <CardDescription className="text-slate-400 text-sm">{agent.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 justify-between">
              <span className="text-[10px] font-bold text-emerald-500 uppercase">Ready</span>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Run <ChevronRight size={14} className="ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && setSelectedAgent(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden max-h-[95vh] flex flex-col p-0 text-white shadow-2xl">
          {selectedAgent && (
            <>
              <DialogHeader className="p-8 border-b border-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center ${selectedAgent.color}`}>
                    <selectedAgent.icon size={24} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-headline font-bold">{selectedAgent.title}</DialogTitle>
                    <DialogDescription className="text-slate-400">{selectedAgent.desc}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <ScrollArea className="flex-1">
                <div className="p-8 pb-24">
                  {!output ? (
                    <form onSubmit={handleRunAgent} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-slate-500">Marketplace</Label>
                          <Select value={formData.marketplace} onValueChange={(val) => handleInputChange("marketplace", val)}>
                            <SelectTrigger className="bg-slate-800 border-white/5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="Amazon">Amazon India</SelectItem>
                              <SelectItem value="Flipkart">Flipkart</SelectItem>
                              <SelectItem value="Myntra">Myntra</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-slate-500">Product Name</Label>
                          <Input placeholder="e.g. Silk Kurta" className="bg-slate-800 border-white/5 h-12 rounded-xl" value={formData.productName} onChange={(e) => handleInputChange("productName", e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-xs uppercase font-bold text-slate-500">Category</Label>
                          <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)}>
                            <SelectTrigger className="bg-slate-800 border-white/5 h-12 rounded-xl"><SelectValue /></SelectTrigger>
                            <SelectContent className="bg-slate-800 border-white/10 text-white">
                              <SelectItem value="Fashion">Fashion</SelectItem>
                              <SelectItem value="Home Decor">Home Decor</SelectItem>
                              <SelectItem value="Electronics">Electronics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        {(selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video' || selectedAgent.id === 'listing') && (
                          <div className="md:col-span-2 space-y-4">
                            <Label className="text-xs uppercase font-bold text-slate-500">Upload Photo</Label>
                            <div onClick={() => fileInputRef.current?.click()} className={cn("border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all", formData.base64Image ? "border-primary bg-primary/5" : "border-white/10 bg-slate-800/30")}>
                              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                              {formData.base64Image ? <img src={formData.base64Image} className="w-24 h-24 object-contain" /> : <><Upload className="text-primary" /><p className="text-xs">Click to upload</p></>}
                            </div>
                          </div>
                        )}
                      </div>
                      <Button type="submit" className="w-full h-14 rounded-xl font-bold shadow-xl shadow-primary/20" disabled={isRunning}>
                        {isRunning ? <><RefreshCw className="mr-2 animate-spin" /> Running...</> : <><Zap className="mr-2" /> Execute Agent</>}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="p-10 rounded-3xl bg-slate-800/50 border border-white/5 space-y-6">
                        {output.imageUrl && <img src={output.imageUrl} className="w-full max-w-sm mx-auto rounded-2xl" />}
                        {output.videoUrl && <video src={output.videoUrl} className="w-full max-w-sm mx-auto rounded-2xl" controls autoPlay loop />}
                        {output.type === 'listing' && (
                          <div className="space-y-4">
                            <div className="p-4 bg-slate-900 rounded-xl">
                              <Label className="text-[10px] uppercase font-bold text-primary">Optimized Title</Label>
                              <p className="text-sm">{output.title}</p>
                            </div>
                            <div className="p-4 bg-slate-900 rounded-xl">
                              <Label className="text-[10px] uppercase font-bold text-primary">Key Bullets</Label>
                              <ul className="text-xs space-y-2 mt-2">{output.bulletPoints?.map((b: string, i: number) => <li key={i} className="flex gap-2"><Zap size={12} className="text-amber-500 shrink-0" /> {b}</li>)}</ul>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setOutput(null)}>Reset</Button>
                        <Button className="flex-1 h-12 rounded-xl" onClick={() => toast({ title: "Downloading..." })}>Download</Button>
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
    <Suspense fallback={null}>
      <AgentsContent />
    </Suspense>
  );
}