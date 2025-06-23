import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, Sparkles, Edit3, MoreHorizontal, BookOpen, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/layout/navbar";
import type { ProjectWithStats } from "@shared/schema";

export default function Lore() {
  const { projectId } = useParams<{ projectId: string }>();
  const [searchTerm, setSearchTerm] = useState("");

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Sample lore entries
  const sampleLore = [
    {
      id: 1,
      title: "The Great Convergence",
      category: "Historical Event",
      description: "The event that created the modern magical world 1000 years ago",
      content: "When the ancient barriers between realms collapsed, magic flooded into the mortal world, forever changing the balance of power.",
      importance: "High"
    },
    {
      id: 2,
      title: "Council of Mages",
      category: "Organization",
      description: "The governing body of magical practitioners",
      content: "Established after the Great Convergence to regulate magical practice and maintain peace between magical and non-magical populations.",
      importance: "Medium"
    },
    {
      id: 3,
      title: "The Ancient Prophecy",
      category: "Prophecy",
      description: "Foretells the coming of a mage who will either save or destroy the realm",
      content: "When shadows rise and light grows dim, the Chosen One shall come within. With power vast and heart so true, the fate of all rests upon you.",
      importance: "High"
    }
  ];

  // Sample magic systems
  const sampleMagicSystems = [
    {
      id: 1,
      name: "Elemental Magic",
      type: "Classic Elements",
      description: "Magic based on the four classical elements: Fire, Water, Earth, and Air",
      rules: "Practitioners can only master one element, but can learn basic skills in others. Power increases with emotional connection.",
      limitations: "Overuse causes physical exhaustion. Opposing elements are harder to control.",
      examples: "Elena's fire magic, Marcus's earth manipulation"
    },
    {
      id: 2,
      name: "Shadow Weaving",
      type: "Dark Magic",
      description: "Manipulation of shadows and darkness for various effects",
      rules: "Requires sacrifice of light or positive emotions. More powerful at night or in dark places.",
      limitations: "Corrupts the user over time. Vulnerable to pure light magic.",
      examples: "Lord Vex's primary magical discipline"
    }
  ];

  const filteredLore = sampleLore.filter(entry =>
    entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMagic = sampleMagicSystems.filter(system =>
    system.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    system.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    system.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search lore and magic..."
        onSearch={setSearchTerm}
        rightContent={
          <Button className="bg-orange-500 text-white hover:bg-orange-600">
            <Plus className="w-4 h-4 mr-2" />
            Add Entry
          </Button>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Lore</h1>
                <p className="text-gray-600">Document your world's history, magic systems, and mythology</p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="lore" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="lore" className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4" />
                <span>Lore Entries</span>
              </TabsTrigger>
              <TabsTrigger value="magic" className="flex items-center space-x-2">
                <Zap className="w-4 h-4" />
                <span>Magic Systems</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="lore" className="space-y-6">
              {/* Add Lore Button */}
              <div className="flex justify-end">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Lore Entry
                </Button>
              </div>

              {/* Lore Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLore.map((entry) => (
                  <Card key={entry.id} className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{entry.title}</h3>
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {entry.category}
                          </Badge>
                          <Badge variant={entry.importance === 'High' ? 'destructive' : 'secondary'} className="text-xs">
                            {entry.importance}
                          </Badge>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{entry.description}</p>
                    
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-xs text-gray-700 italic">"{entry.content}"</p>
                    </div>

                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredLore.length === 0 && (
                <div className="text-center py-12">
                  <BookOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No lore entries found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Start documenting your world\'s history and mythology.'}
                  </p>
                  <Button className="bg-orange-500 text-white hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Lore Entry
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="magic" className="space-y-6">
              {/* Add Magic System Button */}
              <div className="flex justify-end">
                <Button className="bg-orange-500 text-white hover:bg-orange-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Magic System
                </Button>
              </div>

              {/* Magic Systems Grid */}
              <div className="space-y-6">
                {filteredMagic.map((system) => (
                  <Card key={system.id} className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">{system.name}</h3>
                        <Badge variant="outline" className="text-xs">
                          {system.type}
                        </Badge>
                      </div>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>

                    <p className="text-sm text-gray-600 mb-4">{system.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Rules</h4>
                        <p className="text-xs text-gray-600">{system.rules}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Limitations</h4>
                        <p className="text-xs text-gray-600">{system.limitations}</p>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Examples</h4>
                        <p className="text-xs text-gray-600">{system.examples}</p>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button size="sm" variant="outline">
                        <Edit3 className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredMagic.length === 0 && (
                <div className="text-center py-12">
                  <Zap className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No magic systems found</h3>
                  <p className="text-gray-500 mb-6">
                    {searchTerm ? 'Try adjusting your search terms.' : 'Define the magical rules and systems in your world.'}
                  </p>
                  <Button className="bg-orange-500 text-white hover:bg-orange-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Magic System
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}