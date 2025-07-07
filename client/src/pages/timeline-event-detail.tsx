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
  PenTool,
  FileText,
  Edit,
  CheckCircle,
  Clock,
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
  high: "bg-[var(--color-700)]",
  medium: "bg-[var(--color-500)]",
  low: "bg-[var(--color-300)]",
};

const importanceLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

const writingStatusLabels = {
  planning: "Planning",
  writing: "Writing",
  first_draft: "First Draft",
  editing: "Editing",
  complete: "Complete"
};

const writingStatusIcons = {
  planning: PenTool,
  writing: Edit3,
  first_draft: FileText,
  editing: Edit,
  complete: CheckCircle
};

const writingStatusColors = {
  planning: "bg-[var(--color-200)] text-[var(--color-800)]",
  writing: "bg-[var(--color-400)] text-[var(--color-50)]",
  first_draft: "bg-[var(--color-500)] text-[var(--color-50)]",
  editing: "bg-[var(--color-600)] text-[var(--color-50)]",
  complete: "bg-[var(--color-700)] text-[var(--color-50)]"
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
    characters: Array.isArray(timelineEvent.characters) ? timelineEvent.characters : [],
    writingStatus: timelineEvent.writingStatus || "planning"
  } : null;

  if (isLoading) {
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
              </div>
              
              {/* Title and Category Skeleton */}
              <div className="mb-8">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg"></div>
                  <div className="h-8 bg-[var(--color-200)] rounded w-64"></div>
                </div>
                <div className="w-24 h-6 bg-[var(--color-200)] rounded"></div>
              </div>
              
              {/* Content Skeleton */}
              <div className="space-y-6">
                <div className="bg-[var(--color-100)] p-6 rounded-lg border border-[var(--color-300)]">
                  <div className="h-6 bg-[var(--color-200)] rounded w-32 mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-[var(--color-200)] rounded w-full"></div>
                    <div className="h-4 bg-[var(--color-200)] rounded w-3/4"></div>
                    <div className="h-4 bg-[var(--color-200)] rounded w-1/2"></div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[var(--color-100)] p-6 rounded-lg border border-[var(--color-300)]">
                    <div className="h-6 bg-[var(--color-200)] rounded w-24 mb-3"></div>
                    <div className="h-4 bg-[var(--color-200)] rounded w-32"></div>
                  </div>
                  <div className="bg-[var(--color-100)] p-6 rounded-lg border border-[var(--color-300)]">
                    <div className="h-6 bg-[var(--color-200)] rounded w-20 mb-3"></div>
                    <div className="h-4 bg-[var(--color-200)] rounded w-28"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[var(--color-950)] mb-4">Timeline Event Not Found</h1>
          <p className="text-[var(--color-700)] mb-6">The timeline event you're looking for doesn't exist.</p>
          <Button onClick={() => navigate(`/project/${projectId}/timeline`)} className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]">
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
                onClick={() => navigate(`/project/${projectId}/timeline`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  {IconComponent && (
                    <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-[var(--color-700)]" />
                    </div>
                  )}
                  <h1 className="text-3xl font-bold text-[var(--color-950)]">{event.title}</h1>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-[var(--color-800)]">Timeline Event Details</p>
                </div>
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
              <div className="flex items-center space-x-2 text-[var(--color-800)]">
                <Calendar className="w-4 h-4" />
                <span>{event.date}</span>
              </div>
              
              <Badge
                className={`${writingStatusColors[event.writingStatus as keyof typeof writingStatusColors]} px-3 py-1 rounded-full flex items-center space-x-1`}
              >
                {React.createElement(
                  writingStatusIcons[event.writingStatus as keyof typeof writingStatusIcons] || Clock,
                  { className: "w-3 h-3" }
                )}
                <span>{writingStatusLabels[event.writingStatus as keyof typeof writingStatusLabels]}</span>
              </Badge>

              <div className="flex items-center space-x-2 text-[var(--color-800)]">
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
                <p className="text-[var(--color-800)] leading-relaxed">
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
                {event.location ? (() => {
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
                })() : (
                  <span className="text-[var(--color-600)] text-sm italic">No location chosen</span>
                )}
              </Card>

              {/* Characters */}
              <Card className="rounded-lg border text-card-foreground shadow-sm p-6 bg-[#f4f0cd00]">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-[var(--color-600)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-950)]">Characters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.characters && event.characters.length > 0 ? (
                    event.characters.map((character, index) => {
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
                    })
                  ) : (
                    <span className="text-[var(--color-600)] text-sm italic">No characters chosen</span>
                  )}
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