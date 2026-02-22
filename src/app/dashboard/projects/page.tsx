
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
  Check
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
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const AVAILABLE_SERVICES = [
  { id: "myntra-on", name: "Myntra Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Myntra" },
  { id: "amazon-on", name: "Amazon Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Amazon" },
  { id: "flipkart-on", name: "Flipkart Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Flipkart" },
  { id: "ajio-on", name: "Ajio Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Ajio" },
  { id: "nykaa-on", name: "Nykaa Onboarding", category: "Onboarding", icon: ShoppingBag, marketplace: "Nykaa" },
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
    icon: ShoppingBag
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
    icon: ShoppingBag
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
    icon: Zap
  },
  {
    id: "proj-4",
    name: "AI Photoshoot Session",
    marketplace: "Multi-channel",
    status: "Active",
    progress: 20,
    updatedAt: "30 mins ago",
    assets: 8,
    priority: "High",
    type: "Creative",
    icon: Sparkles
  }
];

export default function ProjectsPage() {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleAction = (action: string, projectName: string) => {
    toast({
      title: `${action} Successful`,
      description: `Action applied to ${projectName}.`,
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
      icon: service.icon
    };

    setProjects([newProject, ...projects]);
    setIsDialogOpen(false);
    toast({
      title: "Service Started!",
      description: `${service.name} has been added to your opted projects.`,
    });
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
          <Card key={project.id} className="rounded-2xl border-white/5 bg-card hover:border-primary/30 transition-all overflow-hidden group">
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
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-white/10">
                    <DropdownMenuItem onClick={() => handleAction("Edit", project.name)}>
                      <Edit2 size={14} className="mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("Support", project.name)}>
                      <ExternalLink size={14} className="mr-2" /> Contact Agent
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
                  {project.assets > 0 && (
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Assets</span>
                      <span className="text-sm font-bold">{project.assets} Files</span>
                    </div>
                  )}
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
    </div>
  );
}
