"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Loader2, Eye, EyeOff, ShieldCheck, User, Briefcase } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent, type: 'customer' | 'staff') => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login verification delay
    setTimeout(() => {
      setIsLoading(false);
      if (type === 'staff') {
        router.push("/internal");
      } else {
        router.push("/dashboard");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background hero-gradient">
      <div className="w-full max-w-md space-y-8 animate-in fade-in zoom-in duration-500">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="text-primary w-10 h-10" />
            <span className="font-headline font-bold text-2xl tracking-tight">MarketMind AI</span>
          </Link>
        </div>

        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-2xl h-14 p-1 bg-muted/50 border border-white/5 shadow-inner">
            <TabsTrigger value="customer" className="rounded-xl font-bold flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-white">
              <User size={16} /> Customer
            </TabsTrigger>
            <TabsTrigger value="staff" className="rounded-xl font-bold flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-white">
              <Briefcase size={16} /> Staff
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="mt-6">
            <Card className="rounded-3xl border-white/5 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden relative border">
              <CardHeader className="text-center pt-8">
                <CardTitle className="text-2xl font-headline font-bold">Welcome Back</CardTitle>
                <CardDescription>Enter your credentials to access your growth dashboard.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <form onSubmit={(e) => handleLogin(e, 'customer')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Work Email</Label>
                    <Input 
                      id="customer-email" 
                      type="email" 
                      placeholder="name@company.com" 
                      required 
                      className="rounded-xl h-12 bg-background/50 border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="customer-password">Password</Label>
                      <Button variant="link" size="sm" className="px-0 font-bold text-xs h-auto text-primary" type="button">
                        Forgot password?
                      </Button>
                    </div>
                    <div className="relative">
                      <Input 
                        id="customer-password" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="••••••••" 
                        required 
                        className="rounded-xl h-12 bg-background/50 pr-10 border-white/10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-xl shadow-primary/20 mt-4 bg-primary" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authorizing...</> : "Sign In to Brand Portal"}
                  </Button>
                  <div className="text-center pt-4">
                    <p className="text-xs text-muted-foreground">
                      Don&apos;t have an account? <Link href="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="staff" className="mt-6">
            <Card className="rounded-3xl border-accent/20 bg-slate-950/80 backdrop-blur-xl shadow-2xl overflow-hidden relative border">
              <CardHeader className="text-center pt-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent border border-accent/20 text-[10px] font-bold mb-4 uppercase tracking-widest mx-auto">
                  <ShieldCheck size={12} />
                  <span>Internal Access</span>
                </div>
                <CardTitle className="text-2xl font-headline font-bold text-white">Ops Console</CardTitle>
                <CardDescription className="text-slate-400">Authorized personnel only. Access is logged.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 pt-4">
                <form onSubmit={(e) => handleLogin(e, 'staff')} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="staff-email" className="text-slate-300">Staff Email</Label>
                    <Input 
                      id="staff-email" 
                      type="email" 
                      placeholder="admin@marketmindai.com" 
                      required 
                      className="rounded-xl h-12 bg-slate-900 border-white/5 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="staff-password" title="Password" className="text-slate-300">Security Key</Label>
                    <Input 
                      id="staff-password" 
                      type="password" 
                      placeholder="••••••••" 
                      required 
                      className="rounded-xl h-12 bg-slate-900 border-white/5 text-white"
                    />
                  </div>
                  <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-xl shadow-accent/20 mt-4 bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading}>
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...</> : "Access Admin Console"}
                  </Button>
                  <div className="text-center pt-4">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                      Regional Processing Hub: AS-SOUTH-1
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <p className="text-center text-[10px] text-muted-foreground uppercase tracking-widest font-bold opacity-50">
          SSL Encrypted Authentication Gateway v2.4
        </p>
      </div>
    </div>
  );
}
