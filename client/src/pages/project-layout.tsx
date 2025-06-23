import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, Users, MapPin, Sparkles, Scroll, Settings, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
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

  const { data: project, isLoading } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4 animate-pulse" />
          <p className="text-gray-600">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)] flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
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
        searchPlaceholder="Search project..."
      />

      {/* Project Overview */}
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Project Overview</h2>
            <p className="text-gray-600 leading-relaxed">{project.description}</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Users className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Characters</p>
                  <p className="text-2xl font-bold text-gray-900">{project.stats.charactersCount}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Locations</p>
                  <p className="text-2xl font-bold text-gray-900">{project.stats.locationsCount}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-lg">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Timeline Events</p>
                  <p className="text-2xl font-bold text-gray-900">{project.stats.eventsCount}</p>
                </div>
              </div>
            </Card>

            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Magic Systems</p>
                  <p className="text-2xl font-bold text-gray-900">{project.stats.magicSystemsCount}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={`/project/${projectId}/${item.href}`}>
                  <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="text-center">
                      <div className="flex items-center justify-center w-16 h-16 bg-orange-500 rounded-lg mx-auto mb-4">
                        <Icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                      <p className="text-sm text-gray-600">
                        {item.name === "Timeline" && "Organize story events"}
                        {item.name === "Characters" && "Manage character profiles"}
                        {item.name === "Locations" && "Document world places"}
                        {item.name === "Lore" && "Define magical systems"}
                        {item.name === "Notes" && "Keep project notes"}
                      </p>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}