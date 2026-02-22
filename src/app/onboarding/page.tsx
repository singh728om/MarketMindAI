"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  ShoppingBag, 
  Upload, 
  Target, 
  ChevronRight, 
  ChevronLeft,
  CheckCircle2,
  BrainCircuit,
  Sparkles,
  Rocket
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const STEPS = ["Marketplaces", "Brand Details", "Growth Goals", "Get Started"];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedMarketplaces, setSelectedMarketplaces] = useState<string[]>([]);
  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
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

  const toggleMarketplace = (m: string) => {
    setSelectedMarketplaces(prev => 
      prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]
    );
  };

  const toggleGoal = (g: string) => {
    setSelectedGoals(prev => 
      prev.includes(g) ? prev.filter(item => item !== g) : [...prev, g]
    );
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
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                step > i + 1 ? 'bg-primary border-primary text-white' : 
                step === i + 1 ? 'border-primary text-primary bg-primary/10 scale-110 shadow-lg shadow-primary/20' : 
                'border-muted text-muted-foreground bg-secondary'
              )}>
                {step > i + 1 ? <CheckCircle2 size={20} /> : i + 1}
              </div>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-widest",
                step === i + 1 ? 'text-primary' : 'text-muted-foreground'
              )}>{s}</span>
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
                  <div 
                    key={m} 
                    onClick={() => toggleMarketplace(m)}
                    className={cn(
                      "flex items-center space-x-4 p-4 rounded-xl border transition-colors cursor-pointer group",
                      selectedMarketplaces.includes(m) ? "border-primary bg-primary/5" : "border-white/5 hover:bg-secondary/50"
                    )}
                  >
                    <Checkbox id={m} checked={selectedMarketplaces.includes(m)} onCheckedChange={() => toggleMarketplace(m)} />
                    <Label htmlFor={m} className="flex-1 text-lg font-medium cursor-pointer">{m}</Label>
                    <ShoppingBag className={cn(
                      "transition-colors",
                      selectedMarketplaces.includes(m) ? "text-primary" : "text-muted-foreground group-hover:text-primary"
                    )} />
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
                {['Increase Sales', 'AI Photoshoot', 'Higher Conversion', 'Listing Quality', 'Reduce ROAS', 'Onboarding E-com platform'].map(g => {
                  const isSelected = selectedGoals.includes(g);
                  return (
                    <div 
                      key={g} 
                      onClick={() => toggleGoal(g)}
                      className={cn(
                        "p-4 rounded-xl border transition-all cursor-pointer flex flex-col gap-2",
                        isSelected 
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10" 
                          : "border-white/5 bg-secondary/20 hover:border-primary/50"
                      )}
                    >
                      <Target className={cn(isSelected ? "text-primary" : "text-muted-foreground")} size={20} />
                      <span className={cn("font-bold text-sm", isSelected ? "text-primary" : "")}>{g}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 py-12 text-center">
              <div className="mx-auto w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
                <Rocket size={48} />
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-headline font-bold tracking-tight">Let's get started!</h2>
                <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
                  Your personalized AI-driven growth journey begins now. We've prepared everything based on your brand and goals.
                </p>
              </div>
              <div className="flex items-center justify-center gap-2 text-primary font-bold">
                <Sparkles size={18} />
                <span>Ready to scale your marketplace presence</span>
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
