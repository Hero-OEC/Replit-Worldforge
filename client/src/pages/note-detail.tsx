import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Tag,
  FileText,
  Scroll,
  BookOpen,
  Users,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import Navbar from "@/components/layout/navbar";
import { useNavigationTracker } from "@/contexts/navigation-context";
import { useToast } from "@/hooks/use-toast";
import type { ProjectWithStats } from "@shared/schema";

// Category configuration matching lore detail page styling
const categoryConfig = {
  "Plot": {
    icon: BookOpen,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  },
  "Characters": {
    icon: Users,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  },
  "World Building": {
    icon: Search,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  },
  "Research": {
    icon: Scroll,
    color: "bg-[var(--color-200)]",
    bgColor: "bg-[var(--color-100)]",
    textColor: "text-[var(--color-800)]",
    borderColor: "border-[var(--color-300)]"
  }
};

// Note: This component is using sample data for demonstration
// In a real implementation, this would fetch from the notes API endpoint

export default function NoteDetail() {
  const { projectId, noteId } = useParams<{ projectId: string; noteId: string }>();
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  // Fetch the specific note from API
  const { data: note } = useQuery({
    queryKey: ['/api/notes', noteId],
    queryFn: async () => {
      const response = await fetch(`/api/notes/${noteId}`);
      if (!response.ok) throw new Error("Failed to fetch note");
      return response.json();
    },
    enabled: !!noteId
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete note");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId, "notes"] });
      toast({ title: "Note deleted successfully!" });
      setLocation(`/project/${projectId}/notes`);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete note", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const confirmDelete = () => {
    deleteNoteMutation.mutate();
  };

  if (!note) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto text-center py-12">
            <h2 className="text-2xl font-bold text-[var(--color-950)] mb-2">Note Not Found</h2>
            <p className="text-[var(--color-700)] mb-4">The note you're looking for doesn't exist.</p>
            <Button onClick={() => setLocation(`/project/${projectId}/notes`)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Notes
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const categoryInfo = categoryConfig[note.category as keyof typeof categoryConfig] || categoryConfig["Plot"];
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
                onClick={() => setLocation(`/project/${projectId}/notes`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-12 h-12 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <CategoryIcon className={`w-6 h-6 ${categoryInfo.textColor}`} />
                  </div>
                  <h1 className="text-3xl font-bold text-gray-800">{note.title}</h1>
                </div>
                <div className="ml-13">
                  <Badge 
                    variant="secondary" 
                    className={`${categoryInfo.bgColor} ${categoryInfo.textColor} border-0`}
                  >
                    {note.category}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button 
                onClick={() => setLocation(`/project/${projectId}/notes/${noteId}/edit`)} 
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Note
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteDialog(true)}
                disabled={deleteNoteMutation.isPending}
                className="text-destructive border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-destructive"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (() => {
            const tagsArray = typeof note.tags === 'string' 
              ? note.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag.length > 0)
              : Array.isArray(note.tags) ? note.tags : [];
            
            return tagsArray.length > 0 ? (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-3">
                  <Tag className="w-4 h-4 text-[var(--color-700)]" />
                  <span className="text-sm font-medium text-gray-700">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {tagsArray.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-200 hover:shadow-sm bg-[var(--color-200)] border-[var(--color-300)] text-[var(--color-800)] hover:bg-[var(--color-300)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ) : null;
          })()}

          <Card className="bg-transparent">
            <CardContent className="space-y-6 pt-6">
              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-[var(--color-950)] mb-3">Content</h3>
                <div className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {note.content}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      {note && (
        <DeleteConfirmationDialog
          open={showDeleteDialog}
          onOpenChange={setShowDeleteDialog}
          onConfirm={confirmDelete}
          title="Delete Note"
          itemName={note.title}
          description={`Are you sure you want to delete "${note.title}"? This action cannot be undone and will permanently remove the note.`}
          isDeleting={deleteNoteMutation.isPending}
        />
      )}
    </div>
  );
}