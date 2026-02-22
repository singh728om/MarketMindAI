"use client";

import { useState } from "react";
import { 
  FolderKanban, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ExternalLink,
  Trash2,
  Edit2,
  ChevronRight,
  Package,
  Zap,
  ShoppingBag,
  Sparkles,
  Video,
  Globe,
  Check,
  ListChecks,
  Info,
  Building2,
  Headphones
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AVAILABLE_SERVICES = [
  { id: "myntra-on", name: "Myntra Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Myntra" },
  { id: "amazon-on", name: "Amazon Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Amazon" },
  { id: "flipkart-on", name: "Flipkart Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Flipkart" },
  { id: "ajio-on", name: "Ajio Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Ajio" },
  { id: "nykaa-on", name: "Nykaa Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Nykaa" },
  { id: "listing-creation", name: "Listing Creation", category: "SEO", icon: ListChecks, marketplace: "Multi-channel" },
  { id: "listing-opt", name: "Listing Optimization", category: "SEO", icon: Zap, marketplace: "Multi-channel" },
  { id: "keyword-res", name: "Keyword Research", category: "SEO", icon: Search, marketplace: "Multi-channel" },
  { id: "photoshoot", name: "AI Photoshoot", category: "Creative", icon: Sparkles, marketplace: "Creative Studio" },
  { id: "video-ad", name: "AI Video Ad (15s)", category: "Creative", icon: Video, marketplace: "Creative Studio" },
  { id: "web-builder", name: "Website Store Builder", category: "Development", icon: Globe, marketplace: "Direct" },
  { id: "shopify", name: "Shopify Store", category: "Development", icon: ShoppingBag, marketplace: "Shopify" },
];

const INITIAL_PROJECTS = [
  {
    id: "proj-1",
    name: "Myntra Onboarding",
    marketplace: "Myntra",
    status: "In Progress",
    progress: 45,
    updatedAt: "1 hour ago",
    assets: 0,
    priority: "High",
    type: "Onboarding",
    icon: ShoppingBag,
    details: {
      listingsCreated: 12,
      listingsInProgress: 8,
      brandOnboarded: false,
      milestones: [
        { id: "m1", name: "Documentation Submission", completed: true },
        { id: "m2", name: "Brand Registry Approval", completed: true },
        { id: "m3", name: "Catalog Template Selection", completed: false },
        { id: "m4", name: "Final QC & Live", completed: false },
      ]
    }
  },
  {
    id: "proj-listing-1",
    name: "Listing Creation",
    marketplace: "Amazon India",
    status: "Drafting",
    progress: 30,
    updatedAt: "45 mins ago",
    assets: 15,
    priority: "High",
    type: "SEO",
    icon: ListChecks,
    details: {
      listingsCreated: 5,
      listingsInProgress: 25,
      brandOnboarded: true,
      milestones: [
        { id: "l1", name: "Product Data Ingestion", completed: true },
        { id: "l2", name: "AI Copy Generation", completed: false },
        { id: "l3", name: "Image Attachment", completed: false },
        { id: "l4", name: "Bulk Marketplace Push", completed: false },
      ]
    }
  },
  {
    id: "proj-2",
    name: "Amazon Onboarding",
    marketplace: "Amazon",
    status: "Verification",
    progress: 75,
    updatedAt: "3 hours ago",
    assets: 10,
    priority: "Medium",
    type: "Onboarding",
    icon: ShoppingBag,
    details: {
      listingsCreated: 25,
      listingsInProgress: 5,
      brandOnboarded: true,
      milestones: [
        { id: "a1", name: "Account Setup", completed: true },
        { id: "a2", name: "Brand Authorization", completed: true },
        { id: "a3", name: "Inventory Syncing", completed: true },
        { id: "a4", name: "Final Marketplace Sync", completed: false },
      ]
    }
  },
  {
    id: "proj-3",
    name: "Listing Optimization (Bulk)",
    marketplace: "Flipkart",
    status: "Completed",
    progress: 100,
    updatedAt: "1 day ago",
    assets: 25,
    priority: "High",
    type: "SEO",
    icon: Zap,
    details: {
      listingsCreated: 50,
      listingsInProgress: 0,
      brandOnboarded: true,
      milestones: [
        { id: "f1", name: "Keyword Analysis", completed: true },
        { id: "f2", name: "Copywriting Optimization", completed: true },
        { id: "f3", name: "Bulk Upload Prep", completed: true },
        { id: "f4", name: "Listing Audit", completed: true },
      ]
    }
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const { toast } = useToast();

  const handleAction = (action: string, projectName: string) => {
    toast({
      title: `${action} Successful`,
      description: `Action applied to ${projectName}. Our team will contact you shortly.`,
    });
  };

  const handleStartService = (service: typeof AVAILABLE_SERVICES[0]) => {
    const exists = projects.some(p => p.name === service.name);
    
    if (exists) {
      toast({
        variant: "destructive",
        title: "Service Already Active",
        description: `You already have an active project for ${service.name}.`,
      });
      return;
    }

    const newProject = {
      id: `proj-${Date.now()}`,
      name: service.name,
      marketplace: service.marketplace,
      status: "Initial Setup",
      progress: 5,
      updatedAt: "Just now",
      assets: 0,
      priority: "Medium",
      type: service.category,
      icon: service.icon,
      details: {
        listingsCreated: 0,
        listingsInProgress: 1,
        brandOnboarded: false,
        milestones: [
          { id: "new1", name: "Account Activation", completed: false },
          { id: "new2", name: "Milestone Documentation", completed: false },
          { id: "new3", name: "Brand Verification", completed: false },
          { id: "new4", name: "Initial Listing Creation", completed: false },
        ]
      }
    };

    setProjects([newProject, ...projects]);
    setIsDialogOpen(false);
    toast({
      title: "Service Started!",
      description: `${service.name} has been added to your opted projects.`,
    });
  };

  const toggleMilestone = (projectId: string, milestoneId: string) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== projectId) return p;
      const updatedMilestones = p.details.milestones.map((m: any) => 
        m.id === milestoneId ? { ...m, completed: !m.completed } : m
      );
      const completedCount = updatedMilestones.filter((m: any) => m.completed).length;
      const newProgress = Math.round((completedCount / updatedMilestones.length) * 100);
      
      return {
        ...p,
        progress: newProgress,
        status: newProgress === 100 ? "Completed" : "In Progress",
        details: { ...p.details, milestones: updatedMilestones }
      };
    }));
    
    // Update local selectedProject state if open
    if (selectedProject?.id === projectId) {
      const updatedProj = projects.find(p => p.id === projectId);
      if (updatedProj) setSelectedProject({ ...updatedProj });
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.marketplace.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Opted Projects</h1>
          <p className="text-muted-foreground">Track the progress of your marketplace onboarding and AI services.</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="shadow-lg shadow-primary/20 rounded-xl h-12 px-6">
              <Plus className="w-4 h-4 mr-2" /> Start New Service
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl bg-card border-white/10 rounded-3xl overflow-hidden max-h-[85vh] flex flex-col p-0">
            <DialogHeader className="p-8 pb-0">
              <DialogTitle className="text-2xl font-headline">Opt for New Service</DialogTitle>
              <DialogDescription>
                Select a marketplace onboarding or AI creative service to initiate.
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-8 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AVAILABLE_SERVICES.map((service) => {
                const isActive = projects.some(p => p.name === service.name);
                return (
                  <div 
                    key={service.id}
                    onClick={() => !isActive && handleStartService(service)}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                      isActive 
                        ? "opacity-50 cursor-not-allowed bg-muted/20 border-white/5" 
                        : "border-white/5 bg-white/5 hover:bg-primary/5 hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                        isActive ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
                      )}>
                        <service.icon size={20} />
                      </div>
                      <div className="space-y-0.5">
                        <p className="font-bold text-sm leading-tight">{service.name}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">{service.category}</p>
                      </div>
                    </div>
                    {isActive ? (
                      <Check size={16} className="text-emerald-500" />
                    ) : (
                      <ChevronRight size={16} className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                );
              })}
            </div>
            <DialogFooter className="p-6 bg-muted/20 border-t">
              <Button variant="ghost" onClick={() => setIsDialogOpen(false)} className="rounded-xl">Cancel</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search onboarding, SEO, or creative projects..." 
            className="pl-10 h-12 rounded-xl bg-card border-white/5"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="h-12 rounded-xl px-6 border-white/5 bg-card">
          <Filter className="w-4 h-4 mr-2" /> Filter
        </Button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProjects.map((project) => (
          <Card 
            key={project.id} 
            className="rounded-2xl border-white/5 bg-card hover:border-primary/30 transition-all overflow-hidden group cursor-pointer"
            onClick={() => setSelectedProject(project)}
          >
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                      <project.icon size={16} />
                    </div>
                    <CardTitle className="font-headline text-lg">{project.name}</CardTitle>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={project.status === 'Completed' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold">
                      {project.status}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">
                      {project.marketplace}
                    </Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-white/10">
                    <DropdownMenuItem onClick={() => setSelectedProject(project)}>
                      <Edit2 size={14} className="mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("Support", project.name)}>
                      <Headphones size={14} className="mr-2" /> Contact Agent
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleAction("Cancel", project.name)}>
                      <Trash2 size={14} className="mr-2" /> Cancel Service
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-muted-foreground uppercase tracking-widest">Service Completion</span>
                  <span className="text-primary">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-6">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Project Type</span>
                    <span className="text-sm font-bold text-foreground">{project.type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Updated</span>
                    <span className="text-sm font-bold">{project.updatedAt}</span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors">
                  Details <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-secondary/10 rounded-3xl border-2 border-dashed border-white/5">
             <FolderKanban size={48} className="mx-auto text-muted-foreground opacity-20" />
             <div className="space-y-2">
                <h3 className="text-xl font-bold font-headline">No matching services</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Start a new onboarding or AI project to see it here.</p>
             </div>
             <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        )}
      </div>

      {/* Project Details Dialog */}
      <Dialog open={!!selectedProject} onOpenChange={(open) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-3xl bg-card border-white/10 rounded-3xl overflow-hidden max-h-[90vh] flex flex-col p-0">
          {selectedProject && (
            <>
              <DialogHeader className="p-8 pb-4 bg-primary/5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary text-white flex items-center justify-center">
                    <selectedProject.icon size={24} />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-headline font-bold">{selectedProject.name}</DialogTitle>
                    <DialogDescription className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="border-primary/20 text-primary">{selectedProject.marketplace}</Badge>
                      <span className="text-muted-foreground text-xs uppercase font-bold tracking-widest">{selectedProject.type} Service</span>
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {/* Onboarding & Listing Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="bg-background border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                    <Building2 className="text-primary mb-2" size={24} />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Brand Status</p>
                    <Badge variant={selectedProject.details.brandOnboarded ? "default" : "secondary"} className="mt-1">
                      {selectedProject.details.brandOnboarded ? "Onboarded" : "Pending Approval"}
                    </Badge>
                  </Card>
                  
                  <Card className="bg-background border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                    <ListChecks className="text-emerald-500 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Listings Created</p>
                    <p className="text-2xl font-bold">{selectedProject.details.listingsCreated}</p>
                  </Card>
                  
                  <Card className="bg-background border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
                    <Clock className="text-amber-500 mb-2" size={24} />
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">In Progress</p>
                    <p className="text-2xl font-bold">{selectedProject.details.listingsInProgress}</p>
                  </Card>
                </div>

                {/* Overall Progress */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Service Completion</Label>
                    <span className="text-lg font-bold text-primary">{selectedProject.progress}%</span>
                  </div>
                  <Progress value={selectedProject.progress} className="h-3" />
                </div>

                {/* Milestones Tracker */}
                <div className="space-y-4">
                  <Label className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Marketplace Milestones (Click to toggle completion)</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedProject.details.milestones.map((milestone: any) => (
                      <div 
                        key={milestone.id} 
                        onClick={() => toggleMilestone(selectedProject.id, milestone.id)}
                        className={cn(
                          "flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer group",
                          milestone.completed ? "bg-emerald-500/5 border-emerald-500/20" : "bg-muted/20 border-white/5 hover:bg-muted/30"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          {milestone.completed ? (
                            <CheckCircle2 className="text-emerald-500" size={20} />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted group-hover:border-primary transition-colors" />
                          )}
                          <span className={cn(
                            "font-medium",
                            milestone.completed ? "text-foreground" : "text-muted-foreground"
                          )}>{milestone.name}</span>
                        </div>
                        {milestone.completed ? (
                          <Badge variant="outline" className="text-[10px] border-emerald-500/20 text-emerald-500 bg-emerald-500/5">DONE</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-[10px]">PENDING</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assistance Info */}
                <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-4 flex items-start gap-3">
                  <Info size={20} className="text-blue-500 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-bold text-blue-500">Need Assistance?</p>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Our account managers are available 24/7 to help you with marketplace specific requirements for {selectedProject.marketplace}. Click 'Contact Agent' below to start a chat.
                    </p>
                  </div>
                </div>
              </div>
              
              <DialogFooter className="p-6 bg-muted/20 border-t flex gap-2">
                <Button variant="outline" className="flex-1 h-12 rounded-xl" onClick={() => setSelectedProject(null)}>Close</Button>
                <Button 
                  className="flex-1 h-12 rounded-xl shadow-lg shadow-primary/20" 
                  onClick={() => handleAction("Support", selectedProject.name)}
                >
                  <Headphones size={16} className="mr-2" /> Contact Agent
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
