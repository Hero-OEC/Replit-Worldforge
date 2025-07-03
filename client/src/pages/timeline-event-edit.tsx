import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, Calendar, MapPin, Users, X, Check, Clock, AlertCircle, Star } from "lucide-react";
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
import type { ProjectWithStats, TimelineEvent } from "@shared/schema";

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

// Category configuration matching lore page approach
const categoryConfig = {
  "Character Arc": { icon: Users, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Discovery": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Conflict": { icon: AlertCircle, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Revelation": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Heroic Act": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Political Event": { icon: Users, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Romance": { icon: Users, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Mystery": { icon: AlertCircle, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Magic": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Battle": { icon: AlertCircle, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Traveling": { icon: MapPin, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Death": { icon: AlertCircle, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Birth": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Wedding": { icon: Users, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Betrayal": { icon: AlertCircle, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Alliance": { icon: Users, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Prophecy": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Quest": { icon: Star, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Tragedy": { icon: AlertCircle, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
};

const sampleLocations = [
  "Arcanum City",
  "Dark Forest",
  "Magic Academy",
  "Riverside Village",
  "Northern Road",
  "Battlefield",
  "Elemental Nexus",
  "Misty Marshlands",
  "Garden of Stars",
  "Royal Palace",
];

const sampleCharacters = [
  "Elena",
  "Marcus",
  "Mentor",
  "King",
  "Ancient Sage",
  "Council Members",
  "Army",
  "Lord Vex",
  "Princess Aria",
  "Captain Storm",
];

const importanceColors = {
  high: "bg-destructive",
  medium: "bg-[var(--color-500)]",
  low: "bg-yellow-500",
};

const importanceLabels = {
  high: "High Importance",
  medium: "Medium Importance",
  low: "Low Importance",
};

// Removed hardcoded sample event - now using API data

// Character tagging component
interface CharacterTagProps {
  selectedCharacters: string[];
  onAddCharacter: (character: string) => void;
  onRemoveCharacter: (character: string) => void;
}

function CharacterTag({ selectedCharacters, onAddCharacter, onRemoveCharacter }: CharacterTagProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCharacters = sampleCharacters.filter(
    (char) =>
      char.toLowerCase().includes(searchValue.toLowerCase()) &&
      !selectedCharacters.includes(char)
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
            {filteredCharacters.map((character) => (
              <div
                key={character}
                className="px-3 py-2 hover:bg-[var(--color-200)] cursor-pointer text-sm"
                onClick={() => handleAddCharacter(character)}
              >
                <div className="flex items-center justify-between">
                  <span>{character}</span>
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
  const { goBack, navigateWithHistory } = useNavigation();
  
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
    }
  }, [timelineEvent]);

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Loading state
  if (eventLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--color-600)] mx-auto mb-4"></div>
          <p className="text-[var(--color-700)]">Loading timeline event...</p>
        </div>
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

      toast({
        title: "Success",
        description: "Timeline event updated successfully",
      });
      
      navigateWithHistory(`/project/${projectId}/timeline/${eventId}`);
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
        searchPlaceholder="Search timeline events..."
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
                    
                    {/* Importance badge */}
                    <Badge
                      className={`${importanceColors[importance as keyof typeof importanceColors]} text-[var(--color-50)] px-3 py-1 rounded-full`}
                    >
                      {importanceLabels[importance as keyof typeof importanceLabels]}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
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
              <Clock className="w-4 h-4 text-[var(--color-700)]" />
              <span className="text-sm font-medium text-gray-700">Description</span>
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
              <Calendar className="w-4 h-4 text-[var(--color-700)]" />
              <span className="text-sm font-medium text-gray-700">Event Details</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Date Input */}
              <div>
                <Label htmlFor="date" className="text-sm text-[var(--color-600)]">Date</Label>
                <Input
                  id="date"
                  placeholder="e.g., Year 1247, Month 3, Day 15"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
                />
              </div>

              {/* Importance Selector */}
              <div>
                <Label htmlFor="importance" className="text-sm text-[var(--color-600)]">Priority</Label>
                <Select onValueChange={setImportance} value={importance}>
                  <SelectTrigger className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
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
                    {sampleLocations.map((loc) => (
                      <SelectItem key={loc} value={loc}>
                        {loc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Characters Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-4 h-4 text-[var(--color-700)]" />
              <span className="text-sm font-medium text-gray-700">Characters</span>
            </div>
            
            <CharacterTag
              selectedCharacters={selectedCharacters}
              onAddCharacter={(character) => setSelectedCharacters([...selectedCharacters, character])}
              onRemoveCharacter={(character) => setSelectedCharacters(selectedCharacters.filter(c => c !== character))}
            />
          </div>
        </div>
      </main>
    </div>
  );
}