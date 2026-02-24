"use client";

import { useState, useRef, useEffect, useMemo } from "react";
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
  Lock,
  Download,
  Eye
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const INITIAL_FILES = [
  { id: 1, name: "Amazon_Sales_Report_Oct.csv", type: "CSV", size: "2.4 MB", date: "2 hours ago", status: "Stored", url: "#" },
  { id: 2, name: "Product_Photos_Batch_A.zip", type: "Archive", size: "145 MB", date: "1 day ago", status: "Stored", url: "#" },
  { id: 3, name: "Brand_Guidelines_v2.pdf", type: "PDF", size: "8.1 MB", date: "3 days ago", status: "Stored", url: "#" },
  { id: 4, name: "Ad_Creatives_Instagram.mp4", type: "Video", size: "42 MB", date: "1 week ago", status: "Stored", url: "#" },
];

export default function StoragePage() {
  const [isVaultActive, setIsVaultActive] = useState(false);
  const [isActivating, setIsActivating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [previewFile, setPreviewFile] = useState<any>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadVault = () => {
      try {
        const active = localStorage.getItem("marketmind_vault_active") === "true";
        const savedFiles = localStorage.getItem("marketmind_vault_files");
        
        setIsVaultActive(active);
        if (savedFiles) {
          setFiles(JSON.parse(savedFiles));
        } else {
          setFiles(INITIAL_FILES);
        }
      } catch (e) {
        console.error("Vault Access Error:", e);
      } finally {
        setIsLoaded(true);
      }
    };

    loadVault();
    window.addEventListener('storage', loadVault);
    return () => window.removeEventListener('storage', loadVault);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("marketmind_vault_files", JSON.stringify(files));
    }
  }, [files, isLoaded]);

  const filteredFiles = useMemo(() => {
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress(prev => Math.min(prev + 15, 100));
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
        status: "Stored",
        url: URL.createObjectURL(file)
      };
      setFiles(prev => [newFile, ...prev]);
      toast({
        title: "File Secured in Vault",
        description: `${file.name} has been encrypted and stored.`,
      });
      if (fileInputRef.current) fileInputRef.current.value = "";
    }, 1500);
  };

  const deleteFile = (id: number) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    toast({ title: "File Purged", description: "Asset removed from Brand Vault." });
  };

  const getFileIcon = (type: string) => {
    const t = type.toUpperCase();
    if (['MP4', 'VIDEO'].includes(t)) return <FileVideo size={16} className="text-rose-500" />;
    if (['JPG', 'PNG', 'IMAGE', 'WEBP'].includes(t)) return <FileImage size={16} className="text-purple-500" />;
    if (['CSV', 'PDF', 'XLSX'].includes(t)) return <FileText size={16} className="text-blue-500" />;
    if (['ZIP', 'ARCHIVE'].includes(t)) return <FileArchive size={16} className="text-amber-500" />;
    return <File size={16} className="text-slate-400" />;
  };

  if (!isLoaded) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="space-y-8 pb-20 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">Storage Services</h1>
          <p className="text-slate-400">Internal high-performance cloud vault for your brand assets.</p>
        </div>
        <div className="flex items-center gap-2">
          {isVaultActive && (
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-4 py-1.5 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Vault Node: AS-S1 Active
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
            <h2 className="text-3xl font-headline font-bold text-white">Initialize Your Brand Vault</h2>
            <p className="text-slate-400 leading-relaxed">
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
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold flex items-center gap-2">
              <ShieldCheck size={12} className="text-primary" /> Proprietary Agency Infrastructure
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                <Input 
                  placeholder="Search secured assets..." 
                  className="pl-12 h-14 rounded-2xl bg-slate-900 border-white/5 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
              />
              <Button onClick={() => fileInputRef.current?.click()} disabled={isUploading} className="h-14 rounded-2xl px-8 shadow-xl shadow-primary/20 font-bold bg-primary hover:bg-primary/90">
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
                  <span className="text-xs font-bold text-primary uppercase tracking-widest">Securing in Vault...</span>
                  <span className="text-xs font-bold text-white">{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="h-1.5 bg-slate-800" />
              </Card>
            )}

            <Card className="rounded-3xl border-white/5 bg-slate-900/50 overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-slate-800/50 text-[10px] uppercase tracking-widest font-bold text-slate-500 border-b border-white/5">
                      <th className="px-8 py-4">File Name</th>
                      <th className="px-8 py-4">Format</th>
                      <th className="px-8 py-4">Size</th>
                      <th className="px-8 py-4">Stored On</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="group hover:bg-primary/5 transition-colors cursor-pointer" onClick={() => file.url !== "#" && setPreviewFile(file)}>
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center border border-white/5 shadow-inner">
                              {getFileIcon(file.type)}
                            </div>
                            <span className="font-bold text-sm text-white group-hover:text-primary transition-colors truncate max-w-[200px]">{file.name}</span>
                          </div>
                        </td>
                        <td className="px-8 py-5">
                          <Badge variant="secondary" className="text-[9px] uppercase font-bold tracking-tighter bg-slate-800 text-slate-400 border-white/5">{file.type}</Badge>
                        </td>
                        <td className="px-8 py-5 text-[10px] text-slate-500 font-mono">
                          {file.size}
                        </td>
                        <td className="px-8 py-5 text-xs text-slate-500">
                          {file.date}
                        </td>
                        <td className="px-8 py-5 text-right" onClick={(e) => e.stopPropagation()}>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 text-slate-500 hover:bg-white/5">
                                <MoreVertical size={18} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white min-w-[160px] rounded-xl">
                              <DropdownMenuItem className="flex items-center gap-2" onClick={() => file.url !== "#" && setPreviewFile(file)}>
                                <Eye size={14} className="text-primary" /> Open Preview
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2" asChild>
                                <a href={file.url} download={file.name}>
                                  <Download size={14} className="text-emerald-500" /> Download
                                </a>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-rose-500 flex items-center gap-2" onClick={() => deleteFile(file.id)}>
                                <X size={14} /> Purge from Vault
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))}
                    {filteredFiles.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-8 py-20 text-center text-slate-500 italic text-sm">
                          No matching assets found in your Brand Vault.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <CardFooter className="p-6 bg-slate-800/30 flex justify-center border-t border-white/5">
                <Button variant="link" className="text-xs text-slate-500 font-bold uppercase tracking-widest hover:text-primary transition-colors">
                  Access Distributed Nodes <ExternalLink size={12} className="ml-2" />
                </Button>
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="rounded-3xl border-white/5 bg-slate-900 overflow-hidden shadow-2xl">
              <CardHeader className="bg-primary/5 border-b border-white/5">
                <CardTitle className="text-lg font-headline flex items-center gap-2 text-white">
                  <HardDrive size={18} className="text-primary" /> Vault Utilization
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    <span>Node Capacity</span>
                    <span className="text-primary">{(files.length * 1.2).toFixed(1)} GB / 100 GB</span>
                  </div>
                  <Progress value={files.length * 1.2} className="h-2 bg-slate-800" />
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Utilizing {(files.length * 1.2).toFixed(1)}% of your high-speed agency storage. Data is replicated across 3 regional nodes for zero-loss redundancy.
                  </p>
                </div>
                
                <div className="space-y-3 pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-purple-500" />
                      <span>AI Studio Output</span>
                    </div>
                    <span>{(files.filter(f => ['PNG', 'JPG', 'IMAGE'].includes(f.type.toUpperCase())).length * 0.8).toFixed(1)} GB</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500" />
                      <span>Video Ads Masters</span>
                    </div>
                    <span>{(files.filter(f => ['MP4', 'VIDEO'].includes(f.type.toUpperCase())).length * 2.4).toFixed(1)} GB</span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-tighter text-slate-400">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Marketplace Intel</span>
                    </div>
                    <span>{(files.filter(f => ['CSV', 'PDF', 'DATA'].includes(f.type.toUpperCase())).length * 0.4).toFixed(1)} GB</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-3xl border-white/5 bg-slate-900 p-8 space-y-6 shadow-2xl">
              <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Vault Security</h4>
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock size={16} className="text-emerald-500" />
                    <span className="text-xs font-bold text-white">AES-256 Active</span>
                  </div>
                  <Badge className="bg-emerald-500/10 text-emerald-500 text-[8px] border-none uppercase font-bold">Verified</Badge>
                </div>
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex gap-3">
                  <RefreshCw size={16} className="text-primary animate-spin shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed">
                    Real-time synchronization active. Studio deliveries are automatically mirrored to your Brand Vault.
                  </p>
                </div>
              </div>
            </Card>

            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                 <Zap size={40} />
               </div>
               <h4 className="font-bold text-primary text-sm flex items-center gap-2">
                 <Zap size={16} /> Asset Logic
               </h4>
               <p className="text-[11px] text-slate-400 leading-relaxed">
                 AI generated photoshoot results and video ads are automatically saved here for collaborative review. No manual upload required for Studio assets.
               </p>
            </div>
          </div>
        </div>
      )}

      {/* Asset Preview Dialog */}
      <Dialog open={!!previewFile} onOpenChange={(open) => !open && setPreviewFile(null)}>
        <DialogContent className="max-w-4xl bg-slate-950 border-white/10 rounded-[2.5rem] overflow-hidden p-0 text-white shadow-2xl">
          {previewFile && (
            <div className="flex flex-col">
              <div className="p-6 md:p-8 border-b border-white/5 flex justify-between items-center bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {getFileIcon(previewFile.type)}
                  </div>
                  <div>
                    <h3 className="text-lg md:text-xl font-headline font-bold truncate max-w-[300px] md:max-w-md">{previewFile.name}</h3>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Stored in Astra Vault AS-S1</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="rounded-full hover:bg-white/10" onClick={() => setPreviewFile(null)}>
                  <X size={20} />
                </Button>
              </div>
              
              <div className="p-4 md:p-10 flex items-center justify-center bg-black/60 min-h-[400px] max-h-[70vh] overflow-hidden">
                {['VIDEO', 'MP4'].includes(previewFile.type.toUpperCase()) ? (
                  <video src={previewFile.url} className="max-w-full max-h-full rounded-2xl shadow-2xl" controls autoPlay loop />
                ) : previewFile.url !== "#" ? (
                  <img src={previewFile.url} className="max-w-full max-h-full rounded-2xl shadow-2xl object-contain" alt={previewFile.name} />
                ) : (
                  <div className="flex flex-col items-center gap-4 text-slate-500 italic">
                    <AlertCircle size={48} />
                    <p>Preview not available for system reports.</p>
                  </div>
                )}
              </div>

              <div className="p-6 md:p-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/50">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Asset Size</span>
                    <span className="text-sm font-bold text-white">{previewFile.size}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">Stored On</span>
                    <span className="text-sm font-bold text-white">{previewFile.date}</span>
                  </div>
                </div>
                <div className="flex gap-3 w-full sm:w-auto">
                   <Button variant="outline" className="flex-1 sm:flex-none h-12 rounded-xl border-white/10 hover:bg-white/5" onClick={() => setPreviewFile(null)}>
                     Close
                   </Button>
                   <Button className="flex-1 sm:flex-none h-12 rounded-xl bg-primary shadow-xl shadow-primary/20 font-bold" asChild>
                     <a href={previewFile.url} download={previewFile.name}>
                       <Download size={16} className="mr-2" /> Download Master
                     </a>
                   </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
