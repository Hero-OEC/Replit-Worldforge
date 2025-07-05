import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, Sparkles, Zap, X, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import type { InsertMagicSystem, ProjectWithStats } from "@shared/schema";

interface MagicSystemFormData {
  name: string;
  category: string;
  description: string;
  rules: string;
  limitations: string;
  source: string;
  cost: string;
}

export default function NewMagicSystem() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const [formData, setFormData] = useState<MagicSystemFormData>({
    name: "",
    category: "magic",
    description: "",
    rules: "",
    limitations: "",
    source: "",
    cost: "",
  });

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertMagicSystem) => {
      const response = await fetch("/api/magic-systems", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create magic system");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", projectId] });
      toast({
        title: "Magic system created",
        description: "Your new magic system has been added successfully.",
      });
      setLocation(`/project/${projectId}/magic-systems`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create magic system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    createMutation.mutate({
      ...formData,
      projectId: parseInt(projectId!),
    });
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        
      />
      
      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost" 
                  onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Magic Systems
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="magic-system-form"
                  disabled={createMutation.isPending || !formData.name.trim()}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createMutation.isPending ? "Creating..." : "Create Magic System"}
                </Button>
              </div>
            </div>
          </div>

          {/* Header with Title Input */}
          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
                {formData.category === 'magic' ? (
                  <Sparkles className="w-6 h-6 text-[var(--color-700)]" />
                ) : (
                  <Zap className="w-6 h-6 text-[var(--color-700)]" />
                )}
              </div>
              <div className="flex-1 max-w-md">
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Magic System Name"
                  className="text-2xl font-bold bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] h-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                />
              </div>
            </div>

            {/* Category Selector */}
            <div className="ml-16">
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="w-48 bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="magic">Magic System</SelectItem>
                  <SelectItem value="power">Power System</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-[var(--color-100)]">
                  <TabsTrigger value="details" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Details</TabsTrigger>
                  <TabsTrigger value="rules" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Rules</TabsTrigger>
                  <TabsTrigger value="limitations" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Limitations</TabsTrigger>
                  <TabsTrigger value="source" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Source & Cost</TabsTrigger>
                </TabsList>

                <form id="magic-system-form" onSubmit={handleSubmit}>
                  <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Description</label>
                          <Textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                            placeholder="Describe the magic system..."
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="rules" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Rules</label>
                          <Textarea
                            value={formData.rules}
                            onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                            placeholder="Define the rules of the magic system..."
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="limitations" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Limitations</label>
                          <Textarea
                            value={formData.limitations}
                            onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                            placeholder="What are the limitations and weaknesses..."
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="source" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Source</label>
                          <Textarea
                            value={formData.source}
                            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-48"
                            placeholder="Where does this power come from..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Cost</label>
                          <Textarea
                            value={formData.cost}
                            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-48"
                            placeholder="What does it cost to use..."
                          />
                        </div>
                      </div>
                    </Card>
                  </TabsContent>
                </form>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}