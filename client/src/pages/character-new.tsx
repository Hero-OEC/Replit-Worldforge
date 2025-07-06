import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, User, Upload, Crown, Shield, Sword, UserCheck, UserX, HelpCircle, Wand2, Check, X, Sparkles, Zap, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tag, getTagVariant } from "@/components/ui/tag";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { uploadCharacterImage } from "@/lib/supabase";
import { ImageUpload } from "@/components/ui/image-upload";
import Navbar from "@/components/layout/navbar";
import type { InsertCharacter, ProjectWithStats } from "@shared/schema";



// PowerSystemSearch Component
function PowerSystemSearch({ selectedSystems, onAddSystem, onRemoveSystem, projectId }: {
  selectedSystems: string[];
  onAddSystem: (system: string) => void;
  onRemoveSystem: (system: string) => void;
  projectId: string;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

  const filteredSystems = magicSystems.filter((system: any) =>
    !selectedSystems.includes(system.name) &&
    (system.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     system.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" ? "bg-[var(--color-100)] text-[var(--color-800)] border-[var(--color-300)]" : "bg-[var(--color-200)] text-[var(--color-900)] border-[var(--color-400)]";
  };

  const getCategoryBorderColor = (category: string) => {
    return category === "power" ? "border-[var(--color-300)]" : "border-[var(--color-400)]";
  };

  return (
    <div className="space-y-3">
      {/* Search Input */}
      <div className="relative" ref={searchRef}>
        <Input
          type="text"
          placeholder="Search power types..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
        />
        {isOpen && searchQuery && filteredSystems.length > 0 && (
          <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {filteredSystems.map((system: any) => {
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
                      <h4 className="text-sm font-medium">{system.name}</h4>
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
            const system = magicSystems.find((s: any) => s.name === systemName);
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
                        {system?.name || systemName}
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
      return Scale;
    default:
      return User;
  }
};

export default function CharacterNew() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { goBack } = useNavigation();
  
  // Track navigation history
  useNavigationTracker();

  const [characterData, setCharacterData] = useState({
    name: "",
    prefix: "",
    suffix: "",
    description: "",
    personality: "",
    backstory: "",
    weapons: "",
    age: "",
    race: "",
    location: "",
    role: "",
    appearance: "",
    imageUrl: "",
    imagePositionX: 0,
    imagePositionY: 0
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
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error(`Failed to create character: ${errorText}`);
      }
      
      const result = await response.json();
      return result;
    },
    onSuccess: (data) => {
      console.log("Character created successfully:", data);
      queryClient.invalidateQueries({ queryKey: ["/api/characters", projectId] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      setLocation(`/project/${projectId}/characters`);
    },
    onError: (error) => {
      console.error("Character creation error:", error);
    },
  });

  const handleSave = async () => {
    if (!characterData.name.trim()) {
      console.log("Character name is required");
      return;
    }
    if (createCharacterMutation.isPending) return; // Prevent double submission

    try {
      const newCharacter: InsertCharacter = {
        projectId: parseInt(projectId!),
        ...characterData,
        powerSystems: selectedPowerSystems,
      };

      console.log("Creating character:", newCharacter);
      await createCharacterMutation.mutateAsync(newCharacter);
    } catch (error) {
      console.error("Error creating character:", error);
    }
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
        
      />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header - matching lore edit page layout */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setLocation(`/project/${projectId}/characters`)}
                  variant="ghost" 
                  size="sm"
                  className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg flex items-center justify-center flex-shrink-0">
                      {(() => {
                        const RoleIcon = getRoleIcon(characterData.role);
                        return <RoleIcon className="w-5 h-5 text-[var(--color-700)]" />;
                      })()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <Input
                          value={characterData.prefix}
                          onChange={(e) => setCharacterData({...characterData, prefix: e.target.value})}
                          placeholder="Sir, Dr., Lady..."
                          className="w-24 text-3xl font-bold text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-2 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                        />
                        <Input
                          value={characterData.name}
                          onChange={(e) => setCharacterData({...characterData, name: e.target.value})}
                          placeholder="Enter character name..."
                          className="flex-1 text-3xl font-bold text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                        />
                        <Input
                          value={characterData.suffix}
                          onChange={(e) => setCharacterData({...characterData, suffix: e.target.value})}
                          placeholder="Jr., III, the Great..."
                          className="w-32 text-3xl font-bold text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-2 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-13">
                    <Select 
                      value={characterData.role} 
                      onValueChange={(value) => setCharacterData({...characterData, role: value})}
                    >
                      <SelectTrigger className="w-auto bg-[var(--color-100)] text-[var(--color-800)] border-0 focus:ring-0 h-auto p-2 rounded-full text-sm font-medium">
                        {characterData.role ? (
                          <div className="flex items-center space-x-2">
                            {(() => {
                              const RoleIcon = getRoleIcon(characterData.role);
                              return <RoleIcon className="w-4 h-4" />;
                            })()}
                            <span>{characterData.role}</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select role" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Protagonist">
                          <div className="flex items-center space-x-2">
                            <Crown className="w-4 h-4" />
                            <span>Protagonist</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Antagonist">
                          <div className="flex items-center space-x-2">
                            <UserX className="w-4 h-4" />
                            <span>Antagonist</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Ally">
                          <div className="flex items-center space-x-2">
                            <UserCheck className="w-4 h-4" />
                            <span>Ally</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Enemy">
                          <div className="flex items-center space-x-2">
                            <Sword className="w-4 h-4" />
                            <span>Enemy</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Supporting">
                          <div className="flex items-center space-x-2">
                            <Shield className="w-4 h-4" />
                            <span>Supporting</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="Neutral">
                          <div className="flex items-center space-x-2">
                            <HelpCircle className="w-4 h-4" />
                            <span>Neutral</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
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
          </div>

          {/* Main Content Grid - matching character detail layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Character Summary */}
            <div className="lg:col-span-1">
              <Card className="border border-[var(--color-300)] p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                <div className="space-y-6">
                  {/* Portrait */}
                  <div className="text-center">
                    <ImageUpload
                      value={characterData.imageUrl}
                      onChange={(url) => setCharacterData({...characterData, imageUrl: url || ""})}
                      onUpload={async (file) => {
                        // We need to create a temporary character to get an ID for the upload
                        // For now, we'll use a timestamp as a unique identifier
                        const tempId = Date.now();
                        return await uploadCharacterImage(file, tempId);
                      }}
                      placeholder="Upload character portrait"
                      onPositionChange={(x, y) => setCharacterData({...characterData, imagePositionX: x, imagePositionY: y})}
                      imagePosition={{ x: characterData.imagePositionX, y: characterData.imagePositionY }}
                    />
                    <p className="text-xs text-[var(--color-600)] mt-2">Use 7:9 aspect ratio for best results</p>
                  </div>





                  {/* Age */}
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-gray-700">Age:</span>
                    <Input
                      value={characterData.age}
                      onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                      className="w-20 h-8 text-sm text-right text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                      placeholder="22"
                    />
                  </div>

                  {/* Race */}
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700">Race:</span>
                    <Input
                      value={characterData.race}
                      onChange={(e) => setCharacterData({...characterData, race: e.target.value})}
                      className="w-20 h-8 text-sm text-right text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
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
                        <h3 className="text-xl font-semibold text-[var(--color-950)] mb-3 flex items-center space-x-2">
                          <User className="w-5 h-5" />
                          <span>Brief Description</span>
                        </h3>
                        <textarea
                          value={characterData.description}
                          onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                          rows={3}
                          className="w-full p-3 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                          placeholder="Brief character description..."
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-[var(--color-950)] mb-3 flex items-center space-x-2">
                          <User className="w-5 h-5" />
                          <span>Personality</span>
                        </h3>
                        <textarea
                          value={characterData.personality}
                          onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                          className="w-full h-20 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                          placeholder="Character's personality traits..."
                        />
                      </div>

                      <div>
                        <h3 className="text-xl font-semibold text-[var(--color-950)] mb-3 flex items-center space-x-2">
                          <Wand2 className="w-5 h-5" />
                          <span>Power Type</span>
                        </h3>
                        <PowerSystemSearch
                          selectedSystems={selectedPowerSystems}
                          onAddSystem={(system) => setSelectedPowerSystems([...selectedPowerSystems, system])}
                          onRemoveSystem={(system) => setSelectedPowerSystems(selectedPowerSystems.filter(s => s !== system))}
                          projectId={projectId!}
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-950)] mb-3 flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Physical Appearance</span>
                      </h3>
                      <textarea
                        value={characterData.appearance}
                        onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                        className="w-full h-32 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                        placeholder="Describe the character's physical appearance..."
                      />
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="backstory" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-950)] mb-3 flex items-center space-x-2">
                        <User className="w-5 h-5" />
                        <span>Backstory</span>
                      </h3>
                      <textarea
                        value={characterData.backstory}
                        onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                        className="w-full h-40 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                        placeholder="Character's background story..."
                      />
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="weapons" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-xl font-semibold text-[var(--color-950)] mb-3 flex items-center space-x-2">
                        <Sword className="w-5 h-5" />
                        <span>Weapons & Equipment</span>
                      </h3>
                      <textarea
                        value={characterData.weapons}
                        onChange={(e) => setCharacterData({...characterData, weapons: e.target.value})}
                        className="w-full h-32 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                        placeholder="List the character's weapons, armor, and important equipment..."
                      />
                    </div>
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