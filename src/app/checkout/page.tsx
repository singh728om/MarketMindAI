"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  BrainCircuit, 
  ArrowLeft, 
  CreditCard, 
  Wallet, 
  Smartphone, 
  Truck,
  ShieldCheck,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const planName = searchParams.get("plan") || "Growth Strategy Plan";
  const { toast } = useToast();

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      toast({
        title: "Payment Successful",
        description: "Your plan has been activated. Welcome to MarketMind AI!",
      });
    }, 3000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background hero-gradient">
        <Card className="w-full max-w-md rounded-3xl border-white/5 bg-card/80 backdrop-blur-xl shadow-2xl text-center p-8">
          <div className="mx-auto w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-6">
            <CheckCircle2 size={48} />
          </div>
          <h2 className="text-3xl font-headline font-bold mb-4">Transaction Complete</h2>
          <p className="text-muted-foreground mb-8">
            Thank you for choosing MarketMind AI. Your dashboard is now updated with your premium features.
          </p>
          <Button className="w-full h-12 rounded-xl font-bold" onClick={() => router.push("/dashboard")}>
            Go to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background hero-gradient pb-20">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="text-primary w-8 h-8" />
            <span className="font-headline font-bold text-xl tracking-tight">MarketMind AI</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-32">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Checkout Form */}
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your purchase for {planName}</p>
            </div>

            <form onSubmit={handlePayment} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-bold font-headline flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">1</div>
                  Customer Details
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" placeholder="John Doe" required className="rounded-xl h-12" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" placeholder="john@company.com" required className="rounded-xl h-12" />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold font-headline flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">2</div>
                  Billing Address
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input id="address" placeholder="123 Growth Lane" required className="rounded-xl h-12" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input id="city" placeholder="Gurgaon" required className="rounded-xl h-12" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <Input id="pincode" placeholder="122016" required className="rounded-xl h-12" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-bold font-headline flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs">3</div>
                  Payment Mode
                </h3>
                <RadioGroup defaultValue="card" className="grid grid-cols-1 gap-3">
                  <Label
                    htmlFor="card"
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard size={20} className="text-primary" />
                      <span className="font-medium">Credit / Debit Card</span>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-6 h-4 bg-muted rounded-sm opacity-50" />
                      <div className="w-6 h-4 bg-muted rounded-sm opacity-50" />
                    </div>
                  </Label>
                  <Label
                    htmlFor="upi"
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <Smartphone size={20} className="text-primary" />
                      <span className="font-medium">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                  </Label>
                  <Label
                    htmlFor="netbanking"
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="netbanking" id="netbanking" />
                      <Wallet size={20} className="text-primary" />
                      <span className="font-medium">Net Banking</span>
                    </div>
                  </Label>
                  <Label
                    htmlFor="cod"
                    className="flex items-center justify-between p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Truck size={20} className="text-primary" />
                      <span className="font-medium">Cash on Delivery / Offline Payment</span>
                    </div>
                  </Label>
                </RadioGroup>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl text-lg font-bold shadow-2xl shadow-primary/40 mt-8"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authorizing...</>
                ) : (
                  <>Complete Purchase</>
                )}
              </Button>
              
              <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-2">
                <ShieldCheck size={12} /> SSL Encrypted & Secure Payment Processing
              </p>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:pt-24">
            <Card className="rounded-3xl border-white/5 bg-card/50 backdrop-blur-xl sticky top-32 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-white/5">
                <CardTitle className="font-headline">Order Summary</CardTitle>
                <CardDescription>Review your selection before paying.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="flex justify-between items-start pb-6 border-b border-white/5">
                  <div className="space-y-1">
                    <p className="font-bold text-lg">{planName}</p>
                    <p className="text-sm text-muted-foreground">MarketMind AI Premium Access</p>
                  </div>
                  <p className="font-bold text-xl text-primary">₹9,999</p>
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span>₹8,474</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹1,525</span>
                  </div>
                  <div className="pt-4 flex justify-between font-bold text-xl border-t border-white/5">
                    <span>Total Pay</span>
                    <span className="text-primary">₹9,999</span>
                  </div>
                </div>

                <div className="bg-secondary/20 p-4 rounded-xl space-y-3">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary">Instant Benefits</p>
                  <ul className="text-xs space-y-2 text-muted-foreground">
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Unlimited AI Photoshoots</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Full Growth Intelligence Reports</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={12} className="text-primary" /> Multi-marketplace Automation</li>
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="p-8 pt-0 text-[10px] text-muted-foreground leading-relaxed">
                By completing the purchase, you agree to MarketMind AI's Terms of Service and Refund Policy. You will be redirected to the secure payment portal.
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
