"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BrainCircuit, ArrowLeft, Zap, ShoppingBag, Sparkles, Check, ShoppingCart, X, TrendingUp, Globe } from "lucide-react";
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
  highlight?: string;
}

const PRICING_CATEGORIES: Category[] = [
  {
    title: "Onboarding",
    description: "Launch your brand on premium platforms with expert setup.",
    icon: ShoppingBag,
    items: [
      { id: "bundle-on", name: "Onboarding Bundle (5 Platforms)", price: 69999, priceDisplay: "₹69,999", period: "one-time" },
      { id: "myntra", name: "Myntra Onboarding", price: 29999, priceDisplay: "₹29,999", period: "one-time" },
      { id: "nykaa", name: "Nykaa Onboarding", price: 24999, priceDisplay: "₹24,999", period: "one-time" },
      { id: "ajio", name: "Ajio Onboarding", price: 19999, priceDisplay: "₹19,999", period: "one-time" },
      { id: "amazon", name: "Amazon Onboarding", price: 8999, priceDisplay: "₹8,999", period: "one-time" },
      { id: "flipkart", name: "Flipkart Onboarding", price: 8999, priceDisplay: "₹8,999", period: "one-time" },
    ]
  },
  {
    title: "AI & SEO Studio",
    description: "High-converting assets optimized by proprietary AI.",
    icon: Sparkles,
    highlight: "Bulk rates available",
    items: [
      { id: "listing", name: "Listing SEO Optimized", price: 39, priceDisplay: "₹39", period: "per SKU" },
      { id: "photoshoot", name: "AI Photoshoot (5 Images)", price: 199, priceDisplay: "₹199", period: "per SKU" },
      { id: "video", name: "AI UGC Ad Video", price: 1999, priceDisplay: "₹1,999", period: "per video" },
      { id: "reels-monthly", name: "AI Reels Monthly (8 reels)", price: 9999, priceDisplay: "₹9,999", period: "per month" },
      { id: "google-biz", name: "Google Business Setup", price: 4499, priceDisplay: "₹4,499", period: "one-time" },
      { id: "keyword", name: "AI Keyword Research", price: 999, priceDisplay: "₹999", period: "per audit" },
    ]
  },
  {
    title: "Growth & Development",
    description: "Scale your revenue with expert management and stores.",
    icon: TrendingUp,
    items: [
      { id: "meta-ads", name: "Meta/Google Ads Mgmt", price: 19999, priceDisplay: "₹19,999", period: "per month" },
      { id: "marketplace-ads", name: "Amazon/Flipkart Ads Mgmt", price: 21999, priceDisplay: "₹21,999", period: "per month" },
      { id: "multi-ads", name: "Multi-Platform Ads Mgmt", price: 39999, priceDisplay: "₹39,999", period: "per month" },
      { id: "static-web", name: "Basic Static Website", price: 15000, priceDisplay: "₹15,000", period: "3-5 pages" },
      { id: "shopify-starter", name: "Shopify Store Starter", price: 44999, priceDisplay: "₹44,999", period: "one-time" },
      { id: "ecom-ent", name: "Enterprise E-com Setup", price: 129999, priceDisplay: "₹1,29,999", period: "50+ SKUs" },
    ]
  }
];

const ONBOARDING_INDIVIDUAL_IDS = ['myntra', 'nykaa', 'ajio', 'amazon', 'flipkart'];
const ONBOARDING_BUNDLE_ID = 'bundle-on';

export default function PricingPage() {
  const [selectedServiceIds, setSelectedServiceIds] = useState<Set<string>>(new Set());
  const router = useRouter();

  const toggleService = (id: string) => {
    const newSelected = new Set(selectedServiceIds);
    
    if (id === ONBOARDING_BUNDLE_ID) {
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
        // Unselect individual onboarding options if bundle is chosen
        ONBOARDING_INDIVIDUAL_IDS.forEach(oid => newSelected.delete(oid));
      }
    } else {
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        // If selecting an individual onboarding option, unselect the bundle
        if (ONBOARDING_INDIVIDUAL_IDS.includes(id)) {
          newSelected.delete(ONBOARDING_BUNDLE_ID);
        }
        newSelected.add(id);
      }
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

  const isBundleSelected = selectedServiceIds.has(ONBOARDING_BUNDLE_ID);

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
              <Button className="rounded-full px-6">Start Free Trial</Button>
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
                <CardHeader className="p-8 relative">
                  {category.highlight && (
                    <div className="absolute top-4 right-4 animate-in fade-in zoom-in duration-500">
                      <Badge className="bg-primary text-primary-foreground text-[9px] font-bold py-1 px-2 rounded-lg border-none shadow-lg shadow-primary/20 whitespace-nowrap uppercase tracking-tighter">
                        {category.highlight}
                      </Badge>
                    </div>
                  )}
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6">
                    <category.icon size={24} />
                  </div>
                  <CardTitle className="font-headline text-2xl">{category.title}</CardTitle>
                  <CardContent className="px-0 pt-2">
                    <p className="text-muted-foreground text-sm leading-relaxed">{category.description}</p>
                  </CardContent>
                </CardHeader>
                <CardContent className="px-8 pb-8 space-y-4">
                  {category.items.map((item) => {
                    const isSelected = selectedServiceIds.has(item.id);
                    const isDisabled = isBundleSelected && ONBOARDING_INDIVIDUAL_IDS.includes(item.id);
                    
                    return (
                      <div 
                        key={item.id} 
                        className={cn(
                          "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                          isSelected ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-white/5 bg-white/5 hover:bg-white/10",
                          isDisabled && "opacity-40 cursor-not-allowed grayscale"
                        )}
                        onClick={() => !isDisabled && toggleService(item.id)}
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
