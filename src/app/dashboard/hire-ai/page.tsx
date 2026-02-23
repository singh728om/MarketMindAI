"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Sparkles, 
  Zap, 
  MessageSquare, 
  Star,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
  BadgeCheck,
  Video,
  FileText,
  ExternalLink,
  Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AI_EMPLOYEES = [
  {
    id: "ai-smm",
    name: "Nova",
    role: "AI Social Media Manager",
    agentId: "ugc",
    description: "Generates viral UGC scripts, manages content calendars, and handles influencer creative briefs.",
    skills: ["UGC Scripting", "Trend Analysis", "Creative Directing"],
    icon: Video,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    price: 9999,
    availability: "Immediate",
    rating: 4.8,
    longDesc: "Nova stays synced with trend APIs to ensure your brand's creative assets are always relevant. She handles the 'vibe' of your brand."
  },
  {
    id: "ai-seo",
    name: "Cipher",
    role: "AI Listing Architect",
    agentId: "listing",
    description: "Elite marketplace SEO specialist. Focuses on keyword dominance and conversion-optimized titles.",
    skills: ["Marketplace SEO", "Conversion Copy", "Competitor Intel"],
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
    price: 7999,
    availability: "Immediate",
    rating: 5.0,
    longDesc: "Cipher analyzes millions of search queries on Amazon and Myntra to position your products at the top."
  },
  {
    id: "ai-support",
    name: "Echo",
    role: "AI Customer Success Lead",
    agentId: "support",
    description: "Handles 24/7 reputation management, review responses, and support ticket triage.",
    skills: ["Sentiment Analysis", "Dispute Resolution", "Brand Tone"],
    icon: MessageSquare,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    price: 5999,
    availability: "Immediate",
    rating: 4.7,
    longDesc: "Echo ensures your brand maintains a 4+ star rating by responding to every review within minutes."
  },
  {
    id: "ai-creative",
    name: "Vivid",
    role: "AI Creative Director",
    agentId: "photoshoot",
    description: "The visionary behind your visual assets. Orchestrates photoshoots and ad storyboarding.",
    skills: ["Visual Direction", "Prompt Engineering", "Color Theory"],
    icon: Sparkles,
    color: "text-purple-500",
    bg: "bg-purple-500/10",
    price: 12999,
    availability: "Immediate",
    rating: 4.9,
    longDesc: "Vivid handles the aesthetics. She ensures your visual brand identity is consistent across all channels."
  }
];

export default function HireAIPage() {
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [hiredRoles, setHiredRoles] = useState<string[]>([]);
  const [hasMounted, setHasMounted] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setHasMounted(true);
    const checkHiredStatus = () => {
      try {
        const projectsStr = localStorage.getItem("marketmind_projects");
        if (projectsStr) {
          const projects = JSON.parse(projectsStr);
          const activeRoles = projects
            .filter((p: any) => p.status !== 'Canceled')
            .map((p: any) => p.name);
          setHiredRoles(activeRoles);
        }
      } catch (e) {}
    };
    checkHiredStatus();
    window.addEventListener('storage', checkHiredStatus);
    return () => window.removeEventListener('storage', checkHiredStatus);
  }, []);

  const handleHire = (employee: any) => {
    if (hiredRoles.includes(employee.role)) {
      router.push(`/dashboard/agents?agent=${employee.agentId}`);
      return;
    }
    toast({ title: "Initiating Recruitment", description: `Redirecting for ${employee.name}...` });
    router.push(`/checkout?items=${encodeURIComponent(employee.role)}&total=${employee.price}&autoAdd=true`);
  };

  if (!hasMounted) return null;

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1 text-white">Hire AI Talent</h1>
          <p className="text-muted-foreground">Recruit specialized digital employees trained on marketplace datasets.</p>
        </div>
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30 px-4 py-1.5 flex items-center gap-2">
          <Users size={14} />
          Hired: {hiredRoles.length} / {AI_EMPLOYEES.length}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {AI_EMPLOYEES.map((emp) => {
          const isHired = hiredRoles.includes(emp.role);
          return (
            <Card key={emp.id} className={cn("group transition-all duration-500 rounded-3xl border-white/5 bg-card overflow-hidden cursor-pointer shadow-2xl relative", isHired && "border-emerald-500/30 bg-emerald-500/5")}>
              <div className="absolute top-4 right-4 flex gap-2">
                {isHired && <Badge className="bg-emerald-500 text-white">HIRED</Badge>}
                <div className="flex items-center gap-1 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg border border-white/5 text-[10px] font-bold text-amber-400">
                  <Star size={10} fill="currentColor" /> {emp.rating}
                </div>
              </div>
              <CardHeader className="pb-4">
                <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-xl", emp.bg, emp.color)}>
                  <emp.icon size={32} />
                </div>
                <div className="space-y-1">
                  <CardTitle className="text-2xl font-headline font-bold text-white flex items-center gap-2">{emp.name} <BadgeCheck className="text-blue-500 size-5" /></CardTitle>
                  <p className={cn("text-xs font-bold uppercase tracking-widest", emp.color)}>{emp.role}</p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">{emp.description}</p>
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Monthly Salary</p>
                    <p className="text-xl font-bold text-white">₹{emp.price.toLocaleString()}</p>
                  </div>
                  <p className={cn("text-[10px] font-bold uppercase", isHired ? "text-emerald-500" : "text-slate-500")}>
                    {isHired ? "Active Now" : emp.availability}
                  </p>
                </div>
              </CardContent>
              <CardFooter className="pt-0 gap-2">
                <Button variant="outline" className="flex-1 rounded-xl h-11 border-white/5 bg-slate-800/50 hover:bg-slate-800 text-white" onClick={(e) => { e.stopPropagation(); setSelectedEmployee(emp); }}>View Profile</Button>
                <Button className={cn("flex-1 rounded-xl h-11 font-bold shadow-lg transition-all", isHired ? "bg-emerald-500" : "bg-primary")} onClick={(e) => { e.stopPropagation(); handleHire(emp); }}>
                  {isHired ? "Open Studio" : "Hire Now"}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl bg-slate-950 border-white/10 rounded-3xl overflow-hidden p-0 text-white shadow-2xl">
          {selectedEmployee && (
            <>
              <DialogHeader className="p-8 pb-6 bg-gradient-to-br from-primary/20 to-transparent border-b border-white/5">
                <div className="flex items-center gap-6">
                  <div className={cn("w-20 h-20 rounded-3xl flex items-center justify-center shadow-2xl", selectedEmployee.bg, selectedEmployee.color)}><selectedEmployee.icon size={40} /></div>
                  <div className="space-y-1">
                    <DialogTitle className="text-3xl font-headline font-bold">{selectedEmployee.name}</DialogTitle>
                    <p className={cn("text-sm font-bold uppercase tracking-[0.2em]", selectedEmployee.color)}>{selectedEmployee.role}</p>
                  </div>
                </div>
              </DialogHeader>
              <div className="p-8 space-y-8">
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2"><Info size={14} className="text-primary" /> Summary</h4>
                  <p className="text-slate-300 text-lg leading-relaxed">{selectedEmployee.longDesc}</p>
                </div>
                <div className="bg-primary/5 border border-primary/20 rounded-2xl p-5 flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-primary uppercase">Terms</p>
                    <p className="text-xl font-bold">₹{selectedEmployee.price.toLocaleString()}/mo</p>
                  </div>
                  <Button className={cn("rounded-xl h-12 px-8 font-bold", hiredRoles.includes(selectedEmployee.role) ? "bg-emerald-500" : "bg-primary")} onClick={() => handleHire(selectedEmployee)}>
                    {hiredRoles.includes(selectedEmployee.role) ? "Open Studio" : "Recruit"}
                  </Button>
                </div>
              </div>
              <DialogFooter className="p-6 bg-slate-900/50 border-t border-white/5">
                <Button variant="ghost" className="w-full text-slate-500 hover:text-white" onClick={() => setSelectedEmployee(null)}>Close</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}