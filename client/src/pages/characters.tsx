import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, User, Edit3, MoreHorizontal, Users, Trash2, Crown, Shield, Sword, UserCheck, UserX, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import type { Character, ProjectWithStats } from "@shared/schema";

export default function Characters() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
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
      return apiRequest(`/api/characters/${id}`, { method: "DELETE" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters", projectId] });
    },
  });

  // Character role icons and colors
  const roleConfig = {
    "Protagonist": { icon: Crown, color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
    "Antagonist": { icon: Sword, color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
    "Ally": { icon: Shield, color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
    "Enemy": { icon: UserX, color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
    "Neutral": { icon: HelpCircle, color: "bg-gray-500", bgColor: "bg-gray-50", textColor: "text-gray-700", borderColor: "border-gray-200" },
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
      image: "/api/placeholder/300/400"
    },
    {
      id: 2,
      name: "Marcus Shadowbane",
      role: "Ally",
      description: "Elena's mentor and former academy professor with deep knowledge of ancient magic",
      appearance: "Silver hair, weathered face, tall and imposing",
      personality: "Wise, mysterious, protective",
      backstory: "Former court mage who left to teach at the academy",
      image: "/api/placeholder/300/400"
    },
    {
      id: 3,
      name: "Lord Vex",
      role: "Antagonist",
      description: "Dark sorcerer seeking ultimate power to reshape the world according to his vision",
      appearance: "Black robes, pale skin, piercing blue eyes",
      personality: "Cunning, ruthless, charismatic",
      backstory: "Former academy student who turned to dark magic",
      image: "/api/placeholder/300/400"
    },
    {
      id: 4,
      name: "Princess Aria",
      role: "Ally",
      description: "Royal heir with a secret magical gift and political acumen",
      appearance: "Golden hair, royal bearing, graceful",
      personality: "Noble, brave, diplomatic",
      backstory: "Hidden away from court politics, trained in secret",
      image: "/api/placeholder/300/400"
    },
    {
      id: 5,
      name: "Captain Storm",
      role: "Supporting",
      description: "Elite guard captain loyal to the crown and skilled in combat",
      appearance: "Scarred face, muscular build, stern expression",
      personality: "Loyal, disciplined, honorable",
      backstory: "Rose through ranks through merit and sacrifice",
      image: "/api/placeholder/300/400"
    },
    {
      id: 6,
      name: "Shadow Assassin",
      role: "Enemy",
      description: "Mysterious killer working for unknown masters in the shadows",
      appearance: "Always masked, lithe build, moves like smoke",
      personality: "Silent, deadly, professional",
      backstory: "Identity and origins completely unknown",
      image: "/api/placeholder/300/400"
    }
  ];

  const filteredCharacters = sampleCharacters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        rightContent={
          <Button 
            className="bg-orange-500 text-white hover:bg-orange-600"
            onClick={() => setLocation(`/project/${projectId}/characters/new`)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Character
          </Button>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Characters</h1>
                <p className="text-gray-600">Manage your story's characters and their development</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-white border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.length}</p>
                <p className="text-sm text-gray-600">Total Characters</p>
              </div>
            </Card>
            <Card className="bg-white border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.filter(c => c.role === 'Protagonist').length}</p>
                <p className="text-sm text-gray-600">Protagonists</p>
              </div>
            </Card>
            <Card className="bg-white border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.filter(c => c.role === 'Antagonist').length}</p>
                <p className="text-sm text-gray-600">Antagonists</p>
              </div>
            </Card>
            <Card className="bg-white border border-gray-200 p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.filter(c => c.role === 'Ally').length}</p>
                <p className="text-sm text-gray-600">Supporting</p>
              </div>
            </Card>
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCharacters.map((character) => {
              const roleInfo = roleConfig[character.role as keyof typeof roleConfig] || roleConfig["Supporting"];
              const RoleIcon = roleInfo.icon;
              
              return (
                <Card 
                  key={character.id} 
                  className={`bg-white border-2 ${roleInfo.borderColor} hover:shadow-lg transition-all duration-200 overflow-hidden group cursor-pointer`}
                  onClick={() => setLocation(`/project/${projectId}/characters/${character.id}`)}
                >
                  {/* Character Image */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <img 
                      src={character.image} 
                      alt={character.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
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
                            className="bg-white/80 hover:bg-white"
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
                            className="text-red-600"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Character Info */}
                  <div className="p-4">
                    <div className="mb-3">
                      <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-orange-600 transition-colors">
                        {character.name}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                        {character.description}
                      </p>
                    </div>

                    <div className="space-y-2 text-xs text-gray-600">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Personality:</span>
                        <span className="line-clamp-1">{character.personality}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-700">Appearance:</span>
                        <span className="line-clamp-1">{character.appearance}</span>
                      </div>
                    </div>

                    {/* Character Stats/Info Bar */}
                    <div className={`mt-4 pt-3 border-t ${roleInfo.borderColor} flex items-center justify-between`}>
                      <div className={`${roleInfo.color} rounded-full p-1`}>
                        <RoleIcon className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xs text-gray-500 font-medium">
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
              <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No characters found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start building your story by adding characters.'}
              </p>
              <Button 
                className="bg-orange-500 text-white hover:bg-orange-600"
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