
"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  BrainCircuit, 
  ArrowLeft, 
  CreditCard, 
  Smartphone, 
  Truck,
  ShieldCheck,
  Loader2,
  CheckCircle2,
  Tag,
  Package,
  ShoppingBag,
  ListChecks,
  Zap,
  Sparkles,
  Video,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

// Helper to map names to icons
const getIconForService = (name: string) => {
  if (name.includes("Onboarding")) return ShoppingBag;
  if (name.includes("Listing")) return ListChecks;
  if (name.includes("Keyword")) return Zap;
  if (name.includes("Photoshoot")) return Sparkles;
  if (name.includes("Video")) return Video;
  if (name.includes("Website")) return Globe;
  return Package;
};

// Helper to map names to categories
const getCategoryForService = (name: string) => {
  if (name.includes("Onboarding")) return "Onboarding";
  if (name.includes("Listing") || name.includes("Keyword")) return "SEO";
  if (name.includes("Photoshoot") || name.includes("Video")) return "Creative";
  if (name.includes("Website") || name.includes("Shopify")) return "Development";
  return "Services";
};

function CheckoutContent() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMode, setPaymentMode] = useState("card");
  const [promoCode, setPromoCode] = useState("");
  const [isPromoApplied, setIsPromoApplied] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const itemsString = searchParams.get("items") || "Growth Strategy Plan";
  const selectedItems = itemsString.split("|");
  const passedTotal = parseInt(searchParams.get("total") || "8474");

  const { toast } = useToast();

  const basePrice = passedTotal;
  const gst = Math.round(basePrice * 0.18);
  const discount = isPromoApplied ? 500 : 0;
  const totalPrice = basePrice + gst - discount;

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === "MARKET10") {
      setIsPromoApplied(true);
      toast({
        title: "Promo Applied!",
        description: "You've received a discount of ₹500.",
      });
    } else {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: "Please enter a valid promo code.",
      });
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate payment gateway delay
    setTimeout(() => {
      // PROVISION SERVICES: Add to localStorage projects
      try {
        const savedProjectsStr = localStorage.getItem("marketmind_projects");
        let projects = savedProjectsStr ? JSON.parse(savedProjectsStr) : [];

        selectedItems.forEach(itemName => {
          // Avoid duplicates if coming from project tab
          if (!projects.some((p: any) => p.name === itemName)) {
            const newProject = {
              id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              name: itemName,
              marketplace: itemName.includes("Amazon") ? "Amazon" : 
                           itemName.includes("Myntra") ? "Myntra" : 
                           itemName.includes("Flipkart") ? "Flipkart" : "Multi-channel",
              status: "Initial Setup",
              progress: 5,
              updatedAt: "Just now",
              assets: 0,
              priority: "Medium",
              type: getCategoryForService(itemName),
              icon: null, // Icons can't be stringified, will be re-mapped in UI
              details: {
                listingsCreated: 0,
                listingsInProgress: 1,
                brandOnboarded: false,
                milestones: [
                  { id: "p1", name: "Account Activation", completed: false },
                  { id: "p2", name: "Milestone Documentation", completed: false },
                  { id: "p3", name: "Brand Verification", completed: false },
                  { id: "p4", name: "Initial Listing Creation", completed: false },
                ]
              }
            };
            projects = [newProject, ...projects];
          }
        });

        localStorage.setItem("marketmind_projects", JSON.stringify(projects));
      } catch (err) {
        console.error("Failed to provision services", err);
      }

      setIsProcessing(false);
      setIsSuccess(true);
      toast({
        title: "Order Placed Successfully",
        description: paymentMode === "cod" 
          ? "Your offline request has been received. Our team will contact you shortly."
          : "Your plan has been activated. Welcome to MarketMind AI!",
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
          <h2 className="text-3xl font-headline font-bold mb-4">
            {paymentMode === "cod" ? "Order Received" : "Transaction Complete"}
          </h2>
          <p className="text-muted-foreground mb-8">
            {paymentMode === "cod" 
              ? "Your request for offline payment is being processed. An agent will reach out to you within 24 hours."
              : "Thank you for choosing MarketMind AI. Your dashboard is now updated with your premium features."}
          </p>
          <Button className="w-full h-12 rounded-xl font-bold" onClick={() => router.push("/dashboard/projects")}>
            Go to My Projects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background hero-gradient pb-20">
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
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-headline font-bold mb-2">Checkout</h1>
              <p className="text-muted-foreground">Complete your purchase for {selectedItems.length} items</p>
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
                <RadioGroup 
                  defaultValue="card" 
                  onValueChange={(val) => setPaymentMode(val)}
                  className="grid grid-cols-1 gap-3"
                >
                  <Label
                    htmlFor="card"
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMode === 'card' ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="card" id="card" />
                      <CreditCard size={20} className="text-primary" />
                      <span className="font-medium">Credit / Debit Card</span>
                    </div>
                  </Label>
                  <Label
                    htmlFor="upi"
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMode === 'upi' ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="upi" id="upi" />
                      <Smartphone size={20} className="text-primary" />
                      <span className="font-medium">UPI (GPay, PhonePe, Paytm)</span>
                    </div>
                  </Label>
                  <Label
                    htmlFor="cod"
                    className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${
                      paymentMode === 'cod' ? 'border-primary bg-primary/5' : 'border-white/5 bg-white/5 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem value="cod" id="cod" />
                      <Truck size={20} className="text-primary" />
                      <span className="font-medium">Cash on Delivery / Offline Payment</span>
                    </div>
                  </Label>
                </RadioGroup>

                <div className="mt-4 p-4 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
                  <Label className="text-sm font-bold flex items-center gap-2">
                    <Tag size={16} className="text-primary" /> Have a Promo Code?
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="Enter Code (e.g., MARKET10)" 
                      className="rounded-xl h-11 bg-background"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button 
                      type="button" 
                      variant="secondary" 
                      className="rounded-xl h-11 px-6 font-bold"
                      onClick={handleApplyPromo}
                    >
                      Apply
                    </Button>
                  </div>
                  {isPromoApplied && (
                    <p className="text-xs text-emerald-500 font-bold flex items-center gap-1">
                      <CheckCircle2 size={12} /> Promo code applied successfully!
                    </p>
                  )}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-xl text-lg font-bold shadow-2xl shadow-primary/40 mt-8"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authorizing...</>
                ) : (
                  <>{paymentMode === 'cod' ? 'Place Order' : 'Complete Purchase'}</>
                )}
              </Button>
              
              <p className="text-[10px] text-center text-muted-foreground flex items-center justify-center gap-2">
                <ShieldCheck size={12} /> SSL Encrypted & Secure Payment Processing
              </p>
            </form>
          </div>

          <div className="lg:pt-24">
            <Card className="rounded-3xl border-white/5 bg-card/50 backdrop-blur-xl sticky top-32 overflow-hidden">
              <CardHeader className="bg-primary/5 border-b border-white/5">
                <CardTitle className="font-headline">Order Summary</CardTitle>
                <CardDescription>Review your selection before paying.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                <div className="space-y-4 pb-6 border-b border-white/5">
                  <p className="text-xs font-bold uppercase tracking-widest text-primary mb-2">Selected Services</p>
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between gap-3">
                       <div className="flex items-center gap-3">
                         <Package size={14} className="text-muted-foreground" />
                         <span className="text-sm font-medium">{item}</span>
                       </div>
                    </div>
                  ))}
                </div>
                
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Base Price</span>
                    <span>₹{basePrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span>₹{gst.toLocaleString()}</span>
                  </div>
                  {isPromoApplied && (
                    <div className="flex justify-between text-sm text-emerald-500 font-bold">
                      <span>Promo Discount</span>
                      <span>-₹{discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="pt-4 flex justify-between font-bold text-xl border-t border-white/5">
                    <span>Total Pay</span>
                    <span className="text-primary">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background"><Loader2 className="animate-spin text-primary w-12 h-12" /></div>}>
      <CheckoutContent />
    </Suspense>
  );
}
