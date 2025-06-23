import React, { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Star, Calendar, MapPin, Users, Edit, MoreHorizontal, User, Eye, Swords, Lightbulb, Award, Crown, Heart, HelpCircle, Sparkles, Zap, Plane, X, ChevronLeft, ChevronRight, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import type { TimelineEvent, ProjectWithStats } from "@shared/schema";

// Sample data for autocomplete
const sampleLocations = [
  "Arcanum City", "Dark Forest", "Magic Academy", "Riverside Village", 
  "Northern Road", "Battlefield", "Elemental Nexus", "Misty Marshlands", 
  "Garden of Stars", "Royal Palace", "Training Grounds", "Royal Library",
  "Ancient Ruins", "Crystal Caves", "Sunset Harbor", "Mountain Pass"
];

const sampleCharacters = [
  "Elena", "Marcus", "Mentor", "King", "Ancient Sage", "Council Members",
  "Army", "Lord Vex", "Princess Aria", "Captain Storm", "Wise Oracle",
  "Shadow Assassin", "Dragon Guardian", "Village Elder"
];

// Tag Search Component
interface TagSearchProps {
  items: string[];
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSelect: (item: string) => void;
}

function TagSearch({ items, placeholder, value, onChange, onSelect }: TagSearchProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredItems, setFilteredItems] = useState<string[]>([]);
  
  useEffect(() => {
    if (value) {
      const filtered = items.filter(item => 
        item.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredItems(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredItems([]);
      setIsOpen(false);
    }
  }, [value, items]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSelectItem = (item: string) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={handleInputChange}
        onFocus={() => {
          if (filteredItems.length > 0) setIsOpen(true);
        }}
      />
      {isOpen && filteredItems.length > 0 && (
        <div className="absolute z-10 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
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
  );
}

const importanceColors = {
  high: "bg-red-500",
  medium: "bg-orange-500", 
  low: "bg-yellow-500"
};

const importanceLabels = {
  high: "High Importance",
  medium: "Medium Importance",
  low: "Low Importance"
};

const eventTypeIcons = {
  "Character Development": User,
  "Discovery": Eye,
  "Conflict": Swords,
  "Revelation": Lightbulb,
  "Heroic Act": Award,
  "Political Event": Crown,
  "Romance": Heart,
  "Mystery": HelpCircle,
  "Magic": Sparkles,
  "Battle": Zap,
  "Traveling": Plane
};

// Sample timeline events for demonstration with multi-event date
const sampleEvents = [
  { id: 1, title: "Elena's Awakening", date: "Year 1, Day 5", importance: "high", category: "Character Development", description: "Elena discovers her true magical potential during a routine training session.", location: "Arcanum City", characters: ["Elena", "Marcus"] },
  { id: 2, title: "The Forbidden Library", date: "Year 1, Day 12", importance: "medium", category: "Discovery", description: "Elena and Marcus uncover ancient texts in the hidden library.", location: "Arcanum City", characters: ["Elena", "Marcus"] },
  { id: 3, title: "First Encounter", date: "Year 1, Day 18", importance: "high", category: "Conflict", description: "The protagonists face their first major challenge.", location: "Dark Forest", characters: ["Elena"] },
  { id: 4, title: "The Mentor's Secret", date: "Year 1, Day 25", importance: "medium", category: "Revelation", description: "A secret about Elena's mentor is revealed.", location: "Magic Academy", characters: ["Elena", "Mentor"] },
  { id: 5, title: "Village Rescue", date: "Year 1, Day 31", importance: "low", category: "Heroic Act", description: "The heroes help save a village from bandits.", location: "Riverside Village", characters: ["Elena", "Marcus"] },
  // Multi-event date example
  { id: 11, title: "Morning Council Meeting", date: "Year 1, Day 50", importance: "medium", category: "Political Event", description: "The kingdom's council meets to discuss the growing threat.", location: "Royal Palace", characters: ["Elena", "King", "Council Members"] },
  { id: 12, title: "Afternoon Training", date: "Year 1, Day 50", importance: "low", category: "Character Development", description: "Elena practices her new abilities in the training grounds.", location: "Training Grounds", characters: ["Elena", "Marcus"] },
  { id: 13, title: "Evening Revelation", date: "Year 1, Day 50", importance: "high", category: "Revelation", description: "A shocking truth about Elena's heritage is revealed.", location: "Royal Library", characters: ["Elena", "Ancient Sage"] },
  { id: 6, title: "Journey to the North", date: "Year 1, Day 78", importance: "medium", category: "Traveling", description: "The group begins their journey to the northern kingdoms.", location: "Northern Road", characters: ["Elena", "Marcus"] },
  { id: 7, title: "The Great Battle", date: "Year 1, Day 71", importance: "high", category: "Battle", description: "A major battle that changes the course of the war.", location: "Battlefield", characters: ["Elena", "Marcus", "Army"] },
  { id: 8, title: "Elemental Convergence", date: "Year 1, Day 90", importance: "medium", category: "Magic", description: "The elemental forces converge in an unprecedented way.", location: "Elemental Nexus", characters: ["Elena"] },
  { id: 9, title: "The Vanishing Mist", date: "Year 1, Day 95", importance: "low", category: "Mystery", description: "A strange mist appears and disappears mysteriously.", location: "Misty Marshlands", characters: ["Elena", "Marcus"] },
  { id: 10, title: "Hearts Entwined", date: "Year 1, Day 88", importance: "medium", category: "Romance", description: "A romantic subplot reaches a crucial moment.", location: "Garden of Stars", characters: ["Elena", "Marcus"] },
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
  const [popupPosition, setPopupPosition] = useState<{ x: number; y: number } | null>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  
  // Form state for add/edit dialogs
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventImportance, setEventImportance] = useState("medium");
  const [eventCategory, setEventCategory] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventCharacters, setEventCharacters] = useState("");

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
    isMultiEvent: (events as any[]).length > 1
  }));

  // Calculate timeline positions
  const timelineWidth = 1200;
  const timelineHeight = 600;
  const pathPoints: number[][] = [];

  // Create serpentine path
  const rows = 4;
  const eventsPerRow = Math.ceil(dateGroups.length / rows);
  
  dateGroups.forEach((group, index) => {
    const row = Math.floor(index / eventsPerRow);
    const col = index % eventsPerRow;
    
    let x, y;
    if (row % 2 === 0) {
      // Left to right
      x = (col / (eventsPerRow - 1)) * (timelineWidth - 100) + 50;
    } else {
      // Right to left
      x = ((eventsPerRow - 1 - col) / (eventsPerRow - 1)) * (timelineWidth - 100) + 50;
    }
    y = (row / (rows - 1)) * (timelineHeight - 100) + 50;
    
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
          <Button onClick={() => setShowAddDialog(true)} className="bg-orange-500 text-white hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Event
          </Button>
        }
      />

      <main className="p-8 overflow-x-auto">
        <div className="max-w-6xl mx-auto">
          {/* Header with Overview */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Timeline</h1>
                  <p className="text-gray-600">Track and organize story events chronologically</p>
                </div>
              </div>
              
              {/* Timeline Overview Stats */}
              <div className="bg-[var(--worldforge-card)] border border-[var(--border)] rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">Timeline Overview</h3>
                <p className="text-gray-600 mb-3 text-center text-sm">
                  Serpentine timeline shows chronological progression. Hover to see details, click to edit.
                </p>
                <div className="flex justify-center space-x-6 text-sm text-gray-600">
                  <div className="text-center">
                    <div className="text-xl font-bold text-gray-900">{sampleEvents.length}</div>
                    <div>Total Events</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-red-600">{sampleEvents.filter(e => e.importance === 'high').length}</div>
                    <div>High Priority</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-600">{sampleEvents.filter(e => e.category === 'Character Development').length}</div>
                    <div>Character Events</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Serpentine Timeline */}
          <div className="bg-[var(--worldforge-card)] border border-[var(--border)] rounded-lg p-8 shadow-sm">
            <div 
              ref={timelineRef}
              className="relative mx-auto"
              style={{ width: timelineWidth, height: timelineHeight }}
            >
              {/* Timeline Path */}
              <svg className="absolute inset-0 w-full h-full">
                <path
                  d={`M ${pathPoints.map(point => point.join(',')).join(' L ')}`}
                  stroke="#e5e7eb"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="5,5"
                />
              </svg>

              {/* Event Nodes */}
              {dateGroups.map((group, index) => {
                const [x, y] = pathPoints[index];
                const isHovered = hoveredDateGroup === group;
                
                return (
                  <div key={group.date} className="absolute transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      style={{ left: x, top: y }}
                      className="absolute transform -translate-x-1/2 -translate-y-1/2"
                    >
                      {group.isMultiEvent ? (
                        // Multi-event node
                        <div
                          className={`relative cursor-pointer transform transition-all duration-200 ${
                            isHovered ? 'scale-110' : 'hover:scale-105'
                          }`}
                          onMouseEnter={(e) => {
                            setHoveredDateGroup(group);
                            const rect = e.currentTarget.getBoundingClientRect();
                            setPopupPosition({
                              x: rect.left + rect.width / 2,
                              y: rect.top - 10
                            });
                          }}
                          onMouseLeave={() => {
                            setHoveredDateGroup(null);
                            setPopupPosition(null);
                          }}
                        >
                          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">{group.events.length}</span>
                          </div>
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow">
                              {group.date}
                            </span>
                          </div>
                        </div>
                      ) : (
                        // Single event node
                        <div
                          className={`relative cursor-pointer transform transition-all duration-200 ${
                            hoveredEvent === group.events[0] ? 'scale-110' : 'hover:scale-105'
                          }`}
                          onMouseEnter={() => setHoveredEvent(group.events[0])}
                          onMouseLeave={() => setHoveredEvent(null)}
                          onClick={() => setSelectedEvent(group.events[0])}
                        >
                          <div className={`w-10 h-10 ${importanceColors[group.events[0].importance as keyof typeof importanceColors]} rounded-full flex items-center justify-center shadow-lg`}>
                            {React.createElement(eventTypeIcons[group.events[0].category as keyof typeof eventTypeIcons] || Star, {
                              className: "w-5 h-5 text-white"
                            })}
                          </div>
                          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                            <span className="text-xs font-medium text-gray-700 bg-white px-2 py-1 rounded shadow">
                              {group.date}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Multi-event hover popup */}
          {hoveredDateGroup && hoveredDateGroup.isMultiEvent && popupPosition && (
            <div 
              className="fixed z-50 pointer-events-none"
              style={{ 
                left: popupPosition.x,
                top: popupPosition.y,
                transform: 'translateX(-50%) translateY(-100%)'
              }}
            >
              <Card className="bg-white border shadow-xl p-4 w-80">
                <div className="mb-3">
                  <h3 className="font-semibold text-gray-900 text-lg mb-2">{hoveredDateGroup.date}</h3>
                  <p className="text-sm text-gray-600">{hoveredDateGroup.events.length} events on this date</p>
                </div>
                
                <div className="space-y-3 max-h-64">
                  {hoveredDateGroup.events.map((event: any, index: number) => {
                    const EventIcon = eventTypeIcons[event.category as keyof typeof eventTypeIcons] || Star;
                    const importance = event.importance as keyof typeof importanceColors;
                    
                    return (
                      <div
                        key={event.id}
                        className={`relative p-3 rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors ${
                          hoveredEvent === event ? 'ring-2 ring-orange-300' : ''
                        }`}
                        onMouseEnter={() => setHoveredEvent(event)}
                        onMouseLeave={() => setHoveredEvent(null)}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-8 h-8 ${importanceColors[importance]} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <EventIcon className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 text-sm">{event.title}</h4>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">{event.description}</p>
                            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <MapPin className="w-3 h-3" />
                                <span>{event.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Users className="w-3 h-3" />
                                <span>{event.characters.join(', ')}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {hoveredEvent === event && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                <div className="mt-4 pt-3 border-t border-gray-200 text-center">
                  <span className="text-xs text-gray-500">Click on any event to view details</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Add Event Dialog */}
      {showAddDialog && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddDialog(false);
            }
          }}
        >
          <Card className="bg-white w-full max-w-4xl max-h-[85vh] overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                    <Input 
                      placeholder="Enter event title..." 
                      value={eventTitle}
                      onChange={(e) => setEventTitle(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                      <Input 
                        placeholder="Year 1, Day 1" 
                        value={eventDate}
                        onChange={(e) => setEventDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                      <select 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
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
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <Input 
                      placeholder="e.g., Character Development, Discovery..." 
                      value={eventCategory}
                      onChange={(e) => setEventCategory(e.target.value)}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <TagSearch
                      items={sampleLocations}
                      placeholder="Search or enter location..."
                      value={eventLocation}
                      onChange={setEventLocation}
                      onSelect={setEventLocation}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Characters</label>
                    <TagSearch
                      items={sampleCharacters}
                      placeholder="Search or enter characters..."
                      value={eventCharacters}
                      onChange={setEventCharacters}
                      onSelect={(char) => {
                        if (eventCharacters) {
                          setEventCharacters(eventCharacters + ", " + char);
                        } else {
                          setEventCharacters(char);
                        }
                      }}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea 
                      className="w-full h-64 px-3 py-2 border border-gray-300 rounded-md resize-none"
                      placeholder="Describe the event in detail..."
                      value={eventDescription}
                      onChange={(e) => setEventDescription(e.target.value)}
                    />
                  </div>
                  
                  <div className="flex justify-end space-x-3 pt-4">
                    <Button variant="outline" onClick={() => setShowAddDialog(false)}>
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
                          location: eventLocation,
                          characters: eventCharacters
                        });
                        setShowAddDialog(false);
                        setEventTitle("");
                        setEventDate("");
                        setEventImportance("medium");
                        setEventCategory("");
                        setEventDescription("");
                        setEventLocation("");
                        setEventCharacters("");
                      }}
                    >
                      Add Event
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}