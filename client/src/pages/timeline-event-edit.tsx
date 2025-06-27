import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, Calendar, MapPin, Users, X, Check } from "lucide-react";
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
import type { ProjectWithStats } from "@shared/schema";

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
];

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
  high: "bg-red-500",
  medium: "bg-orange-500",
  low: "bg-yellow-500",
};

const importanceLabels = {
  high: "High Importance",
  medium: "Medium Importance",
  low: "Low Importance",
};

// Sample event data - in real app this would come from API
const sampleEvent = {
  id: 1,
  title: "Elena's Awakening",
  date: "Year 1, Day 5",
  importance: "high",
  category: "Character Arc",
  description:
    "Elena discovers her true magical potential during a routine training session. This pivotal moment changes the course of her journey and reveals the depth of power she possesses.",
  location: "Arcanum City",
  characters: ["Elena", "Marcus"],
};

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
        />
        {isOpen && filteredCharacters.length > 0 && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto mt-1">
            {filteredCharacters.map((character) => (
              <div
                key={character}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => handleAddCharacter(character)}
              >
                <div className="flex items-center justify-between">
                  <span>{character}</span>
                  <Check className="w-4 h-4 text-gray-400" />
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
  
  // In real app, this would fetch the specific event
  const event = sampleEvent;
  
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [importance, setImportance] = useState(event.importance);
  const [category, setCategory] = useState(event.category);
  const [description, setDescription] = useState(event.description);
  const [location, setLocation] = useState(event.location);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>(event.characters);
  const [isLoading, setIsLoading] = useState(false);

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
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

    setIsLoading(true);

    try {
      const eventData = {
        title: title.trim(),
        date: date || null,
        category: category || null,
        description: description || null,
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
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-600 hover:text-gray-900"
                onClick={goBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                <p className="text-gray-600">Edit Timeline Event</p>
              </div>
            </div>
          </div>

          {/* Event metadata */}
          <div className="flex flex-wrap items-center gap-6 mb-8">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{event.date}</span>
            </div>
            
            <Badge
              className={`${importanceColors[event.importance as keyof typeof importanceColors]} text-white px-3 py-1 rounded-full`}
            >
              {importanceLabels[event.importance as keyof typeof importanceLabels]}
            </Badge>

            <div className="flex items-center space-x-2 text-gray-600">
              <span>{event.category}</span>
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
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        placeholder="Year 1, Day 5"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="importance">Priority</Label>
                      <Select onValueChange={setImportance} value={importance}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low Priority</SelectItem>
                          <SelectItem value="medium">Medium Priority</SelectItem>
                          <SelectItem value="high">High Priority</SelectItem>
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
                          {eventCategories.map((cat) => (
                            <SelectItem key={cat} value={cat}>
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
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                  </div>
                  <Select onValueChange={setLocation} value={location}>
                    <SelectTrigger>
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
                </Card>

                {/* Characters */}
                <Card className="p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Users className="w-5 h-5 text-gray-500" />
                    <h3 className="text-lg font-semibold text-gray-900">Characters</h3>
                  </div>
                  <CharacterTag
                    selectedCharacters={selectedCharacters}
                    onAddCharacter={(character) => setSelectedCharacters([...selectedCharacters, character])}
                    onRemoveCharacter={(character) => setSelectedCharacters(selectedCharacters.filter(c => c !== character))}
                  />
                </Card>

                <Button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600"
                  disabled={isLoading}
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}