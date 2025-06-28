import React, { useState, useRef, useEffect } from "react";
import { useParams, Link } from "wouter";
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
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import type { Location, ProjectWithStats } from "@shared/schema";

const importanceColors = {
  high: "bg-destructive",
  medium: "bg-[var(--color-500)]", 
  low: "bg-yellow-500",
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

// Serpentine Timeline Component for Location
function SerpentineTimelineForLocation({ location }: { location: Location }) {
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Filter events for this location
  const locationEvents = sampleTimelineEvents.filter(event => event.location === location.name);
  
  // Sort events by date
  const sortedEvents = [...locationEvents].sort((a, b) => {
    const getDateNumber = (dateStr: string) => {
      const match = dateStr.match(/Day (\d+)/);
      return match ? parseInt(match[1]) : 0;
    };
    return getDateNumber(a.date) - getDateNumber(b.date);
  });

  // Group events by date
  const eventsByDate = sortedEvents.reduce((acc: any, event) => {
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  const dateGroups = Object.entries(eventsByDate).map(([date, events]) => ({
    date,
    events: events as any[],
    isMultiEvent: (events as any[]).length > 1,
  }));

  // Calculate timeline positions for serpentine layout
  const timelineWidth = 1200;
  const timelineHeight = 400;
  const pathPoints: number[][] = [];

  const eventsPerRow = 6;
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const horizontalSpacing = (timelineWidth - 120) / (eventsPerRow - 1);
  const verticalSpacing = rows > 1 ? (timelineHeight - 120) / (rows - 1) : 0;

  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;

    let x, y;
    if (row % 2 === 0) {
      x = 60 + col * horizontalSpacing;
    } else {
      x = 60 + (eventsPerRow - 1 - col) * horizontalSpacing;
    }
    y = 60 + row * verticalSpacing;
    pathPoints.push([x, y]);
  });

  return (
    <div className="relative" style={{ width: timelineWidth, height: Math.max(timelineHeight, 200) }}>
      {/* Path */}
      <svg className="absolute inset-0" width={timelineWidth} height={timelineHeight}>
        <path
          d={`M ${pathPoints.map(([x, y]) => `${x},${y}`).join(' L ')}`}
          stroke="#D1D5DB"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
        />
      </svg>

      {/* Event nodes */}
      <div className="absolute inset-0">
        {dateGroups.map((group, index) => {
          const [x, y] = pathPoints[index];
          const isHovered = hoveredDateGroup === group || hoveredEvent === group.events[0];

          return (
            <div key={group.date} className="absolute">
              <div
                style={{
                  left: x - 24,
                  top: y - 24,
                }}
                className="absolute"
              >
                {group.isMultiEvent ? (
                  <div
                    className={`relative cursor-pointer transform transition-all duration-200 ${
                      isHovered ? "scale-110" : "hover:scale-105"
                    }`}
                    onMouseEnter={(e) => {
                      setHoveredDateGroup(group);
                      const rect = e.currentTarget.getBoundingClientRect();
                      const viewportHeight = window.innerHeight;
                      const popupHeight = 300;

                      let yPosition = rect.bottom + 10;
                      if (yPosition + popupHeight > viewportHeight) {
                        yPosition = rect.top - popupHeight - 10;
                      }

                      setPopupPosition({
                        x: rect.left + rect.width / 2,
                        y: yPosition,
                      });
                    }}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        if (!popupRef.current?.matches(":hover")) {
                          setHoveredDateGroup(null);
                          setPopupPosition(null);
                        }
                      }, 100);
                    }}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center shadow-lg">
                        <Calendar className="w-6 h-6 text-[var(--color-50)]" />
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-500)] rounded-full flex items-center justify-center">
                        <span className="text-[var(--color-50)] font-bold text-xs">
                          {group.events.length}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    className={`relative cursor-pointer transform transition-all duration-200 ${
                      hoveredEvent === group.events[0]
                        ? "scale-110"
                        : "hover:scale-105"
                    }`}
                    onMouseEnter={(e) => {
                      setHoveredEvent(group.events[0]);
                      const rect = e.currentTarget.getBoundingClientRect();
                      const viewportHeight = window.innerHeight;
                      const popupHeight = 250;

                      let yPosition = rect.bottom + 10;
                      if (yPosition + popupHeight > viewportHeight) {
                        yPosition = rect.top - popupHeight - 10;
                      }

                      setPopupPosition({
                        x: rect.left + rect.width / 2,
                        y: yPosition,
                      });
                    }}
                    onMouseLeave={() => {
                      setTimeout(() => {
                        if (!popupRef.current?.matches(":hover")) {
                          setHoveredEvent(null);
                          setPopupPosition(null);
                        }
                      }, 100);
                    }}
                  >
                    <div
                      className={`w-12 h-12 ${importanceColors[group.events[0].importance as keyof typeof importanceColors]} rounded-full flex items-center justify-center shadow-lg`}
                    >
                      {React.createElement(
                        eventTypeIcons[
                          group.events[0].category as keyof typeof eventTypeIcons
                        ] || Star,
                        {
                          className: "w-6 h-6 text-[var(--color-50)]",
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Event Labels */}
              <div
                style={{
                  left: x,
                  top: y + 50,
                }}
                className="absolute transform -translate-x-1/2 pointer-events-none"
              >
                <div className="text-center">
                  <div className="px-4 py-3 rounded-lg shadow-sm border border-gray-200 min-w-[120px]" style={{ backgroundColor: '#f8f6f2' }}>
                    <div className="text-sm font-semibold text-gray-800 mb-1 leading-relaxed">
                      {group.isMultiEvent
                        ? `${group.events.length} Events`
                        : group.events[0].title}
                    </div>
                    <div className="text-xs text-[var(--color-700)] font-medium">
                      {group.date}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hover popups */}
      {popupPosition && (
        <div
          ref={popupRef}
          className="fixed z-50"
          style={{
            left: popupPosition.x,
            top: popupPosition.y,
            transform: "translateX(-50%)",
          }}
          onMouseEnter={() => {}}
          onMouseLeave={() => {
            setHoveredDateGroup(null);
            setHoveredEvent(null);
            setPopupPosition(null);
          }}
        >
          {hoveredDateGroup && hoveredDateGroup.isMultiEvent ? (
            <Card
              className="border shadow-xl p-4 w-80 hover:shadow-2xl transition-shadow"
              style={{ backgroundColor: '#f8f6f2' }}
            >
              <div className="mb-3">
                <h3 className="font-semibold text-[var(--color-950)] text-lg mb-2">
                  {hoveredDateGroup.date}
                </h3>
                <p className="text-sm text-[var(--color-700)]">
                  {hoveredDateGroup.events.length} events on this date
                </p>
              </div>
              <div className="grid grid-cols-1 gap-3">
                {hoveredDateGroup.events
                  .slice(0, 3)
                  .map((event: any, index: number) => {
                    const EventIcon =
                      eventTypeIcons[
                        event.category as keyof typeof eventTypeIcons
                      ] || Star;
                    const importance =
                      event.importance as keyof typeof importanceColors;

                    return (
                      <div
                        key={event.id}
                        className="relative p-3 rounded-lg bg-[var(--color-100)] border cursor-pointer hover:bg-[var(--color-200)]"
                      >
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-8 h-8 ${importanceColors[importance]} rounded-full flex items-center justify-center flex-shrink-0`}
                          >
                            <EventIcon className="w-4 h-4 text-[var(--color-50)]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-[var(--color-950)] text-sm">
                              {event.title}
                            </h4>
                            <p className="text-xs text-[var(--color-700)] mt-1">
                              {event.description.substring(0, 60)}...
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {hoveredDateGroup.events.length > 3 && (
                  <div className="text-center text-xs text-[var(--color-600)] pt-2">
                    +{hoveredDateGroup.events.length - 3} more events
                  </div>
                )}
              </div>
            </Card>
          ) : hoveredEvent ? (
            <Card
              className="border shadow-xl p-4 w-80 hover:shadow-2xl transition-shadow"
              style={{ backgroundColor: '#f8f6f2' }}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div
                  className={`w-10 h-10 ${
                    importanceColors[hoveredEvent.importance as keyof typeof importanceColors]
                  } rounded-full flex items-center justify-center flex-shrink-0`}
                >
                  {React.createElement(
                    eventTypeIcons[
                      hoveredEvent.category as keyof typeof eventTypeIcons
                    ] || Star,
                    {
                      className: "w-5 h-5 text-[var(--color-50)]",
                    },
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-[var(--color-950)] mb-1">
                    {hoveredEvent.title}
                  </h3>
                  <div className="text-xs text-[var(--color-600)] mb-2">
                    {hoveredEvent.date}
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-3">
                {hoveredEvent.description}
              </p>
              <div className="flex items-center space-x-4 text-xs text-[var(--color-600)]">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3" />
                  <span>{hoveredEvent.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-3 h-3" />
                  <span>{hoveredEvent.characters.join(", ")}</span>
                </div>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}

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
  "City": { color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Forest": { color: "bg-[var(--color-700)]", bgColor: "bg-[var(--color-50)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-200)]" },
  "Academy": { color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-200)]", textColor: "text-[var(--color-950)]", borderColor: "border-[var(--color-400)]" },
  "Palace": { color: "bg-[var(--color-400)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Village": { color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-300)]" },
  "Caves": { color: "bg-[var(--color-800)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-200)]" },
  "Harbor": { color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-50)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-200)]" },
  "Ruins": { color: "bg-[var(--color-900)]", bgColor: "bg-[var(--color-50)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-200)]" },
  "Other": { color: "bg-[var(--color-300)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-200)]" }
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
  const { goBack } = useNavigation();
  
  // Track navigation history
  useNavigationTracker();

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
                  <Button onClick={handleSave} className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]">
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Location
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      if (confirm("Are you sure you want to delete this location?")) {
                        // In real app, this would delete the location and redirect
                        console.log("Delete location:", location.id);
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
                            className="w-full p-3 bg-[var(--color-100)] border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
                            className="w-full p-3 bg-[var(--color-100)] border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
                        className="w-full p-3 bg-[var(--color-100)] border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
                        className="w-full p-3 bg-[var(--color-100)] border border-gray-300 rounded-lg focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
                          <p className="text-sm text-[var(--color-700)]">
                            Events that take place in {location.name}
                          </p>
                        </div>
                      </div>  
                    </div>

                    {/* Timeline Stats */}
                    <div className="grid grid-cols-3 gap-4">
                      <Card className="border border-gray-200 p-4 text-center" style={{ backgroundColor: '#f8f6f2' }}>
                        <div className="text-2xl font-bold text-[var(--color-950)]">{sampleTimelineEvents.filter(e => e.location === location.name).length}</div>
                        <div className="text-sm text-[var(--color-700)]">Events Here</div>
                      </Card>
                      <Card className="border border-gray-200 p-4 text-center" style={{ backgroundColor: '#f8f6f2' }}>
                        <div className="text-2xl font-bold text-[var(--color-950)]">{sampleTimelineEvents.filter(e => e.location === location.name && e.importance === 'high').length}</div>
                        <div className="text-sm text-[var(--color-700)]">High Priority</div>
                      </Card>
                      <Card className="border border-gray-200 p-4 text-center" style={{ backgroundColor: '#f8f6f2' }}>
                        <div className="text-2xl font-bold text-[var(--color-950)]">{Array.from(new Set(sampleTimelineEvents.filter(e => e.location === location.name).flatMap(e => e.characters))).length}</div>
                        <div className="text-sm text-[var(--color-700)]">Characters Involved</div>
                      </Card>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center">
                      <div className="rounded-lg p-4 shadow-sm border border-gray-200 flex items-center space-x-6" style={{ backgroundColor: '#f8f6f2' }}>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-destructive rounded-full"></div>
                          <span className="text-sm text-[var(--color-700)]">High Priority</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-[var(--color-500)] rounded-full"></div>
                          <span className="text-sm text-[var(--color-700)]">Medium Priority</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                          <span className="text-sm text-[var(--color-700)]">Low Priority</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Timeline Container - Placeholder for now */}
                    <div className="rounded-lg p-8 shadow-sm border border-gray-200" style={{ backgroundColor: '#f8f6f2' }}>
                      {sampleTimelineEvents.filter(e => e.location === location.name).length === 0 ? (
                        <div className="text-center py-12">
                          <Clock className="w-12 h-12 text-[var(--color-600)] mx-auto mb-4" />
                          <h3 className="text-lg font-semibold text-[var(--color-700)] mb-2">No Events Found</h3>
                          <p className="text-[var(--color-600)]">No timeline events have been recorded for {location.name} yet.</p>
                        </div>
                      ) : (
                        <SerpentineTimelineForLocation location={location} />
                      )}
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