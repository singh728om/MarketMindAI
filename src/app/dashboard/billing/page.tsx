
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
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
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

  const billingSummary = useMemo(() => {
    return projects.map(p => ({
      name: p.name,
      price: Number(p.price) || 0,
      type: p.type || "Service",
      date: p.updatedAt || "Activated"
    }));
  }, [projects]);

  const totalInvestment = useMemo(() => {
    return billingSummary.reduce((sum, s) => sum + s.price, 0);
  }, [billingSummary]);

  const currentPlan = useMemo(() => {
    if (projects.length === 0) return { name: "Free Trial", badge: "Trial Tier", color: "bg-primary", desc: "You have 7 days remaining in your high-performance agency trial." };
    const hasHighValue = projects.some(p => (Number(p.price) || 0) >= 10000);
    if (hasHighValue) return { name: "Pro Plan", badge: "Professional", color: "bg-amber-500", desc: "Unlimited AI orchestration and dedicated priority node access." };
    return { name: "Plus Plan", badge: "Accelerated", color: "bg-emerald-500", desc: "Core agency services active with enhanced growth intelligence." };
  }, [projects]);

  const gst = Math.round(totalInvestment * 0.18);
  const grandTotal = totalInvestment + gst;

  const handleDownloadInvoice = (id: string) => {
    toast({
      title: "Downloading Invoice",
      description: `Invoice ${id} is being generated and will download shortly.`,
    });
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Billing & Plans</h1>
          <p className="text-muted-foreground">Manage your marketplace investment and premium subscriptions.</p>
        </div>
        <Link href="/pricing">
          <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Add New Service
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Active Plan Card */}
        <Card className={cn(
          "rounded-3xl border-primary/20 relative overflow-hidden lg:col-span-1",
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
                <span className="text-primary">{projects.length > 0 ? 'Account Active' : 'Initial Tier'}</span>
              </div>
              <Progress value={projects.length > 0 ? 100 : 24} className="h-2" />
              <p className="text-[10px] text-muted-foreground">{projects.length} active agency enrollments</p>
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
            <Link href="/pricing" className="w-full">
              <Button className={cn(
                "w-full h-12 rounded-xl font-bold shadow-xl",
                currentPlan.name === 'Pro Plan' ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20" : 
                "bg-primary shadow-primary/20"
              )}>
                {currentPlan.name === 'Pro Plan' ? "Manage Enterprise Terms" : "Manage Subscription"}
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
            <CardDescription>Real-time audit of your marketplace service investments.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 p-0">
             <div className="overflow-x-auto">
               <table className="w-full text-left">
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
                           <span className="font-bold text-sm">{service.name}</span>
                           <span className="text-[10px] text-muted-foreground">Activated {service.date}</span>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <Badge variant="secondary" className="text-[10px]">{service.type}</Badge>
                       </td>
                       <td className="px-8 py-5 text-right font-mono font-bold text-sm">
                         ₹{service.price.toLocaleString()}
                       </td>
                     </tr>
                   )) : (
                     <tr>
                       <td colSpan={3} className="px-8 py-20 text-center text-slate-500 italic text-sm">
                         No billed services yet. Your 7-day trial is currently offset by our promotional grant.
                       </td>
                     </tr>
                   )}
                 </tbody>
               </table>
             </div>
          </CardContent>
          <CardFooter className="bg-primary/5 p-8 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Consolidated Investment</p>
              <h3 className="text-3xl font-headline font-bold text-primary">₹{totalInvestment.toLocaleString()}</h3>
            </div>
            <Button variant="outline" className="rounded-xl h-12 px-6" onClick={() => setIsInvoiceOpen(true)}>
              View Detailed Invoice
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Invoice History Detail Dialog */}
      <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
        <DialogContent className="max-w-2xl bg-card border-white/10 rounded-3xl overflow-hidden p-0">
          <DialogHeader className="p-8 bg-primary text-primary-foreground">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <DialogTitle className="text-3xl font-headline font-bold flex items-center gap-2">
                  <FileText size={28} /> Pro-forma Statement
                </DialogTitle>
                <DialogDescription className="text-primary-foreground/70">
                  MarketMind Agency Billing • {currentPlan.name}
                </DialogDescription>
              </div>
              <Badge className="bg-white/20 text-white border-white/20 backdrop-blur-sm px-3 py-1">
                {currentPlan.name === 'Free Trial' ? 'TRIAL OFFSET' : 'ACTIVE PLAN'}
              </Badge>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-8">
            <div className="space-y-4">
              <div className="grid grid-cols-4 gap-4 px-2 text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                <span className="col-span-2">Service Description</span>
                <span className="text-center">Category</span>
                <span className="text-right">Amount</span>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                {billingSummary.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 p-4 rounded-xl bg-secondary/20 border border-white/5 text-sm items-center">
                    <div className="col-span-2 flex flex-col">
                      <span className="font-bold">{item.name}</span>
                      <span className="text-[10px] text-muted-foreground">{item.date}</span>
                    </div>
                    <div className="flex justify-center">
                      <Badge variant="secondary" className="text-[9px] h-4">{item.type}</Badge>
                    </div>
                    <span className="text-right font-mono font-bold">₹{item.price.toLocaleString()}</span>
                  </div>
                ))}
                {billingSummary.length === 0 && (
                  <div className="text-center py-10 bg-secondary/10 rounded-2xl border border-dashed border-white/5">
                    <p className="text-xs text-slate-500">No active billable line items.</p>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-mono">₹{totalInvestment.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span className="font-mono">₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-xl pt-4 border-t border-white/5">
                <span className="text-primary font-headline">Total Pay</span>
                <span className="text-primary font-mono">₹{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl flex items-start gap-3">
              <Clock size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-amber-500">
                  {currentPlan.name === 'Free Trial' ? "Payment Status: Free Tier Offset" : "Plan Activation: Verified"}
                </p>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  Your current {currentPlan.name} status was automatically calculated based on your marketplace activity and engagement value.
                </p>
              </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/20 border-t flex gap-2">
            <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsInvoiceOpen(false)}>
              Close
            </Button>
            <Button className="flex-1 rounded-xl shadow-lg shadow-primary/20" onClick={() => handleDownloadInvoice('MND-LATEST')}>
              <Printer size={16} className="mr-2" /> Download Statement
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
