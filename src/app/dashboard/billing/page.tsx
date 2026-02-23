"use client";

import { useState, useMemo, useEffect } from "react";
import { 
  CreditCard, 
  Download, 
  Plus, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Zap, 
  ArrowUpRight,
  ShieldCheck,
  ReceiptText,
  FileText,
  Printer,
  Share2,
  X
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

// Price mapping for fallback calculation if metadata is missing
const PRICE_MAP: Record<string, number> = {
  "Myntra Onboarding": 14999,
  "Amazon Onboarding": 4999,
  "Flipkart Onboarding": 4999,
  "Ajio Onboarding": 14999,
  "Nykaa Onboarding": 14999,
  "Listing Creation": 1999,
  "Listing Optimization": 1999,
  "Keyword Research": 999,
  "AI Photoshoot": 999,
  "AI Video Ad (15s)": 1499,
  "Website Store Builder": 11999,
  "Shopify Store": 14999,
  "AI CEO & Strategist": 24999,
  "AI Social Media Manager": 9999,
  "AI Listing Architect": 7999,
  "AI Customer Success Lead": 5999,
  "AI Creative Director": 12999
};

export default function BillingPage() {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    setHasMounted(true);
    const loadProjects = () => {
      try {
        const saved = localStorage.getItem("marketmind_projects");
        if (saved) setProjects(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    };
    loadProjects();
    window.addEventListener('storage', loadProjects);
    return () => window.removeEventListener('storage', loadProjects);
  }, []);

  // Filter for billable services (exclude Canceled)
  const activeProjects = useMemo(() => {
    return projects.filter(p => p.status !== 'Canceled');
  }, [projects]);

  const billingSummary = useMemo(() => {
    return activeProjects.map(p => {
      // Get price from project metadata or fallback to PRICE_MAP
      const price = Number(p.price) || PRICE_MAP[p.name] || 0;
      return {
        name: p.name,
        price: price,
        type: p.type || "Service",
        date: p.updatedAt || "Activated",
        status: p.status
      };
    });
  }, [activeProjects]);

  const totalInvestment = useMemo(() => {
    return billingSummary.reduce((sum, s) => sum + s.price, 0);
  }, [billingSummary]);

  const currentPlan = useMemo(() => {
    if (activeProjects.length === 0) return { 
      name: "Free Trial", 
      badge: "Trial Tier", 
      color: "bg-primary", 
      desc: "You have 7 days remaining in your high-performance agency trial." 
    };
    
    if (totalInvestment >= 50000) return { 
      name: "Enterprise Plan", 
      badge: "Enterprise", 
      color: "bg-indigo-500", 
      desc: "Exclusive node capacity and dedicated strategic consultants." 
    };

    if (totalInvestment >= 10000) return { 
      name: "Pro Plan", 
      badge: "Professional", 
      color: "bg-amber-500", 
      desc: "Unlimited AI orchestration and dedicated priority node access." 
    };

    return { 
      name: "Plus Plan", 
      badge: "Accelerated", 
      color: "bg-emerald-500", 
      desc: "Core agency services active with enhanced growth intelligence." 
    };
  }, [activeProjects, totalInvestment]);

  const gst = Math.round(totalInvestment * 0.18);
  const grandTotal = totalInvestment + gst;

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice ${id} is being generated and will download shortly.`,
    });
  };

  if (!hasMounted) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your marketplace investment and premium subscriptions.</p>
        </div>
        <Link href="/pricing" asChild>
          <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20 font-bold">
            <Plus className="w-4 h-4 mr-2" /> Add New Service
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Plan Card */}
        <Card className={cn(
          "rounded-3xl border-primary/20 relative overflow-hidden lg:col-span-1",
          currentPlan.name === 'Enterprise Plan' ? "bg-indigo-500/5 border-indigo-500/20" :
          currentPlan.name === 'Pro Plan' ? "bg-amber-500/5 border-amber-500/20" : 
          currentPlan.name === 'Plus Plan' ? "bg-emerald-500/5 border-emerald-500/20" : 
          "bg-primary/5 border-primary/20"
        )}>
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={120} strokeWidth={1} className={currentPlan.color.replace('bg-', 'text-')} />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={cn("text-white border-none", currentPlan.color)}>{currentPlan.badge}</Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Current Status</span>
            </div>
            <CardTitle className="text-2xl font-headline font-bold">{currentPlan.name}</CardTitle>
            <CardDescription className="max-w-xs">{currentPlan.desc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">Usage Logic</span>
                <span className="text-primary">{activeProjects.length > 0 ? 'Account Active' : 'Initial Tier'}</span>
              </div>
              <Progress value={activeProjects.length > 0 ? 100 : 24} className="h-2" />
              <p className="text-[10px] text-muted-foreground">{activeProjects.length} active agency enrollments</p>
            </div>
            
            <div className="space-y-3 pt-4">
               <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                 <ShieldCheck size={14} /> Tier Benefits
               </p>
               <ul className="text-xs space-y-2 text-muted-foreground">
                 <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Multi-Marketplace Fulfillment</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> AI Agent Priority Scheduling</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Brand Vault Cloud Storage</li>
               </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/pricing" className="w-full" asChild>
              <Button className={cn(
                "w-full h-12 rounded-xl font-bold shadow-xl",
                currentPlan.name === 'Enterprise Plan' ? "bg-indigo-500 hover:bg-indigo-600 text-white shadow-indigo-500/20" :
                currentPlan.name === 'Pro Plan' ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20" : 
                "bg-primary shadow-primary/20"
              )}>
                {currentPlan.name === 'Enterprise Plan' || currentPlan.name === 'Pro Plan' ? "Manage Enterprise Terms" : "Manage Subscription"}
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Selected Services / Billing Summary */}
        <Card className="lg:col-span-2 rounded-3xl border-white/5 bg-card overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 bg-muted/20">
            <CardTitle className="font-headline flex items-center gap-2">
              <ReceiptText size={20} className="text-primary" /> Service Billing Ledger
            </CardTitle>
            <CardDescription>Real-time audit of your active marketplace service investments.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-left min-w-[600px]">
                 <thead>
                   <tr className="bg-muted/30 text-[10px] uppercase tracking-wider font-bold text-muted-foreground border-b border-white/5">
                     <th className="px-8 py-4">Service Description</th>
                     <th className="px-8 py-4">Category</th>
                     <th className="px-8 py-4 text-right">Amount</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {billingSummary.length > 0 ? billingSummary.map((service, i) => (
                     <tr key={i} className="group hover:bg-primary/5 transition-colors">
                       <td className="px-8 py-5">
                         <div className="flex flex-col">
                           <span className="font-bold text-sm text-white">{service.name}</span>
                           <div className="flex items-center gap-2">
                             <span className="text-[10px] text-muted-foreground">Activated {service.date}</span>
                             <Badge variant="outline" className="text-[8px] border-none bg-primary/10 text-primary py-0 h-3">{service.status}</Badge>
                           </div>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <Badge variant="secondary" className="text-[10px] uppercase">{service.type}</Badge>
                       </td>
                       <td className="px-8 py-5 text-right font-mono font-bold text-sm text-white">
                         ₹{service.price.toLocaleString()}
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={3} className="px-8 py-20 text-center text-slate-500 italic text-sm">
                         No active billed services. Your account is currently in the introductory trial phase.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </CardContent>
          <CardFooter className="bg-primary/5 p-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Investment (Subtotal)</p>
              <h3 className="text-3xl font-headline font-bold text-primary">₹{totalInvestment.toLocaleString()}</h3>
            </div>
            <Button variant="outline" className="rounded-xl h-12 px-8 w-full sm:w-auto font-bold border-white/10 hover:bg-white/5" onClick={() => setIsInvoiceOpen(true)}>
              View Final Bill
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Invoice History Detail Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="max-w-lg bg-slate-950 border-white/10 rounded-[2.5rem] overflow-hidden p-0 text-white shadow-2xl">
          <DialogHeader className="p-8 bg-primary text-primary-foreground relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <FileText size={140} strokeWidth={1} />
            </div>
            <div className="flex justify-between items-start relative z-10">
              <div className="space-y-1">
                <DialogTitle className="text-2xl font-headline font-bold flex items-center gap-2">
                  <ReceiptText size={24} /> Pro-forma Statement
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/70 text-xs font-bold uppercase tracking-widest">
                  MarketMind AI Agency • {currentPlan.name}
                </DialogDescription>
              </div>
              <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-md px-3 py-1 font-bold text-[9px]">
                {currentPlan.name === 'Free Trial' ? 'TRIAL OFFSET' : 'PAYMENT DUE'}
              </Badge>
            </div>
          </DialogHeader>

          <div className="p-6 md:p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center px-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">
                <span>Enrolled Services</span>
                <span>Amount</span>
              </div>
              <ScrollArea className="max-h-[280px] pr-2">
                <div className="space-y-3">
                  {billingSummary.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/5 group hover:border-primary/30 transition-colors">
                      <div className="flex flex-col gap-1 min-w-0 pr-4">
                        <span className="font-bold text-sm truncate text-white">{item.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] text-slate-500 font-bold uppercase">{item.type}</span>
                          <div className="w-1 h-1 rounded-full bg-slate-700" />
                          <span className="text-[9px] text-slate-500">{item.date}</span>
                        </div>
                      </div>
                      <span className="font-mono font-bold text-sm shrink-0 text-white">₹{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                  {billingSummary.length === 0 && (
                    <div className="text-center py-12 bg-secondary/10 rounded-[2rem] border border-dashed border-white/10">
                      <p className="text-xs text-slate-500 font-medium">No active billable line items detected.</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>

            <div className="space-y-3 pt-6 border-t border-white/5">
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 px-2">
                <span>Subtotal</span>
                <span className="font-mono text-white">₹{totalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400 px-2">
                <span>GST (18%)</span>
                <span className="font-mono text-white">₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-white/10 px-2">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-primary">Final Bill</span>
                  <p className="text-[9px] text-slate-500 font-bold italic">Inclusive of all AI node compute</p>
                </div>
                <span className="text-3xl font-headline font-bold text-primary">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
              <Clock size={18} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Fulfillment Notice</p>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Statement generated dynamically based on real-time marketplace sync. Payment includes 24/7 priority node access and human expert audit.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-slate-900 border-t border-white/5 flex gap-3 flex-col sm:flex-row">
            <Button variant="ghost" className="flex-1 rounded-xl text-slate-400 hover:text-white" onClick={() => setIsInvoiceOpen(false)}>
              Close
            </Button>
            <Button className="flex-1 rounded-xl bg-primary shadow-xl shadow-primary/20 font-bold" onClick={() => handleDownloadInvoice('MND-INV-' + Date.now().toString().slice(-4))}>
              <Printer size={16} className="mr-2" /> Download PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
