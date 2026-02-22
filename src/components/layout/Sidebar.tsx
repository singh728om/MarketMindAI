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
  BrainCircuit
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Agents", href: "/dashboard/agents", icon: Sparkles },
  { name: "Growth Intel", href: "/dashboard/growth", icon: TrendingUp },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
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

      <div className="p-4 border-t border-border/50">
        <div className="bg-secondary/50 p-4 rounded-xl mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">Active Plan</p>
          <p className="text-sm font-bold text-foreground">Pro Enterprise</p>
        </div>
        <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-destructive transition-colors">
          <LogOut size={20} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
