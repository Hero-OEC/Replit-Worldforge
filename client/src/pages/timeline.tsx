import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Filter,
  Search,
  Plus,
  ChevronDown,
  Edit,
  Trash2,
  Eye,
  MoreHorizontal,
  X,
  Tag as TagIcon,
  Settings,
  User,
  Check,
  Swords,
  Lightbulb,
  Award,
  Crown,
  Heart,
  HelpCircle,
  Sparkles,
  Zap,
  Plane
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, getTagVariant } from "@/components/ui/tag";
import Navbar from "@/components/layout/navbar";
import type { TimelineEvent, ProjectWithStats, Character, Location } from "@shared/schema";

// Sample data for autocomplete
const sampleLocations = [
  "Arcanum City",
  "Dark Forest",
  "Magic Academy",
  "Riverside Village",
  "Northern Road",
  "Battlefield",
  "Elemental Nexus",
  "Misty Marshlands",
  "Garden of Stars",
  "Royal Palace",
  "Training Grounds",
  "Royal Library",
  "Ancient Ruins",
  "Crystal Caves",
  "Sunset Harbor",
  "Mountain Pass",
];

const sampleCharacters = [
  "Elena",
  "Marcus",
  "Mentor",
  "King",
  "Ancient Sage",
  "Council Members",
  "Army",
  "Lord Vex",
  "Princess Aria",
  "Captain Storm",
  "Wise Oracle",
  "Shadow Assassin",
  "Dragon Guardian",
  "Village Elder",
];

// Tag Search Component with separate search and tags
interface TagSearchProps {
  items: string[];
  placeholder: string;
  selectedTags: string[];
  onAddTag: (tag: string) => void;
  onRemoveTag: (tag: string) => void;
}

function TagSearch({
  items,
  placeholder,
  selectedTags,
  onAddTag,
  onRemoveTag,
}: TagSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [filteredItems, setFilteredItems] = useState<string[]>([]);

  useEffect(() => {
    if (searchValue) {
      const filtered = items.filter(
        (item) =>
          item.toLowerCase().includes(searchValue.toLowerCase()) &&
          !selectedTags.includes(item),
      );
      setFilteredItems(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredItems([]);
      setIsOpen(false);
    }
  }, [searchValue, items, selectedTags]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  };

  const handleSelectItem = (item: string) => {
    onAddTag(item);
    setSearchValue("");
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (
      e.key === "Enter" &&
      searchValue &&
      !selectedTags.includes(searchValue)
    ) {
      onAddTag(searchValue);
      setSearchValue("");
      setIsOpen(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder={placeholder}
          value={searchValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={() => {
            if (filteredItems.length > 0) setIsOpen(true);
          }}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="bg-[var(--color-100)] border-[var(--color-400)] focus:bg-[var(--color-50)]"
        />
        {isOpen && filteredItems.length > 0 && (
          <div className="absolute z-[999] w-full bg-[var(--color-100)] border border-[var(--color-300)] rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-[var(--color-200)] cursor-pointer text-sm"
                onClick={() => handleSelectItem(item)}
              >
                <div className="flex items-center justify-between">
                  <span>{item}</span>
                  <Check className="w-4 h-4 text-[var(--color-600)]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedTags.map((tag, index) => (
            <Tag
              key={index}
              variant="primary"
              removable
              onRemove={() => onRemoveTag(tag)}
            >
              {tag}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}

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
  "Character Arc": User,
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
  Preparation: Edit,
  Prophecies: Eye,
  Prophecy: Eye,
  Quest: MapPin,
  Religion: Calendar,
  Tragedy: Heart,
  Other: Calendar,
};

// Function to get icon, ensuring no Star fallback
const getEventIcon = (category: string) => {
  return eventTypeIcons[category as keyof typeof eventTypeIcons] || Calendar;
};

// Sample timeline events for demonstration with multi-event date
const sampleEvents = [
  {
    id: 1,
    title: "Elena's Awakening",
    date: "Year 1, Day 5",
    importance: "high",
    category: "Character Arc",
    description:
      "Elena discovers her true magical potential during a routine training session.",
    location: "Arcanum City",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 2,
    title: "The Forbidden Library",
    date: "Year 1, Day 12",
    importance: "medium",
    category: "Discovery",
    description:
      "Elena and Marcus uncover ancient texts in the hidden library.",
    location: "Arcanum City",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 3,
    title: "First Encounter",
    date: "Year 1, Day 18",
    importance: "high",
    category: "Conflict",
    description: "The protagonists face their first major challenge.",
    location: "Dark Forest",
    characters: ["Elena"],
  },
  {
    id: 4,
    title: "The Mentor's Secret",
    date: "Year 1, Day 25",
    importance: "medium",
    category: "Revelation",
    description: "A secret about Elena's mentor is revealed.",
    location: "Magic Academy",
    characters: ["Elena", "Mentor"],
  },
  {
    id: 5,
    title: "Village Rescue",
    date: "Year 1, Day 31",
    importance: "low",
    category: "Heroic Act",
    description: "The heroes help save a village from bandits.",
    location: "Riverside Village",
    characters: ["Elena", "Marcus"],
  },
  // Multi-event date example
  {
    id: 11,
    title: "Morning Council Meeting",
    date: "Year 1, Day 50",
    importance: "medium",
    category: "Political Event",
    description: "The kingdom's council meets to discuss the growing threat.",
    location: "Royal Palace",
    characters: ["Elena", "King", "Council Members"],
  },
  {
    id: 12,
    title: "Afternoon Training",
    date: "Year 1, Day 50",
    importance: "low",
    category: "Character Arc",
    description: "Elena practices her new abilities in the training grounds.",
    location: "Training Grounds",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 13,
    title: "Evening Revelation",
    date: "Year 1, Day 50",
    importance: "high",
    category: "Revelation",
    description: "A shocking truth about Elena's heritage is revealed.",
    location: "Royal Library",
    characters: ["Elena", "Ancient Sage"],
  },
  {
    id: 6,
    title: "Journey to the North",
    date: "Year 1, Day 78",
    importance: "medium",
    category: "Traveling",
    description: "The group begins their journey to the northern kingdoms.",
    location: "Northern Road",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 7,
    title: "The Great Battle",
    date: "Year 1, Day 71",
    importance: "high",
    category: "Battle",
    description: "A major battle that changes the course of the war.",
    location: "Battlefield",
    characters: ["Elena", "Marcus", "Army"],
  },
  {
    id: 8,
    title: "Elemental Convergence",
    date: "Year 1, Day 90",
    importance: "medium",
    category: "Magic",
    description: "The elemental forces converge in an unprecedented way.",
    location: "Elemental Nexus",
    characters: ["Elena"],
  },
  {
    id: 9,
    title: "The Vanishing Mist",
    date: "Year 1, Day 95",
    importance: "low",
    category: "Mystery",
    description: "A strange mist appears and disappears mysteriously.",
    location: "Misty Marshlands",
    characters: ["Elena", "Marcus"],
  },
  {
    id: 10,
    title: "Hearts Entwined",
    date: "Year 1, Day 88",
    importance: "medium",
    category: "Romance",
    description: "A romantic subplot reaches a crucial moment.",
    location: "Garden of Stars",
    characters: ["Elena", "Marcus"],
  },
];

export default function Timeline() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, navigate] = useLocation();
  const { navigateWithHistory } = useNavigation();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacterFilters, setSelectedCharacterFilters] = useState<string[]>([]);
  const [selectedLocationFilters, setSelectedLocationFilters] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(1000);

  // Initialize edit form when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      setEventTitle(selectedEvent.title || "");
      setEventDate(selectedEvent.date || "");
      setEventPriority(selectedEvent.importance || "medium");
      setEventCategory(selectedEvent.category || "");
      setEventDescription(selectedEvent.description || "");
      setSelectedLocations(selectedEvent.location ? [selectedEvent.location] : []);
      setSelectedCharacters(selectedEvent.characters || []);
    }
  }, [selectedEvent]);

  // Monitor container width for responsive layout
  useEffect(() => {
    const updateContainerWidth = () => {
      if (timelineContainerRef.current) {
        const width = timelineContainerRef.current.offsetWidth;
        setContainerWidth(width);
      }
    };

    // Initial measurement
    updateContainerWidth();

    // Set up ResizeObserver for container width changes
    const resizeObserver = new ResizeObserver(updateContainerWidth);
    if (timelineContainerRef.current) {
      resizeObserver.observe(timelineContainerRef.current);
    }

    // Cleanup
    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Form state for add/edit dialogs
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventPriority, setEventPriority] = useState("medium");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);

  const eventCategories = [
    "Character Development",
    "Discovery",
    "Conflict",
    "Revelation",
    "Heroic Act",
    "Political Event",
    "Romance",
    "Mystery",
    "Magic",
    "Battle",
    "Traveling",
  ];

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: timelineEvents = [] } = useQuery<TimelineEvent[]>({
    queryKey: [`/api/projects/${projectId}/timeline`],
    enabled: !!projectId,
  });

  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: [`/api/projects/${projectId}/characters`],
    enabled: !!projectId,
  });

  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: [`/api/projects/${projectId}/locations`],
    enabled: !!projectId,
  });

  // Convert database events to timeline component format
  const convertToTimelineData = (events: TimelineEvent[]) => {
    return events.map(event => {
      // Convert day format to proper year/day format
      let displayDate = event.date || "No Date";
      if (displayDate.startsWith("Day ")) {
        const dayNumber = displayDate.replace("Day ", "");
        displayDate = `Year 1, Day ${dayNumber}`;
      }

      return {
        id: event.id,
        title: event.title,
        date: displayDate,
        importance: (event.importance || "medium") as "high" | "medium" | "low",
        category: event.category || "Other",
        description: event.description || "",
        location: event.location || "",
        characters: Array.isArray(event.characters) ? event.characters : []
      };
    });
  };

  const timelineData = convertToTimelineData(timelineEvents);

  // Apply filters to timeline data
  const filteredEvents = timelineData.filter(event => {
    // Character filter
    if (selectedCharacterFilters.length > 0) {
      const hasMatchingCharacter = selectedCharacterFilters.some(filterCharacter =>
        event.characters.includes(filterCharacter)
      );
      if (!hasMatchingCharacter) return false;
    }

    // Location filter
    if (selectedLocationFilters.length > 0) {
      if (!selectedLocationFilters.includes(event.location)) return false;
    }

    return true;
  });

  // Sort events by date for timeline display
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const getDateNumber = (dateStr: string) => {
      const match = dateStr.match(/Day (\d+)/);
      return match ? parseInt(match[1]) : 0;
    };
    return getDateNumber(a.date) - getDateNumber(b.date);
  });

  // Group events by date
  const eventsByDate = sortedEvents.reduce((acc: any, event) => {
    const eventDate = event.date || "No Date";
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

  // Calculate responsive bubbles per row based on container width
  const getEventsPerRow = (width: number) => {
    if (width > 900) return 4; // Timeline page, location page
    if (width > 600) return 3; // Character page
    return 2; // Mobile
  };

  // Calculate timeline positions for serpentine layout - improved spacing
  const timelineWidth = Math.min(1000, containerWidth - 40);
  const eventsPerRow = getEventsPerRow(containerWidth);
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const timelineHeight = Math.max(800, rows * 200 + 200); // Much better vertical spacing
  const pathPoints: number[][] = [];

  const horizontalSpacing = (timelineWidth - 120) / Math.max(1, eventsPerRow - 1);
  const verticalSpacing = Math.max(180, (timelineHeight - 200) / Math.max(1, rows - 1)); // Dynamic vertical spacing

  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;

    let x, y;
    if (dateGroups.length === 1) {
      // Center single event
      x = timelineWidth / 2;
      y = timelineHeight / 2;
    } else if (row % 2 === 0) {
      // Left to right for even rows
      x = 60 + col * horizontalSpacing;
      y = 100 + row * verticalSpacing;
    } else {
      // Right to left for odd rows
      x = 60 + (eventsPerRow - 1 - col) * horizontalSpacing;
      y = 100 + row * verticalSpacing;
    }

    pathPoints.push([x, y]);
  });

  return (
    <div className="min-h-screen bg-[var(--worldforge-bg)]">
      <Navbar
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search timeline events..."
        onSearch={setSearchTerm}
      />
      <main className="px-4 py-8 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header with Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[var(--color-600)] cursor-pointer group">
                  <Clock className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">
                    Timeline
                  </h1>
                  <p className="text-[var(--color-700)]">
                    Track and organize story events chronologically
                  </p>
                </div>
              </div>
              <Button 
                className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
                onClick={() => navigateWithHistory(`/project/${projectId}/timeline/new`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Event
              </Button>
            </div>


          </div>

          {/* Filters */}
          <div className="mb-6 flex justify-center">
            <div className="bg-[var(--color-100)] rounded-lg p-6 border border-[var(--color-300)]">
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-2">
                  <User className="w-5 h-5 text-[var(--color-600)]" />
                  <span className="text-sm font-medium text-[var(--color-950)]">Characters:</span>
                  <div className="w-48">
                    <TagSearch
                      items={characters.map(char => char.name)}
                      placeholder="Filter by character..."
                      selectedTags={selectedCharacterFilters}
                      onAddTag={(character) => setSelectedCharacterFilters(prev => [...prev, character])}
                      onRemoveTag={(character) => setSelectedCharacterFilters(prev => prev.filter(c => c !== character))}
                    />
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-[var(--color-600)]" />
                  <span className="text-sm font-medium text-[var(--color-950)]">Locations:</span>
                  <div className="w-48">
                    <TagSearch
                      items={locations.map(loc => loc.name)}
                      placeholder="Filter by location..."
                      selectedTags={selectedLocationFilters}
                      onAddTag={(location) => setSelectedLocationFilters(prev => [...prev, location])}
                      onRemoveTag={(location) => setSelectedLocationFilters(prev => prev.filter(l => l !== location))}
                    />
                  </div>
                </div>
              </div>
              
              {/* Filter Summary & Clear Button */}
              {(selectedCharacterFilters.length > 0 || selectedLocationFilters.length > 0) && (
                <div className="mt-4 pt-4 border-t border-[var(--color-300)] flex items-center justify-between">
                  <div className="text-sm text-[var(--color-700)]">
                    Showing {sortedEvents.length} of {timelineData.length} events
                    {selectedCharacterFilters.length > 0 && (
                      <span> • Characters: {selectedCharacterFilters.join(", ")}</span>
                    )}
                    {selectedLocationFilters.length > 0 && (
                      <span> • Locations: {selectedLocationFilters.join(", ")}</span>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSelectedCharacterFilters([]);
                      setSelectedLocationFilters([]);
                    }}
                    className="text-[var(--color-700)] border-[var(--color-300)] hover:bg-[var(--color-50)]"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Legend */}
          <div className="flex justify-center mt-[0px] mb-[0px]">
            <div className="rounded-lg p-4 shadow-sm border border-[var(--color-300)] flex items-center space-x-6 bg-[var(--color-100)]">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[var(--color-500)] rounded-full"></div>
                <span className="text-sm text-[var(--color-700)]">High Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[var(--color-500)] rounded-full"></div>
                <span className="text-sm text-[var(--color-700)]">Medium Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[var(--color-300)] rounded-full"></div>
                <span className="text-sm text-[var(--color-700)]">Low Priority</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-[var(--color-600)] rounded-full flex items-center justify-center">
                  <span className="text-[var(--color-50)] text-xs font-bold">3</span>
                </div>
                <span className="text-sm text-[var(--color-700)]">Multiple Events</span>
              </div>
            </div>
          </div>

          {/* Serpentine Timeline */}
          <div ref={timelineContainerRef} className="p-8 pt-[0px] pb-[0px]">
            <div
              ref={timelineRef}
              className="relative mx-auto"
              style={{ width: timelineWidth, height: timelineHeight }}
            >
              {/* Timeline Path */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {pathPoints.length > 1 && (
                  <path
                    d={`M ${pathPoints.map(point => point.join(',')).join(' L ')}`}
                    stroke="#d69e2e"
                    strokeWidth="3"
                    fill="none"
                    opacity="0.6"
                  />
                )}
              </svg>

              {/* Event Nodes */}
              {dateGroups.map((group, index) => {
                const [x, y] = pathPoints[index];
                const isHovered = hoveredDateGroup === group;

                return (
                  <div key={group.date}>
                    <div
                      style={{ left: x, top: y }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    >
                      {group.isMultiEvent ? (
                        // Multi-event node
                        (<div
                          className={`relative cursor-pointer transform transition-all duration-200 ${
                            isHovered ? "scale-110" : "hover:scale-105"
                          }`}
                          onMouseEnter={(e) => {
                            setHoveredDateGroup(group);
                            const bubbleRect = e.currentTarget.getBoundingClientRect();
                            const viewportWidth = window.innerWidth;
                            const viewportHeight = window.innerHeight;
                            
                            const popupWidth = 320;
                            const popupHeight = 300;
                            
                            // Get bubble center position relative to viewport
                            const bubbleCenterX = bubbleRect.left + (bubbleRect.width / 2);
                            const bubbleCenterY = bubbleRect.top + (bubbleRect.height / 2);
                            
                            // Calculate horizontal position - center the popup on the bubble
                            let finalX = bubbleCenterX;
                            
                            // Ensure popup doesn't go off screen horizontally
                            const leftEdge = finalX - (popupWidth / 2);
                            const rightEdge = finalX + (popupWidth / 2);
                            
                            if (leftEdge < 20) {
                              finalX = 20 + (popupWidth / 2);
                            } else if (rightEdge > viewportWidth - 20) {
                              finalX = viewportWidth - 20 - (popupWidth / 2);
                            }
                            
                            // Calculate vertical position
                            const spaceBelow = viewportHeight - bubbleCenterY - 60;
                            const spaceAbove = bubbleCenterY - 60;
                            
                            let finalY;
                            if (spaceBelow >= popupHeight) {
                              finalY = bubbleCenterY + 60;
                            } else if (spaceAbove >= popupHeight) {
                              finalY = bubbleCenterY - 60 - popupHeight;
                            } else {
                              finalY = Math.max(20, Math.min(viewportHeight - popupHeight - 20, bubbleCenterY - popupHeight / 2));
                            }
                            
                            setPopupPosition({
                              x: finalX,
                              y: finalY,
                            });pace
                              const spaceBelow = timelineRect.height - (bubbleCenterY + 20); // 20px buffer from bubble center
                              const spaceAbove = bubbleCenterY - 20; // 20px buffer from bubble center  
                              
                              let finalY;
                            if (spaceBelow >= popupHeight) {
                              // Show below bubble
                              finalY = bubbleCenterY + 60;
                            } else if (spaceAbove >= popupHeight) {
                              // Show above bubble
                              finalY = bubbleCenterY - 60 - popupHeight;
                            } else {
                              // Show in center of available space
                              finalY = Math.max(20, Math.min(viewportHeight - popupHeight - 20, bubbleCenterY - popupHeight / 2));
                            }
                            
                            setPopupPosition({
                              x: finalX,
                              y: finalY,
                            }); + 50) {
                                // Place below bubble - bubble center + 20px (to clear bubble) + 30px spacing = 50px total
                                finalY = bubbleCenterY + 50;
                              } else if (spaceAbove >= popupHeight + 50) {
                                // Place above bubble - bubble center - 20px (to clear bubble) - 30px spacing - popup height
                                finalY = bubbleCenterY - popupHeight - 50;
                              } else {
                                // Force below as default
                                finalY = bubbleCenterY + 50;
                              }

                              setPopupPosition({
                                x: bubbleCenterX,
                                y: finalY,
                              });
                            }
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
                            <div className="w-12 h-12 bg-[var(--color-600)] rounded-full flex items-center justify-center shadow-lg">
                              <Calendar className="w-6 h-6 text-[var(--color-50)]" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--color-500)] rounded-full flex items-center justify-center">
                              <span className="text-[var(--color-50)] font-bold text-xs">
                                {group.events.length}
                              </span>
                            </div>
                          </div>
                        </div>)
                      ) : (
                        // Single event node
                        (<div
                          className={`relative cursor-pointer transform transition-all duration-200 ${
                            hoveredEvent === group.events[0]
                              ? "scale-110"
                              : "hover:scale-105"
                          }`}
                          onMouseEnter={(e) => {
                            setHoveredEvent(group.events[0]);
                            const bubbleRect = e.currentTarget.getBoundingClientRect();
                            const viewportWidth = window.innerWidth;
                            const viewportHeight = window.innerHeight;
                            
                            const popupWidth = 320; // Standard popup width
                            const popupHeight = 250;
                            
                            // Get bubble center position relative to viewport
                            const bubbleCenterX = bubbleRect.left + (bubbleRect.width / 2);
                            const bubbleCenterY = bubbleRect.top + (bubbleRect.height / 2);
                            
                            // Calculate horizontal position - center the popup on the bubble
                            let finalX = bubbleCenterX;
                            
                            // Ensure popup doesn't go off screen horizontally
                            const leftEdge = finalX - (popupWidth / 2);
                            const rightEdge = finalX + (popupWidth / 2);
                            
                            if (leftEdge < 20) {
                              finalX = 20 + (popupWidth / 2); // 20px margin from left edge
                            } else if (rightEdge > viewportWidth - 20) {
                              finalX = viewportWidth - 20 - (popupWidth / 2); // 20px margin from right edge
                            }
                            
                            // Calculate vertical position
                            const spaceBelow = viewportHeight - bubbleCenterY - 60; // 60px buffer below bubble
                            const spaceAbove = bubbleCenterY - 60; // 60px buffer above bubble
                            
                            let finalY;
                            if (spaceBelow >= popupHeight0) {
                                // Place below bubble - bubble center + 20px (to clear bubble) + 30px spacing = 50px total
                                finalY = bubbleCenterY + 50;
                              } else if (spaceAbove >= popupHeight + 50) {
                                // Place above bubble - bubble center - 20px (to clear bubble) - 30px spacing - popup height
                                finalY = bubbleCenterY - popupHeight - 50;
                              } else {
                                // Force below as default
                                finalY = bubbleCenterY + 50;
                              }

                              setPopupPosition({
                                x: bubbleCenterX,
                                y: finalY,
                              });
                            }
                          }}
                          onMouseLeave={() => {
                            setTimeout(() => {
                              if (!popupRef.current?.matches(":hover")) {
                                setHoveredEvent(null);
                                setPopupPosition(null);
                              }
                            }, 100);
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/project/${projectId}/timeline/${group.events[0].id}`);
                          }}
                        >
                          <div
                            className={`w-12 h-12 ${priorityColors[group.events[0].importance as keyof typeof priorityColors] || priorityColors.medium} rounded-full flex items-center justify-center shadow-lg`}
                          >
                            {React.createElement(
                              getEventIcon(group.events[0].category),
                              {
                                className: "w-6 h-6 text-white",
                              },
                            )}
                          </div>
                        </div>)
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
                        <div className="bg-[var(--color-100)] px-3 py-2 rounded-lg shadow-sm border border-[var(--color-300)] min-w-[140px] max-w-[180px]">
                          <div className="text-sm font-semibold text-gray-800 mb-1 leading-tight truncate">
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
          </div>

          {/* Hover popups */}
          {popupPosition && (
            <div
              ref={popupRef}
              className="fixed z-50"
              style={{
                left: popupPosition.x - 160, // Center the popup (320px width / 2)
                top: popupPosition.y,
              }}
              onMouseEnter={() => {
                // Keep popup visible when hovering over it
              }}
              onMouseLeave={() => {
                setHoveredDateGroup(null);
                setHoveredEvent(null);
                setPopupPosition(null);
              }}
            >
              {hoveredDateGroup && hoveredDateGroup.isMultiEvent ? (
                // Multi-event popup
                (<Card
                  className="border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow bg-[#faf9ec]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/project/${projectId}/timeline/${hoveredDateGroup.events[0].id}`);
                  }}
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
                        const EventIcon = getEventIcon(event.category);
                        const importance =
                          event.importance as keyof typeof priorityColors;

                        return (
                          <div
                            key={event.id}
                            className="relative p-3 rounded-lg bg-[var(--color-100)] border cursor-pointer hover:bg-[var(--color-50)]"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/project/${projectId}/timeline/${event.id}`);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-8 h-8 ${priorityColors[importance]} rounded-full flex items-center justify-center flex-shrink-0`}
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
                                <div className="flex items-center space-x-4 mt-2 text-xs text-[var(--color-600)]">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-3 h-3" />
                                    <span>{event.location}</span>
                                  </div>
                                </div>
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
                  <div className="mt-4 pt-3 border-t border-[`var(--color-300)] text-center">
                    <span className="text-xs text-[var(--color-600)]">
                      Click on events to edit details
                    </span>
                  </div>
                </Card>)
              ) : hoveredEvent ? (
                // Single event popup
                (<Card
                  className="rounded-lg text-card-foreground border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow bg-[#faf9ec]"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigateWithHistory(`/project/${projectId}/timeline/${hoveredEvent.id}`);
                  }}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div
                      className={`w-10 h-10 ${priorityColors[hoveredEvent.importance as keyof typeof priorityColors]} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      {React.createElement(
                        getEventIcon(hoveredEvent.category),
                        {
                          className: "w-5 h-5 text-white",
                        },
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-[var(--color-950)] text-lg">
                        {hoveredEvent.title}
                      </h3>
                      <p className="text-sm text-[var(--color-700)] mb-2">
                        {hoveredEvent.date}
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          className={`${priorityColors[hoveredEvent.importance as keyof typeof priorityColors]} text-[var(--color-50)]`}
                        >
                          {
                            priorityLabels[
                              hoveredEvent.importance as keyof typeof priorityLabels
                            ]
                          }
                        </Badge>
                        <Badge variant="outline">{hoveredEvent.category}</Badge>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">
                    {hoveredEvent.description}
                  </p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center space-x-2 text-[var(--color-700)]">
                      <MapPin className="w-4 h-4" />
                      <span>{hoveredEvent.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-[var(--color-700)]">
                      <Users className="w-4 h-4" />
                      <span>{hoveredEvent.characters.join(", ")}</span>
                    </div>
                  </div>
                  <div
                    className="mt-4 pt-3 border-t border-[var(--color-300)] text-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigateWithHistory(`/project/${projectId}/timeline/${hoveredEvent.id}`);
                    }}
                  >
                    <span className="text-xs text-[var(--color-600)] hover:text-gray-700">
                      Click to view event
                    </span>
                  </div>
                </Card>)
              ) : null}
            </div>
          )}
        </div>
      </main>
      {/* Add Event Dialog */}
      {showAddDialog && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddDialog(false);
            }
          }}
        >
          <Card className="bg-white w-full max-w-4xl h-[85vh] relative z-[501] flex flex-col">
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[var(--color-950)]">
                  Add New Event
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddDialog(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Event Title
                    </label>
                    <Input
                      placeholder="Enter event title..."
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                      className="bg-[var(--color-100)] border-[var(--color-400)] focus:bg-[var(--color-50)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <Input
                        placeholder="Year 1, Day 1"
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                        className="bg-[var(--color-100)] border-[var(--color-400)] focus:bg-[var(--color-50)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-[var(--color-400)] rounded-md bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                        value={eventPriority}
                        onChange={(e) => setEventPriority(e.target.value)}
                      >
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      className="w-full px-3 py-2 border border-[var(--color-400)] rounded-md bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                    >
                      <option value="">Select a category...</option>
                      {eventCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <TagSearch
                      items={sampleLocations}
                      placeholder="Search locations..."
                      selectedTags={selectedLocations}
                      onAddTag={(location) =>
                        setSelectedLocations([...selectedLocations, location])
                      }
                      onRemoveTag={(location) =>
                        setSelectedLocations(
                          selectedLocations.filter((l) => l !== location),
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Characters
                    </label>
                    <TagSearch
                      items={sampleCharacters}
                      placeholder="Search characters..."
                      selectedTags={selectedCharacters}
                      onAddTag={(character) =>
                        setSelectedCharacters([
                          ...selectedCharacters,
                          character,
                        ])
                      }
                      onRemoveTag={(character) =>
                        setSelectedCharacters(
                          selectedCharacters.filter((c) => c !== character),
                        )
                      }
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      className="w-full h-64 px-3 py-2 border border-[var(--color-400)] rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
                      placeholder="Describe the event in detail..."
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-[var(--color-300)] bg-[var(--color-100)]">
              <div className="flex justify-end space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setShowAddDialog(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    console.log("Saving event:", {
                      title: eventTitle,
                      date: eventDate,
                      importance: eventPriority,
                      category: eventCategory,
                      description: eventDescription,
                      locations: selectedLocations,
                      characters: selectedCharacters,
                    });
                    setShowAddDialog(false);
                    setEventTitle("");
                    setEventDate("");
                    setEventPriority("medium");
                    setEventCategory("");
                    setEventDescription("");
                    setSelectedLocations([]);
                    setSelectedCharacters([]);
                  }}
                >
                  Add Event
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* Edit Event Dialog */}
      {showEditDialog && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-950)]">Edit Event</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                  }}
                  className="text-[var(--color-600)] hover:text-[var(--color-700)]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <Input
                    placeholder="Enter event title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="bg-[var(--color-100)] border-[var(--color-400)] focus:bg-[var(--color-50)]"
                  />
                </div>

                {/* Date and Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <Input
                      placeholder="e.g., Year 1, Day 25"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="bg-[var(--color-100)] border-[var(--color-400)] focus:bg-[var(--color-50)]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={eventPriority}
                      onChange={(e) => setEventPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--color-100)] border border-[var(--color-400)] rounded-md focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-100)] border border-[var(--color-400)] rounded-md focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a category</option>
                    {eventCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe what happens in this event..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-[var(--color-100)] border border-[var(--color-400)] rounded-md focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locations
                  </label>
                  <TagSearch
                    items={sampleLocations}
                    placeholder="Search and add locations..."
                    selectedTags={selectedLocations}
                    onAddTag={(location) =>
                      setSelectedLocations([...selectedLocations, location])
                    }
                    onRemoveTag={(location) =>
                      setSelectedLocations(
                        selectedLocations.filter((l) => l !== location)
                      )
                    }
                  />
                </div>

                {/* Characters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Characters
                  </label>
                  <TagSearch
                    items={sampleCharacters}
                    placeholder="Search and add characters..."
                    selectedTags={selectedCharacters}
                    onAddTag={(character) =>
                      setSelectedCharacters([...selectedCharacters, character])
                    }
                    onRemoveTag={(character) =>
                      setSelectedCharacters(
                        selectedCharacters.filter((c) => c !== character)
                      )
                    }
                  />
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-[var(--color-300)]">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                  onClick={() => {
                    console.log("Updated Event:", {
                      id: selectedEvent.id,
                      title: eventTitle,
                      date: eventDate,
                      importance: eventPriority,
                      category: eventCategory,
                      description: eventDescription,
                      location: selectedLocations[0] || null,
                      characters: selectedCharacters,
                    });
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                    // Reset form
                    setEventTitle("");
                    setEventDate("");
                    setEventPriority("medium");
                    setEventCategory("");
                    setEventDescription("");
                    setSelectedLocations([]);
                    setSelectedCharacters([]);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
      {/* Edit Event Dialog */}
      {showEditDialog && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-950)]">Edit Event</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                  }}
                  className="text-[var(--color-600)] hover:text-[var(--color-700)]"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <div className="space-y-6">
                {/* Event Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Title
                  </label>
                  <Input
                    placeholder="Enter event title..."
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="bg-[var(--color-100)] border-[var(--color-400)] focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Date and Priority Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <Input
                      placeholder="e.g., Year 1, Day 25"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="bg-[var(--color-100)] border-[var(--color-400)] focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      value={eventPriority}
                      onChange={(e) => setEventPriority(e.target.value)}
                      className="w-full px-3 py-2 bg-[var(--color-100)] border border-[var(--color-400)] rounded-md focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-[var(--color-100)] border border-[var(--color-400)] rounded-md focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  >
                    <option value="">Select a category</option>
                    {eventCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    placeholder="Describe what happens in this event..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 bg-[var(--color-100)] border border-[var(--color-400)] rounded-md focus:bg-[var(--color-50)] focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
                  />
                </div>

                {/* Locations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Locations
                  </label>
                  <TagSearch
                    items={sampleLocations}
                    placeholder="Search and add locations..."
                    selectedTags={selectedLocations}
                    onAddTag={(location) =>
                      setSelectedLocations([...selectedLocations, location])
                    }
                    onRemoveTag={(location) =>
                      setSelectedLocations(
                        selectedLocations.filter((l) => l !== location)
                      )
                    }
                  />
                </div>

                {/* Characters */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Characters
                  </label>
                  <TagSearch
                    items={sampleCharacters}
                    placeholder="Search and add characters..."
                    selectedTags={selectedCharacters}
                    onAddTag={(character) =>
                      setSelectedCharacters([...selectedCharacters, character])
                    }
                    onRemoveTag={(character) =>
                      setSelectedCharacters(
                        selectedCharacters.filter((c) => c !== character)
                      )
                    }
                  />
                </div>
              </div>

              {/* Dialog Actions */}
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-[var(--color-300)]">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                  onClick={() => {
                    console.log("Updated Event:", {
                      id: selectedEvent.id,
                      title: eventTitle,
                      date: eventDate,
                      importance: eventPriority,
                      category: eventCategory,
                      description: eventDescription,
                      location: selectedLocations[0] || null,
                      characters: selectedCharacters,
                    });
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                    // Reset form
                    setEventTitle("");
                    setEventDate("");
                    setEventPriority("medium");
                    setEventCategory("");
                    setEventDescription("");
                    setSelectedLocations([]);
                    setSelectedCharacters([]);
                  }}
                >
                  Save Changes
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}