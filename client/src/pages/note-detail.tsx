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
import Navbar from "@/components/layout/navbar";
import { useNavigationTracker } from "@/contexts/navigation-context";
import { useToast } from "@/hooks/use-toast";
import type { ProjectWithStats } from "@shared/schema";

// Category configuration for consistent styling
const categoryConfig = {
  "Plot": {
    icon: BookOpen,
    color: "bg-blue-500",
    bgColor: "bg-blue-100",
    textColor: "text-blue-800",
    borderColor: "border-blue-200"
  },
  "Characters": {
    icon: Users,
    color: "bg-green-500",
    bgColor: "bg-green-100",
    textColor: "text-green-800",
    borderColor: "border-green-200"
  },
  "World Building": {
    icon: Search,
    color: "bg-purple-500",
    bgColor: "bg-purple-100",
    textColor: "text-purple-800",
    borderColor: "border-purple-200"
  },
  "Research": {
    icon: Scroll,
    color: "bg-yellow-500",
    bgColor: "bg-yellow-100",
    textColor: "text-yellow-800",
    borderColor: "border-yellow-200"
  }
};

// Sample note data (in real app, this would come from API)
const sampleNotes = [
  {
    id: 1,
    title: "Plot Outline - Act 1",
    content: "Elena discovers her powers during the entrance exam at the Academy. She accidentally sets fire to the testing chamber but instead of being expelled, she's taken under Theron's wing. Key scenes: arrival at academy, meeting Marcus, first magic lesson gone wrong.\n\nThis act establishes the magical world and introduces our main characters. The pacing should be quick to hook readers, but allow time for world-building. Elena's character arc begins here with her feeling like an outsider.",
    category: "Plot",
    tags: ["plot", "act1", "elena", "academy", "character-introduction"],
    createdAt: "2024-01-15T10:30:00.000Z",
    updatedAt: "2024-01-16T14:22:00.000Z"
  },
  {
    id: 2,
    title: "Character Development - Elena's Arc",
    content: "Elena starts as insecure about her abilities. Through trials and failures, she learns to control her fire magic and gains confidence. Her character arc mirrors the classic hero's journey but with focus on self-acceptance rather than defeating evil.\n\nKey character beats:\n- Denial of powers (Act 1)\n- Reluctant acceptance (Early Act 2)\n- Training montage and failures (Mid Act 2)\n- Breakthrough moment (Late Act 2)\n- Mastery and confidence (Act 3)",
    category: "Characters",
    tags: ["elena", "character-arc", "development", "fire-magic", "hero-journey"],
    createdAt: "2024-01-12T09:15:00.000Z",
    updatedAt: "2024-01-13T11:45:00.000Z"
  },
  {
    id: 3,
    title: "Magic System Rules",
    content: "Fire magic requires emotional control. The more intense the emotion, the stronger the flame, but also the more dangerous. Users must learn meditation and breathing techniques. Overuse leads to 'burnout' - temporary loss of magical ability.\n\nDetailed rules:\n1. Emotional state directly affects power level\n2. Fear weakens flames, confidence strengthens them\n3. Anger creates destructive fire, calm creates controlled fire\n4. Physical exhaustion reduces magical capacity\n5. Each person has a daily 'magic reserve' that replenishes with rest",
    category: "World Building",
    tags: ["magic-system", "fire-magic", "rules", "limitations", "world-building"],
    createdAt: "2024-01-10T16:20:00.000Z",
    updatedAt: "2024-01-11T08:30:00.000Z"
  },
  {
    id: 4,
    title: "Research: Medieval Academy Life",
    content: "Notes from research on medieval university structures. Students lived in dormitories, followed strict schedules, and studied by candlelight. Will adapt this for magical academy with crystal lights and floating books.\n\nKey elements to incorporate:\n- Communal dining halls with long tables\n- Shared dormitories (2-4 students per room)\n- Morning prayers/meditation (adapted to magical focus exercises)\n- Hierarchical system with older students mentoring younger ones\n- Limited personal possessions\n- Strict curfews and supervised study time",
    category: "Research",
    tags: ["research", "medieval", "academy", "historical", "world-building"],
    createdAt: "2024-01-08T13:45:00.000Z",
    updatedAt: "2024-01-09T10:15:00.000Z"
  }
];

export default function NoteDetail() {
  const { projectId, noteId } = useParams<{ projectId: string; noteId: string }>();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  // In a real app, this would be an API call
  const note = sampleNotes.find(n => n.id === parseInt(noteId!));

  const deleteNoteMutation = useMutation({
    mutationFn: async () => {
      // In real app: return apiRequest("DELETE", `/api/notes/${noteId}`);
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notes", projectId] });
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

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
      deleteNoteMutation.mutate();
    }
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Note Not Found</h2>
            <p className="text-gray-600 mb-4">The note you're looking for doesn't exist.</p>
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
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setLocation(`/project/${projectId}/notes`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <CategoryIcon className="w-5 h-5 text-white" />
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
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Note
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleteNoteMutation.isPending}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          {/* Tags */}
          {note.tags && note.tags.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center space-x-2 mb-3">
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2 py-0.5 text-xs font-normal rounded-md bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 transition-colors duration-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Card>
            <CardContent className="space-y-6 pt-6">
              {/* Content */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Content</h3>
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
    </div>
  );
}