import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, X, Plus, BookOpen, Users, Search, Scroll, FileText, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import Navbar from "@/components/layout/navbar";
import { useNavigationTracker } from "@/contexts/navigation-context";
import { apiRequest } from "@/lib/queryClient";
import { insertNoteSchema, type InsertNote, type ProjectWithStats, type Note } from "@shared/schema";

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
    textColor: "text-[var(--color-700)]", 
    borderColor: "border-[var(--color-300)]" 
  },
  "Characters": { 
    icon: Users, 
    color: "bg-[var(--color-200)]", 
    bgColor: "bg-[var(--color-100)]", 
    textColor: "text-[var(--color-700)]", 
    borderColor: "border-[var(--color-400)]" 
  },
  "World Building": { 
    icon: Search, 
    color: "bg-[var(--color-200)]", 
    bgColor: "bg-[var(--color-200)]", 
    textColor: "text-[var(--color-700)]", 
    borderColor: "border-[var(--color-500)]" 
  },
  "Research": { 
    icon: Scroll, 
    color: "bg-[var(--color-200)]", 
    bgColor: "bg-[var(--color-100)]", 
    textColor: "text-[var(--color-700)]", 
    borderColor: "border-[var(--color-300)]" 
  }
};

export default function EditNote() {
  const { projectId, noteId } = useParams<{ projectId: string; noteId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  // Fetch the specific note from API
  const { data: note } = useQuery({
    queryKey: ['/api/notes', noteId],
    queryFn: async () => {
      const res = await fetch(`/api/notes/${noteId}`);
      if (!res.ok) throw new Error('Failed to fetch note');
      return res.json();
    },
    enabled: !!noteId,
  });

  const form = useForm<InsertNote>({
    resolver: zodResolver(insertNoteSchema),
    defaultValues: {
      projectId: parseInt(projectId!),
      title: "",
      content: "",
      category: "Plot",
      tags: "",
    },
  });

  // Update form when note data is loaded
  useEffect(() => {
    if (note) {
      form.reset({
        projectId: note.projectId,
        title: note.title || "",
        content: note.content || "",
        category: note.category || "Plot",
        tags: note.tags || "",
      });
      
      // Parse tags from comma-separated string
      if (note.tags && note.tags.trim()) {
        setTags(note.tags.split(',').map(tag => tag.trim()));
      } else {
        setTags([]);
      }
    }
  }, [note, form]);

  const updateNoteMutation = useMutation({
    mutationFn: async (data: InsertNote) => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          tags: tags.join(', '), // Convert tags array back to comma-separated string
        }),
      });
      if (!response.ok) throw new Error('Failed to update note');
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Note updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/notes'] });
      queryClient.invalidateQueries({ queryKey: ['/api/notes', noteId] });
      setLocation(`/project/${projectId}/notes/${noteId}`);
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update note",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertNote) => {
    updateNoteMutation.mutate(data);
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

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
            <p className="text-[var(--color-700)] mb-4">The note you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation(`/project/${projectId}/notes`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const selectedCategory = form.watch("category") || "Plot";
  const categoryInfo = categoryConfig[selectedCategory as keyof typeof categoryConfig] || categoryConfig["Plot"];
  const CategoryIcon = categoryInfo.icon;

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        rightContent={
          <Button 
            onClick={form.handleSubmit(onSubmit)}
            disabled={updateNoteMutation.isPending}
            className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
          >
            <Save className="w-4 h-4 mr-2" />
            {updateNoteMutation.isPending ? "Saving..." : "Save Note"}
          </Button>
        }
      />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost" 
                  onClick={() => setLocation(`/project/${projectId}/notes/${noteId}`)}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Note
                </Button>
              </div>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Header with icon and title */}
              <div className="flex items-center space-x-4 mb-8">
                <div className={`w-12 h-12 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm`}>
                  <CategoryIcon className="w-6 h-6 text-[var(--color-700)]" />
                </div>
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="Note title..."
                            className="text-3xl font-bold border-none bg-transparent p-0 focus:ring-0 focus:outline-none text-[var(--color-950)] placeholder:text-[var(--color-400)] max-w-md"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Category Selection */}
              <div className="mb-6">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center space-x-2 mb-3">
                        <CategoryIcon className="w-5 h-5 text-[var(--color-700)]" />
                        <span className="text-xl font-medium text-[var(--color-700)]">Category</span>
                      </div>
                      <FormControl>
                        <Select
                          value={field.value || "Plot"}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-64 bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent className="bg-[var(--color-50)] border-[var(--color-300)]">
                            {categories.map((category) => {
                              const config = categoryConfig[category as keyof typeof categoryConfig];
                              const Icon = config.icon;
                              return (
                                <SelectItem key={category} value={category} className="text-[var(--color-950)] hover:bg-[var(--color-100)]">
                                  <div className="flex items-center space-x-2">
                                    <Icon className="w-4 h-4 text-[var(--color-700)]" />
                                    <span>{category}</span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Content Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <FileText className="w-5 h-5 text-[var(--color-700)]" />
                  <span className="text-xl font-medium text-[var(--color-700)]">Content</span>
                </div>
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value || ""}
                          placeholder="Write your note content here..."
                          className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent resize-none min-h-96"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Tags Section */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-5 h-5 text-[var(--color-700)]" />
                  <span className="text-xl font-medium text-[var(--color-700)]">Tags</span>
                </div>
                
                {/* Display existing tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-[var(--color-200)] text-[var(--color-800)] border border-[var(--color-300)] hover:bg-[var(--color-300)] transition-colors duration-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-2 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
                
                {/* Add new tag */}
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add a tag..."
                    className="flex-1 bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                  />
                  <Button
                    type="button"
                    onClick={addTag}
                    variant="outline"
                    className="bg-[var(--color-100)] border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-200)] hover:text-[var(--color-950)]"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}