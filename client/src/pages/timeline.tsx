import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Star, Calendar, MapPin, Users, Edit, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

// Sample timeline events for demonstration
const sampleEvents = [
  { id: 1, title: "Elena's Awakening", date: "Year 1, Day 5", importance: "high", category: "Character Development", description: "Elena discovers her true magical potential during a routine training session.", location: "Arcanum City", characters: ["Elena", "Marcus"] },
  { id: 2, title: "The Forbidden Library", date: "Year 1, Day 12", importance: "medium", category: "Discovery", description: "Elena and Marcus uncover ancient texts in the hidden library.", location: "Arcanum City", characters: ["Elena", "Marcus"] },
  { id: 3, title: "First Encounter", date: "Year 1, Day 18", importance: "high", category: "Plot", description: "The protagonists face their first major challenge.", location: "Dark Forest", characters: ["Elena"] },
  { id: 4, title: "The Mentor's Secret", date: "Year 1, Day 25", importance: "medium", category: "Character Development", description: "A secret about Elena's mentor is revealed.", location: "Magic Academy", characters: ["Elena", "Mentor"] },
  { id: 5, title: "Village Rescue", date: "Year 1, Day 31", importance: "low", category: "Side Quest", description: "The heroes help save a village from bandits.", location: "Riverside Village", characters: ["Elena", "Marcus"] },
  { id: 6, title: "Journey to the North", date: "Year 1, Day 78", importance: "medium", category: "Travel", description: "The group begins their journey to the northern kingdoms.", location: "Northern Road", characters: ["Elena", "Marcus"] },
  { id: 7, title: "The Great Battle", date: "Year 1, Day 71", importance: "high", category: "Battle", description: "A major battle that changes the course of the war.", location: "Battlefield", characters: ["Elena", "Marcus", "Army"] },
  { id: 8, title: "Elemental Convergence", date: "Year 1, Day 90", importance: "medium", category: "Magic", description: "The elemental forces converge in an unprecedented way.", location: "Elemental Nexus", characters: ["Elena"] },
  { id: 9, title: "The Vanishing Mist", date: "Year 1, Day 95", importance: "low", category: "Mystery", description: "A strange mist appears and disappears mysteriously.", location: "Misty Marshlands", characters: ["Elena", "Marcus"] },
  { id: 10, title: "Hearts Entwined", date: "Year 1, Day 88", importance: "medium", category: "Romance", description: "A romantic subplot reaches a crucial moment.", location: "Garden of Stars", characters: ["Elena", "Marcus"] },
];

export default function Timeline() {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [hoveredEvent, setHoveredEvent] = useState<any>(null);

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

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
      {/* Header */}
      <header className="bg-[var(--worldforge-card)] border-b border-[var(--border)] p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{project?.title} – Timeline</h1>
            <p className="text-gray-600 mt-1">Organize story events and plot progression</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input 
                type="text" 
                placeholder="Search events..." 
                className="pl-10 pr-4 py-2 w-64 bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="worldforge-primary text-white hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </header>

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
            
            return (
              <div
                key={event.id}
                className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-10"
                style={{ left: point.x, top: point.y }}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
                onClick={() => setSelectedEvent(event)}
              >
                {/* Event Circle */}
                <div className={`w-12 h-12 ${importanceColors[importance]} rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform relative`}>
                  <Star className="w-6 h-6 text-white" />
                  
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
            <div className="absolute z-50 pointer-events-none" style={{ 
              left: pathPoints.find(p => p.event.id === hoveredEvent.id)?.x, 
              top: (pathPoints.find(p => p.event.id === hoveredEvent.id)?.y || 0) - 150 
            }}>
              <Card className="bg-white border border-[var(--border)] p-4 shadow-lg w-80">
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
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
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

      {/* Edit Modal would go here when selectedEvent is set */}
    </div>
  );
}
