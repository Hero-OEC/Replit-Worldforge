import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Save, X, User, Calendar, MapPin, Heart, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import type { Character, ProjectWithStats } from "@shared/schema";

export default function CharacterDetail() {
  const { projectId, characterId } = useParams<{ projectId: string; characterId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [characterData, setCharacterData] = useState({
    name: "",
    role: "",
    description: "",
    appearance: "",
    personality: "",
    backstory: "",
    age: "",
    birthplace: "",
    occupation: "",
    goals: "",
    fears: "",
    relationships: ""
  });

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Sample character data - in real app this would come from API
  const character = {
    id: 1,
    name: "Elena Brightflame",
    role: "Protagonist",
    description: "A young mage discovering her magical potential in a world of magic and political intrigue.",
    appearance: "Auburn hair that catches fire when she uses magic, emerald eyes, average height with a athletic build from training",
    personality: "Determined and compassionate, quick-witted but sometimes impulsive. Has a strong sense of justice and loyalty to friends.",
    backstory: "Orphaned at a young age when her village was destroyed by dark magic. Raised by the Magic Academy where she discovered her rare fire magic abilities.",
    age: "19",
    birthplace: "Ember Village (destroyed)",
    occupation: "Academy Student / Apprentice Mage",
    goals: "Master her fire magic, uncover the truth about her village's destruction, protect the innocent",
    fears: "Losing control of her magic, being alone, failing those who depend on her",
    relationships: "Marcus Shadowbane (mentor), Academy friends, romantic tension with fellow student Kai"
  };

  useState(() => {
    setCharacterData(character);
  }, []);

  const handleSave = () => {
    // In real app, this would save to API
    setIsEditing(false);
  };

  const handleCancel = () => {
    setCharacterData(character);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search characters..."
      />

      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href={`/project/${projectId}/characters`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Characters
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{character.name}</h1>
                <Badge variant="outline" className="mt-2">
                  {character.role}
                </Badge>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-orange-500 text-white hover:bg-orange-600">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-orange-500 text-white hover:bg-orange-600">
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Character
                </Button>
              )}
            </div>
          </div>

          {/* Character Avatar/Image Placeholder */}
          <div className="mb-8">
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-12 h-12 text-blue-600" />
                </div>
                <div className="flex-1">
                  {isEditing ? (
                    <Input
                      value={characterData.description}
                      onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                      placeholder="Character description..."
                      className="text-lg"
                    />
                  ) : (
                    <p className="text-lg text-gray-700">{character.description}</p>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Character Details Tabs */}
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="personality">Personality</TabsTrigger>
              <TabsTrigger value="background">Background</TabsTrigger>
              <TabsTrigger value="relationships">Relationships</TabsTrigger>
            </TabsList>

            <TabsContent value="basics" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    {isEditing ? (
                      <Input
                        value={characterData.name}
                        onChange={(e) => setCharacterData({...characterData, name: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{character.name}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    {isEditing ? (
                      <Input
                        value={characterData.age}
                        onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{character.age}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    {isEditing ? (
                      <Input
                        value={characterData.role}
                        onChange={(e) => setCharacterData({...characterData, role: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{character.role}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    {isEditing ? (
                      <Input
                        value={characterData.occupation}
                        onChange={(e) => setCharacterData({...characterData, occupation: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{character.occupation}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birthplace</label>
                    {isEditing ? (
                      <Input
                        value={characterData.birthplace}
                        onChange={(e) => setCharacterData({...characterData, birthplace: e.target.value})}
                      />
                    ) : (
                      <p className="text-gray-900">{character.birthplace}</p>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Appearance</h3>
                {isEditing ? (
                  <textarea
                    value={characterData.appearance}
                    onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Describe the character's physical appearance..."
                  />
                ) : (
                  <p className="text-gray-700">{character.appearance}</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="personality" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality Traits</h3>
                {isEditing ? (
                  <textarea
                    value={characterData.personality}
                    onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Describe the character's personality..."
                  />
                ) : (
                  <p className="text-gray-700">{character.personality}</p>
                )}
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals & Motivations</h3>
                  {isEditing ? (
                    <textarea
                      value={characterData.goals}
                      onChange={(e) => setCharacterData({...characterData, goals: e.target.value})}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none"
                      placeholder="What drives this character?"
                    />
                  ) : (
                    <p className="text-gray-700">{character.goals}</p>
                  )}
                </Card>

                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fears & Weaknesses</h3>
                  {isEditing ? (
                    <textarea
                      value={characterData.fears}
                      onChange={(e) => setCharacterData({...characterData, fears: e.target.value})}
                      className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none"
                      placeholder="What does this character fear?"
                    />
                  ) : (
                    <p className="text-gray-700">{character.fears}</p>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Backstory</h3>
                {isEditing ? (
                  <textarea
                    value={characterData.backstory}
                    onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Tell the character's backstory..."
                  />
                ) : (
                  <p className="text-gray-700">{character.backstory}</p>
                )}
              </Card>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationships</h3>
                {isEditing ? (
                  <textarea
                    value={characterData.relationships}
                    onChange={(e) => setCharacterData({...characterData, relationships: e.target.value})}
                    className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Describe key relationships..."
                  />
                ) : (
                  <p className="text-gray-700">{character.relationships}</p>
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}