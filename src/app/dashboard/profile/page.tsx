"use client";

import { useState } from "react";
import { 
  Building2, 
  Save, 
  Upload, 
  Globe, 
  CreditCard, 
  MapPin, 
  Mail, 
  Phone,
  FileText,
  ShieldCheck,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function BrandProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      setIsSaving(false);
      toast({
        title: "Profile Updated",
        description: "Your brand details and GST information have been saved.",
      });
    }, 1500);
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Brand Profile</h1>
          <p className="text-muted-foreground">Manage your core brand identity and business documentation.</p>
        </div>
        <div className="flex items-center gap-2">
           <Badge variant="outline" className="border-emerald-500/20 text-emerald-500 bg-emerald-500/5 px-3 py-1">
             <ShieldCheck size={12} className="mr-1" /> Verified Seller
           </Badge>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Identity Section */}
          <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="font-headline flex items-center gap-2">
                <Building2 size={20} className="text-primary" /> Brand Identity
              </CardTitle>
              <CardDescription>Primary details for your marketplace presence.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="brand-name">Brand Name</Label>
                  <Input id="brand-name" defaultValue="CHIC ELAN" required className="rounded-xl h-12" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="brand-website">Website URL</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="brand-website" defaultValue="https://chicelan.in" className="pl-10 rounded-xl h-12" />
                  </div>
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="brand-description">Brand Description</Label>
                  <Textarea 
                    id="brand-description" 
                    placeholder="Describe your brand voice and positioning..."
                    className="rounded-xl min-h-[120px]"
                    defaultValue="Premium ethnic wear brand focusing on handcrafted elegance for the modern woman."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Business & Tax Section */}
          <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-white/5">
              <CardTitle className="font-headline flex items-center gap-2">
                <FileText size={20} className="text-primary" /> Business & Tax Details
              </CardTitle>
              <CardDescription>Critical information for billing and marketplace compliance.</CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="gst-number">GST Number</Label>
                  <Input id="gst-number" defaultValue="07AAHCM1234F1Z1" required className="rounded-xl h-12 font-mono" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pan-number">Business PAN</Label>
                  <Input id="pan-number" defaultValue="AAHCM1234F" className="rounded-xl h-12 font-mono uppercase" />
                </div>
                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="billing-address">Registered Billing Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-4 w-4 h-4 text-muted-foreground" />
                    <Textarea 
                      id="billing-address" 
                      defaultValue="Plot No 44, Udyog Vihar Phase-1, Gurgaon, Haryana 122016"
                      className="pl-10 rounded-xl min-h-[100px]"
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-4">
             <Button type="button" variant="ghost" className="rounded-xl px-8 h-12">Discard Changes</Button>
             <Button type="submit" className="rounded-xl px-8 h-12 shadow-lg shadow-primary/20" disabled={isSaving}>
               {isSaving ? (
                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
               ) : (
                 <><Save className="mr-2 h-4 w-4" /> Save Brand Profile</>
               )}
             </Button>
          </div>
        </div>

        <div className="space-y-8">
          {/* Brand Assets */}
          <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Brand Assets</CardTitle>
              <CardDescription>Logos and visual identifiers.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4">
                <div className="w-32 h-32 rounded-3xl bg-primary/10 border-2 border-dashed border-primary/20 flex items-center justify-center text-primary group cursor-pointer hover:bg-primary/20 transition-all relative overflow-hidden">
                  <span className="text-4xl font-bold font-headline">CE</span>
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Upload size={24} className="text-white" />
                  </div>
                </div>
                <div className="text-center">
                  <p className="font-bold text-sm">Main Brand Logo</p>
                  <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-1">PNG, SVG or WEBP</p>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl">Change Logo</Button>
              </div>
            </CardContent>
          </Card>

          {/* Contact Person */}
          <Card className="rounded-3xl border-white/5 bg-card overflow-hidden">
            <CardHeader>
              <CardTitle className="font-headline text-lg">Key Contact</CardTitle>
              <CardDescription>Direct person for agency updates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Primary Contact Name</Label>
                <Input id="contact-name" defaultValue="Rahul Malhotra" className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Contact Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input id="contact-email" defaultValue="rahul@chicelan.in" className="pl-10 rounded-xl h-11" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-phone">Mobile Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <Input id="contact-phone" defaultValue="+91 8882130155" className="pl-10 rounded-xl h-11" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pro Tip */}
          <div className="p-6 rounded-3xl bg-primary/5 border border-primary/20 space-y-3">
             <h4 className="font-bold text-primary text-sm flex items-center gap-2">
               <Zap size={16} /> Automation Tip
             </h4>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Keeping your Brand Description detailed helps our AI agents generate more accurate product listings and creative briefs that match your brand voice.
             </p>
          </div>
        </div>
      </form>
    </div>
  );
}

function Zap({ className, size }: { className?: string, size?: number }) {
  return <svg xmlns="http://www.w3.org/2000/svg" width={size || 24} height={size || 24} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>;
}
