import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, X, Plus, Minus, FileText, Tag, BookOpen, Users, Search, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import Navbar from "@/components/layout/navbar";
import { useNavigationTracker } from "@/contexts/navigation-context";
import { apiRequest } from "@/lib/queryClient";
import type { ProjectWithStats } from "@shared/schema";

const categories = [
  "Plot",
  "Characters",
  "World Building",
  "Research"
];

const categoryConfig = {
  "Plot": {
    icon: BookOpen,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  },
  "Characters": {
    icon: Users,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  },
  "World Building": {
    icon: Search,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  },
  "Research": {
    icon: Scroll,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  }
};

export default function EditNote() {
  const { projectId, noteId } = useParams<{ projectId: string; noteId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Plot");
  const [content, setContent] = useState("");

  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  const { data: note, isLoading } = useQuery({
    queryKey: ["/api/notes", noteId],
    queryFn: async () => {
      const response = await fetch(`/api/notes/${noteId}`);
      if (!response.ok) throw new Error("Failed to fetch note");
      return response.json();
    },
    enabled: !!noteId
  });

  // Initialize form with existing note data
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setCategory(note.category || "Plot");
      setContent(note.content || "");
      
      // Handle tags - convert string to array if needed
      const noteTags = note.tags;
      if (typeof noteTags === 'string') {
        setTags(noteTags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0));
      } else if (Array.isArray(noteTags)) {
        setTags(noteTags);
      } else {
        setTags([]);
      }
    }
  }, [note]);

  const updateNoteMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", noteId] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "notes"] });
      toast({ title: "Note updated successfully!" });
      setLocation(`/project/${projectId}/notes/${noteId}`);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update note", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({ 
        title: "Title required", 
        description: "Please enter a title for the note",
        variant: "destructive" 
      });
      return;
    }

    updateNoteMutation.mutate({
      title: title.trim(),
      category,
      content: content.trim(),
      tags: tags.join(','),
      projectId: parseInt(projectId!)
    });
  };

  const handleCancel = () => {
    setLocation(`/project/${projectId}/notes/${noteId}`);
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <p className="text-[var(--color-700)]">Loading note...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--color-950)] mb-2">Note Not Found</h2>
            <p className="text-[var(--color-700)] mb-4">The note you're trying to edit doesn't exist.</p>
            <Button onClick={() => setLocation(`/project/${projectId}/notes`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const categoryInfo = categoryConfig[category as keyof typeof categoryConfig] || categoryConfig["Plot"];
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
      />

      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                onClick={() => setLocation(`/project/${projectId}/notes/${noteId}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-12 h-12 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <CategoryIcon className={`w-6 h-6 ${categoryInfo.textColor}`} />
                  </div>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="text-2xl font-bold bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] h-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent max-w-md"
                    placeholder="Note Title"
                  />
                </div>
                <div className="ml-13">
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-48 bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent">
                      <SelectValue>
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-4 h-4" />
                          <span>{category}</span>
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categoryConfig).map(([cat, config]) => {
                        const Icon = config.icon;
                        return (
                          <SelectItem key={cat} value={cat}>
                            <div className="flex items-center space-x-2">
                              <Icon className="w-4 h-4" />
                              <span>{cat}</span>
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                onClick={handleSave} 
                disabled={updateNoteMutation.isPending}
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateNoteMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
              <Button 
                onClick={handleCancel} 
                variant="outline"
                className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </div>

          {/* Tags Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Tag className="w-4 h-4 text-[var(--color-700)]" />
              <span className="text-sm font-medium text-gray-700">Tags</span>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]"
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                className="max-w-xs bg-[var(--color-50)] border-[var(--color-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                onKeyPress={(e) => e.key === 'Enter' && addTag()}
              />
              <Button
                onClick={addTag}
                variant="outline"
                size="sm"
                className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <Card className="bg-transparent">
            <CardContent className="space-y-6 pt-6">
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-950)] mb-3">Content</h3>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                  placeholder="Write your note content..."
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}