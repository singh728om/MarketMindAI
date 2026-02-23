"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  TrendingUp, 
  BarChart4, 
  Search, 
  Target, 
  ShieldCheck, 
  Zap, 
  History,
  ArrowUpRight,
  Filter,
  MapPin,
  ShoppingBag,
  Loader2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const INTELLIGENCE_MODULES = [
  { id: 1, title: "Keyword Research", icon: Search, value: "High Intent", baseScore: 88 },
  { id: 2, title: "Listing SEO Score", icon: ShieldCheck, value: "Optimization Needed", baseScore: 62 },
  { id: 3, title: "Brand Health", icon: Zap, value: "Excellent", baseScore: 94 },
  { id: 4, title: "Competitor Intel", icon: Target, value: "Market Leader", baseScore: 75 }
];

const MOCK_BENCHMARK = [
  { brand: "CHIC ELAN (You)", product: "Premium Silk Kurta", orders: 1240, share: "12%", status: "up", business: "fashion", category: "Ethnic" },
  { brand: "Ethnic Roots", product: "Designer Lehenga", orders: 2150, share: "24%", status: "down", business: "fashion", category: "Ethnic" },
  { brand: "Vibe Fashion", product: "Oversized Graphic Tee", orders: 1890, share: "18%", status: "up", business: "fashion", category: "T-shirt" },
  { brand: "Urban Threads", product: "Slim Fit Chinos", orders: 3200, share: "31%", status: "neutral", business: "fashion", category: "Casual" },
  { brand: "Fab India", product: "Cotton Chikankari", orders: 980, share: "15%", status: "up", business: "fashion", category: "Ethnic" },
  { brand: "ElectroMax", product: "Pro Wireless Buds", orders: 4500, share: "40%", status: "up", business: "electronics", category: "Headphone" },
  { brand: "TechNova", product: "4K DSLR Camera", orders: 800, share: "15%", status: "down", business: "electronics", category: "Camera" },
  { brand: "Mobility", product: "Flagship X12", orders: 6000, share: "35%", status: "up", business: "electronics", category: "Mobile" },
];

const BUSINESS_CATEGORIES: Record<string, string[]> = {
  fashion: ["Dress", "Clothes", "Ethnic", "T-shirt", "Casual"],
  electronics: ["Mobile", "Camera", "Headphone", "Laptop"],
  home: ["Furniture", "Decor", "Kitchen"]
};

export default function GrowthPage() {
  const [selectedBusiness, setSelectedBusiness] = useState("fashion");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterLocation, setFilterLocation] = useState("all");
  const [isCalculating, setIsCalculating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("42m ago");
  const [recalcSeed, setRecalcSeed] = useState(1);
  const [selectedRec, setSelectedRec] = useState<any>(null);
  const [hasMounted, setHasMounted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleBusinessChange = (val: string) => {
    setSelectedBusiness(val);
    setFilterCategory("all");
  };

  const handleReCalculate = () => {
    setIsCalculating(true);
    toast({
      title: "AI Analysis Started",
      description: `Analyzing ${filterLocation === 'all' ? 'National' : filterLocation.toUpperCase()} trends for ${filterCategory === 'all' ? selectedBusiness : filterCategory}...`,
    });

    setTimeout(() => {
      setIsCalculating(false);
      setRecalcSeed(prev => prev + 1);
      setLastUpdated("Just now");
      toast({
        title: "Calculation Complete",
        description: "Market share and growth recommendations have been updated.",
      });
    }, 2500);
  };

  const filteredData = useMemo(() => {
    return MOCK_BENCHMARK.filter(item => {
      if (item.business !== selectedBusiness) return false;
      if (filterCategory !== "all" && item.category !== filterCategory) return false;
      return true;
    }).map(item => ({
      ...item,
      orders: Math.round(item.orders * (1 + (Math.sin(recalcSeed + item.orders) * 0.05)))
    }));
  }, [selectedBusiness, filterCategory, recalcSeed]);

  const recommendations = [
    {
      id: "rec-1",
      category: "Pricing Strategy",
      title: "Dynamic Price Calibration",
      description: selectedBusiness === 'fashion' 
        ? `Competitors in ${filterLocation === 'all' ? 'India' : filterLocation} are pricing ${filterCategory === 'all' ? 'Ethnic Wear' : filterCategory} at ₹${1999 + (recalcSeed * 5)}. Adjusting your price could increase conversion by ${15 + (recalcSeed % 5)}%.`
        : `Based on current volume, a price drop of ₹${2000 - (recalcSeed * 10)} on your electronics flagship could capture ${12 + (recalcSeed % 8)}% more market share.`,
      impact: "High",
      roi: "18-24%",
      details: "Our AI detected a high volume of 'Added to Cart' events that aren't converting to sales due to a price gap of ₹300 compared to 'Ethnic Roots'.",
      action: "Implement a 10% coupon code for the next 48 hours specifically for users coming from Instagram Ads."
    },
    {
      id: "rec-2",
      category: "Inventory Alert",
      title: "Demand Spike Prediction",
      description: `High search intent for "Handcrafted ${filterCategory === 'all' ? (selectedBusiness === 'fashion' ? 'Fashion' : 'Tech') : filterCategory}" detected in ${filterLocation === 'all' ? 'Tier-1 Cities' : filterLocation}. Stock up for the upcoming spike.`,
      impact: "Medium",
      roi: "Loss Prevention",
      details: "Google Trends and Marketplace Search API show a 40% increase in queries for your category over the last 72 hours. Your current stock levels for Size M/L are critical.",
      action: "Restock 200 units of your top 3 SKUs to avoid 'Out of Stock' penalties on Myntra."
    },
    {
      id: "rec-3",
      category: "Ad Targeting",
      title: "Meta Reels Synergy",
      description: `Increase ad spend on Instagram Reels for the ${filterCategory === 'all' ? 'New Arrival' : filterCategory} collection in ${filterLocation === 'all' ? 'Top Metros' : filterLocation}.`,
      impact: "High",
      roi: "3.4x ROAS",
      details: "Your current CPC on Static Images is rising. However, competitor UGC ads are seeing a 2.5x higher engagement rate in your niche.",
      action: "Use the MarketMind AI UGC Ads Agent to generate 3 video assets and deploy with a ₹5,000/day test budget."
    },
    {
      id: "rec-4",
      category: "SEO Quality",
      title: "Semantic Keyword Gap",
      description: "You are currently ranking for broad terms but losing out on high-intent long-tail keywords used by Gen-Z shoppers.",
      impact: "Medium",
      roi: "12% Visibility Increase",
      details: "Competitors are using terms like 'Sustainable Chic' and 'Aesthetic Wear' which are currently trending on Pinterest and driving Amazon traffic.",
      action: "Update listing titles to include the top 3 terms found in the Ranking Keyword Finder agent."
    }
  ];

  const categories = BUSINESS_CATEGORIES[selectedBusiness] || [];

  if (!hasMounted) return <div className="flex items-center justify-center min-h-[60vh]"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">Growth Intelligence</h1>
          <p className="text-muted-foreground">Predictive analysis to outpace your competition.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="border-white/5 bg-slate-900 text-white"><History className="w-4 h-4 mr-2" /> History</Button>
          <Button 
            onClick={handleReCalculate} 
            disabled={isCalculating}
            className="shadow-lg shadow-primary/20 rounded-xl h-11 px-6 font-bold"
          >
            {isCalculating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating...</>
            ) : (
              <><Zap className="w-4 h-4 mr-2" /> AI Re-calculate</>
            )}
          </Button>
        </div>
      </div>

      <Card className="rounded-2xl border-white/5 bg-slate-900/50 backdrop-blur-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary mr-2">
            <Filter size={16} /> Filters:
          </div>
          
          <div className="w-48">
            <Select value={selectedBusiness} onValueChange={handleBusinessChange}>
              <SelectTrigger className="rounded-xl h-10 bg-slate-800 border-white/5 text-white">
                <SelectValue placeholder="Business" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 text-white">
                <SelectItem value="fashion">Fashion & Apparels</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="home">Home & Decor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="rounded-xl h-10 bg-slate-800 border-white/5 text-white">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 text-white">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select onValueChange={setFilterLocation} defaultValue="all">
              <SelectTrigger className="rounded-xl h-10 bg-slate-800 border-white/5 text-white">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-white/10 text-white">
                <SelectItem value="all">National (All India)</SelectItem>
                <SelectItem value="delhi">Delhi NCR</SelectItem>
                <SelectItem value="mumbai">Mumbai</SelectItem>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="gurgaon">Gurgaon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Badge variant="outline" className="ml-auto bg-primary/5 text-primary border-primary/20 px-3 py-1 flex items-center gap-1">
            <RefreshCw size={10} className={isCalculating ? "animate-spin" : ""} />
            Data updated {lastUpdated}
          </Badge>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {INTELLIGENCE_MODULES.map((module) => {
          const score = Math.min(100, Math.max(0, module.baseScore + (recalcSeed % 5) - 2));
          return (
            <Card key={module.id} className="rounded-2xl border-white/5 bg-slate-900 overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <module.icon size={20} />
                  </div>
                  <Badge variant={score > 80 ? "default" : "secondary"} className={score > 80 ? "bg-emerald-500" : ""}>{score}%</Badge>
                </div>
                <p className="text-sm text-slate-400 mb-1 font-medium">{module.title}</p>
                <h3 className="text-lg font-bold font-headline mb-4 text-white">{module.value}</h3>
                <Progress value={score} className="h-1.5 bg-slate-800" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border-white/5 bg-slate-900 overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <div>
              <CardTitle className="font-headline flex items-center gap-2 text-white">
                <BarChart4 size={20} className="text-primary" /> Competitor Benchmark
              </CardTitle>
              <CardDescription className="text-slate-400">
                Price, Product and Volume tracking for {filterLocation === 'all' ? 'All India' : filterLocation.toUpperCase()}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-xs font-bold text-slate-500 uppercase">Top Market Potential</span>
               <span className="text-sm font-bold text-primary">₹{(4.2 + (recalcSeed * 0.1)).toFixed(1)} Cr / Month</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-800/50 text-[10px] uppercase tracking-wider font-bold text-slate-500 border-b border-white/5">
                      <th className="px-6 py-4">Brand</th>
                      <th className="px-6 py-4">Trending Product</th>
                      <th className="px-6 py-4">Orders/Mo</th>
                      <th className="px-6 py-4">Market Share</th>
                      <th className="px-6 py-4 text-right">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredData.length > 0 ? filteredData.map((item, i) => (
                      <tr key={i} className="hover:bg-primary/5 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                             <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-[10px] font-bold text-white">
                               {i + 1}
                             </div>
                             <span className="font-bold text-sm text-slate-200">{item.brand}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-white">{item.product}</span>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">{item.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-bold text-slate-300">{item.orders.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-slate-300">{item.share}</span>
                            <Progress value={parseInt(item.share)} className="h-1 w-12 bg-slate-800" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`text-[10px] font-bold flex items-center justify-end ${
                            item.status === 'up' ? 'text-emerald-500' : item.status === 'down' ? 'text-rose-500' : 'text-slate-500'
                          }`}>
                             {item.status !== 'neutral' && <TrendingUp size={12} className="mr-1" />}
                             {item.status.toUpperCase()}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500 italic">
                          No competitor data found for this selection.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-primary/20 bg-primary/5 relative overflow-hidden flex flex-col">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <TrendingUp size={120} strokeWidth={1} />
          </div>
          <CardHeader>
            <CardTitle className="font-headline text-primary flex items-center gap-2">
              <Zap size={20} /> AI Recommendations
            </CardTitle>
            <CardDescription className="text-primary/70">Highest impact actions based on {filterCategory === 'all' ? (selectedBusiness.charAt(0).toUpperCase() + selectedBusiness.slice(1)) : filterCategory} trends.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 pt-4 flex-1">
            {recommendations.map((rec) => (
              <div 
                key={rec.id}
                onClick={() => setSelectedRec(rec)}
                className="p-4 rounded-xl bg-slate-900/80 border border-primary/10 group cursor-pointer hover:border-primary/50 hover:bg-slate-900 transition-all active:scale-[0.98]"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{rec.category}</span>
                  <Badge variant="outline" className="text-[8px] h-4 border-primary/30 text-primary">{rec.impact}</Badge>
                </div>
                <p className="text-sm font-bold text-white mb-1">{rec.title}</p>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{rec.description}</p>
                <div className="flex items-center gap-1 text-[10px] font-bold text-primary mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                  View Strategy <ArrowRight size={10} />
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-6 pt-0">
            <Button className="w-full rounded-xl bg-primary shadow-xl shadow-primary/20 h-12 font-bold" disabled={isCalculating}>
              {isCalculating ? <Loader2 className="animate-spin" /> : "Execute Growth Plan"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Recommendation Detail Dialog */}
      <Dialog open={!!selectedRec} onOpenChange={(open) => !open && setSelectedRec(null)}>
        <DialogContent className="max-w-xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden p-0 text-white shadow-2xl">
          {selectedRec && (
            <>
              <DialogHeader className="p-8 bg-primary text-primary-foreground">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm shadow-inner">
                    <Zap size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">{selectedRec.category}</span>
                    <DialogTitle className="text-2xl md:text-3xl font-headline font-bold">{selectedRec.title}</DialogTitle>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm px-3 py-1">
                    Impact: {selectedRec.impact}
                  </Badge>
                  <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/20 backdrop-blur-sm px-3 py-1">
                    Est. ROI: {selectedRec.roi}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <AlertCircle size={14} className="text-primary" /> Intelligence Context
                  </h4>
                  <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/50 p-4 rounded-2xl border border-white/5">
                    {selectedRec.details}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" /> Strategic Action Items
                  </h4>
                  <div className="p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-4">
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">1</div>
                      <p className="text-sm font-medium text-slate-200">{selectedRec.action}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">2</div>
                      <p className="text-sm font-medium text-slate-200">Monitor click-through metrics for the first 24 hours.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl flex items-start gap-3">
                  <ArrowUpRight size={20} className="text-amber-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed italic">
                    Note: This recommendation is generated based on recent competitor shifts in the {selectedBusiness} category for {filterLocation === 'all' ? 'National' : filterLocation} regions.
                  </p>
                </div>
              </div>

              <DialogFooter className="p-6 bg-slate-800/50 border-t border-white/5 flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl border-white/10 text-white" onClick={() => setSelectedRec(null)}>Close Briefing</Button>
                <Button className="flex-1 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/20">
                  Execute Recommendation
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
