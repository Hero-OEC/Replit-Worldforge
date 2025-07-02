import React, { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Star,
  Users,
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
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TimelineEvent } from "@shared/schema";

// Event type icons mapping
const eventTypeIcons = {
  "Character Arc": Users,
  Plot: Star,
  World: Users,
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

export interface TimelineEventData {
  id: number;
  title: string;
  date: string;
  importance: "high" | "medium" | "low";
  category: string;
  description?: string;
  location?: string;
  characters?: string[];
}

interface SerpentineTimelineProps {
  filterCharacter?: string;
  filterLocation?: string;
  showEditButtons?: boolean;
  className?: string;
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

export default function SerpentineTimeline({
  filterCharacter,
  filterLocation,
  showEditButtons = false,
  className = "",
}: SerpentineTimelineProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventData | null>(null);
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [containerWidth, setContainerWidth] = useState(1000);
  
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Fetch timeline events from API with auto-refresh
  const { data: timelineEvents = [] } = useQuery<TimelineEvent[]>({
    queryKey: [`/api/projects/${projectId}/timeline`],
    enabled: !!projectId,
    refetchOnWindowFocus: true,
    refetchInterval: 5000, // Auto-refresh every 5 seconds
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

  const events = convertToTimelineData(timelineEvents);

  // Debug logging
  console.log('SerpentineTimeline Debug:', { 
    filterCharacter, 
    totalEvents: events.length, 
    eventsWithCharacters: events.filter(e => e.characters && e.characters.length > 0),
    allCharacters: events.map(e => e.characters).filter(c => c && c.length > 0)
  });

  // Filter events by character or location if specified
  const filteredEvents = filterCharacter
    ? events.filter(event => 
        event.characters?.includes(filterCharacter)
      )
    : filterLocation
    ? events.filter(event => 
        event.location === filterLocation
      )
    : events;

  console.log('Filtered events:', filteredEvents);

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
    events: events as TimelineEventData[],
    isMultiEvent: (events as TimelineEventData[]).length > 1,
  }));

  // Calculate responsive bubbles per row based on container width
  const getEventsPerRow = (width: number) => {
    if (width > 900) return 4; // Timeline page, location page
    if (width > 600) return 3; // Character page
    return 2; // Mobile
  };

  // Calculate timeline positions for serpentine layout - using same logic as main timeline
  const timelineWidth = Math.min(1000, containerWidth - 40);
  const eventsPerRow = getEventsPerRow(containerWidth);
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const timelineHeight = Math.max(400, rows * 80 + 100); // Same spacing as main timeline
  const pathPoints: number[][] = [];

  const horizontalSpacing = (timelineWidth - 120) / Math.max(1, eventsPerRow - 1);
  const verticalSpacing = Math.max(60, (timelineHeight - 100) / Math.max(1, rows - 1)); // Same spacing as main timeline

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
      y = 50 + row * verticalSpacing;
    } else {
      // Right to left for odd rows
      x = 60 + (eventsPerRow - 1 - col) * horizontalSpacing;
      y = 50 + row * verticalSpacing;
    }

    pathPoints.push([x, y]);
  });

  // Update container width on resize
  useEffect(() => {
    const updateContainerWidth = () => {
      if (timelineContainerRef.current) {
        setContainerWidth(timelineContainerRef.current.offsetWidth);
      }
    };

    updateContainerWidth();
    window.addEventListener('resize', updateContainerWidth);
    return () => window.removeEventListener('resize', updateContainerWidth);
  }, []);

  const handleEventClick = (event: TimelineEventData, x: number, y: number) => {
    setSelectedEvent(event);
    setPopupPosition({ x, y });
  };

  const handleClosePopup = () => {
    setSelectedEvent(null);
    setPopupPosition(null);
  };

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        handleClosePopup();
      }
    };

    if (selectedEvent) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [selectedEvent]);

  if (sortedEvents.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Calendar className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
        <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">
          {filterCharacter ? `No timeline events for ${filterCharacter}` : 
           filterLocation ? `No timeline events in ${filterLocation}` : 
           "No timeline events"}
        </h3>
        <p className="text-[var(--color-600)]">
          {filterCharacter 
            ? `${filterCharacter} doesn't appear in any timeline events yet.`
            : filterLocation
            ? `No events have taken place in ${filterLocation} yet.`
            : "Start building your story timeline by adding events."
          }
        </p>
      </div>
    );
  }

  return (
    <div ref={timelineContainerRef} className={`relative w-full ${className}`}>
      {/* Serpentine Timeline */}
      <div className="p-8 pt-[0px] pb-[0px]">
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
                      (() => {
                        const IconComponent = eventTypeIcons[group.events[0].category as keyof typeof eventTypeIcons] || Star;
                        return <IconComponent className="w-5 h-5 text-[var(--color-50)]" fill="currentColor" />;
                      })()
                    )}
                  </div>

                  {/* Combined Title and Date Box - BELOW bubble with gap */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 whitespace-nowrap">
                    <div className="px-3 py-2 rounded shadow-sm border border-[var(--color-200)] bg-[var(--color-100)] text-center mt-2">
                      <div className="text-xs font-medium text-[var(--color-950)] truncate max-w-32">
                        {group.isMultiEvent ? `${group.events.length} Events` : group.events[0].title}
                      </div>
                      <div className="text-xs text-[var(--color-700)] mt-0.5">
                        {group.date || 'No date'}
                      </div>
                    </div>
                  </div>

                  {/* Multi-event Popup */}
                  {group.isMultiEvent && isHovered && (
                    <div className="absolute bottom-24 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="rounded-lg shadow-xl border p-3 w-64 bg-[var(--color-100)]">
                        <div className="text-sm font-medium text-[var(--color-950)] mb-2">
                          Events on {group.date}
                        </div>
                        <div 
                          className="space-y-2 max-h-48 overflow-y-auto"
                          style={{ 
                            scrollbarWidth: 'thin',
                            scrollbarColor: 'var(--color-400) var(--color-100)'
                          }}
                        >
                          {group.events.map((event) => {
                            const IconComponent = eventTypeIcons[event.category as keyof typeof eventTypeIcons] || Calendar;
                            return (
                              <div
                                key={event.id}
                                className="flex items-center space-x-2 p-2 hover:bg-[var(--color-200)] rounded cursor-pointer transition-colors duration-150"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const rect = timelineRef.current?.getBoundingClientRect();
                                  if (rect) {
                                    handleEventClick(
                                      event,
                                      rect.left + x,
                                      rect.top + y - 50
                                    );
                                  }
                                }}
                              >
                                <div className={`w-3 h-3 rounded-full ${priorityColors[event.importance]}`} />
                                <IconComponent className="w-4 h-4 text-[var(--color-700)]" />
                                <span className="text-sm text-[var(--color-800)] flex-1 truncate">
                                  {event.title}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        {group.events.length > 3 && (
                          <div className="text-xs text-[var(--color-600)] mt-2 text-center">
                            Scroll to see all {group.events.length} events
                          </div>
                        )}
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
      {selectedEvent && popupPosition && (
        <div
          ref={popupRef}
          className="fixed z-50 rounded-lg shadow-2xl border p-6 w-96 bg-[var(--color-100)]"
          style={{
            left: Math.min(popupPosition.x, window.innerWidth - 400),
            top: Math.max(50, popupPosition.y - 100),
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${priorityColors[selectedEvent.importance]}`} />
              <div>
                <h3 className="font-semibold text-[var(--color-950)]">{selectedEvent.title}</h3>
                <p className="text-sm text-[var(--color-700)]">{selectedEvent.date}</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {selectedEvent.category}
              </Badge>
              <Badge 
                variant="outline" 
                className={`text-xs ${
                  selectedEvent.importance === 'high' ? 'border-[var(--color-600)] text-[var(--color-700)]' :
                  selectedEvent.importance === 'medium' ? 'border-[var(--color-400)] text-[var(--color-700)]' :
                  'border-[var(--color-400)] text-[var(--color-700)]'
                }`}
              >
                {priorityLabels[selectedEvent.importance]}
              </Badge>
            </div>

            {selectedEvent.description && (
              <p className="text-sm text-[var(--color-800)]">{selectedEvent.description}</p>
            )}

            {selectedEvent.location && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[var(--color-600)]">Location:</span>
                <span className="text-sm text-[var(--color-800)]">{selectedEvent.location}</span>
              </div>
            )}

            {selectedEvent.characters && selectedEvent.characters.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-[var(--color-600)]">Characters:</span>
                <div className="flex flex-wrap gap-1">
                  {selectedEvent.characters.map((character, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {character}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}