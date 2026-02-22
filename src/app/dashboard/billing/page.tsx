"use client";

import { useState, useMemo } from "react";
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
  ReceiptText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import Link from "next/link";

// Prices from pricing/page.tsx
const SERVICE_PRICES: Record<string, number> = {
  "Myntra Onboarding": 14999,
  "Amazon Onboarding": 4999,
  "Flipkart Onboarding": 4999,
  "Ajio Onboarding": 14999,
  "Nykaa Onboarding": 14999,
  "Listing Creation": 1999,
  "Listing Optimization": 1999,
  "AI Photoshoot": 999,
  "AI Video Ad (15s)": 1499,
  "Website Store Builder": 11999,
  "Shopify Store": 14999,
};

const INITIAL_PROJECTS = [
  { id: "proj-1", name: "Myntra Onboarding", type: "Onboarding", status: "In Progress" },
  { id: "proj-listing-1", name: "Listing Creation", type: "SEO", status: "Drafting" }
];

const MOCK_INVOICES = [
  { id: "INV-001", date: "Oct 12, 2023", amount: "₹14,999", status: "Paid" },
  { id: "INV-002", date: "Nov 05, 2023", amount: "₹1,999", status: "Paid" },
  { id: "INV-003", date: "Dec 01, 2023", amount: "₹4,999", status: "Pending" },
];

export default function BillingPage() {
  const { toast } = useToast();
  
  const billingSummary = useMemo(() => {
    return INITIAL_PROJECTS.map(p => ({
      name: p.name,
      price: SERVICE_PRICES[p.name] || 0,
      type: p.type
    }));
  }, []);

  const totalInvestment = useMemo(() => {
    return billingSummary.reduce((sum, s) => sum + s.price, 0);
  }, [billingSummary]);

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
        <Card className="rounded-3xl border-primary/20 bg-primary/5 relative overflow-hidden lg:col-span-1">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Zap size={120} strokeWidth={1} />
          </div>
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-primary text-white">Trial Tier</Badge>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Active Experience</span>
            </div>
            <CardTitle className="text-2xl font-headline font-bold">Free Trial</CardTitle>
            <CardDescription className="max-w-xs">You have 7 days remaining in your high-performance agency trial.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-muted-foreground uppercase tracking-widest">Usage Limit</span>
                <span className="text-primary">24%</span>
              </div>
              <Progress value={24} className="h-2" />
              <p className="text-[10px] text-muted-foreground">12/50 AI production credits used</p>
            </div>
            
            <div className="space-y-3 pt-4">
               <p className="text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-2">
                 <ShieldCheck size={14} /> Premium Benefits
               </p>
               <ul className="text-xs space-y-2 text-muted-foreground">
                 <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Unlimited Marketplace Integration</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Priority AI Agent Execution</li>
                 <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Dedicated Account Manager</li>
               </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/pricing" className="w-full">
              <Button className="w-full h-12 rounded-xl font-bold bg-primary shadow-xl shadow-primary/20">
                Upgrade to Pro Plan
              </Button>
            </Link>
          </CardFooter>
        </Card>

        {/* Selected Services / Billing Summary */}
        <Card className="lg:col-span-2 rounded-3xl border-white/5 bg-card overflow-hidden flex flex-col">
          <CardHeader className="border-b border-white/5 bg-muted/20">
            <CardTitle className="font-headline flex items-center gap-2">
              <ReceiptText size={20} className="text-primary" /> Active Services Billing
            </CardTitle>
            <CardDescription>Consolidated cost of your opted marketplace services.</CardDescription>
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
                   {billingSummary.map((service, i) => (
                     <tr key={i} className="group hover:bg-primary/5 transition-colors">
                       <td className="px-8 py-5">
                         <div className="flex flex-col">
                           <span className="font-bold text-sm">{service.name}</span>
                           <span className="text-[10px] text-muted-foreground">Service Activated on Oct 10, 2023</span>
                         </div>
                       </td>
                       <td className="px-8 py-5">
                         <Badge variant="secondary" className="text-[10px]">{service.type}</Badge>
                       </td>
                       <td className="px-8 py-5 text-right font-mono font-bold text-sm">
                         ₹{service.price.toLocaleString()}
                       </td>
                     </tr>
                   ))}
                 </tbody>
               </table>
             </div>
          </CardContent>
          <CardFooter className="bg-primary/5 p-8 border-t border-white/5 flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Total Active Investment</p>
              <h3 className="text-3xl font-headline font-bold text-primary">₹{totalInvestment.toLocaleString()}</h3>
            </div>
            <Button variant="outline" className="rounded-xl h-12 px-6">
              View Detailed Invoice
            </Button>
          </CardFooter>
        </Card>
      </div>

      {/* Invoice History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 rounded-2xl border-white/5 bg-card overflow-hidden">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Invoice History</CardTitle>
            <CardDescription>Past transactions and pending marketplace fees.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-white/5">
               {MOCK_INVOICES.map((inv) => (
                 <div key={inv.id} className="flex items-center justify-between p-6 hover:bg-muted/30 transition-colors">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
                       <CreditCard size={18} className="text-muted-foreground" />
                     </div>
                     <div>
                       <p className="font-bold text-sm">{inv.id}</p>
                       <p className="text-xs text-muted-foreground">{inv.date}</p>
                     </div>
                   </div>
                   <div className="flex items-center gap-8">
                     <div className="text-right">
                       <p className="font-bold text-sm">{inv.amount}</p>
                       <Badge variant={inv.status === 'Paid' ? 'default' : 'secondary'} className="text-[9px] h-4">
                         {inv.status}
                       </Badge>
                     </div>
                     <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full" onClick={() => handleDownloadInvoice(inv.id)}>
                       <Download size={16} />
                     </Button>
                   </div>
                 </div>
               ))}
             </div>
          </CardContent>
        </Card>

        {/* Next Billing Info */}
        <Card className="rounded-2xl border-white/5 bg-card flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-lg">Upcoming Billing</CardTitle>
            <CardDescription>Next scheduled charge for recurring agents.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
            <div className="p-4 rounded-xl bg-secondary/30 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock size={20} className="text-amber-500" />
                <div>
                  <p className="text-sm font-bold">Jan 01, 2024</p>
                  <p className="text-xs text-muted-foreground">Monthly Subscription</p>
                </div>
              </div>
              <p className="font-bold">₹0 (Trial)</p>
            </div>
            
            <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-3">
               <h4 className="font-bold text-sm text-primary flex items-center gap-2">
                 <TrendingUp size={16} /> Maximize ROI
               </h4>
               <p className="text-xs text-muted-foreground leading-relaxed">
                 Switch to an annual agency plan and save 20% on all onboarding and creative AI services.
               </p>
               <Button variant="link" className="p-0 h-auto text-xs text-primary font-bold">
                 View Annual Plans <ArrowUpRight size={12} className="ml-1" />
               </Button>
            </div>
          </CardContent>
          <div className="p-6 pt-0">
             <Button variant="outline" className="w-full rounded-xl border-white/10 h-11 text-xs font-bold uppercase tracking-wider">
               Manage Payment Methods
             </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
