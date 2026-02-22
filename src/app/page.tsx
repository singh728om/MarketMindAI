"use client";

import { useState, useRef } from "react";
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
  Star,
  Upload,
  CheckCircle2,
  X
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "File Selected",
        description: `Preparing to process: ${file.name}`,
      });
    }
  };

  const services = [
    { 
      id: "photoshoot",
      icon: Camera, 
      title: "AI Photoshoot", 
      desc: "Hyper-realistic product images in any environment without a physical set.",
      details: "Our AI Photoshoot agent generates high-fidelity backgrounds and context-aware lighting for your products. Simply upload a raw image and describe the setting.",
      hasUpload: true
    },
    { 
      id: "ethnic",
      icon: Star, 
      title: "AI Ethnic Wear Model", 
      desc: "Place your garments on AI models with perfect fit and lighting.",
      details: "Specialized models for Indian ethnic wear. Our AI understands drape, texture, and cultural aesthetics to showcase sarees, kurtas, and lehengas perfectly.",
      hasUpload: true
    },
    { 
      id: "video",
      icon: Video, 
      title: "AI Video Ad Creation", 
      desc: "Convert product images into scroll-stopping 15s video advertisements.",
      details: "Turn static product shots into dynamic cinematic videos. Ideal for Instagram Reels, YouTube Shorts, and Amazon Video Ads.",
      hasUpload: true
    },
    { 
      id: "listing",
      icon: FileText, 
      title: "AI Listing Optimization", 
      desc: "Keyword-rich titles and descriptions optimized for platform algorithms.",
      details: "Our SEO agent analyzes competitor data and marketplace search trends to write high-converting copy for Amazon, Flipkart, and Myntra."
    },
    { 
      id: "catalog",
      icon: LayoutGrid, 
      title: "AI Catalog Automation", 
      desc: "Bulk upload preparation and validation for all major marketplaces.",
      details: "Automate the tedious task of marketplace sheet preparation. Validates attributes against marketplace-specific rules instantly."
    },
    { 
      id: "growth",
      icon: TrendingUp, 
      title: "Growth Intelligence", 
      desc: "Predictive analytics to outsmart competitors and scale ROAS.",
      details: "Data-driven recommendations for pricing, inventory, and advertising strategy based on real-time market shifts."
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="text-primary w-8 h-8" />
            <span className="font-headline font-bold text-xl tracking-tight">MarketMind AI</span>
          </Link>
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
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-full px-8 text-lg h-14 w-full sm:w-auto"
                onClick={() => setDemoOpen(true)}
              >
                Book a Demo
              </Button>
            </div>
          </div>

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
              {services.map((service) => (
                <div key={service.id} onClick={() => setServiceOpen(service.id)} className="cursor-pointer">
                  <ServiceCard 
                    icon={service.icon} 
                    title={service.title} 
                    desc={service.desc} 
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section id="how-it-works" className="py-24">
          <div className="container mx-auto px-4">
             <div className="text-center mb-16">
              <h2 className="font-headline text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Three simple steps to supercharge your marketplace growth.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto text-2xl font-bold">1</div>
                <h3 className="text-xl font-bold font-headline">Connect Store</h3>
                <p className="text-muted-foreground">Link your Amazon, Flipkart or Myntra seller central accounts in seconds.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto text-2xl font-bold">2</div>
                <h3 className="text-xl font-bold font-headline">AI Audit</h3>
                <p className="text-muted-foreground">Our agents scan your listings, catalog, and ads for optimization opportunities.</p>
              </div>
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mx-auto text-2xl font-bold">3</div>
                <h3 className="text-xl font-bold font-headline">Scale ROAS</h3>
                <p className="text-muted-foreground">Apply AI recommendations instantly to boost conversion and reduce ad spend.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Demo Modal */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-headline font-bold">Book a Strategy Session</DialogTitle>
            <DialogDescription>
              Schedule a 15-minute demo with our growth experts.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Work Email</Label>
              <Input id="email" type="email" placeholder="john@company.com" className="rounded-xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company Name</Label>
              <Input id="company" placeholder="DTC Brand Ltd" className="rounded-xl" />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button onClick={() => setDemoOpen(false)} variant="outline" className="flex-1 rounded-xl h-12 order-2 sm:order-1">Cancel</Button>
            <Button onClick={() => setDemoOpen(false)} className="flex-1 rounded-xl h-12 order-1 sm:order-2">Schedule Demo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Detail Modal */}
      <Dialog open={!!serviceOpen} onOpenChange={() => setServiceOpen(null)}>
        <DialogContent className="max-w-2xl rounded-3xl overflow-hidden p-0">
          {serviceOpen && (
            <div className="flex flex-col">
              <div className="p-8 bg-card border-b">
                <div className="flex items-center gap-4 mb-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      {(() => {
                        const s = services.find(s => s.id === serviceOpen);
                        const Icon = s?.icon || Camera;
                        return <Icon size={24} />;
                      })()}
                   </div>
                   <DialogTitle className="text-3xl font-headline font-bold">
                    {services.find(s => s.id === serviceOpen)?.title}
                   </DialogTitle>
                </div>
                <DialogDescription className="text-lg leading-relaxed text-muted-foreground">
                  {services.find(s => s.id === serviceOpen)?.details}
                </DialogDescription>
              </div>
              
              <div className="p-8 space-y-6">
                {services.find(s => s.id === serviceOpen)?.hasUpload && (
                  <div className="space-y-4">
                    <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Demo Preview</Label>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/10 rounded-2xl p-12 flex flex-col items-center justify-center gap-4 bg-secondary/20 hover:bg-secondary/30 transition-colors cursor-pointer group"
                    >
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <Upload size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-lg">Upload Product Image</p>
                        <p className="text-sm text-muted-foreground">Drag and drop or click to browse</p>
                      </div>
                      <Button variant="outline" className="rounded-full">Select File</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-4">
                  <h4 className="font-bold font-headline flex items-center gap-2">
                    <CheckCircle2 size={18} className="text-primary" /> Key Benefits
                  </h4>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" /> 24/7 Automation
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" /> Marketplace Compliant
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" /> Multi-platform support
                    </li>
                    <li className="flex items-center gap-2 text-sm text-muted-foreground">
                      <div className="w-1 h-1 rounded-full bg-primary" /> High ROAS Efficiency
                    </li>
                  </ul>
                </div>

                <div className="pt-4 flex gap-4">
                  <Link href="/onboarding" className="flex-1">
                    <Button className="w-full h-12 rounded-xl text-lg font-bold">Get Started for Free</Button>
                  </Link>
                  <Button variant="outline" className="h-12 rounded-xl px-8" onClick={() => setServiceOpen(null)}>Close</Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Simple Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <BrainCircuit className="text-primary w-6 h-6" />
            <span className="font-headline font-bold text-lg">MarketMind AI</span>
          </Link>
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
    <Card className="group hover:border-primary/50 transition-all duration-300 border-white/5 bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden h-full">
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
