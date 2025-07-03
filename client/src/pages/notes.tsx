import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Scroll, Edit3, MoreHorizontal, Trash2, FileText, BookOpen, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Navbar from "@/components/layout/navbar";
import type { ProjectWithStats, Note } from "@shared/schema";

// Category configuration for consistent styling
const categoryConfig = {
  "Plot": {
    icon: BookOpen,
    bgColor: "bg-amber-200",
    textColor: "text-amber-800"
  },
  "Characters": {
    icon: Users,
    bgColor: "bg-amber-200",
    textColor: "text-amber-800"
  },
  "World Building": {
    icon: Search,
    bgColor: "bg-amber-200",
    textColor: "text-amber-800"
  },
  "Research": {
    icon: Scroll,
    bgColor: "bg-amber-200",
    textColor: "text-amber-800"
  }
};

export default function Notes() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteNoteId, setDeleteNoteId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: [`/api/projects/${projectId}`],
  });

  const { data: notes = [] } = useQuery<Note[]>({
    queryKey: [`/api/notes`],
    queryFn: async () => {
      const res = await fetch(`/api/notes?projectId=${projectId}`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      return res.json();
    },
    enabled: !!projectId,
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: number) => {
      const res = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete note");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/notes`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      setDeleteNoteId(null);
    },
  });

  const handleDeleteNote = () => {
    if (deleteNoteId) {
      deleteNoteMutation.mutate(deleteNoteId);
    }
  };

  const selectedNote = deleteNoteId ? notes.find((note: any) => note.id === deleteNoteId) : null;



  const handleDelete = (id: number) => {
    setDeleteNoteId(id);
  };

  const filteredNotes = (notes || []).filter((note: Note) => {
    const tags = note.tags ? note.tags.split(',').map(tag => tag.trim()) : [];
    return (
      note.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleNoteClick = (noteId: number) => {
    setLocation(`/project/${projectId}/notes/${noteId}`);
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[var(--color-600)] cursor-pointer group">
                  <Scroll className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Notes</h1>
                  <p className="text-[var(--color-700)]">Capture your ideas and research</p>
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



          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => {
              const categoryInfo = categoryConfig[note.category as keyof typeof categoryConfig] || categoryConfig["Plot"];
              const CategoryIcon = categoryInfo.icon;

              return (
                <Card 
                  key={note.id} 
                  className="p-6 hover:shadow-md transition-shadow border border-amber-200 cursor-pointer bg-[#f4f0cd]" 
                  onClick={() => handleNoteClick(note.id)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3 flex-1">
                      <div className={`w-10 h-10 ${categoryInfo.bgColor} rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`w-5 h-5 ${categoryInfo.textColor}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[var(--color-950)] mb-1">{note.title}</h3>
                        <Badge className="bg-amber-100 text-amber-700 border border-amber-300 hover:bg-amber-200">
                          {note.category}
                        </Badge>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            onClick={() => setLocation(`/project/${projectId}/notes/${note.id}/edit`)}
                            className="text-[var(--color-700)] hover:bg-[var(--color-100)]"
                          >
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteNoteId(note.id);
                            }}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-[var(--color-700)] text-sm mb-4 line-clamp-4">{note.content}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {note.tags && typeof note.tags === 'string' && note.tags.split(',').map((tag: string, index: number) => (
                      <span 
                        key={index}
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-amber-100 border-amber-200 text-amber-800 hover:bg-amber-200"
                      >
                        {tag.trim()}
                      </span>
                    ))}
                  </div>

                  <div className="text-xs text-[var(--color-600)]">
                    {note.createdAt instanceof Date ? note.createdAt.toLocaleDateString() : new Date(note.createdAt).toLocaleDateString()}
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <Scroll className="w-12 h-12 text-[var(--color-600)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No notes found</h3>
              <p className="text-[var(--color-700)]">Create your first note to get started.</p>
            </div>
          )}
        </div>
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