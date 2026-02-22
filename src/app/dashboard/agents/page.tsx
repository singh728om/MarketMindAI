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
  Copy,
  Download,
  Upload,
  Zap,
  CheckCircle2,
  Search,
  Globe,
  MapPin,
  Link as LinkIcon,
  Briefcase,
  Phone
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
import { Textarea } from "@/components/ui/textarea";
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
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and descriptions based on product details.", color: "text-blue-500" },
  { id: "ranking", title: "Ranking Keyword Finder", icon: Search, desc: "Discover high-intent keywords to boost your search visibility.", color: "text-amber-500" },
  { id: "leads", title: "Lead Generation Agent", icon: Globe, desc: "Extract potential B2B leads via location or direct website analysis.", color: "text-cyan-500" },
  { id: "photoshoot", title: "Photoshoot Agent", icon: Camera, desc: "Professional studio photoshoot with model selection and background control.", color: "text-purple-500" },
  { id: "video", title: "Video Ad Agent", icon: Video, desc: "Storyboard + text-to-video prompt generation.", color: "text-rose-500" },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500" },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "10 hooks + detailed creator briefs & scripts.", color: "text-orange-500" },
  { id: "report", title: "Client Report Narrator", icon: FileSearch, desc: "Weekly performance analysis into readable narrative.", color: "text-indigo-500" },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [modelType, setModelType] = useState<string>("none");
  const [isApiActive, setIsApiActive] = useState(false);
  
  // Controlled form state
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
    // Check if Staff configured API keys
    const keys = localStorage.getItem("marketmind_api_keys");
    if (keys) {
      const parsed = JSON.parse(keys);
      if (parsed.gemini) setIsApiActive(true);
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
          title: "Product Image Ready",
          description: `Successfully loaded ${file.name} for photoshoot analysis.`,
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
      description: "Your professional photoshoot image is being saved.",
    });
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    
    try {
      if (selectedAgent.id === 'photoshoot' && isApiActive && formData.base64Image) {
        // CALL REAL GENKIT FLOW
        const result = await generatePhotoshoot({
          photoDataUri: formData.base64Image,
          productType: formData.productName,
          shotAngle: formData.shotAngle,
          modelType: modelType,
          background: formData.background,
          style: "high-fashion commercial editorial, 8k, photorealistic, sharp focus"
        });

        setOutput({
          title: `Professional Photoshoot: ${formData.productName}`,
          prompt: result.description,
          imageUrl: result.generatedImageDataUri,
          type: 'creative'
        });
      } else {
        // MOCKED FALLBACK FOR DEMO OR OTHER AGENTS
        await new Promise(r => setTimeout(r, 2000));
        
        const { productName, category, color, location, websiteUrl, shotAngle } = formData;
        
        if (selectedAgent.id === 'listing') {
          setOutput({
            title: `Premium Handcrafted ${color || ""} ${productName} - ${category.toUpperCase()} Collection`,
            description: `Elevate your ${category} wardrobe with our Premium ${productName}. This ${color.toLowerCase() || "stunning"} masterpiece is designed for the modern connoisseur, blending traditional artistry with a sophisticated contemporary fit.`,
            bullets: [
              `Authentic ${color || "Premium"} Finish: Rich depth of color and quality craftsmanship.`,
              "Marketplace Optimized: Content crafted to boost ranking.",
              "Durable Performance: High-quality materials used to ensure longevity."
            ],
            type: 'listing'
          });
        } else if (selectedAgent.id === 'ranking') {
          setOutput({
            keywords: [`${productName.toLowerCase()} for men`, `best ${color.toLowerCase()} ${category.toLowerCase()}`, "premium ethnic wear"],
            type: 'ranking'
          });
        } else if (selectedAgent.id === 'leads') {
          setOutput({
            leads: [
              { name: "Rahul Mehta", email: "rahul@luxuryretail.in", mobile: "+91 98765 43210", role: "Store Owner", source: location || websiteUrl },
              { name: "Sneha Kapoor", email: "sneha.k@fashionhub.com", mobile: "+91 87654 32109", role: "Procurement Manager", source: location || websiteUrl },
            ],
            type: 'leads'
          });
        } else {
          const angleText = shotAngle === 'zoom' ? 'detailed zoom-in' : `${shotAngle} view`;
          setOutput({
            title: `AI Studio Result: ${productName}`,
            prompt: `A professional commercial shot showing the ${angleText} of a ${color || ""} ${productName} in a ${formData.background} setting.`,
            imageUrl: "https://picsum.photos/seed/agency/600/400",
            type: 'creative'
          });
        }
      }

      toast({
        title: isApiActive ? "Production Output Ready" : "Demo Execution Complete",
        description: "The AI node has finished generating your professional studio content.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        variant: "destructive",
        title: "AI Node Communication Failure",
        description: "The agent could not connect to the processing hub. Verify your API keys in the staff portal.",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard.",
    });
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
          <h1 className="text-3xl font-headline font-bold mb-1">AI Agents</h1>
          <p className="text-muted-foreground">Orchestrate specialized AI units to handle your marketplace tasks.</p>
        </div>
        {isApiActive && (
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            Authenticated AI Instance Active
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {AGENTS.map((agent) => (
          <Card key={agent.id} className="group hover:border-primary/50 transition-all rounded-2xl border-white/5 bg-card overflow-hidden cursor-pointer" onClick={() => setSelectedAgent(agent)}>
            <CardHeader>
              <div className={`w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 ${agent.color}`}>
                <agent.icon size={24} />
              </div>
              <CardTitle className="font-headline">{agent.title}</CardTitle>
              <CardDescription>{agent.desc}</CardDescription>
            </CardHeader>
            <CardFooter className="pt-0 justify-between">
              <span className="text-xs font-bold text-emerald-500 flex items-center">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-2" /> Ready
              </span>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                Open Agent <ChevronRight size={14} className="ml-1" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Agent Modal */}
      <Dialog open={!!selectedAgent} onOpenChange={(open) => !open && resetForm()}>
        <DialogContent className="max-w-4xl bg-card border-white/10 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col p-0">
          {selectedAgent && (
            <>
              <DialogHeader className="p-8 pb-0">
                <div className="flex items-center gap-4 mb-2">
                  <div className={`w-10 h-10 rounded-lg bg-muted flex items-center justify-center ${selectedAgent.color}`}>
                    <selectedAgent.icon size={20} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-headline">{selectedAgent.title}</DialogTitle>
                    <DialogDescription>{selectedAgent.desc}</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-8 pt-6">
                {!output ? (
                  <form onSubmit={handleRunAgent} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedAgent.id !== 'leads' ? (
                        <>
                          <div className="space-y-2">
                            <Label>Product Name</Label>
                            <Input 
                              placeholder="e.g. Silk Kurta" 
                              required 
                              value={formData.productName}
                              onChange={(e) => handleInputChange("productName", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label>Category</Label>
                            <Select onValueChange={(val) => handleInputChange("category", val)} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Fashion">Fashion</SelectItem>
                                <SelectItem value="Apparels">Apparels</SelectItem>
                                <SelectItem value="Ethnic">Ethnic</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {(selectedAgent.id === 'listing' || selectedAgent.id === 'ranking') && (
                            <div className="space-y-2">
                              <Label>Color / Specific Variety</Label>
                              <Input 
                                placeholder="e.g. Midnight Blue" 
                                required 
                                value={formData.color}
                                onChange={(e) => handleInputChange("color", e.target.value)}
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2"><Briefcase size={14} /> Business Category</Label>
                            <Select onValueChange={(val) => handleInputChange("category", val)} required>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Business Category" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Fashion">Fashion</SelectItem>
                                <SelectItem value="Apparels">Apparels</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <Label className="flex items-center gap-2"><MapPin size={14} /> Location</Label>
                            <Input 
                              placeholder="e.g. New Delhi, India" 
                              value={formData.location}
                              onChange={(e) => handleInputChange("location", e.target.value)}
                            />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="flex items-center gap-2"><LinkIcon size={14} /> Website URL (Optional)</Label>
                            <Input 
                              placeholder="e.g. https://competitor.com" 
                              value={formData.websiteUrl}
                              onChange={(e) => handleInputChange("websiteUrl", e.target.value)}
                            />
                          </div>
                        </>
                      )}
                    </div>

                    {(selectedAgent.id === 'listing' || selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video') && (
                      <div className="space-y-6 bg-secondary/20 p-6 rounded-2xl border border-white/5">
                        <Label className="text-sm font-bold uppercase tracking-widest text-primary">Media Assets</Label>
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
                            "border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-secondary/30 transition-colors cursor-pointer group overflow-hidden",
                            formData.base64Image ? "border-primary/50 bg-primary/5" : "border-white/10"
                          )}
                        >
                           {formData.base64Image ? (
                             <div className="relative group/img w-full max-w-[200px] aspect-square rounded-lg overflow-hidden border bg-white">
                               <img src={formData.base64Image} alt="Product Preview" className="w-full h-full object-contain" />
                               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                                 <span className="text-white text-xs font-bold uppercase">Change Photo</span>
                               </div>
                             </div>
                           ) : (
                             <>
                               <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                               <p className="text-sm font-medium">Upload raw product photo</p>
                               <Button type="button" variant="outline" size="sm">Select File</Button>
                             </>
                           )}
                        </div>
                        
                        {(selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label>Model Target</Label>
                              <Select onValueChange={(val) => setModelType(val)} defaultValue="none" required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select model style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mens">Mens</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="kids">Kids</SelectItem>
                                  <SelectItem value="none">No Model (Product Only)</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {selectedAgent.id === 'photoshoot' && (
                              <div className="space-y-2">
                                <Label>Shot Angle / View Type</Label>
                                <Select onValueChange={(val) => handleInputChange("shotAngle", val)} defaultValue="front" required>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select angle" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="front">Front View</SelectItem>
                                    <SelectItem value="back">Back View</SelectItem>
                                    <SelectItem value="zoom">Detailed Zoom</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            <div className="space-y-2 md:col-span-2">
                              <Label>Background Setting</Label>
                              <Select onValueChange={(val) => handleInputChange("background", val)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select environment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pro-studio">Professional High-Key Studio</SelectItem>
                                  <SelectItem value="casual-outdoor">Casual Lifestyle Outdoor</SelectItem>
                                  <SelectItem value="heritage">Heritage / Palace Interior</SelectItem>
                                  <SelectItem value="modern-minimalist">Modern Minimalist Interior</SelectItem>
                                  <SelectItem value="nature-garden">Nature / Lush Garden</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20" 
                      disabled={isRunning || (selectedAgent.id === 'photoshoot' && !formData.base64Image)}
                    >
                      {isRunning ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> AI Studio is generating...</>
                      ) : (
                        <><Zap className="mr-2 h-5 w-5" /> Generate Photoshoot</>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-8 rounded-2xl bg-secondary/30 border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Sparkles className="text-primary" size={20} />
                           <h4 className="font-bold font-headline text-xl text-primary">Production Output</h4>
                        </div>
                        <div className="flex gap-2">
                          {output.imageUrl ? (
                            <Button variant="outline" size="icon" className="rounded-xl" onClick={() => downloadImage(output.imageUrl, `marketmind-photoshoot-${Date.now()}.png`)}>
                              <Download size={16} className="text-primary" />
                            </Button>
                          ) : (
                            <Button variant="ghost" size="icon" onClick={() => copyToClipboard(JSON.stringify(output))}><Download size={16} /></Button>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 text-sm">
                        {output.imageUrl && (
                          <div className="space-y-2">
                            <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Generated Professional Asset</Label>
                            <div className="aspect-[4/3] w-full max-w-2xl mx-auto bg-muted rounded-2xl flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-2xl relative group">
                              <img src={output.imageUrl} alt="Result" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                <Button size="lg" className="rounded-xl bg-primary text-white shadow-xl" onClick={() => downloadImage(output.imageUrl, `photoshoot-${Date.now()}.png`)}>
                                  <Download size={20} className="mr-2" /> Download High-Res
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {output.title && (
                          <div className="space-y-2">
                            <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Studio Description</Label>
                            <div className="p-4 bg-background rounded-xl border font-bold text-foreground">{output.title}</div>
                          </div>
                        )}
                        
                        {output.prompt && (
                          <div className="space-y-2">
                            <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">Scene Context</Label>
                            <div className="p-4 bg-background rounded-xl border italic text-muted-foreground text-xs leading-relaxed">
                              "{output.prompt}"
                            </div>
                          </div>
                        )}

                        {output.bullets && (
                          <div className="space-y-2">
                            <Label className="text-muted-foreground uppercase tracking-widest text-[10px] font-bold">AI Intelligence Insights</Label>
                            <div className="p-4 bg-background rounded-xl border space-y-2">
                              {output.bullets.map((bullet: string, i: number) => (
                                <div key={i} className="flex gap-2 items-start">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                  <span className="text-foreground">{bullet}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {output.leads && (
                          <div className="border rounded-xl overflow-hidden bg-background">
                            <div className="grid grid-cols-4 gap-4 p-3 border-b bg-muted/50 text-[10px] font-bold uppercase tracking-wider">
                              <span>Name</span>
                              <span>Email</span>
                              <span>Mobile</span>
                              <span>Role</span>
                            </div>
                            <div className="divide-y">
                              {output.leads.map((lead: any, i: number) => (
                                <div key={i} className="grid grid-cols-4 gap-4 p-3 text-xs items-center hover:bg-primary/5 transition-colors group">
                                  <span className="font-bold">{lead.name}</span>
                                  <span className="text-muted-foreground truncate">{lead.email}</span>
                                  <span className="text-muted-foreground">{lead.mobile}</span>
                                  <span className="px-2 py-0.5 rounded bg-muted text-[10px] whitespace-nowrap inline-block text-center">{lead.role}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setOutput(null)}>Start New Session</Button>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-muted/30 border-t flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isApiActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                  {isApiActive ? 'Authenticated AI Studio active' : 'Internal Demo Node active'}
                </span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
