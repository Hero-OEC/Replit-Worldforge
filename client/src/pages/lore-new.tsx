import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, X, Plus, Minus, Lightbulb, Tag, Calendar, Church, Crown, Users, MapPin, Gem, Eye, GraduationCap, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import Navbar from "@/components/layout/navbar";
import { useNavigationTracker } from "@/contexts/navigation-context";
import { apiRequest } from "@/lib/queryClient";
import { insertLoreEntrySchema, type InsertLoreEntry, type ProjectWithStats } from "@shared/schema";

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

const categoryConfig = {
  "History": { icon: Calendar, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Religion": { icon: Church, color: "bg-[var(--color-700)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-400)]" },
  "Politics": { icon: Crown, color: "bg-[var(--color-800)]", bgColor: "bg-[var(--color-200)]", textColor: "text-[var(--color-950)]", borderColor: "border-[var(--color-500)]" },
  "Culture": { icon: Users, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Geography": { icon: MapPin, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Artifacts": { icon: Gem, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Prophecies": { icon: Eye, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Institutions": { icon: GraduationCap, color: "bg-[var(--color-700)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-400)]" },
  "Legends": { icon: Sparkles, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Customs": { icon: Heart, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" }
};

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

  // Dynamic tag recommendations based on category and content
  useEffect(() => {
    const currentCategory = form.watch("category") || "";
    const currentContent = form.watch("content") || "";
    const currentTitle = form.watch("title") || "";
    
    if (currentCategory) {
      const categoryBasedTags: { [key: string]: string[] } = {
        "History": ["ancient", "war", "empire", "legacy", "battle", "chronicle"],
        "Religion": ["gods", "temple", "ritual", "faith", "divine", "sacred"],
        "Politics": ["kingdom", "ruler", "law", "power", "royal", "court"],
        "Culture": ["tradition", "custom", "ceremony", "community", "festival", "heritage"],
        "Geography": ["mountains", "rivers", "cities", "regions", "landscape", "territory"],
        "Artifacts": ["magical", "ancient", "powerful", "legendary", "enchanted", "relic"],
        "Prophecies": ["future", "fate", "destiny", "oracle", "vision", "foretelling"],
        "Institutions": ["academy", "guild", "organization", "learning", "school", "order"],
        "Legends": ["heroes", "myths", "stories", "epic", "folklore", "tales"],
        "Customs": ["festival", "celebration", "ritual", "tradition", "ceremony", "practice"]
      };
      
      // Get base suggestions from category
      let suggestedTags = categoryBasedTags[currentCategory] || [];
      
      // Add content-based suggestions
      const contentWords = (currentTitle + " " + currentContent).toLowerCase();
      const contentSuggestions: string[] = [];
      
      // Check for common themes in content
      if (contentWords.includes("magic") || contentWords.includes("spell")) contentSuggestions.push("magical");
      if (contentWords.includes("war") || contentWords.includes("battle")) contentSuggestions.push("conflict");
      if (contentWords.includes("king") || contentWords.includes("queen")) contentSuggestions.push("royal");
      if (contentWords.includes("dragon") || contentWords.includes("beast")) contentSuggestions.push("creatures");
      if (contentWords.includes("secret") || contentWords.includes("hidden")) contentSuggestions.push("mystery");
      if (contentWords.includes("love") || contentWords.includes("romance")) contentSuggestions.push("romance");
      if (contentWords.includes("death") || contentWords.includes("dark")) contentSuggestions.push("dark");
      if (contentWords.includes("light") || contentWords.includes("bright")) contentSuggestions.push("light");
      
      // Combine and deduplicate
      const allSuggestions = [...suggestedTags, ...contentSuggestions];
      const uniqueSuggestions = allSuggestions.filter((tag, index) => allSuggestions.indexOf(tag) === index);
      const filteredSuggestions = uniqueSuggestions.filter(tag => !tags.includes(tag));
      
      setRecommendedTags(filteredSuggestions.slice(0, 8)); // Limit to 8 suggestions
      setShowRecommendations(filteredSuggestions.length > 0);
    } else {
      setRecommendedTags([]);
      setShowRecommendations(false);
    }
  }, [form.watch("category"), form.watch("content"), form.watch("title"), tags]);

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

  const currentCategory = form.watch("category") || "";
  const categoryInfo = categoryConfig[currentCategory as keyof typeof categoryConfig] || categoryConfig["History"];
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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {/* Header with buttons - matching lore detail layout */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-4">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                    onClick={() => setLocation(`/project/${projectId}/lore`)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back
                  </Button>
                  <div>
                    <div className="flex items-center space-x-3 mb-2">
                      <div className={`w-10 h-10 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <CategoryIcon className="w-5 h-5 text-[var(--color-50)]" />
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
                                  placeholder="Enter the lore entry title..."
                                  className="text-3xl font-bold text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all"
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    <div className="ml-13">
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Select value={field.value || ""} onValueChange={field.onChange}>
                                <SelectTrigger className={`w-auto ${categoryInfo.bgColor} ${categoryInfo.textColor} border-0 focus:ring-0 h-auto p-2 rounded-full text-sm font-medium`}>
                                  <SelectValue placeholder="Select category" />
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
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setLocation(`/project/${projectId}/lore`)}
                    className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={createLoreEntryMutation.isPending}
                    className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {createLoreEntryMutation.isPending ? "Creating..." : "Create Entry"}
                  </Button>
                </div>
              </div>

              {/* Tags Section - matching lore detail layout */}
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-4 h-4 text-[var(--color-700)]" />
                  <span className="text-sm font-medium text-gray-700">Tags</span>
                </div>
                
                {/* Current Tags */}
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:text-red-600"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
                
                {/* Add Tag Input - Fixed position */}
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a new tag..."
                      className="text-sm text-[var(--color-800)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] transition-all placeholder:text-[var(--color-600)]"
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addTag}
                      className="border-[var(--color-300)] text-[var(--color-600)] hover:bg-[var(--color-100)] hover:text-[var(--color-800)] transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Recommended Tags */}
                {showRecommendations && recommendedTags.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Lightbulb className="w-4 h-4 text-[var(--color-600)]" />
                      <span className="text-sm font-medium text-[var(--color-700)]">Suggested for {form.watch("category") || "this category"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {recommendedTags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-[var(--color-150)] border-[var(--color-400)] text-[var(--color-800)] hover:bg-[var(--color-200)] hover:border-[var(--color-500)] cursor-pointer"
                          onClick={() => addRecommendedTag(tag)}
                        >
                          {tag}
                          <Plus className="w-3 h-3" />
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Content Section - matching lore detail layout */}
              <Card className="bg-transparent">
                <CardContent className="space-y-6 pt-6">
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--color-950)] mb-3">Content</h3>
                    <div className="prose max-w-none">
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
                                className="min-h-[300px] text-[var(--color-800)] leading-relaxed whitespace-pre-wrap bg-[var(--color-50)] border-[var(--color-300)] focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] resize-none transition-all placeholder:text-[var(--color-600)]"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </main>
    </div>
  );
}