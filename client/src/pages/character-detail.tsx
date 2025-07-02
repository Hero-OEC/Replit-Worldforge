import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Edit3, Save, X, User, Upload, Sword, Wand2, Crown, Shield, UserCheck, UserX, HelpCircle, Check, Clock, Sparkles, Zap, Trash2, Star, Users, Calendar, MapPin, Eye, Swords, Lightbulb, Award, Heart, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tag, getTagVariant } from "@/components/ui/tag";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link as WouterLink } from "wouter";
import Navbar from "@/components/layout/navbar";
import SerpentineTimeline from "@/components/timeline/serpentine-timeline";
import type { Character, ProjectWithStats } from "@shared/schema";

// Character Timeline Component - using reusable SerpentineTimeline
function CharacterTimelineComponent({ character }: { character: any }) {
  return (
    <SerpentineTimeline 
      filterCharacter={character.name}
      className="w-full"
    />
  );
}

// Event type icons and colors (matching main timeline page)
const priorityColors = {
  high: "bg-[var(--color-500)]",
  medium: "bg-[var(--color-400)]",
  low: "bg-[var(--color-300)]",
};

const eventTypeIcons = {
  "Character Arc": User,
  "Character Development": User,
  "World Event": Calendar,
  Discovery: Eye,
  Conflict: Swords,
  Revelation: Lightbulb,
  "Heroic Act": Award,
  "Political Event": Crown,
  Romance: Heart,
  Mystery: HelpCircle,
  Magic: Sparkles,
  magic: Sparkles,
  Battle: Zap,
  Traveling: Plane,
  Alliance: Users,
  Artifacts: Award,
  Betrayal: Swords,
  Competition: Award,
  Customs: Users,
  Escape: Plane,
  History: Calendar,
  Institutions: Crown,
  "Magic Ritual": Sparkles,
  Preparation: Edit3,
  Prophecies: Eye,
  Prophecy: Eye,
  Quest: Star,
  Religion: Heart,
  Tragedy: HelpCircle,
};



// Character role configuration
const roleConfig = {
  "Protagonist": { icon: Crown, color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  "Antagonist": { icon: Sword, color: "bg-destructive", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
  "Ally": { icon: Shield, color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  "Enemy": { icon: UserX, color: "bg-[var(--color-500)]", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
  "Neutral": { icon: HelpCircle, color: "bg-[var(--color-100)]0", bgColor: "bg-[var(--color-100)]", textColor: "text-gray-700", borderColor: "border-gray-200" },
  "Supporting": { icon: UserCheck, color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" }
};

// Power System Search Component
interface PowerSystemSearchProps {
  selectedSystems: string[];
  onAddSystem: (system: string) => void;
  onRemoveSystem: (system: string) => void;
  projectId: string;
}

function PowerSystemSearch({ selectedSystems, onAddSystem, onRemoveSystem, projectId }: PowerSystemSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredSystems, setFilteredSystems] = useState<any[]>([]);

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
    return category === "power" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";
  };

  const getCategoryBorderColor = (category: string) => {
    return category === "power" ? "border-blue-200" : "border-purple-200";
  };

  useEffect(() => {
    if (searchValue) {
      const filtered = magicSystems.filter(
        (system: any) =>
          system.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          !selectedSystems.includes(system.name)
      );
      setFilteredSystems(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSystems([]);
      setIsOpen(false);
    }
  }, [searchValue, selectedSystems, magicSystems]);

  const handleSelectSystem = (systemName: string) => {
    onAddSystem(systemName);
    setSearchValue("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          placeholder="Search power types..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => {
            if (filteredSystems.length > 0) setIsOpen(true);
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="bg-[var(--color-100)] border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        {isOpen && filteredSystems.length > 0 && (
          <div className="absolute z-[999] w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredSystems.map((system, index) => {
              const CategoryIcon = getCategoryIcon(system.category);
              return (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-[var(--color-200)] cursor-pointer"
                  onClick={() => handleSelectSystem(system.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="w-4 h-4 text-[var(--color-600)]" />
                      <div>
                        <span className="font-medium text-sm">{system.name}</span>
                        <p className="text-xs text-[var(--color-700)] line-clamp-1">{system.description}</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-[var(--color-600)]" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Selected Systems */}
      {selectedSystems.length > 0 && (
        <div className="space-y-2">
          {selectedSystems.map((systemName, index) => {
            const system = magicSystems.find((s: any) => s.name === systemName);
            const CategoryIcon = getCategoryIcon(system?.category || "magic");
            const colorClass = getCategoryColor(system?.category || "magic");
            const borderColorClass = getCategoryBorderColor(system?.category || "magic");

            return (
              <div
                key={index}
                className={`flex items-center justify-between p-3 ${colorClass} rounded-lg border ${borderColorClass}`}
              >
                <div className="flex items-center space-x-3">
                  <CategoryIcon className="w-4 h-4" />
                  <div>
                    <span className="text-sm font-medium">{system?.name || systemName}</span>
                    <p className="text-xs opacity-80">{system?.description || "Custom power type"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveSystem(systemName)}
                  className="opacity-60 hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CharacterDetail() {
  const { projectId, characterId } = useParams<{ projectId: string; characterId: string }>();
  const [location, navigate] = useLocation();
  const queryClient = useQueryClient();
  const { goBack } = useNavigation();

  // All state declarations first
  const [isEditing, setIsEditing] = useState(false);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [selectedPowerSystems, setSelectedPowerSystems] = useState<string[]>([]);
  const [characterMagicSystems, setCharacterMagicSystems] = useState<any[]>([]);
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

  // All refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Track navigation history
  useNavigationTracker();

  // All queries - moved before any conditional logic or effects
  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Fetch magic systems for display
  const { data: magicSystems = [] } = useQuery({
    queryKey: ["/api/magic-systems", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/magic-systems?projectId=${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch magic systems");
      return response.json();
    },
    enabled: !!projectId,
  });

  // Fetch character data from API
  const { data: character, isLoading, error } = useQuery({
    queryKey: ["/api/characters", characterId],
    queryFn: async () => {
      const response = await fetch(`/api/characters/${characterId}`);
      if (!response.ok) throw new Error("Failed to fetch character");
      return response.json();
    },
    enabled: !!characterId,
  });

  // Fetch timeline events to find character's latest location
  const { data: timelineEvents = [] } = useQuery({
    queryKey: ["/api/projects", projectId, "timeline"],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}/timeline`);
      if (!response.ok) throw new Error("Failed to fetch timeline events");
      return response.json();
    },
    enabled: !!projectId
  });

  // Helper functions for power system display
  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800";
  };

  const getCategoryBorderColor = (category: string) => {
    return category === "power" ? "border-blue-200" : "border-purple-200";
  };

  // All effects
  // Get character magic systems
  useEffect(() => {
    if (characterId) {
      fetch(`/api/characters/${characterId}/magic-systems`)
        .then(res => res.json())
        .then(data => {
          // Ensure we always have an array
          setCharacterMagicSystems(Array.isArray(data) ? data : []);
        })
        .catch(err => {
          console.error('Error fetching character magic systems:', err);
          setCharacterMagicSystems([]);
        });
    }
  }, [characterId]);

  // Initialize power systems when character magic systems load
  useEffect(() => {
    if (Array.isArray(characterMagicSystems)) {
      const systemNames = characterMagicSystems.map((cms: any) => cms.magicSystem?.name || cms.name).filter(Boolean);
      setSelectedPowerSystems(systemNames);
    }
  }, [characterMagicSystems]);

  // Initialize character data when character is loaded
  useEffect(() => {
    if (character) {
      setCharacterData({
        name: character.name || "",
        description: character.description || "",
        personality: character.personality || "",
        backstory: character.backstory || "",
        weapons: character.weapons || "",
        age: character.age || "",
        race: character.race || "",
        location: character.location || "",
        role: character.role || "",
        appearance: character.appearance || ""
      });
    }
  }, [character]);

  // Get role configuration
  const roleInfo = roleConfig[character?.role as keyof typeof roleConfig] || roleConfig["Supporting"];
  const RoleIcon = roleInfo.icon;

  // Function to get character's latest location from timeline events
  const getCharacterLatestLocation = () => {
    if (!character?.name || !timelineEvents?.length) {
      return character?.location || "Unknown Location";
    }

    // Filter events where this character appears
    const characterEvents = timelineEvents.filter((event: any) => 
      event.characters && Array.isArray(event.characters) && 
      event.characters.includes(character.name)
    );

    if (characterEvents.length === 0) {
      return character.location || "Unknown Location";
    }

    // Sort events by date (assuming date format can be sorted)
    const sortedEvents = [...characterEvents].sort((a: any, b: any) => {
      return new Date(b.createdAt || b.date).getTime() - new Date(a.createdAt || a.date).getTime();
    });

    // Return the location of the most recent event, or fallback to character's stored location
    return sortedEvents[0]?.location || character.location || "Unknown Location";
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

  const handleSave = async () => {
    try {
      const updateData = {
        ...characterData,
        powerSystems: selectedPowerSystems
      };

      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) throw new Error('Failed to update character');

      // Refetch character data to update the display
      queryClient.invalidateQueries({ queryKey: ["/api/characters", characterId] });
      queryClient.invalidateQueries({ queryKey: ["/api/characters", characterId, "magic-systems"] });
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving character:', error);
      // In a real app, you'd show a toast notification here
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset character data to original values
    if (character) {
      setCharacterData({
        name: character.name || "",
        description: character.description || "",
        personality: character.personality || "",
        backstory: character.backstory || "",
        weapons: character.weapons || "",
        age: character.age || "",
        race: character.race || "",
        location: character.location || "",
        role: character.role || "",
        appearance: character.appearance || ""
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
          searchPlaceholder="Search characters..."
        />
        <main className="p-8 bg-[var(--worldforge-cream)]">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="text-[var(--color-600)]">Loading character...</div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
          searchPlaceholder="Search characters..."
        />
        <main className="p-8 bg-[var(--worldforge-cream)]">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="text-red-600">Character not found</div>
          </div>
        </main>
      </div>
    );
  }

  

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search characters..."
      />
      <main className="p-8 bg-[var(--worldforge-cream)]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                onClick={goBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                {isEditing ? (
                  <Input
                    value={characterData.name}
                    onChange={(e) => setCharacterData({...characterData, name: e.target.value})}
                    className="text-3xl font-bold text-gray-800 bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)] h-12"
                    placeholder="Character Name"
                  />
                ) : (
                  <h1 className="text-3xl font-bold text-gray-800">{character?.name}</h1>
                )}
                <div className="mt-2">
                  {isEditing ? (
                    <Select 
                      value={characterData.role} 
                      onValueChange={(value) => setCharacterData({...characterData, role: value})}
                    >
                      <SelectTrigger className="w-48">
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
                  ) : (
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 ${roleInfo.bgColor} ${roleInfo.textColor} rounded-full text-sm font-medium border ${roleInfo.borderColor}`}>
                      <RoleIcon className="w-4 h-4" />
                      <span>{character?.role}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button onClick={handleSave} className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Character
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this character?")) {
                        // In real app, this would delete the character and redirect
                        console.log("Delete character:", character.id);
                      }
                    }}
                    className="text-destructive border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Character Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Side - Portrait */}
            <div className="lg:col-span-1">
              <Card className="border border-[var(--color-300)] p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Portrait
                  </h2>
                  {isEditing && (
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-[var(--color-600)]">Best: 7:9 ratio</span>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                      >
                        <Upload className="w-3 h-3 mr-1" />
                        Upload
                      </Button>
                    </div>
                  )}
                </div>

                {/* Character Portrait */}
                <div className="relative mb-6 flex justify-center">
                  <div className="aspect-[7/9] bg-[var(--color-200)] rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden" style={{ width: '280px' }}>
                    {characterImage || character.image ? (
                      <img 
                        src={characterImage || character.image} 
                        alt={character.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <img 
                        src="/attached_assets/Placeholder_1750916543106.jpg" 
                        alt="Character placeholder"
                        className="w-full h-full object-cover opacity-30"
                      />
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
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-gray-700">Age:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.age}
                        onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                        className="w-20 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                        placeholder="22"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-[var(--color-200)] px-3 py-1 rounded-md">{character.age}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700">Race:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.race}
                        onChange={(e) => setCharacterData({...characterData, race: e.target.value})}
                        className="w-24 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                        placeholder="Human"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-[var(--color-200)] px-3 py-1 rounded-md">{character.race}</span>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side - Tabbed Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6 bg-[var(--color-100)]">
                  <TabsTrigger value="details" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Details</TabsTrigger>
                  <TabsTrigger value="appearance" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Appearance</TabsTrigger>
                  <TabsTrigger value="backstory" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Backstory</TabsTrigger>
                  <TabsTrigger value="weapons" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Weapons</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-sm data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Brief Description</h3>
                        {isEditing ? (
                          <textarea
                            value={characterData.description}
                            onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                            rows={3}
                            className="w-full p-3 bg-[var(--color-100)] border border-gray-300 rounded-lg focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)] resize-none"
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
                            value={characterData.personality}
                            onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                            className="w-full h-20 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                            placeholder="Character's personality traits..."
                          />
                        ) : (
                          <p className="text-gray-700">{character.personality}</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Power Type</h3>
                        {isEditing ? (
                          <PowerSystemSearch
                            selectedSystems={selectedPowerSystems}
                            onAddSystem={(system) => setSelectedPowerSystems([...selectedPowerSystems, system])}
                            onRemoveSystem={(system) => setSelectedPowerSystems(selectedPowerSystems.filter(s => s !== system))}
                            projectId={projectId!}
                          />
                        ) : selectedPowerSystems.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {selectedPowerSystems.map((systemName, index) => {
                              const system = magicSystems.find((s: any) => s.name === systemName);
                              const CategoryIcon = getCategoryIcon(system?.category || "magic");
                              const colorClass = getCategoryColor(system?.category || "magic");
                              const borderColorClass = getCategoryBorderColor(system?.category || "magic");

                              return (
                                <WouterLink key={index} href={`/project/${projectId}/magic-systems/${system?.id || ''}`}>
                                  <div className={`p-4 ${colorClass} rounded-lg border ${borderColorClass} cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}>
                                    <div className="flex items-start space-x-3">
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
                                  </div>
                                </WouterLink>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-4 bg-[var(--color-100)] rounded-lg border border-gray-200">
                            <span className="text-sm text-[var(--color-700)]">No power types assigned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Physical Appearance</h3>
                      {isEditing ? (
                        <textarea
                          value={characterData.appearance}
                          onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                          placeholder="Describe the character's physical appearance..."
                        />
                      ) : (
                        <p className="text-gray-700">{character.appearance}</p>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="backstory" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Backstory</h3>
                      {isEditing ? (
                        <textarea
                          value={characterData.backstory}
                          onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                          className="w-full h-40 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                          placeholder="Character's background story..."
                        />
                      ) : (
                        <p className="text-gray-700">{character.backstory}</p>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="weapons" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="flex items-center mb-4">
                      <Sword className="w-5 h-5 mr-2 text-[var(--color-700)]" />
                      <h3 className="text-lg font-semibold text-gray-800">Weapons & Equipment</h3>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={characterData.weapons}
                        onChange={(e) => setCharacterData({...characterData, weapons: e.target.value})}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                        placeholder="List the character's weapons, armor, and important equipment..."
                      />
                    ) : (
                      <p className="text-gray-700">{character.weapons}</p>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-[var(--color-600)]" />
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-950)]">Character Timeline</h3>
                          <p className="text-sm text-[var(--color-700)]">
                            Events where {character.name} appears throughout the story
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Empty timeline content */}
                    <div className="text-center py-12 text-[var(--color-600)]">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Timeline content will be added here</p>
                    </div>
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}