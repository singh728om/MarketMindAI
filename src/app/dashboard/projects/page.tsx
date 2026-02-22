
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
  Edit2
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
import { useToast } from "@/hooks/use-toast";

const MOCK_PROJECTS = [
  {
    id: "proj-1",
    name: "Summer Ethnic Launch '24",
    marketplace: "Myntra",
    status: "Active",
    progress: 65,
    updatedAt: "2 hours ago",
    assets: 12,
    priority: "High"
  },
  {
    id: "proj-2",
    name: "Amazon Great Indian Festival",
    marketplace: "Amazon",
    status: "Planning",
    progress: 15,
    updatedAt: "1 day ago",
    assets: 4,
    priority: "High"
  },
  {
    id: "proj-3",
    name: "Flipkart Big Billion Day Prep",
    marketplace: "Flipkart",
    status: "Completed",
    progress: 100,
    updatedAt: "3 days ago",
    assets: 45,
    priority: "Medium"
  },
  {
    id: "proj-4",
    name: "New Arrivals: Silk Collection",
    marketplace: "Ajio",
    status: "Active",
    progress: 40,
    updatedAt: "5 hours ago",
    assets: 8,
    priority: "Medium"
  }
];

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();

  const handleAction = (action: string, projectName: string) => {
    toast({
      title: `${action} Successful`,
      description: `Action applied to ${projectName}.`,
    });
  };

  const filteredProjects = MOCK_PROJECTS.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.marketplace.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-headline font-bold mb-1">Campaign Projects</h1>
          <p className="text-muted-foreground">Manage your marketplace product launches and marketing campaigns.</p>
        </div>
        <Button className="shadow-lg shadow-primary/20 rounded-xl h-12 px-6">
          <Plus className="w-4 h-4 mr-2" /> New Project
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input 
            placeholder="Search projects by name or marketplace..." 
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
                    <CardTitle className="font-headline text-xl">{project.name}</CardTitle>
                    <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="text-[10px] uppercase font-bold">
                      {project.status}
                    </Badge>
                  </div>
                  <CardDescription className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-bold border-primary/20 text-primary">
                      {project.marketplace}
                    </Badge>
                    <span className="text-[10px]">•</span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock size={12} /> Updated {project.updatedAt}
                    </span>
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                      <MoreVertical size={16} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="rounded-xl border-white/10">
                    <DropdownMenuItem onClick={() => handleAction("Edit", project.name)}>
                      <Edit2 size={14} className="mr-2" /> Edit Project
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleAction("View", project.name)}>
                      <ExternalLink size={14} className="mr-2" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => handleAction("Delete", project.name)}>
                      <Trash2 size={14} className="mr-2" /> Delete Project
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold mb-1">
                  <span className="text-muted-foreground uppercase tracking-widest">Launch Progress</span>
                  <span className="text-primary">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-2" />
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">AI Assets</span>
                    <span className="text-sm font-bold">{project.assets} Files</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Priority</span>
                    <span className={`text-sm font-bold ${project.priority === 'High' ? 'text-rose-500' : 'text-amber-500'}`}>
                      {project.priority}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors">
                  Open Project <ChevronRight className="ml-1 w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {filteredProjects.length === 0 && (
          <div className="col-span-full py-20 text-center space-y-4 bg-secondary/10 rounded-3xl border-2 border-dashed border-white/5">
             <FolderKanban size={48} className="mx-auto text-muted-foreground opacity-20" />
             <div className="space-y-2">
                <h3 className="text-xl font-bold font-headline">No campaigns found</h3>
                <p className="text-muted-foreground max-w-xs mx-auto">Try adjusting your search or create a new campaign to get started.</p>
             </div>
             <Button variant="outline" onClick={() => setSearchQuery("")}>Clear Search</Button>
          </div>
        )}
      </div>
    </div>
  );
}

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
