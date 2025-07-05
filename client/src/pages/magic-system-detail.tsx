import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import { ArrowLeft, Edit3, Trash2, Sparkles, Zap, Users, MoreHorizontal, Crown, Shield, Sword, UserCheck, UserX, HelpCircle, X, Battery, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
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
  const { goBack } = useNavigation();

  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" 
      ? "bg-[var(--color-200)] text-[var(--color-950)]" 
      : "bg-[var(--color-300)] text-[var(--color-950)]";
  };

  // Character role configuration
  const roleConfig = {
    "Protagonist": { icon: Crown, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-500)] text-[var(--color-50)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" },
    "Antagonist": { icon: Sword, color: "bg-[var(--color-950)]", bgColor: "bg-[var(--color-700)] text-[var(--color-50)]", textColor: "text-[var(--color-950)]", borderColor: "border-[var(--color-700)]" },
    "Ally": { icon: Shield, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-400)] text-[var(--color-950)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-300)]" },
    "Enemy": { icon: UserX, color: "bg-[var(--color-800)]", bgColor: "bg-[var(--color-600)] text-[var(--color-50)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-600)]" },
    "Neutral": { icon: Scale, color: "bg-[var(--color-400)]", bgColor: "bg-[var(--color-300)] text-[var(--color-900)]", textColor: "text-[var(--color-600)]", borderColor: "border-[var(--color-300)]" },
    "Supporting": { icon: UserCheck, color: "bg-[var(--color-700)]", bgColor: "bg-[var(--color-200)] text-[var(--color-800)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" }
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
        
      />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost" 
                  onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Magic Systems
                </Button>
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
                  className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {/* Header with Title Display */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
                <CategoryIcon className="w-6 h-6 text-[var(--color-700)]" />
              </div>
              <div className="flex-1 max-w-md">
                <h1 className="text-2xl font-bold text-[var(--color-950)]">{magicSystem.name}</h1>
              </div>
            </div>

            {/* Category Display */}
            <div className="ml-16">
              <div className={`inline-flex items-center space-x-2 px-3 py-1 ${getCategoryColor(magicSystem.category || "magic")} rounded-full text-sm font-medium`}>
                <CategoryIcon className="w-4 h-4" />
                <span>{magicSystem.category === "power" ? "Power System" : "Magic System"}</span>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Sparkles className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Description</span>
            </div>
            <div className="bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg p-4 min-h-48">
              {magicSystem.description ? (
                <p className="text-[var(--color-950)] leading-relaxed">{magicSystem.description}</p>
              ) : (
                <p className="text-[var(--color-600)] italic">No description provided</p>
              )}
            </div>
          </div>

          {/* Rules Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Zap className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Rules & Mechanics</span>
            </div>
            <div className="bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg p-4 min-h-48">
              {magicSystem.rules ? (
                <p className="text-[var(--color-950)] leading-relaxed whitespace-pre-wrap">{magicSystem.rules}</p>
              ) : (
                <p className="text-[var(--color-600)] italic">No rules specified</p>
              )}
            </div>
          </div>

          {/* Limitations Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <X className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Limitations</span>
            </div>
            <div className="bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg p-4 min-h-48">
              {magicSystem.limitations ? (
                <p className="text-[var(--color-950)] leading-relaxed whitespace-pre-wrap">{magicSystem.limitations}</p>
              ) : (
                <p className="text-[var(--color-600)] italic">No limitations specified</p>
              )}
            </div>
          </div>

          {/* Source and Cost Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Battery className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Source & Cost</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Source</label>
                <div className="bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg p-3">
                  {magicSystem.source ? (
                    <p className="text-[var(--color-950)]">{magicSystem.source}</p>
                  ) : (
                    <p className="text-[var(--color-600)] italic">No source specified</p>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Cost</label>
                <div className="bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg p-3">
                  {magicSystem.cost ? (
                    <p className="text-[var(--color-950)]">{magicSystem.cost}</p>
                  ) : (
                    <p className="text-[var(--color-600)] italic">No cost specified</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Characters Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Connected Characters ({connectedCharacters.length})</span>
            </div>
            <div className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg p-4">
              {connectedCharacters.length > 0 ? (
                <MasonryGrid>
                  {connectedCharacters.map((character) => {
                    const roleInfo = roleConfig[character.role as keyof typeof roleConfig] || roleConfig["Supporting"];
                    const RoleIcon = roleInfo.icon;
                    
                    return (
                      <MasonryItem key={character.id}>
                        <Link 
                          href={`/project/${projectId}/characters/${character.id}`}
                          className="block"
                        >
                          <Card className={`bg-[var(--color-100)] border-2 ${roleInfo.borderColor} hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer`}>
                          {/* Character Image */}
                          <div className="relative aspect-[7/9] bg-[var(--color-200)] overflow-hidden">
                            <img 
                              src={placeholderImage} 
                              alt="Character placeholder"
                              className="w-full h-full object-cover object-center opacity-30"
                            />
                            {/* Role Badge */}
                            <div className={`absolute top-3 left-3 ${roleInfo.bgColor} ${roleInfo.textColor} px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium border ${roleInfo.borderColor}`}>
                              <RoleIcon className="w-3 h-3" />
                              <span>{character.role}</span>
                            </div>
                          </div>
                          {/* Character Info */}
                          <div className="p-4 bg-[var(--color-100)]">
                            <div className="mb-3">
                              <h3 className="text-heading-sm text-[var(--color-950)] mb-1 group-hover:text-[var(--color-600)] transition-colors">
                                {character.name}
                              </h3>
                              <div className="space-y-1">
                                <p className="text-body-sm text-[var(--color-700)] line-clamp-2 leading-relaxed">
                                  {character.description || "No description provided"}
                                </p>
                                {character.race && (
                                  <p className="text-sm text-[var(--color-600)] font-medium">
                                    {character.race}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {/* Character Stats/Info Bar */}
                            <div className={`mt-4 pt-3 border-t ${roleInfo.borderColor} flex items-center justify-between`}>
                              <div className={`${roleInfo.color} rounded-full p-1 transition-all duration-300 hover:scale-110 hover:shadow-lg group/role-icon`}>
                                <RoleIcon className="w-4 h-4 text-[var(--color-50)] transition-transform duration-300 group-hover/role-icon:bounce group-hover/role-icon:scale-110" />
                              </div>
                              <span className="text-caption text-[var(--color-600)] font-medium">
                                Click to view details
                              </span>
                            </div>
                          </div>
                        </Card>
                        </Link>
                      </MasonryItem>
                    );
                  })}
                </MasonryGrid>
              ) : (
                <div className="text-center py-8">
                  <Users className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
                  <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No Characters Yet</h3>
                  <p className="text-[var(--color-600)]">
                    No characters are currently using this {magicSystem.category === "power" ? "power" : "magic"} system.
                  </p>
                </div>
              )}
            </div>
          </div>
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