
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
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
  UserPlus,
  Activity
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Strategic Hub", href: "/dashboard/ceo-hub", icon: Activity },
  { name: "AI Studio", href: "/dashboard/agents", icon: Sparkles },
  { name: "Growth Intel", href: "/dashboard/growth", icon: TrendingUp },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "Hire Talent", href: "/dashboard/hire-ai", icon: UserPlus },
  { name: "Order History", href: "/dashboard/orders", icon: History },
  { name: "Billing", href: "/dashboard/billing", icon: CreditCard },
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
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  const handleSignOut = () => {
    toast({
      title: "Logged Out",
      description: "Session closed successfully.",
    });
    router.push("/");
  };

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  if (!hasMounted) return null;

  return (
    <div className="w-full h-full bg-[#0a0a0c] flex flex-col border-r border-white/5">
      <div className="p-6 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={handleLinkClick}>
          <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <BrainCircuit size={24} />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight text-white">MarketMind AI</span>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={onClose}>
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
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              )}>
                <div className="flex items-center gap-3">
                  <item.icon size={18} className={cn(isActive ? "text-white" : "text-primary")} />
                  <span className="font-medium text-sm">{item.name}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Active Tier</p>
            <p className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              Free Trial <Zap size={10} className="text-amber-500 fill-amber-500" />
            </p>
            <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-primary hover:bg-primary/90 text-white" asChild>
              <Link href="/pricing" onClick={handleLinkClick}>Upgrade</Link>
            </Button>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-5">
            <HardDrive size={64} />
          </div>
        </div>
        <Button 
          variant="ghost" 
          onClick={handleSignOut}
          className="w-full justify-start text-slate-500 hover:bg-white/5 hover:text-white transition-colors h-10"
        >
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
