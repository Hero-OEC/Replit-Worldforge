import React, { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Plus,
  Search,
  Filter,
  Star,
  Calendar,
  MapPin,
  Users,
  Edit,
  MoreHorizontal,
  User,
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
  X,
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import type { TimelineEvent, ProjectWithStats } from "@shared/schema";

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
          className="bg-gray-50 border-gray-300 focus:bg-white"
        />
        {isOpen && filteredItems.length > 0 && (
          <div className="absolute z-[999] w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredItems.map((item, index) => (
              <div
                key={index}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleSelectItem(item)}
              >
                <div className="flex items-center justify-between">
                  <span>{item}</span>
                  <Check className="w-4 h-4 text-gray-400" />
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
            <div
              key={index}
              className="inline-flex items-center bg-orange-100 text-orange-800 px-2 py-1 rounded-md text-sm"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 hover:text-orange-600"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const importanceColors = {
  high: "bg-red-500",
  medium: "bg-orange-500",
  low: "bg-yellow-500",
};

const importanceLabels = {
  high: "High Importance",
  medium: "Medium Importance",
  low: "Low Importance",
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

// Sample timeline events for demonstration with multi-event date
const sampleEvents = [
  {
    id: 1,
    title: "Elena's Awakening",
    date: "Year 1, Day 5",
    importance: "high",
    category: "Character Development",
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
    category: "Character Development",
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
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Initialize edit form when selectedEvent changes
  useEffect(() => {
    if (selectedEvent) {
      setEventTitle(selectedEvent.title || "");
      setEventDate(selectedEvent.date || "");
      setEventImportance(selectedEvent.importance || "medium");
      setEventCategory(selectedEvent.category || "");
      setEventDescription(selectedEvent.description || "");
      setSelectedLocations(selectedEvent.location ? [selectedEvent.location] : []);
      setSelectedCharacters(selectedEvent.characters || []);
    }
  }, [selectedEvent]);

  // Form state for add/edit dialogs
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventImportance, setEventImportance] = useState("medium");
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

  // Sort events by date for timeline display
  const sortedEvents = [...sampleEvents].sort((a, b) => {
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

  // Create serpentine path - 6 events per row, alternating direction
  const eventsPerRow = 6;
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const horizontalSpacing = (timelineWidth - 120) / (eventsPerRow - 1);
  const verticalSpacing = rows > 1 ? (timelineHeight - 120) / (rows - 1) : 0;

  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;

    let x, y;
    if (row % 2 === 0) {
      // Left to right for even rows
      x = 60 + col * horizontalSpacing;
    } else {
      // Right to left for odd rows
      x = 60 + (eventsPerRow - 1 - col) * horizontalSpacing;
    }
    y = 60 + row * verticalSpacing;

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
        rightContent={
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        }
      />

      <main className="px-4 py-8 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          {/* Header with Overview */}
          <div className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Timeline
                  </h1>
                  <p className="text-gray-600">
                    Track and organize story events chronologically
                  </p>
                </div>
              </div>

              {/* Timeline Stats Cards */}
              <div className="grid grid-cols-3 gap-4 lg:flex lg:space-x-4">
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {sampleEvents.length}
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Total Events
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {
                        sampleEvents.filter((e) => e.importance === "high")
                          .length
                      }
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      High Priority
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {
                        sampleEvents.filter(
                          (e) => e.category === "Character Development",
                        ).length
                      }
                    </div>
                    <div className="text-sm text-gray-600 font-medium">
                      Character Events
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mb-6 flex justify-center">
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
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">3</span>
                </div>
                <span className="text-sm text-gray-600">Multiple Events</span>
              </div>
            </div>
          </div>

          {/* Serpentine Timeline */}
          <div className="p-8">
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
                        <div
                          className={`relative cursor-pointer transform transition-all duration-200 ${
                            isHovered ? "scale-110" : "hover:scale-105"
                          }`}
                          onMouseEnter={(e) => {
                            setHoveredDateGroup(group);
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const viewportHeight = window.innerHeight;
                            const popupHeight = 300; // Estimated popup height

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
                              <Calendar className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {group.events.length}
                              </span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Single event node
                        <div
                          className={`relative cursor-pointer transform transition-all duration-200 ${
                            hoveredEvent === group.events[0]
                              ? "scale-110"
                              : "hover:scale-105"
                          }`}
                          onMouseEnter={(e) => {
                            setHoveredEvent(group.events[0]);
                            const rect =
                              e.currentTarget.getBoundingClientRect();
                            const viewportHeight = window.innerHeight;
                            const popupHeight = 250; // Estimated popup height

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
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedEvent(group.events[0]);
                            setShowEditDialog(true);
                            setHoveredEvent(null);
                            setPopupPosition(null);
                          }}
                        >
                          <div
                            className={`w-12 h-12 ${importanceColors[group.events[0].importance as keyof typeof importanceColors]} rounded-full flex items-center justify-center shadow-lg`}
                          >
                            {React.createElement(
                              eventTypeIcons[
                                group.events[0]
                                  .category as keyof typeof eventTypeIcons
                              ] || Star,
                              {
                                className: "w-6 h-6 text-white",
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
                        <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 min-w-[120px]">
                          <div className="text-sm font-semibold text-gray-800 mb-1 leading-relaxed">
                            {group.isMultiEvent
                              ? `${group.events.length} Events`
                              : group.events[0].title}
                          </div>
                          <div className="text-xs text-gray-600 font-medium">
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
                left: popupPosition.x,
                top: popupPosition.y,
                transform: "translateX(-50%)",
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
                <Card
                  className="bg-white border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(hoveredDateGroup.events[0]);
                    setShowEditDialog(true);
                    setHoveredDateGroup(null);
                    setPopupPosition(null);
                  }}
                >
                  <div className="mb-3">
                    <h3 className="font-semibold text-gray-900 text-lg mb-2">
                      {hoveredDateGroup.date}
                    </h3>
                    <p className="text-sm text-gray-600">
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
                            className="relative p-3 rounded-lg bg-gray-50 border cursor-pointer hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                              setShowEditDialog(true);
                              setHoveredDateGroup(null);
                              setHoveredEvent(null);
                              setPopupPosition(null);
                            }}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className={`w-8 h-8 ${importanceColors[importance]} rounded-full flex items-center justify-center flex-shrink-0`}
                              >
                                <EventIcon className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {event.title}
                                </h4>
                                <p className="text-xs text-gray-600 mt-1">
                                  {event.description.substring(0, 60)}...
                                </p>
                                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
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
                      <div className="text-center text-xs text-gray-500 pt-2">
                        +{hoveredDateGroup.events.length - 3} more events
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                    <span className="text-xs text-gray-500">
                      Click on events to edit details
                    </span>
                  </div>
                </Card>
              ) : hoveredEvent ? (
                // Single event popup
                <Card
                  className="bg-white border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEvent(hoveredEvent);
                    setShowEditDialog(true);
                    setHoveredEvent(null);
                    setPopupPosition(null);
                  }}
                >
                  <div className="flex items-start space-x-3 mb-3">
                    <div
                      className={`w-10 h-10 ${importanceColors[hoveredEvent.importance as keyof typeof importanceColors]} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      {React.createElement(
                        eventTypeIcons[
                          hoveredEvent.category as keyof typeof eventTypeIcons
                        ] || Star,
                        {
                          className: "w-5 h-5 text-white",
                        },
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg">
                        {hoveredEvent.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">
                        {hoveredEvent.date}
                      </p>
                      <div className="flex items-center space-x-2 mb-2">
                        <Badge
                          className={`${importanceColors[hoveredEvent.importance as keyof typeof importanceColors]} text-white`}
                        >
                          {
                            importanceLabels[
                              hoveredEvent.importance as keyof typeof importanceLabels
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
                    <div className="flex items-center space-x-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{hoveredEvent.location}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{hoveredEvent.characters.join(", ")}</span>
                    </div>
                  </div>

                  <div
                    className="mt-4 pt-3 border-t border-gray-200 text-center cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(hoveredEvent);
                      setShowEditDialog(true);
                      setHoveredEvent(null);
                      setPopupPosition(null);
                    }}
                  >
                    <span className="text-xs text-gray-500 hover:text-gray-700">
                      Click to edit event
                    </span>
                  </div>
                </Card>
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
                <h2 className="text-xl font-bold text-gray-900">
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
                      className="bg-gray-50 border-gray-300 focus:bg-white"
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
                        className="bg-gray-50 border-gray-300 focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Importance
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white"
                        value={eventImportance}
                        onChange={(e) => setEventImportance(e.target.value)}
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 focus:bg-white"
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
                      className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md resize-none bg-gray-50 focus:bg-white"
                      placeholder="Describe the event in detail..."
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 bg-gray-50">
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
                      importance: eventImportance,
                      category: eventCategory,
                      description: eventDescription,
                      locations: selectedLocations,
                      characters: selectedCharacters,
                    });
                    setShowAddDialog(false);
                    setEventTitle("");
                    setEventDate("");
                    setEventImportance("medium");
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
                <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
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
                    className="bg-gray-50 border-gray-300 focus:bg-white"
                  />
                </div>

                {/* Date and Importance Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <Input
                      placeholder="e.g., Year 1, Day 25"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="bg-gray-50 border-gray-300 focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Importance
                    </label>
                    <select
                      value={eventImportance}
                      onChange={(e) => setEventImportance(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
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
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => {
                    // Here you would typically update the event via API
                    console.log("Updated Event:", {
                      id: selectedEvent.id,
                      title: eventTitle,
                      date: eventDate,
                      importance: eventImportance,
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
                    setEventImportance("medium");
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
                <h2 className="text-2xl font-bold text-gray-900">Edit Event</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowEditDialog(false);
                    setSelectedEvent(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
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
                    className="bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>

                {/* Date and Importance Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date
                    </label>
                    <Input
                      placeholder="e.g., Year 1, Day 25"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      className="bg-gray-50 border-gray-300 focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Importance
                    </label>
                    <select
                      value={eventImportance}
                      onChange={(e) => setEventImportance(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
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
                    className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500 resize-none"
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
              <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
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
                  className="bg-orange-500 text-white hover:bg-orange-600"
                  onClick={() => {
                    console.log("Updated Event:", {
                      id: selectedEvent.id,
                      title: eventTitle,
                      date: eventDate,
                      importance: eventImportance,
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
                    setEventImportance("medium");
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
