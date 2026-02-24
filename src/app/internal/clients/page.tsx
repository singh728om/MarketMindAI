"use client";

import { useState, useMemo } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Building2, 
  Mail, 
  ShoppingBag, 
  CheckCircle2, 
  Clock,
  ExternalLink,
  Plus,
  ChevronRight
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

const CLIENTS = [
  { id: "MM-C-402", name: "CHIC ELAN", website: "chicelan.in", contact: "Rahul Malhotra", email: "rahul@chicelan.in", status: "Active", projects: 2, marketplace: "Multi" },
  { id: "MM-C-511", name: "Vibe Fashion", website: "vibefashion.com", contact: "Sneha Kapoor", email: "sneha@vibe.com", status: "Active", projects: 1, marketplace: "Amazon" },
  { id: "MM-C-102", name: "Urban Threads", website: "urbanthreads.in", contact: "Amit Sharma", email: "amit@urban.in", status: "Onboarding", projects: 1, marketplace: "Myntra" },
  { id: "MM-C-882", name: "Heritage Home", website: "heritagehome.co", contact: "Priya Das", email: "priya@heritage.com", status: "Active", projects: 3, marketplace: "Flipkart" },
];

export default function ClientsPage() {
  const [search, setSearch] = useState("");

  const filteredClients = useMemo(() => {
    return CLIENTS.filter(c => 
      c.name.toLowerCase().includes(search.toLowerCase()) || 
      c.contact.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">Client Database</h1>
          <p className="text-slate-400">Manage and audit all registered marketplace brands.</p>
        </div>
        <Button className="bg-accent text-accent-foreground rounded-xl h-12 px-6 font-bold shadow-lg shadow-accent/20">
          <Plus className="w-4 h-4 mr-2" /> Add New Client
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
          <Input 
            placeholder="Search by Brand, Contact or ID..." 
            className="pl-12 h-12 rounded-2xl bg-slate-900 border-white/5 text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 border-white/5 bg-slate-900 text-white">
          <Filter className="w-4 h-4 mr-2" /> All Tiers
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="bg-slate-900 border-white/5 hover:border-accent/30 transition-all overflow-hidden group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold text-xl">
                  {client.name.charAt(0)}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500">
                      <MoreVertical size={18} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-slate-900 border-white/10 text-white">
                    <DropdownMenuItem>View Profile</DropdownMenuItem>
                    <DropdownMenuItem>Service History</DropdownMenuItem>
                    <DropdownMenuItem className="text-rose-500">Suspend Account</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4">
                <CardTitle className="text-xl font-headline font-bold text-white group-hover:text-accent transition-colors">{client.name}</CardTitle>
                <CardDescription className="text-slate-500 flex items-center gap-1 mt-1">
                  <ExternalLink size={12} /> {client.website}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/5">
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Primary Contact</p>
                  <p className="text-xs text-slate-200 font-medium">{client.contact}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-slate-500 uppercase">Active Services</p>
                  <p className="text-xs text-slate-200 font-medium">{client.projects} Active</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant={client.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20">
                    {client.status}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] border-white/10 text-slate-400">
                    {client.marketplace}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-xs text-slate-400 group-hover:text-white">
                  Audit <ChevronRight size={14} className="ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}