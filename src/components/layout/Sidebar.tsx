
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
  UserPlus
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Price mapping for tier calculation logic
const PRICE_MAP: Record<string, number> = {
  "Myntra Onboarding": 14999,
  "Amazon Onboarding": 4999,
  "Flipkart Onboarding": 4999,
  "Ajio Onboarding": 14999,
  "Nykaa Onboarding": 14999,
  "Listing Creation": 1999,
  "Listing Optimization": 1999,
  "Keyword Research": 999,
  "AI Photoshoot": 999,
  "AI Video Ad (15s)": 1499,
  "Website Store Builder": 11999,
  "Shopify Store": 14999,
  "AI CEO & Strategist": 24999,
  "AI Social Media Manager": 9999,
  "AI Listing Architect": 7999,
  "AI Customer Success Lead": 5999,
  "AI Creative Director": 12999
};

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
  const [currentPlan, setCurrentPlan] = useState({ name: "Free Trial", color: "text-primary" });

  useEffect(() => {
    const calculatePlan = () => {
      try {
        const projectsStr = localStorage.getItem("marketmind_projects");
        if (projectsStr) {
          const projects = JSON.parse(projectsStr);
          const activeProjects = projects.filter((p: any) => p.status !== 'Canceled');
          
          if (activeProjects.length > 0) {
            // Check if any active project is >= 10k using metadata price or mapping
            const hasHighValue = activeProjects.some((p: any) => {
              const price = Number(p.price) || PRICE_MAP[p.name] || 0;
              return price >= 10000;
            });

            if (hasHighValue) {
              setCurrentPlan({ name: "Pro Plan", color: "text-amber-500" });
            } else {
              setCurrentPlan({ name: "Plus Plan", color: "text-emerald-500" });
            }
          } else {
            setCurrentPlan({ name: "Free Trial", color: "text-primary" });
          }
        }
      } catch (e) {
        console.error("Plan calc error", e);
      }
    };

    calculatePlan();
    window.addEventListener('storage', calculatePlan);
    return () => window.removeEventListener('storage', calculatePlan);
  }, []);

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
        <div className={cn(
          "p-4 rounded-xl border relative overflow-hidden group",
          currentPlan.name === 'Pro Plan' ? "bg-amber-500/10 border-amber-500/20" : 
          currentPlan.name === 'Plus Plan' ? "bg-emerald-500/10 border-emerald-500/20" : 
          "bg-primary/10 border-primary/20"
        )}>
          <div className="relative z-10">
            <p className={cn("text-[10px] font-bold uppercase tracking-widest mb-1", currentPlan.color)}>Subscription Status</p>
            <p className="text-sm font-bold text-foreground flex items-center gap-2 mb-3">
              {currentPlan.name} <Zap size={10} className={currentPlan.color} />
            </p>
            <Link href="/pricing" onClick={handleLinkClick}>
              <Button size="sm" className={cn(
                "w-full h-8 text-[10px] font-bold uppercase tracking-wider rounded-lg shadow-lg",
                currentPlan.name === 'Pro Plan' ? "bg-amber-500 hover:bg-amber-600 text-black shadow-amber-500/20" : 
                currentPlan.name === 'Plus Plan' ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20" :
                "bg-primary shadow-primary/20"
              )}>
                {currentPlan.name === 'Pro Plan' ? "Manage Account" : "Upgrade Plan"}
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
