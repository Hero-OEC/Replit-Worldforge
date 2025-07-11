import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, MapPin, Users, X, Check, Calendar, 
         User, Crown, Sword, Shield, Heart, Search, Wand2, 
         Zap, Swords, Plane, Skull, Baby, Church, UserMinus, 
         Handshake, Eye, Map, Frown, Edit3, FileText, Edit, 
         CheckCircle, Clock, PenTool } from "lucide-react";
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
import type { ProjectWithStats, Character, Location } from "@shared/schema";

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

// Category configurations matching edit page
const categoryConfig = {
  "Character Arc": { icon: User, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Discovery": { icon: Search, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Conflict": { icon: Swords, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Revelation": { icon: Eye, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Heroic Act": { icon: Crown, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Political Event": { icon: Crown, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Romance": { icon: Heart, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Mystery": { icon: Search, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Magic": { icon: Wand2, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Battle": { icon: Sword, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Traveling": { icon: Plane, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Death": { icon: Skull, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Birth": { icon: Baby, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Wedding": { icon: Church, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Betrayal": { icon: UserMinus, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Alliance": { icon: Handshake, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Prophecy": { icon: Eye, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Quest": { icon: Map, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
  "Tragedy": { icon: Frown, color: "bg-[var(--color-200)]", textColor: "text-[var(--color-700)]" },
};

// Importance configurations matching edit page


// Writing status configuration
const writingStatuses = [
  "planning",
  "writing", 
  "first_draft",
  "editing",
  "complete"
];

const writingStatusLabels = {
  planning: "Planning",
  writing: "Writing",
  first_draft: "First Draft",
  editing: "Editing", 
  complete: "Complete"
};

const writingStatusColors = {
  planning: "bg-[var(--color-200)] text-[var(--color-700)]",
  writing: "bg-[var(--color-400)] text-[var(--color-950)]",
  first_draft: "bg-[var(--color-500)] text-[var(--color-50)]",
  editing: "bg-[var(--color-600)] text-[var(--color-50)]",
  complete: "bg-[var(--color-700)] text-[var(--color-50)]"
};

const writingStatusIcons = {
  planning: PenTool,
  writing: Edit3,
  first_draft: FileText,
  editing: Edit,
  complete: CheckCircle
};



// Character tagging component
interface CharacterTagProps {
  selectedCharacters: string[];
  onAddCharacter: (character: string) => void;
  onRemoveCharacter: (character: string) => void;
  characters: Character[];
}

function CharacterTag({ selectedCharacters, onAddCharacter, onRemoveCharacter, characters }: CharacterTagProps) {
  const [searchValue, setSearchValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const filteredCharacters = characters.filter(
    (char) => {
      // Ensure char.name exists and is a non-empty string
      if (!char.name || typeof char.name !== 'string' || char.name.trim() === '') {
        return false;
      }

      // Check if name matches search and isn't already selected
      return char.name.toLowerCase().includes(searchValue.toLowerCase()) &&
             !selectedCharacters.includes(char.name);
    }
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
        />
        {isOpen && filteredCharacters.length > 0 && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredCharacters.map((character) => (
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

export default function NewTimelineEvent() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { goBack, navigateWithHistory } = useNavigation();
  const queryClient = useQueryClient();

  // Track navigation history
  useNavigationTracker();

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [writingStatus, setWritingStatus] = useState("planning");
  const [isLoading, setIsLoading] = useState(false);

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: locations = [], isLoading: locationsLoading, error: locationsError } = useQuery<Location[]>({
    queryKey: [`/api/projects/${projectId}/locations`],
    enabled: !!projectId,
  });

  const { data: characters = [], isLoading: charactersLoading, error: charactersError } = useQuery<Character[]>({
    queryKey: [`/api/projects/${projectId}/characters`],
    enabled: !!projectId,
  });

  // Debug: Log the data to console
  console.log('Timeline Event Form Debug:', {
    projectId,
    characters: characters.length > 0 ? characters : 'No characters loaded',
    locations: locations.length > 0 ? locations : 'No locations loaded',
    charactersLoading,
    locationsLoading,
    charactersError,
    locationsError
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast({
        title: "Error",
        description: "Title is required",
        variant: "destructive",
      });
      return;
    }

    if (isLoading) return; // Prevent double submission
    setIsLoading(true);

    try {
      const eventData = {
        projectId: parseInt(projectId!),
        title: title.trim(),
        date: date || null,
        category: category || null,
        description: description || null,
        importance: "medium", // Default importance value
        location: location || null,
        characters: selectedCharacters.length > 0 ? selectedCharacters : null,
        order: 0,
        writingStatus: writingStatus,
      };

      const response = await fetch(`/api/timeline-events`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to create timeline event');
      }

      // Invalidate timeline cache to refresh the data
      queryClient.invalidateQueries({ 
        queryKey: ["/api/projects", projectId, "timeline"] 
      });

      toast({
        title: "Success",
        description: "Timeline event created successfully",
      });

      navigateWithHistory(`/project/${projectId}/timeline`);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create timeline event",
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
                    {category && categoryConfig[category as keyof typeof categoryConfig] ? (
                      <div className={`w-10 h-10 ${categoryConfig[category as keyof typeof categoryConfig].color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        {React.createElement(categoryConfig[category as keyof typeof categoryConfig].icon, { 
                          className: `w-5 h-5 ${categoryConfig[category as keyof typeof categoryConfig].textColor}` 
                        })}
                      </div>
                    ) : (
                      <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-[var(--color-700)]" />
                      </div>
                    )}
                    <div className="flex-1">
                      <Input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter event title..."
                        className="text-3xl font-bold text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="ml-13 flex items-center space-x-4">
                    {/* Category selector */}
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger className="w-auto min-w-[140px] text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px] overflow-y-auto">
                        {eventCategories.map((cat) => (
                          <SelectItem key={cat} value={cat} className="cursor-pointer hover:bg-[var(--color-100)] focus:bg-[var(--color-200)] py-3">
                            <div className="flex items-center space-x-2">
                              {React.createElement(
                                categoryConfig[cat as keyof typeof categoryConfig]?.icon || Eye,
                                { className: "w-4 h-4 text-[var(--color-600)]" }
                              )}
                              <span>{cat}</span>
                            </div>
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
                      className={`${writingStatusColors[writingStatus as keyof typeof writingStatusColors]} px-3 py-1 rounded-full flex items-center space-x-1`}
                    >
                      {React.createElement(
                        writingStatusIcons[writingStatus as keyof typeof writingStatusIcons] || Clock,
                        { className: "w-3 h-3" }
                      )}
                      <span>{writingStatusLabels[writingStatus as keyof typeof writingStatusLabels]}</span>
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate(`/project/${projectId}/timeline`)}
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading || !title.trim()}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </div>
          </div>

          {/* Content Description Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <User className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Description</span>
            </div>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what happens in this event..."
              className="min-h-[200px] text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
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
                    className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
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
                    className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
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
                    className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {/* Location Selector */}
              <div>
                <Label htmlFor="location" className="text-sm text-[var(--color-600)]">Location</Label>
                <Select onValueChange={setLocation} value={location}>
                  <SelectTrigger className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all">
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

          {/* Writing Progress Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Edit3 className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Writing Progress</span>
            </div>
            
            {/* Writing Status */}
            <div>
              <Label htmlFor="writingStatus" className="text-sm text-[var(--color-600)]">Writing Status</Label>
              <Select onValueChange={setWritingStatus} value={writingStatus}>
                <SelectTrigger className="text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {writingStatuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {writingStatusLabels[status as keyof typeof writingStatusLabels]}
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
              characters={characters}
            />
          </div>
        </div>
      </main>
    </div>
  );
}