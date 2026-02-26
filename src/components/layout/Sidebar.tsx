"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
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

const PRICE_MAP: Record<string, number> = {
  "Onboarding Bundle (5 Platforms)": 69999,
  "Myntra Onboarding": 29999,
  "Nykaa Onboarding": 24999,
  "Ajio Onboarding": 19999,
  "Amazon Onboarding": 8999,
  "Flipkart Onboarding": 8999,
  "Listing SEO Optimized": 39,
  "AI Photoshoot (5 Images)": 199,
  "AI UGC Ad Video": 1999,
  "AI Reels Monthly (8 reels)": 9999,
  "Google Business Setup": 4499,
  "Amazon/Flipkart Ads Mgmt": 21999,
  "Meta/Google Ads Mgmt": 19999,
  "Multi-Platform Ads Mgmt": 39999,
  "Basic Static Website": 15000,
  "Shopify Store Starter": 44999,
  "Enterprise E-com Setup": 129999,
  "AI CEO & Chief Strategist": 24999,
  "AI Social Media Manager": 9999,
  "AI Listing Architect": 7999,
  "AI Customer Success Lead": 5999,
  "AI Creative Director": 12999
};

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "CEO Board", href: "/dashboard/ceo-board", icon: Activity },
  { name: "AI Studio", href: "/dashboard/agents", icon: Sparkles },
  { name: "Growth Intel", href: "/dashboard/growth", icon: TrendingUp },
  { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
  { name: "AI Employee", href: "/dashboard/hire-ai", icon: UserPlus },
  { name: "Storage Services", href: "/dashboard/storage", icon: HardDrive },
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
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    setHasMounted(true);
    const loadProjects = () => {
      try {
        const saved = localStorage.getItem("marketmind_projects");
        if (saved) {
          const parsed = JSON.parse(saved);
          setProjects(parsed);
        }
      } catch (e) {}
    };
    loadProjects();
    window.addEventListener('storage', loadProjects);
    return () => window.removeEventListener('storage', loadProjects);
  }, []);

  const currentPlan = useMemo(() => {
    const active = projects.filter(p => p.status !== 'Canceled');
    if (active.length === 0) return { name: "Free Trial", color: "text-primary", border: "border-primary/20", bg: "bg-primary/10", badge: "Trial" };
    
    const totalValue = active.reduce((sum, p) => sum + (Number(p.price) || PRICE_MAP[p.name] || 0), 0);
    
    if (totalValue >= 100000) return { 
      name: "Enterprise Plan", 
      color: "text-indigo-500", 
      border: "border-indigo-500/30", 
      bg: "bg-indigo-500/10", 
      badge: "Enterprise" 
    };
    if (totalValue >= 30000) return { 
      name: "Pro Plan", 
      color: "text-amber-500", 
      border: "border-amber-500/30", 
      bg: "bg-amber-500/10", 
      badge: "Pro" 
    };
    
    return { 
      name: "Plus Plan", 
      color: "text-emerald-500", 
      border: "border-emerald-500/30", 
      bg: "bg-emerald-500/10", 
      badge: "Plus" 
    };
  }, [projects]);

  const handleSignOut = () => {
    toast({ title: "Logged Out" });
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
        <div className={cn("p-4 rounded-xl border transition-colors", currentPlan.bg, currentPlan.border)}>
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Active Tier</p>
          <p className={cn("text-sm font-bold flex items-center gap-2 mb-3", currentPlan.color)}>
            {currentPlan.name} <Zap size={10} className="fill-current" />
          </p>
          <Button size="sm" className="w-full h-8 text-[10px] font-bold uppercase tracking-widest rounded-lg bg-primary hover:bg-primary/90 text-white" asChild>
            <Link href="/pricing" onClick={handleLinkClick}>
              {currentPlan.name === 'Free Trial' ? 'Upgrade' : 'Manage'}
            </Link>
          </Button>
        </div>
        <Button variant="ghost" onClick={handleSignOut} className="w-full justify-start text-slate-500 hover:bg-white/5 hover:text-white transition-colors h-10">
          <LogOut size={18} className="mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
