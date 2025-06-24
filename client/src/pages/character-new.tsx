import { useState, useRef, useEffect } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, User, Upload, Crown, Shield, Sword, UserCheck, UserX, HelpCircle, Wand2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import type { InsertCharacter, ProjectWithStats } from "@shared/schema";

// Power/Magic Systems with descriptions
const powerSystems = [
  { 
    name: "Fire Magic", 
    description: "Manipulation of flames and heat energy. Practitioners can create, control, and extinguish fire.",
    title: "Pyromancy Arts"
  },
  { 
    name: "Water Magic", 
    description: "Control over water and ice. Masters can manipulate precipitation, create barriers, and heal.",
    title: "Hydromantic Arts" 
  },
  { 
    name: "Earth Magic", 
    description: "Communion with stone, soil, and minerals. Allows for terraforming and defensive magic.",
    title: "Geomantic Arts"
  },
  { 
    name: "Air Magic", 
    description: "Mastery over wind and atmosphere. Enables flight, weather control, and sonic attacks.",
    title: "Aeromantic Arts"
  },
  { 
    name: "Shadow Magic", 
    description: "Manipulation of darkness and stealth. Grants invisibility, teleportation, and fear effects.",
    title: "Umbramantic Arts"
  },
  { 
    name: "Light Magic", 
    description: "Channeling of pure light energy. Provides healing, purification, and divine protection.",
    title: "Lumimantic Arts"
  },
  { 
    name: "Time Magic", 
    description: "Rare temporal manipulation. Allows limited foresight, slowing time, and minor reversals.",
    title: "Chronomantic Arts"
  },
  { 
    name: "Mind Magic", 
    description: "Mental manipulation and telepathy. Enables thought reading, illusions, and psychic attacks.",
    title: "Psionic Arts"
  }
];

// Character role configuration
const roleConfig = {
  "Protagonist": { icon: Crown, color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  "Antagonist": { icon: Sword, color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
  "Ally": { icon: Shield, color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  "Enemy": { icon: UserX, color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
  "Neutral": { icon: HelpCircle, color: "bg-gray-500", bgColor: "bg-gray-50", textColor: "text-gray-700", borderColor: "border-gray-200" },
  "Supporting": { icon: UserCheck, color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" }
};

// Power System Search Component
interface PowerSystemSearchProps {
  selectedSystems: string[];
  onAddSystem: (system: string) => void;
  onRemoveSystem: (system: string) => void;
}

function PowerSystemSearch({ selectedSystems, onAddSystem, onRemoveSystem }: PowerSystemSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredSystems, setFilteredSystems] = useState<typeof powerSystems>([]);

  useEffect(() => {
    if (searchValue) {
      const filtered = powerSystems.filter(
        (system) =>
          system.name.toLowerCase().includes(searchValue.toLowerCase()) &&
          !selectedSystems.includes(system.name)
      );
      setFilteredSystems(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredSystems([]);
      setIsOpen(false);
    }
  }, [searchValue, selectedSystems]);

  const handleSelectSystem = (systemName: string) => {
    onAddSystem(systemName);
    setSearchValue("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="relative">
        <Input
          placeholder="Search power systems..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => {
            if (filteredSystems.length > 0) setIsOpen(true);
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        {isOpen && filteredSystems.length > 0 && (
          <div className="absolute z-[999] w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredSystems.map((system, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectSystem(system.name)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium text-sm">{system.name}</span>
                    <p className="text-xs text-gray-600 line-clamp-1">{system.description}</p>
                  </div>
                  <Check className="w-4 h-4 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Systems */}
      {selectedSystems.length > 0 && (
        <div className="space-y-2">
          {selectedSystems.map((systemName, index) => {
            const system = powerSystems.find(s => s.name === systemName);
            return (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center space-x-3">
                  <Wand2 className="w-4 h-4 text-blue-600" />
                  <div>
                    <span className="text-sm font-medium text-blue-800">{system?.title || systemName}</span>
                    <p className="text-xs text-blue-600">{system?.description || "Custom power system"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveSystem(systemName)}
                  className="text-blue-400 hover:text-blue-600"
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

export default function NewCharacter() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const [selectedPowerSystems, setSelectedPowerSystems] = useState<string[]>([]);

  const [characterData, setCharacterData] = useState({
    name: "",
    description: "",
    personality: "",
    backstory: "",
    weapons: "",
    age: "",
    race: "",
    class: "",
    location: "",
    role: "",
    appearance: ""
  });

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

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const createCharacterMutation = useMutation({
    mutationFn: async (data: InsertCharacter) => {
      return apiRequest("/api/characters", {
        method: "POST",
        body: JSON.stringify({ ...data, projectId: parseInt(projectId!) })
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/characters", projectId] });
      setLocation(`/project/${projectId}/characters`);
    },
  });

  const handleSave = () => {
    if (!characterData.name.trim()) return;
    
    const characterToSave: InsertCharacter = {
      ...characterData,
      projectId: parseInt(projectId!)
    };
    
    createCharacterMutation.mutate(characterToSave);
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