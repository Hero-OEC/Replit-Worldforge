import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import { Plus, Search, Filter, MapPin, Edit3, MoreHorizontal, Map, Trash2, Building, Trees, GraduationCap, Crown, Home, Mountain, Anchor, Castle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import type { Location, ProjectWithStats } from "@shared/schema";

export default function Locations() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const { navigateWithHistory } = useNavigation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [locationToDelete, setLocationToDelete] = useState<any>(null);

  const queryClient = useQueryClient();

  const handleView = (locationId: number) => {
    navigateWithHistory(`/project/${projectId}/locations/${locationId}`);
  };

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



  const handleDelete = (location: any) => {
    setLocationToDelete(location);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (locationToDelete) {
      console.log("Delete location:", locationToDelete.id);
      // In real app, this would call the delete API
      setDeleteDialogOpen(false);
      setLocationToDelete(null);
    }
  };

  const filteredLocations = sampleLocations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "all" || location.type === selectedType;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors = {
      'City': 'bg-[var(--color-300)] text-[var(--color-900)]',
      'Building': 'bg-[var(--color-200)] text-[var(--color-800)]',
      'Wilderness': 'bg-[var(--color-400)] text-[var(--color-950)]',
      'Mountains': 'bg-[var(--color-500)] text-[var(--color-950)]',
      'Forest': 'bg-[var(--color-400)] text-[var(--color-950)]',
      'Academy': 'bg-[var(--color-300)] text-[var(--color-900)]',
      'Palace': 'bg-[var(--color-500)] text-[var(--color-950)]',
      'Village': 'bg-[var(--color-200)] text-[var(--color-800)]',
      'Caves': 'bg-[var(--color-600)] text-[var(--color-50)]',
      'Harbor': 'bg-[var(--color-400)] text-[var(--color-950)]',
      'Ruins': 'bg-[var(--color-700)] text-[var(--color-50)]',
      'Other': 'bg-[var(--color-300)] text-[var(--color-900)]',
    };
    return colors[type as keyof typeof colors] || 'bg-[var(--color-300)] text-[var(--color-900)]';
  };

  const getTypeIcon = (type: string) => {
    const icons = {
      'City': MapPin,
      'Building': Building,
      'Wilderness': Trees,
      'Mountains': Mountain,
      'Forest': Trees,
      'Academy': GraduationCap,
      'Palace': Crown,
      'Village': Home,
      'Caves': Mountain,
      'Harbor': Anchor,
      'Ruins': Castle,
      'Other': MapPin,
    };
    return icons[type as keyof typeof icons] || MapPin;
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        searchPlaceholder="Search locations..."
      />
      <main className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg hover:bg-[var(--color-600)] cursor-pointer group">
                  <Map className="w-5 h-5 text-[var(--color-50)] transition-transform duration-300 group-hover:bounce group-hover:scale-110" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Locations</h1>
                  <p className="text-[var(--color-700)]">Manage the places in your world</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="City">City</SelectItem>
                    <SelectItem value="Building">Building</SelectItem>
                    <SelectItem value="Wilderness">Wilderness</SelectItem>
                    <SelectItem value="Mountains">Mountains</SelectItem>
                    <SelectItem value="Forest">Forest</SelectItem>
                    <SelectItem value="Academy">Academy</SelectItem>
                    <SelectItem value="Palace">Palace</SelectItem>
                    <SelectItem value="Village">Village</SelectItem>
                    <SelectItem value="Caves">Caves</SelectItem>
                    <SelectItem value="Harbor">Harbor</SelectItem>
                    <SelectItem value="Ruins">Ruins</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
                  onClick={() => setLocation(`/project/${projectId}/locations/new`)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
            </div>
          </div>



          {/* Locations Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLocations.map((location) => (
              <Card 
                key={location.id} 
                className="rounded-lg text-card-foreground shadow-sm p-6 hover:shadow-md transition-shadow border border-[var(--color-300)] cursor-pointer bg-[#f4f0cd]"
                onClick={() => handleView(location.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group/icon">
                      {(() => {
                        const IconComponent = getTypeIcon(location.type);
                        return <IconComponent className="w-6 h-6 text-[var(--color-700)] transition-transform duration-300 group-hover/icon:bounce group-hover/icon:scale-110" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-[var(--color-950)]">{location.name}</h3>
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
                          handleDelete(location);
                        }}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <p className="text-[var(--color-700)] text-sm mb-4 line-clamp-3">
                  {location.description}
                </p>

                <div className="flex items-center justify-between text-sm text-[var(--color-600)]">
                  <span>Story significance</span>
                  <span className="font-medium">Click to view details</span>
                </div>
              </Card>
            ))}
          </div>

          {filteredLocations.length === 0 && (
            <div className="text-center py-12">
              <MapPin className="w-12 h-12 text-[var(--color-600)] mx-auto mb-4" />
              <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No locations found</h3>
              <p className="text-[var(--color-700)] mb-6">
                {searchTerm ? 'Try adjusting your search terms.' : 'Start building your world by adding locations.'}
              </p>
              <Button 
                className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                onClick={() => setLocation(`/project/${projectId}/locations/new`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Location
              </Button>
            </div>
          )}
        </div>
      </main>

      {locationToDelete && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete Location"
          itemName={locationToDelete.name}
          description={`Are you sure you want to delete "${locationToDelete.name}"? This action cannot be undone and will permanently remove the location and all associated data.`}
        />
      )}
    </div>
  );
}