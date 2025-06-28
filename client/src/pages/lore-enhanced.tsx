import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Calendar, 
  Scroll, 
  Crown, 
  Church, 
  Users, 
  MapPin, 
  Gem, 
  Eye, 
  GraduationCap,
  Sparkles,
  Heart,
  Trash2,
  Clock,
  Tag,
  Edit3,
  MoreHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import { formatDistanceToNow } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import type { LoreEntry, ProjectWithStats } from "@shared/schema";

// Category icons and colors
const categoryConfig = {
  "History": { icon: Calendar, color: "bg-blue-500", bgColor: "bg-blue-50", textColor: "text-blue-700", borderColor: "border-blue-200" },
  "Religion": { icon: Church, color: "bg-purple-500", bgColor: "bg-purple-50", textColor: "text-purple-700", borderColor: "border-purple-200" },
  "Politics": { icon: Crown, color: "bg-destructive", bgColor: "bg-red-50", textColor: "text-red-700", borderColor: "border-red-200" },
  "Culture": { icon: Users, color: "bg-green-500", bgColor: "bg-green-50", textColor: "text-green-700", borderColor: "border-green-200" },
  "Geography": { icon: MapPin, color: "bg-teal-500", bgColor: "bg-teal-50", textColor: "text-teal-700", borderColor: "border-teal-200" },
  "Artifacts": { icon: Gem, color: "bg-[var(--color-500)]", bgColor: "bg-orange-50", textColor: "text-orange-700", borderColor: "border-orange-200" },
  "Prophecies": { icon: Eye, color: "bg-yellow-500", bgColor: "bg-yellow-50", textColor: "text-yellow-700", borderColor: "border-yellow-200" },
  "Institutions": { icon: GraduationCap, color: "bg-indigo-500", bgColor: "bg-indigo-50", textColor: "text-indigo-700", borderColor: "border-indigo-200" },
  "Legends": { icon: Sparkles, color: "bg-pink-500", bgColor: "bg-pink-50", textColor: "text-pink-700", borderColor: "border-pink-200" },
  "Customs": { icon: Heart, color: "bg-cyan-500", bgColor: "bg-cyan-50", textColor: "text-cyan-700", borderColor: "border-cyan-200" }
};

export default function Lore() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const queryClient = useQueryClient();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
  });

  // For now, using sample data since API endpoints need to be implemented
  const sampleLoreEntries: LoreEntry[] = [
    {
      id: 1,
      projectId: parseInt(projectId!),
      title: "The Ancient War of Shadows",
      content: "A thousand years ago, the realm was plunged into darkness when the Shadow Lords attempted to overthrow the Circle of Light. This war lasted for three centuries and reshaped the magical landscape of the world, creating the mystical barriers that still protect our lands today.",
      category: "History",
      tags: ["war", "ancient", "magic", "shadow lords", "circle of light"],
      createdAt: new Date(Date.now() - 86400000 * 30), // 30 days ago
      updatedAt: new Date(Date.now() - 86400000 * 5)   // 5 days ago
    },
    {
      id: 2,
      projectId: parseInt(projectId!),
      title: "The Crystal of Eternal Flame",
      content: "A legendary artifact said to contain the first flame ever created by the gods. It is said that whoever possesses it can command fire magic beyond mortal comprehension. The crystal was last seen during the Battle of Crimson Peak, where it vanished into the ethereal realm.",
      category: "Artifacts",
      tags: ["artifact", "fire", "crystal", "legendary", "gods", "crimson peak"],
      createdAt: new Date(Date.now() - 86400000 * 15),
      updatedAt: new Date(Date.now() - 86400000 * 2)
    },
    {
      id: 3,
      projectId: parseInt(projectId!),
      title: "The Prophecy of the Chosen One",
      content: "Ancient texts speak of one who will rise when the realm faces its darkest hour. Born under the eclipse, marked by flame, they will either save the world or destroy it. The prophecy was first recorded by the Oracle of Moonvale and has been passed down through generations.",
      category: "Prophecies",
      tags: ["prophecy", "chosen one", "eclipse", "flame", "oracle", "moonvale"],
      createdAt: new Date(Date.now() - 86400000 * 20),
      updatedAt: new Date(Date.now() - 86400000 * 1)
    },
    {
      id: 4,
      projectId: parseInt(projectId!),
      title: "The Academy of Mystic Arts",
      content: "Founded by Archmage Theron after the Shadow War to ensure that magical knowledge would never again be hoarded by the few. The Academy stands as a beacon of learning, where students from all walks of life can study the arcane arts under the guidance of master wizards.",
      category: "Institutions",
      tags: ["academy", "founding", "education", "theron", "mystic arts", "learning"],
      createdAt: new Date(Date.now() - 86400000 * 10),
      updatedAt: new Date(Date.now() - 86400000 * 3)
    },
    {
      id: 5,
      projectId: parseInt(projectId!),
      title: "The Festival of Starlight",
      content: "An annual celebration held during the winter solstice, where citizens light thousands of lanterns to honor the celestial spirits. The tradition began as a way to ward off the darkness during the longest night of the year and has evolved into a joyous community gathering.",
      category: "Customs",
      tags: ["festival", "starlight", "winter solstice", "lanterns", "celestial spirits", "tradition"],
      createdAt: new Date(Date.now() - 86400000 * 7),
      updatedAt: new Date(Date.now() - 86400000 * 1)
    },
    {
      id: 6,
      projectId: parseInt(projectId!),
      title: "The Order of the Silver Dawn",
      content: "A religious organization dedicated to the worship of Lumina, the goddess of light and healing. The Order maintains temples throughout the realm and provides healing services to those in need. Their priests are known for their distinctive silver robes and crescent moon pendants.",
      category: "Religion",
      tags: ["order", "silver dawn", "lumina", "goddess", "healing", "temples", "priests"],
      createdAt: new Date(Date.now() - 86400000 * 12),
      updatedAt: new Date(Date.now() - 86400000 * 4)
    }
  ];

  const deleteLoreEntryMutation = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/lore-entries/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lore-entries", projectId] });
      toast({ title: "Lore entry deleted successfully!" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to delete lore entry", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this lore entry? This action cannot be undone.")) {
      deleteLoreEntryMutation.mutate(id);
    }
  };

  // Filter entries based on search and category
  const filteredEntries = sampleLoreEntries.filter(entry => {
    const matchesSearch = 
      entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === "all" || entry.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = Array.from(new Set(sampleLoreEntries.map(entry => entry.category)));

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        rightContent={
          <Button
            onClick={() => setLocation(`/project/${projectId}/lore/new`)}
            className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] group hover:scale-105 transition-all duration-300"
          >
            <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform duration-300" />
            Add Lore Entry
          </Button>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg flex items-center justify-center group hover:scale-110 hover:rotate-3 transition-all duration-300 shadow-lg">
                <BookOpen className="w-6 h-6 text-[var(--color-50)] group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[var(--color-950)]">Lore</h1>
                <p className="text-[var(--color-700)]">Manage your world's history, culture, and knowledge</p>
              </div>
            </div>

            {/* Search and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-600)] w-4 h-4" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search lore entries..."
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lore Entries Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEntries.map((entry) => {
              const categoryInfo = categoryConfig[entry.category as keyof typeof categoryConfig] || categoryConfig["History"];
              const CategoryIcon = categoryInfo.icon;
              
              return (
                <Card 
                  key={entry.id} 
                  className={`bg-white border-2 ${categoryInfo.borderColor} hover:shadow-xl transition-all duration-300 overflow-hidden group cursor-pointer hover:-translate-y-1`}
                  onClick={() => setLocation(`/project/${projectId}/lore/${entry.id}`)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-10 h-10 ${categoryInfo.color} rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md`}>
                          <CategoryIcon className="w-5 h-5 text-[var(--color-50)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-[var(--color-950)] group-hover:text-orange-600 transition-colors duration-300 line-clamp-2 leading-tight">
                            {entry.title}
                          </h3>
                          <Badge 
                            variant="secondary" 
                            className={`mt-2 ${categoryInfo.bgColor} ${categoryInfo.textColor} border-0 text-xs`}
                          >
                            {entry.category}
                          </Badge>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            setLocation(`/project/${projectId}/lore/${entry.id}/edit`);
                          }}>
                            <Edit3 className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(entry.id);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <p className="text-[var(--color-700)] text-sm mb-4 line-clamp-3 leading-relaxed">
                      {entry.content}
                    </p>

                    {/* Tags */}
                    {entry.tags && entry.tags.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-1">
                          {entry.tags.slice(0, 3).map((tag, index) => (
                            <Badge 
                              key={index}
                              variant="outline" 
                              className="text-xs px-2 py-0.5 bg-[var(--color-100)] hover:bg-[var(--color-200)] transition-colors duration-200"
                            >
                              {tag}
                            </Badge>
                          ))}
                          {entry.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs px-2 py-0.5 bg-[var(--color-100)]">
                              +{entry.tags.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs text-[var(--color-600)] pt-3 border-t border-gray-100">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>
                          {formatDistanceToNow(new Date(entry.updatedAt), { addSuffix: true })}
                        </span>
                      </div>
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <Tag className="w-3 h-3" />
                          <span>{entry.tags.length} tags</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredEntries.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-10 h-10 text-orange-500" />
              </div>
              <h3 className="text-xl font-semibold text-[var(--color-950)] mb-2">
                {searchTerm || selectedCategory !== "all" ? "No lore entries found" : "No lore entries yet"}
              </h3>
              <p className="text-[var(--color-700)] mb-6 max-w-md mx-auto">
                {searchTerm || selectedCategory !== "all" 
                  ? "Try adjusting your search or filter criteria."
                  : "Start building your world's history and knowledge by creating your first lore entry."
                }
              </p>
              <Button
                onClick={() => setLocation(`/project/${projectId}/lore/new`)}
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Lore Entry
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}