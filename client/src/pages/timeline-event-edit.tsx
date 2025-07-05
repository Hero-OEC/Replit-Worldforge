import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, Calendar, MapPin, Users, X, Check, Clock, AlertCircle, Star, Sword, Heart, Eye, Crown, Zap, Shield, Skull, Baby, Church, UserX, Handshake, Scroll, Target, Frown, Swords, PenTool, FileText, Edit, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tag, getTagVariant } from "@/components/ui/tag";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import Navbar from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import type { ProjectWithStats, TimelineEvent, Location, Character } from "@shared/schema";

const eventCategories = [
  "Character Arc",
  "Discovery",
  "Conflict",
  "Revelation",
  "Heroic Act",
  "Political Event",
  "Romance",
  "Mystery",
  "Magic",
  "Battle",
  "Traveling",
  "Death",
  "Birth",
  "Wedding",
  "Betrayal",
  "Alliance",
  "Prophecy",
  "Quest",
  "Tragedy",
];

// Category configuration with distinct icons for each event type
const categoryConfig = {
  "Character Arc": { icon: Users, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Discovery": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Conflict": { icon: Sword, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Revelation": { icon: Eye, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Heroic Act": { icon: Shield, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Political Event": { icon: Crown, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Romance": { icon: Heart, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Mystery": { icon: AlertCircle, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Magic": { icon: Zap, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Battle": { icon: Swords, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Traveling": { icon: MapPin, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Death": { icon: Skull, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Birth": { icon: Baby, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Wedding": { icon: Church, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Betrayal": { icon: UserX, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Alliance": { icon: Handshake, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Prophecy": { icon: Scroll, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Quest": { icon: Target, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Tragedy": { icon: Frown, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
};

// Remove hardcoded data - will fetch from database

const writingStatusColors = {
  planning: "bg-[var(--color-200)]",
  writing: "bg-[var(--color-400)]",
  first_draft: "bg-[var(--color-500)]",
  editing: "bg-[var(--color-600)]",
  complete: "bg-[var(--color-700)]",
};

const writingStatusLabels = {
  planning: "Planning",
  writing: "Writing",
  first_draft: "First Draft",
  editing: "Editing",
  complete: "Complete",
};

const writingStatuses = ["planning", "writing", "first_draft", "editing", "complete"];

const writingStatusIcons = {
  planning: Clock,
  writing: PenTool,
  first_draft: FileText,
  editing: Edit,
  complete: CheckCircle
};

// Removed hardcoded sample event - now using API data

// Character tagging component
interface CharacterTagProps {
  selectedCharacters: string[];
  onAddCharacter: (character: string) => void;
  onRemoveCharacter: (character: string) => void;
  availableCharacters: Character[];
}

function CharacterTag({ selectedCharacters, onAddCharacter, onRemoveCharacter, availableCharacters }: CharacterTagProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCharacters = (availableCharacters || []).filter(
    (char: Character) =>
      char.name.toLowerCase().includes(searchValue.toLowerCase()) &&
      !selectedCharacters.includes(char.name)
  );

  const handleAddCharacter = (character: string) => {
    onAddCharacter(character);
    setSearchValue("");
    setIsOpen(false);
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <Input
          placeholder="Add characters..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onBlur={() => setTimeout(() => setIsOpen(false), 200)}
          className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
        />
        {isOpen && filteredCharacters.length > 0 && (
          <div className="absolute z-50 w-full bg-[var(--color-50)] border border-[var(--color-300)] rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredCharacters.map((character: Character) => (
              <div
                key={character.id}
                className="px-3 py-2 hover:bg-[var(--color-200)] cursor-pointer text-sm"
                onClick={() => handleAddCharacter(character.name)}
              >
                <div className="flex items-center justify-between">
                  <span>{character.name}</span>
                  <Check className="w-4 h-4 text-[var(--color-600)]" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedCharacters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCharacters.map((character) => (
            <Tag
              key={character}
              variant="supporting"
              removable
              onRemove={() => onRemoveCharacter(character)}
            >
              {character}
            </Tag>
          ))}
        </div>
      )}
    </div>
  );
}

export default function EditTimelineEvent() {
  const { projectId, eventId } = useParams<{ projectId: string; eventId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { goBack, navigateWithHistory, navigateReplaceHistory } = useNavigation();
  const queryClient = useQueryClient();
  
  // Track navigation history
  useNavigationTracker();
  
  // Fetch the actual event data from API
  const { data: timelineEvent, isLoading: eventLoading, error } = useQuery<TimelineEvent>({
    queryKey: [`/api/timeline-events/${eventId}`],
    enabled: !!eventId,
  });
  
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [importance, setImportance] = useState("medium");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [writingStatus, setWritingStatus] = useState("planning");
  const [isLoading, setIsLoading] = useState(false);
  
  // Update form fields when event data loads
  React.useEffect(() => {
    if (timelineEvent) {
      setTitle(timelineEvent.title || "");
      setDate(timelineEvent.date || "");
      setImportance(timelineEvent.importance || "medium");
      setCategory(timelineEvent.category || "");
      setDescription(timelineEvent.description || "");
      setLocation(timelineEvent.location || "");
      setSelectedCharacters(Array.isArray(timelineEvent.characters) ? timelineEvent.characters : []);
      setWritingStatus(timelineEvent.writingStatus || "planning");
    }
  }, [timelineEvent]);

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Fetch locations for the project
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: [`/api/projects/${projectId}/locations`],
    enabled: !!projectId,
  });

  // Fetch characters for the project
  const { data: characters = [] } = useQuery<Character[]>({
    queryKey: [`/api/projects/${projectId}/characters`],
    enabled: !!projectId,
  });

  // Loading state
  if (eventLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)]">
        <Navbar 
          projectId={projectId}
          projectTitle="Loading..."
          showProjectNav={true}
        />
        <main className="pt-16">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <div className="animate-pulse">
              {/* Header Skeleton */}
              <div className="mb-6">
                <div className="h-10 bg-[var(--color-200)] rounded w-32 mb-4"></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg"></div>
                    <div className="h-8 bg-[var(--color-200)] rounded w-48"></div>
                  </div>
                  <div className="h-10 bg-[var(--color-200)] rounded w-20"></div>
                </div>
              </div>
              
              {/* Form Skeleton */}
              <div className="space-y-6">
                <div className="bg-[var(--color-100)] p-6 rounded-lg border border-[var(--color-300)]">
                  <div className="h-6 bg-[var(--color-200)] rounded w-24 mb-3"></div>
                  <div className="h-10 bg-[var(--color-200)] rounded w-full"></div>
                </div>
                
                <div className="bg-[var(--color-100)] p-6 rounded-lg border border-[var(--color-300)]">
                  <div className="h-6 bg-[var(--color-200)] rounded w-32 mb-3"></div>
                  <div className="h-32 bg-[var(--color-200)] rounded w-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[var(--color-100)] p-6 rounded-lg border border-[var(--color-300)]">
                    <div className="h-6 bg-[var(--color-200)] rounded w-20 mb-3"></div>
                    <div className="h-10 bg-[var(--color-200)] rounded w-full"></div>
                  </div>
                  <div className="bg-[var(--color-100)] p-6 rounded-lg border border-[var(--color-300)]">
                    <div className="h-6 bg-[var(--color-200)] rounded w-24 mb-3"></div>
                    <div className="h-10 bg-[var(--color-200)] rounded w-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Error state
  if (error || !timelineEvent) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-950)] mb-4">Timeline Event Not Found</h1>
          <p className="text-[var(--color-700)] mb-6">The timeline event you're trying to edit doesn't exist.</p>
          <Button onClick={goBack} className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const eventData = {
        title: title.trim(),
        date: date || null,
        category: category || null,
        description: description || null,
        importance: importance,
        location: location || null,
        characters: selectedCharacters,
        writingStatus: writingStatus,
      };

      const response = await fetch(`/api/timeline-events/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to update timeline event');
      }

      // Invalidate relevant caches
      queryClient.invalidateQueries({ queryKey: [`/api/timeline-events/${eventId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/timeline`] });

      toast({
        title: "Success",
        description: "Timeline event updated successfully",
      });
      
      // Navigate to detail page
      navigate(`/project/${projectId}/timeline/${eventId}`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update timeline event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-bg)]">
      <Navbar
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        
      />
      
      <main className="px-4 py-8 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header - matching lore edit page layout */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
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
                  <div className="flex items-center space-x-3 mb-2">
                    {/* Category icon matching current category */}
                    {category && categoryConfig[category as keyof typeof categoryConfig] && (
                      <div className={`w-10 h-10 ${categoryConfig[category as keyof typeof categoryConfig].color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {React.createElement(categoryConfig[category as keyof typeof categoryConfig].icon, { 
                          className: `w-5 h-5 ${categoryConfig[category as keyof typeof categoryConfig].textColor}` 
                        })}
                      </div>
                    )}
                    <div className="flex-1">
                      <Input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter event title..."
                        className="text-3xl font-bold text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
                      />
                    </div>
                  </div>
                  <div className="ml-13 flex items-center space-x-4">
                    {/* Category selector */}
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-auto bg-[var(--color-100)] text-[var(--color-800)] border-0 focus:ring-0 h-auto p-2 rounded-full text-sm font-medium">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {eventCategories.map((cat) => (
                          <SelectItem key={cat} value={cat}>
                            {cat}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Date display */}
                    <div className="flex items-center space-x-2 text-[var(--color-700)]">
                      <Calendar className="w-4 h-4" />
                      <span>{date || "No date set"}</span>
                    </div>
                    
                    {/* Writing Status badge */}
                    <Badge
                      className={`${writingStatusColors[writingStatus as keyof typeof writingStatusColors]} text-[var(--color-50)] px-3 py-1 rounded-full`}
                    >
                      {writingStatusLabels[writingStatus as keyof typeof writingStatusLabels]}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/project/${projectId}/timeline/${eventId}`)}
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Updating..." : "Update Event"}
                </Button>
              </div>
            </div>
          </div>

          {/* Content - matching lore edit page structure */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Description</span>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happens in this event..."
              className="min-h-[200px] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
            />
          </div>

          {/* Event Details Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Calendar className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Event Details</span>
            </div>
            
            {/* Date Input - Separated Fields */}
            <div className="mb-4">
              <Label className="text-sm text-[var(--color-600)]">Date</Label>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label htmlFor="year" className="text-xs text-[var(--color-600)]">Year</Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="1247"
                    value={date.split(',')[0]?.replace('Year ', '') || ''}
                    onChange={(e) => {
                      const year = e.target.value;
                      const parts = date.split(', ');
                      const month = parts[1] || '';
                      const day = parts[2] || '';
                      setDate(`Year ${year}${month ? `, ${month}` : ''}${day ? `, ${day}` : ''}`);
                    }}
                    className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
                  />
                </div>
                <div>
                  <Label htmlFor="month" className="text-xs text-[var(--color-600)]">Month</Label>
                  <Input
                    id="month"
                    type="number"
                    placeholder="3"
                    value={date.split(',')[1]?.replace(' Month ', '') || ''}
                    onChange={(e) => {
                      const month = e.target.value;
                      const parts = date.split(', ');
                      const year = parts[0] || 'Year ';
                      const day = parts[2] || '';
                      setDate(`${year}${month ? `, Month ${month}` : ''}${day ? `, ${day}` : ''}`);
                    }}
                    className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
                  />
                </div>
                <div>
                  <Label htmlFor="day" className="text-xs text-[var(--color-600)]">Day</Label>
                  <Input
                    id="day"
                    type="number"
                    placeholder="15"
                    value={date.split(',')[2]?.replace(' Day ', '') || ''}
                    onChange={(e) => {
                      const day = e.target.value;
                      const parts = date.split(', ');
                      const year = parts[0] || 'Year ';
                      const month = parts[1] || '';
                      setDate(`${year}${month ? `, ${month}` : ''}${day ? `, Day ${day}` : ''}`);
                    }}
                    className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Writing Status Selector */}
              <div>
                <Label htmlFor="writingStatus" className="text-sm text-[var(--color-600)]">Writing Status</Label>
                <Select onValueChange={setWritingStatus} value={writingStatus}>
                  <SelectTrigger className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all">
                    <SelectValue placeholder="Select writing status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planning">Planning</SelectItem>
                    <SelectItem value="writing">Writing</SelectItem>
                    <SelectItem value="first_draft">First Draft</SelectItem>
                    <SelectItem value="editing">Editing</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Location Selector */}
              <div>
                <Label htmlFor="location" className="text-sm text-[var(--color-600)]">Location</Label>
                <Select onValueChange={setLocation} value={location}>
                  <SelectTrigger className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((loc: Location) => (
                      <SelectItem key={loc.id} value={loc.name}>
                        {loc.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Writing Status Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Clock className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Writing Status</span>
            </div>
            
            <div>
              <Label htmlFor="writingStatus" className="text-sm text-[var(--color-600)]">Writing Status</Label>
              <Select onValueChange={setWritingStatus} value={writingStatus}>
                <SelectTrigger className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {writingStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      <div className="flex items-center space-x-2">
                        {React.createElement(writingStatusIcons[status as keyof typeof writingStatusIcons], {
                          className: "w-4 h-4"
                        })}
                        <span>{writingStatusLabels[status as keyof typeof writingStatusLabels]}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Characters Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Characters</span>
            </div>
            
            <CharacterTag
              selectedCharacters={selectedCharacters}
              onAddCharacter={(character) => setSelectedCharacters([...selectedCharacters, character])}
              onRemoveCharacter={(character) => setSelectedCharacters(selectedCharacters.filter(c => c !== character))}
              availableCharacters={characters}
            />
          </div>
        </div>
      </main>
    </div>
  );
}