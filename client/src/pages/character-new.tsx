import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, X, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import type { ProjectWithStats } from "@shared/schema";

export default function NewCharacter() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
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

  const handleSave = () => {
    // In real app, this would save to API
    console.log("Saving character:", characterData);
    // Redirect back to characters list
    setLocation(`/project/${projectId}/characters`);
  };

  const handleCancel = () => {
    setLocation(`/project/${projectId}/characters`);
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
                <h1 className="text-3xl font-bold text-gray-900">New Character</h1>
                <p className="text-gray-600 mt-1">Create a new character for your story</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-orange-500 text-white hover:bg-orange-600">
                <Save className="w-4 h-4 mr-2" />
                Create Character
              </Button>
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
                  <Input
                    value={characterData.description}
                    onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                    placeholder="Brief character description..."
                    className="text-lg"
                  />
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                    <Input
                      value={characterData.name}
                      onChange={(e) => setCharacterData({...characterData, name: e.target.value})}
                      placeholder="Character's full name"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <Input
                      value={characterData.age}
                      onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                      placeholder="Character's age"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <Input
                      value={characterData.role}
                      onChange={(e) => setCharacterData({...characterData, role: e.target.value})}
                      placeholder="e.g., Protagonist, Antagonist, Supporting"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Occupation</label>
                    <Input
                      value={characterData.occupation}
                      onChange={(e) => setCharacterData({...characterData, occupation: e.target.value})}
                      placeholder="Character's job or profession"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birthplace</label>
                    <Input
                      value={characterData.birthplace}
                      onChange={(e) => setCharacterData({...characterData, birthplace: e.target.value})}
                      placeholder="Where was the character born?"
                    />
                  </div>
                </div>
              </Card>

              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Physical Appearance</h3>
                <textarea
                  value={characterData.appearance}
                  onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
                  placeholder="Describe the character's physical appearance (height, build, hair color, distinguishing features, etc.)"
                />
              </Card>
            </TabsContent>

            <TabsContent value="personality" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personality Traits</h3>
                <textarea
                  value={characterData.personality}
                  onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
                  placeholder="Describe the character's personality, temperament, quirks, and behavioral patterns..."
                />
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals & Motivations</h3>
                  <textarea
                    value={characterData.goals}
                    onChange={(e) => setCharacterData({...characterData, goals: e.target.value})}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="What drives this character? What do they want to achieve?"
                  />
                </Card>

                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Fears & Weaknesses</h3>
                  <textarea
                    value={characterData.fears}
                    onChange={(e) => setCharacterData({...characterData, fears: e.target.value})}
                    className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="What does this character fear? What are their weaknesses?"
                  />
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="background" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Backstory</h3>
                <textarea
                  value={characterData.backstory}
                  onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                  className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none"
                  placeholder="Tell the character's backstory. What events shaped who they are today?"
                />
              </Card>
            </TabsContent>

            <TabsContent value="relationships" className="space-y-6">
              <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Relationships</h3>
                <textarea
                  value={characterData.relationships}
                  onChange={(e) => setCharacterData({...characterData, relationships: e.target.value})}
                  className="w-full h-24 px-3 py-2 border border-gray-300 rounded-md resize-none"
                  placeholder="Describe key relationships with other characters (family, friends, enemies, romantic interests, etc.)"
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}