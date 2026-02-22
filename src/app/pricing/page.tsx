"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { BrainCircuit, Check, ArrowLeft, Zap, ShoppingBag, Sparkles, MapPin, Mail, Phone } from "lucide-react";

const PRICING_CATEGORIES = [
  {
    title: "Marketplace Onboarding",
    description: "Launch your brand on premium platforms with expert setup.",
    icon: ShoppingBag,
    items: [
      { name: "Myntra Onboarding", price: "₹14,999", period: "one-time" },
      { name: "Nykaa Onboarding", price: "₹14,999", period: "one-time" },
      { name: "Amazon Setup", price: "₹4,999", period: "one-time" },
      { name: "Flipkart Setup", price: "₹4,999", period: "one-time" },
    ]
  },
  {
    title: "Content & SEO",
    description: "High-converting listings optimized for discovery.",
    icon: Zap,
    items: [
      { name: "Listing Creation & Optimization", price: "₹1,999", period: "Starting from" },
    ]
  },
  {
    title: "AI Creative Studio",
    description: "Next-gen visual assets powered by proprietary AI.",
    icon: Sparkles,
    items: [
      { name: "AI Photoshoot", price: "₹100", period: "per style" },
      { name: "AI Video Ad (15s)", price: "₹499", period: "per video" },
      { name: "Ethnic Model Fit", price: "₹150", period: "per style" },
    ]
  }
];

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="text-primary w-8 h-8" />
            <span className="font-headline font-bold text-xl tracking-tight">MarketMind AI</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
              </Button>
            </Link>
            <Link href="/onboarding">
              <Button className="rounded-full px-6">Start Free Audit</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-32 pb-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h1 className="font-headline text-4xl md:text-6xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Transparent Pricing
            </h1>
            <p className="text-muted-foreground text-lg">
              No hidden fees. Scale your marketplace presence with pay-per-use AI agents and expert onboarding services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRICING_CATEGORIES.map((category) => (
              <Card key={category.title} className="rounded-3xl border-white/5 bg-card/50 backdrop-blur-sm overflow-hidden flex flex-col">
                <CardHeader className="p-8">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6">
                    <category.icon size={24} />
                  </div>
                  <CardTitle className="font-headline text-2xl">{category.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">{category.description}</CardDescription>
                </CardHeader>
                <CardContent className="px-8 pb-8 flex-1">
                  <div className="space-y-6">
                    {category.items.map((item) => (
                      <div key={item.name} className="flex items-center justify-between group">
                        <div className="space-y-1">
                          <p className="font-medium text-sm group-hover:text-primary transition-colors">{item.name}</p>
                          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{item.period}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold font-headline text-foreground">{item.price}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="p-8 pt-0 mt-auto">
                  <Button className="w-full rounded-xl h-12 font-bold" variant={category.title === "AI Creative Studio" ? "default" : "secondary"}>
                    Choose {category.title.split(' ')[0]}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="mt-20 p-12 rounded-3xl bg-primary/5 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold font-headline mb-4">Need an Enterprise Plan?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-8">
              Managing 500+ SKUs? Get custom workflows, priority AI processing, and a dedicated account strategist.
            </p>
            <Button size="lg" className="rounded-full px-8 h-14 text-lg">Contact Enterprise Sales</Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t py-16 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6 hover:opacity-80 transition-opacity">
                <BrainCircuit className="text-primary w-6 h-6" />
                <span className="font-headline font-bold text-lg">MarketMind AI</span>
              </Link>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Leading e-commerce growth agency scaling brands on India's biggest marketplaces with AI.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>AI Photoshoots</li>
                <li>Listing Optimization</li>
                <li>Video Ad Creation</li>
                <li>Catalog Automation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Contact</h4>
              <ul className="space-y-4 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <MapPin size={16} className="text-primary shrink-0" />
                  <span>Udyog Vihar Phase-1 Gurgaon 122016</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Mail size={16} className="text-primary shrink-0" />
                  <span>info@mastermindai.com</span>
                </li>
                <li className="flex gap-2 items-center">
                  <Phone size={16} className="text-primary shrink-0" />
                  <span>+918882130155</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-muted-foreground text-xs text-center md:text-left">© 2024 MarketMind. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
