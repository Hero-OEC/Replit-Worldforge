import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Scroll, 
  Calendar, 
  Users, 
  MapPin, 
  Search,
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
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import type { Note, ProjectWithStats } from "@shared/schema";

// Category configuration with icons and InkAlchemy colors
const categoryConfig = {
  "Plot": {
    icon: Scroll,
    colors: {
      light: "bg-[var(--color-200)]",
      medium: "bg-[var(--color-300)]", 
      dark: "bg-[var(--color-500)]",
      text: "text-[var(--color-700)]"
    }
  },
  "Characters": {
    icon: Users,
    colors: {
      light: "bg-[var(--color-200)]",
      medium: "bg-[var(--color-300)]",
      dark: "bg-[var(--color-500)]", 
      text: "text-[var(--color-700)]"
    }
  },
  "World Building": {
    icon: MapPin,
    colors: {
      light: "bg-[var(--color-200)]",
      medium: "bg-[var(--color-300)]",
      dark: "bg-[var(--color-500)]",
      text: "text-[var(--color-700)]"
    }
  },
  "Research": {
    icon: Search,
    colors: {
      light: "bg-[var(--color-200)]",
      medium: "bg-[var(--color-300)]",
      dark: "bg-[var(--color-500)]",
      text: "text-[var(--color-700)]"
    }
  }
};

export default function Notes() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  const { data: notes = [], isLoading } = useQuery<Note[]>({
    queryKey: ["/api/notes", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/notes?projectId=${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch notes');
      return response.json();
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/notes/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", projectId] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      toast({ title: "Note deleted successfully!" });
    },
    onError: (error: any) => {
      toast({
        title: "Error deleting note",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (id: number) => {
    setDeleteNoteId(id);
  };

  const handleConfirmDelete = () => {
    if (deleteNoteId) {
      deleteNoteMutation.mutate(deleteNoteId);
      setDeleteNoteId(null);
    }
  };

  // Filter entries based on category
  const filteredNotes = notes.filter(note => {
    const matchesCategory = selectedCategory === "all" || note.category === selectedCategory;
    return matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(notes.map(note => note.category || "Uncategorized")));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />

        <main className="p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-sm cursor-pointer group">
                    <Scroll className="w-6 h-6 text-[var(--color-700)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-[var(--color-950)]">Notes</h1>
                    <p className="text-[var(--color-700)]">Organize your story ideas and research</p>
                  </div>
                </div>
                <Button
                  onClick={() => setLocation(`/project/${projectId}/notes/new`)}
                  className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>

            {/* Skeleton Loading */}
            <MasonryGrid>
              {[...Array(6)].map((_, i) => (
                <MasonryItem key={`skeleton-${i}`}>
                  <Card className="bg-[var(--color-100)] border border-[var(--color-300)] animate-pulse">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg"></div>
                          <div>
                            <div className="h-5 bg-[var(--color-200)] rounded w-32 mb-2"></div>
                            <div className="h-4 bg-[var(--color-200)] rounded w-20"></div>
                          </div>
                        </div>
                        <div className="w-8 h-8 bg-[var(--color-200)] rounded"></div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="h-4 bg-[var(--color-200)] rounded w-full"></div>
                        <div className="h-4 bg-[var(--color-200)] rounded w-3/4"></div>
                        <div className="h-4 bg-[var(--color-200)] rounded w-1/2"></div>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <div className="h-6 bg-[var(--color-200)] rounded w-16"></div>
                        <div className="h-6 bg-[var(--color-200)] rounded w-20"></div>
                      </div>
                      <div className="h-4 bg-[var(--color-200)] rounded w-24"></div>
                    </div>
                  </Card>
                </MasonryItem>
              ))}
            </MasonryGrid>
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

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg shadow-sm cursor-pointer group">
                  <Scroll className="w-6 h-6 text-[var(--color-700)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Notes</h1>
                  <p className="text-[var(--color-700)]">Organize your story ideas and research</p>
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
                  onClick={() => setLocation(`/project/${projectId}/notes/new`)}
                  className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Note
                </Button>
              </div>
            </div>
          </div>

          {/* Notes Grid */}
          <MasonryGrid className="pb-8">
            {filteredNotes.map((note) => {
              const categoryInfo = categoryConfig[note.category as keyof typeof categoryConfig] || categoryConfig["Plot"];
              const CategoryIcon = categoryInfo.icon;
              const selectedNote = notes.find(n => n.id === deleteNoteId);

              return (
                <MasonryItem key={note.id}>
                  <Card className="bg-[var(--color-100)] border border-[var(--color-300)] hover:shadow-md transition-all duration-200 cursor-pointer group hover:-translate-y-0.5">
                    <div className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`w-12 h-12 ${categoryInfo.colors.light} rounded-lg flex items-center justify-center shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg cursor-pointer`}>
                            <CategoryIcon className={`w-6 h-6 ${categoryInfo.colors.text} transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110`} />
                          </div>
                          <div className="flex-1">
                            <h3 
                              className="font-semibold text-[var(--color-950)] group-hover:text-[var(--color-500)] transition-colors cursor-pointer line-clamp-2 text-lg"
                              onClick={() => setLocation(`/project/${projectId}/notes/${note.id}`)}
                            >
                              {note.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Badge variant="secondary" className={`${categoryInfo.colors.medium} ${categoryInfo.colors.text} text-xs font-medium`}>
                                {note.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem 
                              onClick={() => setLocation(`/project/${projectId}/notes/${note.id}/edit`)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(note.id)}
                              className="cursor-pointer text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <p className="text-sm text-[var(--color-700)] line-clamp-3">
                          {note.content || "No content"}
                        </p>

                        {/* Tags */}
                        {note.tags && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.split(',').slice(0, 3).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs bg-[var(--color-200)] text-[var(--color-700)] border-[var(--color-300)]">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag.trim()}
                              </Badge>
                            ))}
                            {note.tags.split(',').length > 3 && (
                              <Badge variant="outline" className="text-xs bg-[var(--color-200)] text-[var(--color-700)] border-[var(--color-300)]">
                                +{note.tags.split(',').length - 3} more
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between text-xs text-[var(--color-500)] pt-2 border-t border-[var(--color-300)]">
                          <div className="flex items-center space-x-1">
                            <Clock className="h-3 w-3" />
                            <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Tag className="h-3 w-3" />
                            <span>
                              {Array.isArray(note.tags) ? note.tags.length : (note.tags ? note.tags.split(',').length : 0)} tags
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </MasonryItem>
              );
            })}
          </MasonryGrid>

          {/* Empty State */}
          {filteredNotes.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-[var(--color-200)] rounded-full flex items-center justify-center mx-auto mb-4">
                <Scroll className="h-12 w-12 text-[var(--color-600)]" />
              </div>
              <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No notes found</h3>
              <p className="text-[var(--color-700)] mb-6">
                {selectedCategory === "all" 
                  ? "Start creating notes to organize your story ideas and research." 
                  : `No notes found in the "${selectedCategory}" category.`}
              </p>
              <Button
                onClick={() => setLocation(`/project/${projectId}/notes/new`)}
                className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Note
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteNoteId} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Note</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this note? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}