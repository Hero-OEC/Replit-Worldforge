import { useState, useRef } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Save, X, User, Upload, Sword } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import type { Character, ProjectWithStats } from "@shared/schema";

export default function CharacterDetail() {
  const { projectId, characterId } = useParams<{ projectId: string; characterId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    personality: "",
    backstory: "",
    goals: "",
    fears: "",
    relationships: "",
    weapons: ""
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
    name: "Elena Brightblade",
    description: "A young mage with incredible potential and a mysterious past.",
    personality: "Determined, compassionate, but sometimes impulsive.",
    backstory: "Born into nobility but discovered her magical abilities late in life.",
    goals: "To master her magical abilities and protect her kingdom.",
    fears: "Losing control of her powers and hurting those she loves.",
    relationships: "Close friend of Marcus, mentored by Archmage Theron.",
    age: "22",
    race: "Human",
    class: "Mage",
    location: "Arcanum City",
    weapons: "Enchanted Staff of Flames, Crystal Dagger"
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCharacterImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    console.log("Saving character data:", characterData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setCharacterData({
      name: "",
      description: "",
      personality: "",
      backstory: "",
      goals: "",
      fears: "",
      relationships: "",
      weapons: ""
    });
  };

  return (
    <div className="min-h-screen bg-stone-100">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search characters..."
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href={`/project/${projectId}/characters`}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Characters
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-800">{character.name}</h1>
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

          {/* Character Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Portrait */}
            <div className="lg:col-span-1">
              <Card className="bg-white border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Portrait
                  </h2>
                  {isEditing && (
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="sm"
                      className="text-xs"
                    >
                      <Upload className="w-3 h-3 mr-1" />
                      Upload
                    </Button>
                  )}
                </div>

                {/* Character Portrait */}
                <div className="relative mb-6">
                  <div className="w-full aspect-[3/4] bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden">
                    {characterImage ? (
                      <img 
                        src={characterImage} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Basic Info */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Age:</span>
                    <span className="text-sm text-gray-800">{character.age}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Race:</span>
                    <span className="text-sm text-gray-800">{character.race}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Class:</span>
                    <span className="text-sm text-gray-800">{character.class}</span>
                  </div>
                  <div className="flex justify-between items-center py-2">
                    <span className="text-sm font-medium text-gray-600">Location:</span>
                    <span className="text-sm text-gray-800">{character.location}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side - Tabbed Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                  <TabsTrigger value="appearance" className="text-sm">Appearance</TabsTrigger>
                  <TabsTrigger value="backstory" className="text-sm">Backstory</TabsTrigger>
                  <TabsTrigger value="weapons" className="text-sm">Weapons</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6">
                  <Card className="bg-white border border-gray-200 p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                        {isEditing ? (
                          <textarea
                            value={characterData.description || character.description}
                            onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50 focus:bg-white"
                            placeholder="Brief character description..."
                          />
                        ) : (
                          <p className="text-gray-700">{character.description}</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Personality</h3>
                        {isEditing ? (
                          <textarea
                            value={characterData.personality || character.personality}
                            onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50 focus:bg-white"
                            placeholder="Character's personality traits..."
                          />
                        ) : (
                          <p className="text-gray-700">{character.personality}</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Magic System Connection</h3>
                        <div className="flex items-center space-x-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm text-blue-800">Fire Magic - Advanced Practitioner</span>
                          <Button variant="outline" size="sm" className="ml-auto text-xs">
                            View Magic System
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6">
                  <Card className="bg-white border border-gray-200 p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Physical Appearance</h3>
                      {isEditing ? (
                        <textarea
                          value={characterData.appearance || "Auburn hair that catches fire when she uses magic, emerald eyes, average height with an athletic build from training"}
                          onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50 focus:bg-white"
                          placeholder="Describe the character's physical appearance..."
                        />
                      ) : (
                        <p className="text-gray-700">Auburn hair that catches fire when she uses magic, emerald eyes, average height with an athletic build from training</p>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="backstory" className="space-y-6">
                  <Card className="bg-white border border-gray-200 p-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Backstory</h3>
                      {isEditing ? (
                        <textarea
                          value={characterData.backstory || character.backstory}
                          onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50 focus:bg-white"
                          placeholder="Character's background story..."
                        />
                      ) : (
                        <p className="text-gray-700">{character.backstory}</p>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="weapons" className="space-y-6">
                  <Card className="bg-white border border-gray-200 p-6">
                    <div className="flex items-center mb-4">
                      <Sword className="w-5 h-5 mr-2 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-800">Weapons & Equipment</h3>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={characterData.weapons || character.weapons}
                        onChange={(e) => setCharacterData({...characterData, weapons: e.target.value})}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50 focus:bg-white"
                        placeholder="List the character's weapons, armor, and important equipment..."
                      />
                    ) : (
                      <p className="text-gray-700">{character.weapons}</p>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}