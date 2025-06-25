import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
        searchPlaceholder="Search magic systems..."
      />
      
      <main className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-4 mb-8">
            <Button
              variant="ghost"
              onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
              className="p-2 hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <Sparkles className="h-8 w-8 text-orange-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Create Magic System</h1>
                <p className="text-gray-600">Define a new magical system for your world</p>
              </div>
            </div>
          </div>

          <Card className="bg-[var(--worldforge-card)] border border-[var(--border)]">
            <CardHeader>
              <CardTitle>Magic System Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Fire Magic, Elemental Control"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category *
                    </label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="magic">Magic System</SelectItem>
                        <SelectItem value="power">Power System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Overview of this magical system..."
                    rows={4}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Source
                    </label>
                    <Input
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      placeholder="e.g., Natural energy, Divine blessing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Cost
                    </label>
                    <Input
                      value={formData.cost}
                      onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                      placeholder="e.g., Life force, Mana crystals"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rules
                  </label>
                  <Textarea
                    value={formData.rules}
                    onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                    placeholder="How this magic system works, its mechanics..."
                    rows={4}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Limitations
                  </label>
                  <Textarea
                    value={formData.limitations}
                    onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
                    placeholder="What limits or restricts this magic..."
                    rows={4}
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createMutation.isPending || !formData.name.trim()}
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {createMutation.isPending ? "Creating..." : "Create Magic System"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}