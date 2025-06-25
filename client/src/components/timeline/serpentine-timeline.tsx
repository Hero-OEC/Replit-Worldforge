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
  showEditButtons?: boolean;
  className?: string;
}

export default function SerpentineTimeline({
  events,
  onEventClick,
  onEventEdit,
  filterCharacter,
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

  // Filter events by character if specified
  const filteredEvents = filterCharacter
    ? events.filter(event => 
        event.characters?.includes(filterCharacter)
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

  // Calculate timeline positions for serpentine layout
  const timelineWidth = 1200;
  const timelineHeight = Math.max(400, Math.ceil(dateGroups.length / 6) * 120);
  const pathPoints: number[][] = [];

  // Create serpentine path - 6 events per row, alternating direction
  const eventsPerRow = 6;
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const horizontalSpacing = dateGroups.length > 1 ? (timelineWidth - 120) / Math.min(eventsPerRow - 1, dateGroups.length - 1) : 0;
  const verticalSpacing = rows > 1 ? (timelineHeight - 120) / (rows - 1) : 0;

  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;

    let x, y;
    if (dateGroups.length === 1) {
      // Center single event
      x = timelineWidth / 2;
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
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {filterCharacter ? `No timeline events for ${filterCharacter}` : "No timeline events"}
        </h3>
        <p className="text-gray-500">
          {filterCharacter 
            ? `${filterCharacter} doesn't appear in any timeline events yet.`
            : "Start building your story timeline by adding events."
          }
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Timeline Container */}
      <div className="p-8 bg-white rounded-lg border border-gray-200">
        <div
          ref={timelineRef}
          className="relative mx-auto"
          style={{ width: Math.min(timelineWidth, 1200), height: timelineHeight }}
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
                    className={`w-12 h-12 rounded-full border-4 border-orange-300 flex items-center justify-center shadow-lg transition-all duration-200 ${
                      group.isMultiEvent
                        ? "bg-gradient-to-br from-orange-400 to-red-400"
                        : importanceColors[group.events[0].importance]
                    } ${isHovered ? "shadow-xl border-orange-400" : ""}`}
                  >
                    {group.isMultiEvent ? (
                      <span className="text-white font-bold text-sm">
                        {group.events.length}
                      </span>
                    ) : (
                      <Star className="w-5 h-5 text-white" fill="currentColor" />
                    )}
                  </div>

                  {/* Date Label */}
                  <div className="absolute top-14 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="bg-white px-2 py-1 rounded shadow-sm border text-xs font-medium text-gray-700">
                      {group.date}
                    </div>
                  </div>

                  {/* Multi-event Popup */}
                  {group.isMultiEvent && isHovered && (
                    <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-white rounded-lg shadow-xl border p-3 w-64">
                        <div className="text-sm font-medium text-gray-900 mb-2">
                          Events on {group.date}
                        </div>
                        <div className="space-y-2">
                          {group.events.map((event) => {
                            const IconComponent = eventTypeIcons[event.category as keyof typeof eventTypeIcons] || Calendar;
                            return (
                              <div
                                key={event.id}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
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
                                <div className={`w-3 h-3 rounded-full ${importanceColors[event.importance]}`} />
                                <IconComponent className="w-4 h-4 text-gray-600" />
                                <span className="text-sm text-gray-800 flex-1 truncate">
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
          className="fixed z-50 bg-white rounded-lg shadow-2xl border p-6 w-96"
          style={{
            left: Math.min(popupPosition.x, window.innerWidth - 400),
            top: Math.max(50, popupPosition.y - 100),
          }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className={`w-3 h-3 rounded-full ${importanceColors[selectedEvent.importance]}`} />
              <div>
                <h3 className="font-semibold text-gray-900">{selectedEvent.title}</h3>
                <p className="text-sm text-gray-600">{selectedEvent.date}</p>
              </div>
            </div>
            {showEditButtons && onEventEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEventEdit(selectedEvent)}
                className="text-gray-600 hover:text-gray-900"
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
                  selectedEvent.importance === 'high' ? 'border-red-300 text-red-700' :
                  selectedEvent.importance === 'medium' ? 'border-orange-300 text-orange-700' :
                  'border-yellow-300 text-yellow-700'
                }`}
              >
                {importanceLabels[selectedEvent.importance]}
              </Badge>
            </div>

            {selectedEvent.description && (
              <p className="text-sm text-gray-700">{selectedEvent.description}</p>
            )}

            {selectedEvent.location && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>{selectedEvent.location}</span>
              </div>
            )}

            {selectedEvent.characters && selectedEvent.characters.length > 0 && (
              <div className="flex items-start space-x-2 text-sm text-gray-600">
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
            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          >
            ×
          </Button>
        </div>
      )}
    </div>
  );
}