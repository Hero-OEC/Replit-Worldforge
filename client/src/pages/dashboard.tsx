import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Plus, Search, Sun } from "lucide-react";
import ProjectCard from "@/components/project-card";
import ProjectDialog from "@/components/project-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { ProjectWithStats } from "@shared/schema";

export default function Dashboard() {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useQuery<ProjectWithStats[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      {/* Header */}
      <header className="bg-[var(--worldforge-card)] border-b border-[var(--border)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 worldforge-primary rounded-lg flex items-center justify-center">
              <BookOpen className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">WorldForge</h1>
              <p className="text-xs text-gray-500">Your Creative Writing Companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            {/* Search Bar */}
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search projects..." 
                className="pl-10 pr-4 py-2 w-64 bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            {/* Theme Toggle */}
            <Button variant="ghost" size="icon">
              <Sun className="w-4 h-4" />
            </Button>
            
            {/* New Project Button */}
            <Button 
              onClick={() => setShowNewProjectDialog(true)} 
              className="worldforge-primary text-white hover:bg-orange-600"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          </div>
        </div>
      </header>

      <main className="p-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h2>
          <p className="text-gray-600">Manage and organize your creative writing projects</p>
        </div>

        {/* Projects Grid */}
        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[var(--worldforge-card)] rounded-xl shadow-sm border border-[var(--border)] p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded mb-6"></div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="text-center">
                      <div className="w-8 h-8 bg-gray-200 rounded-lg mx-auto mb-2"></div>
                      <div className="h-6 bg-gray-200 rounded mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="h-4 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-6" />
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to WorldForge</h3>
              <p className="text-gray-600 mb-8 text-lg">
                Begin your creative journey by creating your first worldbuilding project. 
                Organize characters, locations, timelines, and lore all in one place.
              </p>
              <Button
                onClick={() => setShowNewProjectDialog(true)}
                size="lg"
                className="worldforge-primary text-white hover:bg-orange-600 px-8 py-3 text-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </div>
        )}
      </main>

      <ProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      />
    </div>
  );
}
