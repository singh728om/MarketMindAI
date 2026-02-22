"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BrainCircuit, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setShowOtp(true);
      setIsLoading(false);
    }, 1500);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-background hero-gradient">
      <Card className="w-full max-w-md rounded-3xl border-white/5 bg-card/80 backdrop-blur-xl shadow-2xl p-4">
        <CardHeader className="text-center">
          <Link href="/" className="mx-auto w-12 h-12 rounded-xl bg-primary flex items-center justify-center text-primary-foreground mb-4 hover:opacity-80 transition-opacity">
            <BrainCircuit size={28} />
          </Link>
          <CardTitle className="text-2xl font-headline font-bold">Welcome Back</CardTitle>
          <CardDescription>Enter your email to access your growth dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          {!showOtp ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Work Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="name@company.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                  className="rounded-xl h-12"
                />
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : "Send Login Link"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2 text-center">
                <Label>Verification Code</Label>
                <div className="flex justify-center gap-2 mt-2">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      className="w-10 h-12 text-center text-lg font-bold border rounded-lg bg-secondary focus:ring-2 focus:ring-primary outline-none"
                    />
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">Sent to {email}</p>
              </div>
              <Button type="submit" className="w-full h-12 rounded-xl font-bold" disabled={isLoading}>
                 {isLoading ? <Loader2 className="animate-spin" /> : "Verify & Login"}
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => setShowOtp(false)}>Use different email</Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
