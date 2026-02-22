"use client";

import { useState } from "react";
import { 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  CreditCard, 
  Zap, 
  Save,
  ShoppingBag,
  ExternalLink,
  Smartphone,
  CheckCircle2,
  Lock,
  User
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
        description: "Your platform preferences and security keys have been updated.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-bold mb-1">Settings</h1>
        <p className="text-muted-foreground">Manage platform integrations, notification logic, and security.</p>
      </div>

      <Tabs defaultValue="marketplaces" className="space-y-8">
        <TabsList className="bg-muted/50 p-1 rounded-2xl border border-white/5 h-12 inline-flex">
          <TabsTrigger value="marketplaces" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Globe className="w-4 h-4 mr-2" /> Marketplaces
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Bell className="w-4 h-4 mr-2" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-xl px-6 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
            <Lock className="w-4 h-4 mr-2" /> Security
          </TabsTrigger>
        </TabsList>

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
                <div className="flex items-center gap-2">
                   <Badge variant="outline" className="font-mono text-[10px]">AKIA...4X7Y</Badge>
                   <Button variant="outline" size="sm" className="rounded-lg h-8">Rotate Key</Button>
                </div>
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
            <CardFooter className="bg-muted/10 p-6 flex justify-end">
               <Button onClick={handleSave} disabled={isSaving} className="rounded-xl px-8 shadow-lg shadow-primary/20">
                 {isSaving ? "Saving..." : <><Save size={16} className="mr-2" /> Save Preferences</>}
               </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6 animate-in fade-in slide-in-from-left-4">
           <Card className="rounded-2xl border-white/5 bg-card">
            <CardHeader>
              <CardTitle className="font-headline">Access & Security</CardTitle>
              <CardDescription>Manage your authentication and account safety.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
               <div className="p-4 rounded-xl border border-white/5 bg-secondary/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <User className="text-primary" />
                   <div>
                     <p className="text-sm font-bold">Two-Factor Authentication</p>
                     <p className="text-xs text-muted-foreground">Enhance security with mobile OTP verification.</p>
                   </div>
                 </div>
                 <Switch defaultChecked />
               </div>
               
               <div className="p-4 rounded-xl border border-white/5 bg-secondary/20 flex items-center justify-between">
                 <div className="flex items-center gap-3">
                   <Lock className="text-primary" />
                   <div>
                     <p className="text-sm font-bold">Session Management</p>
                     <p className="text-xs text-muted-foreground">Logout from all other active devices.</p>
                   </div>
                 </div>
                 <Button variant="outline" size="sm" className="rounded-xl">Revoke Sessions</Button>
               </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function MarketplaceCard({ name, status, lastSync, connected }: any) {
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
