import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Users, MapPin, Sparkles, Scroll, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import EditingHistoryTable from "@/components/editing-history-table";
import type { ProjectWithStats } from "@shared/schema";

const navigation = [
  { name: "Timeline", href: "timeline", icon: Clock },
  { name: "Characters", href: "characters", icon: Users },
  { name: "Locations", href: "locations", icon: MapPin },
  { name: "Lore", href: "lore", icon: Sparkles },
  { name: "Notes", href: "notes", icon: Scroll },
];

export default function ProjectLayout() {
  const { projectId } = useParams();
  const [location] = useLocation();

  const { data: project, isLoading, error } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle="Loading..."
          showProjectNav={true}
        />

        {/* Project Overview Skeleton */}
        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8 animate-pulse">
              <div className="h-8 bg-[var(--color-200)] rounded w-64 mb-2"></div>
              <div className="h-6 bg-[var(--color-200)] rounded w-40 mb-4"></div>
              <div className="h-4 bg-[var(--color-200)] rounded w-full"></div>
              <div className="h-4 bg-[var(--color-200)] rounded w-3/4 mt-2"></div>
            </div>

            {/* Quick Stats Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="bg-[var(--color-100)] border border-[var(--color-300)] p-6 animate-pulse">
                  <div className="flex items-center">
                    <div className="p-3 bg-[var(--color-200)] rounded-lg w-11 h-11"></div>
                    <div className="ml-4 flex-1">
                      <div className="h-4 bg-[var(--color-200)] rounded w-24 mb-2"></div>
                      <div className="h-8 bg-[var(--color-200)] rounded w-12"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Editing History Skeleton */}
            <Card className="bg-[var(--color-100)] border border-[var(--color-300)] p-6 animate-pulse">
              <div className="h-6 bg-[var(--color-200)] rounded w-48 mb-4"></div>
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-[var(--color-200)] rounded"></div>
                    <div className="flex-1 h-4 bg-[var(--color-200)] rounded"></div>
                    <div className="w-24 h-4 bg-[var(--color-200)] rounded"></div>
                    <div className="w-20 h-4 bg-[var(--color-200)] rounded"></div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">Error loading project</h3>
          <p className="text-[var(--color-700)] mb-4">
            {error instanceof Error ? error.message : "Something went wrong"}
          </p>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">Project not found</h3>
          <Link href="/">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project.title}
        showProjectNav={true}
        
      />

      {/* Project Overview */}
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[var(--color-950)] mb-2">{project.title}</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Overview</h2>
            <p className="text-[var(--color-700)] leading-relaxed">{project.description}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[var(--color-100)] border border-[var(--color-300)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-[var(--color-200)] text-[var(--color-700)] rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-700)]">Timeline Events</p>
                  <p className="text-2xl font-bold text-[var(--color-950)]">{project.stats?.eventsCount || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--color-100)] border border-[var(--color-300)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-[var(--color-200)] text-[var(--color-700)] rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-700)]">Characters</p>
                  <p className="text-2xl font-bold text-[var(--color-950)]">{project.stats?.charactersCount || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--color-100)] border border-[var(--color-300)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-[var(--color-200)] text-[var(--color-700)] rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-700)]">Locations</p>
                  <p className="text-2xl font-bold text-[var(--color-950)]">{project.stats?.locationsCount || 0}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--color-100)] border border-[var(--color-300)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-[var(--color-200)] text-[var(--color-700)] rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-[var(--color-700)]">Magic Systems</p>
                  <p className="text-2xl font-bold text-[var(--color-950)]">{project.stats?.magicSystemsCount || 0}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Editing History */}
          <EditingHistoryTable projectId={projectId!} />
        </div>
      </main>
    </div>
  );
}