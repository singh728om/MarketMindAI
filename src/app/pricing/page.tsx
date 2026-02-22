"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, ArrowLeft, Zap, ShoppingBag, Sparkles, Check, ShoppingCart, X } from "lucide-react";
import { cn } from "@/lib/utils";
import LinkNext from "next/link";

interface ServiceItem {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  period: string;
}

interface Category {
  title: string;
  description: string;
  icon: any;
  items: ServiceItem[];
}

const PRICING_CATEGORIES: Category[] = [
  {
    title: "Marketplace Onboarding",
    description: "Launch your brand on premium platforms with expert setup.",
    icon: ShoppingBag,
    items: [
      { id: "myntra", name: "Myntra Onboarding", price: 14999, priceDisplay: "₹14,999", period: "one-time" },
      { id: "nykaa", name: "Nykaa Onboarding", price: 14999, priceDisplay: "₹14,999", period: "one-time" },
      { id: "amazon", name: "Amazon Setup", price: 4999, priceDisplay: "₹4,999", period: "one-time" },
      { id: "flipkart", name: "Flipkart Setup", price: 4999, priceDisplay: "₹4,999", period: "one-time" },
    ]
  },
  {
    title: "Content & SEO",
    description: "High-converting listings optimized for discovery.",
    icon: Zap,
    items: [
      { id: "listing", name: "Listing Creation & Optimization", price: 1999, priceDisplay: "₹1,999", period: "Starting from" },
      { id: "keyword", name: "AI-Based Ranking Keyword Research", price: 999, priceDisplay: "₹999", period: "per audit" },
      { id: "suggestions", name: "AI Listing Improvement Suggestions", price: 999, priceDisplay: "₹999", period: "per listing" },
      { id: "competitor", name: "Competitor Analysis & Market Positioning", price: 999, priceDisplay: "₹999", period: "per report" },
    ]
  },
  {
    title: "AI Creative Studio",
    description: "Next-gen visual assets powered by proprietary AI.",
    icon: Sparkles,
    items: [
      { id: "photoshoot", name: "AI Photoshoot", price: 100, priceDisplay: "₹100", period: "per style" },
      { id: "video", name: "AI Video Ad (15s)", price: 499, priceDisplay: "₹499", period: "per video" },
      { id: "ethnic", name: "Ethnic Model Fit", price: 150, priceDisplay: "₹150", period: "per style" },
    ]
  }
];

export default function PricingPage() {
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleService = (id: string) => {
    const newSelected = new Set(selectedServiceIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedServiceIds(newSelected);
  };

  const selectedServices = useMemo(() => {
    return PRICING_CATEGORIES.flatMap(cat => cat.items).filter(item => selectedServiceIds.has(item.id));
  }, [selectedServiceIds]);

  const totalPrice = useMemo(() => {
    return selectedServices.reduce((sum, item) => sum + item.price, 0);
  }, [selectedServices]);

  const handleCheckout = () => {
    if (selectedServices.length === 0) return;
    const itemNames = selectedServices.map(s => s.name).join("|");
    router.push(`/checkout?items=${encodeURIComponent(itemNames)}&total=${totalPrice}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <LinkNext href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="text-primary w-8 h-8" />
            <span className="font-headline font-bold text-xl tracking-tight">MarketMind AI</span>
          </LinkNext>
          <div className="flex items-center gap-4">
            <LinkNext href="/">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </LinkNext>
            <LinkNext href="/onboarding">
              <Button className="rounded-full px-6">Start Free Audit</Button>
            </LinkNext>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-32">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Select Your Services
            </h1>
            <p className="text-muted-foreground text-lg">
              Customize your growth plan. Choose one or more AI agents and expert onboarding services to build your custom package.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_CATEGORIES.map((category) => (
              <Card 
                key={category.title} 
                className="rounded-3xl border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col hover:border-white/20 transition-all duration-300 shadow-xl"
              >
                <CardHeader className="p-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <category.icon size={24} />
                  </div>
                  <CardTitle className="font-headline text-2xl">{category.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-4">
                  {category.items.map((item) => {
                    const isSelected = selectedServiceIds.has(item.id);
                    return (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                          isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-white/5 bg-white/5 hover:bg-white/10"
                        )}
                        onClick={() => toggleService(item.id)}
                      >
                        <div className="space-y-1 pr-4">
                          <p className="font-bold text-sm leading-tight">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                            {item.priceDisplay} • {item.period}
                          </p>
                        </div>
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center transition-all shrink-0",
                          isSelected ? "bg-primary text-white" : "bg-white/10 text-muted-foreground group-hover:bg-white/20"
                        )}>
                          {isSelected ? <Check size={16} /> : <ShoppingCart size={14} />}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Sticky Checkout Bar */}
          {selectedServiceIds.size > 0 && (
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4 animate-in slide-in-from-bottom-10 fade-in duration-500 z-50">
              <div className="bg-primary p-6 rounded-3xl shadow-2xl shadow-primary/40 flex items-center justify-between border border-white/20 backdrop-blur-md">
                <div className="text-white">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-80">{selectedServiceIds.size} Services Selected</p>
                  <h3 className="text-2xl font-headline font-bold">Total: ₹{totalPrice.toLocaleString()}</h3>
                </div>
                <div className="flex gap-2">
                   <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white hover:bg-white/10 rounded-xl"
                    onClick={() => setSelectedServiceIds(new Set())}
                   >
                    <X size={20} />
                   </Button>
                   <Button 
                    onClick={handleCheckout} 
                    className="bg-white text-primary hover:bg-white/90 rounded-2xl px-8 font-bold h-12"
                   >
                    Proceed to Checkout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
