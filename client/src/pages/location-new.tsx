import { useState } from "react";
import { useParams, Link, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { ArrowLeft, Save, X, MapPin, Building, Trees, GraduationCap, Crown, Home, Mountain, Anchor, Castle, Building2, Eye, Star, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
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
                  onClick={handleSave} 
                  disabled={createLocationMutation.isPending || !locationData.name.trim()}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {createLocationMutation.isPending ? "Creating..." : "Save Changes"}
                </Button>
                <Button 
                  onClick={handleCancel} 
                  variant="outline"
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
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
                        <Textarea
                          value={locationData.description}
                          onChange={(e) => setLocationData({...locationData, description: e.target.value})}
                          className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                          placeholder="Describe the location..."
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="geography" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Geography</label>
                        <Textarea
                          value={locationData.geography}
                          onChange={(e) => setLocationData({...locationData, geography: e.target.value})}
                          className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                          placeholder="Describe the geographical features..."
                        />
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="culture" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Culture</label>
                        <Textarea
                          value={locationData.culture}
                          onChange={(e) => setLocationData({...locationData, culture: e.target.value})}
                          className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                          placeholder="Describe the cultural aspects..."
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
                        <Textarea
                          value={locationData.significance}
                          onChange={(e) => setLocationData({...locationData, significance: e.target.value})}
                          className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                          placeholder="What makes this location significant..."
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