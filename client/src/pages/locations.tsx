import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Search, Filter, MapPin, Edit3, MoreHorizontal, Map, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import type { Location, ProjectWithStats } from "@shared/schema";

export default function Locations() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");

  const queryClient = useQueryClient();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  // Sample locations for now - will connect to API later
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

  const resetForm = () => {
    setLocationData({
      name: "",
      type: "",
      description: "",
      geography: "",
      culture: "",
      significance: ""
    });
  };

  const handleEdit = (location: any) => {
    setEditingLocation(location);
    setLocationData({
      name: location.name,
      type: location.type,
      description: location.description,
      geography: location.geography || "",
      culture: location.culture || "",
      significance: location.significance || ""
    });
  };

  const handleSubmit = () => {
    // For now, just reset and close dialog
    console.log("Location data:", locationData);
    setEditingLocation(null);
    setShowAddDialog(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    console.log("Delete location:", id);
  };

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
        rightContent={
          <Button
            onClick={() => setLocation(`/project/${projectId}/locations/new`)}
            className="bg-orange-500 text-white hover:bg-orange-600"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Location
          </Button>
        }
      />

      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
                <Map className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                <p className="text-gray-600">Manage the places in your world</p>
              </div>
            </div>
          </div>



          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <Card 
                key={location.id} 
                className="p-6 hover:shadow-md transition-shadow bg-white border border-gray-200 cursor-pointer"
                onClick={() => handleView(location.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
                      <Badge className={getTypeColor(location.type)}>
                        {location.type}
                      </Badge>
                    </div>
                  </div>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation();
                        handleView(location.id);
                      }}>
                        <Edit3 className="w-4 h-4 mr-2" />
                        View/Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(location.id);
                        }}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {location.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Story significance</span>
                  <span className="font-medium">Click to view details</span>
                </div>
              </Card>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No locations found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start building your world by adding locations.'}
              </p>
              <Button 
                className="bg-orange-500 text-white hover:bg-orange-600"
                onClick={() => setLocation(`/project/${projectId}/locations/new`)}
              >
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