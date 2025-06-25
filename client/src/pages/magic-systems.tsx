import { useState } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Sparkles, Wand2, Edit3, Trash2, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import type { MagicSystem, InsertMagicSystem, ProjectWithStats } from "@shared/schema";

interface MagicSystemFormData {
  name: string;
  description: string;
  rules: string;
  limitations: string;
  source: string;
  cost: string;
}

function MagicSystemCard({ system, onEdit, onDelete }: { 
  system: MagicSystem; 
  onEdit: (system: MagicSystem) => void;
  onDelete: (id: number) => void;
}) {
  return (
    <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Wand2 className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg font-semibold text-gray-900">{system.name}</CardTitle>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(system)}
              className="h-8 w-8 p-0 hover:bg-gray-100"
            >
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(system.id)}
              className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {system.description && (
          <p className="text-sm text-gray-600 leading-relaxed">{system.description}</p>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {system.source && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-blue-800 mb-1">Source</h4>
              <p className="text-sm text-blue-700">{system.source}</p>
            </div>
          )}
          
          {system.cost && (
            <div className="bg-red-50 p-3 rounded-lg">
              <h4 className="text-xs font-medium text-red-800 mb-1">Cost</h4>
              <p className="text-sm text-red-700">{system.cost}</p>
            </div>
          )}
        </div>
        
        {system.rules && (
          <div className="bg-green-50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-green-800 mb-1">Rules</h4>
            <p className="text-sm text-green-700">{system.rules}</p>
          </div>
        )}
        
        {system.limitations && (
          <div className="bg-yellow-50 p-3 rounded-lg">
            <h4 className="text-xs font-medium text-yellow-800 mb-1">Limitations</h4>
            <p className="text-sm text-yellow-700">{system.limitations}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MagicSystemForm({ 
  initialData, 
  onSubmit, 
  onCancel, 
  isLoading 
}: {
  initialData?: Partial<MagicSystemFormData>;
  onSubmit: (data: MagicSystemFormData) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [formData, setFormData] = useState<MagicSystemFormData>({
    name: initialData?.name || "",
    description: initialData?.description || "",
    rules: initialData?.rules || "",
    limitations: initialData?.limitations || "",
    source: initialData?.source || "",
    cost: initialData?.cost || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Overview of this magical system..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Source
          </label>
          <Input
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            placeholder="e.g., Natural energy, Divine blessing"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
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
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Rules
        </label>
        <Textarea
          value={formData.rules}
          onChange={(e) => setFormData({ ...formData, rules: e.target.value })}
          placeholder="How this magic system works, its mechanics..."
          rows={3}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Limitations
        </label>
        <Textarea
          value={formData.limitations}
          onChange={(e) => setFormData({ ...formData, limitations: e.target.value })}
          placeholder="What limits or restricts this magic..."
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || !formData.name.trim()}>
          {isLoading ? "Saving..." : "Save Magic System"}
        </Button>
      </div>
    </form>
  );
}

export default function MagicSystems() {
  const { projectId } = useParams<{ projectId: string }>();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<MagicSystem | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const { data: magicSystems = [], isLoading } = useQuery<MagicSystem[]>({
    queryKey: ["/api/magic-systems", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/magic-systems?projectId=${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch magic systems");
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
      setIsCreateDialogOpen(false);
      toast({
        title: "Magic system created",
        description: "Your new magic system has been added successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create magic system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<InsertMagicSystem> }) => {
      const response = await fetch(`/api/magic-systems/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update magic system");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", projectId] });
      setEditingSystem(null);
      toast({
        title: "Magic system updated",
        description: "Your changes have been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update magic system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/magic-systems/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete magic system");
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", projectId] });
      toast({
        title: "Magic system deleted",
        description: "The magic system has been removed successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete magic system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleCreate = (data: MagicSystemFormData) => {
    createMutation.mutate({
      ...data,
      projectId: parseInt(projectId!),
    });
  };

  const handleUpdate = (data: MagicSystemFormData) => {
    if (!editingSystem) return;
    updateMutation.mutate({
      id: editingSystem.id,
      data,
    });
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this magic system?")) {
      deleteMutation.mutate(id);
    }
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
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Magic & Power Systems</h1>
              <p className="text-gray-600">
                Document magical rules, power sources, limitations, and costs for your world.
              </p>
            </div>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Magic System
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Magic System</DialogTitle>
                </DialogHeader>
                <MagicSystemForm
                  onSubmit={handleCreate}
                  onCancel={() => setIsCreateDialogOpen(false)}
                  isLoading={createMutation.isPending}
                />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : magicSystems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {magicSystems.map((system) => (
                <MagicSystemCard
                  key={system.id}
                  system={system}
                  onEdit={setEditingSystem}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No magic systems yet</h3>
              <p className="text-gray-500 mb-6">
                Start building your world's magical framework by creating your first magic system.
              </p>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Magic System
              </Button>
            </div>
          )}

          {/* Edit Dialog */}
          <Dialog open={!!editingSystem} onOpenChange={() => setEditingSystem(null)}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Magic System</DialogTitle>
              </DialogHeader>
              {editingSystem && (
                <MagicSystemForm
                  initialData={{
                    name: editingSystem.name,
                    description: editingSystem.description || "",
                    rules: editingSystem.rules || "",
                    limitations: editingSystem.limitations || "",
                    source: editingSystem.source || "",
                    cost: editingSystem.cost || "",
                  }}
                  onSubmit={handleUpdate}
                  onCancel={() => setEditingSystem(null)}
                  isLoading={updateMutation.isPending}
                />
              )}
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  );
}