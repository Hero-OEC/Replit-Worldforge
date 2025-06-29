import React, { useState, useRef, useEffect } from "react";
import {
  Star,
  Calendar,
  MapPin,
  Users,
  Edit,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const priorityColors = {
  high: "bg-[var(--color-600)]",
  medium: "bg-[var(--color-500)]",
  low: "bg-[var(--color-400)]",
};

const priorityLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
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
  // Missing categories from timeline data
  Alliance: Users,
  Artifacts: Sparkles,
  Betrayal: Swords,
  Competition: Award,
  Customs: Heart,
  Escape: Plane,
  History: Calendar,
  Institutions: Crown,
  "Magic Ritual": Sparkles,
  Preparation: Edit,
  Prophecies: Eye,
  Prophecy: Eye,
  Quest: Star,
  Religion: Heart,
  Tragedy: HelpCircle,
  "World Event": Crown,
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
  events: TimelineEventData[];
  onEventClick?: (event: TimelineEventData) => void;
  onEventEdit?: (event: TimelineEventData) => void;
  filterCharacter?: string; // Filter events by character name
  filterLocation?: string; // Filter events by location name
  showEditButtons?: boolean;
  className?: string;
}

export default function SerpentineTimeline({
  events,
  onEventClick,
  onEventEdit,
  filterCharacter,
  filterLocation,
  showEditButtons = false,
  className = "",
}: SerpentineTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEventData | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEventData | null>(null);
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

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
    if (!acc[event.date]) {
      acc[event.date] = [];
    }
    acc[event.date].push(event);
    return acc;
  }, {});

  const dateGroups = Object.entries(eventsByDate).map(([date, events]) => ({
    date,
    events: events as TimelineEventData[],
    isMultiEvent: (events as TimelineEventData[]).length > 1,
  }));

  // Calculate timeline positions for serpentine layout - fully responsive
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 400 });
  const pathPoints: number[][] = [];

  // Update timeline dimensions based on container size and events
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const availableWidth = Math.max(600, containerWidth - 64); // Min 600px, with padding
        const eventsPerRow = Math.max(3, Math.min(6, Math.floor(availableWidth / 180))); // More spacing per event
        const rows = Math.ceil(dateGroups.length / eventsPerRow);
        const calculatedHeight = Math.max(300, rows * 140 + 60); // Dynamic height based on rows
        
        setDimensions({
          width: availableWidth,
          height: calculatedHeight
        });
      }
    };

    updateDimensions();
    const timer = setTimeout(updateDimensions, 100); // Slight delay for container to render
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

  const handleEventClick = (event: TimelineEventData, x: number, y: number) => {
    setSelectedEvent(event);
    setPopupPosition({ x, y });
    onEventClick?.(event);
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
    <div ref={containerRef} className={`relative w-full ${className}`}>
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
                      (() => {
                        const IconComponent = eventTypeIcons[group.events[0].category as keyof typeof eventTypeIcons] || Star;
                        return <IconComponent className="w-5 h-5 text-[var(--color-50)]" fill="currentColor" />;
                      })()
                    )}
                  </div>

                  {/* Combined Title and Date Box - BELOW bubble with gap */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full mt-2 whitespace-nowrap">
                    <div className="px-3 py-2 rounded shadow-sm border bg-[var(--color-100)] text-center mt-2">
                      <div className="text-xs font-medium text-[var(--color-950)] truncate max-w-32">
                        {group.isMultiEvent ? `${group.events.length} Events` : group.events[0].title}
                      </div>
                      <div className="text-xs text-[var(--color-700)] mt-0.5">
                        {group.date}
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
                        <div className="space-y-2">
                          {group.events.map((event) => {
                            const IconComponent = eventTypeIcons[event.category as keyof typeof eventTypeIcons] || Calendar;
                            return (
                              <div
                                key={event.id}
                                className="flex items-center space-x-2 p-2 hover:bg-[var(--color-100)] rounded cursor-pointer"
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
            {showEditButtons && onEventEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEventEdit(selectedEvent)}
                className="text-[var(--color-700)] hover:text-[var(--color-950)]"
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
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
              <p className="text-sm text-[var(--color-700)]">{selectedEvent.description}</p>
            )}

            {selectedEvent.location && (
              <div className="flex items-center space-x-2 text-sm text-[var(--color-700)]">
                <MapPin className="w-4 h-4" />
                <span>{selectedEvent.location}</span>
              </div>
            )}

            {selectedEvent.characters && selectedEvent.characters.length > 0 && (
              <div className="flex items-start space-x-2 text-sm text-[var(--color-700)]">
                <Users className="w-4 h-4 mt-0.5" />
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

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClosePopup}
            className="absolute top-2 right-2 text-[var(--color-600)] hover:text-[var(--color-700)]"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  );
}