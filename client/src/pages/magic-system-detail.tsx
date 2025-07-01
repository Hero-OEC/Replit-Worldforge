import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Trash2, Sparkles, Zap, Users, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Navbar from "@/components/layout/navbar";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import type { MagicSystem, Character, ProjectWithStats } from "@shared/schema";
import placeholderImage from "@assets/Placeholder_1750916543106.jpg";

export default function MagicSystemDetail() {
  const { projectId, magicSystemId } = useParams<{ projectId: string; magicSystemId: string }>();
  const [, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-purple-100 text-purple-800";
  };

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

  const { data: connectedCharacters = [] } = useQuery<Character[]>({
    queryKey: ["/api/magic-systems", magicSystemId, "characters"],
    queryFn: async () => {
      if (!magicSystemId) return [];
      const response = await fetch(`/api/magic-systems/${magicSystemId}/characters`);
      if (!response.ok) throw new Error("Failed to fetch connected characters");
      return response.json();
    },
    enabled: !!magicSystemId,
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
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(parseInt(magicSystemId!));
    setDeleteDialogOpen(false);
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
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-[var(--color-950)] mb-2">Loading...</h2>
              <p className="text-[var(--color-700)]">Fetching magic system details.</p>
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
              <h2 className="text-xl font-semibold text-[var(--color-950)] mb-2">Magic System Not Found</h2>
              <p className="text-[var(--color-700)] mb-4">The magic system you're looking for doesn't exist.</p>
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

  // connectedCharacters now comes directly from the API with proper relationships

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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center">
                  <CategoryIcon className="w-5 h-5 text-[var(--color-50)]" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">{magicSystem.name}</h1>
                  <div className="mt-2">
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 ${getCategoryColor(magicSystem.category || "magic")} rounded-full text-sm font-medium`}>
                      <CategoryIcon className="w-4 h-4" />
                      <span>{magicSystem.category === "power" ? "Power System" : "Magic System"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setLocation(`/project/${projectId}/magic-systems/${magicSystemId}/edit`)}
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-destructive border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-[var(--color-100)]">
              <TabsTrigger value="overview" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Overview</TabsTrigger>
              <TabsTrigger value="mechanics" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Mechanics</TabsTrigger>
              <TabsTrigger value="limitations" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Limitations</TabsTrigger>
              <TabsTrigger value="characters" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Characters ({connectedCharacters.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Description</CardTitle>
                </CardHeader>
                <CardContent>
                  {magicSystem.description ? (
                    <p className="text-[var(--color-700)] leading-relaxed">{magicSystem.description}</p>
                  ) : (
                    <p className="text-[var(--color-600)] italic">No description provided</p>
                  )}
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--worldforge-card)] border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">Source</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {magicSystem.source ? (
                      <p className="text-[var(--color-700)]">{magicSystem.source}</p>
                    ) : (
                      <p className="text-[var(--color-600)] italic">No source specified</p>
                    )}
                  </CardContent>
                </Card>

                <Card className="bg-[var(--worldforge-card)] border border-gray-200">
                  <CardHeader>
                    <CardTitle className="text-lg text-gray-800">Cost</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {magicSystem.cost ? (
                      <p className="text-[var(--color-700)]">{magicSystem.cost}</p>
                    ) : (
                      <p className="text-[var(--color-600)] italic">No cost specified</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="mechanics" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Rules & Mechanics</CardTitle>
                </CardHeader>
                <CardContent>
                  {magicSystem.rules ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-[var(--color-700)] leading-relaxed whitespace-pre-wrap">{magicSystem.rules}</p>
                    </div>
                  ) : (
                    <p className="text-[var(--color-600)] italic">No rules specified</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="limitations" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Limitations & Restrictions</CardTitle>
                </CardHeader>
                <CardContent>
                  {magicSystem.limitations ? (
                    <div className="prose prose-gray max-w-none">
                      <p className="text-[var(--color-700)] leading-relaxed whitespace-pre-wrap">{magicSystem.limitations}</p>
                    </div>
                  ) : (
                    <p className="text-[var(--color-600)] italic">No limitations specified</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="characters" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-gray-200">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800">Connected Characters</CardTitle>
                </CardHeader>
                <CardContent>
                  {connectedCharacters.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {connectedCharacters.map((character) => (
                        <Link 
                          key={character.id} 
                          href={`/project/${projectId}/characters/${character.id}`}
                          className="block"
                        >
                          <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                                <img 
                                  src={placeholderImage} 
                                  alt={character.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-[var(--color-950)] truncate">{character.name}</h3>
                                <p className="text-sm text-[var(--color-700)] truncate">{character.role || "Character"}</p>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Users className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
                      <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No Characters Yet</h3>
                      <p className="text-[var(--color-600)]">
                        No characters are currently using this {magicSystem.category === "power" ? "power" : "magic"} system.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {magicSystem && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete Magic System"
          itemName={magicSystem.name}
          description={`Are you sure you want to delete "${magicSystem.name}"? This action cannot be undone and will permanently remove the magic system and all associated data.`}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}