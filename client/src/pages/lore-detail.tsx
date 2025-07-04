import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Trash2, Calendar, Tag, Folder, Crown, Church, Users, MapPin, Gem, Eye, GraduationCap, Sparkles, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useNavigationTracker } from "@/contexts/navigation-context";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { LoreEntry, ProjectWithStats } from "@shared/schema";

// Category icons and colors - matching main page styling
const categoryConfig = {
  "History": { icon: Calendar, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Religion": { icon: Church, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-400)]" },
  "Politics": { icon: Crown, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-200)]", textColor: "text-[var(--color-950)]", borderColor: "border-[var(--color-500)]" },
  "Culture": { icon: Users, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Geography": { icon: MapPin, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Artifacts": { icon: Gem, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Prophecies": { icon: Eye, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Institutions": { icon: GraduationCap, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-400)]" },
  "Legends": { icon: Sparkles, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" },
  "Customs": { icon: Heart, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-300)]" }
};

export default function LoreDetail() {
  const { projectId, loreId } = useParams<{ projectId: string; loreId: string }>();
  const [, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const queryClient = useQueryClient();

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

  const deleteLoreEntryMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("DELETE", `/api/lore-entries/${loreId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lore-entries", projectId] });
      toast({ title: "Lore entry deleted successfully!" });
      setLocation(`/project/${projectId}/lore`);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete lore entry", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteLoreEntryMutation.mutate();
    setDeleteDialogOpen(false);
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
            <p className="text-[var(--color-700)] mb-4">The lore entry you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation(`/project/${projectId}/lore`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Lore
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const categoryInfo = categoryConfig[loreEntry.category as keyof typeof categoryConfig] || categoryConfig["History"];
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
          {/* Header with buttons */}
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
                    <CategoryIcon className={`w-5 h-5 ${categoryInfo.textColor}`} />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800">{loreEntry.title}</h1>
                </div>
                <div className="ml-13">
                  <Badge 
                    variant="secondary" 
                    className={`${categoryInfo.bgColor} ${categoryInfo.textColor} border-0`}
                  >
                    {loreEntry.category}
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setLocation(`/project/${projectId}/lore/${loreId}/edit`)} 
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Lore
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleteLoreEntryMutation.isPending}
                className="text-destructive border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
          {/* Tags */}
          {loreEntry.tags && loreEntry.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-[var(--color-700)]" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {loreEntry.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Card className="bg-transparent">
            <CardContent className="space-y-6 pt-6">
              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-950)] mb-3">Content</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {loreEntry.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      {loreEntry && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete Lore Entry"
          itemName={loreEntry.title}
          description={`Are you sure you want to delete "${loreEntry.title}"? This action cannot be undone and will permanently remove the lore entry.`}
          isDeleting={deleteLoreEntryMutation.isPending}
        />
      )}
    </div>
  );
}