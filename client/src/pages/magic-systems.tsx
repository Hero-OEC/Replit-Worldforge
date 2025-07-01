import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import { Plus, Sparkles, Zap, Trash2, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/layout/navbar";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import type { MagicSystem, ProjectWithStats } from "@shared/schema";

function MagicSystemCard({ system, onDelete, projectId }: { 
  system: MagicSystem; 
  onDelete: (system: MagicSystem) => void;
  projectId: string;
}) {
  const { navigateWithHistory } = useNavigation();
  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" ? "bg-[var(--color-400)] text-[var(--color-950)]" : "bg-[var(--color-300)] text-[var(--color-900)]";
  };

  const CategoryIcon = getCategoryIcon(system.category || "magic");
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength).trim() + "...";
  };

  return (
    <Card 
      className="bg-[var(--color-100)] border border-[var(--color-300)] hover:shadow-lg transition-all duration-200 cursor-pointer group"
      onClick={() => navigateWithHistory(`/project/${projectId}/magic-systems/${system.id}`)}
    >
      <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 hover:scale-110 hover:shadow-lg group/icon">
                <CategoryIcon className="w-6 h-6 text-[var(--color-700)] transition-transform duration-300 group-hover/icon:bounce group-hover/icon:scale-110" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg font-semibold text-[var(--color-950)] group-hover:text-orange-600 transition-colors">
                    {system.name}
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(system);
                    }}
                    className="h-8 w-8 p-0 hover:bg-red-100 hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className={`${getCategoryColor(system.category || "magic")} text-xs font-medium mt-1`}>
                  {system.category === "power" ? "Power System" : "Magic System"}
                </Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {system.description && (
            <p className="text-sm text-[var(--color-700)] leading-relaxed">
              {truncateText(system.description, 150)}
            </p>
          )}
          <div className="flex items-center justify-between text-sm text-[var(--color-600)] mt-4">
            <span>{system.category === "power" ? "Power system" : "Magic system"}</span>
            <span className="font-medium">Click to view details</span>
          </div>
        </CardContent>
      </Card>
  );
}

export default function MagicSystems() {
  const { projectId } = useParams<{ projectId: string }>();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { navigateWithHistory } = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [systemToDelete, setSystemToDelete] = useState<MagicSystem | null>(null);

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

  const handleDelete = (system: MagicSystem) => {
    setSystemToDelete(system);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (systemToDelete) {
      deleteMutation.mutate(systemToDelete.id);
      setDeleteDialogOpen(false);
      setSystemToDelete(null);
    }
  };

  const filteredMagicSystems = magicSystems.filter(system => {
    if (selectedCategory === "all") return true;
    return system.category === selectedCategory;
  });

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
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[var(--color-600)] cursor-pointer group">
                <Sparkles className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[var(--color-950)] mb-2">Magic & Power Systems</h1>
                <p className="text-[var(--color-700)]">
                  Document magical rules, power sources, limitations, and costs for your world.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="magic">Magic Systems</SelectItem>
                  <SelectItem value="power">Power Systems</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
                onClick={() => navigateWithHistory(`/project/${projectId}/magic-systems/new`)}
              >
                <Plus className="h-4 w-4 mr-2" />
                New Magic System
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <div className="p-6 pt-0">
                    <div className="space-y-3">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredMagicSystems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMagicSystems.map((system) => (
                <MagicSystemCard
                  key={system.id}
                  system={system}
                  onDelete={handleDelete}
                  projectId={projectId!}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Sparkles className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
              <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No magic systems yet</h3>
              <p className="text-[var(--color-600)] mb-6">
                Start building your world's magical framework by creating your first magic system.
              </p>
              <Link href={`/project/${projectId}/magic-systems/new`}>
                <Button className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Magic System
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>

      {systemToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete Magic System"
          itemName={systemToDelete.name}
          description={`Are you sure you want to delete "${systemToDelete.name}"? This action cannot be undone and will permanently remove the magic system and all associated data.`}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}