"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  Sparkles, 
  Camera, 
  Video, 
  FileText, 
  LayoutGrid, 
  TrendingUp,
  BrainCircuit,
  Star
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary w-8 h-8" />
            <span className="font-headline font-bold text-xl tracking-tight">MarketMind AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <Link href="#services" className="hover:text-primary transition-colors">Services</Link>
            <Link href="#how-it-works" className="hover:text-primary transition-colors">How it works</Link>
            <Link href="#pricing" className="hover:text-primary transition-colors">Pricing</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="hidden sm:inline-flex">Login</Button>
            </Link>
            <Link href="/onboarding">
              <Button className="rounded-full px-6">Start Free Audit</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden hero-gradient">
          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-6 animate-fade-in">
              <Sparkles size={14} />
              <span>Next-Gen E-commerce Intelligence</span>
            </div>
            <h1 className="font-headline text-5xl md:text-7xl font-bold mb-6 tracking-tight bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Grow Faster on Amazon, <br className="hidden md:block" /> Flipkart & Myntra with AI
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Automate your marketplace operations with expert-trained AI agents for photoshoots, listings, video ads, and growth intelligence.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/onboarding">
                <Button size="lg" className="rounded-full px-8 text-lg h-14 w-full sm:w-auto shadow-2xl shadow-primary/40">
                  Get Started Now <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="rounded-full px-8 text-lg h-14 w-full sm:w-auto">
                Book a Demo
              </Button>
            </div>
          </div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-30 pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/30 rounded-full blur-[128px]" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/30 rounded-full blur-[128px]" />
          </div>
        </section>

        {/* Services Showcase */}
        <section id="services" className="py-24 bg-secondary/20">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">Our AI Agency Capabilities</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Five core agents designed to eliminate your operational bottlenecks.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <ServiceCard 
                icon={Camera} 
                title="AI Photoshoot" 
                desc="Hyper-realistic product images in any environment without a physical set." 
              />
              <ServiceCard 
                icon={Star} 
                title="AI Ethnic Wear Model" 
                desc="Place your garments on AI models with perfect fit and lighting." 
              />
              <ServiceCard 
                icon={Video} 
                title="AI Video Ad Creation" 
                desc="Convert product images into scroll-stopping 15s video advertisements." 
              />
              <ServiceCard 
                icon={FileText} 
                title="AI Listing Optimization" 
                desc="Keyword-rich titles and descriptions optimized for platform algorithms." 
              />
              <ServiceCard 
                icon={LayoutGrid} 
                title="AI Catalog Automation" 
                desc="Bulk upload preparation and validation for all major marketplaces." 
              />
              <ServiceCard 
                icon={TrendingUp} 
                title="Growth Intelligence" 
                desc="Predictive analytics to outsmart competitors and scale ROAS." 
              />
            </div>
          </div>
        </section>
      </main>

      {/* Simple Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <BrainCircuit className="text-primary w-6 h-6" />
            <span className="font-headline font-bold text-lg">MarketMind AI</span>
          </div>
          <p className="text-muted-foreground text-sm">© 2024 MarketMind. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy</Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 border-white/5 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
      <CardContent className="p-8">
        <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
          <Icon size={24} />
        </div>
        <h3 className="font-headline text-xl font-bold mb-3">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}
