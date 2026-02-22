
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

  useEffect(() => {
    // SIMULATION LOGIC:
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
        description: "Your 7-day access has ended. Please upgrade to a premium plan to regain access to your dashboard.",
      });
      const timer = setTimeout(() => {
        router.push("/");
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setIsChecking(false);
    }
  }, [router, toast]);

  if (isExpired || isChecking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background hero-gradient">
        <div className="text-center space-y-4">
          <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto" />
          <h2 className="text-xl font-headline font-bold">
            {isExpired ? "Access Restricted" : "Verifying Trial Status..."}
          </h2>
          <p className="text-muted-foreground px-4">
            {isExpired 
              ? "Redirecting to landing page..." 
              : "Checking your 7-day high-performance trial duration."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 z-40 border-r">
        <Sidebar />
      </aside>

      {/* Mobile Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b bg-card sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-primary w-6 h-6" />
          <span className="font-headline font-bold text-lg">MarketMind AI</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72">
            <Sidebar onClose={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 bg-background/50 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
