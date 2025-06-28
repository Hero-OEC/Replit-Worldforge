import React, { useState, useRef, useEffect } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import SerpentineTimeline, { TimelineEventData } from "@/components/timeline/serpentine-timeline";
import type { Character, ProjectWithStats } from "@shared/schema";

// Sample timeline events data
const sampleEvents: TimelineEventData[] = [
  {
    id: 1,
    title: "Elena's Awakening",
    date: "Year 1, Day 5",
    importance: "high",
    category: "Character Arc",
    description: "Elena discovers her true magical potential during a routine training session.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 2,
    title: "The Forbidden Library",
    date: "Year 1, Day 12",
    importance: "medium",
    category: "Discovery",
    description: "Elena and Marcus uncover ancient texts in the hidden library.",
    location: "Arcanum City",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 3,
    title: "First Encounter",
    date: "Year 1, Day 18",
    importance: "high",
    category: "Conflict",
    description: "The protagonists face their first major challenge.",
    location: "Dark Forest",
    characters: ["Elena Brightblade"],
  },
  {
    id: 4,
    title: "The Mentor's Secret",
    date: "Year 1, Day 25",
    importance: "medium",
    category: "Revelation",
    description: "A secret about Elena's mentor is revealed.",
    location: "Magic Academy",
    characters: ["Elena Brightblade", "Mentor"],
  },
  {
    id: 5,
    title: "Village Rescue",
    date: "Year 1, Day 31",
    importance: "low",
    category: "Heroic Act",
    description: "The heroes help save a village from bandits.",
    location: "Riverside Village",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 11,
    title: "Morning Council Meeting",
    date: "Year 1, Day 50",
    importance: "medium",
    category: "Political Event",
    description: "The kingdom's council meets to discuss the growing threat.",
    location: "Royal Palace",
    characters: ["Elena Brightblade", "King", "Council Members"],
  },
  {
    id: 12,
    title: "Afternoon Training",
    date: "Year 1, Day 50",
    importance: "low",
    category: "Character Arc",
    description: "Elena practices her new abilities in the training grounds.",
    location: "Training Grounds",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 13,
    title: "Evening Revelation",
    date: "Year 1, Day 50",
    importance: "high",
    category: "Revelation",
    description: "A shocking truth about Elena's heritage is revealed.",
    location: "Royal Library",
    characters: ["Elena Brightblade", "Ancient Sage"],
  },
  {
    id: 6,
    title: "Journey to the North",
    date: "Year 1, Day 78",
    importance: "medium",
    category: "Traveling",
    description: "The group begins their journey to the northern kingdoms.",
    location: "Northern Road",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 7,
    title: "The Great Battle",
    date: "Year 1, Day 71",
    importance: "high",
    category: "Battle",
    description: "A major battle that changes the course of the war.",
    location: "Battlefield",
    characters: ["Elena Brightblade", "Marcus", "Army"],
  },
  {
    id: 8,
    title: "Elemental Convergence",
    date: "Year 1, Day 90",
    importance: "medium",
    category: "Magic",
    description: "The elemental forces converge in an unprecedented way.",
    location: "Elemental Nexus",
    characters: ["Elena Brightblade"],
  },
  {
    id: 9,
    title: "The Vanishing Mist",
    date: "Year 1, Day 95",
    importance: "low",
    category: "Mystery",
    description: "A strange mist appears and disappears mysteriously.",
    location: "Misty Marshlands",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 10,
    title: "Hearts Entwined",
    date: "Year 1, Day 88",
    importance: "medium",
    category: "Romance",
    description: "A romantic subplot reaches a crucial moment.",
    location: "Garden of Stars",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 14,
    title: "Academy Exhibition",
    date: "Year 1, Day 28",
    importance: "low",
    category: "Character Arc",
    description: "Elena participates in the annual magic exhibition, showcasing her improved control over fire magic to impressed faculty.",
    location: "Magic Academy",
    characters: ["Elena Brightblade", "Marcus", "Students"],
  },
  {
    id: 15,
    title: "The Crystal Caves Expedition",
    date: "Year 1, Day 35",
    importance: "medium",
    category: "Discovery",
    description: "Elena explores the mysterious crystal caves, discovering that the crystals resonate with her magical energy in unexpected ways.",
    location: "Crystal Caves",
    characters: ["Elena Brightblade", "Marcus", "Mentor"],
  },
  {
    id: 16,
    title: "Market Day Incident",
    date: "Year 1, Day 42",
    importance: "low",
    category: "Character Arc",
    description: "Elena accidentally reveals her growing powers during a crowded market day, causing both wonder and concern among the citizens.",
    location: "Arcanum City",
    characters: ["Elena Brightblade"],
  },
  {
    id: 17,
    title: "The Sunset Harbor Departure",
    date: "Year 1, Day 55",
    importance: "medium",
    category: "Traveling",
    description: "Elena and her companions depart from Sunset Harbor on a ship bound for the northern territories, beginning their grand quest.",
    location: "Sunset Harbor",
    characters: ["Elena Brightblade", "Marcus", "Captain Storm"],
  },
  {
    id: 18,
    title: "Mountain Pass Ambush",
    date: "Year 1, Day 65",
    importance: "high",
    category: "Battle",
    description: "The party is ambushed by Lord Vex's forces in the treacherous mountain pass, forcing Elena to use her powers defensively.",
    location: "Mountain Pass",
    characters: ["Elena Brightblade", "Marcus", "Shadow Assassin"],
  },
  {
    id: 19,
    title: "Ancient Ruins Discovery",
    date: "Year 1, Day 82",
    importance: "high",
    category: "Discovery",
    description: "Elena uncovers ancient ruins that hold the key to understanding the elemental magic that flows through her bloodline.",
    location: "Ancient Ruins",
    characters: ["Elena Brightblade", "Ancient Sage"],
  },
  {
    id: 20,
    title: "Dragon Guardian's Test",
    date: "Year 1, Day 100",
    importance: "high",
    category: "Character Arc",
    description: "Elena faces the ultimate test from the ancient Dragon Guardian, proving her worthiness to wield the full power of elemental magic.",
    location: "Dragon's Lair",
    characters: ["Elena Brightblade", "Dragon Guardian"],
  },
  {
    id: 21,
    title: "Midnight Meditation",
    date: "Year 1, Day 15",
    importance: "low",
    category: "Character Arc",
    description: "Elena discovers the power of meditation while practicing late-night magic control exercises in the academy gardens.",
    location: "Magic Academy",
    characters: ["Elena Brightblade"],
  },
  {
    id: 22,
    title: "The Fire Trial",
    date: "Year 1, Day 38",
    importance: "medium",
    category: "Magic",
    description: "Elena undergoes a dangerous trial to master advanced fire magic techniques under her mentor's guidance.",
    location: "Training Grounds",
    characters: ["Elena Brightblade", "Mentor"],
  },
  {
    id: 23,
    title: "Village Festival Performance",
    date: "Year 1, Day 47",
    importance: "low",
    category: "Character Arc",
    description: "Elena performs a magical light show for the village children during the harvest festival, gaining their admiration.",
    location: "Riverside Village",
    characters: ["Elena Brightblade", "Marcus", "Village Children"],
  },
  {
    id: 24,
    title: "The Shadow's Warning",
    date: "Year 1, Day 60",
    importance: "medium",
    category: "Mystery",
    description: "A mysterious shadowy figure appears to Elena in a dream, warning her of the dangers that lie ahead on her journey.",
    location: "Dream Realm",
    characters: ["Elena Brightblade", "Shadow Figure"],
  },
  {
    id: 25,
    title: "Elemental Harmony Achievement",
    date: "Year 1, Day 85",
    importance: "high",
    category: "Magic",
    description: "Elena achieves perfect balance between fire and light magic, unlocking a new level of magical prowess.",
    location: "Elemental Nexus",
    characters: ["Elena Brightblade"],
  },
  {
    id: 26,
    title: "Marcus's Secret Revealed",
    date: "Year 1, Day 73",
    importance: "medium",
    category: "Revelation",
    description: "Marcus finally reveals his noble heritage to Elena during a quiet moment after the great battle.",
    location: "Northern Road",
    characters: ["Elena Brightblade", "Marcus"],
  },
  {
    id: 27,
    title: "The Healing of Captain Storm",
    date: "Year 1, Day 92",
    importance: "low",
    category: "Heroic Act",
    description: "Elena uses her newly mastered light magic to heal Captain Storm's battle wounds, saving his life.",
    location: "Ship's Cabin",
    characters: ["Elena Brightblade", "Captain Storm"],
  },
  {
    id: 28,
    title: "Final Confrontation with Lord Vex",
    date: "Year 1, Day 105",
    importance: "high",
    category: "Battle",
    description: "Elena faces Lord Vex in an epic final battle that will determine the fate of the kingdom.",
    location: "Dark Citadel",
    characters: ["Elena Brightblade", "Marcus", "Lord Vex"],
  },
];

// Event type icons and colors (matching main timeline page)
const priorityColors = {
  high: "bg-[var(--color-500)]",
  medium: "bg-[var(--color-400)]",
  low: "bg-[var(--color-300)]",
};

const eventTypeIcons = {
  "Character Arc": User,
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

// Character Timeline Component
function CharacterTimeline({ character }: { character: Character }) {
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [location, navigate] = useLocation();
  const { projectId } = useParams<{ projectId: string }>();

  // Filter events for this character
  const characterEvents = sampleEvents.filter(event => event.characters?.includes(character.name));

  // Sort events by date
  const sortedEvents = [...characterEvents].sort((a, b) => {
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

  // Dynamic responsive dimensions
  const [dimensions, setDimensions] = useState({ width: 800, height: 400 });

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const availableWidth = Math.max(600, containerWidth - 100); // Padding for container
        const eventsPerRow = 3; // Fixed to 3 bubbles per row for better spacing
        const rows = Math.ceil(dateGroups.length / eventsPerRow);
        const calculatedHeight = Math.max(300, rows * 180 + 120); // More vertical spacing

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

  // Calculate timeline positions for serpentine layout
  const eventsPerRow = 3; // Fixed to 3 bubbles per row
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const pathPoints: number[][] = [];

  // Create serpentine path with generous spacing
  const horizontalSpacing = dateGroups.length > 1 ? 
    Math.max(180, (dimensions.width - 120) / Math.min(eventsPerRow - 1, dateGroups.length - 1)) : 0;
  const verticalSpacing = rows > 1 ? 
    Math.max(150, (dimensions.height - 120) / (rows - 1)) : 0;

  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;

    let x, y;
    if (dateGroups.length === 1) {
      // Center single event
      x = dimensions.width / 2;
    } else if (row % 2 === 0) {
      // Left to right for even rows
      x = 60 + col * horizontalSpacing;
    } else {
      // Right to left for odd rows
      x = 60 + (eventsPerRow - 1 - col) * horizontalSpacing;
    }
    y = 60 + row * verticalSpacing;

    pathPoints.push([x, y]);
  });

  if (sortedEvents.length === 0) {
    return (
      <div className="rounded-lg p-8 shadow-sm border border-gray-200 overflow-hidden bg-[#f8f6f2]">
        <div className="flex flex-col items-center justify-center py-12">
          <Clock className="w-12 h-12 text-[var(--color-600)] mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[var(--color-700)] mb-2">No Events Found</h3>
          <p className="text-[var(--color-600)]">No timeline events have been recorded for {character.name} yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="rounded-lg p-8 shadow-sm border border-gray-200 bg-[#f8f6f2] relative">
      {/* Serpentine Timeline */}
      <div className="w-full relative">
        <div
          ref={timelineRef}
          className="relative mx-auto z-10"
          style={{ width: dimensions.width, height: dimensions.height + 250, minHeight: 500 }}
        >
          {/* Timeline Path */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
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
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  {group.isMultiEvent ? (
                    // Multi-event node
                    <div className="relative group">
                      <div
                        className={`cursor-pointer transform transition-all duration-200 ${
                          isHovered ? "scale-110" : "hover:scale-105"
                        }`}
                        onMouseEnter={(e) => {
                          setHoveredDateGroup(group);
                          setHoveredEvent(null);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setPopupPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top
                          });
                        }}
                        onMouseLeave={(e) => {
                          // Delay hiding to allow mouse to move to popup
                          setTimeout(() => {
                            if (!popupRef.current?.matches(':hover')) {
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
                    </div>
                  ) : (
                    // Single event node
                    <div className="relative group">
                      <div
                        className={`cursor-pointer transform transition-all duration-200 ${
                          hoveredEvent === group.events[0]
                            ? "scale-110"
                            : "hover:scale-105"
                        }`}
                        onMouseEnter={(e) => {
                          setHoveredEvent(group.events[0]);
                          setHoveredDateGroup(null);
                          const rect = e.currentTarget.getBoundingClientRect();
                          setPopupPosition({
                            x: rect.left + rect.width / 2,
                            y: rect.top
                          });
                        }}
                        onMouseLeave={(e) => {
                          // Delay hiding to allow mouse to move to popup
                          setTimeout(() => {
                            if (!popupRef.current?.matches(':hover')) {
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
                          className={`w-12 h-12 ${priorityColors[group.events[0].importance as keyof typeof priorityColors]} rounded-full flex items-center justify-center shadow-lg`}
                        >
                          {React.createElement(
                            eventTypeIcons[
                              group.events[0]
                                .category as keyof typeof eventTypeIcons
                            ] || Star,
                            {
                              className: "w-6 h-6 text-[var(--color-50)]",
                            },
                          )}
                        </div>


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

      {/* Hover popups - positioned absolutely with highest z-index */}
      {popupPosition && (
        <div
          ref={popupRef}
          className="absolute z-[99999]"
          style={{
            left: popupPosition.x - (containerRef.current?.getBoundingClientRect().left || 0),
            top: popupPosition.y - (containerRef.current?.getBoundingClientRect().top || 0) + 70,
            transform: "translateX(-50%)",
          }}
          onMouseEnter={() => {
            // Keep popup visible when hovering over it
          }}
          onMouseLeave={() => {
            // Immediate hide when leaving popup
            setHoveredDateGroup(null);
            setHoveredEvent(null);
            setPopupPosition(null);
          }}
        >
          {hoveredDateGroup ? (
            // Multi-event popup
            <Card
              className="bg-white border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={() => navigate(`/project/${projectId}/timeline`)}
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
                      event.importance as keyof typeof priorityColors;

                    return (
                      <div
                        key={event.id}
                        className="relative p-3 rounded-lg bg-[var(--color-100)] border cursor-pointer hover:bg-[var(--color-200)]"
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
                            <p className="text-xs text-[var(--color-700)] mt-1 line-clamp-2">
                              {event.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                {hoveredDateGroup.events.length > 3 && (
                  <div className="text-xs text-[var(--color-600)] text-center py-2">
                    +{hoveredDateGroup.events.length - 3} more events
                  </div>
                )}
              </div>
            </Card>
          ) : hoveredEvent ? (
            // Single event popup - matching main timeline exactly
            <Card
              className="bg-white border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/project/${projectId}/timeline/${hoveredEvent.id}`);
              }}
            >
              <div className="flex items-start space-x-3 mb-3">
                <div
                  className={`w-10 h-10 ${
                    priorityColors[hoveredEvent.importance as keyof typeof priorityColors]
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
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-[var(--color-950)] text-lg mb-1">
                    {hoveredEvent.title}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-[var(--color-700)] mb-2">
                    <span>{hoveredEvent.date}</span>
                    <span className="flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {hoveredEvent.location}
                    </span>
                  </div>
                  {/* Priority and Category badges */}
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full text-[var(--color-50)] ${
                      priorityColors[hoveredEvent.importance as keyof typeof priorityColors]
                    }`}>
                      {hoveredEvent.importance === 'high' ? 'High Priority' : 
                       hoveredEvent.importance === 'medium' ? 'Medium Priority' : 'Low Priority'}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-[var(--color-200)] text-gray-700">
                      {hoveredEvent.category}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                {hoveredEvent.description}
              </p>
              {hoveredEvent.characters && hoveredEvent.characters.length > 0 && (
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-[var(--color-600)]" />
                    <span className="text-xs text-[var(--color-700)] font-medium">
                      Characters:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {hoveredEvent.characters.slice(0, 3).map((char: string, index: number) => (
                        <span
                          key={index}
                          className="text-xs bg-[var(--color-200)] text-[var(--color-700)] px-2 py-1 rounded"
                        >
                          {char}
                        </span>
                      ))}
                      {hoveredEvent.characters.length > 3 && (
                        <span className="text-xs text-[var(--color-600)]">
                          +{hoveredEvent.characters.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}
              <div className="mt-3 text-center">
                <span className="text-xs text-[var(--color-600)]">Click to view event</span>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}

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
  const [location, navigate] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [characterImage, setCharacterImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedPowerSystems, setSelectedPowerSystems] = useState<string[]>([]);
  const { goBack } = useNavigation();
  const [characterMagicSystems, setCharacterMagicSystems] = useState<any[]>([]);

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
    image: undefined
  };

  // Get character magic systems - using static character ID to prevent infinite loop
  useEffect(() => {
    const characterId = 1; // Static ID to prevent infinite loop
    setCharacterMagicSystems([]);
    fetch(`/api/characters/${characterId}/magic-systems`)
      .then(res => res.json())
      .then(data => {
        setCharacterMagicSystems(data || []);
      })
      .catch(err => {
        console.error('Error fetching character magic systems:', err);
        setCharacterMagicSystems([]);
      });
  }, []); // Empty dependency array since we're using static ID

  // Initialize power systems when character magic systems load
  useEffect(() => {
    const systemNames = characterMagicSystems.map((cms: any) => cms.magicSystem.name);
    setSelectedPowerSystems(systemNames);
  }, [characterMagicSystems]);

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
                className="text-[var(--color-700)] hover:text-[var(--color-950)]"
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
                        value={characterData.age || character.age}
                        onChange={(e) => setCharacterData({...characterData, age: e.target.value})}
                        className="w-20 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                        placeholder="22"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-[var(--color-200)] px-3 py-1 rounded-md">{character.age}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-gray-700">Race:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.race || character.race}
                        onChange={(e) => setCharacterData({...characterData, race: e.target.value})}
                        className="w-24 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                        placeholder="Human"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-[var(--color-200)] px-3 py-1 rounded-md border border-gray-300">{character.race}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3 border-b border-[var(--color-300)]">
                    <span className="text-sm font-medium text-gray-700">Class:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.class || character.class}
                        onChange={(e) => setCharacterData({...characterData, class: e.target.value})}
                        className="w-24 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                        placeholder="Mage"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 bg-[var(--color-200)] px-3 py-1 rounded-md">{character.class}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center py-3">
                    <span className="text-sm font-medium text-gray-700">Current Location:</span>
                    {isEditing ? (
                      <Input
                        value={characterData.location || character.location}
                        onChange={(e) => setCharacterData({...characterData, location: e.target.value})}
                        className="w-32 h-8 text-sm text-right bg-[var(--color-100)] border-gray-300 focus:bg-[var(--color-50)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-[var(--color-500)]"
                        placeholder="Arcanum City"
                      />
                    ) : (
                      <WouterLink href={`/project/${projectId}/locations/1`}>
                        <span className="text-sm font-medium text-gray-800 bg-[var(--color-200)] px-3 py-1 rounded-md cursor-pointer hover:bg-[var(--color-300)] transition-colors">{(() => {
                          // Get the character's most recent event location
                          const characterEvents = sampleEvents.filter(event => event.characters?.includes(character.name));
                          const sortedEvents = [...characterEvents].sort((a, b) => {
                            const getDateNumber = (dateStr: string) => {
                              const match = dateStr.match(/Day (\d+)/);
                              return match ? parseInt(match[1]) : 0;
                            };
                            return getDateNumber(b.date) - getDateNumber(a.date); // Sort descending for latest first
                          });
                          return sortedEvents.length > 0 ? sortedEvents[0].location : character.location;
                        })()}</span>
                      </WouterLink>
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
                  <Card className="border border-[var(--color-300)] p-6"
                    style={{ backgroundColor: 'var(--worldforge-card)' }}>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Brief Description</h3>
                        {isEditing ? (
                          <textarea
                            value={characterData.description || character.description}
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
                            value={characterData.personality || character.personality}
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
                          />
                        ) : selectedPowerSystems.length > 0 ? (
                          <div className="grid grid-cols-1 gap-3">
                            {selectedPowerSystems.map((systemName, index) => {
                              const system = powerSystems.find(s => s.name === systemName);
                              const CategoryIcon = getCategoryIcon(system?.category || "magic");
                              const colorClass = getCategoryColor(system?.category || "magic");
                              const borderColorClass = getCategoryBorderColor(system?.category || "magic");

                              return (
                                <WouterLink key={index} href={`/project/${projectId}/magic-systems`}>
                                  <div className={`p-4 ${colorClass} rounded-lg border ${borderColorClass} cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]`}>
                                    <div className="flex items-start space-x-3">
                                      <div className="flex-shrink-0">
                                        <CategoryIcon className="w-6 h-6" />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <h4 className="text-base font-semibold mb-1">
                                          {system?.title || systemName}
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
                          value={characterData.appearance || character.appearance}
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
                          value={characterData.backstory || character.backstory}
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
                        value={characterData.weapons || character.weapons}
                        onChange={(e) => setCharacterData({...characterData, weapons: e.target.value})}
                        className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none bg-[var(--color-100)] focus:bg-[var(--color-50)]"
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
                          <p className="text-sm text-[var(--color-700)]">
                            Events where {character.name} appears throughout the story
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      <div className="border border-[var(--color-300)] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[var(--color-400)] bg-[#f8f6f2]">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                            <Clock className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-blue-600 mb-1">
                              {sampleEvents.filter(e => e.characters?.includes(character.name)).length}
                            </div>
                            <div className="text-sm text-[var(--color-700)] font-medium">
                              Total Events
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border border-[var(--color-300)] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[var(--color-400)] bg-[#f8f6f2]">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-[var(--color-500)] to-[var(--color-600)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                            <Star className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-[var(--color-950)] mb-1">
                              {sampleEvents.filter(e => e.characters?.includes(character.name) && e.importance === "high").length}
                            </div>
                            <div className="text-sm text-[var(--color-700)] font-medium">
                              High Priority
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="border border-[var(--color-300)] rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:border-[var(--color-400)] bg-[#f8f6f2]">
                        <div className="flex items-center justify-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group">
                            <Users className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-purple-600 mb-1">
                              {sampleEvents.filter(e => e.characters?.includes(character.name) && e.category === "Character Arc").length}
                            </div>
                            <div className="text-sm text-[var(--color-700)] font-medium">
                              Character Events
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="flex justify-center">
                      <div className="rounded-lg p-4 shadow-sm border border-[var(--color-300)] flex items-center space-x-6 bg-[#f8f6f2]">
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-[var(--color-500)] rounded-full"></div>
                          <span className="text-sm text-[var(--color-700)]">High Priority</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 bg-[var(--color-400)] rounded-full"></div>
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

                    {/* Timeline Container - inline implementation */}
                    <CharacterTimeline character={character} />
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