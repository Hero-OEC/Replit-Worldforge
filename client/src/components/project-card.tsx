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
  "High Fantasy": "bg-purple-100 text-purple-800",
  "Low Fantasy": "bg-purple-100 text-purple-800",
  "Urban Fantasy": "bg-purple-100 text-purple-800",
  "Dark Fantasy": "bg-purple-100 text-purple-800",
  "Sword & Sorcery": "bg-purple-100 text-purple-800",
  "Romantic Fantasy": "bg-pink-100 text-pink-800",
  "Portal Fantasy": "bg-purple-100 text-purple-800",
  "Fairy Tale Retellings": "bg-purple-100 text-purple-800",
  "Mythic Fantasy": "bg-purple-100 text-purple-800",
  "Historical Fantasy": "bg-amber-100 text-amber-800",
  "Cozy Fantasy": "bg-green-100 text-green-800",
  "Flintlock Fantasy": "bg-amber-100 text-amber-800",
  "Progression Fantasy": "bg-blue-100 text-blue-800",
  "Cultivation (Xianxia / Wuxia)": "bg-orange-100 text-orange-800",
  LitRPG: "bg-indigo-100 text-indigo-800",
  GameLit: "bg-indigo-100 text-indigo-800",
  "Dungeon Core": "bg-gray-100 text-gray-800",
  Cyberpunk: "bg-cyan-100 text-cyan-800",
  Biopunk: "bg-green-100 text-green-800",
  "Time Travel": "bg-blue-100 text-blue-800",
  "AI & Robots": "bg-slate-100 text-slate-800",
  Dystopian: "bg-red-100 text-red-800",
  "Post-Apocalyptic": "bg-red-100 text-red-800",
  "Alien Invasion": "bg-indigo-100 text-indigo-800",
  "LitRPG Sci-Fi": "bg-indigo-100 text-indigo-800",
  "Romantic Comedy (Rom-Com)": "bg-pink-100 text-pink-800",
  "Cozy Mystery": "bg-green-100 text-green-800",
  "Detective Noir": "bg-gray-100 text-gray-800",
  "Spy / Espionage": "bg-gray-100 text-gray-800",
  "Crime Fiction": "bg-red-100 text-red-800",
  "Techno-thriller": "bg-orange-100 text-orange-800",
  "Domestic Thriller": "bg-yellow-100 text-yellow-800",
  "Psychological Horror": "bg-red-100 text-red-800",
  "Supernatural Horror": "bg-red-100 text-red-800",
  Slasher: "bg-red-100 text-red-800",
  "Gothic Horror": "bg-purple-100 text-purple-800",
  "Occult Horror": "bg-purple-100 text-purple-800",
  "Survival Horror": "bg-red-100 text-red-800",
  "Monster Horror": "bg-red-100 text-red-800",
  "YA Fantasy": "bg-purple-100 text-purple-800",
  "YA Sci-Fi": "bg-blue-100 text-blue-800",
  "YA Romance": "bg-pink-100 text-pink-800",
  "YA Contemporary": "bg-green-100 text-green-800",
  "YA Dystopian": "bg-red-100 text-red-800",
  "YA Thriller": "bg-orange-100 text-orange-800",
  "YA Paranormal": "bg-purple-100 text-purple-800",
  "Coming-of-Age": "bg-blue-100 text-blue-800",
  "Literary Fiction": "bg-amber-100 text-amber-800",
  "Contemporary Fiction": "bg-green-100 text-green-800",
  "Slice of Life": "bg-green-100 text-green-800",
  "Magical Realism": "bg-purple-100 text-purple-800",
  Satire: "bg-yellow-100 text-yellow-800",
  Drama: "bg-gray-100 text-gray-800",
  "Alt-History": "bg-amber-100 text-amber-800",
  "Dark Academia": "bg-slate-100 text-slate-800",
  "Antihero Fiction": "bg-gray-100 text-gray-800",
};

const statusColors: Record<string, string> = {
  active: "bg-green-400",
  planning: "bg-yellow-400",
  completed: "bg-blue-400",
  archived: "bg-gray-400",
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const [, setLocation] = useLocation();
  const genreColor = genreColors[project.genre] || "bg-gray-100 text-gray-800";
  const statusColor = statusColors[project.status] || statusColors.active;
  const GenreIcon = genreIcons[project.genre] || Book;

  const handleClick = () => {
    setLocation(`/project/${project.id}`);
  };

  return (
    <Card
      className="bg-[var(--worldforge-card)] shadow-sm border border-[var(--border)] overflow-hidden cursor-pointer animate-scale-in hover-lift animate-ripple"
      onClick={handleClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div
                className={`p-2 rounded-lg ${genreColor.replace("text-", "bg-").replace("-800", "-200")}`}
              >
                <GenreIcon className={`w-4 h-4 ${genreColor.split(" ")[1]}`} />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
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
              className="p-1 text-gray-400 hover:text-gray-600 hover-scale animate-ripple"
            >
              <Star className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="p-1 text-gray-400 hover:text-gray-600 hover-scale animate-ripple"
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-6 line-clamp-3">
          {project.description}
        </p>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center group">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-lg mx-auto mb-2 hover-scale group-hover:bg-blue-200 transition-colors duration-200">
              <Users className="text-blue-600 w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900 animate-bounce-gentle">
              {project.stats.charactersCount}
            </p>
            <p className="text-xs text-gray-500">Characters</p>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2 hover-scale group-hover:bg-green-200 transition-colors duration-200">
              <MapPin className="text-green-600 w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900 animate-bounce-gentle">
              {project.stats.locationsCount}
            </p>
            <p className="text-xs text-gray-500">Locations</p>
          </div>
          <div className="text-center group">
            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-lg mx-auto mb-2 hover-scale group-hover:bg-orange-200 transition-colors duration-200">
              <Scroll className="text-orange-600 w-4 h-4" />
            </div>
            <p className="text-xl font-bold text-gray-900 animate-bounce-gentle">
              {project.stats.eventsCount}
            </p>
            <p className="text-xs text-gray-500">Events</p>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>
            Last modified: {format(new Date(project.updatedAt), "M/d/yyyy")}
          </span>
        </div>
      </div>
    </Card>
  );
}
