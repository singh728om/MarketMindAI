"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { toast } = useToast();
  const [isChecking, setIsChecking] = useState(true);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    // SIMULATION LOGIC:
    // In a real application, this 'joinedDate' would be fetched from Firebase Auth/Firestore.
    // Change the subtraction value to > 7 to test the restriction (e.g., -8).
    const joinedDate = new Date();
    joinedDate.setDate(joinedDate.getDate() - 2); // Currently set to 2 days ago (Trial Active)

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
      // Redirect back to landing page after a small delay to allow toast to show
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
          <p className="text-muted-foreground">
            {isExpired 
              ? "Redirecting to landing page..." 
              : "Checking your 7-day high-performance trial duration."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-background/50">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
