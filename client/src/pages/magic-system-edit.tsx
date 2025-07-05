import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ArrowLeft, Save, Sparkles, Zap, X, Battery } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import type { MagicSystem, InsertMagicSystem, ProjectWithStats } from "@shared/schema";

interface MagicSystemFormData {
  name: string;
  category: string;
  description: string;
  rules: string;
  limitations: string;
  source: string;
  cost: string;
}

export default function EditMagicSystem() {
  const { projectId, magicSystemId } = useParams<{ projectId: string; magicSystemId: string }>();
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

  const { data: magicSystem, isLoading } = useQuery<MagicSystem>({
    queryKey: ["/api/magic-systems", magicSystemId],
    queryFn: async () => {
      const response = await fetch(`/api/magic-systems/${magicSystemId}`);
      if (!response.ok) throw new Error("Failed to fetch magic system");
      return response.json();
    },
  });

  useEffect(() => {
    if (magicSystem) {
      setFormData({
        name: magicSystem.name,
        category: magicSystem.category || "magic",
        description: magicSystem.description || "",
        rules: magicSystem.rules || "",
        limitations: magicSystem.limitations || "",
        source: magicSystem.source || "",
        cost: magicSystem.cost || "",
      });
    }
  }, [magicSystem]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<InsertMagicSystem>) => {
      const response = await fetch(`/api/magic-systems/${magicSystemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update magic system");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", projectId] });
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", magicSystemId] });
      toast({
        title: "Magic system updated",
        description: "Your changes have been saved successfully.",
      });
      setLocation(`/project/${projectId}/magic-systems`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update magic system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    
    updateMutation.mutate(formData);
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
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-64 bg-gray-200 rounded"></div>
            </div>
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
                  onClick={() => setLocation(`/project/${projectId}/magic-systems/${magicSystemId}`)}
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button
                  type="submit"
                  form="magic-system-form"
                  disabled={updateMutation.isPending || !formData.name.trim()}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {updateMutation.isPending ? "Saving..." : "Save Changes"}
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

          <form id="magic-system-form" onSubmit={handleSubmit}>
            {/* Description Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-gray-700">Description</span>
              </div>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                placeholder="Overview of this magical system..."
              />
            </div>

            {/* Rules Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Zap className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-gray-700">Rules & Mechanics</span>
              </div>
              <textarea
                value={formData.rules}
                onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
                className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                placeholder="How this magic system works, its mechanics..."
              />
            </div>

            {/* Limitations Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <X className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-gray-700">Limitations</span>
              </div>
              <textarea
                value={formData.limitations}
                onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
                className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                placeholder="What limits or restricts this magic..."
              />
            </div>

            {/* Source and Cost Section */}
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Battery className="w-5 h-5 text-[var(--color-700)]" />
                <span className="text-xl font-medium text-gray-700">Source & Cost</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Source</label>
                  <Input
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                    placeholder="e.g., Natural energy, Divine blessing"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Cost</label>
                  <Input
                    value={formData.cost}
                    onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                    className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                    placeholder="e.g., Life force, Mana crystals"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}