import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  BookOpen, 
  Calendar, 
  Crown, 
  Church, 
  Users, 
  MapPin, 
  Gem, 
  Eye, 
  GraduationCap,
  Sparkles,
  Heart,
  Trash2,
  Clock,
  Tag,
  Edit3,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import type { LoreEntry, ProjectWithStats } from "@shared/schema";

// Category icons and colors
const categoryConfig = {
  "History": { icon: Calendar, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Religion": { icon: Church, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Politics": { icon: Crown, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Culture": { icon: Users, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Geography": { icon: MapPin, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Artifacts": { icon: Gem, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Prophecies": { icon: Eye, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Institutions": { icon: GraduationCap, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Legends": { icon: Sparkles, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" },
  "Customs": { icon: Heart, color: "bg-[var(--color-200)]", bgColor: "bg-[var(--color-100)]", textColor: "text-[var(--color-700)]" }
};

export default function Lore() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deleteLoreId, setDeleteLoreId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  const { data: loreEntries = [], isLoading } = useQuery<LoreEntry[]>({
    queryKey: ["/api/lore-entries", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/lore-entries?projectId=${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch lore entries');
      return response.json();
    },
  });

  const deleteLoreEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/lore-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lore-entries", projectId] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      toast({ title: "Lore entry deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete lore entry", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleDelete = (id: number) => {
    setDeleteLoreId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteLoreId) {
      deleteLoreEntryMutation.mutate(deleteLoreId);
      setDeleteLoreId(null);
    }
  };

  // Filter entries based on category
  const filteredEntries = loreEntries.filter(entry => {
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    return matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(loreEntries.map(entry => entry.category || "Uncategorized")));

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search lore entries..."
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[var(--color-600)] cursor-pointer group">
                  <BookOpen className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Lore</h1>
                  <p className="text-[var(--color-700)]">Manage your world's history, culture, and knowledge</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={() => setLocation(`/project/${projectId}/lore/new`)}
                  className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lore Entry
                </Button>
              </div>
            </div>
          </div>

          {/* Lore Entries Grid */}
          <MasonryGrid 
            columnWidth={300}
            gutter={24}
            fitWidth={true}
            className="pb-8"
          >
            {filteredEntries.map((entry) => {
              const categoryInfo = categoryConfig[entry.category as keyof typeof categoryConfig] || categoryConfig["History"];
              const CategoryIcon = categoryInfo.icon;

              return (
                <MasonryItem key={entry.id} className="w-80 mb-6">
                  <Card 
                  className="rounded-lg text-card-foreground shadow-sm hover:shadow-md transition-all duration-300 border border-[var(--color-300)] cursor-pointer bg-[var(--color-100)] group hover:-translate-y-1"
                  onClick={() => setLocation(`/project/${projectId}/lore/${entry.id}`)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${categoryInfo.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-sm`}>
                          <CategoryIcon className={`w-6 h-6 ${categoryInfo.textColor} group-hover:scale-110 transition-transform duration-300`} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-950)] group-hover:text-orange-600 transition-colors duration-300">
                            {entry.title}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={`${categoryInfo.bgColor} ${categoryInfo.textColor} border-0 text-xs mt-1`}
                          >
                            {entry.category || "Uncategorized"}
                          </Badge>
                        </div>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/project/${projectId}/lore/${entry.id}/edit`);
                          }}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(entry.id);
                            }}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <p className="text-[var(--color-700)] text-sm mb-4 line-clamp-3 leading-relaxed">
                      {entry.content || "No content available"}
                    </p>

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.slice(0, 3).map((tag, index) => (
                            <span 
                              key={index}
                              className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]"
                            >
                              {tag}
                            </span>
                          ))}
                          {entry.tags.length > 3 && (
                            <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-[var(--color-300)] border-[var(--color-400)] text-[var(--color-900)] hover:bg-[var(--color-200)]">
                              +{entry.tags.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-[var(--color-600)] pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>{entry.tags.length} tags</span>
                        </div>
                      )}
                    </div>
                  </div>
                  </Card>
                </MasonryItem>
              );
            })}
          </MasonryGrid>

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-950)] mb-2">
                {selectedCategory !== "all" ? "No lore entries found" : "No lore entries yet"}
              </h3>
              <p className="text-[var(--color-700)] mb-6 max-w-md mx-auto">
                {selectedCategory !== "all" 
                  ? "Try adjusting your filter criteria."
                  : "Start building your world's history and knowledge by creating your first lore entry."
                }
              </p>
              <Button
                onClick={() => setLocation(`/project/${projectId}/lore/new`)}
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Lore Entry
              </Button>
            </div>
          )}
        </div>
      </main>

      {deleteLoreId !== null && (
        <DeleteConfirmationDialog
          open={deleteLoreId !== null}
          onOpenChange={() => setDeleteLoreId(null)}
          onConfirm={handleConfirmDelete}
          title="Delete Lore Entry"
          itemName="this lore entry"
          description="Are you sure you want to delete this lore entry? This action cannot be undone and will permanently remove all associated data."
          isDeleting={deleteLoreEntryMutation.isPending}
        />
      )}
    </div>
  );
}