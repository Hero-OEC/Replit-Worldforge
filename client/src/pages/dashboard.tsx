import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import ProjectCard from "@/components/project-card";
import ProjectDialog from "@/components/project-dialog";
import type { ProjectWithStats } from "@shared/schema";

export default function Dashboard() {
  const [showProjectDialog, setShowProjectDialog] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useQuery<ProjectWithStats[]>({
    queryKey: ["/api/projects"],
  });

  return (
    <>
      <Navbar 
        searchPlaceholder="Search projects..."
        rightContent={
          <Button 
            onClick={() => setShowProjectDialog(true)}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Button>
        }
      />
      
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Welcome to WorldForge</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your comprehensive creative writing companion. Organize characters, build worlds, 
            manage timelines, and bring your stories to life.
          </p>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Projects</h2>
            <p className="text-gray-600">Manage and organize your creative writing projects</p>
          </div>
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
        open={showProjectDialog}
        onOpenChange={setShowProjectDialog}
      />
    </>
  );
}
