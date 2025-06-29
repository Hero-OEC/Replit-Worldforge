import React, { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Plus,
  Eye,
  MoreHorizontal,
  X,
  Tag as TagIcon,
  User,
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
import { Badge } from "@/components/ui/badge";
import { Tag, getTagVariant } from "@/components/ui/tag";
import type { TimelineEvent, ProjectWithStats, Character, Location } from "@shared/schema";

interface TimelineWrapperProps {
  filterType: 'character' | 'location';
  entityName: string;
  projectId: string;
  showHeader?: boolean;
  showLegend?: boolean;
}

export default function TimelineWrapper({ 
  filterType, 
  entityName, 
  projectId, 
  showHeader = false, 
  showLegend = true 
}: TimelineWrapperProps) {
  const timelineRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  
  // Queries for data
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

  // Convert database events to timeline component format
  const convertToTimelineData = (events: TimelineEvent[]) => {
    return events.map(event => {
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

  // Apply automatic filtering based on wrapper context
  const filteredEvents = timelineData.filter(event => {
    if (filterType === 'character') {
      return event.characters.includes(entityName);
    } else if (filterType === 'location') {
      return event.location === entityName;
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

  // Calculate timeline positions for serpentine layout
  const timelineWidth = Math.min(1000, containerWidth - 40);
  const eventsPerRow = getEventsPerRow(containerWidth);
  const rows = Math.ceil(dateGroups.length / eventsPerRow);
  const timelineHeight = Math.max(800, rows * 200 + 200);
  const pathPoints: number[][] = [];

  const horizontalSpacing = (timelineWidth - 120) / Math.max(1, eventsPerRow - 1);
  const verticalSpacing = Math.max(180, (timelineHeight - 200) / Math.max(1, rows - 1));

  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;

    let x, y;
    if (dateGroups.length === 1) {
      x = timelineWidth / 2;
      y = timelineHeight / 2;
    } else if (row % 2 === 0) {
      x = 60 + col * horizontalSpacing;
      y = 100 + row * verticalSpacing;
    } else {
      x = 60 + (eventsPerRow - 1 - col) * horizontalSpacing;
      y = 100 + row * verticalSpacing;
    }

    pathPoints.push([x, y]);
  });

  // Event type icons
  const eventTypeIcons: { [key: string]: any } = {
    "Character Arc": User,
    "Character Development": User,
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
    Preparation: Eye,
    Prophecies: Eye,
    Prophecy: Eye,
    Quest: Award,
    Religion: Heart,
    Tragedy: HelpCircle,
  };

  const priorityColors = {
    high: "bg-[var(--color-600)]",
    medium: "bg-[var(--color-500)]",
    low: "bg-[var(--color-400)]",
  };

  return (
    <div className="space-y-6">
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Clock className="w-5 h-5 text-[var(--color-600)]" />
            <div>
              <h3 className="text-lg font-semibold text-[var(--color-950)]">
                {filterType === 'character' ? 'Character Timeline' : 'Location Timeline'}
              </h3>
              <p className="text-sm text-[var(--color-700)]">
                Events {filterType === 'character' ? 'where ' + entityName + ' appears' : 'that occur in ' + entityName}
              </p>
            </div>
          </div>
        </div>
      )}

      {showLegend && (
        <div className="flex justify-center">
          <div className="rounded-lg p-4 shadow-sm border border-[var(--color-300)] flex items-center space-x-6 bg-[var(--color-100)]">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[var(--color-600)] rounded-full"></div>
              <span className="text-sm text-[var(--color-700)]">High Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[var(--color-500)] rounded-full"></div>
              <span className="text-sm text-[var(--color-700)]">Medium Priority</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-[var(--color-400)] rounded-full"></div>
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
      )}

      {/* Timeline Display */}
      <div ref={timelineContainerRef} className="p-8 pt-4">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-[var(--color-400)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">
              No Timeline Events
            </h3>
            <p className="text-[var(--color-700)]">
              No events found for {entityName}.
            </p>
          </div>
        ) : (
          <div
            ref={timelineRef}
            className="relative mx-auto"
            style={{ width: timelineWidth, height: timelineHeight }}
          >
            {/* Timeline Path */}
            {pathPoints.length > 1 && (
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <path
                  d={`M ${pathPoints.map(point => point.join(',')).join(' L ')}`}
                  stroke="var(--color-300)"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>
            )}

            {/* Timeline Events */}
            {dateGroups.map((dateGroup, index) => {
              const [x, y] = pathPoints[index] || [0, 0];
              const IconComponent = eventTypeIcons[dateGroup.events[0].category] || Calendar;

              return (
                <div key={dateGroup.date} className="absolute group">
                  <div
                    className="transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
                    style={{ left: x, top: y }}
                  >
                    {/* Event Circle */}
                    <div
                      className={`
                        w-16 h-16 rounded-full border-4 border-[var(--color-100)] shadow-lg
                        flex items-center justify-center transition-all duration-200
                        hover:scale-110 hover:shadow-xl relative
                        ${priorityColors[dateGroup.events[0].importance as keyof typeof priorityColors] || priorityColors.medium}
                      `}
                    >
                      {dateGroup.isMultiEvent ? (
                        <div className="text-[var(--color-50)] font-bold text-lg">
                          {dateGroup.events.length}
                        </div>
                      ) : (
                        <IconComponent className="w-6 h-6 text-[var(--color-50)]" />
                      )}
                    </div>

                    {/* Date Label */}
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                                  bg-[var(--color-100)] px-2 py-1 rounded text-xs font-medium 
                                  text-[var(--color-950)] border border-[var(--color-300)] whitespace-nowrap">
                      {dateGroup.date}
                    </div>

                    {/* Event Details Popup */}
                    <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 
                                  opacity-0 group-hover:opacity-100 transition-opacity duration-200 
                                  pointer-events-none z-10">
                      <div className="bg-[#faf9ec] border border-[var(--color-300)] rounded-lg p-4 shadow-lg 
                                    min-w-64 max-w-80">
                        {dateGroup.isMultiEvent ? (
                          <div>
                            <h4 className="font-semibold text-[var(--color-950)] mb-2">
                              {dateGroup.events.length} Events on {dateGroup.date}
                            </h4>
                            <div className="space-y-2">
                              {dateGroup.events.map((event, idx) => (
                                <div key={idx} className="border-l-2 border-[var(--color-400)] pl-3">
                                  <div className="font-medium text-[var(--color-950)]">{event.title}</div>
                                  <div className="text-sm text-[var(--color-700)]">{event.category}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div>
                            <h4 className="font-semibold text-[var(--color-950)] mb-2">
                              {dateGroup.events[0].title}
                            </h4>
                            <div className="text-sm text-[var(--color-700)] mb-2">
                              {dateGroup.events[0].description}
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {dateGroup.events[0].category}
                              </Badge>
                              {dateGroup.events[0].location && (
                                <Badge variant="outline" className="text-xs">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {dateGroup.events[0].location}
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}