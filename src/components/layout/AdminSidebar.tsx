
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
  ShieldCheck,
  X
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

interface AdminSidebarProps {
  onClose?: () => void;
}

export function AdminSidebar({ onClose }: AdminSidebarProps) {
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

  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <div className="w-full h-full bg-slate-900 flex flex-col border-r border-white/5">
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link href="/internal" className="flex items-center gap-3 hover:opacity-80 transition-opacity" onClick={handleLinkClick}>
          <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center text-accent-foreground">
            <BrainCircuit size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-headline text-sm font-bold tracking-tight text-white">MarketMind Staff</span>
            <span className="text-[10px] uppercase tracking-widest text-accent font-bold">Admin Console</span>
          </div>
        </Link>
        {onClose && (
          <Button variant="ghost" size="icon" className="md:hidden text-white" onClick={onClose}>
            <X size={20} />
          </Button>
        )}
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href} onClick={handleLinkClick}>
              <div className={cn(
                "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group",
                isActive 
                  ? "bg-accent text-accent-foreground shadow-lg shadow-accent/20" 
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
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

      <div className="p-4 border-t border-white/5">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-white/5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
              <ShieldCheck size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-white">Admin Access</p>
              <p className="text-[10px] text-slate-500">ID: #MM-STAFF-01</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="w-full h-8 text-[10px] uppercase font-bold border-white/10 text-slate-300 hover:bg-slate-800" onClick={handleSignOut}>
            <LogOut size={12} className="mr-2" /> End Session
          </Button>
        </div>
      </div>
    </div>
  );
}
