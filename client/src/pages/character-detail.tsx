import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Edit3, Save, X, User, Upload, Sword, Wand2, Crown, Shield, UserCheck, UserX, HelpCircle, Check, Clock, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link as WouterLink } from "wouter";
import Navbar from "@/components/layout/navbar";
import SerpentineTimeline from "@/components/timeline/serpentine-timeline";
import type { Character, ProjectWithStats } from "@shared/schema";

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
    title: "Lumimantic Arts",
    category: "magic"
  },
  { 
    name: "Time Magic", 
    description: "Rare temporal manipulation. Allows limited foresight, slowing time, and minor reversals.",
    title: "Chronomantic Arts",
    category: "magic"
  },
  { 
    name: "Mind Magic", 
    description: "Mental manipulation and telepathy. Enables thought reading, illusions, and psychic attacks.",
    title: "Psionic Arts",
    category: "magic"
  },
  { 
    name: "Super Strength", 
    description: "Enhanced physical strength beyond normal human limits. Allows lifting heavy objects and devastating attacks.",
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
    name: "Flight", 
    description: "Power of aerial movement without mechanical assistance. Provides tactical advantage and mobility.",
    title: "Aerial Mobility",
    category: "power"
  },
  { 
    name: "Telepathy", 
    description: "Direct mind-to-mind communication and thought reading. Mental link with other beings.",
    title: "Mental Connection",
    category: "power"
  }
];

// Sample timeline events (expanded for better demonstration)
const sampleTimelineEvents = [
  {
    id: 1,
    title: "Elena's Awakening",
    date: "Year 1, Day 5",
    importance: "high" as const,
    category: "Character Development",
    description: "Elena discovers her true magical potential during a routine training session, accidentally setting the practice dummy ablaze with unprecedented fire magic.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 2,
    title: "The Forbidden Library",
    date: "Year 1, Day 12",
    importance: "medium" as const,
    category: "Discovery",
    description: "Elena and Marcus sneak into the restricted section of the academy library, uncovering ancient texts about the lost art of elemental fusion.",
    location: "Magic Academy",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 3,
    title: "First Encounter with Shadows",
    date: "Year 1, Day 18",
    importance: "high" as const,
    category: "Conflict",
    description: "While gathering herbs for potion class, Elena encounters mysterious shadow creatures that seem drawn to her magical aura.",
    location: "Dark Forest",
    characters: ["Elena Brightblade"],
  },
  {
    id: 4,
    title: "The Mentor's Secret",
    date: "Year 1, Day 25",
    importance: "medium" as const,
    category: "Revelation",
    description: "Elena discovers that her mentor was once part of an ancient order dedicated to protecting the elemental balance.",
    location: "Magic Academy",
    characters: ["Elena Brightblade", "Mentor"],
  },
  {
    id: 14,
    title: "Academy Exhibition",
    date: "Year 1, Day 28",
    importance: "low" as const,
    category: "Character Development",
    description: "Elena participates in the annual magic exhibition, showcasing her improved control over fire magic to impressed faculty.",
    location: "Magic Academy",
    characters: ["Elena Brightblade", "Marcus", "Students"],
  },
  {
    id: 5,
    title: "Village Rescue",
    date: "Year 1, Day 31",
    importance: "low" as const,
    category: "Heroic Act",
    description: "Elena and Marcus help defend a small village from bandits, with Elena's fire magic proving crucial in the victory.",
    location: "Riverside Village",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 15,
    title: "The Crystal Caves Expedition",
    date: "Year 1, Day 35",
    importance: "medium" as const,
    category: "Discovery",
    description: "Elena explores the mysterious crystal caves, discovering that the crystals resonate with her magical energy in unexpected ways.",
    location: "Crystal Caves",
    characters: ["Elena Brightblade", "Marcus", "Mentor"],
  },
  {
    id: 16,
    title: "Market Day Incident",
    date: "Year 1, Day 42",
    importance: "low" as const,
    category: "Character Development",
    description: "Elena accidentally reveals her growing powers during a crowded market day, causing both wonder and concern among the citizens.",
    location: "Arcanum City",
    characters: ["Elena Brightblade"],
  },
  {
    id: 11,
    title: "Morning Council Meeting",
    date: "Year 1, Day 50",
    importance: "medium" as const,
    category: "Political Event",
    description: "Elena is invited to attend a royal council meeting where the kingdom's growing magical threats are discussed.",
    location: "Royal Palace",
    characters: ["Elena Brightblade", "King", "Council Members"],
  },
  {
    id: 12,
    title: "Afternoon Training",
    date: "Year 1, Day 50",
    importance: "low" as const,
    category: "Character Development",
    description: "Elena practices advanced combat techniques in the palace training grounds, impressing the royal guard with her skill.",
    location: "Training Grounds",
    characters: ["Elena Brightblade", "Marcus", "Royal Guard"],
  },
  {
    id: 13,
    title: "Evening Revelation",
    date: "Year 1, Day 50",
    importance: "high" as const,
    category: "Revelation",
    description: "In the royal library, Elena learns the shocking truth about her royal heritage and her connection to the ancient elemental bloodline.",
    location: "Royal Library",
    characters: ["Elena Brightblade", "Ancient Sage"],
  },
  {
    id: 17,
    title: "The Sunset Harbor Departure",
    date: "Year 1, Day 55",
    importance: "medium" as const,
    category: "Traveling",
    description: "Elena and her companions depart from Sunset Harbor on a ship bound for the northern territories, beginning their grand quest.",
    location: "Sunset Harbor",
    characters: ["Elena Brightblade", "Marcus", "Captain Storm"],
  },
  {
    id: 18,
    title: "Mountain Pass Ambush",
    date: "Year 1, Day 65",
    importance: "high" as const,
    category: "Battle",
    description: "The party is ambushed by Lord Vex's forces in the treacherous mountain pass, forcing Elena to use her powers defensively.",
    location: "Mountain Pass",
    characters: ["Elena Brightblade", "Marcus", "Shadow Assassin"],
  },
  {
    id: 7,
    title: "The Great Battle",
    date: "Year 1, Day 71",
    importance: "high" as const,
    category: "Battle",
    description: "Elena leads her allies in a decisive battle against the shadow army, her fire magic creating a turning point in the war.",
    location: "Battlefield",
    characters: ["Elena Brightblade", "Marcus", "Army"],
  },
  {
    id: 6,
    title: "Journey to the North",
    date: "Year 1, Day 78",
    importance: "medium" as const,
    category: "Traveling",
    description: "After the great battle, Elena and her surviving companions continue their journey northward along the ancient road.",
    location: "Northern Road",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 19,
    title: "Ancient Ruins Discovery",
    date: "Year 1, Day 82",
    importance: "high" as const,
    category: "Discovery",
    description: "Elena uncovers ancient ruins that hold the key to understanding the elemental magic that flows through her bloodline.",
    location: "Ancient Ruins",
    characters: ["Elena Brightblade", "Ancient Sage"],
  },
  {
    id: 10,
    title: "Hearts Entwined",
    date: "Year 1, Day 88",
    importance: "medium" as const,
    category: "Romance",
    description: "Under the starlit sky in the Garden of Stars, Elena and Marcus finally acknowledge their deepening feelings for each other.",
    location: "Garden of Stars",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 8,
    title: "Elemental Convergence",
    date: "Year 1, Day 90",
    importance: "high" as const,
    category: "Magic",
    description: "At the Elemental Nexus, Elena achieves perfect harmony with all elemental forces, unlocking her true potential as the Elemental Guardian.",
    location: "Elemental Nexus",
    characters: ["Elena Brightblade"],
  },
  {
    id: 20,
    title: "The Vanishing Mist",
    date: "Year 1, Day 95",
    importance: "medium" as const,
    category: "Mystery",
    description: "Elena investigates a strange mist in the marshlands that seems to respond to her presence, revealing hidden truths about the land's magic.",
    location: "Misty Marshlands",
    characters: ["Elena Brightblade", "Marcus", "Wise Oracle"],
  },
  {
    id: 21,
    title: "Dragon Guardian's Test",
    date: "Year 1, Day 100",
    importance: "high" as const,
    category: "Character Development",
    description: "Elena faces the ultimate test from the ancient Dragon Guardian, proving her worthiness to wield the full power of elemental magic.",
    location: "Dragon's Lair",
    characters: ["Elena Brightblade", "Dragon Guardian"],
  },
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
          placeholder="Search power types..."
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
            {filteredSystems.map((system, index) => {
              const CategoryIcon = getCategoryIcon(system.category);
              return (
                <div
                  key={index}
                  className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSelectSystem(system.name)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CategoryIcon className="w-4 h-4 text-gray-500" />
                      <div>
                        <span className="font-medium text-sm">{system.name}</span>
                        <p className="text-xs text-gray-600 line-clamp-1">{system.description}</p>
                      </div>
                    </div>
                    <Check className="w-4 h-4 text-gray-400" />
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
            const system = powerSystems.find(s => s.name === systemName);
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
                    <span className="text-sm font-medium">{system?.title || systemName}</span>
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
  const [isEditing, setIsEditing] = useState(false);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPowerSystems, setSelectedPowerSystems] = useState<string[]>([]);
  const { goBack } = useNavigation();
  
  // Track navigation history
  useNavigationTracker();

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
    role: "Protagonist",
    description: "A young mage with incredible potential and a mysterious past.",
    personality: "Determined, compassionate, but sometimes impulsive.",
    backstory: "Born into nobility but discovered her magical abilities late in life.",
    age: "22",
    race: "Human",
    class: "Mage",
    location: "Arcanum City",
    weapons: "Enchanted Staff of Flames, Crystal Dagger",
    appearance: "Auburn hair that catches fire when she uses magic, emerald eyes, average height with an athletic build from training",
    powerSystems: ["Fire Magic", "Light Magic"],
    image: null
  };

  // Initialize power systems when character loads
  useEffect(() => {
    if (character.powerSystems) {
      setSelectedPowerSystems(character.powerSystems);
    }
  }, []);

  // Get role configuration
  const roleInfo = roleConfig[character.role as keyof typeof roleConfig] || roleConfig["Supporting"];
  const RoleIcon = roleInfo.icon;

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
      weapons: "",
      age: "",
      race: "",
      class: "",
      location: "",
      role: "",
      appearance: ""
    });
  };

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
                className="text-gray-600 hover:text-gray-900"
                onClick={goBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{character.name}</h1>
                <div className="mt-2">
                  {isEditing ? (
                    <Select 
                      value={characterData.role || character.role} 
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
                      <span>{character.role}</span>
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
              <Card className="border border-gray-200 p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Portrait
                  </h2>
                  {isEditing && (
                    <div className="flex items-center space-x-3">
                      <span className="text-xs text-gray-500">Best: 7:9 ratio</span>
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
                  <div className="aspect-[7/9] bg-gray-100 rounded-lg border-2 border-gray-200 flex items-center justify-center overflow-hidden" style={{ width: '280px' }}>
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
                        className="w-full h-full object-contain opacity-30"
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
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Age:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.age || character.age}
                        onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                        className="w-20 h-8 text-sm text-right bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="22"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-md">{character.age}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Race:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.race || character.race}
                        onChange={(e) => setCharacterData({...characterData, race: e.target.value})}
                        className="w-24 h-8 text-sm text-right bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Human"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-md border border-gray-300">{character.race}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-700">Class:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.class || character.class}
                        onChange={(e) => setCharacterData({...characterData, class: e.target.value})}
                        className="w-24 h-8 text-sm text-right bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Mage"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-md">{character.class}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700">Location:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.location || character.location}
                        onChange={(e) => setCharacterData({...characterData, location: e.target.value})}
                        className="w-32 h-8 text-sm text-right bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                        placeholder="Arcanum City"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-gray-100 px-3 py-1 rounded-md">{character.location}</span>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* Right Side - Tabbed Content */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-5 mb-6">
                  <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                  <TabsTrigger value="appearance" className="text-sm">Appearance</TabsTrigger>
                  <TabsTrigger value="backstory" className="text-sm">Backstory</TabsTrigger>
                  <TabsTrigger value="weapons" className="text-sm">Weapons</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-sm">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-gray-200 p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Brief Description</h3>
                        {isEditing ? (
                          <textarea
                            value={characterData.description || character.description}
                            onChange={(e) => setCharacterData({...characterData, description: e.target.value})}
                            rows={3}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Power Type</h3>
                        {isEditing ? (
                          <PowerSystemSearch
                            selectedSystems={selectedPowerSystems}
                            onAddSystem={(system) => setSelectedPowerSystems([...selectedPowerSystems, system])}
                            onRemoveSystem={(system) => setSelectedPowerSystems(selectedPowerSystems.filter(s => s !== system))}
                          />
                        ) : selectedPowerSystems.length > 0 ? (
                          <div className="space-y-2">
                            {selectedPowerSystems.map((systemName, index) => {
                              const system = powerSystems.find(s => s.name === systemName);
                              const CategoryIcon = getCategoryIcon(system?.category || "magic");
                              const colorClass = getCategoryColor(system?.category || "magic");
                              const borderColorClass = getCategoryBorderColor(system?.category || "magic");
                              
                              return (
                                <div key={index} className={`flex items-center justify-between p-3 ${colorClass} rounded-lg border ${borderColorClass}`}>
                                  <div className="flex items-center space-x-3">
                                    <CategoryIcon className="w-4 h-4" />
                                    <div>
                                      <span className="text-sm font-medium">{system?.title || systemName}</span>
                                      <p className="text-xs opacity-80">{system?.description || "Custom power type"}</p>
                                    </div>
                                  </div>
                                  <WouterLink href={`/project/${projectId}/magic-systems`}>
                                    <Button variant="outline" size="sm" className="text-xs">
                                      View System
                                    </Button>
                                  </WouterLink>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <span className="text-sm text-gray-600">No power types assigned</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="appearance" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-gray-200 p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-3">Physical Appearance</h3>
                      {isEditing ? (
                        <textarea
                          value={characterData.appearance || character.appearance}
                          onChange={(e) => setCharacterData({...characterData, appearance: e.target.value})}
                          className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50 focus:bg-white"
                          placeholder="Describe the character's physical appearance..."
                        />
                      ) : (
                        <p className="text-gray-700">{character.appearance}</p>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="backstory" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-gray-200 p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
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

                <TabsContent value="weapons" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-gray-200 p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
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

                <TabsContent value="timeline" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Character Timeline</h3>
                          <p className="text-sm text-gray-600">
                            Events where {character.name} appears throughout the story
                          </p>
                        </div>
                      </div>
                    </div>



                    {/* Legend */}
                    <div className="flex justify-center">
                      <div className="rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-6 bg-[#f8f6f2]">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">High Importance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Medium Importance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-gray-600">Low Importance</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-bold">3</span>
                          </div>
                          <span className="text-sm text-gray-600">Multiple Events</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Container - dynamic height */}
                    <div className="rounded-lg p-8 shadow-sm border border-gray-200 overflow-hidden bg-[#f8f6f2]">
                      <SerpentineTimeline
                        events={sampleTimelineEvents}
                        filterCharacter={character.name}
                        onEventClick={(event) => console.log('Event clicked:', event)}
                        onEventEdit={(event) => console.log('Edit event:', event)}
                        showEditButtons={false}
                      />
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