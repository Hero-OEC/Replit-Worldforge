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
import { insertLoreEntrySchema, type InsertLoreEntry, type ProjectWithStats } from "@shared/schema";
import { getRecommendedTags, analyzeContentForTags, getCategoryBaseTags } from "@shared/tag-recommendations";

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

export default function NewLoreEntry() {
  const { projectId } = useParams<{ projectId: string }>();
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

  const form = useForm<InsertLoreEntry>({
    resolver: zodResolver(insertLoreEntrySchema),
    defaultValues: {
      projectId: parseInt(projectId!),
      title: "",
      content: "",
      category: "",
      tags: []
    },
  });

  // Generate tag recommendations based on content
  useEffect(() => {
    const title = form.watch("title");
    const content = form.watch("content");
    const category = form.watch("category");
    
    if (content && content.length > 20) {
      const recommendations = getRecommendedTags(content || "", title || "", category || "");
      // Filter out tags that are already selected
      const newRecommendations = recommendations.filter(tag => !tags.includes(tag));
      setRecommendedTags(newRecommendations.slice(0, 6)); // Limit to 6 recommendations
      setShowRecommendations(newRecommendations.length > 0);
    } else {
      setRecommendedTags([]);
      setShowRecommendations(false);
    }
  }, [form.watch("title"), form.watch("content"), form.watch("category"), tags]);

  const createLoreEntryMutation = useMutation({
    mutationFn: async (data: InsertLoreEntry) => {
      return apiRequest("POST", "/api/lore-entries", { ...data, tags });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lore-entries", projectId] });
      toast({ title: "Lore entry created successfully!" });
      setLocation(`/project/${projectId}/lore`);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create lore entry", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: InsertLoreEntry) => {
    createLoreEntryMutation.mutate(data);
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
      setRecommendedTags(recommendedTags.filter(t => t !== tag));
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        rightContent={
          <Button
            variant="outline"
            onClick={() => setLocation(`/project/${projectId}/lore`)}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Lore
          </Button>
        }
      />

      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <span>Create New Lore Entry</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter lore entry title" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Write your lore entry content..."
                            className="min-h-[200px] resize-y"
                            value={field.value || ""}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div>
                    <FormLabel>Tags</FormLabel>
                    <div className="space-y-3">
                      <div className="flex space-x-2">
                        <Input
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Add a tag..."
                          className="flex-1"
                        />
                        <Button type="button" variant="outline" onClick={addTag}>
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <div
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 text-xs font-normal rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors duration-200"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:bg-slate-300 rounded p-0.5 transition-colors duration-200"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Tag Recommendations */}
                      {showRecommendations && recommendedTags.length > 0 && (
                        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                          <div className="flex items-center space-x-2 mb-2">
                            <Lightbulb className="w-4 h-4 text-blue-600" />
                            <span className="text-sm font-medium text-blue-700">Suggested Tags</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {recommendedTags.map((tag) => (
                              <button
                                key={tag}
                                type="button"
                                onClick={() => addRecommendedTag(tag)}
                                className="inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md bg-blue-100 text-blue-700 border border-blue-300 hover:bg-blue-200 hover:border-blue-400 transition-colors duration-200"
                              >
                                <Plus className="w-3 h-3 mr-1" />
                                {tag}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-3 pt-6">
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={() => setLocation(`/project/${projectId}/lore`)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createLoreEntryMutation.isPending}
                      className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                    >
                      {createLoreEntryMutation.isPending ? (
                        "Creating..."
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Create Entry
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}