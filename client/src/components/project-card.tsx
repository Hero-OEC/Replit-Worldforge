import { format } from "date-fns";
import {
  MoreHorizontal,
  Users,
  MapPin,
  Scroll,
  Wand2,
  Sword,
  Heart,
  Castle,
  Sparkles,
  Book,
  Crown,
  FileText,
  Zap,
  Bot,
  Clock,
  Shield,
  Eye,
  Skull,
  Baby,
  GraduationCap,
  Feather,
  Coffee,
  Search,
  UserCheck,
  Truck,
  Home,
  Ghost,
  Telescope,
  Rocket,
  Laugh,
  Cat,
  Target,
  Briefcase,
  Flame,
  Mountain,
  Gamepad2,
  Dice1,
  Edit3,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import type { ProjectWithStats } from "@shared/schema";
import { useLocation } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface ProjectCardProps {
  project: ProjectWithStats;
  onClick?: () => void;
}

const genreIcons: Record<string, any> = {
  "High Fantasy": Crown,
  "Low Fantasy": Wand2,
  "Urban Fantasy": Castle,
  "Dark Fantasy": Skull,
  "Sword & Sorcery": Sword,
  "Romantic Fantasy": Heart,
  "Portal Fantasy": Sparkles,
  "Fairy Tale Retellings": Book,
  "Mythic Fantasy": Mountain,
  "Historical Fantasy": Scroll,
  "Cozy Fantasy": Coffee,
  "Flintlock Fantasy": Target,
  "Progression Fantasy": Zap,
  "Cultivation (Xianxia / Wuxia)": Mountain,
  LitRPG: Gamepad2,
  GameLit: Dice1,
  "Dungeon Core": Shield,
  Cyberpunk: Bot,
  Biopunk: Feather,
  "Time Travel": Clock,
  "AI & Robots": Bot,
  Dystopian: Flame,
  "Post-Apocalyptic": Truck,
  "Alien Invasion": Telescope,
  "LitRPG Sci-Fi": Rocket,
  "Romantic Comedy (Rom-Com)": Laugh,
  "Cozy Mystery": Cat,
  "Detective Noir": Search,
  "Spy / Espionage": UserCheck,
  "Crime Fiction": Target,
  "Techno-thriller": Zap,
  "Domestic Thriller": Home,
  "Psychological Horror": Eye,
  "Supernatural Horror": Ghost,
  Slasher: Skull,
  "Gothic Horror": Castle,
  "Occult Horror": Eye,
  "Survival Horror": Flame,
  "Monster Horror": Skull,
  "YA Fantasy": Sparkles,
  "YA Sci-Fi": Rocket,
  "YA Romance": Heart,
  "YA Contemporary": Coffee,
  "YA Dystopian": Flame,
  "YA Thriller": Zap,
  "YA Paranormal": Ghost,
  "Coming-of-Age": Baby,
  "Literary Fiction": Book,
  "Contemporary Fiction": Coffee,
  "Slice of Life": Home,
  "Magical Realism": Wand2,
  Satire: Laugh,
  Drama: FileText,
  "Alt-History": Clock,
  "Dark Academia": GraduationCap,
  "Antihero Fiction": Skull,
};

const genreColors: Record<string, string> = {
  "High Fantasy": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Low Fantasy": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Urban Fantasy": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Dark Fantasy": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Sword & Sorcery": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Romantic Fantasy": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Portal Fantasy": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Fairy Tale Retellings": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Mythic Fantasy": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Historical Fantasy": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Cozy Fantasy": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Flintlock Fantasy": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Progression Fantasy": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Cultivation (Xianxia / Wuxia)": "bg-[var(--color-400)] text-[var(--color-950)]",
  LitRPG: "bg-[var(--color-300)] text-[var(--color-900)]",
  GameLit: "bg-[var(--color-300)] text-[var(--color-900)]",
  "Dungeon Core": "bg-[var(--color-400)] text-[var(--color-950)]",
  Cyberpunk: "bg-[var(--color-200)] text-[var(--color-800)]",
  Biopunk: "bg-[var(--color-300)] text-[var(--color-900)]",
  "Time Travel": "bg-[var(--color-300)] text-[var(--color-900)]",
  "AI & Robots": "bg-[var(--color-400)] text-[var(--color-950)]",
  Dystopian: "bg-[var(--color-500)] text-[var(--color-950)]",
  "Post-Apocalyptic": "bg-[var(--color-500)] text-[var(--color-950)]",
  "Alien Invasion": "bg-[var(--color-400)] text-[var(--color-950)]",
  "LitRPG Sci-Fi": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Romantic Comedy (Rom-Com)": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Cozy Mystery": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Detective Noir": "bg-[var(--color-500)] text-[var(--color-950)]",
  "Spy / Espionage": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Crime Fiction": "bg-[var(--color-500)] text-[var(--color-950)]",
  "Techno-thriller": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Domestic Thriller": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Psychological Horror": "bg-[var(--color-600)] text-[var(--color-50)]",
  "Supernatural Horror": "bg-[var(--color-600)] text-[var(--color-50)]",
  Slasher: "bg-[var(--color-700)] text-[var(--color-50)]",
  "Gothic Horror": "bg-[var(--color-600)] text-[var(--color-50)]",
  "Occult Horror": "bg-[var(--color-700)] text-[var(--color-50)]",
  "Survival Horror": "bg-[var(--color-600)] text-[var(--color-50)]",
  "Monster Horror": "bg-[var(--color-700)] text-[var(--color-50)]",
  "YA Fantasy": "bg-[var(--color-300)] text-[var(--color-900)]",
  "YA Sci-Fi": "bg-[var(--color-300)] text-[var(--color-900)]",
  "YA Romance": "bg-[var(--color-200)] text-[var(--color-800)]",
  "YA Contemporary": "bg-[var(--color-200)] text-[var(--color-800)]",
  "YA Dystopian": "bg-[var(--color-500)] text-[var(--color-950)]",
  "YA Thriller": "bg-[var(--color-400)] text-[var(--color-950)]",
  "YA Paranormal": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Coming-of-Age": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Literary Fiction": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Contemporary Fiction": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Slice of Life": "bg-[var(--color-200)] text-[var(--color-800)]",
  "Magical Realism": "bg-[var(--color-300)] text-[var(--color-900)]",
  Satire: "bg-[var(--color-300)] text-[var(--color-900)]",
  Drama: "bg-[var(--color-300)] text-[var(--color-900)]",
  "Alt-History": "bg-[var(--color-300)] text-[var(--color-900)]",
  "Dark Academia": "bg-[var(--color-400)] text-[var(--color-950)]",
  "Antihero Fiction": "bg-[var(--color-500)] text-[var(--color-950)]",
};

const statusColors: Record<string, string> = {
  active: "bg-green-400",
  planning: "bg-yellow-400",
  completed: "bg-blue-400",
  archived: "bg-gray-400",
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [, setLocation] = useLocation();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const genreColor = genreColors[project.genre] || "bg-[var(--color-300)] text-[var(--color-900)]";
  const statusColor = statusColors[project.status] || statusColors.active;
  const GenreIcon = genreIcons[project.genre] || Book;

  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete project");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.refetchQueries({ queryKey: ["/api/projects"] });
      toast({ title: "Project deleted successfully!" });
      setShowDeleteDialog(false);
    },
  });

  const handleClick = (e: React.MouseEvent) => {
    // Prevent navigation when clicking on dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-menu]')) {
      return;
    }
    setLocation(`/project/${project.id}`);
  };

  const handleDelete = () => {
    deleteProjectMutation.mutate(project.id);
  };

  return (
    <>
      <Card
        className="bg-[var(--color-100)] border border-[var(--color-300)] overflow-hidden cursor-pointer animate-scale-in hover-lift animate-ripple"
        onClick={handleClick}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-[var(--color-200)]">
                  <GenreIcon className="w-4 h-4 text-[var(--color-700)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--color-950)] line-clamp-1">
                  {project.title}
                </h3>
              </div>
              <Badge className={`text-xs font-medium ${genreColor}`}>
                {project.genre}
              </Badge>
            </div>
            <div className="flex items-center space-x-2" data-dropdown-menu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="p-1 text-[var(--color-600)] hover:text-[var(--color-700)] hover:bg-[var(--color-200)] hover-scale animate-ripple"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[var(--color-50)] border border-[var(--color-300)]">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation(`/project/${project.id}`);
                    }}
                    className="text-[var(--color-700)] hover:bg-[var(--color-100)] hover:text-[var(--color-950)]"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Project
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDeleteDialog(true);
                    }}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <p className="text-[var(--color-700)] text-sm mb-6 line-clamp-3">
            {project.description}
          </p>

          <div className="flex items-center justify-between text-sm text-[var(--color-600)]">
            <span>
              Last modified: {format(new Date(project.updatedAt), "M/d/yyyy")}
            </span>
          </div>
        </div>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="bg-[var(--color-50)] border border-[var(--color-300)]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[var(--color-950)]">
              Delete Project
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[var(--color-700)]">
              Are you sure you want to delete "{project.title}"? This action cannot be undone and will permanently remove all associated data including characters, locations, timeline events, and notes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              className="bg-[var(--color-100)] border border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-200)] hover:text-[var(--color-950)]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={deleteProjectMutation.isPending}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleteProjectMutation.isPending ? "Deleting..." : "Delete Project"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}