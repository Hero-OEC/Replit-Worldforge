import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import { Plus, Search, Filter, User, Edit3, MoreHorizontal, Users, Trash2, Crown, Shield, Sword, UserCheck, UserX, HelpCircle } from "lucide-react";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import { apiRequest } from "@/lib/queryClient";
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
      return apiRequest("DELETE", `/api/characters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters", projectId] });
    },
  });

  // Character role icons and colors
  const roleConfig = {
    "Protagonist": { icon: Crown, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" },
    "Antagonist": { icon: Sword, color: "bg-[var(--color-950)]", bgColor: "bg-[var(--color-200)]", textColor: "text-[var(--color-950)]", borderColor: "border-[var(--color-700)]" },
    "Ally": { icon: Shield, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-300)]" },
    "Enemy": { icon: UserX, color: "bg-[var(--color-800)]", bgColor: "bg-[var(--color-200)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-600)]" },
    "Neutral": { icon: HelpCircle, color: "bg-[var(--color-400)]", bgColor: "bg-[var(--color-50)]", textColor: "text-[var(--color-600)]", borderColor: "border-[var(--color-300)]" },
    "Supporting": { icon: UserCheck, color: "bg-[var(--color-700)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" }
  };

  // Fetch characters from API
  const { data: characters = [], isLoading } = useQuery({
    queryKey: ["/api/characters", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/characters`);
      if (!response.ok) throw new Error("Failed to fetch characters");
      return response.json();
    },
  });

  const filteredCharacters = characters.filter((character: any) => {
    const matchesSearch = character.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.role?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
      setDeleteDialogOpen(false);
      setCharacterToDelete(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        
        
      />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-sm cursor-pointer group">
                  <Users className="w-6 h-6 text-[var(--color-700)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Characters</h1>
                  <p className="text-[var(--color-700)]">Manage your story's characters and their development</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Protagonist">Protagonist</SelectItem>
                    <SelectItem value="Antagonist">Antagonist</SelectItem>
                    <SelectItem value="Ally">Ally</SelectItem>
                    <SelectItem value="Enemy">Enemy</SelectItem>
                    <SelectItem value="Supporting">Supporting</SelectItem>
                    <SelectItem value="Neutral">Neutral</SelectItem>
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
                <MasonryItem key={i} className="mb-6">
                  <Card className="bg-[var(--color-100)] border-2 border-[var(--color-300)] animate-pulse">
                    {/* Character Image Skeleton */}
                    <div className="relative aspect-[7/9] bg-[var(--color-200)]">
                      <div className="absolute top-3 left-3 w-16 h-6 bg-[var(--color-300)] rounded-full"></div>
                      <div className="absolute top-3 right-3 w-8 h-8 bg-[var(--color-300)] rounded"></div>
                    </div>
                    
                    {/* Character Info Skeleton */}
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="h-6 bg-[var(--color-200)] rounded w-24"></div>
                        <div className="flex space-x-1">
                          <div className="w-6 h-6 bg-[var(--color-200)] rounded"></div>
                          <div className="w-6 h-6 bg-[var(--color-200)] rounded"></div>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-[var(--color-200)] rounded w-full"></div>
                        <div className="h-4 bg-[var(--color-200)] rounded w-3/4"></div>
                        <div className="h-4 bg-[var(--color-200)] rounded w-1/2"></div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="h-6 bg-[var(--color-200)] rounded w-16"></div>
                        <div className="h-6 bg-[var(--color-200)] rounded w-20"></div>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs pt-2 border-t border-[var(--color-300)]">
                        <div className="h-3 bg-[var(--color-200)] rounded w-16"></div>
                        <div className="h-3 bg-[var(--color-200)] rounded w-12"></div>
                      </div>
                    </div>
                  </Card>
                </MasonryItem>
              ))}
            </MasonryGrid>
          ) : (
            <MasonryGrid className="pb-8">
              {filteredCharacters.map((character: any) => {
              const roleInfo = roleConfig[character.role as keyof typeof roleConfig] || roleConfig["Supporting"];
              const RoleIcon = roleInfo.icon;

              return (
                <MasonryItem key={character.id} className="w-72 mb-6">
                  <Card 
                  className={`bg-[var(--color-100)] border-2 ${roleInfo.borderColor} hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer`}
                  onClick={() => navigateWithHistory(`/project/${projectId}/characters/${character.id}`)}
                >
                  {/* Character Image */}
                  <div className="relative aspect-[7/9] bg-[var(--color-200)] overflow-hidden">
                    {character.image ? (
                      <img 
                        src={character.image} 
                        alt={character.name}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <img 
                        src="/attached_assets/Placeholder_1750916543106.jpg" 
                        alt="Character placeholder"
                        className="w-full h-full object-cover object-center opacity-30"
                      />
                    )}
                    {/* Role Badge */}
                    <div className={`absolute top-3 left-3 ${roleInfo.bgColor} ${roleInfo.textColor} px-2 py-1 rounded-full flex items-center space-x-1 text-xs font-medium border ${roleInfo.borderColor}`}>
                      <RoleIcon className="w-3 h-3" />
                      <span>{character.role}</span>
                    </div>
                    {/* Actions Menu */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            className="bg-[var(--color-50)] hover:bg-[var(--color-100)]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/project/${projectId}/characters/${character.id}`);
                          }}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(character);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                  {/* Character Info */}
                  <div className="p-4 bg-[var(--color-100)]">
                    <div className="mb-3">
                      <h3 className="text-heading-sm text-[var(--color-950)] mb-1 group-hover:text-[var(--color-600)] transition-colors">
                        {character.name}
                      </h3>
                      <p className="text-body-sm text-[var(--color-700)] line-clamp-2 leading-relaxed">
                        {character.description}
                      </p>
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
                </MasonryItem>
              );
              })}
            </MasonryGrid>
          )}

          {!isLoading && filteredCharacters.length === 0 && (
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