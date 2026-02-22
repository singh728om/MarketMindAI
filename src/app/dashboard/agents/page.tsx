
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
  FileUp,
  HardDrive,
  Download,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ChevronDown
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
import { Textarea } from "@/components/ui/textarea";
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
  const [isVaulting, setIsVaulting] = useState(false);
  const [output, setOutput] = useState<any>(null);
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

  const handleSaveToVault = () => {
    if (!output) return;
    setIsVaulting(true);
    
    setTimeout(() => {
      // Logic to actually save to persistent localStorage used by StoragePage
      const savedFilesStr = localStorage.getItem("marketmind_vault_files");
      let savedFiles = savedFilesStr ? JSON.parse(savedFilesStr) : [];
      
      let fileType = "DATA";
      let fileName = `ai_${selectedAgent.id}_${Date.now()}`;

      if (output.imageUrl) { fileType = "PNG"; fileName += ".png"; }
      else if (output.videoUrl) { fileType = "MP4"; fileName += ".mp4"; }
      else if (output.type === 'listing') { fileType = "PDF"; fileName += ".pdf"; }
      else if (output.type === 'ceo') { fileType = "CSV"; fileName += ".csv"; }

      const newFile = {
        id: Date.now(),
        name: fileName,
        type: fileType,
        size: "1.2 MB", // Mock size
        date: "Just now",
        status: "Stored"
      };

      savedFiles = [newFile, ...savedFiles];
      localStorage.setItem("marketmind_vault_files", JSON.stringify(savedFiles));
      
      setIsVaulting(false);
      toast({
        title: "Secured in Brand Vault",
        description: `${fileName} has been encrypted and archived.`,
      });
    }, 1500);
  };

  const handleDownload = () => {
    if (!output) return;
    
    let downloadUrl = "";
    let fileName = `marketmind-${selectedAgent.id}-${Date.now()}`;

    if (output.imageUrl || output.generatedImageDataUri) {
      downloadUrl = output.imageUrl || output.generatedImageDataUri;
      fileName += ".png";
    } else if (output.videoUrl || output.videoDataUri) {
      downloadUrl = output.videoUrl || output.videoDataUri;
      fileName += ".mp4";
    } else {
      const text = JSON.stringify(output, null, 2);
      const blob = new Blob([text], { type: 'text/plain' });
      downloadUrl = URL.createObjectURL(blob);
      fileName += ".txt";
    }

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({ title: "Download Started", description: `Exporting ${fileName}` });
  };

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isApiActive) {
      toast({ variant: "destructive", title: "AI Studio Error", description: "AI Agent node is offline. Please check system config." });
      return;
    }

    setIsRunning(true);
    
    try {
      let result: any;

      switch (selectedAgent.id) {
        case 'ceo':
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
            modelType: formData.modelType,
            kidAge: formData.modelType === 'kids' ? formData.kidAge : undefined,
            background: formData.background,
            style: "high-fashion commercial editorial, realistic lighting, extremely detailed, 8k",
            apiKey: activeKey
          });
          setOutput({ imageUrl: result.generatedImageDataUri, type: 'creative' });
          break;

        case 'video':
          result = await generateVideoAdContent({
            productName: formData.productName,
            productCategory: formData.category,
            background: formData.background,
            marketingText: formData.productDescription,
            photoDataUri: formData.base64Image!,
            apiKey: activeKey
          });
          setOutput({ videoUrl: result.videoDataUri, type: 'video' });
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
          throw new Error("Agent functionality coming soon.");
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
    setFormData({ 
      productName: "", 
      category: "Fashion", 
      color: "",
      productDescription: "",
      marketplace: "Amazon",
      targetAudience: "DTC Shoppers",
      keyFeatures: "Premium Quality, Handcrafted",
      shotAngle: "front",
      background: "studio",
      modelType: "none",
      kidAge: "5",
      base64Image: null,
      location: "",
      country: "India",
      websiteUrl: ""
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied to Clipboard" });
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
              <DialogHeader className="p-5 md:p-8 pb-4 shrink-0 border-b border-white/5">
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
                        {/* Generic Fields */}
                        {selectedAgent.id !== 'photoshoot' && selectedAgent.id !== 'video' && (
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
                        )}

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
                              <Select value={formData.category} onValueChange={(val) => handleInputChange("category", val)} required>
                                <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                  <SelectValue />
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

                            {(selectedAgent.id === 'listing' || selectedAgent.id === 'ranking') && (
                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Product Color</Label>
                                <Input 
                                  placeholder="e.g. Maroon" 
                                  className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm"
                                  value={formData.color}
                                  onChange={(e) => handleInputChange("color", e.target.value)}
                                />
                              </div>
                            )}

                            {selectedAgent.id === 'photoshoot' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Select Model</Label>
                                  <Select value={formData.modelType} onValueChange={(val) => handleInputChange("modelType", val)}>
                                    <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-white/10 text-white">
                                      <SelectItem value="none">No Model (Product Only)</SelectItem>
                                      <SelectItem value="mens">Mens Model</SelectItem>
                                      <SelectItem value="womens">Womens Model</SelectItem>
                                      <SelectItem value="kids">Kids Model</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                {formData.modelType === 'kids' && (
                                  <div className="space-y-2">
                                    <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Child Age (1-12 yrs)</Label>
                                    <Select value={formData.kidAge} onValueChange={(val) => handleInputChange("kidAge", val)}>
                                      <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent className="bg-slate-800 border-white/10 text-white">
                                        {[...Array(12)].map((_, i) => (
                                          <SelectItem key={i+1} value={(i+1).toString()}>{i+1} Years Old</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                )}

                                <div className="space-y-2">
                                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Shot Angle</Label>
                                  <Select value={formData.shotAngle} onValueChange={(val) => handleInputChange("shotAngle", val)}>
                                    <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-white/10 text-white">
                                      <SelectItem value="front">Front View</SelectItem>
                                      <SelectItem value="back">Back View</SelectItem>
                                      <SelectItem value="right-side">Right Side View</SelectItem>
                                      <SelectItem value="left-side">Left Side View</SelectItem>
                                      <SelectItem value="close">Close-up View</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}

                            {(selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video') && (
                              <div className="space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Background Setting</Label>
                                <Select value={formData.background} onValueChange={(val) => handleInputChange("background", val)}>
                                  <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-white/10 text-white">
                                    <SelectItem value="studio">Professional Studio Shoot</SelectItem>
                                    <SelectItem value="outdoor">Outdoor Lifestyle</SelectItem>
                                    <SelectItem value="sport">Dynamic Sport Environment</SelectItem>
                                    <SelectItem value="nature">Natural Setting</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            )}

                            {selectedAgent.id === 'video' && (
                              <div className="md:col-span-2 space-y-2">
                                <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Marketing Copy / Additional Instructions</Label>
                                <Textarea 
                                  placeholder="e.g. Cinematic close-ups, high energy feel, focusing on premium embroidery details..."
                                  className="bg-slate-800 border-white/5 min-h-[100px] text-white rounded-xl focus:ring-primary"
                                  value={formData.productDescription}
                                  onChange={(e) => handleInputChange("productDescription", e.target.value)}
                                />
                              </div>
                            )}

                            {selectedAgent.id === 'leads' && (
                              <>
                                <div className="space-y-2">
                                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Indian Cities</Label>
                                  <Input 
                                    placeholder="e.g. Mumbai, Delhi, Bangalore" 
                                    className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm"
                                    value={formData.location}
                                    onChange={(e) => handleInputChange("location", e.target.value)}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Target Country</Label>
                                  <Select value={formData.country} onValueChange={(val) => handleInputChange("country", val)}>
                                    <SelectTrigger className="bg-slate-800 border-white/5 h-11 md:h-12 rounded-xl text-white text-sm">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-slate-800 border-white/10 text-white">
                                      <SelectItem value="India">India</SelectItem>
                                      <SelectItem value="USA">USA</SelectItem>
                                      <SelectItem value="UAE">UAE</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {(selectedAgent.id === 'photoshoot' || selectedAgent.id === 'video' || selectedAgent.id === 'listing') && (
                          <div className="md:col-span-2 space-y-4">
                            <Label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Upload Product Photo</Label>
                            <div 
                              onClick={() => fileInputRef.current?.click()}
                              className={cn(
                                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all",
                                formData.base64Image ? "border-primary/50 bg-primary/5" : "border-white/10 bg-slate-800/30"
                              )}
                            >
                              <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} accept="image/*" />
                              {formData.base64Image ? (
                                <img src={formData.base64Image} alt="Input" className="w-32 aspect-square object-contain rounded-xl" />
                              ) : (
                                <><Upload size={24} className="text-primary" /><p className="text-xs font-bold">Click to upload raw asset</p></>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full h-12 md:h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20" 
                        disabled={isRunning}
                      >
                        {isRunning ? <><RefreshCw className="mr-2 h-5 w-5 animate-spin" /> Orchestrating AI...</> : <><Zap className="mr-2 h-5 w-5" /> Start Production</>}
                      </Button>
                    </form>
                  ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
                      <div className="p-6 md:p-10 rounded-3xl bg-slate-800/50 border border-white/5 space-y-6">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold font-headline text-xl">Output Generated</h4>
                          <Badge className="bg-emerald-500 text-[10px]">Production Ready</Badge>
                        </div>
                        
                        {output.imageUrl && (
                          <div className="w-full max-w-lg mx-auto aspect-square rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-900">
                            <img src={output.imageUrl} alt="AI Result" className="w-full h-full object-cover" />
                          </div>
                        )}

                        {output.videoUrl && (
                          <div className="w-full max-w-lg mx-auto aspect-[9/16] rounded-3xl overflow-hidden border-4 border-white/5 shadow-2xl bg-slate-900">
                            <video src={output.videoUrl} className="w-full h-full object-cover" autoPlay loop muted controls />
                          </div>
                        )}

                        {output.type === 'ranking' && (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {output.keywords.map((k: any, i: number) => (
                              <div key={i} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between group">
                                <div className="space-y-1">
                                  <p className="text-sm font-bold text-white">{k.term}</p>
                                  <p className="text-[10px] text-slate-500 uppercase">{k.volume} Vol • {k.difficulty} Comp</p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleCopy(k.term)}>
                                  <Copy size={14} />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}

                        {output.type === 'listing' && (
                          <div className="space-y-6">
                            <div className="p-4 rounded-xl bg-slate-900 border border-white/5 space-y-2">
                              <div className="flex justify-between items-center"><Label className="text-[10px] font-bold text-primary uppercase">Optimized Title</Label><Button size="sm" variant="ghost" onClick={() => handleCopy(output.title)}><Copy size={12} /></Button></div>
                              <p className="text-sm font-medium">{output.title}</p>
                            </div>
                            <div className="space-y-2">
                              <Label className="text-[10px] font-bold text-primary uppercase">High-Conversion Bullets</Label>
                              <div className="space-y-2">
                                {output.bulletPoints.map((b: string, i: number) => (
                                  <div key={i} className="p-3 bg-slate-900 rounded-lg text-xs flex gap-3"><Zap className="size-3 text-amber-500 shrink-0" /> {b}</div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}

                        {output.type === 'leads' && (
                          <div className="grid grid-cols-1 gap-3">
                            {output.results.map((l: any, i: number) => (
                              <div key={i} className="p-5 rounded-2xl bg-slate-900 border border-white/5 grid grid-cols-3 gap-4 items-center">
                                <div className="flex items-center gap-3"><Briefcase className="text-accent size-5" /> <span className="font-bold text-sm truncate">{l.businessName}</span></div>
                                <div className="text-xs text-slate-400 font-mono text-center">{l.mobile}</div>
                                <div className="text-xs text-slate-400 text-right truncate">{l.email}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-3 pb-12">
                        <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setOutput(null)}>New Session</Button>
                        <Button 
                          variant="secondary"
                          className="flex-1 h-12 rounded-xl bg-slate-800 hover:bg-slate-700 font-bold"
                          onClick={handleSaveToVault}
                          disabled={isVaulting}
                        >
                          {isVaulting ? <Loader2 className="animate-spin mr-2" /> : <HardDrive size={18} className="mr-2" />} 
                          Save to Brand Vault
                        </Button>
                        <Button className="flex-1 h-12 rounded-xl bg-primary shadow-lg shadow-primary/20 font-bold" onClick={handleDownload}>
                          <Download size={18} className="mr-2" /> Download Asset
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
    <Suspense fallback={<div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>}>
      <AgentsContent />
    </Suspense>
  );
}
