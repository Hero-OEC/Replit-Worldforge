import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit3, Trash2, Calendar, Tag, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import { useNavigationTracker } from "@/contexts/navigation-context";
import { apiRequest } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { LoreEntry, ProjectWithStats } from "@shared/schema";

// Category icons and colors
const categoryConfig = {
  "History": { icon: Calendar, color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  "Religion": { icon: Calendar, color: "bg-purple-500", bgColor: "bg-purple-50", textColor: "text-purple-700", borderColor: "border-purple-200" },
  "Politics": { icon: Calendar, color: "bg-red-500", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
  "Culture": { icon: Calendar, color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  "Geography": { icon: Calendar, color: "bg-teal-500", bgColor: "bg-teal-50", textColor: "text-teal-700", borderColor: "border-teal-200" },
  "Artifacts": { icon: Calendar, color: "bg-orange-500", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
  "Prophecies": { icon: Calendar, color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  "Institutions": { icon: Calendar, color: "bg-indigo-500", bgColor: "bg-indigo-50", textColor: "text-indigo-700", borderColor: "border-indigo-200" },
  "Legends": { icon: Calendar, color: "bg-pink-500", bgColor: "bg-pink-50", textColor: "text-pink-700", borderColor: "border-pink-200" },
  "Customs": { icon: Calendar, color: "bg-cyan-500", bgColor: "bg-cyan-50", textColor: "text-cyan-700", borderColor: "border-cyan-200" }
};

export default function LoreDetail() {
  const { projectId, loreId } = useParams<{ projectId: string; loreId: string }>();
  const [, setLocation] = useLocation();
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
    if (window.confirm("Are you sure you want to delete this lore entry? This action cannot be undone.")) {
      deleteLoreEntryMutation.mutate();
    }
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lore Entry Not Found</h2>
            <p className="text-gray-600 mb-4">The lore entry you're looking for doesn't exist.</p>
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
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setLocation(`/project/${projectId}/lore`)}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <div className="flex items-center space-x-3 mb-2">
                  <div className={`w-10 h-10 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <CategoryIcon className="w-5 h-5 text-white" />
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
                className="bg-orange-500 text-white hover:bg-orange-600"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Lore
              </Button>
              <Button
                variant="outline"
                onClick={handleDelete}
                disabled={deleteLoreEntryMutation.isPending}
                className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
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
                <Tag className="w-4 h-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Tags</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {loreEntry.tags.map((tag, index) => (
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
                    {loreEntry.content}
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