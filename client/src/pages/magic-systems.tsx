import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/layout/navbar";
import type { ProjectWithStats } from "@shared/schema";

export default function MagicSystems() {
  const { projectId } = useParams<{ projectId: string }>();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search magic systems..."
      />
      
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Magic & Power Systems</h3>
            <p className="text-gray-500 mb-6">Document magical rules, power sources, limitations, and costs.</p>
            <Card className="max-w-md mx-auto p-6 bg-[var(--worldforge-card)] border border-[var(--border)]">
              <p className="text-sm text-gray-600">
                Magic system documentation will be implemented here. This will include 
                system creation forms, rule definitions, power scaling, limitations, 
                magical sources, and cost structures.
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
