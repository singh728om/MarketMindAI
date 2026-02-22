"use client";

import { useState } from "react";
import { 
  Sparkles, 
  Camera, 
  Video, 
  FileText, 
  LayoutGrid, 
  FileSearch,
  Users,
  AlertTriangle,
  ChevronRight,
  Loader2,
  Copy,
  Download
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { 
  optimizeProductListing, 
  generateUgcCampaignAssets,
  generateVideoAdContent,
  generateCatalogTemplate,
  generatePhotoshootPrompts,
  generateClientReportNarrative
} from "@/ai/flows/generate-ugc-campaign-assets"; // Note: In a real app we'd import correctly, mapping to our defined flows.

// Mock mappings since we can't dynamic import all for the example
const AGENTS = [
  { id: "listing", title: "Listing Optimizer", icon: FileText, desc: "SEO-friendly titles, bullets, and A+ content.", color: "text-blue-500", flow: optimizeProductListing },
  { id: "photoshoot", title: "Photoshoot Agent", icon: Camera, desc: "Prompt builder + style presets for high-end photography.", color: "text-purple-500", flow: generatePhotoshootPrompts },
  { id: "video", title: "Video Ad Agent", icon: Video, desc: "Storyboard + text-to-video prompt generation.", color: "text-rose-500", flow: generateVideoAdContent },
  { id: "catalog", title: "Catalog Automation", icon: LayoutGrid, desc: "Template generation + marketplace rule validation.", color: "text-emerald-500", flow: generateCatalogTemplate },
  { id: "ugc", title: "UGC Script Studio", icon: Users, desc: "10 hooks + detailed creator briefs & scripts.", color: "text-orange-500", flow: generateUgcCampaignAssets },
  { id: "report", title: "Client Report Narrator", icon: FileSearch, desc: "Weekly performance analysis into readable narrative.", color: "text-indigo-500", flow: generateClientReportNarrative },
];

export default function AgentsPage() {
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState<any>(null);
  const { toast } = useToast();

  const handleRunAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRunning(true);
    
    // Simulate API delay
    await new Promise(r => setTimeout(r, 2000));
    
    // In demo, we'll show a generic success state with mocked results
    setOutput({
      title: "Optimized Premium Silk Kurta",
      bullets: ["100% Pure Mulberry Silk", "Hand-stitched Traditional Embroidery", "Breathable Fabric for Tropical Climates"],
      description: "Experience elegance with our premium silk kurta, designed for the modern ethnic connoisseur...",
      prompt: "A high-fashion editorial shot of a silk kurta on a minimalist marble pedestal, soft natural light, 8k, photorealistic."
    });
    
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
      <Dialog open={!!selectedAgent} onOpenChange={() => { setSelectedAgent(null); setOutput(null); }}>
        <DialogContent className="max-w-2xl bg-card border-white/10 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col p-0">
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
                  <form onSubmit={handleRunAgent} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Product Name</Label>
                        <Input placeholder="e.g. Silk Kurta" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Category</Label>
                        <Input placeholder="e.g. Apparel" required />
                      </div>
                    </div>
                    
                    {selectedAgent.id === 'photoshoot' && (
                      <div className="grid grid-cols-2 gap-4">
                         <div className="space-y-2">
                          <Label>Fabric</Label>
                          <Input placeholder="Silk, Cotton..." />
                        </div>
                        <div className="space-y-2">
                          <Label>Lighting</Label>
                          <Input placeholder="Natural, Studio..." />
                        </div>
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label>Key Features (Optional)</Label>
                      <Textarea placeholder="List main selling points..." />
                    </div>

                    <Button type="submit" className="w-full h-12 rounded-xl text-lg font-bold" disabled={isRunning}>
                      {isRunning ? (
                        <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Thinking...</>
                      ) : (
                        "Generate Output"
                      )}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                    <div className="p-6 rounded-2xl bg-secondary/30 border border-white/5 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold font-headline">AI Result</h4>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" onClick={() => copyToClipboard(JSON.stringify(output))}><Copy size={16} /></Button>
                          <Button variant="ghost" size="icon"><Download size={16} /></Button>
                        </div>
                      </div>
                      
                      <div className="space-y-4 text-sm text-muted-foreground">
                        {output.title && (
                          <div>
                            <p className="font-bold text-foreground">Title</p>
                            <p className="p-3 bg-background/50 rounded-lg mt-1">{output.title}</p>
                          </div>
                        )}
                        {output.prompt && (
                          <div>
                            <p className="font-bold text-foreground">AI Generation Prompt</p>
                            <p className="p-3 bg-background/50 rounded-lg mt-1 italic">{output.prompt}</p>
                          </div>
                        )}
                        {output.description && (
                          <div>
                            <p className="font-bold text-foreground">Description Preview</p>
                            <p className="p-3 bg-background/50 rounded-lg mt-1">{output.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" className="w-full" onClick={() => setOutput(null)}>Start New Task</Button>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-muted/50 border-t flex items-center justify-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Mock AI Execution Mode</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
