
"use client";

import { useState, useEffect, Suspense } from "react";
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
  AlertCircle,
  Save,
  Loader2,
  Check
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
import { ScrollArea } from "@/components/ui/scroll-area";

const INITIAL_MASTER_ORDERS = [
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
      { id: "m1", name: "Doc Submission", status: "Done" },
      { id: "m2", name: "Brand Registry", status: "Done" },
      { id: "m3", name: "Catalog Selection", status: "Pending" },
      { id: "m4", name: "Final QC", status: "Pending" },
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
      { id: "ph1", name: "Asset Ingestion", status: "Pending" },
      { id: "ph2", name: "Prompt Selection", status: "Pending" },
      { id: "ph3", name: "Generation", status: "Pending" },
      { id: "ph4", name: "Review", status: "Pending" },
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
      { id: "lo1", name: "Audit", status: "Done" },
      { id: "lo2", name: "AI Drafting", status: "Done" },
      { id: "lo3", name: "Approval", status: "Done" },
      { id: "lo4", name: "Marketplace Push", status: "Done" },
    ]
  }
];

function OrdersContent() {
  const [orders, setOrders] = useState(INITIAL_MASTER_ORDERS);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const searchParams = useSearchParams();
  const orderIdParam = searchParams.get("id");
  const { toast } = useToast();

  useEffect(() => {
    if (orderIdParam) {
      const order = orders.find(o => o.id === orderIdParam);
      if (order) setSelectedOrder(order);
    }
  }, [orderIdParam, orders]);

  const filteredOrders = orders.filter(o => 
    o.client.toLowerCase().includes(search.toLowerCase()) || 
    o.id.toLowerCase().includes(search.toLowerCase()) ||
    o.service.toLowerCase().includes(search.toLowerCase())
  );

  const handleStartWork = (order: any) => {
    if (order.assignedTo === 'Unassigned') {
      const updatedOrders = orders.map(o => 
        o.id === order.id ? { ...o, assignedTo: "Me (Staff)", status: "In Progress" } : o
      );
      setOrders(updatedOrders);
      toast({
        title: "Order Claimed",
        description: `You have successfully claimed order ${order.id}.`,
      });
    }
    setSelectedOrder(orders.find(o => o.id === order.id) || order);
  };

  const toggleMilestone = (milestoneId: string) => {
    if (!selectedOrder) return;

    const updatedMilestones = selectedOrder.milestones.map((m: any) => {
      if (m.id === milestoneId) {
        return { ...m, status: m.status === 'Done' ? 'Pending' : 'Done' };
      }
      return m;
    });

    const doneCount = updatedMilestones.filter((m: any) => m.status === 'Done').length;
    const newProgress = Math.round((doneCount / updatedMilestones.length) * 100);

    setSelectedOrder({
      ...selectedOrder,
      milestones: updatedMilestones,
      progress: newProgress,
      status: newProgress === 100 ? "Completed" : "In Progress"
    });
  };

  const handleSaveProgress = () => {
    setIsSaving(true);
    setTimeout(() => {
      setOrders(prev => prev.map(o => o.id === selectedOrder.id ? selectedOrder : o));
      setIsSaving(false);
      toast({
        title: "Progress Saved",
        description: `Fulfillment status for ${selectedOrder.id} has been updated.`,
      });
    }, 1000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-headline font-bold mb-1 text-white">Master Service Orders</h1>
          <p className="text-slate-400 text-sm md:text-base">View and fulfill all customer marketplace service requests.</p>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <Input 
          placeholder="Search by Order ID, Client or Service..." 
          className="pl-12 h-14 rounded-2xl bg-slate-900 border-white/5 text-white"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredOrders.map((order) => {
          const Icon = order.icon;
          return (
            <Card 
              key={order.id} 
              className="bg-slate-900 border-white/5 hover:border-accent/50 transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex flex-col lg:flex-row lg:items-center p-5 md:p-6 gap-4 md:gap-6">
                <div className="flex items-center gap-4 flex-1">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                    order.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" : 
                    order.status === 'In Progress' ? "bg-accent/10 text-accent" : "bg-slate-800 text-slate-400"
                  )}>
                    <Icon size={24} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-mono font-bold text-accent uppercase tracking-widest">{order.id}</span>
                      <Badge variant="secondary" className="bg-slate-800 text-slate-400 text-[8px] h-4 px-1">{order.status}</Badge>
                    </div>
                    <h3 className="text-base md:text-xl font-headline font-bold text-white mb-1 truncate">{order.service}</h3>
                    <p className="text-[10px] md:text-xs text-slate-500 flex items-center gap-2">
                      <User size={10} /> {order.client} • Assigned: {order.assignedTo}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{order.progress}% FULFILLED</span>
                    <Progress value={order.progress} className="h-1 w-24 bg-slate-800" />
                  </div>
                  <Button 
                    size="sm"
                    className="rounded-lg h-9 px-4 bg-accent hover:bg-accent/90 text-accent-foreground font-bold"
                    onClick={(e) => { e.stopPropagation(); handleStartWork(order); }}
                  >
                    {order.assignedTo === 'Unassigned' ? "Claim" : "Work"}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden p-0 text-white max-h-[95vh] flex flex-col">
          {selectedOrder && (
            <>
              <DialogHeader className="p-6 md:p-8 pb-4 md:pb-6 bg-accent/5 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                    {(() => {
                      const Icon = selectedOrder.icon;
                      return <Icon size={20} />;
                    })()}
                  </div>
                  <div>
                    <DialogTitle className="text-lg md:text-2xl font-headline font-bold">{selectedOrder.service}</DialogTitle>
                    <DialogDescription className="text-slate-400 text-xs md:text-sm">
                      Order ID: {selectedOrder.id} • Client: {selectedOrder.client} • Status: {selectedOrder.status}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>
              
              <ScrollArea className="flex-1 p-6 md:p-8">
                <div className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Fulfillment Checklist</h4>
                      <div className="space-y-2">
                        {selectedOrder.milestones.map((m: any) => (
                          <div 
                            key={m.id} 
                            onClick={() => toggleMilestone(m.id)}
                            className="flex items-center justify-between p-4 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-3">
                              {m.status === 'Done' ? (
                                <CheckCircle2 size={20} className="text-emerald-500" />
                              ) : (
                                <div className="w-5 h-5 rounded border-2 border-slate-600 group-hover:border-accent transition-colors" />
                              )}
                              <span className={cn(
                                "text-sm font-medium",
                                m.status === 'Done' ? "text-slate-200" : "text-slate-400"
                              )}>{m.name}</span>
                            </div>
                            <Badge variant="secondary" className="text-[8px] h-4 uppercase">{m.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-widest text-slate-500">Service Modules</h4>
                      <div className="space-y-2">
                        {selectedOrder.subServices.map((sub: any, idx: number) => (
                          <div key={idx} className="p-4 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-between">
                            <div>
                              <p className="text-sm font-bold text-white">{sub.name}</p>
                              <p className="text-[10px] text-slate-500 uppercase">{sub.type} Process</p>
                            </div>
                            <Badge variant={sub.status === 'Done' ? 'default' : 'secondary'} className="text-[8px]">
                              {sub.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-accent/5 border border-accent/10 flex items-start gap-4">
                    <AlertCircle className="text-accent shrink-0 mt-1" size={20} />
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">Staff Fulfillment Note</p>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        Ensure all documentation is verified against Myntra's latest category guidelines before pushing the catalog live.
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollArea>

              <DialogFooter className="p-6 bg-slate-800/50 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                <Button variant="outline" className="flex-1 rounded-xl border-white/5" onClick={() => setSelectedOrder(null)}>Cancel</Button>
                <Button 
                  className="flex-1 rounded-xl bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/20"
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                >
                  {isSaving ? <Loader2 size={16} className="animate-spin mr-2" /> : <Save size={16} className="mr-2" />} 
                  Update Fulfillment Progress
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function InternalOrdersPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center p-20 min-h-[60vh]"><Loader2 className="animate-spin text-accent w-12 h-12" /></div>}>
      <OrdersContent />
    </Suspense>
  );
}
