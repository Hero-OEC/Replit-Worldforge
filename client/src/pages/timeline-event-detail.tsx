import React, { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import {
  ArrowLeft,
  Edit3,
  Calendar,
  MapPin,
  Users,
  Trash2,
  User,
  Eye,
  Swords,
  Lightbulb,
  Award,
  Crown,
  Heart,
  HelpCircle,
  Sparkles,
  Zap,
  Plane,
  Search,
  Skull,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, getTagVariant } from "@/components/ui/tag";
import Navbar from "@/components/layout/navbar";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import type { TimelineEvent, ProjectWithStats, Character, Location } from "@shared/schema";

const eventTypeIcons = {
  "Character Arc": User,
  Discovery: Search,
  Conflict: Swords,
  Revelation: Eye,
  "Heroic Act": Crown,
  "Political Event": Crown,
  Romance: Heart,
  Mystery: Search,
  Magic: Sparkles,
  Battle: Swords,
  Traveling: Plane,
  Death: Skull,
  Birth: Heart,
  Wedding: Heart,
  Betrayal: User,
  Alliance: Users,
  Prophecy: Eye,
  Quest: MapPin,
  Tragedy: Heart,
};

const importanceColors = {
  high: "bg-[var(--color-500)]",
  medium: "bg-[var(--color-400)]",
  low: "bg-[var(--color-300)]",
};

const importanceLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};



export default function TimelineEventDetail() {
  const { projectId, eventId } = useParams<{ projectId: string; eventId: string }>();
  const [, navigate] = useLocation();
  const { goBack } = useNavigation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Track navigation history
  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  const { data: timelineEvent, isLoading, error } = useQuery<TimelineEvent>({
    queryKey: [`/api/timeline-events/${eventId}`],
    enabled: !!eventId,
  });

  // Fetch characters to get actual character IDs
  const { data: characters = [] } = useQuery<any[]>({
    queryKey: [`/api/projects/${projectId}/characters`],
    enabled: !!projectId,
  });

  // Fetch locations to get actual location IDs
  const { data: locations = [] } = useQuery<Location[]>({
    queryKey: [`/api/projects/${projectId}/locations`],
    enabled: !!projectId,
  });

  // Helper function to find character ID by name
  const findCharacterIdByName = (characterName: string): number | null => {
    const character = characters.find(char => char.name === characterName);
    return character ? character.id : null;
  };

  // Helper function to find location ID by name
  const findLocationIdByName = (locationName: string): number | null => {
    const location = locations.find(loc => loc.name === locationName);
    return location ? location.id : null;
  };

  // Convert database event to display format
  const event = timelineEvent ? {
    id: timelineEvent.id,
    title: timelineEvent.title,
    date: timelineEvent.date || "No Date",
    importance: (timelineEvent.importance || "medium") as "high" | "medium" | "low",
    category: timelineEvent.category || "Other",
    description: timelineEvent.description || "",
    location: timelineEvent.location || "",
    characters: Array.isArray(timelineEvent.characters) ? timelineEvent.characters : []
  } : null;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)] flex items-center justify-center">
        <div className="text-[var(--color-700)]">Loading timeline event...</div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-950)] mb-4">Timeline Event Not Found</h1>
          <p className="text-[var(--color-700)] mb-6">The timeline event you're looking for doesn't exist.</p>
          <Button onClick={goBack} className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In real app, this would delete the event and redirect
    setDeleteDialogOpen(false);
    navigate(`/project/${projectId}/timeline`);
  };

  const IconComponent = eventTypeIcons[event.category as keyof typeof eventTypeIcons];

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
                <h1 className="text-3xl font-bold text-[var(--color-950)]">{event.title}</h1>
                <p className="text-[var(--color-700)]">Timeline Event Details</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => navigate(`/project/${projectId}/timeline/${eventId}/edit`)}
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Event
              </Button>
              
            </div>
          </div>

          <div className="mb-8">

            {/* Event metadata */}
            <div className="flex flex-wrap items-center gap-6 mb-8">
              <div className="flex items-center space-x-2 text-[var(--color-700)]">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              
              <Badge
                className={`${importanceColors[event.importance as keyof typeof importanceColors]} text-[var(--color-50)] px-3 py-1 rounded-full`}
              >
                {importanceLabels[event.importance as keyof typeof importanceLabels]}
              </Badge>

              <div className="flex items-center space-x-2 text-[var(--color-700)]">
                <span>{event.category}</span>
              </div>
            </div>
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Description */}
            <div className="lg:col-span-2">
              <Card className="rounded-lg border text-card-foreground shadow-sm p-6 bg-[#f4f0cd00]">
                <h2 className="text-xl font-semibold text-[var(--color-950)] mb-4">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {event.description}
                </p>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Location */}
              <Card className="p-6 bg-transparent">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-[var(--color-600)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-950)]">Location</h3>
                </div>
                {(() => {
                  const locationId = findLocationIdByName(event.location);
                  return locationId ? (
                    <Link href={`/project/${projectId}/locations/${locationId}`}>
                      <Tag variant="location" className="cursor-pointer">
                        {event.location}
                      </Tag>
                    </Link>
                  ) : (
                    <Tag variant="location" className="opacity-60">
                      {event.location}
                    </Tag>
                  );
                })()}
              </Card>

              {/* Characters */}
              <Card className="rounded-lg border text-card-foreground shadow-sm p-6 bg-[#f4f0cd00]">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-[var(--color-600)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-950)]">Characters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.characters.map((character, index) => {
                    const characterId = findCharacterIdByName(character);
                    return characterId ? (
                      <Link key={index} href={`/project/${projectId}/characters/${characterId}`}>
                        <Tag variant="supporting" className="cursor-pointer">
                          {character}
                        </Tag>
                      </Link>
                    ) : (
                      <Tag key={index} variant="supporting" className="opacity-60">
                        {character}
                      </Tag>
                    );
                  })}
                </div>
              </Card>

              
            </div>
          </div>
        </div>
      </main>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
        title="Delete Timeline Event"
        itemName={event.title}
        description={`Are you sure you want to delete "${event.title}"? This action cannot be undone and will permanently remove the timeline event.`}
      />
    </div>
  );
}