import React from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import {
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
import Navbar from "@/components/layout/navbar";
import type { TimelineEvent, ProjectWithStats } from "@shared/schema";

const eventTypeIcons = {
  "Character Development": User,
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
  high: "bg-red-500",
  medium: "bg-orange-500",
  low: "bg-yellow-500",
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

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // In real app, this would fetch the specific event
  const event = sampleEvent;

  console.log("TimelineEventDetail rendering with:", { projectId, eventId });

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
          <div className="mb-8">
            <div className="flex items-start space-x-4 mb-6">
              <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {event.title}
                </h1>
                <p className="text-gray-600">Timeline Event Details</p>
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
          </div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content - Description */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
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
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                </div>
                <Badge className="bg-blue-100 text-blue-800 px-3 py-1 rounded-md">
                  {event.location}
                </Badge>
              </Card>

              {/* Characters */}
              <Card className="p-6">
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-5 h-5 text-gray-500" />
                  <h3 className="text-lg font-semibold text-gray-900">Characters</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.characters.map((character, index) => (
                    <Badge
                      key={index}
                      className="bg-green-100 text-green-800 px-3 py-1 rounded-md"
                    >
                      {character}
                    </Badge>
                  ))}
                </div>
              </Card>

              {/* Danger Zone */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">
                  Danger Zone
                </h3>
                <Button
                  onClick={handleDelete}
                  className="w-full bg-red-500 hover:bg-red-600 text-white"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Event
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}