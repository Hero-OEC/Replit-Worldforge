import React from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tag, getTagVariant } from "@/components/ui/tag";
import Navbar from "@/components/layout/navbar";
import type { TimelineEvent, ProjectWithStats } from "@shared/schema";

const eventTypeIcons = {
  "Character Arc": User,
  Discovery: Eye,
  Conflict: Swords,
  Revelation: Lightbulb,
  "Heroic Act": Award,
  "Political Event": Crown,
  Romance: Heart,
  Mystery: HelpCircle,
  Magic: Sparkles,
  Battle: Zap,
  Traveling: Plane,
};

const importanceColors = {
  high: "bg-[var(--color-500)]",
  medium: "bg-[var(--color-400)]",
  low: "bg-[var(--color-300)]",
};

const importanceLabels = {
  high: "High Importance",
  medium: "Medium Importance",
  low: "Low Importance",
};

// Sample data - in real app this would come from API
const sampleEvent = {
  id: 1,
  title: "Elena's Awakening",
  date: "Year 1, Day 5",
  importance: "high",
  category: "Character Development",
  description:
    "Elena discovers her true magical potential during a routine training session. This pivotal moment changes the course of her journey and reveals the depth of power she possesses.",
  location: "Arcanum City",
  characters: ["Elena", "Marcus"],
};

export default function TimelineEventDetail() {
  const { projectId, eventId } = useParams<{ projectId: string; eventId: string }>();
  const [, navigate] = useLocation();
  const { goBack } = useNavigation();
  
  // Track navigation history
  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // In real app, this would fetch the specific event
  const event = sampleEvent;

  const handleDelete = () => {
    // In real app, this would delete the event and redirect
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
              <Button
                variant="outline"
                onClick={handleDelete}
                className="text-destructive border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
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
                <Link href={`/project/${projectId}/locations/1`}>
                  <Tag variant="location" className="cursor-pointer">
                    {event.location}
                  </Tag>
                </Link>
              </Card>

              {/* Characters */}
              <Card className="rounded-lg border text-card-foreground shadow-sm p-6 bg-[#f4f0cd00]">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-[var(--color-600)]" />
                  <h3 className="text-lg font-semibold text-[var(--color-950)]">Characters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.characters.map((character, index) => (
                    <Link key={index} href={`/project/${projectId}/characters/${index + 1}`}>
                      <Tag variant="supporting" className="cursor-pointer">
                        {character}
                      </Tag>
                    </Link>
                  ))}
                </div>
              </Card>

              
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}