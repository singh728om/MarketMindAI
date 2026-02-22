
"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, BrainCircuit } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/internal/login";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-50 flex-col md:flex-row">
      {/* Desktop Admin Sidebar */}
      <aside className="hidden md:flex w-64 h-screen fixed left-0 top-0 z-40">
        <AdminSidebar />
      </aside>

      {/* Mobile Admin Header */}
      <header className="md:hidden flex items-center justify-between px-4 h-16 border-b border-white/5 bg-slate-900 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-accent w-6 h-6" />
          <span className="font-headline font-bold text-lg text-white">Ops Console</span>
        </div>
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-72 bg-slate-900 border-white/10">
            <AdminSidebar onClose={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>
      </header>

      {/* Main Content */}
      <main className="flex-1 md:ml-64">
        <div className="max-w-7xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
