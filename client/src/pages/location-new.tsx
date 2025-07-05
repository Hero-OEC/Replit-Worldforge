import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, X, MapPin, Building, Trees, GraduationCap, Crown, Home, Mountain, Anchor, Castle, Building2, Eye, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { useToast } from "@/hooks/use-toast";
import type { Location, ProjectWithStats } from "@shared/schema";

export default function LocationNew() {
  const { projectId } = useParams<{ projectId: string }>();
  const [, setLocation] = useLocation();
  const [locationData, setLocationData] = useState({
    name: "",
    type: "",
    description: "",
    geography: "",
    culture: "",
    significance: ""
  });
  const queryClient = useQueryClient();
  const { goBack, navigateWithHistory } = useNavigation();
  const { toast } = useToast();
  
  // Get the appropriate icon for the location type
  const getTypeIcon = (type: string) => {
    const icons = {
      'City': Building,
      'Building': Home,
      'Wilderness': Trees,
      'Mountains': Mountain,
      'Forest': Trees,
      'Academy': GraduationCap,
      'Palace': Crown,
      'Village': MapPin,
      'Caves': Mountain,
      'Harbor': Anchor,
      'Ruins': Building2,
      'Other': Eye,
    };
    return icons[type as keyof typeof icons] || MapPin;
  };

  // Get the dynamic icon component
  const IconComponent = getTypeIcon(locationData.type);
  
  // Track navigation history
  useNavigationTracker();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const createLocationMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/locations", { ...data, projectId: parseInt(projectId!) });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/locations`] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", projectId] });
      toast({ title: "Location created successfully!" });
      navigateWithHistory(`/project/${projectId}/locations`);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create location", 
        description: error.message || "An error occurred while creating the location",
        variant: "destructive" 
      });
    },
  });

  const handleSave = () => {
    if (!locationData.name.trim()) return;
    if (createLocationMutation.isPending) return; // Prevent double submission
    
    const locationToSave = {
      ...locationData,
      projectId: parseInt(projectId!)
    };
    
    createLocationMutation.mutate(locationToSave);
  };

  const handleCancel = () => {
    navigateWithHistory(`/project/${projectId}/locations`);
  };

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
        
      />

      <main className="p-8 bg-[var(--worldforge-cream)]">
        <div className="max-w-6xl mx-auto">
          {/* Header - matching character edit page layout */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <Button 
                  onClick={() => setLocation(`/project/${projectId}/locations`)}
                  variant="ghost" 
                  size="sm"
                  className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg flex items-center justify-center flex-shrink-0">
                      <IconComponent className="w-5 h-5 text-[var(--color-700)]" />
                    </div>
                    <div className="flex-1">
                      <Input
                        value={locationData.name}
                        onChange={(e) => setLocationData({...locationData, name: e.target.value})}
                        placeholder="Enter location name..."
                        className="text-3xl font-bold text-[var(--color-950)] bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg px-3 py-2 focus:border-[var(--color-500)] focus:bg-[var(--color-100)] focus:ring-2 focus:ring-[var(--color-200)] focus:outline-none transition-all"
                      />
                    </div>
                  </div>
                  <div className="ml-13">
                    <Select 
                      value={locationData.type} 
                      onValueChange={(value) => setLocationData({...locationData, type: value})}
                    >
                      <SelectTrigger className="w-auto bg-[var(--color-100)] text-[var(--color-800)] border-0 focus:ring-0 h-auto p-2 rounded-full text-sm font-medium">
                        {locationData.type ? (
                          <div className="flex items-center space-x-2">
                            <IconComponent className="w-4 h-4" />
                            <span>{locationData.type}</span>
                          </div>
                        ) : (
                          <SelectValue placeholder="Select type" />
                        )}
                      </SelectTrigger>
                      <SelectContent>
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
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button 
                  onClick={handleSave} 
                  disabled={createLocationMutation.isPending || !locationData.name.trim()}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createLocationMutation.isPending ? "Creating..." : "Create Location"}
                </Button>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <MapPin className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Description</span>
            </div>
            <textarea
              value={locationData.description}
              onChange={(e) => setLocationData({...locationData, description: e.target.value})}
              className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
              placeholder="Describe the location, its purpose, and key features..."
            />
          </div>

          {/* Geography Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Mountain className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Geography & Environment</span>
            </div>
            <textarea
              value={locationData.geography}
              onChange={(e) => setLocationData({...locationData, geography: e.target.value})}
              className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
              placeholder="Describe the physical features, layout, climate, and notable landmarks..."
            />
          </div>

          {/* Culture Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Culture & Society</span>
            </div>
            <textarea
              value={locationData.culture}
              onChange={(e) => setLocationData({...locationData, culture: e.target.value})}
              className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
              placeholder="Describe the people, customs, atmosphere, social structure, and way of life..."
            />
          </div>

          {/* Story Significance Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Star className="w-5 h-5 text-[var(--color-700)]" />
              <span className="text-xl font-medium text-gray-700">Story Significance</span>
            </div>
            <textarea
              value={locationData.significance}
              onChange={(e) => setLocationData({...locationData, significance: e.target.value})}
              className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
              placeholder="Explain the role this location plays in your story and why it's important..."
            />
          </div>
        </div>
      </main>
    </div>
  );
}