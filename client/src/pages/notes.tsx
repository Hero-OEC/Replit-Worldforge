import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Plus, Scroll, Search, Edit, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Navbar from "@/components/layout/navbar";

interface Note {
  id: number;
  title: string;
  content: string | null;
  category: string;
  tags: string | null;
  projectId: number;
  createdAt: string;
  updatedAt: string;
}

const noteCategories = ["Plot", "Characters", "World Building", "Research"];

const categoryConfig = {
  "Plot": { icon: Scroll },
  "Characters": { icon: Search },
  "World Building": { icon: Search },
  "Research": { icon: Search }
};

export default function Notes() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: notes = [], isLoading: notesLoading } = useQuery<Note[]>({
    queryKey: ['/api/notes', projectId],
    enabled: !!projectId,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      await apiRequest(`/api/notes/${noteId}`, 'DELETE');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['/api/notes', projectId]
      });
      setDeleteNoteId(null);
      toast({
        title: "Note deleted",
        description: "The note has been successfully deleted.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  });

  const filteredNotes = notes.filter((note: Note) => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (note.content || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || note.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleNoteClick = (noteId: number) => {
    setLocation(`/project/${projectId}/notes/${noteId}`);
  };

  const handleDeleteNote = () => {
    if (deleteNoteId) {
      deleteNoteMutation.mutate(deleteNoteId);
    }
  };

  const selectedNote = notes.find(note => note.id === deleteNoteId);

  if (notesLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-bg)]">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-200)] rounded-lg shadow-sm">
                  <Scroll className="w-6 h-6 text-[var(--color-700)]" />
                </div>
                <h1 className="text-2xl font-bold text-[var(--color-950)]">Notes</h1>
              </div>
              <Button 
                onClick={() => setLocation(`/project/${projectId}/notes/new`)}
                className="bg-orange-500 hover:bg-orange-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Note
              </Button>
            </div>
          </div>

          <MasonryGrid className="pb-8">
            {[...Array(6)].map((_, i) => (
              <MasonryItem key={`skeleton-${i}`} className="w-80 mb-6">
                <Card className="rounded-lg shadow-sm border border-[var(--color-300)] bg-[var(--color-100)] animate-pulse">
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--worldforge-bg)]">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-200)] rounded-lg shadow-sm">
                <Scroll className="w-6 h-6 text-[var(--color-700)]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-950)]">Notes</h1>
            </div>
            <Button 
              onClick={() => setLocation(`/project/${projectId}/notes/new`)}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Note
            </Button>
          </div>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {noteCategories.map(category => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <MasonryGrid className="pb-8">
          {filteredNotes.map((note) => {
            const categoryInfo = categoryConfig[note.category as keyof typeof categoryConfig] || categoryConfig["Plot"];
            const CategoryIcon = categoryInfo.icon;

            return (
              <MasonryItem key={note.id} className="w-80 mb-6">
                <Card 
                  className="rounded-lg text-card-foreground shadow-sm hover:shadow-md transition-all duration-200 border border-[var(--color-300)] cursor-pointer bg-[var(--color-100)] group hover:-translate-y-0.5"
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-12 h-12 bg-[var(--color-200)] rounded-lg shadow-sm">
                          <CategoryIcon className="w-6 h-6 text-[var(--color-700)]" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-[var(--color-950)] group-hover:text-orange-600 transition-colors">
                            {note.title}
                          </h3>
                          <p className="text-sm text-[var(--color-600)]">{note.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-orange-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/project/${projectId}/notes/${note.id}/edit`);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteNoteId(note.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-sm text-[var(--color-700)] line-clamp-3">
                        {note.content || ''}
                      </p>

                      {note.tags && note.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {note.tags.split(',').slice(0, 3).map((tag: string, index: number) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {tag.trim()}
                            </Badge>
                          ))}
                          {note.tags.split(',').length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{note.tags.split(',').length - 3} more
                            </Badge>
                          )}
                        </div>
                      )}

                      <div className="flex items-center text-xs text-[var(--color-500)] pt-2">
                        <span>{note.tags ? note.tags.split(',').length : 0} tags</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </MasonryItem>
            );
          })}
        </MasonryGrid>

        {filteredNotes.length === 0 && (
          <div className="text-center py-12">
            <Scroll className="w-12 h-12 text-[var(--color-600)] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No notes found</h3>
            <p className="text-[var(--color-700)]">Create your first note to get started.</p>
          </div>
        )}
      </main>

      <AlertDialog open={deleteNoteId !== null} onOpenChange={() => setDeleteNoteId(null)}>
        <AlertDialogContent className="bg-[var(--color-50)] border border-[var(--color-300)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--color-950)]">
              Delete Note
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--color-700)]">
              Are you sure you want to delete "{selectedNote?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-[var(--color-100)] border border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-200)] hover:text-[var(--color-950)]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteNote}
              disabled={deleteNoteMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteNoteMutation.isPending ? "Deleting..." : "Delete Note"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}