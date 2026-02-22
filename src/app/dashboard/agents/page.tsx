
"use client";

import { useState, useRef } from "react";
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

const AGENTS = [
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and descriptions based on product details.", color: "text-blue-500" },
  { id: "ranking", title: "Ranking Keyword Finder", icon: Search, desc: "Discover high-intent keywords to boost your search visibility.", color: "text-amber-500" },
  { id: "leads", title: "Lead Generation Agent", icon: Globe, desc: "Extract potential B2B leads via location or direct website analysis.", color: "text-cyan-500" },
  { id: "photoshoot", title: "Photoshoot Agent", icon: Camera, desc: "Prompt builder + style presets for high-end photography.", color: "text-purple-500" },
  { id: "video", title: "Video Ad Agent", icon: Video, desc: "Storyboard + text-to-video prompt generation.", color: "text-rose-500" },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500" },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "10 hooks + detailed creator briefs & scripts.", color: "text-orange-500" },
  { id: "report", title: "Client Report Narrator", icon: FileSearch, desc: "Weekly performance analysis into readable narrative.", color: "text-indigo-500" },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [modelType, setModelType] = useState<string>("");
  
  // Controlled form state
  const [formData, setFormData] = useState({
    productName: "",
    category: "",
    color: "",
    location: "",
    websiteUrl: "",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File Ready",
        description: `Successfully prepared ${file.name} for AI analysis.`,
      });
    }
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    
    const { productName, category, color, location, websiteUrl } = formData;
    
    // Mocked results based on agent type
    if (selectedAgent.id === 'listing') {
      setOutput({
        title: `Premium Handcrafted ${color || ""} ${productName} - ${category.toUpperCase()} Collection`,
        description: `Elevate your ${category} wardrobe with our Premium ${productName}. This ${color.toLowerCase() || "stunning"} masterpiece is designed for the modern connoisseur, blending traditional artistry with a sophisticated contemporary fit. Perfect for weddings, festivals, and formal gatherings. Crafted to ensure durability and lasting style.`,
        bullets: [
          `Authentic ${color || "Premium"} Finish: Experience the rich depth of color and quality craftsmanship.`,
          `Exquisite ${category} Design: Tailored for a sharp, streamlined silhouette that offers comfort.`,
          "Marketplace Optimized: Content crafted to highlight unique selling points and boost ranking.",
          "Durable Performance: High-quality materials used to ensure longevity and comfort.",
          `Versatile Styling: Pairs perfectly with multiple items in your ${category} collection.`
        ],
        type: 'listing'
      });
    } else if (selectedAgent.id === 'ranking') {
      setOutput({
        keywords: [
          `${productName.toLowerCase()} for men`,
          `best ${color.toLowerCase()} ${category.toLowerCase()}`,
          "premium ethnic wear",
          "handcrafted luxury apparel",
          "amazon best seller fashion",
          "traditional outfit for festivals",
          "designer clothing india"
        ],
        type: 'ranking'
      });
    } else if (selectedAgent.id === 'leads') {
      setOutput({
        leads: [
          { name: "Rahul Mehta", email: "rahul@luxuryretail.in", mobile: "+91 98765 43210", role: "Store Owner", source: location || websiteUrl },
          { name: "Sneha Kapoor", email: "sneha.k@fashionhub.com", mobile: "+91 87654 32109", role: "Procurement Manager", source: location || websiteUrl },
          { name: "Vikram Singh", email: "v.singh@ethenicroots.co", mobile: "+91 76543 21098", role: "Chief Merchandiser", source: location || websiteUrl },
          { name: "Anjali Das", email: "adas@boutiquefinds.net", mobile: "+91 65432 10987", role: "Founder", source: location || websiteUrl },
        ],
        type: 'leads'
      });
    } else {
      setOutput({
        title: `Optimized ${color || "Premium"} ${productName}`,
        bullets: [`High-Quality ${category} Materials`, "Ergonomic Design", "Professional Craftsmanship"],
        description: `A comprehensive ${category} description generated by our expert AI agent for your ${color || ""} ${productName} to maximize conversion.`,
        prompt: `A high-fashion editorial shot of a ${color || ""} ${productName} on a minimalist marble pedestal, soft natural light, 8k, photorealistic.`,
        videoUrl: "https://picsum.photos/seed/video/600/400",
        type: 'creative'
      });
    }
    
    setIsRunning(false);
    toast({
      title: "Agent Execution Complete",
      description: "The AI has finished generating your content.",
    });
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
    setModelType("");
    setFormData({ productName: "", category: "", color: "", location: "", websiteUrl: "" });
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-1">AI Agents</h1>
        <p className="text-muted-foreground">Orchestrate specialized AI units to handle your marketplace tasks.</p>
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
                          multiple
                        />
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-white/10 rounded-xl p-8 flex flex-col items-center justify-center gap-4 hover:bg-secondary/30 transition-colors cursor-pointer group"
                        >
                           <Upload size={24} className="text-muted-foreground group-hover:text-primary transition-colors" />
                           <p className="text-sm font-medium">Upload product photos</p>
                           <Button type="button" variant="outline" size="sm">Select Files</Button>
                        </div>
                        
                        {(selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video') && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            <div className="space-y-2">
                              <Label>Model Type</Label>
                              <Select onValueChange={(val) => setModelType(val)} required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select model style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="mens">Mens</SelectItem>
                                  <SelectItem value="female">Female</SelectItem>
                                  <SelectItem value="kids">Kids</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            {modelType === 'kids' && (
                              <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                                <Label>Age (Years)</Label>
                                <Input type="number" placeholder="Enter age" min="0" max="18" required />
                              </div>
                            )}

                            <div className="space-y-2">
                              <Label>Background Setting</Label>
                              <Select required>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select environment" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pro-studio">Professional Studio</SelectItem>
                                  <SelectItem value="casual-outdoor">Casual Outdoor</SelectItem>
                                  <SelectItem value="heritage">Heritage Palace</SelectItem>
                                  <SelectItem value="modern-minimalist">Modern Minimalist</SelectItem>
                                  <SelectItem value="nature-garden">Nature/Garden</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {selectedAgent.id !== 'listing' && selectedAgent.id !== 'ranking' && selectedAgent.id !== 'leads' && (
                      <div className="space-y-2">
                        <Label>Key Features or Brand Guidelines</Label>
                        <Textarea placeholder="List main selling points, brand tone, or specific requirements..." className="min-h-[100px]" />
                      </div>
                    )}

                    <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20" disabled={isRunning}>
                      {isRunning ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Agent is processing...</>
                      ) : (
                        <><Zap className="mr-2 h-5 w-5" /> Execute Agent</>
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-8 rounded-2xl bg-secondary/30 border border-white/5 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <Sparkles className="text-primary" size={20} />
                           <h4 className="font-bold font-headline text-xl text-primary">Intelligence Output</h4>
                        </div>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(JSON.stringify(output))}><Download size={16} /></Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 gap-6 text-sm">
                        {output.title && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-muted-foreground">Generated Title</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors" 
                                onClick={() => copyToClipboard(output.title)}
                              >
                                <Copy size={12} className="mr-1" /> Copy Title
                              </Button>
                            </div>
                            <div className="p-4 bg-background rounded-xl border font-bold text-foreground">{output.title}</div>
                          </div>
                        )}
                        
                        {output.bullets && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-muted-foreground">Key Features (Bullet Points)</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors" 
                                onClick={() => copyToClipboard(output.bullets.join("\n"))}
                              >
                                <Copy size={12} className="mr-1" /> Copy All Bullets
                              </Button>
                            </div>
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

                        {output.keywords && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-muted-foreground">High-Ranking Keywords</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors" 
                                onClick={() => copyToClipboard(output.keywords.join(", "))}
                              >
                                <Copy size={12} className="mr-1" /> Copy All Keywords
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {output.keywords.map((kw: string, i: number) => (
                                <div key={i} className="px-3 py-1.5 bg-background rounded-full border text-xs font-medium flex items-center gap-2 group">
                                  {kw}
                                  <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity"
                                    onClick={() => copyToClipboard(kw)}
                                  >
                                    <Copy size={10} />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {output.leads && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-muted-foreground">Generated Leads</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors" 
                                onClick={() => copyToClipboard(JSON.stringify(output.leads, null, 2))}
                              >
                                <Copy size={12} className="mr-1" /> Copy Lead List
                              </Button>
                            </div>
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
                                    <div className="flex items-center justify-between">
                                      <span className="px-2 py-0.5 rounded bg-muted text-[10px] whitespace-nowrap">{lead.role}</span>
                                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => copyToClipboard(`${lead.email} | ${lead.mobile}`)}>
                                        <Copy size={10} />
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                        
                        {output.type === 'creative' && (
                          <div className="space-y-2">
                            <Label className="text-muted-foreground">Generated Prompt / Preview</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-background rounded-xl border italic text-muted-foreground text-xs leading-relaxed relative group">
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                  onClick={() => copyToClipboard(output.prompt)}
                                >
                                  <Copy size={10} />
                                </Button>
                                "{output.prompt}"
                              </div>
                              <div className="aspect-video bg-muted rounded-xl flex items-center justify-center overflow-hidden border">
                                <img src={output.videoUrl} alt="Preview" className="w-full h-full object-cover" />
                              </div>
                            </div>
                          </div>
                        )}

                        {output.description && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Label className="text-muted-foreground">Detailed Description</Label>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary transition-colors" 
                                onClick={() => copyToClipboard(output.description)}
                              >
                                <Copy size={12} className="mr-1" /> Copy Description
                              </Button>
                            </div>
                            <div className="p-4 bg-background rounded-xl border text-foreground leading-relaxed whitespace-pre-wrap">
                              {output.description}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full h-12 rounded-xl" onClick={() => setOutput(null)}>Start New Task</Button>
                  </div>
                )}
              </div>
              
              <div className="p-3 bg-muted/30 border-t flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Authenticated AI Instance active</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
