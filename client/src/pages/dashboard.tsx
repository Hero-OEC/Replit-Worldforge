import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Users, MapPin, Clock } from "lucide-react";
import Header from "@/components/layout/header";
import StatsCard from "@/components/stats-card";
import ProjectCard from "@/components/project-card";
import ProjectDialog from "@/components/project-dialog";
import RecentActivity from "@/components/recent-activity";
import type { ProjectWithStats } from "@shared/schema";

export default function Dashboard() {
  const [showNewProjectDialog, setShowNewProjectDialog] = useState(false);

  const { data: projects, isLoading: projectsLoading } = useQuery<ProjectWithStats[]>({
    queryKey: ["/api/projects"],
  });

  const { data: stats } = useQuery<{
    totalProjects: number;
    totalCharacters: number;
    totalLocations: number;
    totalEvents: number;
  }>({
    queryKey: ["/api/stats"],
  });

  return (
    <>
      <Header
        title="Your Projects"
        subtitle="Manage and organize your creative writing projects"
        onNewProject={() => setShowNewProjectDialog(true)}
        showNewProject={true}
      />

      <main className="flex-1 p-6 overflow-y-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Projects"
            value={stats?.totalProjects || 0}
            icon={BookOpen}
            iconColor="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="Total Characters"
            value={stats?.totalCharacters || 0}
            icon={Users}
            iconColor="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Total Locations"
            value={stats?.totalLocations || 0}
            icon={MapPin}
            iconColor="bg-purple-100 text-purple-600"
          />
          <StatsCard
            title="Timeline Events"
            value={stats?.totalEvents || 0}
            icon={Clock}
            iconColor="bg-orange-100 text-orange-600"
          />
        </div>

        {/* Projects Grid */}
        {projectsLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
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
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-6">Get started by creating your first worldbuilding project.</p>
            <button
              onClick={() => setShowNewProjectDialog(true)}
              className="worldforge-primary text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Create Your First Project
            </button>
          </div>
        )}

        {/* Recent Activity Section */}
        {projects && projects.length > 0 && <RecentActivity />}
      </main>

      <ProjectDialog
        open={showNewProjectDialog}
        onOpenChange={setShowNewProjectDialog}
      />
    </>
  );
}
