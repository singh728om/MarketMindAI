
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  Ticket,
  CreditCard,
  Building2,
  HardDrive,
  History,
  X,
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "AI Agents", href: "/dashboard/agents", icon: Sparkles },
  { name: "Growth Intel", href: "/dashboard/growth", icon: TrendingUp },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Hire AI Employee", href: "/dashboard/hire-ai", icon: UserPlus },
  { name: "Storage Services", href: "/dashboard/storage", icon: HardDrive },
  { name: "Order History", href: "/dashboard/orders", icon: History },
  { name: "Billing & Plans", href: "/dashboard/billing", icon: CreditCard },
  { name: "Support Tickets", href: "/dashboard/tickets", icon: Ticket },
  { name: "Brand Profile", href: "/dashboard/profile", icon: Building2 },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = () => {
    toast({
      title: "Logged Out",
      description: "You have been successfully signed out of your session.",
    });
    router.push("/");
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="w-full h-full bg-card flex flex-col">
      <div className="p-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={handleLinkClick}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground">
            <BrainCircuit size={24} />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white">MarketMind AI</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="md:hidden" onClick={onClose}>
            <X size={20} />
          </Button>
        )}
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={handleLinkClick}>
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
              7-Day Free Trial <Zap size={10} className="text-primary" />
            </p>
            <Link href="/pricing" onClick={handleLinkClick}>
              <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg shadow-primary/20">
                Upgrade Plan
              </Button>
            </Link>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
            <HardDrive size={64} />
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="w-full justify-start text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          <LogOut size={20} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
