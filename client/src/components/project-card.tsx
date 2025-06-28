import { format } from "date-fns";
import {
  Star,
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
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { ProjectWithStats } from "@shared/schema";
import { useLocation } from "wouter";

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
  const genreColor = genreColors[project.genre] || "bg-[var(--color-200)] text-gray-800";
  const statusColor = statusColors[project.status] || statusColors.active;
  const GenreIcon = genreIcons[project.genre] || Book;

  const handleClick = () => {
    setLocation(`/project/${project.id}`);
  };

  return (
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
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              className="p-1 text-[var(--color-600)] hover:text-[var(--color-700)] hover-scale animate-ripple"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 text-[var(--color-600)] hover:text-[var(--color-700)] hover-scale animate-ripple"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-[var(--color-700)] text-sm mb-6 line-clamp-3">
          {project.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center group">
            <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-200)] rounded-lg mx-auto mb-2 hover-scale group-hover:bg-[var(--color-300)] transition-colors duration-200">
              <Users className="text-[var(--color-700)] w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-[var(--color-950)] animate-bounce-gentle">
              {project.stats.charactersCount}
            </p>
            <p className="text-xs text-[var(--color-600)]">Characters</p>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-200)] rounded-lg mx-auto mb-2 hover-scale group-hover:bg-[var(--color-300)] transition-colors duration-200">
              <MapPin className="text-[var(--color-700)] w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-[var(--color-950)] animate-bounce-gentle">
              {project.stats.locationsCount}
            </p>
            <p className="text-xs text-[var(--color-600)]">Locations</p>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center w-8 h-8 bg-[var(--color-200)] rounded-lg mx-auto mb-2 hover-scale group-hover:bg-[var(--color-300)] transition-colors duration-200">
              <Scroll className="text-[var(--color-700)] w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-[var(--color-950)] animate-bounce-gentle">
              {project.stats.eventsCount}
            </p>
            <p className="text-xs text-[var(--color-600)]">Events</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-[var(--color-600)]">
          <span>
            Last modified: {format(new Date(project.updatedAt), "M/d/yyyy")}
          </span>
        </div>
      </div>
    </Card>
  );
}
