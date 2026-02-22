
"use client";

import { useState } from "react";
import { 
  Settings, 
  User, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard, 
  Zap, 
  Save,
  ShoppingBag,
  ExternalLink,
  Smartphone,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function SettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Settings Saved",
        description: "Your brand preferences and API keys have been updated.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage your brand identity, integrations, and preferences.</p>
      </div>

      <Tabs defaultValue="brand" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-white/5 h-12 inline-flex">
          <TabsTrigger value="brand" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <User className="w-4 h-4 mr-2" /> Brand Profile
          </TabsTrigger>
          <TabsTrigger value="marketplaces" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="w-4 h-4 mr-2" /> Marketplaces
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="billing" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <CreditCard className="w-4 h-4 mr-2" /> Plan & Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="brand" className="space-y-6 animate-in fade-in slide-in-from-left-4">
          <Card className="rounded-2xl border-white/5 bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="font-headline">Identity & Details</CardTitle>
              <CardDescription>Public information used across AI generation agents.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input id="brand-name" defaultValue="CHIC ELAN" className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website">Website URL</Label>
                  <Input id="website" defaultValue="https://chicelan.in" className="rounded-xl" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Brand Description</Label>
                  <textarea 
                    id="bio" 
                    className="flex min-h-[100px] w-full rounded-xl border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder="Describe your brand voice, tone, and mission..."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/30 p-6 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="rounded-xl px-8 font-bold">
                {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" /> Save Changes</>}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="marketplaces" className="space-y-6 animate-in fade-in slide-in-from-left-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <MarketplaceCard 
              name="Amazon India" 
              status="Connected" 
              logo="/logos/amazon.png"
              lastSync="2 hours ago"
              connected
            />
            <MarketplaceCard 
              name="Flipkart" 
              status="Connected" 
              logo="/logos/flipkart.png"
              lastSync="5 hours ago"
              connected
            />
            <MarketplaceCard 
              name="Myntra" 
              status="Disconnected" 
              logo="/logos/myntra.png"
              lastSync="Never"
              connected={false}
            />
          </div>

          <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="font-headline">API Key Management</CardTitle>
              <CardDescription>Securely manage your seller central credentials.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Shield className="text-primary w-5 h-5" />
                  <div>
                    <p className="text-sm font-bold">AWS Access Key (Amazon SP-API)</p>
                    <p className="text-xs text-muted-foreground">Used for real-time inventory and pricing sync.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="rounded-lg h-8">Rotate Key</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6 animate-in fade-in slide-in-from-left-4">
           <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="font-headline">Alert Preferences</CardTitle>
              <CardDescription>Choose how you want to be notified of AI updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Email Notifications</Label>
                  <p className="text-xs text-muted-foreground">Weekly performance narrative and project updates.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">WhatsApp Integration</Label>
                  <p className="text-xs text-muted-foreground">Direct alerts for low stock or high ad spend spikes.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-muted/20">
                <div className="space-y-0.5">
                  <Label className="text-sm font-bold">Browser Push</Label>
                  <p className="text-xs text-muted-foreground">Instant notifications for completed AI photoshoots.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6 animate-in fade-in slide-in-from-left-4">
          <Card className="rounded-2xl border-primary/20 bg-primary/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10">
               <Zap size={120} strokeWidth={1} />
             </div>
             <CardHeader>
               <div className="flex items-center gap-2 mb-2">
                 <Badge className="bg-primary text-white">Current Plan</Badge>
                 <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">7 Days Left</span>
               </div>
               <CardTitle className="text-3xl font-headline font-bold">Free Trial Experience</CardTitle>
               <CardDescription className="max-w-md">You are currently experiencing the limited agency tier. Upgrade to unlock full AI production capabilities.</CardDescription>
             </CardHeader>
             <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">AI Credits</p>
                    <p className="text-xl font-bold">12 / 50</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Projects</p>
                    <p className="text-xl font-bold">3 / 5</p>
                  </div>
                  <div className="p-4 rounded-xl bg-background/50 border border-white/5">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">Marketplaces</p>
                    <p className="text-xl font-bold">Unlimited</p>
                  </div>
                </div>
                <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90">
                  Upgrade to Agency Pro
                </Button>
             </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MarketplaceCard({ name, status, logo, lastSync, connected }: any) {
  return (
    <Card className={`rounded-2xl border-white/5 bg-card overflow-hidden transition-all ${!connected ? 'grayscale opacity-60' : 'hover:border-primary/50'}`}>
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center font-bold text-xs uppercase">
            {name.charAt(0)}
          </div>
          <Badge variant={connected ? 'default' : 'secondary'} className="text-[10px] font-bold">
            {status}
          </Badge>
        </div>
        <h4 className="font-bold font-headline mb-1">{name}</h4>
        <p className="text-[10px] text-muted-foreground uppercase tracking-widest mb-4">Last Sync: {lastSync}</p>
        <Button variant={connected ? 'outline' : 'default'} size="sm" className="w-full rounded-lg">
          {connected ? 'Manage Sync' : 'Connect Store'}
        </Button>
      </CardContent>
    </Card>
  );
}
