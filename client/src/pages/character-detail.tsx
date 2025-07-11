import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Edit3, Save, X, User, Upload, Sword, Wand2, Crown, Shield, UserCheck, UserX, HelpCircle, Check, Clock, Sparkles, Zap, Trash2, Star, Users, Calendar, MapPin, Eye, Swords, Lightbulb, Award, Heart, Plane, Scale } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tag, getTagVariant } from "@/components/ui/tag";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link as WouterLink } from "wouter";
import Navbar from "@/components/layout/navbar";
import SerpentineTimeline from "@/components/timeline/serpentine-timeline";
import { uploadCharacterImage } from "@/lib/supabase";
import { ImageUpload } from "@/components/ui/image-upload";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import type { Character, ProjectWithStats } from "@shared/schema";

// Character Timeline Component - using enhanced SerpentineTimeline


// Writing status colors (matching main timeline page)
const writingStatusColors = {
  planning: "bg-[var(--color-200)]",
  writing: "bg-[var(--color-400)]",
  first_draft: "bg-[var(--color-500)]",
  editing: "bg-[var(--color-600)]",
  complete: "bg-[var(--color-700)]",
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
  "Protagonist": { icon: Crown, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-500)] text-[var(--color-50)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" },
  "Antagonist": { icon: Sword, color: "bg-[var(--color-950)]", bgColor: "bg-[var(--color-700)] text-[var(--color-50)]", textColor: "text-[var(--color-950)]", borderColor: "border-[var(--color-700)]" },
  "Ally": { icon: Shield, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-400)] text-[var(--color-950)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-300)]" },
  "Enemy": { icon: UserX, color: "bg-[var(--color-800)]", bgColor: "bg-[var(--color-600)] text-[var(--color-50)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-600)]" },
  "Neutral": { icon: Scale, color: "bg-[var(--color-400)]", bgColor: "bg-[var(--color-300)] text-[var(--color-900)]", textColor: "text-[var(--color-600)]", borderColor: "border-[var(--color-300)]" },
  "Supporting": { icon: UserCheck, color: "bg-[var(--color-700)]", bgColor: "bg-[var(--color-200)] text-[var(--color-800)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" }
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
    return category === "power" 
      ? "bg-[var(--color-100)] text-[var(--color-800)]" 
      : "bg-[var(--color-200)] text-[var(--color-900)]";
  };

  const getCategoryBorderColor = (category: string) => {
    return category === "power" 
      ? "border-[var(--color-300)] hover:border-[var(--color-400)]" 
      : "border-[var(--color-400)] hover:border-[var(--color-500)]";
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
          className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
        />
        {isOpen && filteredSystems.length > 0 && (
          <div className="absolute z-[999] w-full bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredSystems.map((system, index) => {
              const CategoryIcon = getCategoryIcon(system.category);
              return (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-[var(--color-100)] cursor-pointer"
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
  const [location, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { goBack } = useNavigation();

  // All state declarations first
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPowerSystems, setSelectedPowerSystems] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    imageUrl: ""
  });

  // Update character mutation
  const updateCharacterMutation = useMutation({
    mutationFn: async () => {
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
      return response.json();
    },
    onSuccess: () => {
      // Refetch character data to update the display
      queryClient.invalidateQueries({ queryKey: ["/api/characters", characterId] });
      
      // Invalidate magic system character caches since power systems may have changed
      queryClient.invalidateQueries({ 
        queryKey: ["/api/magic-systems"], 
        predicate: (query) => {
          // Invalidate any magic system character queries
          return query.queryKey.length === 3 && 
                 query.queryKey[0] === "/api/magic-systems" && 
                 query.queryKey[2] === "characters";
        }
      });
      setIsEditing(false);
    },
    onError: (error: any) => {
      console.error('Error saving character:', error);
      // In a real app, you'd show a toast notification here
    },
  });

  // Delete character mutation
  const deleteCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete character');
      }
    },
    onSuccess: () => {
      // Invalidate the characters list to update the main page
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "characters"] });
      // Navigate back to characters page
      setLocation(`/project/${projectId}/characters`);
    },
  });

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
    return category === "power" 
      ? "bg-[var(--color-100)] text-[var(--color-800)]" 
      : "bg-[var(--color-200)] text-[var(--color-900)]";
  };

  const getCategoryBorderColor = (category: string) => {
    return category === "power" 
      ? "border-[var(--color-300)] hover:border-[var(--color-400)]" 
      : "border-[var(--color-400)] hover:border-[var(--color-500)]";
  };

  // All effects
  // Initialize character data when character is loaded
  useEffect(() => {
    if (character) {
      setCharacterData({
        name: character.name || "",
        prefix: character.prefix || "",
        suffix: character.suffix || "",
        description: character.description || "",
        personality: character.personality || "",
        backstory: character.backstory || "",
        weapons: character.weapons || "",
        age: character.age || "",
        race: character.race || "",
        location: character.location || "",
        role: character.role || "",
        appearance: character.appearance || "",
        imageUrl: character.imageUrl || ""
      });
      
      // Initialize power systems from character data (this is the primary source)
      if (character.powerSystems && Array.isArray(character.powerSystems)) {
        setSelectedPowerSystems(character.powerSystems);
      } else {
        // Fallback to empty array if no power systems
        setSelectedPowerSystems([]);
      }
    }
  }, [character]);

  // Get role configuration - use editing role if in edit mode
  const currentRole = isEditing ? characterData.role : character?.role;
  const roleInfo = roleConfig[currentRole as keyof typeof roleConfig] || roleConfig["Supporting"];
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



  const handleSave = () => {
    updateCharacterMutation.mutate();
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset character data to original values
    if (character) {
      setCharacterData({
        name: character.name || "",
        prefix: character.prefix || "",
        suffix: character.suffix || "",
        description: character.description || "",
        personality: character.personality || "",
        backstory: character.backstory || "",
        weapons: character.weapons || "",
        age: character.age || "",
        race: character.race || "",
        location: character.location || "",
        role: character.role || "",
        appearance: character.appearance || "",
        imageUrl: character.imageUrl || ""
      });
      
      // Reset power systems to original values
      if (character.powerSystems && Array.isArray(character.powerSystems)) {
        setSelectedPowerSystems(character.powerSystems);
      } else {
        setSelectedPowerSystems([]);
      }
    }
  };

  const handleDelete = () => {
    deleteCharacterMutation.mutate();
    setDeleteDialogOpen(false);
  };



  if (isLoading && !character) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8 bg-[var(--worldforge-cream)]">
          <div className="max-w-6xl mx-auto">
            <div className="animate-pulse">
              {/* Header skeleton matching actual layout */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-10 bg-[var(--color-200)] rounded"></div>
                    <div>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg"></div>
                        <div className="h-8 bg-[var(--color-200)] rounded w-64"></div>
                      </div>
                      <div className="ml-13 flex items-center space-x-4">
                        <div className="w-24 h-6 bg-[var(--color-200)] rounded-full"></div>
                        <div className="w-20 h-4 bg-[var(--color-200)] rounded"></div>
                        <div className="w-24 h-4 bg-[var(--color-200)] rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 h-10 bg-[var(--color-200)] rounded"></div>
                    <div className="w-24 h-10 bg-[var(--color-200)] rounded"></div>
                  </div>
                </div>
              </div>

              {/* Character Layout - Grid skeleton matching actual 2-column layout */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Side - Portrait Card Skeleton */}
                <div className="lg:col-span-1">
                  <div className="bg-[var(--worldforge-card)] border border-[var(--color-300)] rounded-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-5 h-5 bg-[var(--color-200)] rounded"></div>
                      <div className="h-5 bg-[var(--color-200)] rounded w-16"></div>
                    </div>
                    
                    {/* Character Portrait Skeleton */}
                    <div className="mb-6 flex justify-center">
                      <div className="w-70 h-70 bg-[var(--color-200)] rounded-lg"></div>
                    </div>

                    {/* Basic Info Skeleton */}
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                        <div className="w-8 h-4 bg-[var(--color-200)] rounded"></div>
                        <div className="w-12 h-6 bg-[var(--color-200)] rounded"></div>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <div className="w-10 h-4 bg-[var(--color-200)] rounded"></div>
                        <div className="w-16 h-6 bg-[var(--color-200)] rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Side - Tabbed Content Skeleton */}
                <div className="lg:col-span-2">
                  {/* Tabs Navigation Skeleton */}
                  <div className="grid grid-cols-5 gap-1 mb-6 bg-[var(--color-100)] p-1 rounded-lg">
                    <div className="h-10 bg-[var(--color-200)] rounded"></div>
                    <div className="h-10 bg-[var(--color-200)] rounded"></div>
                    <div className="h-10 bg-[var(--color-200)] rounded"></div>
                    <div className="h-10 bg-[var(--color-200)] rounded"></div>
                    <div className="h-10 bg-[var(--color-200)] rounded"></div>
                  </div>

                  {/* Tab Content Skeleton */}
                  <div className="space-y-6">
                    <div className="bg-[var(--worldforge-card)] border border-[var(--color-300)] rounded-lg p-6">
                      <div className="space-y-6">
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-5 h-5 bg-[var(--color-200)] rounded"></div>
                            <div className="h-5 bg-[var(--color-200)] rounded w-32"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-[var(--color-200)] rounded w-full"></div>
                            <div className="h-4 bg-[var(--color-200)] rounded w-3/4"></div>
                            <div className="h-4 bg-[var(--color-200)] rounded w-1/2"></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center space-x-2 mb-3">
                            <div className="w-5 h-5 bg-[var(--color-200)] rounded"></div>
                            <div className="h-5 bg-[var(--color-200)] rounded w-24"></div>
                          </div>
                          <div className="space-y-2">
                            <div className="h-4 bg-[var(--color-200)] rounded w-full"></div>
                            <div className="h-4 bg-[var(--color-200)] rounded w-2/3"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
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
        
      />
      <main className="p-8 bg-[var(--worldforge-cream)]">
        <div className="max-w-6xl mx-auto">
          {/* Header - matching lore edit page layout */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                  onClick={() => setLocation(`/project/${projectId}/characters`)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    {/* Role icon matching current role */}
                    <div className={`w-10 h-10 bg-[var(--color-200)] rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <RoleIcon className="w-5 h-5 text-[var(--color-700)]" />
                    </div>
                    <div className="flex-1">
                      {isEditing ? (
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
                      ) : (
                        <h1 className="text-3xl font-bold text-gray-800">
                          {character?.prefix && (
                            <span className="text-2xl font-normal opacity-75 mr-2">{character.prefix}</span>
                          )}
                          <span>{character?.name}</span>
                          {character?.suffix && (
                            <span className="text-2xl font-normal opacity-75 ml-2">{character.suffix}</span>
                          )}
                        </h1>
                      )}
                    </div>
                  </div>
                  <div className="ml-13 flex items-center space-x-4">
                    {/* Role selector */}
                    {isEditing ? (
                      <Select 
                        value={characterData.role} 
                        onValueChange={(value) => setCharacterData({...characterData, role: value})}
                      >
                        <SelectTrigger className="w-auto bg-[var(--color-100)] text-[var(--color-800)] border-0 focus:ring-0 h-auto p-2 rounded-full text-sm font-medium">
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
                      <div className={`inline-flex items-center px-3 py-1 ${roleInfo.bgColor} rounded-full text-sm font-medium border ${roleInfo.borderColor}`}>
                        <span>{character?.role}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
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
                      disabled={updateCharacterMutation.isPending}
                      className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateCharacterMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => setIsEditing(true)} 
                      className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit Character
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setDeleteDialogOpen(true)}
                      className="border-red-300 text-red-600 hover:text-red-700 hover:bg-[var(--color-200)]"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
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
                </div>

                {/* Character Portrait */}
                <div className="relative mb-6 flex justify-center">
                  {isEditing ? (
                    <ImageUpload
                      value={characterData.imageUrl}
                      onChange={(url) => setCharacterData({...characterData, imageUrl: url || ""})}
                      onUpload={async (file) => {
                        return await uploadCharacterImage(file, character.id);
                      }}
                      placeholder="Upload character portrait"
                    />
                  ) : (
                    <div className="aspect-square bg-[var(--color-200)] rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden" style={{ width: '280px' }}>
                      {characterData.imageUrl || character.imageUrl ? (
                        <img 
                          src={characterData.imageUrl || character.imageUrl} 
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
                  )}
                </div>

                {/* Basic Info */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-[var(--color-700)]">Age:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.age}
                        onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                        className="w-20 h-8 text-sm text-right text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                        placeholder="22"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-[var(--color-200)] px-3 py-1 rounded-md">{character.age}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-[var(--color-700)]">Race:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.race}
                        onChange={(e) => setCharacterData({...characterData, race: e.target.value})}
                        className="w-20 h-8 text-sm text-right text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
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
                        <div className="flex items-center space-x-2 mb-3">
                          <User className="w-5 h-5 text-[var(--color-700)]" />
                          <span className="text-xl font-medium text-[var(--color-700)]">Brief Description</span>
                        </div>
                        {isEditing ? (
                          <textarea
                            value={characterData.description}
                            onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                            rows={3}
                            className="w-full p-3 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                            placeholder="Brief character description..."
                          />
                        ) : (
                          <p className="text-[var(--color-700)]">{character.description}</p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Heart className="w-5 h-5 text-[var(--color-700)]" />
                          <span className="text-xl font-medium text-[var(--color-700)]">Personality</span>
                        </div>
                        {isEditing ? (
                          <textarea
                            value={characterData.personality}
                            onChange={(e) => setCharacterData({...characterData, personality: e.target.value})}
                            className="w-full h-20 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                            placeholder="Character's personality traits..."
                          />
                        ) : (
                          <p className="text-[var(--color-700)]">{character.personality}</p>
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 mb-3">
                          <Zap className="w-5 h-5 text-[var(--color-700)]" />
                          <span className="text-xl font-medium text-[var(--color-700)]">Power Type</span>
                        </div>
                        {isEditing ? (
                          <PowerSystemSearch
                            selectedSystems={selectedPowerSystems}
                            onAddSystem={(system) => setSelectedPowerSystems([...selectedPowerSystems, system])}
                            onRemoveSystem={(system) => setSelectedPowerSystems(selectedPowerSystems.filter(s => s !== system))}
                            projectId={projectId!}
                          />
                        ) : selectedPowerSystems.length > 0 || character?.powerSystems?.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {(selectedPowerSystems.length > 0 ? selectedPowerSystems : character?.powerSystems || []).map((systemName: string, index: number) => {
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
                          <div className="p-4 bg-[var(--color-100)] rounded-lg border border-[var(--color-200)]">
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
                      <div className="flex items-center space-x-2 mb-3">
                        <Eye className="w-5 h-5 text-[var(--color-700)]" />
                        <span className="text-xl font-medium text-[var(--color-700)]">Physical Appearance</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          value={characterData.appearance}
                          onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                          className="w-full h-32 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                          placeholder="Describe the character's physical appearance..."
                        />
                      ) : (
                        <p className="text-[var(--color-700)]">{character.appearance}</p>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="backstory" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <div className="flex items-center space-x-2 mb-3">
                        <Star className="w-5 h-5 text-[var(--color-700)]" />
                        <span className="text-xl font-medium text-[var(--color-700)]">Backstory</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          value={characterData.backstory}
                          onChange={(e) => setCharacterData({...characterData, backstory: e.target.value})}
                          className="w-full h-40 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                          placeholder="Character's background story..."
                        />
                      ) : (
                        <p className="text-[var(--color-700)]">{character.backstory}</p>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="weapons" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-[var(--color-300)] p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Sword className="w-5 h-5 text-[var(--color-700)]" />
                      <span className="text-xl font-medium text-[var(--color-700)]">Weapons & Equipment</span>
                    </div>
                    {isEditing ? (
                      <textarea
                        value={characterData.weapons}
                        onChange={(e) => setCharacterData({...characterData, weapons: e.target.value})}
                        className="w-full h-32 px-3 py-2 text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all resize-none"
                        placeholder="List the character's weapons, armor, and important equipment..."
                      />
                    ) : (
                      <p className="text-[var(--color-700)]">{character.weapons}</p>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <div className="space-y-6">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-[var(--color-50)]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-[var(--color-950)]">Character Timeline</h3>
                        <p className="text-sm text-[var(--color-700)]">
                          Events where {[character.prefix, character.name, character.suffix].filter(Boolean).join(' ')} appears throughout the story
                        </p>
                      </div>
                    </div>

                    <div className="w-full">
                      <SerpentineTimeline 
                        filterCharacter={character.name}
                        showEditButtons={true}
                        className="w-full"
                      />
                    </div>
                  </div>
                </TabsContent>

              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {character && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Delete Character"
          itemName={character.name}
          description={`Are you sure you want to delete "${character.name}"? This action cannot be undone and will permanently remove the character and all associated data.`}
          isDeleting={deleteCharacterMutation.isPending}
        />
      )}
    </div>
  );
}