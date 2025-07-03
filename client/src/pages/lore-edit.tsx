import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, X, Plus, Minus, Lightbulb } from "lucide-react";
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
import { insertLoreEntrySchema, type InsertLoreEntry, type ProjectWithStats, type LoreEntry } from "@shared/schema";

const categories = [
  "History",
  "Religion",
  "Politics", 
  "Culture",
  "Geography",
  "Artifacts",
  "Prophecies",
  "Institutions",
  "Legends",
  "Customs"
];

export default function EditLoreEntry() {
  const { projectId, loreId } = useParams<{ projectId: string; loreId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [recommendedTags, setRecommendedTags] = useState<string[]>([]);
  const [showRecommendations, setShowRecommendations] = useState(false);

  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  const { data: loreEntry, isLoading } = useQuery<LoreEntry>({
    queryKey: ["/api/lore-entries", loreId],
    queryFn: async () => {
      const response = await fetch(`/api/lore-entries/${loreId}`);
      if (!response.ok) throw new Error("Failed to fetch lore entry");
      return response.json();
    },
  });

  const form = useForm<InsertLoreEntry>({
    resolver: zodResolver(insertLoreEntrySchema),
    defaultValues: {
      projectId: parseInt(projectId || "0"),
      title: "",
      content: "",
      category: "",
      tags: []
    },
  });

  // Initialize form with lore entry data when loaded
  useEffect(() => {
    if (loreEntry) {
      form.reset({
        projectId: loreEntry.projectId,
        title: loreEntry.title || "",
        content: loreEntry.content || "",
        category: loreEntry.category || "",
        tags: loreEntry.tags || []
      });
      setTags(loreEntry.tags || []);
    }
  }, [loreEntry, form]);

  const updateLoreEntryMutation = useMutation({
    mutationFn: async (data: InsertLoreEntry) => {
      return apiRequest("PUT", `/api/lore-entries/${loreId}`, { ...data, tags });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lore-entries", projectId] });
      queryClient.invalidateQueries({ queryKey: ["/api/lore-entries", loreId] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      toast({ title: "Lore entry updated successfully!" });
      setLocation(`/project/${projectId}/lore/${loreId}`);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update lore entry", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSave = async (data: InsertLoreEntry) => {
    updateLoreEntryMutation.mutate(data);
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

  const addRecommendedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  // Simple tag recommendations based on category
  useEffect(() => {
    const currentCategory = form.watch("category") || "";
    
    if (currentCategory) {
      const categoryBasedTags: { [key: string]: string[] } = {
        "History": ["ancient", "war", "empire", "legacy"],
        "Religion": ["gods", "temple", "ritual", "faith"],
        "Politics": ["kingdom", "ruler", "law", "power"],
        "Culture": ["tradition", "custom", "ceremony", "community"],
        "Geography": ["mountains", "rivers", "cities", "regions"],
        "Artifacts": ["magical", "ancient", "powerful", "legendary"],
        "Prophecies": ["future", "fate", "destiny", "oracle"],
        "Institutions": ["academy", "guild", "organization", "learning"],
        "Legends": ["heroes", "myths", "stories", "epic"],
        "Customs": ["festival", "celebration", "ritual", "tradition"]
      };
      
      const suggestedTags = categoryBasedTags[currentCategory] || [];
      const filteredSuggestions = suggestedTags.filter(tag => !tags.includes(tag));
      setRecommendedTags(filteredSuggestions);
      setShowRecommendations(filteredSuggestions.length > 0);
    } else {
      setRecommendedTags([]);
      setShowRecommendations(false);
    }
  }, [form.watch("category"), tags]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!loreEntry) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--color-950)] mb-2">Lore Entry Not Found</h2>
            <p className="text-[var(--color-700)] mb-4">The lore entry you're trying to edit doesn't exist.</p>
            <Button onClick={() => setLocation(`/project/${projectId}/lore`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lore
            </Button>
          </div>
        </main>
      </div>
    );
  }

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
                onClick={() => setLocation(`/project/${projectId}/lore/${loreId}`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-950)]">Edit Lore Entry</h1>
                <p className="text-[var(--color-700)]">Update your world's knowledge and history</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setLocation(`/project/${projectId}/lore/${loreId}`)}
                className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={form.handleSubmit(handleSave)}
                disabled={updateLoreEntryMutation.isPending}
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
              >
                <Save className="w-4 h-4 mr-2" />
                {updateLoreEntryMutation.isPending ? "Updating..." : "Update Entry"}
              </Button>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Basic Information */}
                  <Card className="bg-[var(--color-100)] border border-[var(--color-300)]">
                    <CardHeader>
                      <CardTitle className="text-xl text-[var(--color-950)]">Basic Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[var(--color-800)]">Title</FormLabel>
                            <FormControl>
                              <Input 
                                {...field} 
                                value={field.value || ""}
                                placeholder="Enter the lore entry title..."
                                className="bg-white border-[var(--color-300)] focus:border-[var(--color-500)]"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-[var(--color-800)]">Category</FormLabel>
                            <FormControl>
                              <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className="bg-white border-[var(--color-300)] focus:border-[var(--color-500)]">
                                  <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>

                  {/* Content */}
                  <Card className="bg-[var(--color-100)] border border-[var(--color-300)]">
                    <CardHeader>
                      <CardTitle className="text-xl text-[var(--color-950)]">Content</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Textarea 
                                {...field}
                                value={field.value || ""}
                                placeholder="Write your lore entry content here..."
                                className="min-h-[300px] bg-white border-[var(--color-300)] focus:border-[var(--color-500)] resize-none"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Tags */}
                  <Card className="bg-[var(--color-100)] border border-[var(--color-300)]">
                    <CardHeader>
                      <CardTitle className="text-lg text-[var(--color-950)]">Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {/* Current Tags */}
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="bg-[var(--color-200)] text-[var(--color-800)] hover:bg-[var(--color-300)] transition-colors"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 hover:text-red-600"
                              >
                                <Minus className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}

                      {/* Add New Tag */}
                      <div className="flex space-x-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag..."
                          className="flex-1 bg-white border-[var(--color-300)]"
                          onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={addTag}
                          className="border-[var(--color-300)] hover:bg-[var(--color-100)]"
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Recommended Tags */}
                      {showRecommendations && recommendedTags.length > 0 && (
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Lightbulb className="w-4 h-4 text-yellow-500" />
                            <span className="text-sm font-medium text-[var(--color-700)]">Suggested Tags</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recommendedTags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="cursor-pointer border-[var(--color-400)] text-[var(--color-700)] hover:bg-[var(--color-200)] transition-colors"
                                onClick={() => addRecommendedTag(tag)}
                              >
                                {tag}
                                <Plus className="w-3 h-3 ml-1" />
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}