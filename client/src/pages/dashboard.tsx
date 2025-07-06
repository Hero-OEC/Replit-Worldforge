import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import ProjectCard from "@/components/project-card";
import ProjectDialog from "@/components/project-dialog";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import type { ProjectWithStats } from "@shared/schema";

export default function Dashboard() {
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useQuery<ProjectWithStats[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <>
      <Navbar 
        showProjectNav={false}
        
        rightContent={
          <Button 
            onClick={() => setShowProjectDialog(true)}
            className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] hover-glow animate-ripple hover-scale"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        }
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl font-bold text-[var(--color-950)] mb-4 animate-fade-in">Welcome to WorldForge</h1>
          <p className="text-xl text-[var(--color-700)] max-w-2xl mx-auto animate-slide-up">
            Your comprehensive creative writing companion. Organize characters, build worlds, 
            manage timelines, and bring your stories to life.
          </p>
        </div>

        {/* Projects Section */}
        <div className="mb-8 animate-slide-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[var(--color-950)] mb-2 animate-fade-in">Your Projects</h2>
            <p className="text-[var(--color-700)] animate-slide-up">Manage and organize your creative writing projects</p>
          </div>
        </div>

        {/* Projects Grid */}
        {projectsLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-[var(--worldforge-card)] rounded-xl shadow-sm border border-[var(--border)] p-6 animate-pulse">
                <div className="h-6 bg-[var(--color-200)] rounded mb-4"></div>
                <div className="h-4 bg-[var(--color-200)] rounded mb-6"></div>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="text-center">
                      <div className="w-8 h-8 bg-[var(--color-200)] rounded-lg mx-auto mb-2"></div>
                      <div className="h-6 bg-[var(--color-200)] rounded mb-1"></div>
                      <div className="h-3 bg-[var(--color-200)] rounded"></div>
                    </div>
                  ))}
                </div>
                <div className="h-4 bg-[var(--color-200)] rounded"></div>
              </div>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <div 
                key={project.id}
                className="animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 animate-slide-up">
            <div className="max-w-md mx-auto">
              <BookOpen className="mx-auto h-16 w-16 text-[var(--color-600)] mb-6 animate-bounce-gentle hover-scale" />
              <h3 className="text-2xl font-bold text-[var(--color-950)] mb-3 animate-fade-in">Welcome to WorldForge</h3>
              <p className="text-[var(--color-700)] mb-8 text-lg animate-slide-up">
                Begin your creative journey by creating your first worldbuilding project. 
                Organize characters, locations, timelines, and lore all in one place.
              </p>
              <Button
                onClick={() => setShowProjectDialog(true)}
                size="lg"
                className="worldforge-primary text-[var(--color-50)] hover:bg-[var(--color-600)] px-8 py-3 text-lg hover-glow animate-ripple hover-scale"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create Your First Project
              </Button>
            </div>
          </div>
        )}
      </main>

      <ProjectDialog
        open={showProjectDialog}
        onOpenChange={setShowProjectDialog}
      />
    </>
  );
}
