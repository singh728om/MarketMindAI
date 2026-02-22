
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

export default function InternalOrdersPage() {
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
    o.id.toLowerCase().includes(search.toLowerCase())
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
    } else {
      toast({
        title: "Work Session Initiated",
        description: `You are now processing ${order.service} for ${order.client}.`,
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

  const toggleSubServiceStatus = (index: number) => {
    if (!selectedOrder) return;
    
    const updatedSubServices = [...selectedOrder.subServices];
    const currentStatus = updatedSubServices[index].status;
    updatedSubServices[index].status = currentStatus === 'Done' ? 'Pending' : 'Done';
    
    setSelectedOrder({
      ...selectedOrder,
      subServices: updatedSubServices
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
        <div className="flex items-center gap-3">
          <Button variant="outline" className="bg-slate-900 border-white/5 text-white h-11 md:h-12 rounded-xl text-sm px-4">
            <Filter className="w-4 h-4 mr-2" /> Filter Queue
          </Button>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
        <Input 
          placeholder="Search by Order ID or Client..." 
          className="pl-12 h-14 rounded-2xl bg-slate-900 border-white/5 text-white md:text-lg"
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
            <div className="flex flex-col lg:flex-row lg:items-center p-5 md:p-6 gap-4 md:gap-6">
              <div className="flex items-center gap-4 flex-1">
                <div className={cn(
                  "w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 shadow-lg",
                  order.status === 'Completed' ? "bg-emerald-500/10 text-emerald-500" : 
                  order.status === 'In Progress' ? "bg-accent/10 text-accent" : "bg-slate-800 text-slate-400"
                )}>
                  <order.icon size={24} className="md:size-7" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="text-[10px] md:text-xs font-mono font-bold text-accent uppercase tracking-widest">{order.id}</span>
                    <Badge variant="outline" className="text-[8px] md:text-[9px] h-4 border-white/10 uppercase text-slate-400">{order.category}</Badge>
                    {order.urgency === 'High' && <Badge className="bg-rose-500/10 text-rose-500 border-none text-[8px] md:text-[9px]">URGENT</Badge>}
                  </div>
                  <h3 className="text-base md:text-xl font-headline font-bold text-white mb-1 truncate group-hover:text-accent transition-colors">{order.service}</h3>
                  <div className="flex items-center gap-3 text-[10px] md:text-xs text-slate-500">
                    <span className="flex items-center gap-1 shrink-0"><User size={10} /> {order.client}</span>
                    <span className="flex items-center gap-1 shrink-0"><Clock size={10} /> {order.orderedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full lg:w-auto">
                <div className="flex flex-col gap-1.5 w-full md:min-w-[120px]">
                  <div className="flex justify-between text-[10px] font-bold uppercase text-slate-500">
                    <span>Progress</span>
                    <span>{order.progress}%</span>
                  </div>
                  <Progress value={order.progress} className="h-1 bg-slate-800" />
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto md:border-l border-white/5 md:pl-6">
                  <div className="text-left md:text-right">
                    <p className="text-[9px] font-bold text-slate-500 uppercase">Assigned</p>
                    <p className={cn("text-[11px] font-bold truncate max-w-[80px]", order.assignedTo === 'Unassigned' ? "text-rose-400" : "text-slate-200")}>
                      {order.assignedTo}
                    </p>
                  </div>
                  <Button 
                    className="rounded-lg h-9 px-3 bg-accent hover:bg-accent/90 text-accent-foreground font-bold text-[10px] uppercase"
                    onClick={(e) => { e.stopPropagation(); handleStartWork(order); }}
                  >
                    {order.assignedTo === 'Unassigned' ? "Claim" : "Work"}
                  </Button>
                  <div className="md:hidden">
                    <ChevronRight size={16} className="text-slate-600" />
                  </div>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Fulfillment Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <DialogContent className="max-w-4xl bg-slate-900 border-white/10 rounded-3xl overflow-hidden p-0 text-white max-h-[95vh] md:max-h-[90vh] flex flex-col">
          {selectedOrder && (
            <>
              <DialogHeader className="p-6 md:p-8 pb-4 md:pb-6 bg-accent/5 border-b border-white/5 shrink-0">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-accent text-accent-foreground flex items-center justify-center">
                      <selectedOrder.icon size={20} className="md:size-6" />
                    </div>
                    <div>
                      <DialogTitle className="text-lg md:text-2xl font-headline font-bold">{selectedOrder.service}</DialogTitle>
                      <DialogDescription className="text-slate-400 text-xs md:text-sm">Order ID: {selectedOrder.id} • Client: {selectedOrder.client}</DialogDescription>
                    </div>
                  </div>
                  <Badge className={cn(
                    "px-3 py-1 self-start md:self-center",
                    selectedOrder.status === 'Completed' ? "bg-emerald-500/20 text-emerald-500" : "bg-accent/20 text-accent"
                  )}>
                    {selectedOrder.status}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                      <Box size={16} /> Service Modules
                    </h4>
                    <div className="space-y-3">
                      {selectedOrder.subServices?.map((sub: any, i: number) => (
                        <div 
                          key={i} 
                          onClick={() => toggleSubServiceStatus(i)}
                          className="p-4 rounded-xl bg-slate-800/30 border border-white/5 space-y-2 hover:border-accent/30 transition-colors cursor-pointer group"
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-slate-200 group-hover:text-accent transition-colors">{sub.name}</span>
                            <Badge variant="outline" className="text-[8px] h-4 border-accent/20 text-accent uppercase">{sub.type}</Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Status</span>
                            <div className="flex items-center gap-2">
                              {sub.status === 'Done' && <Check size={12} className="text-emerald-500" />}
                              <span className={cn(
                                "text-[10px] font-bold uppercase",
                                sub.status === 'Done' ? "text-emerald-500" : "text-amber-500"
                              )}>{sub.status}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-xs md:text-sm font-bold uppercase tracking-widest text-slate-500 flex items-center gap-2">
                        <ListChecks size={16} /> Fulfillment Checklist
                      </h4>
                      <span className="text-[10px] md:text-xs font-bold text-accent">{selectedOrder.progress}% Complete</span>
                    </div>
                    <div className="space-y-2">
                      {selectedOrder.milestones.map((m: any) => (
                        <div 
                          key={m.id} 
                          onClick={() => toggleMilestone(m.id)}
                          className="flex items-center justify-between p-3 rounded-xl bg-slate-800/50 border border-white/5 hover:bg-slate-800 transition-colors cursor-pointer group"
                        >
                          <div className="flex items-center gap-3">
                            {m.status === 'Done' ? <CheckCircle2 size={18} className="text-emerald-500 shrink-0" /> : <div className="w-4 h-4 rounded border border-slate-600 group-hover:border-accent transition-colors shrink-0" />}
                            <span className={cn("text-xs md:text-sm font-medium", m.status === 'Done' ? "text-slate-200" : "text-slate-500")}>{m.name}</span>
                          </div>
                          <Badge variant="secondary" className={cn("text-[8px] h-4 uppercase shrink-0", m.status === 'Done' ? "bg-emerald-500/10 text-emerald-500" : "bg-slate-700 text-slate-400")}>
                            {m.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="p-5 md:p-6 rounded-2xl bg-slate-800/50 border border-white/5 space-y-4">
                    <div className="flex items-center gap-2 text-rose-400">
                      <AlertCircle size={16} />
                      <h4 className="text-xs md:text-sm font-bold uppercase tracking-wider">Client Instructions</h4>
                    </div>
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      "Please prioritize the brand registry approval first. We need to be live by next Friday for our Diwali collection launch."
                    </p>
                    <div className="pt-4 border-t border-white/5 flex flex-wrap gap-2 justify-between items-center">
                      <Button variant="outline" size="sm" className="h-8 text-[10px] uppercase font-bold border-white/5 bg-slate-900 px-3">
                        <MessageSquare size={12} className="mr-2" /> Message
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8 text-[10px] uppercase font-bold text-slate-500 px-3">Client Assets</Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs md:text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                      <FileText size={16} /> Internal Notes
                    </h4>
                    <textarea 
                      className="w-full bg-slate-800 border border-white/5 rounded-xl p-4 text-xs min-h-[120px] focus:ring-1 focus:ring-accent outline-none text-slate-300 leading-relaxed placeholder:text-slate-600"
                      placeholder="Add private fulfillment notes here..."
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 flex items-start gap-3">
                    <Zap size={18} className="text-accent shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-accent uppercase tracking-tighter">AI Node active</p>
                      <p className="text-[10px] text-slate-500 leading-snug">
                        Use Catalog Automation agents to expedite this order.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-6 md:p-8 bg-slate-800/50 border-t border-white/5 flex flex-col md:flex-row gap-3 shrink-0">
                <Button variant="outline" className="w-full md:flex-1 rounded-xl border-white/5 text-white h-12" onClick={() => setSelectedOrder(null)}>Close</Button>
                <Button 
                  className="w-full md:flex-1 rounded-xl bg-accent text-accent-foreground font-bold shadow-lg shadow-accent/20 h-12"
                  onClick={handleSaveProgress}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <><Loader2 size={16} className="mr-2 animate-spin" /> Saving...</>
                  ) : (
                    <><Save size={16} className="mr-2" /> Save Progress</>
                  )}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
