import { useState } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search, Filter, MapPin, Edit3, MoreHorizontal, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import type { Location, ProjectWithStats } from "@shared/schema";

export default function Locations() {
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

  // Sample locations for demonstration
  const sampleLocations = [
    {
      id: 1,
      name: "Arcanum City",
      type: "City",
      description: "The magical capital where the Academy of Mystic Arts is located",
      geography: "Built on floating islands connected by crystal bridges",
      culture: "Scholarly and mystical, ruled by the Council of Mages",
      significance: "Primary setting for Elena's training and early adventures"
    },
    {
      id: 2,
      name: "The Forbidden Library",
      type: "Building",
      description: "Hidden archive containing dangerous magical knowledge",
      geography: "Underground beneath the Academy, accessible through secret passages",
      culture: "Mysterious and forbidden, guarded by ancient wards",
      significance: "Where Elena and Marcus discover crucial plot information"
    },
    {
      id: 3,
      name: "Shadowmere Forest",
      type: "Wilderness",
      description: "Dark woodland where creatures of shadow dwell",
      geography: "Dense forest with twisted trees that block out sunlight",
      culture: "Wild and untamed, home to ancient spirits",
      significance: "Setting for Elena's first major trial"
    },
    {
      id: 4,
      name: "Crystal Peaks",
      type: "Mountains",
      description: "Magical mountain range with powerful ley lines",
      geography: "Snow-capped peaks made of crystallized magic",
      culture: "Sacred to the ancient druids, avoided by most",
      significance: "Source of the realm's magical energy"
    }
  ];

  const filteredLocations = sampleLocations.filter(location =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    const colors = {
      'City': 'bg-blue-100 text-blue-800',
      'Building': 'bg-green-100 text-green-800',
      'Wilderness': 'bg-yellow-100 text-yellow-800',
      'Mountains': 'bg-purple-100 text-purple-800',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search locations..."
        onSearch={setSearchTerm}
        rightContent={
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <Button className="bg-orange-500 text-white hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              Add Location
            </Button>
          </div>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                <p className="text-gray-600">Build and manage your story's world and settings</p>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleLocations.length}</p>
                <p className="text-sm text-gray-600">Total Locations</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleLocations.filter(l => l.type === 'City').length}</p>
                <p className="text-sm text-gray-600">Cities</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleLocations.filter(l => l.type === 'Wilderness').length}</p>
                <p className="text-sm text-gray-600">Wild Areas</p>
              </div>
            </Card>
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-900">{sampleLocations.filter(l => l.type === 'Building').length}</p>
                <p className="text-sm text-gray-600">Buildings</p>
              </div>
            </Card>
          </div>

          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredLocations.map((location) => (
              <Card key={location.id} className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{location.name}</h3>
                      <Badge className={`text-xs ${getTypeColor(location.type)}`}>
                        {location.type}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>

                <p className="text-sm text-gray-600 mb-4">{location.description}</p>

                <div className="space-y-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium">Geography:</span>
                    <p className="line-clamp-2">{location.geography}</p>
                  </div>
                  <div>
                    <span className="font-medium">Culture:</span>
                    <p className="line-clamp-2">{location.culture}</p>
                  </div>
                  <div>
                    <span className="font-medium">Story Significance:</span>
                    <p className="line-clamp-2">{location.significance}</p>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <Button size="sm" variant="outline">
                    <Edit3 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start building your world by adding locations.'}
              </p>
              <Button className="bg-orange-500 text-white hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Location
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}