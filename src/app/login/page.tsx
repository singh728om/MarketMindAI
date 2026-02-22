"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Loader2, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate login verification delay
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background hero-gradient">
      <Card className="w-full max-w-md rounded-3xl border-white/5 bg-card/80 backdrop-blur-xl shadow-2xl p-4 overflow-hidden relative">
        <CardHeader className="text-center relative z-10">
          <Link href="/" className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4 hover:opacity-80 transition-opacity shadow-lg shadow-primary/20">
            <BrainCircuit size={28} />
          </Link>
          <CardTitle className="text-2xl font-headline font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your credentials to access your growth dashboard.</CardDescription>
        </CardHeader>
        <CardContent className="relative z-10">
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="rounded-xl h-12 bg-background/50"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Button variant="link" size="sm" className="px-0 font-bold text-xs h-auto text-primary hover:text-primary/80" type="button">
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <Input 
                  id="password" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                  className="rounded-xl h-12 bg-background/50 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-12 rounded-xl font-bold shadow-xl shadow-primary/20 mt-2" disabled={isLoading}>
              {isLoading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Authorizing...</>
              ) : (
                "Sign In to MarketMind"
              )}
            </Button>

            <div className="text-center pt-4">
              <p className="text-xs text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/onboarding" className="text-primary font-bold hover:underline">
                  Start Free Trial
                </Link>
              </p>
            </div>
          </form>
        </CardContent>

        {/* Decorative background elements */}
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
      </Card>
    </div>
  );
}
