import React, { useState, useRef } from "react";
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
  Edit,
  Trash2,
  Eye,
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, getTagVariant } from "@/components/ui/tag";
import Navbar from "@/components/layout/navbar";
import type { TimelineEvent, ProjectWithStats, Character, Location } from "@shared/schema";

// Priority colors for events
const priorityColors = {
  low: "bg-gray-500",
  medium: "bg-blue-500", 
  high: "bg-orange-500",
  critical: "bg-red-500",
};

// Event category icons
const eventIcons = {
  "Character Development": User,
  "Character Arc": User,
  "Plot Event": Lightbulb,
  "World Event": MapPin,
  Battle: Swords,
  Discovery: Award,
  Political: Crown,
  Personal: Heart,
  Other: HelpCircle,
};

function getEventIcon(category: string) {
  return eventIcons[category as keyof typeof eventIcons] || HelpCircle;
}

export default function Timeline() {
  const { projectId } = useParams();
  const [, navigate] = useLocation();
  const { addToHistory } = useNavigation();
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedImportance, setSelectedImportance] = useState("");
  
  // Popup states
  const [hoveredEvent, setHoveredEvent] = useState<TimelineEvent | null>(null);
  const [hoveredDateGroup, setHoveredDateGroup] = useState<any>(null);
  const [popupPosition, setPopupPosition] = useState<{x: number, y: number} | null>(null);
  
  // Refs
  const timelineRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  // Fetch timeline events
  const { data: events = [], isLoading } = useQuery({
    queryKey: ["/api/projects", projectId, "timeline"],
  });

  // Fetch characters and locations for filters
  const { data: characters = [] } = useQuery({
    queryKey: ["/api/projects", projectId, "characters"],
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/projects", projectId, "locations"], 
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)]">
        <Navbar
          title="Timeline"
          icon={<Clock className="w-5 h-5" />}
          projectId={projectId}
        />
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading timeline...</div>
        </div>
      </div>
    );
  }

  // Filter events
  const filteredEvents = events.filter((event: TimelineEvent) => {
    const matchesSearch = !searchTerm || 
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCharacter = !selectedCharacter || 
      event.characters?.includes(selectedCharacter);
    
    const matchesLocation = !selectedLocation || 
      event.location === selectedLocation;
    
    const matchesCategory = !selectedCategory || 
      event.category === selectedCategory;
    
    const matchesImportance = !selectedImportance || 
      event.importance === selectedImportance;

    return matchesSearch && matchesCharacter && matchesLocation && 
           matchesCategory && matchesImportance;
  });

  // Group events by date
  const eventGroups = filteredEvents.reduce((groups: any, event: TimelineEvent) => {
    const date = `Day ${event.date}`;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(event);
    return groups;
  }, {});

  // Convert to array and sort
  const sortedDateGroups = Object.entries(eventGroups)
    .map(([date, events]: [string, any]) => ({
      date,
      events,
      isMultiEvent: events.length > 1,
    }))
    .sort((a, b) => {
      const dayA = parseInt(a.date.replace("Day ", ""));
      const dayB = parseInt(b.date.replace("Day ", ""));
      return dayA - dayB;
    });

  // Calculate timeline layout
  const containerWidth = 800; // Fixed width for consistency
  const bubblesPerRow = 4;
  const bubbleSpacing = 50; // Reduced spacing
  const rowHeight = 150;
  
  const timelinePositions = sortedDateGroups.map((group, index) => {
    const row = Math.floor(index / bubblesPerRow);
    const col = index % bubblesPerRow;
    
    // Calculate serpentine pattern
    const isEvenRow = row % 2 === 0;
    const actualCol = isEvenRow ? col : (bubblesPerRow - 1 - col);
    
    const x = (actualCol * (containerWidth / bubblesPerRow)) + (containerWidth / bubblesPerRow / 2);
    const y = row * rowHeight + 50;
    
    return { ...group, x, y };
  });

  const totalHeight = Math.ceil(sortedDateGroups.length / bubblesPerRow) * rowHeight + 100;

  const handleBubbleHover = (group: any, x: number, y: number) => {
    if (group.isMultiEvent) {
      setHoveredDateGroup(group);
      setHoveredEvent(null);
    } else {
      setHoveredEvent(group.events[0]);
      setHoveredDateGroup(null);
    }
    
    // Simple positioning: center popup horizontally, place 50px below bubble
    setPopupPosition({
      x: x,
      y: y + 50
    });
  };

  const handleBubbleLeave = () => {
    setTimeout(() => {
      if (!popupRef.current?.matches(":hover")) {
        setHoveredEvent(null);
        setHoveredDateGroup(null);
        setPopupPosition(null);
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-bg)]">
      <Navbar
        title="Timeline"
        icon={<Clock className="w-5 h-5 group-hover:animate-spin transition-transform duration-300" />}
        projectId={projectId}
        rightContent={
          <Button
            onClick={() => {
              addToHistory("Timeline", `/project/${projectId}/timeline`);
              navigate(`/project/${projectId}/timeline/new`);
            }}
            className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        }
      />

      <div className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={selectedCharacter}
              onChange={(e) => setSelectedCharacter(e.target.value)}
              className="w-64 px-3 py-2 border rounded-lg bg-white"
            >
              <option value="">All Characters</option>
              {characters.map((char: Character) => (
                <option key={char.id} value={char.name}>{char.name}</option>
              ))}
            </select>
            
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-64 px-3 py-2 border rounded-lg bg-white"
            >
              <option value="">All Locations</option>
              {locations.map((loc: Location) => (
                <option key={loc.id} value={loc.name}>{loc.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div 
            ref={timelineRef}
            className="relative mx-auto"
            style={{ width: containerWidth, height: totalHeight }}
          >
            {/* Event bubbles */}
            {timelinePositions.map((group, index) => {
              const { x, y } = group;
              const isHovered = hoveredDateGroup === group || 
                (hoveredEvent && group.events.includes(hoveredEvent));

              return (
                <div key={index}>
                  {/* Bubble */}
                  <div
                    style={{ left: x, top: y }}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2"
                  >
                    {group.isMultiEvent ? (
                      // Multi-event bubble
                      <div
                        className={`relative cursor-pointer transform transition-all duration-200 ${
                          isHovered ? "scale-110" : "hover:scale-105"
                        }`}
                        onMouseEnter={() => handleBubbleHover(group, x, y)}
                        onMouseLeave={handleBubbleLeave}
                      >
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
                      // Single event bubble  
                      <div
                        className={`relative cursor-pointer transform transition-all duration-200 ${
                          hoveredEvent === group.events[0] ? "scale-110" : "hover:scale-105"
                        }`}
                        onMouseEnter={() => handleBubbleHover(group, x, y)}
                        onMouseLeave={handleBubbleLeave}
                      >
                        <div 
                          className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg ${
                            priorityColors[group.events[0].importance as keyof typeof priorityColors]
                          }`}
                        >
                          {(() => {
                            const EventIcon = getEventIcon(group.events[0].category);
                            return <EventIcon className="w-6 h-6 text-[var(--color-50)]" />;
                          })()}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Event label */}
                  <div
                    style={{ left: x, top: y + 50 }}
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

          {/* Hover popup */}
          {popupPosition && (
            <div
              ref={popupRef}
              className="absolute z-50"
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
                <Card className="w-80 p-4 bg-[#faf9ec] shadow-xl border border-[var(--color-300)]">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-bold text-[var(--color-950)]">
                      {hoveredDateGroup.date} - {hoveredDateGroup.events.length} Events
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 gap-3">
                    {hoveredDateGroup.events
                      .slice(0, 3)
                      .map((event: TimelineEvent, index: number) => {
                        const EventIcon = getEventIcon(event.category);
                        const importance = event.importance as keyof typeof priorityColors;

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
                              <div className={`w-8 h-8 ${priorityColors[importance]} rounded-full flex items-center justify-center flex-shrink-0`}>
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
                  </div>
                  {hoveredDateGroup.events.length > 3 && (
                    <div className="mt-3 text-xs text-[var(--color-600)] text-center">
                      +{hoveredDateGroup.events.length - 3} more events
                    </div>
                  )}
                </Card>
              ) : hoveredEvent ? (
                // Single event popup
                <Card className="w-80 p-4 bg-[#faf9ec] shadow-xl border border-[var(--color-300)]">
                  <div className="flex items-start space-x-3 mb-3">
                    <div className={`w-10 h-10 ${priorityColors[hoveredEvent.importance as keyof typeof priorityColors]} rounded-full flex items-center justify-center flex-shrink-0`}>
                      {(() => {
                        const EventIcon = getEventIcon(hoveredEvent.category);
                        return <EventIcon className="w-5 h-5 text-[var(--color-50)]" />;
                      })()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[var(--color-950)] mb-1">
                        {hoveredEvent.title}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag variant={getTagVariant("importance", hoveredEvent.importance)}>
                          {hoveredEvent.importance}
                        </Tag>
                        <Tag variant={getTagVariant("category", hoveredEvent.category)}>
                          {hoveredEvent.category}
                        </Tag>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-sm text-[var(--color-700)] mb-3 leading-relaxed">
                    {hoveredEvent.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-xs text-[var(--color-600)]">
                      {hoveredEvent.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span>{hoveredEvent.location}</span>
                        </div>
                      )}
                      {hoveredEvent.characters && hoveredEvent.characters.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{hoveredEvent.characters.length} character(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ) : null}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}