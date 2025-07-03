import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, X, MapPin, Building, Trees, GraduationCap, Crown, Home, Mountain, Anchor, Castle, Building2, Eye, Star, Users } from "lucide-react";
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
        searchPlaceholder="Search locations..."
      />

      <main className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back Button */}
          <div className="mb-6">
            <Button
              variant="ghost" 
              onClick={goBack}
              className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Button>
          </div>

          {/* Header with Icon and Title Input */}
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group/icon">
              <IconComponent className="w-6 h-6 text-[var(--color-700)] transition-transform duration-300 group-hover/icon:bounce group-hover/icon:scale-110" />
            </div>
            <div className="flex-1">
              <Input
                value={locationData.name}
                onChange={(e) => setLocationData({...locationData, name: e.target.value})}
                className="text-2xl font-bold bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] h-12 focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                placeholder="Location Name"
              />
              <div className="mt-2">
                <Select 
                  value={locationData.type} 
                  onValueChange={(value) => setLocationData({...locationData, type: value})}
                >
                  <SelectTrigger className="w-48 bg-[var(--color-50)] border-[var(--color-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-500)]">
                    <SelectValue placeholder="Select type" />
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
            <div className="flex items-center space-x-3">
              <Button onClick={handleCancel} variant="outline" className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]">
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

          {/* Tabbed Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-4 bg-[var(--color-100)]">
                  <TabsTrigger value="details" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Details</TabsTrigger>
                  <TabsTrigger value="geography" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Geography</TabsTrigger>
                  <TabsTrigger value="culture" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Culture</TabsTrigger>
                  <TabsTrigger value="significance" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Significance</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Description</label>
                        <textarea
                          value={locationData.description}
                          onChange={(e) => setLocationData({...locationData, description: e.target.value})}
                          className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                          placeholder="Brief description of the location. What makes this place unique and important?"
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="geography" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Geography & Environment</label>
                        <textarea
                          value={locationData.geography}
                          onChange={(e) => setLocationData({...locationData, geography: e.target.value})}
                          className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                          placeholder="Describe the physical features, layout, climate, and notable landmarks of this location..."
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="culture" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Culture & Society</label>
                        <textarea
                          value={locationData.culture}
                          onChange={(e) => setLocationData({...locationData, culture: e.target.value})}
                          className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                          placeholder="Describe the people, customs, atmosphere, social structure, and way of life in this location..."
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="significance" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Story Significance</label>
                        <textarea
                          value={locationData.significance}
                          onChange={(e) => setLocationData({...locationData, significance: e.target.value})}
                          className="w-full min-h-48 px-4 py-3 bg-[var(--color-50)] border border-[var(--color-300)] text-[var(--color-950)] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[var(--color-500)] focus:border-transparent"
                          placeholder="Explain the role this location plays in your story. Why is it important to the plot or characters?"
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}