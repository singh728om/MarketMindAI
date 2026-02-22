"use client";

import { useState } from "react";
import { 
  Key, 
  ShieldCheck, 
  Zap, 
  Save, 
  RefreshCw, 
  BrainCircuit,
  Lock,
  Eye,
  EyeOff,
  Activity,
  Server,
  Database
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

export default function InternalSettingsPage() {
  const [showKey, setShowKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveConfig = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "System Config Updated",
        description: "Gemini API keys and global constraints have been synced.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="text-3xl font-headline font-bold text-white">System Configuration</h1>
        <p className="text-slate-400">Master controls for MarketMind AI infrastructure and LLM endpoints.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* API Keys */}
          <Card className="bg-slate-900 border-white/5 overflow-hidden">
            <CardHeader className="bg-accent/5 border-b border-white/5 p-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
                  <Key size={24} />
                </div>
                <div>
                  <CardTitle className="text-xl font-headline font-bold text-white">LLM Provider Config</CardTitle>
                  <CardDescription className="text-slate-400">Primary AI engine settings for all agents.</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Google Gemini API Key (Pro 1.5)</Label>
                  <Badge variant="outline" className="text-emerald-500 border-emerald-500/20 bg-emerald-500/5 px-2">Active</Badge>
                </div>
                <div className="relative">
                  <Input 
                    type={showKey ? "text" : "password"} 
                    defaultValue="AIzaSyCqOB3Ka2dA0Nl5kbLFrg9KER2whBkt3pA"
                    className="h-12 rounded-xl bg-slate-800 border-white/5 text-white font-mono text-sm pr-20"
                  />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white" onClick={() => setShowKey(!showKey)}>
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-white">
                      <RefreshCw size={16} />
                    </Button>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 italic">Used for: Listing Optimizer, Report Narrator, and Growth Engine.</p>
              </div>

              <div className="space-y-4 pt-6 border-t border-white/5">
                <Label className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Image Model Endpoint (Imagen 3)</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Processing Node</Label>
                    <Input defaultValue="asia-south1-ai" className="h-10 rounded-lg bg-slate-800 border-white/5" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-slate-500">Concurrent Limit</Label>
                    <Input type="number" defaultValue="50" className="h-10 rounded-lg bg-slate-800 border-white/5" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-800/30 p-6 flex justify-end">
              <Button onClick={handleSaveConfig} className="bg-accent text-accent-foreground rounded-xl px-8 font-bold" disabled={isSaving}>
                {isSaving ? <RefreshCw className="animate-spin mr-2" size={16} /> : <Save className="mr-2" size={16} />}
                Save System Config
              </Button>
            </CardFooter>
          </Card>

          {/* Operational Controls */}
          <Card className="bg-slate-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-xl font-headline font-bold text-white">Global Restrictions</CardTitle>
              <CardDescription className="text-slate-400">Manage how the user portal behaves system-wide.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Trial Period Gatekeeper</p>
                  <p className="text-xs text-slate-500">Automatically redirect users to landing page after 7 days.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-800/50 border border-white/5">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-white">Public Maintenance Mode</p>
                  <p className="text-xs text-slate-500">Disable all customer logins for scheduled platform upgrades.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-8">
          {/* Infrastructure Health */}
          <Card className="bg-slate-900 border-white/5">
            <CardHeader>
              <CardTitle className="text-lg font-headline font-bold text-white">Infra Health</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Server size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">Edge Handlers</p>
                  <p className="text-[10px] text-slate-500">Operational • 12ms Latency</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Database size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">Firestore Storage</p>
                  <p className="text-[10px] text-slate-500">Operational • Regional-AS</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                  <Activity size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-white">Token Burn Rate</p>
                  <p className="text-[10px] text-slate-500">High • Check active agents</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Tip */}
          <div className="p-6 rounded-3xl bg-accent/10 border border-accent/20 space-y-3 shadow-2xl shadow-accent/10">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground mb-2">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-bold text-white text-sm">Security Advisory</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              API Keys are stored in an encrypted vault. Rotation is recommended every 90 days to maintain secure operational integrity across the agency platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
