
"use client";

import { useState } from "react";
import { 
  Ticket, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  MessageSquare, 
  ChevronRight,
  MoreVertical,
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

const MOCK_TICKETS = [
  {
    id: "MM-4821",
    subject: "Myntra Onboarding Delay",
    category: "Marketplace",
    status: "In Progress",
    priority: "High",
    updatedAt: "2 hours ago",
    replies: 3
  },
  {
    id: "MM-1290",
    subject: "AI Photoshoot Background Error",
    category: "AI Studio",
    status: "Resolved",
    priority: "Medium",
    updatedAt: "1 day ago",
    replies: 1
  },
  {
    id: "MM-9023",
    subject: "Amazon API Integration Help",
    category: "Technical",
    status: "Pending",
    priority: "High",
    updatedAt: "Just now",
    replies: 0
  },
  {
    id: "MM-3341",
    subject: "Listing SEO Optimization Query",
    category: "SEO",
    status: "Resolved",
    priority: "Low",
    updatedAt: "3 days ago",
    replies: 2
  }
];

export default function TicketsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTickets = MOCK_TICKETS.filter(t => 
    t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Support Tickets</h1>
          <p className="text-muted-foreground">Manage and track your ongoing support requests.</p>
        </div>
        <Button className="rounded-xl h-12 px-6 shadow-lg shadow-primary/20" onClick={() => window.location.href = '/dashboard/support'}>
          <MessageSquare className="w-4 h-4 mr-2" /> New Ticket
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search by ticket ID or subject..." 
            className="pl-10 h-12 rounded-xl bg-card border-white/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 border-white/5 bg-card">
          <Filter className="w-4 h-4 mr-2" /> All Categories
        </Button>
      </div>

      <div className="space-y-4">
        {filteredTickets.map((ticket) => (
          <Card key={ticket.id} className="rounded-2xl border-white/5 bg-card hover:border-primary/30 transition-all group cursor-pointer overflow-hidden">
            <div className="flex items-center p-6 gap-6">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                ticket.status === 'Resolved' ? "bg-emerald-500/10 text-emerald-500" : 
                ticket.status === 'In Progress' ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
              )}>
                {ticket.status === 'Resolved' ? <CheckCircle2 size={24} /> : 
                 ticket.status === 'In Progress' ? <Clock size={24} className="animate-pulse" /> : <AlertCircle size={24} />}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{ticket.id}</span>
                  <Badge variant="outline" className="text-[9px] h-4 px-1.5 border-white/10">{ticket.category}</Badge>
                </div>
                <h3 className="font-bold font-headline text-lg truncate group-hover:text-primary transition-colors">{ticket.subject}</h3>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> Updated {ticket.updatedAt}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MessageSquare size={12} /> {ticket.replies} replies
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="hidden md:flex flex-col items-end">
                   <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1">Priority</span>
                   <Badge variant={ticket.priority === 'High' ? 'default' : 'secondary'} className="text-[10px] uppercase">
                     {ticket.priority}
                   </Badge>
                </div>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                      <MoreVertical size={20} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-white/10">
                    <DropdownMenuItem>View Conversation</DropdownMenuItem>
                    <DropdownMenuItem>Add Note</DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">Close Ticket</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </Card>
        ))}

        {filteredTickets.length === 0 && (
          <div className="py-20 text-center space-y-4">
             <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mx-auto text-muted-foreground">
               <Ticket size={40} />
             </div>
             <div>
               <h3 className="text-xl font-bold font-headline">No tickets found</h3>
               <p className="text-muted-foreground">We couldn't find any support tickets matching your search.</p>
             </div>
             <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ");
}
