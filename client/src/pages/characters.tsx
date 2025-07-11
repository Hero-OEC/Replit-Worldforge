import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import { Plus, Search, Filter, User, Edit3, MoreHorizontal, Users, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import { CharacterCard } from "@/components/ui/character-card";
import { apiRequest } from "@/lib/queryClient";
import { deleteCharacterImage } from "@/lib/supabase";
import Navbar from "@/components/layout/navbar";
import type { Character, ProjectWithStats } from "@shared/schema";

export default function Characters() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const { navigateWithHistory } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [characterToDelete, setCharacterToDelete] = useState<any>(null);
  const queryClient = useQueryClient();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/characters/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete character");
      }
      return response.json();
    },
    onSuccess: async (data) => {
      // Clean up character image from Supabase Storage if it exists
      if (data?.imageUrl) {
        try {
          await deleteCharacterImage(data.imageUrl);
        } catch (error) {
          console.error("Failed to delete character image:", error);
        }
      }
      
      await queryClient.invalidateQueries({
        queryKey: ['/api/projects', projectId, 'characters']
      });
      setDeleteDialogOpen(false);
      setCharacterToDelete(null);
    },
    onError: (error: any) => {
      console.error('Delete failed:', error);
    }
  });

  const { data: characters = [], isLoading } = useQuery<Character[]>({
    queryKey: ["/api/projects", projectId, "characters"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/characters`);
      if (!response.ok) throw new Error("Failed to fetch characters");
      return response.json();
    },
  });



  const filteredCharacters = characters.filter((character: any) => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         character.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || character.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (character: any) => {
    setCharacterToDelete(character);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (characterToDelete) {
      deleteCharacterMutation.mutate(characterToDelete.id);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-bg)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center shadow-sm">
                  <Users className="w-6 h-6 text-[var(--color-700)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Characters</h1>
                  <p className="text-[var(--color-700)]">Manage the people in your story</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="protagonist">Protagonist</SelectItem>
                    <SelectItem value="antagonist">Antagonist</SelectItem>
                    <SelectItem value="ally">Ally</SelectItem>
                    <SelectItem value="enemy">Enemy</SelectItem>
                    <SelectItem value="supporting">Supporting</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
                  onClick={() => setLocation(`/project/${projectId}/characters/new`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Character
                </Button>
              </div>
            </div>
          </div>

          {/* Characters Grid */}
          {isLoading ? (
            <MasonryGrid className="pb-8">
              {[...Array(6)].map((_, i) => (
                <MasonryItem key={i}>
                  <Card className="overflow-hidden shadow-sm border border-[var(--color-300)] bg-[var(--color-100)] animate-pulse">
                    {/* Top Area: Image Placeholder (1:1 ratio) */}
                    <div className="relative aspect-square w-full bg-[var(--color-200)]">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-16 h-16 bg-[var(--color-300)] rounded-full mx-auto mb-2"></div>
                          <div className="w-20 h-8 bg-[var(--color-300)] rounded mx-auto"></div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Area: Character Info Placeholder */}
                    <div className="p-4">
                      <div className="flex items-start space-x-3 mb-2">
                        <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg"></div>
                        <div>
                          <div className="h-5 bg-[var(--color-200)] rounded w-32 mb-2"></div>
                          <div className="h-6 bg-[var(--color-200)] rounded-full w-20 mb-3"></div>
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-[var(--color-200)] rounded w-full"></div>
                        <div className="h-4 bg-[var(--color-200)] rounded w-3/4"></div>
                        <div className="h-4 bg-[var(--color-200)] rounded w-1/2"></div>
                      </div>
                      <div className="text-center">
                        <div className="h-4 bg-[var(--color-200)] rounded w-24 mx-auto"></div>
                      </div>
                    </div>
                  </Card>
                </MasonryItem>
              ))}
            </MasonryGrid>
          ) : filteredCharacters.length === 0 ? (
            <div className="text-center py-12">
              <User className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
              <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No characters found</h3>
              <p className="text-[var(--color-600)] mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start building your story by adding characters.'}
              </p>
              <Button 
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                onClick={() => setLocation(`/project/${projectId}/characters/new`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Character
              </Button>
            </div>
          ) : (
            <MasonryGrid className="pb-8">
              {filteredCharacters.map((character: any) => (
                <MasonryItem key={character.id}>
                  <CharacterCard 
                    character={character}
                    projectId={projectId!}
                    onClick={() => navigateWithHistory(`/project/${projectId}/characters/${character.id}`)}
                  />
                </MasonryItem>
              ))}
            </MasonryGrid>
          )}
        </div>
      </main>

      {characterToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete Character"
          itemName={characterToDelete.name}
          description={`Are you sure you want to delete "${characterToDelete.name}"? This action cannot be undone and will permanently remove the character and all associated data.`}
          isDeleting={deleteCharacterMutation.isPending}
        />
      )}
    </div>
  );
}