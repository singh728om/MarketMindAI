"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Menu, BrainCircuit } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isExpired, setIsExpired] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    // Simulation logic deferred to client-side only
    const joinedDate = new Date();
    joinedDate.setDate(joinedDate.getDate() - 2); 

    const now = new Date();
    const diffTime = now.getTime() - joinedDate.getTime();
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays > 7) {
      setIsExpired(true);
      toast({
        variant: "destructive",
        title: "Trial Period Expired",
        description: "Your 7-day access has ended.",
      });
      router.push("/");
    } else {
      setIsChecking(false);
    }
  }, [router, toast]);

  if (!hasMounted || isChecking || isExpired) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0a0a0c] text-white">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <h2 className="text-xl font-headline font-bold">Initializing Brand Workspace...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-[#0a0a0c]">
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 z-40 border-r border-white/5">
        <Sidebar />
      </aside>

      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/5 bg-slate-950 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-primary w-6 h-6" />
          <span className="font-headline font-bold text-lg text-white">MarketMind AI</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-slate-950 border-white/5">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      <main className="flex-1 md:ml-64 bg-background/50 min-h-screen text-white">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
