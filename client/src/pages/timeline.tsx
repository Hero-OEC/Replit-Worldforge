import { useState, useRef, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Star, Calendar, MapPin, Users, Edit, MoreHorizontal, User, Eye, Swords, Lightbulb, Award, Crown, Heart, HelpCircle, Sparkles, Zap, Plane, X, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import type { TimelineEvent, ProjectWithStats } from "@shared/schema";

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

// Sample timeline events for demonstration
const sampleEvents = [
  { id: 1, title: "Elena's Awakening", date: "Year 1, Day 5", importance: "high", category: "Character Development", description: "Elena discovers her true magical potential during a routine training session.", location: "Arcanum City", characters: ["Elena", "Marcus"] },
  { id: 2, title: "The Forbidden Library", date: "Year 1, Day 12", importance: "medium", category: "Discovery", description: "Elena and Marcus uncover ancient texts in the hidden library.", location: "Arcanum City", characters: ["Elena", "Marcus"] },
  { id: 3, title: "First Encounter", date: "Year 1, Day 18", importance: "high", category: "Conflict", description: "The protagonists face their first major challenge.", location: "Dark Forest", characters: ["Elena"] },
  { id: 4, title: "The Mentor's Secret", date: "Year 1, Day 25", importance: "medium", category: "Revelation", description: "A secret about Elena's mentor is revealed.", location: "Magic Academy", characters: ["Elena", "Mentor"] },
  { id: 5, title: "Village Rescue", date: "Year 1, Day 31", importance: "low", category: "Heroic Act", description: "The heroes help save a village from bandits.", location: "Riverside Village", characters: ["Elena", "Marcus"] },
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
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [currentSearchIndex, setCurrentSearchIndex] = useState(0);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const timelineRef = useRef<HTMLDivElement>(null);

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim()) {
      const results = sampleEvents.filter(event => 
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.characters.some(char => char.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setSearchResults(results);
      setCurrentSearchIndex(0);
    } else {
      setSearchResults([]);
      setCurrentSearchIndex(0);
    }
  }, [searchTerm]);

  const scrollToEvent = (eventId: number) => {
    const element = document.getElementById(`event-${eventId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Highlight the event temporarily with circular highlight
      element.classList.add('animate-bounce');
      const circle = element.querySelector('.event-circle');
      if (circle) {
        circle.classList.add('ring-4', 'ring-orange-400', 'ring-opacity-75', 'scale-125');
        setTimeout(() => {
          circle.classList.remove('ring-4', 'ring-orange-400', 'ring-opacity-75', 'scale-125');
          element.classList.remove('animate-bounce');
        }, 3000);
      }
    }
  };

  const handleSearchNavigation = (direction: 'next' | 'prev') => {
    if (searchResults.length === 0) return;
    
    let newIndex = currentSearchIndex;
    if (direction === 'next') {
      newIndex = (currentSearchIndex + 1) % searchResults.length;
    } else {
      newIndex = currentSearchIndex === 0 ? searchResults.length - 1 : currentSearchIndex - 1;
    }
    
    setCurrentSearchIndex(newIndex);
    scrollToEvent(searchResults[newIndex].id);
  };

  // Create serpentine path coordinates
  const createSerpentinePath = (events: any[]) => {
    const pathPoints = [];
    const containerWidth = 1200;
    const rowHeight = 150;
    const eventsPerRow = 5;
    
    events.forEach((event, index) => {
      const row = Math.floor(index / eventsPerRow);
      const col = index % eventsPerRow;
      const isEvenRow = row % 2 === 0;
      
      const x = isEvenRow ? 
        (col * (containerWidth / (eventsPerRow - 1))) :
        ((eventsPerRow - 1 - col) * (containerWidth / (eventsPerRow - 1)));
      const y = row * rowHeight + 100;
      
      pathPoints.push({ x, y, event: { ...event, index } });
    });
    
    return pathPoints;
  };

  const pathPoints = createSerpentinePath(sampleEvents);

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search events..."
        onSearch={setSearchTerm}
        rightContent={
          <div className="flex items-center space-x-4">
            {searchResults.length > 0 && (
              <div className="flex items-center space-x-1 text-sm text-gray-600">
                <span>{currentSearchIndex + 1}/{searchResults.length}</span>
                <button
                  onClick={() => handleSearchNavigation('prev')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronLeft className="w-3 h-3" />
                </button>
                <button
                  onClick={() => handleSearchNavigation('next')}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            )}
            
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button 
              className="bg-orange-500 text-white hover:bg-orange-600"
              onClick={() => setShowAddDialog(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        }
      />

      <main className="p-8 overflow-x-auto">
        {/* Legend */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-6 bg-[var(--worldforge-card)] px-6 py-3 rounded-lg border border-[var(--border)]">
            {Object.entries(importanceColors).map(([level, color]) => (
              <div key={level} className="flex items-center space-x-2">
                <div className={`w-3 h-3 ${color} rounded-full`}></div>
                <span className="text-sm text-gray-600">{importanceLabels[level as keyof typeof importanceLabels]}</span>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
              <span className="text-sm text-gray-600">Multiple Events</span>
            </div>
          </div>
        </div>

        {/* Timeline Container */}
        <div className="relative" style={{ width: '1200px', height: '600px', margin: '0 auto' }}>
          {/* SVG Path */}
          <svg className="absolute inset-0 pointer-events-none" style={{ width: '100%', height: '100%' }}>
            <defs>
              <linearGradient id="timelineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" style={{ stopColor: '#D97706', stopOpacity: 0.8 }} />
                <stop offset="100%" style={{ stopColor: '#EA580C', stopOpacity: 0.8 }} />
              </linearGradient>
            </defs>
            <path
              d={`M ${pathPoints.map((point, index) => 
                index === 0 ? `${point.x} ${point.y}` : `L ${point.x} ${point.y}`
              ).join(' ')}`}
              stroke="url(#timelineGradient)"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
            />
          </svg>

          {/* Timeline Events */}
          {pathPoints.map((point, index) => {
            const event = point.event;
            const importance = event.importance as keyof typeof importanceColors;
            const EventIcon = eventTypeIcons[event.category as keyof typeof eventTypeIcons] || Star;
            
            return (
              <div
                key={event.id}
                id={`event-${event.id}`}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10 transition-all duration-300"
                style={{ left: point.x, top: point.y }}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEditDialog(true);
                }}
              >
                {/* Event Circle */}
                <div className={`event-circle w-12 h-12 ${importanceColors[importance]} rounded-full flex items-center justify-center shadow-lg hover:scale-125 transition-all duration-300 hover:shadow-xl relative`}>
                  <EventIcon className="w-6 h-6 text-white" />
                  
                  {/* Event number */}
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white text-xs rounded-full flex items-center justify-center">
                    {index + 1}
                  </div>
                </div>

                {/* Event Label */}
                <div className="absolute top-16 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                  <div className="bg-[var(--worldforge-card)] px-3 py-2 rounded-lg shadow-sm border border-[var(--border)]">
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-600">{event.date}</p>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Hover Card */}
          {hoveredEvent && (
            <div 
              className="absolute z-50 pointer-events-auto" 
              style={{ 
                left: Math.max(20, Math.min(pathPoints.find(p => p.event.id === hoveredEvent.id)?.x || 0, 880)) - 160, 
                top: (pathPoints.find(p => p.event.id === hoveredEvent.id)?.y || 0) > 300 ? 
                  (pathPoints.find(p => p.event.id === hoveredEvent.id)?.y || 0) - 200 : 
                  (pathPoints.find(p => p.event.id === hoveredEvent.id)?.y || 0) + 80 
              }}
              onMouseEnter={() => setHoveredEvent(hoveredEvent)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <Card className="bg-white border border-[var(--border)] p-4 shadow-lg w-80 cursor-pointer hover:shadow-xl transition-shadow"
                    onClick={() => {
                      setSelectedEvent(hoveredEvent);
                      setShowEditDialog(true);
                      setHoveredEvent(null);
                    }}>
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">{hoveredEvent.title}</h3>
                  <Badge variant="secondary" className={`text-xs ${importanceColors[hoveredEvent.importance as keyof typeof importanceColors]} text-white`}>
                    {hoveredEvent.importance}
                  </Badge>
                </div>
                
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{hoveredEvent.date}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>{hoveredEvent.location}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <div className="flex flex-wrap gap-1">
                      {hoveredEvent.characters.map((char: string) => (
                        <Badge key={char} variant="outline" className="text-xs">
                          {char}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <p className="mt-2">{hoveredEvent.description}</p>
                  
                  <div className="flex items-center justify-between pt-2">
                    <Badge variant="secondary">{hoveredEvent.category}</Badge>
                    <span className="text-xs text-gray-500">Click to edit</span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Side Panel Info */}
        <div className="mt-8 max-w-4xl mx-auto">
          <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Timeline Overview</h3>
              <p className="text-gray-600 mb-4">
                This serpentine timeline shows the chronological progression of your story events. 
                Hover over events to see details, click to edit.
              </p>
              <div className="flex justify-center space-x-4 text-sm text-gray-600">
                <span><strong>{sampleEvents.length}</strong> Total Events</span>
                <span><strong>{sampleEvents.filter(e => e.importance === 'high').length}</strong> High Priority</span>
                <span><strong>{sampleEvents.filter(e => e.category === 'Character Development').length}</strong> Character Events</span>
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Add Event Dialog */}
      {showAddDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Add New Event</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowAddDialog(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <Input placeholder="Enter event title..." />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Input placeholder="Year 1, Day 1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                      {Object.keys(eventTypeIcons).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input placeholder="Enter location..." />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
                    placeholder="Describe what happens in this event..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Characters Involved</label>
                  <Input placeholder="Enter character names separated by commas..." />
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 mt-6">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  Add Event
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Edit Event Dialog */}
      {showEditDialog && selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Edit Event</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowEditDialog(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Event Title</label>
                  <Input defaultValue={selectedEvent.title} />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                    <Input defaultValue={selectedEvent.date} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Importance</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEvent.importance}>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-md" defaultValue={selectedEvent.category}>
                      {Object.keys(eventTypeIcons).map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <Input defaultValue={selectedEvent.location} />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
                    defaultValue={selectedEvent.description}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Characters Involved</label>
                  <Input defaultValue={selectedEvent.characters.join(", ")} />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes</label>
                  <textarea 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md h-24 resize-none"
                    placeholder="Add detailed notes about this event..."
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-6">
                <Button variant="outline" className="text-red-600 border-red-600 hover:bg-red-50">
                  Delete Event
                </Button>
                <div className="flex space-x-3">
                  <Button variant="outline" onClick={() => setShowEditDialog(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-500 text-white hover:bg-orange-600">
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
