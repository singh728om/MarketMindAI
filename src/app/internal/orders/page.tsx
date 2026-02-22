"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Play, 
  CheckCircle2, 
  Clock, 
  User,
  ShoppingBag,
  Zap,
  Sparkles,
  Video,
  ListChecks,
  ChevronRight,
  MessageSquare,
  Box,
  FileText,
  AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const MASTER_ORDERS = [
  {
    id: "ORD-8821",
    client: "CHIC ELAN",
    brandId: "MM-CLIENT-402",
    service: "Myntra Onboarding",
    category: "Onboarding",
    status: "In Progress",
    progress: 45,
    assignedTo: "Rahul Staff",
    orderedAt: "2 days ago",
    urgency: "High",
    icon: ShoppingBag,
    subServices: [
      { name: "Documentation Audit", type: "Manual", status: "Done" },
      { name: "Brand Registry Push", type: "API", status: "In Progress" },
      { name: "Catalog Template Selection", type: "System", status: "Pending" }
    ],
    milestones: [
      { name: "Doc Submission", status: "Done" },
      { name: "Brand Registry", status: "Done" },
      { name: "Catalog Selection", status: "Pending" },
      { name: "Final QC", status: "Pending" },
    ]
  },
  {
    id: "ORD-8822",
    client: "Vibe Fashion",
    brandId: "MM-CLIENT-511",
    service: "AI Photoshoot",
    category: "Creative",
    status: "Pending",
    progress: 0,
    assignedTo: "Unassigned",
    orderedAt: "1 hour ago",
    urgency: "Medium",
    icon: Sparkles,
    subServices: [
      { name: "Raw Asset Verification", type: "Manual", status: "Pending" },
      { name: "Style Selection", type: "AI", status: "Pending" },
      { name: "Prompt Tuning", type: "AI", status: "Pending" }
    ],
    milestones: [
      { name: "Asset Ingestion", status: "Pending" },
      { name: "Prompt Selection", status: "Pending" },
      { name: "Generation", status: "Pending" },
      { name: "Review", status: "Pending" },
    ]
  },
  {
    id: "ORD-8823",
    client: "Urban Threads",
    brandId: "MM-CLIENT-102",
    service: "Listing Optimization",
    category: "SEO",
    status: "Completed",
    progress: 100,
    assignedTo: "Sneha Staff",
    orderedAt: "1 week ago",
    urgency: "Low",
    icon: ListChecks,
    subServices: [
      { name: "Listing Audit", type: "Manual", status: "Done" },
      { name: "SEO Copywriting", type: "AI", status: "Done" },
      { name: "A+ Content Strategy", type: "Manual", status: "Done" }
    ],
    milestones: [
      { name: "Audit", status: "Done" },
      { name: "AI Drafting", status: "Done" },
      { name: "Approval", status: "Done" },
      { name: "Marketplace Push", status: "Done" },
    ]
  }
];

export default function InternalOrdersPage() {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [search, setSearch] = useState("");
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("id");
  const { toast } = useToast();

  useEffect(() => {
    if (orderIdParam) {
      const order = MASTER_ORDERS.find(o => o.id === orderIdParam);
      if (order) setSelectedOrder(order);
    }
  }, [orderIdParam]);

  const filteredOrders = MASTER_ORDERS.filter(o => 
    o.client.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartWork = (order: any) => {
    toast({
      title: "Work Session Initiated",
      description: `You are now processing ${order.service} for ${order.client}.`,
    });
    setSelectedOrder(order);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">Master Service Orders</h1>
          <p className="text-slate-400">View and fulfill all customer marketplace service requests.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-slate-900 border-white/5 text-white h-12 rounded-xl">
            <Filter className="w-4 h-4 mr-2" /> Filter Queue
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <Input 
          placeholder="Search by Order ID, Client Name or Assigned Staff..." 
          className="pl-12 h-14 rounded-2xl bg-slate-900 border-white/5 text-white text-lg"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => (
          <Card 
            key={order.id} 
            className={cn(
              "bg-slate-900 border-white/5 hover:border-accent/50 transition-all cursor-pointer overflow-hidden group",
              order.id === orderIdParam && "border-accent/50 ring-1 ring-accent/20"
            )}
            onClick={() => setSelectedOrder(order)}
          >
            <div className="flex flex-col lg:flex-row lg:items-center p-6 gap-6">
              <div className={cn(
                "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                order.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" : 
                order.status === 'In Progress' ? "bg-accent/10 text-accent" : "bg-slate-800 text-slate-400"
              )}>
                <order.icon size={28} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-mono font-bold text-accent uppercase tracking-widest">{order.id}</span>
                  <Badge variant="outline" className="text-[9px] h-4 border-white/10 uppercase tracking-tighter text-slate-400">{order.category}</Badge>
                  {order.urgency === 'High' && <Badge className="bg-rose-500/10 text-rose-500 border-none text-[9px]">URGENT</Badge>}
                </div>
                <h3 className="text-xl font-headline font-bold text-white mb-1 group-hover:text-accent transition-colors">{order.service}</h3>
                <div className="flex items-center gap-4 text-xs text-slate-500">
                  <span className="flex items-center gap-1"><User size={12} /> {order.client}</span>
                  <span className="flex items-center gap-1"><Clock size={12} /> Ordered {order.orderedAt}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-w-[180px]">
                <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                  <span>Fulfillment</span>
                  <span>{order.progress}%</span>
                </div>
                <Progress value={order.progress} className="h-1.5 bg-slate-800" />
              </div>

              <div className="flex items-center gap-6 shrink-0 lg:border-l border-white/5 lg:pl-6">
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-500 uppercase mb-1">Assigned To</p>
                  <p className={cn("text-xs font-bold", order.assignedTo === 'Unassigned' ? "text-rose-400" : "text-slate-200")}>
                    {order.assignedTo}
                  </p>
                </div>
                <Button 
                  className="rounded-xl h-10 px-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-xs"
                  onClick={(e) => { e.stopPropagation(); handleStartWork(order); }}
                >
                  {order.assignedTo === 'Unassigned' ? "Claim Order" : "Work Order"}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Fulfillment Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden p-0 text-white max-h-[90vh] flex flex-col">
          {selectedOrder && (
            <>
              <DialogHeader className="p-8 pb-6 bg-accent/5 border-b border-white/5 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                      <selectedOrder.icon size={24} />
                    </div>
                    <div>
                      <DialogTitle className="text-2xl font-headline font-bold">{selectedOrder.service}</DialogTitle>
                      <DialogDescription className="text-slate-400">Order ID: {selectedOrder.id} • Client: {selectedOrder.client}</DialogDescription>
                    </div>
                  </div>
                  <Badge className={cn(
                    "px-3 py-1",
                    selectedOrder.status === 'Completed' ? "bg-emerald-500/20 text-emerald-500" : "bg-accent/20 text-accent"
                  )}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  {/* Specific Services Breakdown */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Box size={16} /> Service Modules
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.subServices?.map((sub: any, i: number) => (
                        <div key={i} className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-200">{sub.name}</span>
                            <Badge variant="outline" className="text-[8px] h-4 border-accent/20 text-accent">{sub.type}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500">Status</span>
                            <span className={cn(
                              "text-[10px] font-bold",
                              sub.status === 'Done' ? "text-emerald-500" : "text-amber-500"
                            )}>{sub.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <ListChecks size={16} /> Fulfillment Checklist
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.milestones.map((m: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5">
                          <div className="flex items-center gap-3">
                            {m.status === 'Done' ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Clock size={18} className="text-slate-600" />}
                            <span className={cn("text-sm font-medium", m.status === 'Done' ? "text-slate-200" : "text-slate-500")}>{m.name}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-7 text-[10px] font-bold text-accent">UPDATE</Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-6 rounded-2xl bg-slate-800/50 border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertCircle size={16} />
                      <h4 className="text-sm font-bold">Critical Client Instructions</h4>
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      "Please prioritize the brand registry approval first. We need to be live by next Friday for our Diwali collection launch. Ensure high-resolution keywords for ethnic categories."
                    </p>
                    <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-white/5 bg-slate-900">
                        <MessageSquare size={12} className="mr-2" /> Message Client
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-500">View Client Assets</Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <FileText size={16} /> Staff Internal Notes
                    </h4>
                    <textarea 
                      className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-xs min-h-[120px] focus:ring-1 focus:ring-accent outline-none text-slate-300 leading-relaxed"
                      placeholder="Add a private note for other staff members regarding progress, blockers, or AI model performance..."
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-start gap-3">
                    <Zap size={18} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-accent">AI Assistance Available</p>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Use the built-in Catalog Template Generator or Photoshoot Agent to expedite this order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-6 bg-slate-800/50 border-t border-white/5 flex gap-3 shrink-0">
                <Button variant="outline" className="flex-1 rounded-xl border-white/5 text-white" onClick={() => setSelectedOrder(null)}>Close Workspace</Button>
                <Button className="flex-1 rounded-xl bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/20">
                  Save Fulfillment Progress
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
