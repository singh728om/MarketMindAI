
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Sparkles, 
  TrendingUp, 
  FolderKanban, 
  Settings, 
  LogOut,
  ChevronRight,
  BrainCircuit,
  Zap,
  Headphones,
  Ticket
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Agents", href: "/dashboard/agents", icon: Sparkles },
  { name: "Growth Intel", href: "/dashboard/growth", icon: TrendingUp },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Support", href: "/dashboard/support", icon: Headphones },
  { name: "Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 h-screen bg-card border-r flex flex-col fixed left-0 top-0 z-40">
      <Link href="/" className="p-6 flex items-center gap-3 hover:opacity-80 transition-opacity">
        <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
          <BrainCircuit size={24} />
        </div>
        <span className="font-headline text-xl font-bold tracking-tight">MarketMind</span>
      </Link>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}>
                <div className="flex items-center gap-3">
                  <item.icon size={20} className={cn(isActive ? "text-white" : "text-primary")} />
                  <span className="font-medium">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-border/50 space-y-4">
        <div className="bg-primary/10 p-4 rounded-xl border border-primary/20 relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">Current Plan</p>
            <p className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              7-Day Free Trial <Zap size={12} className="text-primary" />
            </p>
            <Link href="/pricing">
              <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/20">
                Upgrade Plan
              </Button>
            </Link>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <Zap size={64} />
          </div>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive transition-colors">
          <LogOut size={20} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
