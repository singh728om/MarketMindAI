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
  MapPin,
  Link as LinkIcon,
  Briefcase
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
import { cn } from "@/lib/utils";

const AGENTS = [
  { id: "photoshoot", title: "AI Photoshoot Studio", icon: Camera, desc: "Professional studio reshoots with model and environment control.", color: "text-purple-500" },
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and descriptions.", color: "text-blue-500" },
  { id: "ranking", title: "Ranking Keyword Finder", icon: Search, desc: "Discover high-intent keywords to boost visibility.", color: "text-amber-500" },
  { id: "leads", title: "Lead Generation Agent", icon: Globe, desc: "Extract B2B leads via location or website analysis.", color: "text-cyan-500" },
  { id: "video", title: "Video Ad Agent", icon: Video, desc: "Storyboard + text-to-video prompt generation.", color: "text-rose-500" },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500" },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "Creative hooks + detailed scripts.", color: "text-orange-500" },
  { id: "report", title: "Client Report Narrator", icon: FileSearch, desc: "Weekly performance analysis into narrative.", color: "text-indigo-500" },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [modelType, setModelType] = useState<string>("none");
  const [isApiActive, setIsApiActive] = useState(false);
  
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    color: "",
    location: "",
    websiteUrl: "",
    shotAngle: "front",
    background: "pro-studio",
    base64Image: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const keys = localStorage.getItem("marketmind_api_keys");
    if (keys) {
      try {
        const parsed = JSON.parse(keys);
        if (parsed.gemini && parsed.gemini.trim() !== "") {
          setIsApiActive(true);
        }
      } catch (e) {
        console.error("Failed to check API keys", e);
      }
    }
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

  const downloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download Started",
      description: "Saving high-resolution production asset.",
    });
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    
    try {
      if (selectedAgent.id === 'photoshoot') {
        if (!isApiActive) {
          throw new Error("Photoshoot requires an active Gemini key in Staff Portal.");
        }

        const result = await generatePhotoshoot({
          photoDataUri: formData.base64Image || undefined,
          productType: formData.productName,
          shotAngle: formData.shotAngle,
          modelType: modelType,
          background: formData.background,
          style: "high-fashion commercial editorial, professional studio lighting, extremely detailed, 8k resolution"
        });

        setOutput({
          imageUrl: result.generatedImageDataUri,
          type: 'creative'
        });

        toast({
          title: "Production Ready",
          description: "AI Photoshoot completed successfully.",
        });
      } else {
        // MOCK AGENTS
        await new Promise(r => setTimeout(r, 2000));
        
        if (selectedAgent.id === 'listing') {
          setOutput({
            title: `Premium ${formData.productName}`,
            description: `Professional optimization for your ${formData.category} listing.`,
            bullets: ["High ROAS Keywords", "Conversion Optimized Copy", "Marketplace Compliant"],
            type: 'listing'
          });
        } else {
          setOutput({
            imageUrl: "https://picsum.photos/seed/reshoot/800/600",
            type: 'creative'
          });
        }
      }
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "AI Studio Error",
        description: err.message || "Failed to execute agent. Check your configuration.",
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
      color: "", 
      location: "", 
      websiteUrl: "", 
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
          <p className="text-muted-foreground text-sm md:text-base">Orchestrate specialized AI units to automate your marketplace operations.</p>
        </div>
        {isApiActive && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Authenticated Production Active
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
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden max-h-[95vh] flex flex-col p-0 text-white">
          {selectedAgent && (
            <>
              <DialogHeader className="p-6 md:p-8 pb-0 shrink-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-slate-800 flex items-center justify-center ${selectedAgent.color}`}>
                    <selectedAgent.icon size={24} />
                  </div>
                  <div>
                    <DialogTitle className="text-xl md:text-2xl font-headline font-bold text-white">{selectedAgent.title}</DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs md:text-sm">{selectedAgent.desc}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 pt-4">
                {!output ? (
                  <form onSubmit={handleRunAgent} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product Details</Label>
                        <Input 
                          placeholder="e.g. Premium Silk Kurta" 
                          required 
                          className="bg-slate-800 border-white/5 h-12 rounded-xl"
                          value={formData.productName}
                          onChange={(e) => handleInputChange("productName", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</Label>
                        <Select onValueChange={(val) => handleInputChange("category", val)} required>
                          <SelectTrigger className="bg-slate-800 border-white/5 h-12 rounded-xl">
                            <SelectValue placeholder="Select Segment" />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/10 text-white">
                            <SelectItem value="Fashion">Fashion</SelectItem>
                            <SelectItem value="Electronics">Electronics</SelectItem>
                            <SelectItem value="Home">Home & Decor</SelectItem>
                            <SelectItem value="Beauty">Beauty & Wellness</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    {selectedAgent.id === 'photoshoot' && (
                      <div className="space-y-6 bg-slate-800/30 p-6 md:p-8 rounded-2xl border border-white/5">
                        <div className="flex items-center justify-between mb-4">
                          <Label className="text-sm font-bold uppercase tracking-widest text-primary">Studio Controls</Label>
                          {formData.base64Image && <Badge className="bg-emerald-500/20 text-emerald-500">Image Loaded</Badge>}
                        </div>
                        
                        <input 
                          type="file" 
                          className="hidden" 
                          ref={fileInputRef} 
                          onChange={handleFileChange} 
                          accept="image/*"
                        />
                        
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className={cn(
                            "border-2 border-dashed rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center gap-4 hover:bg-slate-800 transition-all cursor-pointer group overflow-hidden",
                            formData.base64Image ? "border-primary/50 bg-primary/5" : "border-white/10"
                          )}
                        >
                           {formData.base64Image ? (
                             <div className="relative w-full max-w-[240px] aspect-square rounded-xl overflow-hidden border border-white/10 bg-white p-2 shadow-2xl">
                               <img src={formData.base64Image} alt="Input" className="w-full h-full object-contain" />
                               <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                 <span className="text-white text-xs font-bold uppercase flex items-center gap-2"><Upload size={14} /> Change Product</span>
                               </div>
                             </div>
                           ) : (
                             <>
                               <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Upload size={28} className="text-primary" />
                               </div>
                               <div className="text-center">
                                 <p className="text-base font-bold text-white">Upload Raw Product Photo</p>
                                 <p className="text-[10px] text-slate-500 uppercase tracking-tighter mt-1">Leave empty for purely text-to-image generation</p>
                               </div>
                               <Button type="button" variant="outline" size="sm" className="border-white/10 text-slate-400">Browse Files</Button>
                             </>
                           )}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Target</Label>
                            <Select onValueChange={(val) => setModelType(val)} defaultValue="none" required>
                              <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl">
                                <SelectValue placeholder="Model type" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-white/10 text-white">
                                <SelectItem value="male">Male Model</SelectItem>
                                <SelectItem value="female">Female Model</SelectItem>
                                <SelectItem value="kids">Kids Model</SelectItem>
                                <SelectItem value="none">Product Only (Ghost Mannequin)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div className="space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lens / Shot Angle</Label>
                            <Select onValueChange={(val) => handleInputChange("shotAngle", val)} defaultValue="front" required>
                              <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl">
                                <SelectValue placeholder="Select angle" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-white/10 text-white">
                                <SelectItem value="front">Standard Front View</SelectItem>
                                <SelectItem value="back">Back Detail View</SelectItem>
                                <SelectItem value="side">Profile / 45° View</SelectItem>
                                <SelectItem value="zoom">Macro / Texture Zoom</SelectItem>
                                <SelectItem value="flatlay">Flat Lay / Top-down</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Environment Setting</Label>
                            <Select onValueChange={(val) => handleInputChange("background", val)} required>
                              <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl">
                                <SelectValue placeholder="Select Backdrop" />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-800 border-white/10 text-white">
                                <SelectItem value="pro-studio">High-Key White Studio</SelectItem>
                                <SelectItem value="lifestyle-home">Cozy Modern Living Room</SelectItem>
                                <SelectItem value="heritage">Luxury Palace / Heritage Site</SelectItem>
                                <SelectItem value="minimalist">Industrial / Minimalist Concrete</SelectItem>
                                <SelectItem value="nature">Lush Tropical Garden</SelectItem>
                                <SelectItem value="urban">Sunset Rooftop Cityscape</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 transition-all active:scale-[0.98]" 
                      disabled={isRunning}
                    >
                      {isRunning ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> AI Photographer Developing...</>
                      ) : (
                        <><Zap className="mr-2 h-5 w-5" /> Start Production</>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="p-6 md:p-10 rounded-3xl bg-slate-800/50 border border-white/5 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shadow-inner">
                            <Sparkles size={20} />
                           </div>
                           <h4 className="font-bold font-headline text-xl text-white">Production Asset Ready</h4>
                        </div>
                        <Badge className="bg-emerald-500 text-white border-none px-3 py-1 font-bold">8K Ultra-HD</Badge>
                      </div>
                      
                      <div className="flex flex-col items-center gap-8">
                        {output.imageUrl && (
                          <div className="w-full max-w-2xl mx-auto aspect-[4/3] md:aspect-square bg-slate-900 rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl relative group ring-1 ring-primary/20">
                            <img src={output.imageUrl} alt="AI Result" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-all duration-300 gap-4">
                              <Button 
                                size="lg" 
                                className="rounded-2xl bg-white text-black hover:bg-slate-200 font-bold px-10 shadow-2xl h-14 text-lg" 
                                onClick={() => downloadImage(output.imageUrl, `shoot-${Date.now()}.png`)}
                              >
                                <Download size={22} className="mr-2" /> Download Original
                              </Button>
                              <p className="text-[10px] text-white/60 uppercase tracking-[0.2em] font-bold">Unsplash / Amazon Ready</p>
                            </div>
                          </div>
                        )}

                        {output.type === 'listing' && (
                          <div className="w-full space-y-6">
                            <div className="p-6 bg-slate-900 rounded-2xl border border-white/5 space-y-2">
                              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Optimized Title</p>
                              <p className="text-lg font-bold text-white">{output.title}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-3">
                              {output.bullets.map((bullet: string, i: number) => (
                                <div key={i} className="flex gap-3 items-start p-4 bg-slate-900 rounded-xl border border-white/5">
                                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                                  <span className="text-slate-200 text-sm leading-relaxed">{bullet}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button variant="outline" className="flex-1 h-14 rounded-2xl font-bold border-white/10 hover:bg-slate-800 text-slate-300" onClick={() => setOutput(null)}>
                        New Session
                      </Button>
                      <Button 
                        className="flex-1 h-14 rounded-2xl font-bold bg-primary hover:bg-primary/90 shadow-xl shadow-primary/20"
                        onClick={() => downloadImage(output.imageUrl, `final-${Date.now()}.png`)}
                      >
                        <Download size={20} className="mr-2" /> Save to Brand Drive
                      </Button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-slate-950/50 border-t border-white/5 flex items-center justify-center gap-2 shrink-0">
                <div className={`w-2 h-2 rounded-full ${isApiActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`} />
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
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
