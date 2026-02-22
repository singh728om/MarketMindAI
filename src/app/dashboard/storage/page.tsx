
"use client";

import { useState, useRef, useEffect } from "react";
import { 
  HardDrive, 
  Database, 
  Upload, 
  File, 
  MoreVertical, 
  Search, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  FileText,
  FileArchive,
  FileVideo,
  FileImage,
  X,
  Zap,
  Lock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_FILES = [
  { id: 1, name: "Amazon_Sales_Report_Oct.csv", type: "CSV", size: "2.4 MB", date: "2 hours ago", status: "Stored" },
  { id: 2, name: "Product_Photos_Batch_A.zip", type: "Archive", size: "145 MB", date: "1 day ago", status: "Stored" },
  { id: 3, name: "Brand_Guidelines_v2.pdf", type: "PDF", size: "8.1 MB", date: "3 days ago", status: "Stored" },
  { id: 4, name: "Ad_Creatives_Instagram.mp4", type: "Video", size: "42 MB", date: "1 week ago", status: "Stored" },
];

export default function StoragePage() {
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Load persistent state
  useEffect(() => {
    const active = localStorage.getItem("marketmind_vault_active") === "true";
    const savedFiles = localStorage.getItem("marketmind_vault_files");
    
    setIsVaultActive(active);
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    } else {
      setFiles(INITIAL_FILES);
    }
    setIsLoaded(true);
  }, []);

  // Save files whenever list changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("marketmind_vault_files", JSON.stringify(files));
    }
  }, [files, isLoaded]);

  const handleActivateVault = () => {
    setIsActivating(true);
    setTimeout(() => {
      setIsActivating(false);
      setIsVaultActive(true);
      localStorage.setItem("marketmind_vault_active", "true");
      toast({
        title: "Brand Vault Online",
        description: "Your dedicated MarketMind storage node has been provisioned.",
      });
    }, 2000);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 10, 100));
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setIsUploading(false);
      const newFile = {
        id: Date.now(),
        name: file.name,
        type: file.name.split('.').pop()?.toUpperCase() || 'DATA',
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        date: "Just now",
        status: "Stored"
      };
      setFiles(prev => [newFile, ...prev]);
      toast({
        title: "File Secured in Vault",
        description: `${file.name} has been encrypted and stored.`,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 2500);
  };

  const deleteFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({ title: "File Purged", description: "Asset removed from Brand Vault." });
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'CSV':
      case 'PDF': return <FileText size={16} />;
      case 'ARCHIVE':
      case 'ZIP': return <FileArchive size={16} />;
      case 'VIDEO':
      case 'MP4': return <FileVideo size={16} />;
      case 'JPG':
      case 'PNG': return <FileImage size={16} />;
      default: return <File size={16} />;
    }
  };

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Storage Services</h1>
          <p className="text-muted-foreground">Internal high-performance cloud vault for your brand assets.</p>
        </div>
        <div className="flex items-center gap-2">
          {isVaultActive && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Vault Node: ACTIVE
            </Badge>
          )}
        </div>
      </div>

      {!isVaultActive ? (
        <Card className="rounded-[2.5rem] border-white/5 bg-card/50 backdrop-blur-xl overflow-hidden p-12 text-center space-y-8 border-dashed border-2">
          <div className="mx-auto w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-2xl shadow-primary/10">
            <Database size={48} className="animate-float" />
          </div>
          <div className="max-w-md mx-auto space-y-4">
            <h2 className="text-3xl font-headline font-bold">Initialize Your Brand Vault</h2>
            <p className="text-muted-foreground">
              MarketMind provides dedicated, AES-256 encrypted storage for all your AI-generated photoshoot assets, listing reports, and marketplace documentation.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4">
            <Button 
              size="lg" 
              className="rounded-2xl h-16 px-10 text-lg font-bold shadow-2xl shadow-primary/20 min-w-[240px]" 
              onClick={handleActivateVault}
              disabled={isActivating}
            >
              {isActivating ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Provisioning Node...</>
              ) : (
                <><Zap className="mr-2 h-5 w-5" /> Activate Brand Vault</>
              )}
            </Button>
            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold flex items-center gap-2">
              <ShieldCheck size={12} className="text-primary" /> Proprietary Agency Infrastructure
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  placeholder="Search secured files..." 
                  className="pl-10 h-12 rounded-xl bg-card border-white/5"
                />
              </div>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <Button onClick={triggerFileInput} disabled={isUploading} className="h-12 rounded-xl px-6 shadow-lg shadow-primary/20">
                {isUploading ? (
                  <><Loader2 className="animate-spin mr-2" /> {uploadProgress}%</>
                ) : (
                  <><Upload size={18} className="mr-2" /> Upload Asset</>
                )}
              </Button>
            </div>

            {isUploading && (
              <Card className="rounded-2xl border-primary/20 bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-primary uppercase">Securing in Vault...</span>
                  <span className="text-xs font-bold">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5" />
              </Card>
            )}

            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-white/5">
                      <th className="px-8 py-4">File Name</th>
                      <th className="px-8 py-4">Format</th>
                      <th className="px-8 py-4">Size</th>
                      <th className="px-8 py-4">Stored On</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {files.map((file) => (
                      <tr key={file.id} className="group hover:bg-primary/5 transition-colors">
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">
                              {getFileIcon(file.type)}
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
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-slate-500">
                                <MoreVertical size={16} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white">
                              <DropdownMenuItem className="flex items-center gap-2">
                                <ExternalLink size={14} /> Open Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-rose-500 flex items-center gap-2" onClick={() => deleteFile(file.id)}>
                                <X size={14} /> Purge from Vault
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <CardFooter className="p-6 bg-muted/10 flex justify-center border-t border-white/5">
                <Button variant="link" className="text-xs text-muted-foreground font-bold uppercase tracking-widest hover:text-primary">
                  Access Master Archive <ExternalLink size={12} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-white/5">
                <CardTitle className="text-lg font-headline flex items-center gap-2">
                  <HardDrive size={18} className="text-primary" /> Vault Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                    <span className="text-muted-foreground">Node Capacity</span>
                    <span className="text-primary">{(files.length * 1.2).toFixed(1)} GB / 100 GB</span>
                  </div>
                  <Progress value={files.length * 1.2} className="h-2 bg-slate-800" />
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    You are utilizing {(files.length * 1.2).toFixed(1)}% of your high-speed agency storage. All data is replicated across 3 regional nodes.
                  </p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>AI Content ({(files.filter(f => ['PNG', 'JPG', 'IMAGE'].includes(f.type)).length * 0.8).toFixed(1)} GB)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-purple-500" />
                    <span>Video Masters ({(files.filter(f => ['MP4', 'VIDEO'].includes(f.type)).length * 2.4).toFixed(1)} GB)</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-slate-300">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Marketplace Intel ({(files.filter(f => ['CSV', 'PDF', 'DATA'].includes(f.type)).length * 0.4).toFixed(1)} GB)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
              <CardHeader>
                <CardTitle className="text-lg font-headline">Vault Security</CardTitle>
                <CardDescription>Enterprise Grade Encryption</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-secondary/20 border border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold">AES-256 Active</span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 text-[8px] border-none uppercase font-bold tracking-tighter">Verified</Badge>
                </div>
                <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex gap-3">
                  <RefreshCw size={16} className="text-primary animate-spin shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Real-time synchronization active. Changes are mirrored across your dashboard and internal agency fulfillment nodes.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
               <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                 <Zap size={16} /> Asset tip
               </h4>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 AI generated photoshoot results are automatically saved here for easy sharing with your team. No manual upload needed.
               </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
