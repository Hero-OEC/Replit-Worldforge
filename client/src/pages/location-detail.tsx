import { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Save, X, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import SerpentineTimeline from "@/components/timeline/serpentine-timeline";
import type { Location, ProjectWithStats } from "@shared/schema";

// Sample timeline events (same as in character-detail.tsx)
const sampleTimelineEvents = [
  {
    id: 1,
    title: "Elena's Awakening",
    date: "Year 1, Day 5",
    importance: "high" as const,
    category: "Character Development",
    description: "Elena discovers her true magical potential during a routine training session, accidentally setting the practice dummy ablaze with unprecedented fire magic.",
    location: "Arcanum City",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 2,
    title: "The Forbidden Library",
    date: "Year 1, Day 12",
    importance: "medium" as const,
    category: "Discovery",
    description: "Elena and Marcus sneak into the restricted section of the academy library, uncovering ancient texts about the lost art of elemental fusion.",
    location: "Magic Academy",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 3,
    title: "First Encounter with Shadows",
    date: "Year 1, Day 18",
    importance: "high" as const,
    category: "Conflict",
    description: "While gathering herbs for potion class, Elena encounters mysterious shadow creatures that seem drawn to her magical aura.",
    location: "Dark Forest",
    characters: ["Elena"],
  },
  {
    id: 4,
    title: "The Mentor's Secret",
    date: "Year 1, Day 25",
    importance: "medium" as const,
    category: "Revelation",
    description: "Elena discovers that her mentor was once part of an ancient order dedicated to protecting the elemental balance.",
    location: "Magic Academy",
    characters: ["Elena", "Mentor"],
  },
  {
    id: 14,
    title: "Academy Exhibition",
    date: "Year 1, Day 28",
    importance: "low" as const,
    category: "Character Development",
    description: "Elena participates in the annual magic exhibition, showcasing her improved control over fire magic to impressed faculty.",
    location: "Magic Academy",
    characters: ["Elena", "Marcus", "Students"],
  },
  {
    id: 5,
    title: "Village Rescue",
    date: "Year 1, Day 31",
    importance: "low" as const,
    category: "Heroic Act",
    description: "Elena and Marcus help defend a small village from bandits, with Elena's fire magic proving crucial in the victory.",
    location: "Riverside Village",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 15,
    title: "The Crystal Caves Expedition",
    date: "Year 1, Day 35",
    importance: "medium" as const,
    category: "Discovery",
    description: "Elena explores the mysterious crystal caves, discovering that the crystals resonate with her magical energy in unexpected ways.",
    location: "Crystal Caves",
    characters: ["Elena", "Marcus", "Mentor"],
  },
  {
    id: 16,
    title: "Market Day Incident",
    date: "Year 1, Day 42",
    importance: "low" as const,
    category: "Character Development",
    description: "Elena accidentally reveals her growing powers during a crowded market day, causing both wonder and concern among the citizens.",
    location: "Arcanum City",
    characters: ["Elena"],
  },
  {
    id: 11,
    title: "Morning Council Meeting",
    date: "Year 1, Day 50",
    importance: "medium" as const,
    category: "Political Event",
    description: "Elena is invited to attend a royal council meeting where the kingdom's growing magical threats are discussed.",
    location: "Royal Palace",
    characters: ["Elena", "King", "Council Members"],
  },
  {
    id: 12,
    title: "Afternoon Training",
    date: "Year 1, Day 50",
    importance: "low" as const,
    category: "Character Development",
    description: "Elena practices advanced combat techniques in the palace training grounds, impressing the royal guard with her skill.",
    location: "Training Grounds",
    characters: ["Elena", "Marcus", "Royal Guard"],
  },
  {
    id: 13,
    title: "Evening Revelation",
    date: "Year 1, Day 50",
    importance: "high" as const,
    category: "Revelation",
    description: "In the royal library, Elena learns the shocking truth about her royal heritage and her connection to the ancient elemental bloodline.",
    location: "Royal Library",
    characters: ["Elena", "Ancient Sage"],
  },
  {
    id: 17,
    title: "The Sunset Harbor Departure",
    date: "Year 1, Day 55",
    importance: "medium" as const,
    category: "Traveling",
    description: "Elena and her companions depart from Sunset Harbor on a ship bound for the northern territories, beginning their grand quest.",
    location: "Sunset Harbor",
    characters: ["Elena", "Marcus", "Captain Storm"],
  },
  {
    id: 18,
    title: "Mountain Pass Ambush",
    date: "Year 1, Day 65",
    importance: "high" as const,
    category: "Battle",
    description: "The party is ambushed by Lord Vex's forces in the treacherous mountain pass, forcing Elena to use her powers defensively.",
    location: "Mountain Pass",
    characters: ["Elena", "Marcus", "Shadow Assassin"],
  },
  {
    id: 7,
    title: "The Great Battle",
    date: "Year 1, Day 71",
    importance: "high" as const,
    category: "Battle",
    description: "Elena leads her allies in a decisive battle against the shadow army, her fire magic creating a turning point in the war.",
    location: "Battlefield",
    characters: ["Elena", "Marcus", "Army"],
  },
  {
    id: 6,
    title: "Journey to the North",
    date: "Year 1, Day 78",
    importance: "medium" as const,
    category: "Traveling",
    description: "After the great battle, Elena and her surviving companions continue their journey northward along the ancient road.",
    location: "Northern Road",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 19,
    title: "Ancient Ruins Discovery",
    date: "Year 1, Day 82",
    importance: "high" as const,
    category: "Discovery",
    description: "Elena uncovers ancient ruins that hold the key to understanding the elemental magic that flows through her bloodline.",
    location: "Ancient Ruins",
    characters: ["Elena", "Ancient Sage"],
  },
  {
    id: 10,
    title: "Hearts Entwined",
    date: "Year 1, Day 88",
    importance: "medium" as const,
    category: "Romance",
    description: "Under the starlit sky in the Garden of Stars, Elena and Marcus finally acknowledge their deepening feelings for each other.",
    location: "Garden of Stars",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 8,
    title: "Elemental Convergence",
    date: "Year 1, Day 90",
    importance: "high" as const,
    category: "Magic",
    description: "At the Elemental Nexus, Elena achieves perfect harmony with all elemental forces, unlocking her true potential as the Elemental Guardian.",
    location: "Elemental Nexus",
    characters: ["Elena"],
  },
  {
    id: 20,
    title: "The Vanishing Mist",
    date: "Year 1, Day 95",
    importance: "medium" as const,
    category: "Mystery",
    description: "Elena investigates a strange mist in the marshlands that seems to respond to her presence, revealing hidden truths about the land's magic.",
    location: "Misty Marshlands",
    characters: ["Elena", "Marcus", "Wise Oracle"],
  },
  {
    id: 21,
    title: "Dragon Guardian's Test",
    date: "Year 1, Day 100",
    importance: "high" as const,
    category: "Character Development",
    description: "Elena faces the ultimate test from the ancient Dragon Guardian, proving her worthiness to wield the full power of elemental magic.",
    location: "Dragon's Lair",
    characters: ["Elena", "Dragon Guardian"],
  },
];

// Location type configuration
const locationTypeConfig = {
  "City": { color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  "Forest": { color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  "Academy": { color: "bg-purple-500", bgColor: "bg-purple-50", textColor: "text-purple-700", borderColor: "border-purple-200" },
  "Palace": { color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  "Village": { color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
  "Caves": { color: "bg-gray-500", bgColor: "bg-gray-50", textColor: "text-gray-700", borderColor: "border-gray-200" },
  "Harbor": { color: "bg-cyan-500", bgColor: "bg-cyan-50", textColor: "text-cyan-700", borderColor: "border-cyan-200" },
  "Ruins": { color: "bg-stone-500", bgColor: "bg-stone-50", textColor: "text-stone-700", borderColor: "border-stone-200" },
  "Other": { color: "bg-gray-500", bgColor: "bg-gray-50", textColor: "text-gray-700", borderColor: "border-gray-200" }
};

export default function LocationDetail() {
  const { projectId, locationId } = useParams<{ projectId: string; locationId: string }>();
  const [isEditing, setIsEditing] = useState(false);
  const [locationData, setLocationData] = useState({
    name: "",
    type: "",
    description: "",
    geography: "",
    culture: "",
    significance: ""
  });

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Sample location data (in real app, this would come from API)
  const location = {
    id: parseInt(locationId!),
    name: "Arcanum City",
    type: "City",
    description: "The grand capital of magical learning, where towering spires house the most prestigious academy of magic in the realm.",
    geography: "Built on a series of floating islands connected by magical bridges, with cascading waterfalls and crystal formations throughout the city.",
    culture: "A cosmopolitan hub where mages from all corners of the world come to study. The city operates under a council of archmages and values knowledge above all else.",
    significance: "The primary setting for Elena's magical education and the starting point of her journey. Many crucial discoveries and relationships form here."
  };

  // Get location type configuration
  const typeInfo = locationTypeConfig[location.type as keyof typeof locationTypeConfig] || locationTypeConfig["Other"];

  const handleSave = () => {
    console.log("Saving location data:", locationData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setLocationData({
      name: "",
      type: "",
      description: "",
      geography: "",
      culture: "",
      significance: ""
    });
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search locations..."
      />

      <main className="p-8 bg-[var(--worldforge-cream)]">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href={`/project/${projectId}/locations`}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Locations
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">{location.name}</h1>
                <div className="mt-2">
                  {isEditing ? (
                    <Select 
                      value={locationData.type || location.type} 
                      onValueChange={(value) => setLocationData({...locationData, type: value})}
                    >
                      <SelectTrigger className="flex h-10 items-center justify-between rounded-md border border-input px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 w-48 bg-[#ffffffff]">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="City">City</SelectItem>
                        <SelectItem value="Forest">Forest</SelectItem>
                        <SelectItem value="Academy">Academy</SelectItem>
                        <SelectItem value="Palace">Palace</SelectItem>
                        <SelectItem value="Village">Village</SelectItem>
                        <SelectItem value="Caves">Caves</SelectItem>
                        <SelectItem value="Harbor">Harbor</SelectItem>
                        <SelectItem value="Ruins">Ruins</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`inline-flex items-center space-x-2 px-3 py-1 ${typeInfo.bgColor} ${typeInfo.textColor} rounded-full text-sm font-medium border ${typeInfo.borderColor}`}>
                      <MapPin className="w-4 h-4" />
                      <span>{location.type}</span>
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
                  Edit Location
                </Button>
              )}
            </div>
          </div>

          {/* Location Content */}
          <div className="grid grid-cols-1 gap-8">
            {/* Tabbed Content */}
            <div className="w-full">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6">
                  <TabsTrigger value="details" className="text-sm">Details</TabsTrigger>
                  <TabsTrigger value="geography" className="text-sm">Geography</TabsTrigger>
                  <TabsTrigger value="culture" className="text-sm">Culture</TabsTrigger>
                  <TabsTrigger value="timeline" className="text-sm">Timeline</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-gray-200 p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Description</h3>
                        {isEditing ? (
                          <textarea
                            value={locationData.description || location.description}
                            onChange={(e) => setLocationData({...locationData, description: e.target.value})}
                            rows={4}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                            placeholder="Brief location description..."
                          />
                        ) : (
                          <p className="text-gray-700">{location.description}</p>
                        )}
                      </div>

                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Significance</h3>
                        {isEditing ? (
                          <textarea
                            value={locationData.significance || location.significance}
                            onChange={(e) => setLocationData({...locationData, significance: e.target.value})}
                            rows={3}
                            className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                            placeholder="Role in the story, importance..."
                          />
                        ) : (
                          <p className="text-gray-700">{location.significance}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="geography" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-gray-200 p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Geography & Layout</h3>
                    {isEditing ? (
                      <textarea
                        value={locationData.geography || location.geography}
                        onChange={(e) => setLocationData({...locationData, geography: e.target.value})}
                        rows={6}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        placeholder="Physical features, layout, climate, notable landmarks..."
                      />
                    ) : (
                      <p className="text-gray-700">{location.geography}</p>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="culture" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <Card className="border border-gray-200 p-6" style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Culture & Society</h3>
                    {isEditing ? (
                      <textarea
                        value={locationData.culture || location.culture}
                        onChange={(e) => setLocationData({...locationData, culture: e.target.value})}
                        rows={6}
                        className="w-full p-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                        placeholder="People, customs, atmosphere, social structure..."
                      />
                    ) : (
                      <p className="text-gray-700">{location.culture}</p>
                    )}
                  </Card>
                </TabsContent>

                <TabsContent value="timeline" className="space-y-6 bg-[var(--worldforge-cream)]">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Clock className="w-5 h-5 text-orange-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">Location Timeline</h3>
                          <p className="text-sm text-gray-600">
                            Events that take place in {location.name}
                          </p>
                        </div>
                      </div>  
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center">
                      <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-6">
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
                      </div>
                    </div>
                    
                    {/* Timeline Container - matches main timeline page */}
                    <div className="bg-white rounded-lg p-8 shadow-sm border border-gray-200">
                      <SerpentineTimeline
                        events={sampleTimelineEvents}
                        filterCharacter={undefined}
                        filterLocation={location.name}
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