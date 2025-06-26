import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
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
  "Character Development",
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

// Sample event data - in real app this would come from API
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

export default function EditTimelineEvent() {
  const { projectId, eventId } = useParams<{ projectId: string; eventId: string }>();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // In real app, this would fetch the specific event
  const event = sampleEvent;
  
  const [title, setTitle] = useState(event.title);
  const [date, setDate] = useState(event.date);
  const [category, setCategory] = useState(event.category);
  const [description, setDescription] = useState(event.description);
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
        searchPlaceholder="Search timeline events..."
      />
      
      <main className="px-4 py-8 lg:px-8">
        <div className="w-full max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Link href={`/project/${projectId}/timeline/${eventId}`}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Event
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Edit Timeline Event
                </h1>
                <p className="text-gray-600">Modify event details</p>
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
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        placeholder="Year 1, Day 5"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
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