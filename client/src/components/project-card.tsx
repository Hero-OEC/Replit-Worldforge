import { format } from "date-fns";
import { Star, MoreHorizontal, Users, MapPin, Scroll } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectWithStats } from "@shared/schema";

interface ProjectCardProps {
  project: ProjectWithStats;
  onClick?: () => void;
}

const genreColors: Record<string, string> = {
  Fantasy: "bg-purple-100 text-purple-800",
  "Science Fiction": "bg-indigo-100 text-indigo-800",
  "Sci-Fi": "bg-indigo-100 text-indigo-800",
  Cyberpunk: "bg-cyan-100 text-cyan-800",
  Mystery: "bg-gray-100 text-gray-800",
  Romance: "bg-pink-100 text-pink-800",
  Horror: "bg-red-100 text-red-800",
  "Historical Fiction": "bg-amber-100 text-amber-800",
  Other: "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  active: "bg-green-400",
  planning: "bg-yellow-400",
  completed: "bg-blue-400",
  archived: "bg-gray-400",
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const genreColor = genreColors[project.genre] || genreColors.Other;
  const statusColor = statusColors[project.status] || statusColors.active;

  return (
    <Card 
      className="bg-white shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{project.title}</h3>
            <Badge className={`text-xs font-medium ${genreColor}`}>
              {project.genre}
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="p-1 text-gray-400 hover:text-gray-600">
              <Star className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="p-1 text-gray-400 hover:text-gray-600">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <p className="text-gray-600 text-sm mb-6 line-clamp-3">{project.description}</p>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2">
              <Users className="text-blue-600 w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900">{project.stats.charactersCount}</p>
            <p className="text-xs text-gray-500">Characters</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
              <MapPin className="text-green-600 w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900">{project.stats.locationsCount}</p>
            <p className="text-xs text-gray-500">Locations</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-2">
              <Scroll className="text-orange-600 w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900">{project.stats.eventsCount}</p>
            <p className="text-xs text-gray-500">Events</p>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Last modified: {format(new Date(project.updatedAt), 'M/d/yyyy')}</span>
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 ${statusColor} rounded-full`}></div>
            <span className="capitalize">{project.status}</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
