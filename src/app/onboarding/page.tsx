"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  Upload, 
  Target, 
  Settings, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  BrainCircuit
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const STEPS = ["Marketplaces", "Brand Details", "Growth Goals", "Connect Tools"];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
    else {
      toast({ title: "Welcome to MarketMind!", description: "Account setup is complete." });
      router.push("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: step === 2 ? "Logo Uploaded" : "File Uploaded",
        description: `Successfully ingested: ${file.name}`,
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background relative overflow-hidden hero-gradient">
      <Link href="/" className="absolute top-10 left-10 flex items-center gap-2 hover:opacity-80 transition-opacity">
         <BrainCircuit className="text-primary w-8 h-8" />
         <span className="font-headline font-bold text-xl tracking-tight">MarketMind</span>
      </Link>

      <div className="w-full max-w-2xl">
        <div className="mb-12 flex items-center justify-between">
          {STEPS.map((s, i) => (
            <div key={s} className="flex flex-col items-center gap-2 relative">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                step > i + 1 ? 'bg-primary border-primary text-white' : 
                step === i + 1 ? 'border-primary text-primary bg-primary/10 scale-110 shadow-lg shadow-primary/20' : 
                'border-muted text-muted-foreground bg-secondary'
              }`}>
                {step > i + 1 ? <CheckCircle2 size={20} /> : i + 1}
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-widest ${step === i + 1 ? 'text-primary' : 'text-muted-foreground'}`}>{s}</span>
            </div>
          ))}
        </div>

        <Card className="p-10 rounded-3xl border-white/5 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-headline font-bold">Select Your Marketplaces</h2>
              <p className="text-muted-foreground">Which platforms do you currently sell on?</p>
              <div className="space-y-4">
                {['Amazon India', 'Flipkart', 'Myntra', 'Ajio'].map(m => (
                  <div key={m} className="flex items-center space-x-4 p-4 rounded-xl border border-white/5 hover:bg-secondary/50 transition-colors cursor-pointer group">
                    <Checkbox id={m} />
                    <Label htmlFor={m} className="flex-1 text-lg font-medium cursor-pointer">{m}</Label>
                    <ShoppingBag className="text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-headline font-bold">Brand Details</h2>
              <p className="text-muted-foreground">Tell us about your brand identity.</p>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Brand Name</Label>
                  <Input placeholder="e.g. CHIC ELAN" />
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer group"
                >
                   <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Upload size={24} />
                   </div>
                   <div className="text-center">
                    <p className="text-sm font-medium">Upload Brand Logo</p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended size: 500x500px (PNG/SVG)</p>
                   </div>
                   <Button variant="outline" size="sm" type="button">Browse Files</Button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-headline font-bold">Choose Goals</h2>
              <p className="text-muted-foreground">What do you want to achieve in the first 30 days?</p>
              <div className="grid grid-cols-2 gap-4">
                {['Increase Sales', 'Improve CTR', 'Higher Conversion', 'Listing Quality', 'Reduce ROAS', 'Catalog Cleanup'].map(g => (
                  <div key={g} className="p-4 rounded-xl border border-white/5 bg-secondary/20 hover:border-primary/50 transition-all cursor-pointer flex flex-col gap-2">
                    <Target className="text-primary" size={20} />
                    <span className="font-bold text-sm">{g}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
              <h2 className="text-3xl font-headline font-bold">Connect Tools</h2>
              <p className="text-muted-foreground">Link your preferred stacks for AI generation.</p>
              <div className="space-y-3">
                {['OpenAI (Copywriting)', 'DALL·E 3 (Photoshoots)', 'Meta Ads', 'Google Analytics'].map(t => (
                   <div key={t} className="flex items-center justify-between p-4 rounded-xl bg-secondary/30 border border-white/5">
                    <div className="flex items-center gap-3">
                      <Settings className="text-muted-foreground" size={18} />
                      <span className="font-medium">{t}</span>
                    </div>
                    <Button variant="outline" size="sm">Connect</Button>
                   </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 pt-6 border-t border-white/5 flex items-center justify-between">
            <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
              <ChevronLeft size={20} className="mr-2" /> Back
            </Button>
            <Button size="lg" className="rounded-full px-8" onClick={handleNext}>
              {step === 4 ? "Finish Setup" : "Continue"} <ChevronRight size={20} className="ml-2" />
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}