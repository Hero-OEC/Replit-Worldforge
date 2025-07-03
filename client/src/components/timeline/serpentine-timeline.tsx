import React, { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Calendar, User, Eye, Swords, Lightbulb, Award, Crown, Heart, HelpCircle, Sparkles, Zap, Plane, MapPin, Users, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { TimelineEvent } from "@shared/schema";

interface TimelineEventData {
  id: number;
  title: string;
  date: string;
  importance: "high" | "medium" | "low";
  category: string;
  description: string;
  location: string;
  characters: string[];
}

interface SerpentineTimelineProps {
  filterCharacter?: string;
  filterLocation?: string;
  showEditButtons?: boolean;
  className?: string;
}

// Event type icons matching main timeline
const getEventIcon = (category: string) => {
  const iconMap: any = {
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
    Prophecy: Eye,
    Wedding: Heart,
    Other: Calendar,
  };
  return iconMap[category] || Calendar;
};

// Priority colors matching main timeline
const priorityColors = {
  high: "bg-[var(--color-500)]",
  medium: "bg-[var(--color-400)]",
  low: "bg-[var(--color-300)]",
};

export default function SerpentineTimeline({
  filterCharacter,
  filterLocation,
  showEditButtons = false,
  className = "",
}: SerpentineTimelineProps) {
  const { projectId } = useParams<{ projectId: string }>();
  
  // State for hover effects and popups
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEventData | null>(null);
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  
  // Refs for container management
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Container width for responsive layout
  const [containerWidth, setContainerWidth] = useState(1000);

  // Fetch timeline events from API
  const { data: timelineEvents = [], isLoading } = useQuery<TimelineEvent[]>({
    queryKey: [`/api/projects/${projectId}/timeline`],
    enabled: !!projectId,
    refetchOnWindowFocus: true,
    refetchInterval: 5000,
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
    if (width > 900) return 4;
    if (width > 600) return 3;
    return 2;
  };

  const eventsPerRow = getEventsPerRow(containerWidth);
  const timelineWidth = containerWidth;
  const bubbleMargin = 60; // Space from edges
  const availableWidth = timelineWidth - (bubbleMargin * 2);
  const bubbleSpacing = eventsPerRow > 1 ? availableWidth / (eventsPerRow - 1) : 0;
  const verticalSpacing = 150;
  const timelineHeight = Math.max(400, Math.ceil(dateGroups.length / eventsPerRow) * verticalSpacing + 200);

  // Calculate path points for serpentine layout
  const pathPoints: [number, number][] = [];
  dateGroups.forEach((_, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;
    
    let x, y;
    if (row % 2 === 0) {
      // Left to right
      x = eventsPerRow === 1 ? timelineWidth / 2 : bubbleMargin + (col * bubbleSpacing);
      y = 50 + row * verticalSpacing;
    } else {
      // Right to left
      x = eventsPerRow === 1 ? timelineWidth / 2 : bubbleMargin + ((eventsPerRow - 1 - col) * bubbleSpacing);
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

  // Close popup when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setHoveredEvent(null);
        setHoveredDateGroup(null);
        setPopupPosition(null);
      }
    };

    if (hoveredEvent || hoveredDateGroup) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [hoveredEvent, hoveredDateGroup]);

  if (isLoading) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-600)] mx-auto"></div>
        <p className="text-[var(--color-600)] mt-2">Loading timeline...</p>
      </div>
    );
  }

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
      <div className="py-4">
        <div
          ref={timelineRef}
          className="relative w-full"
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

            return (
              <div
                key={group.date}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{ left: x, top: y }}
              >
                {/* Event Node */}
                <div
                  className="relative"
                  onMouseEnter={(e) => {
                    const bubbleRect = e.currentTarget.getBoundingClientRect();
                    const viewportWidth = window.innerWidth;
                    const viewportHeight = window.innerHeight;

                    const popupWidth = 320;
                    const popupHeight = 250;

                    const bubbleCenterX = bubbleRect.left + (bubbleRect.width / 2);
                    const bubbleCenterY = bubbleRect.top + (bubbleRect.height / 2);

                    let finalX = bubbleCenterX;
                    const leftEdge = finalX - (popupWidth / 2);
                    const rightEdge = finalX + (popupWidth / 2);

                    if (leftEdge < 20) {
                      finalX = 20 + (popupWidth / 2);
                    } else if (rightEdge > viewportWidth - 20) {
                      finalX = viewportWidth - 20 - (popupWidth / 2);
                    }

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

                    setPopupPosition({ x: finalX, y: finalY });
                    
                    if (group.isMultiEvent) {
                      setHoveredDateGroup(group);
                    } else {
                      setHoveredEvent(group.events[0]);
                    }
                  }}
                  onMouseLeave={() => {
                    setTimeout(() => {
                      if (!popupRef.current?.matches(":hover")) {
                        setHoveredEvent(null);
                        setHoveredDateGroup(null);
                        setPopupPosition(null);
                      }
                    }, 100);
                  }}
                >
                  {group.isMultiEvent ? (
                    // Multi-event node
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
                  ) : (
                    // Single event node
                    <div
                      className={`relative cursor-pointer transform transition-all duration-200 hover:scale-105`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (showEditButtons) {
                          window.location.href = `/project/${projectId}/timeline/${group.events[0].id}`;
                        }
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
                    </div>
                  )}
                </div>
                
                {/* Event Labels - positioned below the circle */}
                <div className="absolute top-[70px] left-1/2 transform -translate-x-1/2 pointer-events-none">
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
            left: popupPosition.x - 160,
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
            // Multi-event popup matching timeline page style
            <Card className="border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow bg-[#faf9ec]">
              <div className="mb-3">
                <h3 className="font-semibold text-[var(--color-950)] text-lg mb-2">
                  {hoveredDateGroup.date}
                </h3>
                <p className="text-sm text-[var(--color-700)]">
                  {hoveredDateGroup.events.length} events on this date
                </p>
              </div>
              <div className="space-y-3">
                <div className="max-h-64 overflow-y-auto space-y-3">
                  {hoveredDateGroup.events.slice(0, 3).map((event: TimelineEventData) => {
                    const EventIcon = getEventIcon(event.category);
                    const importance = event.importance as keyof typeof priorityColors;

                    return (
                      <div
                        key={event.id}
                        className="relative p-3 rounded-lg bg-[var(--color-100)] border border-[var(--color-300)] cursor-pointer hover:bg-[var(--color-50)] transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `/project/${projectId}/timeline/${event.id}`;
                        }}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-10 h-10 ${priorityColors[importance]} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <EventIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-[var(--color-950)] mb-1">
                              {event.title}
                            </h4>
                            <p className="text-sm text-[var(--color-700)] line-clamp-2 mb-2">
                              {event.description.length > 80 
                                ? `${event.description.substring(0, 80)}...`
                                : event.description || "No description"}
                            </p>
                            {event.location && (
                              <div className="flex items-center space-x-1 text-[var(--color-600)] mb-2">
                                <MapPin className="w-3 h-3" />
                                <span className="text-xs">{event.location}</span>
                              </div>
                            )}
                            {event.characters && event.characters.length > 0 && (
                              <div className="flex items-center space-x-1 text-[var(--color-600)]">
                                <Users className="w-3 h-3" />
                                <span className="text-xs">{event.characters.join(", ")}</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `/project/${projectId}/timeline/${event.id}/edit`;
                              }}
                              className="h-7 w-7 p-0 text-[var(--color-600)] hover:text-[var(--color-700)] hover:bg-[var(--color-200)]"
                            >
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle delete action if needed
                              }}
                              className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
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
                <div className="pt-3 border-t border-[var(--color-300)] text-center">
                  <span className="text-xs text-[var(--color-600)]">
                    Click on events to edit details
                  </span>
                </div>
              </div>
            </Card>
          ) : hoveredEvent ? (
            // Single event popup - matching main timeline styling exactly
            <Card
              className="rounded-lg text-card-foreground border shadow-xl p-4 w-80 cursor-pointer hover:shadow-2xl transition-shadow bg-[#faf9ec]"
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/project/${projectId}/timeline/${hoveredEvent.id}`;
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
                  <h3 className="font-semibold text-[var(--color-950)] text-lg mb-1">
                    {hoveredEvent.title}
                  </h3>
                  <p className="text-sm text-[var(--color-700)] mb-2">
                    {hoveredEvent.date}
                  </p>
                  
                  {/* Priority and Category Badges */}
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge
                      className={`${priorityColors[hoveredEvent.importance as keyof typeof priorityColors]} text-[var(--color-50)] text-xs px-2 py-1`}
                    >
                      {hoveredEvent.importance === 'high' ? 'High Priority' : 
                       hoveredEvent.importance === 'medium' ? 'Medium Priority' : 'Low Priority'}
                    </Badge>
                    <Badge variant="outline" className="text-xs px-2 py-1">
                      {hoveredEvent.category}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-4">
                <p className="text-sm text-[var(--color-700)] leading-relaxed">
                  {hoveredEvent.description.length > 120 
                    ? `${hoveredEvent.description.substring(0, 120)}...`
                    : hoveredEvent.description}
                </p>
              </div>

              {/* Location and Characters with Icons */}
              <div className="space-y-2 mb-4">
                {hoveredEvent.location && (
                  <div className="flex items-center space-x-2 text-[var(--color-600)]">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">{hoveredEvent.location}</span>
                  </div>
                )}
                {hoveredEvent.characters && hoveredEvent.characters.length > 0 && (
                  <div className="flex items-center space-x-2 text-[var(--color-600)]">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{hoveredEvent.characters.join(", ")}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-3 border-t border-[var(--color-300)]">
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.location.href = `/project/${projectId}/timeline/${hoveredEvent.id}/edit`;
                    }}
                    className="h-8 px-3 text-[var(--color-600)] hover:text-[var(--color-700)] hover:bg-[var(--color-200)] flex items-center space-x-1"
                  >
                    <Edit className="w-3 h-3" />
                    <span className="text-xs">Edit</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle delete action if needed
                    }}
                    className="h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 flex items-center space-x-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span className="text-xs">Delete</span>
                  </Button>
                </div>
                <span
                  className="text-xs text-[var(--color-600)] hover:text-[var(--color-700)] cursor-pointer flex items-center space-x-1"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.location.href = `/project/${projectId}/timeline/${hoveredEvent.id}`;
                  }}
                >
                  <span>View details</span>
                  <ChevronRight className="w-3 h-3" />
                </span>
              </div>
            </Card>
          ) : null}
        </div>
      )}
    </div>
  );
}