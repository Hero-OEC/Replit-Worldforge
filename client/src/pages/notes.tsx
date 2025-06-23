import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, FileText, Edit3, MoreHorizontal, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import type { ProjectWithStats } from "@shared/schema";

export default function Notes() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Sample notes for demonstration
  const sampleNotes = [
    {
      id: 1,
      title: "Plot Ideas for Act 2",
      category: "Plot",
      lastModified: "2 hours ago",
      content: "Need to develop the tension between Elena and Marcus. Consider adding a betrayal scene where Marcus's past comes back to haunt them. Maybe introduce the subplot about the stolen artifact...",
      tags: ["plot", "act-2", "character-development"]
    },
    {
      id: 2,
      title: "Magic System Clarifications",
      category: "Worldbuilding",
      lastModified: "1 day ago",
      content: "Remember: Elemental magic requires emotional connection. Fire = passion/anger, Water = calm/intuition, Earth = stability/patience, Air = freedom/curiosity. Overuse leads to emotional burnout, not just physical exhaustion.",
      tags: ["magic", "rules", "elements"]
    },
    {
      id: 3,
      title: "Character Voice Notes",
      category: "Characters",
      lastModified: "3 days ago",
      content: "Elena speaks with contractions when comfortable, formal speech when nervous. Marcus uses archaic phrases from his academy days. Lord Vex never uses contractions - always speaks formally and precisely.",
      tags: ["characters", "dialogue", "voice"]
    },
    {
      id: 4,
      title: "Research - Medieval Architecture",
      category: "Research",
      lastModified: "1 week ago",
      content: "Notes on castle construction, room layouts, and defensive features for Arcanum City's design. Flying buttresses could be magical supports instead of stone...",
      tags: ["research", "architecture", "locations"]
    },
    {
      id: 5,
      title: "Reader Feedback Ideas",
      category: "Feedback",
      lastModified: "2 weeks ago",
      content: "Beta readers want more description of the magical effects. Need to show rather than tell how spells look and feel. Consider adding sensory details - what does magic smell/taste like?",
      tags: ["feedback", "revisions", "description"]
    }
  ];

  const filteredNotes = sampleNotes.filter(note =>
    note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      'Plot': 'bg-blue-100 text-blue-800',
      'Worldbuilding': 'bg-green-100 text-green-800',
      'Characters': 'bg-purple-100 text-purple-800',
      'Research': 'bg-yellow-100 text-yellow-800',
      'Feedback': 'bg-orange-100 text-orange-800',
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search notes..."
        onSearch={setSearchTerm}
        rightContent={
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            New Note
          </Button>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-500 rounded-lg flex items-center justify-center">
                <Scroll className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notes</h1>
                <p className="text-gray-600">Keep track of ideas, research, and project thoughts</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleNotes.length}</p>
                <p className="text-sm text-gray-600">Total Notes</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleNotes.filter(n => n.category === 'Plot').length}</p>
                <p className="text-sm text-gray-600">Plot Notes</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleNotes.filter(n => n.category === 'Characters').length}</p>
                <p className="text-sm text-gray-600">Character Notes</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleNotes.filter(n => n.category === 'Worldbuilding').length}</p>
                <p className="text-sm text-gray-600">World Notes</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleNotes.filter(n => n.category === 'Research').length}</p>
                <p className="text-sm text-gray-600">Research</p>
              </div>
            </Card>
          </div>

          {/* Notes Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <Card key={note.id} className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{note.title}</h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`text-xs ${getCategoryColor(note.category)}`}>
                        {note.category}
                      </Badge>
                      <span className="text-xs text-gray-500">{note.lastModified}</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-4">{note.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                  {note.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                      #{tag}
                    </span>
                  ))}
                </div>

                <div className="flex justify-end">
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notes found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start capturing your creative ideas and research.'}
              </p>
              <Button className="bg-orange-500 text-white hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Note
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}