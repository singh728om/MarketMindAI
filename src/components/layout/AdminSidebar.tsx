"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare, 
  Settings, 
  LogOut,
  ChevronRight,
  BrainCircuit,
  Key,
  Users,
  ShieldCheck
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Ops Overview", href: "/internal", icon: LayoutDashboard },
  { name: "Service Orders", href: "/internal/orders", icon: ClipboardList },
  { name: "Support Queue", href: "/internal/support", icon: MessageSquare },
  { name: "Client Database", href: "/internal/clients", icon: Users },
  { name: "System Config", href: "/internal/settings", icon: Key },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({
      title: "Staff Session Ended",
      description: "Internal portal access revoked.",
    });
    router.push("/internal/login");
  };

  return (
    <div className="w-64 h-screen bg-card border-r flex flex-col fixed left-0 top-0 z-40">
      <div className="p-6 border-b border-border/50">
        <Link href="/internal" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
            <BrainCircuit size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm font-bold tracking-tight">MarketMind Staff</span>
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Admin Console</span>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={cn(isActive ? "text-white" : "text-accent")} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50">
        <div className="bg-secondary/50 p-4 rounded-xl border border-border mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-bold">Admin Access</p>
              <p className="text-[10px] text-muted-foreground">ID: #MM-STAFF-01</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full h-8 text-[10px] uppercase font-bold" onClick={handleSignOut}>
            <LogOut size={12} className="mr-2" /> End Session
          </Button>
        </div>
      </div>
    </div>
  );
}
