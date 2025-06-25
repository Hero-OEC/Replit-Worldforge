import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Trash2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import type { MagicSystem, ProjectWithStats } from "@shared/schema";

export default function MagicSystemDetail() {
  const { projectId, magicSystemId } = useParams<{ projectId: string; magicSystemId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const { data: magicSystem, isLoading } = useQuery<MagicSystem>({
    queryKey: ["/api/magic-systems", magicSystemId],
    queryFn: async () => {
      const response = await fetch(`/api/magic-systems/${magicSystemId}`);
      if (!response.ok) throw new Error("Failed to fetch magic system");
      return response.json();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/magic-systems/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete magic system");
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", projectId] });
      toast({
        title: "Magic system deleted",
        description: "The magic system has been removed successfully.",
      });
      setLocation(`/project/${projectId}/magic-systems`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete magic system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this magic system?")) {
      deleteMutation.mutate(parseInt(magicSystemId!));
    }
  };

  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
          searchPlaceholder="Search magic systems..."
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!magicSystem) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
          searchPlaceholder="Search magic systems..."
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Magic System Not Found</h2>
              <p className="text-gray-600 mb-4">The magic system you're looking for doesn't exist.</p>
              <Button onClick={() => setLocation(`/project/${projectId}/magic-systems`)}>
                Back to Magic Systems
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(magicSystem.category || "magic");

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search magic systems..."
      />
      
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3 flex-1">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <CategoryIcon className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{magicSystem.name}</h1>
                <p className="text-gray-600 capitalize">{magicSystem.category || "magic"} System</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={() => setLocation(`/project/${projectId}/magic-systems/${magicSystemId}/edit`)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="mechanics">Mechanics</TabsTrigger>
              <TabsTrigger value="limitations">Limitations</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {magicSystem.description ? (
                    <p className="text-gray-700 leading-relaxed">{magicSystem.description}</p>
                  ) : (
                    <p className="text-gray-500 italic">No description provided</p>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)]">
                  <CardHeader>
                    <CardTitle>Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {magicSystem.source ? (
                      <p className="text-gray-700">{magicSystem.source}</p>
                    ) : (
                      <p className="text-gray-500 italic">No source specified</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)]">
                  <CardHeader>
                    <CardTitle>Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {magicSystem.cost ? (
                      <p className="text-gray-700">{magicSystem.cost}</p>
                    ) : (
                      <p className="text-gray-500 italic">No cost specified</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mechanics" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>How It Works</CardTitle>
                </CardHeader>
                <CardContent>
                  {magicSystem.rules ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{magicSystem.rules}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No rules or mechanics defined</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limitations" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)]">
                <CardHeader>
                  <CardTitle>Restrictions & Limitations</CardTitle>
                </CardHeader>
                <CardContent>
                  {magicSystem.limitations ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{magicSystem.limitations}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No limitations specified</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}