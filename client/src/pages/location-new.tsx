import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, X, MapPin, Building, Trees, GraduationCap, Crown, Home, Mountain, Anchor, Castle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
        searchPlaceholder="Search locations..."
      />

      <main className="p-8 bg-[var(--worldforge-cream)]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-[var(--color-700)] hover:text-[var(--color-950)]"
                onClick={goBack}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Add New Location</h1>
                <p className="text-[var(--color-700)]">Create a new place in your world</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button onClick={handleCancel} variant="outline">
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

          {/* Location Form */}
          <div className="space-y-8">
            {/* Basic Info Card */}
            <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
              <div className="flex items-center space-x-6">
                <div className="w-24 h-24 bg-[var(--color-200)] rounded-full flex items-center justify-center">
                  <IconComponent className="w-12 h-12 text-[var(--color-700)]" />
                </div>
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                      <Input
                        value={locationData.name}
                        onChange={(e) => setLocationData({...locationData, name: e.target.value})}
                        placeholder="Location name"
                        className="text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <Select 
                        value={locationData.type} 
                        onValueChange={(value) => setLocationData({...locationData, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="City">City</SelectItem>
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
              </div>
            </Card>

            {/* Details Tabs */}
            <Tabs defaultValue="basics" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basics">Basics</TabsTrigger>
                <TabsTrigger value="geography">Geography</TabsTrigger>
                <TabsTrigger value="culture">Culture</TabsTrigger>
                <TabsTrigger value="significance">Significance</TabsTrigger>
              </TabsList>

              <TabsContent value="basics" className="space-y-6">
                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-950)] mb-4">Description</h3>
                  <textarea
                    value={locationData.description}
                    onChange={(e) => setLocationData({...locationData, description: e.target.value})}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Brief description of the location. What makes this place unique and important?"
                  />
                </Card>
              </TabsContent>

              <TabsContent value="geography" className="space-y-6">
                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-950)] mb-4">Geography & Environment</h3>
                  <textarea
                    value={locationData.geography}
                    onChange={(e) => setLocationData({...locationData, geography: e.target.value})}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Describe the physical features, layout, climate, and notable landmarks of this location..."
                  />
                </Card>
              </TabsContent>

              <TabsContent value="culture" className="space-y-6">
                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-950)] mb-4">Culture & Society</h3>
                  <textarea
                    value={locationData.culture}
                    onChange={(e) => setLocationData({...locationData, culture: e.target.value})}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Describe the people, customs, atmosphere, social structure, and way of life in this location..."
                  />
                </Card>
              </TabsContent>

              <TabsContent value="significance" className="space-y-6">
                <Card className="bg-[var(--worldforge-card)] border border-[var(--border)] p-6">
                  <h3 className="text-lg font-semibold text-[var(--color-950)] mb-4">Story Significance</h3>
                  <textarea
                    value={locationData.significance}
                    onChange={(e) => setLocationData({...locationData, significance: e.target.value})}
                    className="w-full h-32 px-3 py-2 border border-gray-300 rounded-md resize-none"
                    placeholder="Explain the role this location plays in your story. Why is it important to the plot or characters?"
                  />
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}