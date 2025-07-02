import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, MapPin, Users, X, Check } from "lucide-react";
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
  const [importance, setImportance] = useState("medium");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
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
        importance: importance,
        location: location || null,
        characters: selectedCharacters.length > 0 ? selectedCharacters : null,
        order: 0,
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
        searchPlaceholder="Search timeline events..."
      />

      <main className="px-4 py-8 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
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
                <h1 className="text-3xl font-bold text-[var(--color-950)]">Create New Timeline Event</h1>
                <p className="text-[var(--color-700)]">Add a new event to your project timeline</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-6">
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="title">Event Title</Label>
                      <Input
                        id="title"
                        placeholder="Enter event title..."
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe what happens in this event..."
                        className="min-h-[120px]"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    </div>
                  </div>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Date</Label>
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <Label htmlFor="year" className="text-sm text-[var(--color-600)]">Year</Label>
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
                          />
                        </div>
                        <div>
                          <Label htmlFor="month" className="text-sm text-[var(--color-600)]">Month</Label>
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
                          />
                        </div>
                        <div>
                          <Label htmlFor="day" className="text-sm text-[var(--color-600)]">Day</Label>
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
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="importance">Importance</Label>
                      <Select onValueChange={setImportance} value={importance}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select importance" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Importance</SelectItem>
                          <SelectItem value="medium">Medium Importance</SelectItem>
                          <SelectItem value="high">High Importance</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select onValueChange={setCategory} value={category}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {eventCategories.map((cat, index) => (
                            <SelectItem key={`category-${index}-${cat}`} value={cat}>
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Card>

                {/* Location */}
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <MapPin className="w-5 h-5 text-[var(--color-600)]" />
                    <h3 className="text-lg font-semibold text-[var(--color-950)]">Location</h3>
                  </div>
                  <Select onValueChange={setLocation} value={location} disabled={locationsLoading}>
                    <SelectTrigger>
                      <SelectValue placeholder={locationsLoading ? "Loading locations..." : locations.length === 0 ? "No locations found" : "Select location"} />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.name}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {locationsError && (
                    <p className="text-sm text-red-500 mt-1">Error loading locations: {String(locationsError)}</p>
                  )}
                </Card>

                {/* Characters */}
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-[var(--color-600)]" />
                    <h3 className="text-lg font-semibold text-[var(--color-950)]">Characters</h3>
                  </div>
                  {charactersLoading ? (
                    <div className="text-sm text-[var(--color-600)]">Loading characters...</div>
                  ) : charactersError ? (
                    <div className="text-sm text-red-500">Error loading characters: {String(charactersError)}</div>
                  ) : characters.length === 0 ? (
                    <div className="text-sm text-[var(--color-600)]">No characters found for this project</div>
                  ) : (
                    <CharacterTag
                      selectedCharacters={selectedCharacters}
                      onAddCharacter={(character) => setSelectedCharacters([...selectedCharacters, character])}
                      onRemoveCharacter={(character) => setSelectedCharacters(selectedCharacters.filter(c => c !== character))}
                      characters={characters}
                    />
                  )}
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-[var(--color-500)] hover:bg-[var(--color-600)]"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Creating..." : "Create Event"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}