import { useQuery } from "@tanstack/react-query";
import { Calendar, Plus, Edit3, Trash2, User, MapPin, Clock, Sparkles, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { EditHistory } from "@shared/schema";

interface EditingHistoryTableProps {
  projectId: string;
}

const getEntityIcon = (entityType: string) => {
  switch (entityType) {
    case "character":
      return User;
    case "location":
      return MapPin;
    case "timeline_event":
      return Clock;
    case "magic_system":
      return Sparkles;
    case "lore_entry":
      return BookOpen;
    default:
      return BookOpen;
  }
};

const getActionIcon = (action: string) => {
  switch (action) {
    case "created":
      return Plus;
    case "updated":
      return Edit3;
    case "deleted":
      return Trash2;
    default:
      return Edit3;
  }
};

const getActionColor = (action: string) => {
  switch (action) {
    case "created":
      return "bg-[var(--color-300)] text-[var(--color-900)] border-[var(--color-400)]";
    case "updated":
      return "bg-[var(--color-200)] text-[var(--color-800)] border-[var(--color-300)]";
    case "deleted":
      return "bg-[var(--color-400)] text-[var(--color-950)] border-[var(--color-500)]";
    default:
      return "bg-[var(--color-200)] text-[var(--color-800)] border-[var(--color-300)]";
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
};

export default function EditingHistoryTable({ projectId }: EditingHistoryTableProps) {
  const { data: editHistory = [], isLoading } = useQuery<EditHistory[]>({
    queryKey: ["/api/edit-history", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/edit-history?projectId=${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch edit history");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <Card className="bg-[var(--worldforge-card)] border border-[var(--color-300)]">
        <CardHeader>
          <CardTitle className="text-xl text-[var(--color-800)] flex items-center">
            <Calendar className="w-5 h-5 mr-2" />
            Editing History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 bg-[var(--color-100)] rounded-lg animate-pulse">
                <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-[var(--color-200)] rounded mb-2"></div>
                  <div className="h-3 bg-[var(--color-200)] rounded w-3/4"></div>
                </div>
                <div className="w-16 h-6 bg-[var(--color-200)] rounded-full"></div>
                <div className="w-20 h-4 bg-[var(--color-200)] rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-[var(--worldforge-card)] border border-[var(--color-300)]">
      <CardHeader>
        <CardTitle className="text-xl text-[var(--color-800)] flex items-center">
          <Calendar className="w-5 h-5 mr-2" />
          Editing History
        </CardTitle>
        <p className="text-sm text-[var(--color-600)] mt-1">
          Track all changes made to your project
        </p>
      </CardHeader>
      <CardContent>
        {editHistory.length > 0 ? (
          <div className="space-y-4">
            {editHistory.map((entry) => {
              const EntityIcon = getEntityIcon(entry.entityType);
              const ActionIcon = getActionIcon(entry.action);
              const actionColorClass = getActionColor(entry.action);
              
              return (
                <div
                  key={entry.id}
                  className="flex items-center space-x-4 p-4 bg-[var(--color-50)] rounded-lg border border-[var(--color-200)] hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center justify-center w-10 h-10 bg-[var(--color-200)] rounded-lg">
                    <EntityIcon className="w-5 h-5 text-[var(--color-700)]" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-medium text-[var(--color-900)] truncate">
                        {entry.entityName}
                      </h4>
                      <Badge className={`inline-flex items-center space-x-1 ${actionColorClass}`}>
                        <ActionIcon className="w-3 h-3" />
                        <span className="text-xs font-medium capitalize">{entry.action}</span>
                      </Badge>
                    </div>
                    {entry.description && (
                      <p className="text-sm text-[var(--color-600)] line-clamp-1">
                        {entry.description}
                      </p>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <p className="text-xs text-[var(--color-500)] capitalize">
                      {entry.entityType.replace('_', ' ')}
                    </p>
                    <p className="text-xs text-[var(--color-400)] mt-1">
                      {formatTimeAgo(new Date(entry.createdAt))}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-[var(--color-400)] mb-4" />
            <h3 className="text-lg font-medium text-[var(--color-900)] mb-2">No Changes Yet</h3>
            <p className="text-[var(--color-500)]">
              Start creating characters, locations, or timeline events to see your editing history here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}