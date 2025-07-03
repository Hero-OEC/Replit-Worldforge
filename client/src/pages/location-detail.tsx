import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  MapPin, 
  Clock,
  Star,
  Calendar,
  Users,
  Eye,
  Swords,
  Lightbulb,
  Award,
  Crown,
  Heart,
  HelpCircle,
  Sparkles,
  Zap,
  Plane,
  User,
  Building,
  Trees,
  Mountain,
  GraduationCap,
  Home,
  Anchor,
  Castle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/navbar";
import SerpentineTimeline, { TimelineEventData } from "@/components/timeline/serpentine-timeline";
import type { Location, ProjectWithStats, TimelineEvent } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const priorityColors = {
  high: "bg-[var(--color-500)]",
  medium: "bg-[var(--color-400)]",
  low: "bg-[var(--color-300)]",
};

const priorityLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

// Helper functions for location types
const getTypeIcon = (type: string) => {
  const icons = {
    'City': MapPin,
    'Building': Building,
    'Wilderness': Trees,
    'Mountains': Mountain,
    'Forest': Trees,
    'Academy': GraduationCap,
    'Palace': Crown,
    'Village': Home,
    'Caves': Mountain,
    'Harbor': Anchor,
    'Ruins': Castle,
    'Other': MapPin,
  };
  return icons[type as keyof typeof icons] || MapPin;
};

const getTypeColor = (type: string) => {
  const colors = {
    'City': 'bg-[var(--color-300)] text-[var(--color-900)]',
    'Building': 'bg-[var(--color-200)] text-[var(--color-800)]',
    'Wilderness': 'bg-[var(--color-400)] text-[var(--color-950)]',
    'Mountains': 'bg-[var(--color-500)] text-[var(--color-950)]',
    'Forest': 'bg-[var(--color-400)] text-[var(--color-950)]',
    'Academy': 'bg-[var(--color-300)] text-[var(--color-900)]',
    'Palace': 'bg-[var(--color-500)] text-[var(--color-950)]',
    'Village': 'bg-[var(--color-200)] text-[var(--color-800)]',
    'Caves': 'bg-[var(--color-600)] text-[var(--color-50)]',
    'Harbor': 'bg-[var(--color-400)] text-[var(--color-950)]',
    'Ruins': 'bg-[var(--color-700)] text-[var(--color-50)]',
    'Other': 'bg-[var(--color-300)] text-[var(--color-900)]',
  };
  return colors[type as keyof typeof colors] || 'bg-[var(--color-300)] text-[var(--color-900)]';
};

const eventTypeIcons = {
  "Character Development": User,
  Discovery: Eye,
  Conflict: Swords,
  Revelation: Lightbulb,
  "Heroic Act": Award,
  "Political Event": Crown,
  Romance: Heart,
  Mystery: HelpCircle,
  Magic: Sparkles,
  Battle: Zap,
  Traveling: Plane,
};

// Sample timeline events (shared with other pages)
const sampleEvents = [
  {
    id: 1,
    title: "Elena's Awakening",
    date: "Year 1, Day 5",
    importance: "high" as const,
    category: "Character Arc",
    description: "Elena discovers her true magical potential during a routine training session.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 2,
    title: "The Forbidden Library",
    date: "Year 1, Day 12",
    importance: "medium" as const,
    category: "Discovery",
    description: "Elena and Marcus uncover ancient texts in the hidden library.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 3,
    title: "First Encounter",
    date: "Year 1, Day 18",
    importance: "high" as const,
    category: "Conflict",
    description: "The protagonists face their first major challenge.",
    location: "Dark Forest",
    characters: ["Elena Brightblade"],
  },
  {
    id: 4,
    title: "The Mentor's Secret",
    date: "Year 1, Day 25",
    importance: "medium" as const,
    category: "Revelation",
    description: "A secret about Elena's mentor is revealed.",
    location: "Magic Academy",
    characters: ["Elena Brightblade", "Mentor"],
  },
  {
    id: 5,
    title: "Village Rescue",
    date: "Year 1, Day 31",
    importance: "low" as const,
    category: "Heroic Act",
    description: "The heroes help save a village from bandits.",
    location: "Riverside Village",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 11,
    title: "Morning Council Meeting",
    date: "Year 1, Day 50",
    importance: "medium" as const,
    category: "Political Event",
    description: "The kingdom's council meets to discuss the growing threat.",
    location: "Royal Palace",
    characters: ["Elena Brightblade", "King", "Council Members"],
  },
  {
    id: 12,
    title: "Afternoon Training",
    date: "Year 1, Day 50",
    importance: "low" as const,
    category: "Character Arc",
    description: "Elena practices her new abilities in the training grounds.",
    location: "Training Grounds",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 13,
    title: "Evening Revelation",
    date: "Year 1, Day 50",
    importance: "high" as const,
    category: "Revelation",
    description: "A shocking truth about Elena's heritage is revealed.",
    location: "Royal Library",
    characters: ["Elena Brightblade", "Ancient Sage"],
  },
  {
    id: 6,
    title: "Journey to the North",
    date: "Year 1, Day 78",
    importance: "medium" as const,
    category: "Traveling",
    description: "The group begins their journey to the northern kingdoms.",
    location: "Northern Road",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 7,
    title: "The Great Battle",
    date: "Year 1, Day 71",
    importance: "high" as const,
    category: "Battle",
    description: "A major battle that changes the course of the war.",
    location: "Battlefield",
    characters: ["Elena Brightblade", "Marcus", "Army"],
  },
  {
    id: 8,
    title: "Elemental Convergence",
    date: "Year 1, Day 90",
    importance: "medium" as const,
    category: "Magic",
    description: "The elemental forces converge in an unprecedented way.",
    location: "Elemental Nexus",
    characters: ["Elena Brightblade"],
  },
  {
    id: 9,
    title: "The Vanishing Mist",
    date: "Year 1, Day 95",
    importance: "low" as const,
    category: "Mystery",
    description: "A strange mist appears and disappears mysteriously.",
    location: "Misty Marshlands",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 10,
    title: "Hearts Entwined",
    date: "Year 1, Day 88",
    importance: "medium" as const,
    category: "Romance",
    description: "A romantic subplot reaches a crucial moment.",
    location: "Garden of Stars",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 14,
    title: "Academy Exhibition",
    date: "Year 1, Day 28",
    importance: "low" as const,
    category: "Character Arc",
    description: "Elena participates in the annual magic exhibition, showcasing her improved control over fire magic to impressed faculty.",
    location: "Magic Academy",
    characters: ["Elena Brightblade", "Marcus", "Students"],
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
    category: "Character Arc",
    description: "Elena accidentally reveals her growing powers during a crowded market day, causing both wonder and concern among the citizens.",
    location: "Arcanum City",
    characters: ["Elena Brightblade"],
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
    id: 20,
    title: "Dragon Guardian's Test",
    date: "Year 1, Day 100",
    importance: "high" as const,
    category: "Character Arc",
    description: "Elena faces the ultimate test from the ancient Dragon Guardian, proving her worthiness to wield the full power of elemental magic.",
    location: "Dragon's Lair",
    characters: ["Elena Brightblade", "Dragon Guardian"],
  },
];

// Location Timeline Component - using shared SerpentineTimeline
function LocationTimelineWrapper({ location }: { location: Location }) {
  const { projectId } = useParams<{ projectId: string }>();

  // Fetch timeline events from API
  const { data: timelineEvents = [] } = useQuery<TimelineEvent[]>({
    queryKey: [`/api/projects/${projectId}/timeline`],
    enabled: !!projectId,
  });

  // Convert database events to timeline component format
  const convertToTimelineData = (events: TimelineEvent[]): TimelineEventData[] => {
    return events.map(event => ({
      id: event.id,
      title: event.title,
      date: event.date || "No Date",
      importance: (event.importance || "medium") as "high" | "medium" | "low",
      category: event.category || "Other",
      description: event.description || "",
      location: event.location || "",
      characters: Array.isArray(event.characters) ? event.characters : []
    }));
  };

  const timelineData = convertToTimelineData(timelineEvents);

  return (
    <SerpentineTimeline 
      events={timelineData}
      filterLocation={location.name}
      className="w-full"
    />
  );
}

export default function LocationDetail() {
  const { projectId, locationId } = useParams<{ projectId: string; locationId: string }>();
  const [location, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [locationFormData, setLocationFormData] = useState({
    name: "",
    type: "",
    description: "",
    geography: "",
    culture: "",
    significance: ""
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useNavigationTracker();
  const { goBack } = useNavigation();

  // Fetch project data
  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Fetch location data from API
  const { data: locationData, isLoading: isLocationLoading } = useQuery<Location>({
    queryKey: [`/api/locations/${locationId}`],
    enabled: !!locationId,
  });

  // Initialize form data when location data is loaded
  useEffect(() => {
    if (locationData && !isEditing) {
      setLocationFormData({
        name: locationData.name || "",
        type: locationData.type || "",
        description: locationData.description || "",
        geography: locationData.geography || "",
        culture: locationData.culture || "",
        significance: locationData.significance || ""
      });
    }
  }, [locationData, isEditing]);

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/locations/${locationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationFormData),
      });
      if (!res.ok) {
        throw new Error("Failed to update location");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/locations/${locationId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/locations`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      toast({ title: "Location updated successfully!" });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update location", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSave = () => {
    if (!locationFormData.name.trim()) {
      toast({ 
        title: "Name is required", 
        description: "Please enter a location name",
        variant: "destructive" 
      });
      return;
    }
    updateLocationMutation.mutate();
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (locationData) {
      setLocationFormData({
        name: locationData.name || "",
        type: locationData.type || "",
        description: locationData.description || "",
        geography: locationData.geography || "",
        culture: locationData.culture || "",
        significance: locationData.significance || ""
      });
    }
  };



  // Filter and sort events for stats calculation
  const locationEvents = sampleEvents.filter(event => 
    event.location === locationData?.name
  );
  const sortedEvents = [...locationEvents].sort((a, b) => {
    const getDateNumber = (dateStr: string) => {
      const match = dateStr.match(/Day (\d+)/);
      return match ? parseInt(match[1]) : 0;
    };
    return getDateNumber(a.date) - getDateNumber(b.date);
  });

  if (isLocationLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-[var(--color-700)]">Loading location...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-[var(--color-700)]">Location not found</p>
            </div>
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

      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost" 
                  onClick={() => goBack()}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Locations
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={updateLocationMutation.isPending}
                      className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateLocationMutation.isPending ? "Saving..." : "Save"}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="outline"
                      className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Location
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                {(() => {
                  const IconComponent = getTypeIcon(locationData.type || 'Other');
                  return <IconComponent className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />;
                })()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-950)]">{locationData.name}</h1>
                <div className="flex items-center space-x-2">
                  <Badge className={getTypeColor(locationData.type || 'Other')}>
                    {locationData.type || 'Location'}
                  </Badge>
                  <span className="text-[var(--color-700)]">Location Details</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-[var(--color-100)]">
                    <TabsTrigger value="details" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Details</TabsTrigger>
                    <TabsTrigger value="geography" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Geography</TabsTrigger>
                    <TabsTrigger value="culture" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Culture</TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        {isEditing ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Name</label>
                              <Input
                                value={locationFormData.name}
                                onChange={(e) => setLocationFormData({...locationFormData, name: e.target.value})}
                                className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)]"
                                placeholder="Enter location name"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Type</label>
                              <Select 
                                value={locationFormData.type} 
                                onValueChange={(value) => setLocationFormData({...locationFormData, type: value})}
                              >
                                <SelectTrigger className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)]">
                                  <SelectValue placeholder="Select location type" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="City">City</SelectItem>
                                  <SelectItem value="Building">Building</SelectItem>
                                  <SelectItem value="Wilderness">Wilderness</SelectItem>
                                  <SelectItem value="Mountains">Mountains</SelectItem>
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
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Description</label>
                              <Textarea
                                value={locationFormData.description}
                                onChange={(e) => setLocationFormData({...locationFormData, description: e.target.value})}
                                className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-24"
                                placeholder="Describe the location..."
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Significance</label>
                              <Textarea
                                value={locationFormData.significance}
                                onChange={(e) => setLocationFormData({...locationFormData, significance: e.target.value})}
                                className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-24"
                                placeholder="What makes this location significant..."
                              />
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Description</label>
                              <p className="text-[var(--color-950)] leading-relaxed">{locationData.description}</p>
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Significance</label>
                              <p className="text-[var(--color-950)] leading-relaxed">{locationData.significance}</p>
                            </div>
                          </>
                        )}
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="geography" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Geography</label>
                          {isEditing ? (
                            <Textarea
                              value={locationFormData.geography}
                              onChange={(e) => setLocationFormData({...locationFormData, geography: e.target.value})}
                              className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-32"
                              placeholder="Describe the geographical features..."
                            />
                          ) : (
                            <p className="text-[var(--color-950)] leading-relaxed">{locationData.geography}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="culture" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Culture</label>
                          {isEditing ? (
                            <Textarea
                              value={locationFormData.culture}
                              onChange={(e) => setLocationFormData({...locationFormData, culture: e.target.value})}
                              className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-32"
                              placeholder="Describe the cultural aspects..."
                            />
                          ) : (
                            <p className="text-[var(--color-950)] leading-relaxed">{locationData.culture}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-[var(--color-600)]" />
                          <div>
                            <h3 className="text-lg font-semibold text-[var(--color-950)]">Location Timeline</h3>
                            <p className="text-sm text-[var(--color-700)]">
                              Events that take place in {locationData.name}
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
        </div>
      </main>
    </div>
  );
}