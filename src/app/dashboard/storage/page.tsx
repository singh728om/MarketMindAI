"use client";

import { useState } from "react";
import { 
  HardDrive, 
  Cloud, 
  Upload, 
  File, 
  Folder, 
  MoreVertical, 
  Search, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const MOCK_FILES = [
  { id: 1, name: "Amazon_Sales_Report_Oct.csv", type: "CSV", size: "2.4 MB", date: "2 hours ago", status: "Synced" },
  { id: 2, name: "Product_Photos_Batch_A.zip", type: "Archive", size: "145 MB", date: "1 day ago", status: "Synced" },
  { id: 3, name: "Brand_Guidelines_v2.pdf", type: "PDF", size: "8.1 MB", date: "3 days ago", status: "Synced" },
  { id: 4, name: "Ad_Creatives_Instagram.mp4", type: "Video", size: "42 MB", date: "1 week ago", status: "Synced" },
];

export default function StoragePage() {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleConnectDrive = () => {
    setIsConnecting(true);
    // Simulate OAuth2 redirect and connection
    setTimeout(() => {
      setIsConnecting(false);
      setIsConnected(true);
      toast({
        title: "Google Drive Connected",
        description: "Your brand storage is now linked to MarketMind AI.",
      });
    }, 2000);
  };

  const handleUpload = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "File Uploaded",
        description: "Your asset has been securely stored in Google Drive.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Storage Services</h1>
          <p className="text-muted-foreground">Securely manage your brand assets and reports via Google Drive.</p>
        </div>
        <div className="flex items-center gap-2">
          {isConnected && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Drive Connected
            </Badge>
          )}
        </div>
      </div>

      {!isConnected ? (
        <Card className="rounded-[2.5rem] border-white/5 bg-card/50 backdrop-blur-xl overflow-hidden p-12 text-center space-y-8 border-dashed border-2">
          <div className="mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6">
            <Cloud size={48} className="animate-float" />
          </div>
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-3xl font-headline font-bold">Connect Your Storage</h2>
            <p className="text-muted-foreground">
              Link your Google Drive account to automatically backup AI generated assets, sync reports, and centralize your marketplace data.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              className="rounded-2xl h-16 px-10 text-lg font-bold shadow-2xl shadow-primary/20 min-w-[240px]" 
              onClick={handleConnectDrive}
              disabled={isConnecting}
            >
              {isConnecting ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authorizing...</>
              ) : (
                <><Cloud className="mr-2 h-5 w-5" /> Connect Google Drive</>
              )}
            </Button>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <ShieldCheck size={12} className="text-primary" /> OAuth 2.0 Secure Integration
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-8">
            {/* File Management Header */}
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search files in Drive..." 
                  className="pl-10 h-12 rounded-xl bg-card border-white/5"
                />
              </div>
              <Button onClick={handleUpload} disabled={isUploading} className="h-12 rounded-xl px-6 shadow-lg shadow-primary/20">
                {isUploading ? <Loader2 className="animate-spin" /> : <><Upload size={18} className="mr-2" /> Upload Data</>}
              </Button>
            </div>

            {/* Recent Files Table */}
            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-white/5">
                      <th className="px-8 py-4">File Name</th>
                      <th className="px-8 py-4">Type</th>
                      <th className="px-8 py-4">Size</th>
                      <th className="px-8 py-4">Date</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {MOCK_FILES.map((file) => (
                      <tr key={file.id} className="group hover:bg-primary/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                              {file.type === 'Archive' ? <Folder size={16} /> : <File size={16} />}
                            </div>
                            <span className="font-bold text-sm text-white group-hover:text-primary transition-colors">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Badge variant="secondary" className="text-[10px] uppercase">{file.type}</Badge>
                        </td>
                        <td className="px-8 py-5 text-xs text-muted-foreground font-mono">
                          {file.size}
                        </td>
                        <td className="px-8 py-5 text-xs text-muted-foreground">
                          {file.date}
                        </td>
                        <td className="px-8 py-5 text-right">
                          <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-500">
                            <MoreVertical size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <CardFooter className="p-6 bg-muted/10 flex justify-center border-t border-white/5">
                <Button variant="link" className="text-xs text-muted-foreground font-bold uppercase tracking-widest hover:text-primary">
                  View All Files in Drive <ExternalLink size={12} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-8">
            {/* Storage Quota */}
            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-white/5">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <HardDrive size={18} className="text-primary" /> Storage Usage
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">G-Drive Capacity</span>
                    <span className="text-primary">12.4 GB / 15 GB</span>
                  </div>
                  <Progress value={82} className="h-2 bg-slate-800" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    You are using 82% of your primary Google Drive storage. Consider upgrading your plan for more agency asset room.
                  </p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>AI Photoshoots (4.2 GB)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>UGC Video Ads (6.8 GB)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Marketplace Reports (1.4 GB)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sync Status */}
            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-headline">Live Sync</CardTitle>
                <CardDescription>Real-time node status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <RefreshCw size={16} className="text-primary animate-spin" />
                    <span className="text-xs font-bold">Auto-Sync Active</span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 text-[8px] border-none uppercase font-bold tracking-tighter">Healthy</Badge>
                </div>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 flex gap-3">
                  <AlertCircle className="text-amber-500 size-4 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-500 leading-relaxed">
                    Data ingestion for Amazon Ads reports is slightly delayed due to marketplace API maintenance.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tip */}
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
               <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                 <CheckCircle2 size={16} /> Asset Tip
               </h4>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 AI generated photoshoot results are automatically saved to your 'MarketMind_Assets' folder in Google Drive for easy sharing with your team.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
