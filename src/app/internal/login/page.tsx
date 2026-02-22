"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Loader2, ShieldCheck, Lock } from "lucide-react";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate internal auth verification
    setTimeout(() => {
      setIsLoading(false);
      router.push("/internal");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-[url('https://picsum.photos/seed/grid/1920/1080')] opacity-5 grayscale pointer-events-none" />
      
      <Card className="w-full max-w-md rounded-3xl border-white/5 bg-slate-900 shadow-2xl p-4 overflow-hidden relative border">
        <CardHeader className="text-center relative z-10">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-accent flex items-center justify-center text-accent-foreground mb-6 shadow-xl shadow-accent/20">
            <BrainCircuit size={32} />
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-[10px] font-bold mb-4 uppercase tracking-widest">
            <ShieldCheck size={12} />
            <span>Internal Portal</span>
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-white">Staff Login</CardTitle>
          <CardDescription className="text-slate-400">Authorized personnel only. Access is monitored.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300">Employee ID / Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@marketmindai.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="rounded-xl h-12 bg-slate-800 border-white/5 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" title="Password" className="text-slate-300">Security Key</Label>
              <div className="relative">
                <Input 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="rounded-xl h-12 bg-slate-800 border-white/5 text-white pr-10"
                />
                <Lock size={18} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" />
              </div>
            </div>

            <Button type="submit" className="w-full h-14 rounded-xl font-bold bg-accent hover:bg-accent/90 text-accent-foreground shadow-xl shadow-accent/20 mt-4 transition-all active:scale-95" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Verifying Credentials...</>
              ) : (
                "Access Admin Console"
              )}
            </Button>

            <div className="text-center pt-6 border-t border-white/5">
              <Link href="/" className="text-xs text-slate-500 hover:text-white transition-colors">
                Return to Public Website
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
