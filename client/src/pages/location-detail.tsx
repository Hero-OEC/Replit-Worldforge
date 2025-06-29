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
  Trash2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import type { Location, ProjectWithStats, TimelineEvent } from "@shared/schema";

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

// Sample timeline events for location demonstration
const sampleLocationEvents = [
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
    title: "Academy Exhibition",
    date: "Year 1, Day 28",
    importance: "low" as const,
    category: "Character Arc",
    description: "Elena participates in the annual magic exhibition, showcasing her improved control over fire magic.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "Marcus", "Students"],
  },
  {
    id: 4,
    title: "Market Day Incident",
    date: "Year 1, Day 42",
    importance: "low" as const,
    category: "Character Arc",
    description: "Elena accidentally reveals her growing powers during a crowded market day.",
    location: "Arcanum City",
    characters: ["Elena Brightblade"],
  },
  {
    id: 5,
    title: "Royal Council Meeting",
    date: "Year 1, Day 50",
    importance: "high" as const,
    category: "Political Event",
    description: "The kingdom's council meets to discuss the growing magical threat to the realm.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "King", "Council Members"],
  },
  {
    id: 6,
    title: "Ancient Prophecy Revealed",
    date: "Year 1, Day 67",
    importance: "high" as const,
    category: "Revelation",
    description: "Ancient texts reveal a prophecy about Elena's role in the coming darkness.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "Ancient Sage"],
  },
];

// Location Timeline Component (copied from character timeline)
function LocationTimeline({ location }: { location: Location }) {
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { projectId } = useParams<{ projectId: string }>();

  // Fetch timeline events from API
  const { data: timelineEvents = [] } = useQuery<TimelineEvent[]>({
    queryKey: ["/api/projects", projectId, "timeline"],
    enabled: !!projectId,
  });

  // Use sample data for demonstration - filter events for this location
  const locationEvents = sampleLocationEvents.filter(event => 
    event.location === location.name
  );

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
    const eventDate = event.date;
    if (!acc[eventDate]) {
      acc[eventDate] = [];
    }
    acc[eventDate].push(event);
    return acc;
  }, {});

  const dateGroups = Object.entries(eventsByDate).map(([date, events]) => ({
    date,
    events: events as any[],
    isMultiEvent: (events as any[]).length > 1,
  }));

  // Dynamic responsive dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  // Update timeline dimensions based on container size and events
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const availableWidth = Math.max(600, containerWidth - 64);
        const eventsPerRow = Math.max(3, Math.min(6, Math.floor(availableWidth / 180)));
        const rows = Math.ceil(dateGroups.length / eventsPerRow);
        const calculatedHeight = Math.max(300, rows * 140 + 60);
        
        setDimensions({
          width: availableWidth,
          height: calculatedHeight
        });
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100);
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
      clearTimeout(timer);
    };
  }, [dateGroups.length]);

  // Create serpentine path - responsive layout
  const eventsPerRow = Math.max(3, Math.min(6, Math.floor(dimensions.width / 180)));
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const horizontalSpacing = dateGroups.length > 1 ? Math.max(150, (dimensions.width - 120) / Math.min(eventsPerRow - 1, dateGroups.length - 1)) : 0;
  const verticalSpacing = rows > 1 ? Math.max(120, (dimensions.height - 120) / (rows - 1)) : 0;

  const pathPoints: number[][] = [];
  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;

    let x, y;
    if (dateGroups.length === 1) {
      x = dimensions.width / 2;
    } else if (row % 2 === 0) {
      x = 60 + col * horizontalSpacing;
    } else {
      x = 60 + (eventsPerRow - 1 - col) * horizontalSpacing;
    }
    y = 60 + row * verticalSpacing;

    pathPoints.push([x, y]);
  });

  const handleEventClick = (event: any, x: number, y: number) => {
    setHoveredEvent(event);
    setPopupPosition({ x, y });
  };

  const handleClosePopup = () => {
    setHoveredEvent(null);
    setPopupPosition(null);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClosePopup();
      }
    };

    if (hoveredEvent) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [hoveredEvent]);

  if (sortedEvents.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">
          No timeline events in {location.name}
        </h3>
        <p className="text-[var(--color-600)]">
          No events have taken place in {location.name} yet.
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Timeline Container */}
      <div className="w-full overflow-hidden">
        <div
          ref={timelineRef}
          className="relative mx-auto"
          style={{ width: dimensions.width, height: dimensions.height, minHeight: 300 }}
        >
          {/* Timeline Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {pathPoints.length > 1 && (
              <path
                d={`M ${pathPoints.map(point => point.join(',')).join(' L ')}`}
                stroke="var(--color-500)"
                strokeWidth="3"
                fill="none"
                opacity="1"
              />
            )}
          </svg>

          {/* Event Nodes */}
          {dateGroups.map((group, index) => {
            const [x, y] = pathPoints[index];
            const isHovered = hoveredDateGroup === group;

            return (
              <div
                key={group.date}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: x, top: y }}
                onMouseEnter={() => setHoveredDateGroup(group)}
                onMouseLeave={() => setHoveredDateGroup(null)}
              >
                {/* Date Node */}
                <div
                  className={`relative cursor-pointer transition-all duration-200 ${
                    isHovered ? "scale-110" : ""
                  }`}
                  onClick={(e) => {
                    if (group.events.length === 1) {
                      const rect = timelineRef.current?.getBoundingClientRect();
                      if (rect) {
                        handleEventClick(
                          group.events[0],
                          rect.left + x,
                          rect.top + y - 50
                        );
                      }
                    }
                  }}
                >
                  {/* Main Node Circle */}
                  <div
                    className={`w-12 h-12 rounded-full border-4 border-[var(--color-400)] flex items-center justify-center shadow-lg transition-all duration-200 ${
                      group.isMultiEvent
                        ? "bg-[var(--color-500)]"
                        : priorityColors[group.events[0].importance]
                    } ${isHovered ? "shadow-xl border-[var(--color-500)]" : ""}`}
                  >
                    {group.isMultiEvent ? (
                      <span className="text-[var(--color-50)] font-bold text-sm">
                        {group.events.length}
                      </span>
                    ) : (
                      <Star className="w-5 h-5 text-[var(--color-50)]" fill="currentColor" />
                    )}
                  </div>

                  {/* Event Title */}
                  {!group.isMultiEvent && (
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap max-w-32">
                      <div className="px-2 py-1 rounded shadow-sm border text-xs font-medium text-[var(--color-950)] text-center truncate bg-[var(--color-100)]">
                        {group.events[0].title}
                      </div>
                    </div>
                  )}
                  
                  {/* Date Label */}
                  <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="px-2 py-1 rounded shadow-sm border text-xs font-medium text-[var(--color-700)] bg-[var(--color-100)]">
                      {group.date}
                    </div>
                  </div>

                  {/* Multi-event Title */}
                  {group.isMultiEvent && (
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 whitespace-nowrap max-w-32">
                      <div className="px-2 py-1 rounded shadow-sm border text-xs font-medium text-[var(--color-950)] text-center bg-[var(--color-100)]">
                        {group.events.length} Events
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Detail Popup */}
      {hoveredEvent && popupPosition && (
        <div
          ref={popupRef}
          className="fixed z-50 rounded-lg shadow-2xl border p-6 w-96"
          style={{
            backgroundColor: '#faf9ec',
            left: Math.min(popupPosition.x, window.innerWidth - 400),
            top: Math.max(50, popupPosition.y - 100),
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${priorityColors[hoveredEvent.importance]}`} />
              <div>
                <h3 className="font-semibold text-[var(--color-950)]">{hoveredEvent.title}</h3>
                <p className="text-sm text-[var(--color-700)]">{hoveredEvent.date}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-1 text-xs rounded-full bg-[var(--color-200)] text-[var(--color-800)]">
                {hoveredEvent.category}
              </span>
              <span className="px-2 py-1 text-xs rounded-full border border-[var(--color-400)] text-[var(--color-700)]">
                {priorityLabels[hoveredEvent.importance]}
              </span>
            </div>

            {hoveredEvent.description && (
              <p className="text-sm text-[var(--color-700)]">
                {hoveredEvent.description}
              </p>
            )}

            {hoveredEvent.characters && hoveredEvent.characters.length > 0 && (
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4 text-[var(--color-600)]" />
                <div className="flex flex-wrap gap-1">
                  {hoveredEvent.characters.map((character: string, index: number) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-[var(--color-200)] text-[var(--color-800)]">
                      {character}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClosePopup}
            className="absolute top-2 right-2 h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function LocationDetail() {
  const { projectId, locationId } = useParams<{ projectId: string; locationId: string }>();
  const [location, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [locationData, setLocationData] = useState({
    name: "",
    type: "",
    description: "",
    geography: "",
    culture: "",
    significance: ""
  });

  useNavigationTracker(location, navigate);
  const { goBack } = useNavigation();

  // Fetch project data
  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Sample location data - in real app this would come from API
  const sampleLocation: Location = {
    id: parseInt(locationId || "1"),
    name: "Arcanum City",
    description: "The grand capital of the magical realm, home to the most prestigious academy of arcane arts.",
    geography: "Built on seven hills overlooking the Azure Bay, surrounded by enchanted forests.",
    culture: "A melting pot of magical traditions from across the realm, where scholars and mages gather to share knowledge.",
    significance: "The heart of magical learning and governance in the known world.",
    projectId: parseInt(projectId || "1"),
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Filter and sort events for stats calculation
  const locationEvents = sampleLocationEvents.filter(event => 
    event.location === sampleLocation.name
  );
  const sortedEvents = [...locationEvents].sort((a, b) => {
    const getDateNumber = (dateStr: string) => {
      const match = dateStr.match(/Day (\d+)/);
      return match ? parseInt(match[1]) : 0;
    };
    return getDateNumber(a.date) - getDateNumber(b.date);
  });

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
                  onClick={() => goBack('/projects/' + projectId + '/locations')}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Locations
                </Button>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(!isEditing)}
                  className="border-[var(--color-500)] text-[var(--color-700)] hover:bg-[var(--color-500)] hover:text-white"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-red-300 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                <MapPin className="w-5 h-5 text-white transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-950)]">{sampleLocation.name}</h1>
                <p className="text-[var(--color-700)]">Location Details</p>
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
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Description</label>
                          <p className="text-[var(--color-950)] leading-relaxed">{sampleLocation.description}</p>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Significance</label>
                          <p className="text-[var(--color-950)] leading-relaxed">{sampleLocation.significance}</p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="geography" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Geography</label>
                          <p className="text-[var(--color-950)] leading-relaxed">{sampleLocation.geography}</p>
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="culture" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Culture</label>
                          <p className="text-[var(--color-950)] leading-relaxed">{sampleLocation.culture}</p>
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
                              Events that take place in {sampleLocation.name}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-[var(--color-100)] rounded-lg p-4 border border-[var(--color-300)]">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-500)] to-[var(--color-600)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                              <Calendar className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                                {sortedEvents.length}
                              </div>
                              <div className="text-sm text-[var(--color-700)] font-medium">Total Events</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[var(--color-100)] rounded-lg p-4 border border-[var(--color-300)]">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-400)] to-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                              <Star className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                                {sortedEvents.filter(event => event.importance === "high").length}
                              </div>
                              <div className="text-sm text-[var(--color-700)] font-medium">High Priority</div>
                            </div>
                          </div>
                        </div>
                        <div className="bg-[var(--color-100)] rounded-lg p-4 border border-[var(--color-300)]">
                          <div className="flex items-center justify-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                              <Users className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                                {new Set(sortedEvents.flatMap(event => event.characters || [])).size}
                              </div>
                              <div className="text-sm text-[var(--color-700)] font-medium">Characters Involved</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Timeline Container */}
                      <LocationTimeline location={sampleLocation} />
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