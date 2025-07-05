import React, { useState, useRef, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useNavigation, useNavigationTracker } from "@/contexts/navigation-context";
import { 
  ArrowLeft, 
  Edit3, 
  Save, 
  X, 
  Check,
  MapPin, 
  Clock,
  Star,
  Calendar,
  Users,
  Eye,
  Swords,
  Lightbulb,
  Award,
  Crown,
  Heart,
  HelpCircle,
  Sparkles,
  Zap,
  Plane,
  User,
  Building,
  Trees,
  Mountain,
  GraduationCap,
  Home,
  Anchor,
  Castle,
  Building2,
  Tent
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/layout/navbar";
import SerpentineTimeline from "@/components/timeline/serpentine-timeline";
import type { Location, ProjectWithStats, TimelineEvent } from "@shared/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

const priorityColors = {
  high: "bg-[var(--color-700)]",
  medium: "bg-[var(--color-500)]",
  low: "bg-[var(--color-300)]",
};

const priorityLabels = {
  high: "High Priority",
  medium: "Medium Priority",
  low: "Low Priority",
};

// Available location types
const locationTypes = [
  'City',
  'Building', 
  'Wilderness',
  'Mountains',
  'Forest',
  'Academy',
  'Palace',
  'Village',
  'Caves',
  'Harbor',
  'Ruins',
  'Other'
];

// Helper functions for location types
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

const eventTypeIcons = {
  "Character Development": User,
  Discovery: Eye,
  Conflict: Swords,
  Revelation: Lightbulb,
  "Heroic Act": Award,
  "Political Event": Crown,
  Romance: Heart,
  Mystery: HelpCircle,
  Magic: Sparkles,
  Battle: Zap,
  Traveling: Plane,
};





export default function LocationDetail() {
  const { projectId, locationId } = useParams<{ projectId: string; locationId: string }>();
  const [currentLocation, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [locationFormData, setLocationFormData] = useState({
    name: "",
    type: "",
    description: "",
    geography: "",
    culture: "",
    significance: ""
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useNavigationTracker();
  const { goBack } = useNavigation();

  // Fetch project data
  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    enabled: !!projectId,
  });

  // Fetch location data from API
  const { data: locationData, isLoading: isLocationLoading } = useQuery<Location>({
    queryKey: [`/api/locations/${locationId}`],
    enabled: !!locationId,
  });

  // Initialize form data when location data is loaded
  useEffect(() => {
    if (locationData && !isEditing) {
      setLocationFormData({
        name: locationData.name || "",
        type: locationData.type || "",
        description: locationData.description || "",
        geography: locationData.geography || "",
        culture: locationData.culture || "",
        significance: locationData.significance || ""
      });
    }
  }, [locationData, isEditing]);

  // Update location mutation
  const updateLocationMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/api/locations/${locationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(locationFormData),
      });
      if (!res.ok) {
        throw new Error("Failed to update location");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/locations/${locationId}`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}/locations`] });
      queryClient.invalidateQueries({ queryKey: [`/api/projects/${projectId}`] });
      toast({ title: "Location updated successfully!" });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update location", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSave = () => {
    if (!locationFormData.name.trim()) {
      toast({ 
        title: "Name is required", 
        description: "Please enter a location name",
        variant: "destructive" 
      });
      return;
    }
    updateLocationMutation.mutate();
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (locationData) {
      setLocationFormData({
        name: locationData.name || "",
        type: locationData.type || "",
        description: locationData.description || "",
        geography: locationData.geography || "",
        culture: locationData.culture || "",
        significance: locationData.significance || ""
      });
    }
  };







  if (isLocationLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-[var(--color-700)]">Loading location...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!locationData) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-[var(--color-700)]">Location not found</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId}
        projectTitle={project?.title}
        showProjectNav={true}
      />

      <main className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button
                  variant="ghost" 
                  onClick={() => setLocation(`/project/${projectId}/locations`)}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Locations
                </Button>
              </div>

              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
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
                      disabled={updateLocationMutation.isPending}
                      className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {updateLocationMutation.isPending ? "Saving..." : "Save Changes"}
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Location
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-lg group/icon">
                {(() => {
                  const IconComponent = getTypeIcon(isEditing ? locationFormData.type || 'Other' : locationData.type || 'Other');
                  return <IconComponent className="w-6 h-6 text-[var(--color-700)] transition-transform duration-300 group-hover/icon:bounce group-hover/icon:scale-110" />;
                })()}
              </div>
              <div>
                {isEditing ? (
                  <Input
                    value={locationFormData.name}
                    onChange={(e) => setLocationFormData({...locationFormData, name: e.target.value})}
                    className="text-2xl font-bold bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] h-12"
                    placeholder="Location Name"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">{locationData.name}</h1>
                )}
                
                <div className="mt-2">
                  {isEditing ? (
                    <Select 
                      value={locationFormData.type} 
                      onValueChange={(value) => setLocationFormData({...locationFormData, type: value})}
                    >
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {locationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Badge className={getTypeColor(locationData.type || 'Other')}>
                      {locationData.type || 'Location'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                <Tabs defaultValue="details" className="w-full">
                  <TabsList className="grid w-full grid-cols-5 bg-[var(--color-100)]">
                    <TabsTrigger value="details" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Details</TabsTrigger>
                    <TabsTrigger value="geography" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Geography</TabsTrigger>
                    <TabsTrigger value="culture" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Culture</TabsTrigger>
                    <TabsTrigger value="significance" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Significance</TabsTrigger>
                    <TabsTrigger value="timeline" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Timeline</TabsTrigger>
                  </TabsList>

                  <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Description</label>
                          {isEditing ? (
                            <Textarea
                              value={locationFormData.description}
                              onChange={(e) => setLocationFormData({...locationFormData, description: e.target.value})}
                              className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-48"
                              placeholder="Describe the location..."
                            />
                          ) : (
                            <p className="text-[var(--color-950)] leading-relaxed">{locationData.description}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="geography" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Geography</label>
                          {isEditing ? (
                            <Textarea
                              value={locationFormData.geography}
                              onChange={(e) => setLocationFormData({...locationFormData, geography: e.target.value})}
                              className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-64"
                              placeholder="Describe the geographical features..."
                            />
                          ) : (
                            <p className="text-[var(--color-950)] leading-relaxed">{locationData.geography}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="culture" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Culture</label>
                          {isEditing ? (
                            <Textarea
                              value={locationFormData.culture}
                              onChange={(e) => setLocationFormData({...locationFormData, culture: e.target.value})}
                              className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-64"
                              placeholder="Describe the cultural aspects..."
                            />
                          ) : (
                            <p className="text-[var(--color-950)] leading-relaxed">{locationData.culture}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="significance" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Significance</label>
                          {isEditing ? (
                            <Textarea
                              value={locationFormData.significance}
                              onChange={(e) => setLocationFormData({...locationFormData, significance: e.target.value})}
                              className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-48"
                              placeholder="What makes this location significant..."
                            />
                          ) : (
                            <p className="text-[var(--color-950)] leading-relaxed">{locationData.significance}</p>
                          )}
                        </div>
                      </div>
                    </Card>
                  </TabsContent>

                  <TabsContent value="timeline" className="space-y-6 bg-[var(--worldforge-bg)]">
                    <div className="space-y-6">
                      <div className="flex items-center space-x-3 mb-6">
                        <div className="w-10 h-10 bg-[var(--color-500)] rounded-lg flex items-center justify-center">
                          <Clock className="w-5 h-5 text-[var(--color-50)]" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[var(--color-950)]">Location Timeline</h3>
                          <p className="text-sm text-[var(--color-700)]">
                            Events that take place in {locationData.name}
                          </p>
                        </div>
                      </div>

                      <div className="w-full">
                        <SerpentineTimeline 
                          filterLocation={locationData.name}
                          showEditButtons={true}
                          className="w-full"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}