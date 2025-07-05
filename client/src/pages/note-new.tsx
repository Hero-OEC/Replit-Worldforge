import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, FileText, BookOpen, Users, Search, Scroll, Tag, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import type { ProjectWithStats } from "@shared/schema";

// Category configuration for consistent styling
const categoryConfig = {
  "Plot": {
    icon: BookOpen,
    bgColor: "bg-[var(--color-200)]",
    textColor: "text-[var(--color-700)]"
  },
  "Characters": {
    icon: Users,
    bgColor: "bg-[var(--color-200)]",
    textColor: "text-[var(--color-700)]"
  },
  "World Building": {
    icon: Search,
    bgColor: "bg-[var(--color-200)]",
    textColor: "text-[var(--color-700)]"
  },
  "Research": {
    icon: Scroll,
    bgColor: "bg-[var(--color-200)]",
    textColor: "text-[var(--color-700)]"
  }
};

interface NoteFormData {
  title: string;
  category: string;
  content: string;
  tags: string[];
}

export default function NewNote() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<NoteFormData>({
    title: "",
    category: "Plot",
    content: "",
    tags: [],
  });
  const [newTag, setNewTag] = useState("");

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: Omit<NoteFormData, "tags"> & { tags: string }) => {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          projectId: parseInt(projectId!),
        }),
      });
      if (!response.ok) throw new Error("Failed to create note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes"] });
      toast({
        title: "Note created",
        description: "Your note has been created successfully.",
      });
      setLocation(`/project/${projectId}/notes`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create note. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a title for your note.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      title: formData.title.trim(),
      category: formData.category,
      content: formData.content,
      tags: formData.tags.join(","),
    });
  };

  const getCategoryIcon = (category: string) => {
    return categoryConfig[category as keyof typeof categoryConfig]?.icon || FileText;
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({ 
      ...formData, 
      tags: formData.tags.filter(tag => tag !== tagToRemove) 
    });
  };

  const CategoryIcon = getCategoryIcon(formData.category);

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search notes..."
      />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost" 
                  onClick={() => setLocation(`/project/${projectId}/notes`)}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Notes
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  type="submit"
                  form="note-form"
                  disabled={createMutation.isPending || !formData.title.trim()}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createMutation.isPending ? "Creating..." : "Create Note"}
                </Button>
              </div>
            </div>
          </div>

          <form id="note-form" onSubmit={handleSave} className="space-y-6">
            {/* Header with Title Input */}
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
                  <CategoryIcon className="w-6 h-6 text-[var(--color-700)]" />
                </div>
                <div className="flex-1 max-w-md">
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Note Title"
                    className="text-2xl font-bold bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] h-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                  />
                </div>
              </div>

              {/* Category Selector */}
              <div className="ml-16">
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger className="w-48 bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent">
                    <SelectValue>
                      <div className="flex items-center space-x-2">
                        <CategoryIcon className="w-4 h-4" />
                        <span>{formData.category}</span>
                      </div>
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryConfig).map(([category, config]) => {
                      const Icon = config.icon;
                      return (
                        <SelectItem key={category} value={category}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <span>{category}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Tags Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-gray-700">Tags</span>
              </div>
              <div className="space-y-3">
                {/* Current Tags */}
                {formData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 bg-[var(--color-200)] border-[var(--color-400)] text-[var(--color-800)]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="text-[var(--color-600)] hover:text-[var(--color-800)] transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                {/* Tag Input */}
                <div className="space-y-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a new tag..."
                    className="text-sm text-[var(--color-800)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all placeholder:text-[var(--color-600)]"
                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-gray-700">Content</span>
              </div>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write your note content here..."
                className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent resize-none min-h-96"
              />
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}