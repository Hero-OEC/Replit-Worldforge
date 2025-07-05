import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, User, Crown, Shield, Sword, UserCheck, UserX, HelpCircle, Wand2, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import type { InsertCharacter, ProjectWithStats } from "@shared/schema";

// Simple PowerSystem Selection Component  
function PowerSystemSelect({ selectedSystems, onAddSystem, onRemoveSystem, projectId }: {
  selectedSystems: string[];
  onAddSystem: (system: string) => void;
  onRemoveSystem: (system: string) => void;
  projectId: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  
  // Fetch magic systems from database
  const { data: magicSystems = [] } = useQuery({
    queryKey: ["/api/magic-systems", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/magic-systems?projectId=${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch magic systems");
      return response.json();
    },
    enabled: !!projectId,
  });

  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" ? "bg-[var(--color-200)] text-[var(--color-950)]" : "bg-[var(--color-300)] text-[var(--color-950)]";
  };

  return (
    <div className="space-y-3">
      {/* Simple dropdown */}
      <div className="relative">
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full justify-between bg-[var(--color-50)] border-[var(--color-300)] hover:bg-[var(--color-100)]"
        >
          {selectedSystems.length > 0 ? `${selectedSystems.length} power types selected` : "Select power types..."}
          <span className="ml-2">▼</span>
        </Button>
        {isOpen && (
          <div className="absolute z-[999] w-full bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
            {magicSystems.filter((system: any) => !selectedSystems.includes(system.name)).map((system: any) => {
              const CategoryIcon = getCategoryIcon(system.category);
              return (
                <div
                  key={system.name}
                  className="px-3 py-2 hover:bg-[var(--color-100)] cursor-pointer"
                  onClick={() => {
                    onAddSystem(system.name);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <CategoryIcon className="w-4 h-4 text-[var(--color-600)]" />
                    <span className="font-medium text-sm">{system.name}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Systems */}
      {selectedSystems.length > 0 && (
        <div className="grid grid-cols-1 gap-3">
          {selectedSystems.map((systemName, index) => {
            const system = magicSystems.find((s: any) => s.name === systemName);
            const CategoryIcon = getCategoryIcon(system?.category || "magic");
            const colorClass = getCategoryColor(system?.category || "magic");
            
            return (
              <div key={index} className={`p-3 ${colorClass} rounded-lg border border-[var(--color-300)] flex items-center justify-between`}>
                <div className="flex items-center space-x-3">
                  <CategoryIcon className="w-4 h-4" />
                  <span className="font-medium text-sm">{systemName}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveSystem(systemName)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          })}
        </div>
      )}

      {selectedSystems.length === 0 && (
        <div className="p-4 bg-[var(--color-100)] rounded-lg border border-[var(--color-300)]">
          <span className="text-sm text-[var(--color-700)]">No power types assigned</span>
        </div>
      )}
    </div>
  );
}

// Role icon helper function
const getRoleIcon = (role: string) => {
  switch (role) {
    case 'Protagonist':
      return Crown;
    case 'Antagonist':
      return UserX;
    case 'Ally':
      return UserCheck;
    case 'Enemy':
      return Sword;
    case 'Supporting':
      return Shield;
    case 'Neutral':
      return HelpCircle;
    default:
      return User;
  }
};

export default function CharacterNew() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  
  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    personality: "",
    backstory: "",
    weapons: "",
    age: "",
    race: "",
    location: "",
    role: "",
    appearance: ""
  });

  const [selectedPowerSystems, setSelectedPowerSystems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch project data for context
  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const createCharacterMutation = useMutation({
    mutationFn: async (data: InsertCharacter) => {
      return apiRequest(`/api/characters`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters"] });
      setLocation(`/project/${projectId}/characters`);
    },
  });

  const handleSave = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      const characterPayload: InsertCharacter = {
        projectId: parseInt(projectId!),
        name: characterData.name,
        description: characterData.description,
        personality: characterData.personality,
        backstory: characterData.backstory,
        weapons: characterData.weapons,
        age: characterData.age,
        race: characterData.race,
        location: characterData.location,
        role: characterData.role,
        appearance: characterData.appearance,
        powerSystems: selectedPowerSystems,
      };

      await createCharacterMutation.mutateAsync(characterPayload);
    } catch (error) {
      console.error("Failed to create character:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = characterData.name.trim() !== "";
  const SelectedRoleIcon = getRoleIcon(characterData.role);

  return (
    <div className="min-h-screen bg-[var(--worldforge-bg)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
      />
      
      <main className="px-4 py-8 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href={`/project/${projectId}/characters`}>
                <Button variant="outline" className="flex items-center space-x-2">
                  <ArrowLeft className="w-4 h-4" />
                  <span>Back to Characters</span>
                </Button>
              </Link>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-xl flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6 text-[var(--color-700)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Create New Character</h1>
                  <p className="text-sm text-[var(--color-600)]">Add a new character to your story</p>
                </div>
              </div>
            </div>
            
            <Button 
              onClick={handleSave}
              disabled={!isFormValid || isLoading}
              className="flex items-center space-x-2 bg-[var(--color-500)] hover:bg-[var(--color-600)] text-white"
            >
              <Save className="w-4 h-4" />
              <span>{isLoading ? "Creating..." : "Create Character"}</span>
            </Button>
          </div>

          {/* Character Header */}
          <div className="bg-[var(--color-100)] rounded-lg p-6 mb-6 border border-[var(--color-300)]">
            <div className="flex flex-col lg:flex-row lg:items-start gap-6">
              {/* Character Name Input */}
              <div className="flex-1 max-w-md">
                <Input
                  placeholder="Character name..."
                  value={characterData.name}
                  onChange={(e) => setCharacterData({ ...characterData, name: e.target.value })}
                  className="text-2xl font-bold h-14 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                />
              </div>

              {/* Role Selector */}
              <div className="flex flex-col space-y-3">
                <div className="flex items-center space-x-2">
                  <SelectedRoleIcon className="w-5 h-5 text-[var(--color-700)]" />
                  <Select 
                    value={characterData.role} 
                    onValueChange={(value) => setCharacterData({ ...characterData, role: value })}
                  >
                    <SelectTrigger className="w-40 bg-[var(--color-50)] border-[var(--color-300)] focus:border-[var(--color-500)]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Protagonist">Protagonist</SelectItem>
                      <SelectItem value="Antagonist">Antagonist</SelectItem>
                      <SelectItem value="Ally">Ally</SelectItem>
                      <SelectItem value="Enemy">Enemy</SelectItem>
                      <SelectItem value="Supporting">Supporting</SelectItem>
                      <SelectItem value="Neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Age and Race */}
                <div className="flex space-x-3">
                  <Input
                    placeholder="Age"
                    value={characterData.age}
                    onChange={(e) => setCharacterData({ ...characterData, age: e.target.value })}
                    className="w-20 bg-[var(--color-50)] border-[var(--color-300)] focus:border-[var(--color-500)]"
                  />
                  <Input
                    placeholder="Race"
                    value={characterData.race}
                    onChange={(e) => setCharacterData({ ...characterData, race: e.target.value })}
                    className="w-20 bg-[var(--color-50)] border-[var(--color-300)] focus:border-[var(--color-500)]"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Character Details */}
          <div className="space-y-6">
            {/* Description */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-[var(--color-700)]">Description</span>
              </div>
              <textarea
                placeholder="Describe this character's appearance, personality, and role in the story..."
                value={characterData.description}
                onChange={(e) => setCharacterData({ ...characterData, description: e.target.value })}
                className="w-full min-h-32 bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all p-3 text-[var(--color-950)] resize-none"
              />
            </div>

            {/* Character Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personality */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-[var(--color-700)]" />
                  <span className="text-xl font-medium text-[var(--color-700)]">Personality</span>
                </div>
                <textarea
                  placeholder="Character's personality traits, quirks, and behavioral patterns..."
                  value={characterData.personality}
                  onChange={(e) => setCharacterData({ ...characterData, personality: e.target.value })}
                  className="w-full min-h-48 bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all p-3 text-[var(--color-950)] resize-none"
                />
              </div>

              {/* Backstory */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-[var(--color-700)]" />
                  <span className="text-xl font-medium text-[var(--color-700)]">Backstory</span>
                </div>
                <textarea
                  placeholder="Character's history, background, and past experiences..."
                  value={characterData.backstory}
                  onChange={(e) => setCharacterData({ ...characterData, backstory: e.target.value })}
                  className="w-full min-h-48 bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all p-3 text-[var(--color-950)] resize-none"
                />
              </div>
            </div>

            {/* Additional Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Appearance */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-[var(--color-700)]" />
                  <span className="text-xl font-medium text-[var(--color-700)]">Appearance</span>
                </div>
                <textarea
                  placeholder="Physical appearance, clothing, distinguishing features..."
                  value={characterData.appearance}
                  onChange={(e) => setCharacterData({ ...characterData, appearance: e.target.value })}
                  className="w-full min-h-32 bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all p-3 text-[var(--color-950)] resize-none"
                />
              </div>

              {/* Weapons */}
              <div>
                <div className="flex items-center space-x-2 mb-3">
                  <Sword className="w-5 h-5 text-[var(--color-700)]" />
                  <span className="text-xl font-medium text-[var(--color-700)]">Weapons & Equipment</span>
                </div>
                <textarea
                  placeholder="Weapons, armor, tools, and other equipment..."
                  value={characterData.weapons}
                  onChange={(e) => setCharacterData({ ...characterData, weapons: e.target.value })}
                  className="w-full min-h-32 bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all p-3 text-[var(--color-950)] resize-none"
                />
              </div>
            </div>

            {/* Power Systems */}
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Wand2 className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-[var(--color-700)]">Power Type</span>
              </div>
              <PowerSystemSelect
                selectedSystems={selectedPowerSystems}
                onAddSystem={(system) => setSelectedPowerSystems([...selectedPowerSystems, system])}
                onRemoveSystem={(system) => setSelectedPowerSystems(selectedPowerSystems.filter(s => s !== system))}
                projectId={projectId!}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}