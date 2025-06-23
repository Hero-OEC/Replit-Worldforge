import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, User, Edit3, MoreHorizontal, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import type { Character, ProjectWithStats } from "@shared/schema";

export default function Characters() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Sample characters for demonstration
  const sampleCharacters = [
    {
      id: 1,
      name: "Elena Brightflame",
      role: "Protagonist",
      description: "A young mage discovering her magical potential",
      appearance: "Auburn hair, emerald eyes, average height",
      personality: "Determined, compassionate, quick-witted",
      backstory: "Orphaned at a young age, raised by the Magic Academy"
    },
    {
      id: 2,
      name: "Marcus Shadowbane",
      role: "Ally",
      description: "Elena's mentor and former academy professor",
      appearance: "Silver hair, weathered face, tall and imposing",
      personality: "Wise, mysterious, protective",
      backstory: "Former court mage who left to teach at the academy"
    },
    {
      id: 3,
      name: "Lord Vex",
      role: "Antagonist",
      description: "Dark sorcerer seeking ultimate power",
      appearance: "Black robes, pale skin, piercing blue eyes",
      personality: "Cunning, ruthless, charismatic",
      backstory: "Former academy student who turned to dark magic"
    }
  ];

  const filteredCharacters = sampleCharacters.filter(character =>
    character.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    character.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.length}</p>
                <p className="text-sm text-gray-600">Total Characters</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.filter(c => c.role === 'Protagonist').length}</p>
                <p className="text-sm text-gray-600">Protagonists</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.filter(c => c.role === 'Antagonist').length}</p>
                <p className="text-sm text-gray-600">Antagonists</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleCharacters.filter(c => c.role === 'Ally').length}</p>
                <p className="text-sm text-gray-600">Supporting</p>
              </div>
            </Card>
          </div>

          {/* Characters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCharacters.map((character) => (
              <Card 
                key={character.id} 
                className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setLocation(`/project/${projectId}/characters/${character.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{character.name}</h3>
                      <Badge variant="outline" className="text-xs">
                        {character.role}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{character.description}</p>

                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Appearance:</span>
                    <p className="line-clamp-2">{character.appearance}</p>
                  </div>
                  <div>
                    <span className="font-medium">Personality:</span>
                    <p className="line-clamp-2">{character.personality}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
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