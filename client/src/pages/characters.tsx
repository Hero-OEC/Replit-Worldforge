import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import { Plus, Search, Filter, User, Edit3, MoreHorizontal, Users, Trash2, Crown, Shield, Sword, UserCheck, UserX, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import type { Character, ProjectWithStats } from "@shared/schema";

export default function Characters() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const { navigateWithHistory } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
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
    "Protagonist": { icon: Crown, color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
    "Antagonist": { icon: Sword, color: "bg-destructive", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
    "Ally": { icon: Shield, color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
    "Enemy": { icon: UserX, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-300)]" },
    "Neutral": { icon: HelpCircle, color: "bg-[var(--color-100)]0", bgColor: "bg-[var(--color-100)]", textColor: "text-gray-700", borderColor: "border-gray-200" },
    "Supporting": { icon: UserCheck, color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" }
  };

  // Sample characters for demonstration
  const sampleCharacters = [
    {
      id: 1,
      name: "Elena Brightflame",
      role: "Protagonist",
      description: "A young mage discovering her magical potential and destined to save the realm from darkness",
      appearance: "Auburn hair, emerald eyes, average height",
      personality: "Determined, compassionate, quick-witted",
      backstory: "Orphaned at a young age, raised by the Magic Academy",
      image: null
    },
    {
      id: 2,
      name: "Marcus Shadowbane",
      role: "Ally",
      description: "Elena's mentor and former academy professor with deep knowledge of ancient magic",
      appearance: "Silver hair, weathered face, tall and imposing",
      personality: "Wise, mysterious, protective",
      backstory: "Former court mage who left to teach at the academy",
      image: null
    },
    {
      id: 3,
      name: "Lord Vex",
      role: "Antagonist",
      description: "Dark sorcerer seeking ultimate power to reshape the world according to his vision",
      appearance: "Black robes, pale skin, piercing blue eyes",
      personality: "Cunning, ruthless, charismatic",
      backstory: "Former academy student who turned to dark magic",
      image: null
    },
    {
      id: 4,
      name: "Princess Aria",
      role: "Ally",
      description: "Royal heir with a secret magical gift and political acumen",
      appearance: "Golden hair, royal bearing, graceful",
      personality: "Noble, brave, diplomatic",
      backstory: "Hidden away from court politics, trained in secret",
      image: null
    },
    {
      id: 5,
      name: "Captain Storm",
      role: "Supporting",
      description: "Elite guard captain loyal to the crown and skilled in combat",
      appearance: "Scarred face, muscular build, stern expression",
      personality: "Loyal, disciplined, honorable",
      backstory: "Rose through ranks through merit and sacrifice",
      image: null
    },
    {
      id: 6,
      name: "Shadow Assassin",
      role: "Enemy",
      description: "Mysterious killer working for unknown masters in the shadows",
      appearance: "Always masked, lithe build, moves like smoke",
      personality: "Silent, deadly, professional",
      backstory: "Identity and origins completely unknown",
      image: null
    }
  ];

  const filteredCharacters = sampleCharacters.filter(character => {
    const matchesSearch = character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      character.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || character.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this character?")) {
      console.log("Delete character:", id);
      // deleteCharacterMutation.mutate(id);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search characters..."
        onSearch={setSearchTerm}
      />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[var(--color-600)] cursor-pointer group">
                  <Users className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
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

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="border border-[var(--color-300)] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[var(--color-400)] bg-[var(--color-100)]">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-200)] to-[var(--color-300)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                  <Users className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                    {sampleCharacters.length}
                  </div>
                  <div className="text-sm text-[var(--color-700)] font-medium">
                    Total Characters
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-[var(--color-300)] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[var(--color-400)] bg-[var(--color-100)]">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-300)] to-[var(--color-400)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                  <Crown className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                    {sampleCharacters.filter(c => c.role === 'Protagonist').length}
                  </div>
                  <div className="text-sm text-[var(--color-700)] font-medium">
                    Protagonists
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-[var(--color-300)] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[var(--color-400)] bg-[var(--color-100)]">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-400)] to-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                  <Sword className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-45 group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                    {sampleCharacters.filter(c => c.role === 'Antagonist').length}
                  </div>
                  <div className="text-sm text-[var(--color-700)] font-medium">
                    Antagonists
                  </div>
                </div>
              </div>
            </div>
            <div className="border border-[var(--color-300)] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[var(--color-400)] bg-[var(--color-100)]">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-500)] to-[var(--color-600)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                  <Shield className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                    {sampleCharacters.filter(c => c.role === 'Supporting').length}
                  </div>
                  <div className="text-sm text-[var(--color-700)] font-medium">
                    Supporting
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => {
              const roleInfo = roleConfig[character.role as keyof typeof roleConfig] || roleConfig["Supporting"];
              const RoleIcon = roleInfo.icon;
              
              return (
                <Card 
                  key={character.id} 
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
                              handleDelete(character.id);
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

                    <div className="space-y-2 text-body-xs text-[var(--color-700)]">
                      <div className="flex items-center space-x-2">
                        <span className="text-label-md text-[var(--color-700)]">Personality:</span>
                        <span className="line-clamp-1">{character.personality}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-label-md text-[var(--color-700)]">Appearance:</span>
                        <span className="line-clamp-1">{character.appearance}</span>
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
              );
            })}
          </div>

          {filteredCharacters.length === 0 && (
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
    </div>
  );
}