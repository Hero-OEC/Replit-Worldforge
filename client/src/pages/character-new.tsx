import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, User, Upload, Crown, Shield, Sword, UserCheck, UserX, HelpCircle, Wand2, Check, X, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tag, getTagVariant } from "@/components/ui/tag";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import type { InsertCharacter, ProjectWithStats } from "@shared/schema";

// Power/Magic Systems with descriptions and categories
const powerSystems = [
  { 
    name: "Fire Magic", 
    description: "Manipulation of flames and heat energy. Practitioners can create, control, and extinguish fire.",
    title: "Pyromancy Arts",
    category: "magic"
  },
  { 
    name: "Water Magic", 
    description: "Control over water and ice. Masters can manipulate precipitation, create barriers, and heal.",
    title: "Hydromantic Arts",
    category: "magic"
  },
  { 
    name: "Earth Magic", 
    description: "Communion with stone, soil, and minerals. Allows for terraforming and defensive magic.",
    title: "Geomantic Arts",
    category: "magic"
  },
  { 
    name: "Air Magic", 
    description: "Mastery over wind and atmosphere. Enables flight, weather control, and sonic attacks.",
    title: "Aeromantic Arts",
    category: "magic"
  },
  { 
    name: "Shadow Magic", 
    description: "Manipulation of darkness and stealth. Grants invisibility, teleportation, and fear effects.",
    title: "Umbramantic Arts",
    category: "magic"
  },
  { 
    name: "Light Magic", 
    description: "Channeling of pure light energy. Provides healing, purification, and divine protection.",
    title: "Illumination Arts",
    category: "magic"
  },
  { 
    name: "Super Strength", 
    description: "Enhanced physical power beyond normal human limits. Allows lifting and moving massive objects.",
    title: "Enhanced Strength",
    category: "power"
  },
  { 
    name: "Super Speed", 
    description: "Ability to move at superhuman velocities. Grants enhanced reflexes and time perception.",
    title: "Enhanced Speed",
    category: "power"
  },
  { 
    name: "Telekinesis", 
    description: "Mental manipulation of objects without physical contact. Can move, lift, and control matter.",
    title: "Psychokinetic Control",
    category: "power"
  },
  { 
    name: "Mind Reading", 
    description: "Ability to read thoughts and emotions of others. Can penetrate mental defenses.",
    title: "Telepathic Perception",
    category: "power"
  }
];

// PowerSystemSearch Component
function PowerSystemSearch({ selectedSystems, onAddSystem, onRemoveSystem }: {
  selectedSystems: string[];
  onAddSystem: (system: string) => void;
  onRemoveSystem: (system: string) => void;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredSystems = powerSystems.filter(system =>
    !selectedSystems.includes(system.name) &&
    (system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     system.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" ? "bg-blue-50 border-blue-200" : "bg-purple-50 border-purple-200";
  };

  const getCategoryBorderColor = (category: string) => {
    return category === "power" ? "border-blue-200" : "border-purple-200";
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative">
        <Input
          type="text"
          placeholder="Search power types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="w-full bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)]"
        />
        {isOpen && filteredSystems.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSystems.map((system) => {
              const CategoryIcon = getCategoryIcon(system.category);
              const colorClass = getCategoryColor(system.category);
              
              return (
                <div
                  key={system.name}
                  className={`p-3 cursor-pointer hover:bg-gray-50 border-b border-gray-100 last:border-b-0`}
                  onClick={() => {
                    onAddSystem(system.name);
                    setSearchQuery("");
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start space-x-3">
                    <CategoryIcon className="w-4 h-4 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium">{system.title}</h4>
                      <p className="text-xs text-gray-600">{system.description}</p>
                    </div>
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
            const system = powerSystems.find(s => s.name === systemName);
            const CategoryIcon = getCategoryIcon(system?.category || "magic");
            const colorClass = getCategoryColor(system?.category || "magic");
            const borderColorClass = getCategoryBorderColor(system?.category || "magic");

            return (
              <div key={index} className={`p-4 ${colorClass} rounded-lg border ${borderColorClass} cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}>
                <div className="flex items-start justify-between space-x-3">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0">
                      <CategoryIcon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-semibold mb-1">
                        {system?.title || systemName}
                      </h4>
                      <p className="text-sm opacity-80 leading-relaxed">
                        {system?.description || "Custom power type"}
                      </p>
                    </div>
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
              </div>
            );
          })}
        </div>
      )}

      {selectedSystems.length === 0 && (
        <div className="p-4 bg-[var(--color-100)] rounded-lg border border-gray-200">
          <span className="text-sm text-[var(--color-700)]">No power types assigned</span>
        </div>
      )}
    </div>
  );
}

export default function CharacterNew() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { goBack } = useNavigation();
  
  // Track navigation history
  useNavigationTracker();

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

  // Fetch project data
  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: [`/api/projects/${projectId}`],
    enabled: !!projectId,
  });

  // Create character mutation
  const createCharacterMutation = useMutation({
    mutationFn: async (newCharacter: InsertCharacter) => {
      const response = await fetch(`/api/projects/${projectId}/characters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newCharacter),
      });
      if (!response.ok) throw new Error("Failed to create character");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "characters"] });
      setLocation(`/project/${projectId}/characters`);
    },
  });

  const handleSave = async () => {
    if (!characterData.name.trim()) return;
    if (createCharacterMutation.isPending) return; // Prevent double submission

    const newCharacter: InsertCharacter = {
      projectId: parseInt(projectId!),
      ...characterData,
    };

    await createCharacterMutation.mutateAsync(newCharacter);
  };

  const handleCancel = () => {
    setLocation(`/project/${projectId}/characters`);
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-bg)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search characters..."
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Button 
                onClick={goBack}
                variant="outline" 
                size="sm"
                className="bg-[var(--color-100)] border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-200)]"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-500)] to-[var(--color-600)] rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--color-950)]">Create New Character</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button 
                onClick={handleSave} 
                disabled={createCharacterMutation.isPending || !characterData.name.trim()}
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {createCharacterMutation.isPending ? "Creating..." : "Create Character"}
              </Button>
            </div>
          </div>

          {/* Main Content Grid - matching character detail layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Character Summary */}
            <div className="lg:col-span-1">
              <Card className="border border-[var(--color-300)] p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                <div className="space-y-6">
                  {/* Portrait */}
                  <div className="text-center">
                    <div className="relative inline-block">
                      <div className="w-32 h-40 bg-[var(--color-200)] rounded-lg flex items-center justify-center border-2 border-dashed border-[var(--color-400)]">
                        <User className="w-16 h-16 text-[var(--color-600)]" />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white"
                        onClick={() => {}}
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Best 7:9 ratio</p>
                  </div>

                  {/* Character Name */}
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-gray-700">Name:</span>
                    <Input
                      value={characterData.name}
                      onChange={(e) => setCharacterData({...characterData, name: e.target.value})}
                      className="w-32 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                      placeholder="Character Name"
                    />
                  </div>

                  {/* Role */}
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-gray-700">Role:</span>
                    <Select 
                      value={characterData.role} 
                      onValueChange={(value) => setCharacterData({...characterData, role: value})}
                    >
                      <SelectTrigger className="w-32 h-8 text-sm bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Protagonist">Protagonist</SelectItem>
                        <SelectItem value="Antagonist">Antagonist</SelectItem>
                        <SelectItem value="Ally">Ally</SelectItem>
                        <SelectItem value="Enemy">Enemy</SelectItem>
                        <SelectItem value="Neutral">Neutral</SelectItem>
                        <SelectItem value="Supporting">Supporting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Age */}
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-gray-700">Age:</span>
                    <Input
                      value={characterData.age}
                      onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                      className="w-16 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                      placeholder="22"
                    />
                  </div>

                  {/* Race */}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700">Race:</span>
                    <Input
                      value={characterData.race}
                      onChange={(e) => setCharacterData({...characterData, race: e.target.value})}
                      className="w-24 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                      placeholder="Human"
                    />
                  </div>


                </div>
              </Card>
            </div>

            {/* Right Side - Tabbed Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-[var(--color-100)]">
                  <TabsTrigger value="details" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Details</TabsTrigger>
                  <TabsTrigger value="appearance" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Appearance</TabsTrigger>
                  <TabsTrigger value="backstory" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Backstory</TabsTrigger>
                  <TabsTrigger value="weapons" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Weapons</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Brief Description</h3>
                        <textarea
                          value={characterData.description}
                          onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                          rows={3}
                          className="w-full p-3 bg-[var(--color-100)] border border-gray-300 rounded-lg focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)] resize-none"
                          placeholder="Brief character description..."
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Personality</h3>
                        <textarea
                          value={characterData.personality}
                          onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                          className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                          placeholder="Character's personality traits..."
                        />
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Power Type</h3>
                        <PowerSystemSearch
                          selectedSystems={selectedPowerSystems}
                          onAddSystem={(system) => setSelectedPowerSystems([...selectedPowerSystems, system])}
                          onRemoveSystem={(system) => setSelectedPowerSystems(selectedPowerSystems.filter(s => s !== system))}
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Physical Appearance</h3>
                      <textarea
                        value={characterData.appearance}
                        onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                        placeholder="Describe the character's physical appearance..."
                      />
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="backstory" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Backstory</h3>
                      <textarea
                        value={characterData.backstory}
                        onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                        className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                        placeholder="Character's background story..."
                      />
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="weapons" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="flex items-center mb-4">
                      <Sword className="w-5 h-5 mr-2 text-[var(--color-700)]" />
                      <h3 className="text-lg font-semibold text-gray-800">Weapons & Equipment</h3>
                    </div>
                    <textarea
                      value={characterData.weapons}
                      onChange={(e) => setCharacterData({...characterData, weapons: e.target.value})}
                      className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                      placeholder="List the character's weapons, armor, and important equipment..."
                    />
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