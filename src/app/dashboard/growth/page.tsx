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
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

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

    // Simulate AI Processing
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
      // Slightly vary orders based on seed to show "recalculation"
      orders: Math.round(item.orders * (1 + (Math.sin(recalcSeed + item.orders) * 0.05)))
    }));
  }, [selectedBusiness, filterCategory, recalcSeed]);

  const categories = BUSINESS_CATEGORIES[selectedBusiness] || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Growth Intelligence</h1>
          <p className="text-muted-foreground">Predictive analysis to outpace your competition.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline"><History className="w-4 h-4 mr-2" /> History</Button>
          <Button 
            onClick={handleReCalculate} 
            disabled={isCalculating}
            className="shadow-lg shadow-primary/20"
          >
            {isCalculating ? (
              <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Calculating...</>
            ) : (
              <><Zap className="w-4 h-4 mr-2" /> AI Re-calculate</>
            )}
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      <Card className="rounded-2xl border-white/5 bg-card/50 backdrop-blur-sm p-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 text-sm font-bold text-primary mr-2">
            <Filter size={16} /> Filters:
          </div>
          
          <div className="w-48">
            <Select value={selectedBusiness} onValueChange={handleBusinessChange}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Business" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fashion">Fashion & Apparels</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="home">Home & Decor</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-48">
            <Select onValueChange={setFilterLocation} defaultValue="all">
              <SelectTrigger className="rounded-xl h-10">
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
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
            <Card key={module.id} className="rounded-2xl border-white/5 bg-card overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                    <module.icon size={20} />
                  </div>
                  <Badge variant={score > 80 ? "default" : "secondary"}>{score}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1 font-medium">{module.title}</p>
                <h3 className="text-lg font-bold font-headline mb-4">{module.value}</h3>
                <Progress value={score} className="h-1.5" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border-white/5 bg-card overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
            <div>
              <CardTitle className="font-headline flex items-center gap-2">
                <BarChart4 size={20} className="text-primary" /> Competitor Benchmark
              </CardTitle>
              <CardDescription>
                Price, Product and Volume tracking for {filterLocation === 'all' ? 'All India' : filterLocation.toUpperCase()}
              </CardDescription>
            </div>
            <div className="flex flex-col items-end">
               <span className="text-xs font-bold text-muted-foreground uppercase">Top Market Potential</span>
               <span className="text-sm font-bold text-primary">₹{(4.2 + (recalcSeed * 0.1)).toFixed(1)} Cr / Month</span>
            </div>
          </CardHeader>
          <CardContent className="p-0">
             <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-white/5">
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
                             <div className="w-6 h-6 rounded bg-muted flex items-center justify-center text-[10px] font-bold">
                               {i + 1}
                             </div>
                             <span className="font-bold text-sm">{item.brand}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium">{item.product}</span>
                            <span className="text-[10px] text-primary font-bold uppercase tracking-tighter">{item.category}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm font-mono font-bold">{item.orders.toLocaleString()}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm">{item.share}</span>
                            <Progress value={parseInt(item.share)} className="h-1 w-12" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className={`text-[10px] font-bold flex items-center justify-end ${
                            item.status === 'up' ? 'text-emerald-500' : item.status === 'down' ? 'text-rose-500' : 'text-muted-foreground'
                          }`}>
                             {item.status !== 'neutral' && <TrendingUp size={12} className="mr-1" />}
                             {item.status.toUpperCase()}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground italic">
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
            <div className="p-4 rounded-xl bg-background/50 border border-primary/10 group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-primary uppercase">Pricing Strategy</span>
                <ArrowUpRight size={14} className="text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium leading-snug">
                {selectedBusiness === 'fashion' 
                  ? `Competitors in ${filterLocation === 'all' ? 'India' : filterLocation} are pricing ${filterCategory === 'all' ? 'Ethnic Wear' : filterCategory} at ₹${1999 + (recalcSeed * 5)}. Adjusting your price could increase conversion by ${15 + (recalcSeed % 5)}%.`
                  : `Based on current volume, a price drop of ₹${2000 - (recalcSeed * 10)} on your electronics flagship could capture ${12 + (recalcSeed % 8)}% more market share.`}
              </p>
            </div>
            
            <div className="p-4 rounded-xl bg-background/50 border border-primary/10 group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-primary uppercase">Inventory Alert</span>
                <ArrowUpRight size={14} className="text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium leading-snug">High search intent for "Handcrafted {filterCategory === 'all' ? (selectedBusiness === 'fashion' ? 'Fashion' : 'Tech') : filterCategory}" detected in {filterLocation === 'all' ? 'Tier-1 Cities' : filterLocation}. Stock up for the upcoming spike.</p>
            </div>

            <div className="p-4 rounded-xl bg-background/50 border border-primary/10 group cursor-pointer hover:border-primary/50 transition-colors">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-primary uppercase">Ad Targeting</span>
                <ArrowUpRight size={14} className="text-primary/50 group-hover:text-primary transition-colors" />
              </div>
              <p className="text-sm font-medium leading-snug">Increase ad spend on Instagram Reels for the {filterCategory === 'all' ? 'New Arrival' : filterCategory} collection in {filterLocation === 'all' ? 'Top Metros' : filterLocation}.</p>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
            <Button className="w-full rounded-xl bg-primary shadow-xl shadow-primary/20 h-12 font-bold" disabled={isCalculating}>
              {isCalculating ? <Loader2 className="animate-spin" /> : "Execute Growth Plan"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}