
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
  X,
  Layout,
  Save,
  Eye
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
import { findRankingKeywords } from "@/ai/flows/find-ranking-keywords";
import { generateB2BLeads } from "@/ai/flows/generate-b2b-leads";
import { generateWebsite } from "@/ai/flows/generate-website-flow";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { doc, collection, setDoc } from "firebase/firestore";
import { useFirestore, useUser } from "@/firebase";

const AGENTS = [
  { id: "photoshoot", title: "AI Photoshoot Studio", icon: Camera, desc: "Professional studio reshoots with model and environment control.", color: "text-purple-500" },
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and descriptions.", color: "text-blue-500" },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500" },
  { id: "video", title: "Video Ad Agent", icon: Video, desc: "Storyboard + text-to-video prompt generation.", color: "text-rose-500" },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "Creative hooks + detailed scripts.", color: "text-orange-500" },
  { id: "report", title: "Client Report Narrator", icon: FileSearch, desc: "Weekly performance analysis into narrative.", color: "text-indigo-500" },
  { id: "ranking", title: "Ranking Keyword Finder", icon: Search, desc: "Discover high-intent keywords to boost visibility.", color: "text-amber-500" },
  { id: "leads", title: "Lead Generation Agent", icon: Globe, desc: "Extract B2B leads via location or website analysis.", color: "text-cyan-500" },
  { id: "webbuilder", title: "AI Website Builder", icon: Layout, desc: "Generate a fully responsive, optimized brand landing page.", color: "text-indigo-400" },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [isSavingWeb, setIsSavingWeb] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const [modelType, setModelType] = useState<string>("none");
  const [isApiActive, setIsApiActive] = useState(false);
  const [activeKey, setActiveKey] = useState<string>("");
  
  const [formData, setFormData] = useState({
    productName: "",
    category: "Fashion",
    productDescription: "",
    marketplace: "Amazon",
    targetAudience: "DTC Shoppers",
    keyFeatures: "Premium Quality, Handcrafted",
    shotAngle: "front",
    background: "professional-studio",
    kidAge: "5",
    kidGender: "boy",
    base64Image: null as string | null,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const db = useFirestore();
  const { user } = useUser();

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

  const handleSaveWebsite = async () => {
    if (!output?.html || !user || !db) return;
    setIsSavingWeb(true);
    try {
      const websiteId = `web-${Date.now()}`;
      const webRef = doc(db, "websites", websiteId);
      await setDoc(webRef, {
        id: websiteId,
        userProfileId: user.uid,
        brandName: formData.productName || "Untitled Brand",
        htmlContent: output.html,
        createdAt: new Date().toISOString()
      });
      toast({ title: "Website Saved", description: "You can find this in your Brand Profile assets." });
    } catch (err) {
      toast({ variant: "destructive", title: "Save Failed", description: "Failed to connect to Firestudio." });
    } finally {
      setIsSavingWeb(false);
    }
  };

  const handleDownload = () => {
    if (!output) return;

    try {
      if (output.imageUrl) {
        const link = document.createElement("a");
        link.href = output.imageUrl;
        link.download = `marketmind-photoshoot-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else if (output.type === 'catalog' && output.templateContent) {
        const blob = new Blob([output.templateContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `marketmind-catalog-${Date.now()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else if (output.type === 'webbuilder' && output.html) {
        const blob = new Blob([output.html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `marketmind-website-${Date.now()}.html`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
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
      }

      toast({
        title: "Download Started",
        description: "Your assets are being saved to your device.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Download Failed",
        description: "An error occurred while preparing your download.",
      });
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
            niche: formData.productName + " " + formData.category,
            location: "India",
            apiKey: activeKey
          });
          setOutput({ ...result, type: 'leads' });
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
      category: "Fashion", 
      productDescription: "",
      marketplace: "Amazon",
      targetAudience: "DTC Shoppers",
      keyFeatures: "Premium Quality, Handcrafted",
      shotAngle: "front",
      background: "professional-studio",
      kidAge: "5",
      kidGender: "boy",
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
                <div className="p-5 md:p-8 pt-4 pb-20">
                  {!output ? (
                    <form onSubmit={handleRunAgent} className="space-y-6 md:space-y-8">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
                        <div className="space-y-2">
                          <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Category / Niche</Label>
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
                        
                        {selectedAgent.id === 'photoshoot' && (
                          <div className="md:col-span-2 space-y-6">
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Production Environment (Background)</Label>
                              <Select value={formData.background} onValueChange={(val) => handleInputChange("background", val)} required>
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-slate-800 border-white/10 text-white">
                                  <SelectItem value="professional-studio">Professional Studio</SelectItem>
                                  <SelectItem value="outdoor-nature">Outdoor Nature</SelectItem>
                                  <SelectItem value="casual-home">Casual Home</SelectItem>
                                  <SelectItem value="sport-gym">Sport / Gym</SelectItem>
                                  <SelectItem value="heritage-palace">Heritage Palace</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Selection</Label>
                                <Select onValueChange={(val) => setModelType(val)} value={modelType}>
                                  <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl text-white text-sm"><SelectValue /></SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                                    <SelectItem value="mens">Mens Model</SelectItem>
                                    <SelectItem value="womens">Womens Model</SelectItem>
                                    <SelectItem value="kids">Kids Model</SelectItem>
                                    <SelectItem value="none">Product Only (No Model)</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              {modelType === 'kids' && (
                                <>
                                  <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Gender</Label>
                                    <Select onValueChange={(val) => handleInputChange("kidGender", val)} value={formData.kidGender}>
                                      <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl text-white text-sm"><SelectValue /></SelectTrigger>
                                      <SelectContent className="bg-slate-800 border-white/10 text-white">
                                        <SelectItem value="boy">Baby Boy</SelectItem>
                                        <SelectItem value="girl">Baby Girl</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="space-y-2 animate-in fade-in slide-in-from-left-2">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Model Age</Label>
                                    <Select onValueChange={(val) => handleInputChange("kidAge", val)} value={formData.kidAge}>
                                      <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl text-white text-sm"><SelectValue /></SelectTrigger>
                                      <SelectContent className="bg-slate-800 border-white/10 text-white">
                                        {Array.from({ length: 12 }, (_, i) => i + 1).map(age => (
                                          <SelectItem key={age} value={age.toString()}>{age} Year Old</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </>
                              )}

                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Lens / Shot Angle</Label>
                                <Select onValueChange={(val) => handleInputChange("shotAngle", val)} value={formData.shotAngle}>
                                  <SelectTrigger className="bg-slate-800 border-white/5 h-11 rounded-xl text-white text-sm"><SelectValue /></SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                                    <SelectItem value="front">Eye Level (Front View)</SelectItem>
                                    <SelectItem value="back">Back View</SelectItem>
                                    <SelectItem value="left-side">Left Side View</SelectItem>
                                    <SelectItem value="right-side">Right Side View</SelectItem>
                                    <SelectItem value="zoom">Macro / Detailed Close-up</SelectItem>
                                    <SelectItem value="wide">Wide Angle Context</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

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
                                  <><Upload size={24} className="text-primary" /><p className="text-xs md:text-sm font-bold">Upload Product Photo</p></>
                                )}
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedAgent.id !== 'photoshoot' && (
                          <div className="md:col-span-2 space-y-2">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                              {selectedAgent.id === 'webbuilder' ? 'Specific Website Requirements' : 'Description / Context'}
                            </Label>
                            <Input 
                              placeholder={selectedAgent.id === 'webbuilder' ? "Include testimonials, a pricing table, and blue/gold theme..." : "Brief details about the product or campaign..."}
                              className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm"
                              value={formData.productDescription}
                              onChange={(e) => handleInputChange("productDescription", e.target.value)}
                            />
                          </div>
                        )}
                      </div>

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
                          <h4 className="font-bold font-headline text-lg md:text-xl text-white">Output Generated</h4>
                          <Badge className="bg-emerald-500 text-[10px]">Production Ready</Badge>
                        </div>
                        
                        {output.imageUrl && (
                          <div className="w-full max-w-lg mx-auto aspect-square rounded-2xl md:rounded-[2rem] overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-900">
                            <img src={output.imageUrl} alt="AI Result" className="w-full h-full object-cover" />
                          </div>
                        )}

                        {output.type === 'webbuilder' && (
                          <div className="space-y-6">
                            <div className="w-full aspect-video rounded-2xl overflow-hidden border border-white/10 bg-white">
                              <iframe 
                                srcDoc={output.html} 
                                title="Website Preview" 
                                className="w-full h-full"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold uppercase text-indigo-400">AI Recommendations</Label>
                              <div className="grid grid-cols-1 gap-2">
                                {output.recommendations.map((r: string, i: number) => (
                                  <div key={i} className="flex gap-3 p-3 bg-slate-900 rounded-xl text-xs border border-white/5">
                                    <Sparkles className="text-indigo-400 size-4 shrink-0" /> {r}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {output.type === 'listing' && (
                          <div className="space-y-4 md:space-y-6">
                            <div className="p-4 bg-slate-900 rounded-xl space-y-2 border border-white/5">
                              <Label className="text-[10px] font-bold uppercase text-slate-500">Optimized Title</Label>
                              <p className="font-bold text-sm md:text-base leading-snug text-white">{output.title}</p>
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
                                  <p className="text-xs md:text-sm font-medium leading-relaxed text-white">{s.description}</p>
                                  <p className="text-[10px] text-slate-500 mt-2 italic">{s.visualElements}</p>
                                </div>
                              ))}
                            </div>
                            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                              <Label className="text-[10px] font-bold uppercase text-rose-400">Generation Prompt</Label>
                              <p className="text-[10px] md:text-xs italic mt-1 leading-relaxed text-slate-300">{output.videoGenerationPrompt}</p>
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
                                    <span className="font-bold text-xs md:text-sm truncate text-white">{k.term}</span>
                                  </div>
                                  <div className="flex gap-3 md:gap-4 shrink-0">
                                    <div className="text-right">
                                      <p className="text-[8px] uppercase text-slate-500 font-bold">Vol</p>
                                      <p className="text-[10px] md:text-xs font-mono text-slate-300">{k.volume}</p>
                                    </div>
                                    <div className="text-right hidden sm:block">
                                      <p className="text-[8px] uppercase text-slate-500 font-bold">Diff</p>
                                      <Badge variant="outline" className="text-[8px] h-4 py-0 border-white/10 text-slate-400">{k.difficulty}</Badge>
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
                        <Button variant="outline" className="flex-1 h-11 md:h-12 rounded-xl border-white/10 text-white" onClick={() => setOutput(null)}>New Session</Button>
                        
                        {output.type === 'webbuilder' && (
                          <Button 
                            className="flex-1 h-11 md:h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 shadow-lg font-bold text-white"
                            onClick={handleSaveWebsite}
                            disabled={isSavingWeb}
                          >
                            {isSavingWeb ? <Loader2 className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />} 
                            Save to Firestudio
                          </Button>
                        )}

                        <Button 
                          className="flex-1 h-11 md:h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold text-white"
                          onClick={handleDownload}
                        >
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
