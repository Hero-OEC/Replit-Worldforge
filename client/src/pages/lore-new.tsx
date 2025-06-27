import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Save, X, Plus, Minus } from "lucide-react";
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
                            <Badge key={tag} variant="secondary" className="flex items-center space-x-1">
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
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
                      className="bg-orange-500 text-white hover:bg-orange-600"
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