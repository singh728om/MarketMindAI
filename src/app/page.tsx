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
  MapPin,
  Mail,
  Phone,
  Menu,
  X,
  ShoppingBag,
  ShoppingCart,
  Tag,
  Package,
  Truck,
  CreditCard,
  Zap,
  Globe,
  Award,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

export default function LandingPage() {
  const [demoOpen, setDemoOpen] = useState(false);
  const [serviceOpen, setServiceOpen] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
      hasUpload: true,
      color: "text-purple-500",
      bg: "bg-purple-500/10"
    },
    { 
      id: "video",
      icon: Video, 
      title: "AI Video Ads", 
      desc: "Convert product images into scroll-stopping 15s video advertisements.",
      details: "Turn static product shots into dynamic cinematic videos. Ideal for Instagram Reels, YouTube Shorts, and Amazon Video Ads.",
      hasUpload: true,
      color: "text-rose-500",
      bg: "bg-rose-500/10"
    },
    { 
      id: "listing",
      icon: FileText, 
      title: "Listing Optimization", 
      desc: "Keyword-rich titles and descriptions optimized for platform algorithms.",
      details: "Our SEO agent analyzes competitor data and marketplace search trends to write high-converting copy for Amazon, Flipkart, and Myntra.",
      color: "text-blue-500",
      bg: "bg-blue-500/10"
    },
    { 
      id: "catalog",
      icon: LayoutGrid, 
      title: "Catalog Automation", 
      desc: "Bulk upload preparation and validation for all major marketplaces.",
      details: "Automate the tedious task of marketplace sheet preparation. Validates attributes against marketplace-specific rules instantly.",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10"
    },
    { 
      id: "growth",
      icon: TrendingUp, 
      title: "Growth Intelligence", 
      desc: "Predictive analytics to outsmart competitors and scale ROAS.",
      details: "Data-driven recommendations for pricing, inventory, and advertising strategy based on real-time market shifts.",
      color: "text-amber-500",
      bg: "bg-amber-500/10"
    },
    { 
      id: "website",
      icon: Globe, 
      title: "AI Store Builder", 
      desc: "Generate professional DTC landing pages directly from your catalog.",
      details: "Create a fully functional brand store in minutes. Optimized for speed and mobile conversions.",
      color: "text-indigo-500",
      bg: "bg-indigo-500/10"
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#0a0a0c] text-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full z-50 border-b border-white/5 bg-background/60 backdrop-blur-2xl">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
              <BrainCircuit className="text-white w-6 h-6" />
            </div>
            <span className="font-headline font-bold text-2xl tracking-tighter">MarketMind <span className="text-primary">AI</span></span>
          </Link>
          
          <nav className="hidden lg:flex items-center gap-10 text-sm font-semibold text-slate-400">
            <a href="#services" className="hover:text-primary transition-colors">Agents</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">Methodology</a>
            <Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link>
            <a href="#about" className="hover:text-primary transition-colors">Agency</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" className="font-bold text-slate-300">Login</Button>
            </Link>
            <Link href="/signup" className="hidden sm:inline-flex">
              <Button className="rounded-xl px-6 font-bold shadow-lg shadow-primary/25">Start Free Trial</Button>
            </Link>
            
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden text-white">
                  <Menu size={24} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-[#0a0a0c] border-white/5 pt-16">
                <div className="flex flex-col gap-8 text-xl font-bold">
                  <a href="#services" onClick={() => setIsMobileMenuOpen(false)}>AI Agents</a>
                  <a href="#how-it-works" onClick={() => setIsMobileMenuOpen(false)}>Methodology</a>
                  <Link href="/pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing Plans</Link>
                  <a href="#about" onClick={() => setIsMobileMenuOpen(false)}>Our Agency</a>
                  <hr className="border-white/5" />
                  <div className="flex flex-col gap-4">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full h-14 rounded-2xl">Login</Button>
                    </Link>
                    <Link href="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button className="w-full h-14 rounded-2xl">Create Account</Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-40 pb-24 md:pt-56 md:pb-40 overflow-hidden">
          {/* Sprinkled Graphics Layer */}
          <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
            <div className="absolute top-[15%] left-[10%] opacity-10 text-primary animate-float">
              <ShoppingBag size={48} />
            </div>
            <div className="absolute top-[25%] right-[15%] opacity-5 text-accent animate-float-delayed">
              <ShoppingCart size={64} />
            </div>
            <div className="absolute bottom-[20%] left-[20%] opacity-10 text-primary animate-float-delayed">
              <Tag size={32} />
            </div>
            <div className="absolute top-[40%] right-[5%] opacity-5 text-amber-500 animate-float">
              <Package size={56} />
            </div>
            <div className="absolute bottom-[30%] right-[25%] opacity-10 text-primary animate-float">
              <Truck size={40} />
            </div>
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold mb-8 animate-fade-in mx-auto uppercase tracking-widest">
              <Sparkles size={14} />
              <span>Next-Gen E-commerce Intelligence</span>
            </div>
            
            <h1 className="font-headline text-5xl md:text-8xl font-bold mb-8 tracking-tighter leading-[0.95] max-w-5xl mx-auto">
              Grow Faster on Amazon,<br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-500 to-amber-600">
                Flipkart & Myntra with AI
              </span>
            </h1>

            <p className="text-slate-400 text-lg md:text-2xl max-w-3xl mx-auto mb-12 leading-relaxed px-4 font-medium">
              Scale your marketplace operations with specialized AI agents trained by e-commerce experts for photoshoots, listings, and growth intelligence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5 px-4">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="rounded-2xl px-10 text-lg h-16 w-full shadow-2xl shadow-primary/40 font-bold">
                  Start Free Trial <ArrowRight size={20} className="ml-2" />
                </Button>
              </Link>
              <Button 
                size="lg" 
                variant="outline" 
                className="rounded-2xl px-10 text-lg h-16 w-full sm:w-auto border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold"
                onClick={() => setDemoOpen(true)}
              >
                Book a Demo
              </Button>
            </div>

            <div className="mt-20 flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-40 grayscale filter">
               <span className="font-headline text-xl font-bold">AMAZON</span>
               <span className="font-headline text-xl font-bold">FLIPKART</span>
               <span className="font-headline text-xl font-bold">MYNTRA</span>
               <span className="font-headline text-xl font-bold">AJIO</span>
               <span className="font-headline text-xl font-bold">NYKAA</span>
            </div>
          </div>

          {/* Background Decorative Blurs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] opacity-20 pointer-events-none -z-10">
            <div className="absolute top-1/4 left-1/4 w-full h-full bg-primary/30 rounded-full blur-[160px]" />
            <div className="absolute bottom-1/4 right-1/4 w-full h-full bg-accent/30 rounded-full blur-[160px]" />
          </div>
        </section>

        {/* Services Showcase */}
        <section id="services" className="py-32 relative">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 gap-6">
              <div className="max-w-2xl text-left">
                <Badge variant="outline" className="mb-4 border-primary/30 text-primary uppercase font-bold tracking-widest bg-primary/5">The AI Studio</Badge>
                <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Our Core Agents</h2>
                <p className="text-slate-400 text-xl mt-4 leading-relaxed">Specialized automation tools built to eliminate every operational bottleneck in your e-commerce journey.</p>
              </div>
              <Link href="/signup">
                <Button variant="link" className="text-primary font-bold text-lg p-0">Explore All Capabilities <ChevronRight className="ml-1" /></Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service) => (
                <Card 
                  key={service.id} 
                  onClick={() => setServiceOpen(service.id)} 
                  className="group bg-slate-900/40 border-white/5 hover:border-primary/40 transition-all duration-500 cursor-pointer overflow-hidden backdrop-blur-sm rounded-3xl"
                >
                  <CardContent className="p-10">
                    <div className={`w-16 h-16 rounded-2xl ${service.bg} flex items-center justify-center ${service.color} mb-8 group-hover:scale-110 transition-all duration-500 shadow-xl`}>
                      <service.icon size={32} />
                    </div>
                    <h3 className="font-headline text-2xl font-bold mb-4 group-hover:text-primary transition-colors">{service.title}</h3>
                    <p className="text-slate-400 text-lg leading-relaxed">{service.desc}</p>
                    <div className="mt-8 flex items-center gap-2 text-sm font-bold text-slate-500 group-hover:text-primary transition-colors">
                      Learn More <ArrowRight size={16} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Methodology / How it Works */}
        <section id="how-it-works" className="py-32 bg-slate-900/20">
          <div className="container mx-auto px-4">
             <div className="text-center mb-24">
              <Badge variant="outline" className="mb-4 border-amber-500/30 text-amber-500 uppercase font-bold tracking-widest bg-amber-500/5">Our Methodology</Badge>
              <h2 className="font-headline text-4xl md:text-6xl font-bold tracking-tight">Scale in 3 Simple Steps</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 relative">
              {/* Connector line for desktop */}
              <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white/10 to-transparent z-0" />
              
              <div className="text-center space-y-6 relative z-10 group">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border-2 border-white/5 flex items-center justify-center text-primary text-4xl font-bold mx-auto shadow-2xl group-hover:border-primary/50 transition-all duration-500">1</div>
                <h3 className="text-2xl font-bold font-headline">Sync Brand Assets</h3>
                <p className="text-slate-400 text-lg leading-relaxed">Connect your Amazon, Flipkart or Myntra seller central accounts or upload raw product data.</p>
              </div>
              <div className="text-center space-y-6 relative z-10 group">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border-2 border-white/5 flex items-center justify-center text-primary text-4xl font-bold mx-auto shadow-2xl group-hover:border-primary/50 transition-all duration-500">2</div>
                <h3 className="text-2xl font-bold font-headline">AI Orchestration</h3>
                <p className="text-slate-400 text-lg leading-relaxed">Our agents automatically optimize listings, generate creatives, and identify market opportunities.</p>
              </div>
              <div className="text-center space-y-6 relative z-10 group">
                <div className="w-24 h-24 rounded-[2rem] bg-slate-900 border-2 border-white/5 flex items-center justify-center text-primary text-4xl font-bold mx-auto shadow-2xl group-hover:border-primary/50 transition-all duration-500">3</div>
                <h3 className="text-2xl font-bold font-headline">Accelerate ROAS</h3>
                <p className="text-slate-400 text-lg leading-relaxed">Launch high-converting campaigns instantly and watch your marketplace revenue multiply.</p>
              </div>
            </div>
          </div>
        </section>

        {/* About & Trust Section */}
        <section id="about" className="py-32 relative px-4">
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                <div className="space-y-8">
                  <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 uppercase font-bold tracking-widest bg-indigo-500/5">The Agency</Badge>
                  <h2 className="font-headline text-4xl md:text-6xl font-bold leading-tight tracking-tight">E-commerce Intelligence, Democratized.</h2>
                  <p className="text-slate-400 text-xl leading-relaxed">
                    We are a next-generation growth agency powered by proprietary AI. Our mission is to provide boutique brands with the same creative and strategic firepower usually reserved for enterprise budgets.
                  </p>
                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div className="space-y-2">
                      <p className="text-primary text-4xl font-bold font-headline">12%+</p>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Avg. CTR Boost</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-primary text-4xl font-bold font-headline">24/7</p>
                      <p className="text-slate-500 font-bold uppercase text-xs tracking-widest">Active Monitoring</p>
                    </div>
                  </div>
                  <Button className="rounded-2xl h-14 px-8 font-bold text-lg" variant="secondary">
                    Learn Our Story <ArrowRight size={18} className="ml-2" />
                  </Button>
                </div>

                <div className="space-y-8 bg-slate-900/40 border border-white/5 p-8 md:p-12 rounded-[3rem] shadow-2xl backdrop-blur-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-5">
                    <BrainCircuit size={200} />
                  </div>
                  <h3 className="text-3xl font-bold font-headline mb-8 relative z-10">Strategic Session</h3>
                  <div className="space-y-10 relative z-10">
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <MapPin size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-xl mb-1 text-white">Innovation Hub</p>
                        <p className="text-slate-400 text-lg">Udyog Vihar Phase-1, Gurgaon, India</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <Mail size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-xl mb-1 text-white">Direct Support</p>
                        <p className="text-slate-400 text-lg">growth@marketmindai.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-6 group">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0 group-hover:bg-primary group-hover:text-white transition-all">
                        <Phone size={24} />
                      </div>
                      <div>
                        <p className="font-bold text-xl mb-1 text-white">Strategy Hotline</p>
                        <p className="text-slate-400 text-lg">+91 88821 30155</p>
                      </div>
                    </div>
                  </div>
                  <div className="pt-8 border-t border-white/5 mt-10">
                    <Button onClick={() => setDemoOpen(true)} className="w-full h-16 rounded-2xl text-lg font-bold bg-white text-black hover:bg-slate-200">Book Demo Call</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Demo Modal */}
      <Dialog open={demoOpen} onOpenChange={setDemoOpen}>
        <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 bg-slate-900 border-white/10 text-white">
          <DialogHeader className="text-center items-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-4">
              <Zap size={32} />
            </div>
            <DialogTitle className="text-3xl font-headline font-bold">Strategy Session</DialogTitle>
            <DialogDescription className="text-slate-400 text-lg">
              Book a 15-minute diagnostic with our growth architects.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-5 py-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Full Name</Label>
              <Input id="name" placeholder="John Doe" className="rounded-xl h-14 bg-slate-800 border-white/5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Work Email</Label>
              <Input id="email" type="email" placeholder="john@company.com" className="rounded-xl h-14 bg-slate-800 border-white/5" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-slate-300 font-bold uppercase tracking-widest text-[10px]">Brand Name</Label>
              <Input id="company" placeholder="DTC Brand Ltd" className="rounded-xl h-14 bg-slate-800 border-white/5" />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3">
            <Button onClick={() => setDemoOpen(false)} variant="outline" className="flex-1 rounded-2xl h-14 border-white/10 text-white font-bold order-2 sm:order-1">Cancel</Button>
            <Button onClick={() => setDemoOpen(false)} className="flex-1 rounded-2xl h-14 font-bold shadow-xl shadow-primary/20 order-1 sm:order-2">Schedule Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Detail Modal */}
      <Dialog open={!!serviceOpen} onOpenChange={() => setServiceOpen(null)}>
        <DialogContent className="max-w-2xl rounded-[3rem] overflow-hidden p-0 max-h-[90vh] flex flex-col bg-slate-900 border-white/10 text-white">
          {serviceOpen && (
            <>
              <div className="p-8 md:p-12 bg-slate-800/50 border-b border-white/5 shrink-0">
                <div className="flex items-center gap-6 mb-6">
                   <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-xl">
                      {(() => {
                        const s = services.find(s => s.id === serviceOpen);
                        const Icon = s?.icon || Camera;
                        return <Icon size={32} />;
                      })()}
                   </div>
                   <DialogTitle className="text-3xl md:text-4xl font-headline font-bold">
                    {services.find(s => s.id === serviceOpen)?.title}
                   </DialogTitle>
                </div>
                <DialogDescription className="text-xl leading-relaxed text-slate-300">
                  {services.find(s => s.id === serviceOpen)?.details}
                </DialogDescription>
              </div>
              
              <div className="p-8 md:p-12 space-y-10 overflow-y-auto">
                {services.find(s => s.id === serviceOpen)?.hasUpload && (
                  <div className="space-y-4">
                    <Label className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Instant Demo</Label>
                    <input 
                      type="file" 
                      className="hidden" 
                      ref={fileInputRef} 
                      onChange={handleFileChange}
                      accept="image/*"
                    />
                    <div 
                      onClick={() => {
                        if (fileInputRef.current) fileInputRef.current.click();
                      }}
                      className="border-2 border-dashed border-white/10 rounded-[2rem] p-10 md:p-16 flex flex-col items-center justify-center gap-6 bg-slate-800/30 hover:bg-slate-800 transition-all cursor-pointer group"
                    >
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform shadow-2xl">
                        <Upload size={32} />
                      </div>
                      <div className="text-center">
                        <p className="font-bold text-2xl text-white">Upload Product Photo</p>
                        <p className="text-slate-500 mt-2">See the AI transformation in seconds</p>
                      </div>
                      <Button variant="outline" className="rounded-xl h-12 px-8 border-white/10 text-white font-bold">Select File</Button>
                    </div>
                  </div>
                )}

                <div className="space-y-6">
                  <h4 className="font-bold font-headline flex items-center gap-3 text-xl">
                    <CheckCircle2 size={24} className="text-primary" /> Key Performance Indicators
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["24/7 Agency Automation", "Marketplace Rule Compliant", "Cross-Platform Logic", "ROAS Optimization Engine"].map(item => (
                      <div key={item} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-800/50 border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                        <span className="font-medium text-slate-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 flex flex-col sm:flex-row gap-4">
                  <Link href="/signup" className="flex-1">
                    <Button className="w-full h-16 rounded-2xl text-xl font-bold shadow-xl shadow-primary/20">Try Agent Now</Button>
                  </Link>
                  <Button variant="ghost" className="h-16 rounded-2xl px-10 text-slate-400 font-bold" onClick={() => setServiceOpen(null)}>Close</Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <footer className="border-t border-white/5 py-24 bg-slate-950 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-1 space-y-8">
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-all">
                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                  <BrainCircuit className="text-white w-6 h-6" />
                </div>
                <span className="font-headline font-bold text-2xl tracking-tighter text-white">MarketMind AI</span>
              </Link>
              <p className="text-slate-500 leading-relaxed text-lg">
                Leading e-commerce growth agency scaling premier brands on India's biggest marketplaces with proprietary AI intelligence.
              </p>
              <div className="flex items-center gap-4">
                {["LI", "TW", "IG", "FB"].map(social => (
                  <div key={social} className="w-10 h-10 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center cursor-pointer hover:bg-primary hover:text-white transition-all text-xs font-bold text-slate-500">
                    {social}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-8 text-xl">Growth Solutions</h4>
              <ul className="space-y-4 text-lg text-slate-500">
                <li className="hover:text-primary transition-colors cursor-pointer">AI Photoshoots</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Listing Optimization</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Marketplace Onboarding</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Catalog Automation</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-8 text-xl">HQ Contact</h4>
              <ul className="space-y-6 text-lg text-slate-500">
                <li className="flex gap-4">
                  <MapPin size={24} className="text-primary shrink-0" />
                  <span>Udyog Vihar Phase-1, Gurgaon 122016</span>
                </li>
                <li className="flex gap-4 items-center">
                  <Mail size={24} className="text-primary shrink-0" />
                  <span>growth@marketmindai.com</span>
                </li>
                <li className="flex gap-4 items-center">
                  <Phone size={24} className="text-primary shrink-0" />
                  <span>+91 88821 30155</span>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-8 text-xl">Governance</h4>
              <ul className="space-y-4 text-lg text-slate-500">
                <li className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Service Terms</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Staff Access</li>
                <li className="hover:text-primary transition-colors cursor-pointer">Developer API</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <p className="text-slate-600 text-sm font-medium">© 2024 MarketMind Intelligence Agency. All rights reserved.</p>
            <div className="flex items-center gap-8 text-sm font-bold text-slate-600 uppercase tracking-widest">
              <span className="flex items-center gap-2"><Award size={14} className="text-primary" /> ISO 27001 Certified</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-500" /> AES-256 Encrypted</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) {
  return (
    <Card className="group hover:border-primary/50 transition-all duration-300 border-white/5 bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden h-full">
      <CardContent className="p-8 md:p-10">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-8 group-hover:scale-110 transition-transform">
          <Icon size={28} />
        </div>
        <h3 className="font-headline text-2xl font-bold mb-4">{title}</h3>
        <p className="text-slate-400 text-lg leading-relaxed">{desc}</p>
      </CardContent>
    </Card>
  );
}
