import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigation } from "@/contexts/navigation-context";
import { ArrowLeft, Edit3, Trash2, Sparkles, Zap, Users, X, Battery, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MasonryGrid, MasonryItem } from "@/components/ui/masonry-grid";
import { CharacterCard } from "@/components/ui/character-card";
import Navbar from "@/components/layout/navbar";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { useToast } from "@/hooks/use-toast";
import type { MagicSystem, Character, ProjectWithStats } from "@shared/schema";

export default function MagicSystemDetail() {
  const { projectId, magicSystemId } = useParams<{ projectId: string; magicSystemId: string }>();
  const [, setLocation] = useLocation();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [magicSystemFormData, setMagicSystemFormData] = useState({
    name: "",
    category: "",
    description: "",
    rules: "",
    limitations: "",
    source: "",
    cost: ""
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { goBack } = useNavigation();

  const getCategoryIcon = (category: string) => {
    return category === "power" ? Zap : Sparkles;
  };

  const getCategoryColor = (category: string) => {
    return category === "power" 
      ? "bg-[var(--color-200)] text-[var(--color-950)]" 
      : "bg-[var(--color-300)] text-[var(--color-950)]";
  };



  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ["/api/projects", projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) throw new Error("Failed to fetch project");
      return response.json();
    },
  });

  const { data: magicSystem, isLoading } = useQuery<MagicSystem>({
    queryKey: ["/api/magic-systems", magicSystemId],
    queryFn: async () => {
      const response = await fetch(`/api/magic-systems/${magicSystemId}`);
      if (!response.ok) throw new Error("Failed to fetch magic system");
      return response.json();
    },
  });

  const { data: connectedCharacters = [] } = useQuery<Character[]>({
    queryKey: ["/api/magic-systems", magicSystemId, "characters"],
    queryFn: async () => {
      if (!magicSystemId) return [];
      const response = await fetch(`/api/magic-systems/${magicSystemId}/characters`);
      if (!response.ok) throw new Error("Failed to fetch connected characters");
      return response.json();
    },
    enabled: !!magicSystemId,
  });

  // Initialize form data when magic system data loads
  useEffect(() => {
    if (magicSystem && !isEditing) {
      setMagicSystemFormData({
        name: magicSystem.name || "",
        category: magicSystem.category || "",
        description: magicSystem.description || "",
        rules: magicSystem.rules || "",
        limitations: magicSystem.limitations || "",
        source: magicSystem.source || "",
        cost: magicSystem.cost || ""
      });
    }
  }, [magicSystem, isEditing]);

  // Update magic system mutation
  const updateMagicSystemMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/magic-systems/${magicSystemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(magicSystemFormData),
      });
      if (!response.ok) throw new Error("Failed to update magic system");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", magicSystemId] });
      toast({ title: "Magic system updated successfully!" });
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update magic system", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleSave = () => {
    if (!magicSystemFormData.name.trim()) {
      toast({ 
        title: "Name is required", 
        description: "Please enter a magic system name",
        variant: "destructive" 
      });
      return;
    }
    updateMagicSystemMutation.mutate();
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original values
    if (magicSystem) {
      setMagicSystemFormData({
        name: magicSystem.name || "",
        category: magicSystem.category || "",
        description: magicSystem.description || "",
        rules: magicSystem.rules || "",
        limitations: magicSystem.limitations || "",
        source: magicSystem.source || "",
        cost: magicSystem.cost || ""
      });
    }
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/magic-systems/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete magic system");
      return response.ok;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/magic-systems", projectId] });
      toast({
        title: "Magic system deleted",
        description: "The magic system has been removed successfully.",
      });
      setLocation(`/project/${projectId}/magic-systems`);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete magic system. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    deleteMutation.mutate(parseInt(magicSystemId!));
    setDeleteDialogOpen(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="pt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header skeleton */}
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-[var(--color-200)] rounded w-32 animate-pulse"></div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="h-9 bg-[var(--color-200)] rounded w-16 animate-pulse"></div>
                  <div className="h-9 bg-[var(--color-200)] rounded w-16 animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* Title and category skeleton */}
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg animate-pulse"></div>
                <div className="flex-1">
                  <div className="space-y-2">
                    <div className="h-8 bg-[var(--color-200)] rounded w-64 animate-pulse"></div>
                    <div className="h-6 bg-[var(--color-200)] rounded w-32 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-3">
                {/* Tab list skeleton */}
                <div className="grid w-full grid-cols-5 bg-[var(--color-100)] rounded-lg p-1 mb-6">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-9 bg-[var(--color-200)] rounded animate-pulse mx-1"></div>
                  ))}
                </div>
                
                {/* Tab content skeleton */}
                <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                  <div className="space-y-4">
                    <div className="h-4 bg-[var(--color-200)] rounded w-20 animate-pulse"></div>
                    <div className="space-y-3">
                      <div className="h-3 bg-[var(--color-200)] rounded animate-pulse"></div>
                      <div className="h-3 bg-[var(--color-200)] rounded w-4/5 animate-pulse"></div>
                      <div className="h-3 bg-[var(--color-200)] rounded w-3/4 animate-pulse"></div>
                      <div className="h-3 bg-[var(--color-200)] rounded w-5/6 animate-pulse"></div>
                      <div className="h-3 bg-[var(--color-200)] rounded w-2/3 animate-pulse"></div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!magicSystem) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
          
        />
        <main className="p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-[var(--color-950)] mb-2">Magic System Not Found</h2>
              <p className="text-[var(--color-700)] mb-4">The magic system you're looking for doesn't exist.</p>
              <Button onClick={() => setLocation(`/project/${projectId}/magic-systems`)}>
                Back to Magic Systems
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const CategoryIcon = getCategoryIcon(magicSystem.category || "magic");

  // connectedCharacters now comes directly from the API with proper relationships

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
                  onClick={() => setLocation(`/project/${projectId}/magic-systems`)}
                  className="text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Magic Systems
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
                      className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      onClick={() => setIsEditing(true)}
                      className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleDelete}
                      className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700 hover:border-red-400"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Header with Title and Category */}
          <div className="space-y-6 mb-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
                <CategoryIcon className="w-6 h-6 text-[var(--color-700)]" />
              </div>
              <div className="flex-1">
                <div className="space-y-2">
                  {isEditing ? (
                    <Input
                      value={magicSystemFormData.name}
                      onChange={(e) => setMagicSystemFormData({...magicSystemFormData, name: e.target.value})}
                      className="text-2xl font-bold bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] max-w-md"
                      placeholder="Magic system name"
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-[var(--color-950)]">{magicSystem.name}</h1>
                  )}
                  
                  {/* Category Display/Edit directly under title */}
                  {isEditing ? (
                    <Select 
                      value={magicSystemFormData.category} 
                      onValueChange={(value) => setMagicSystemFormData({...magicSystemFormData, category: value})}
                    >
                      <SelectTrigger className="w-48 bg-[var(--color-50)] border-[var(--color-300)]">
                        <div className="flex items-center space-x-2">
                          <CategoryIcon className="w-4 h-4" />
                          <SelectValue placeholder="Select category" />
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="magic">Magic System</SelectItem>
                        <SelectItem value="power">Power System</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <div className={`inline-flex items-center px-3 py-1 ${getCategoryColor(magicSystem.category || "magic")} rounded-full text-sm font-medium`}>
                      <span>{magicSystem.category === "power" ? "Power System" : "Magic System"}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tabbed Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-3">
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-5 bg-[var(--color-100)]">
                  <TabsTrigger value="details" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Details</TabsTrigger>
                  <TabsTrigger value="rules" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Rules</TabsTrigger>
                  <TabsTrigger value="limitations" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Limitations</TabsTrigger>
                  <TabsTrigger value="source" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Source & Cost</TabsTrigger>
                  <TabsTrigger value="characters" className="data-[state=active]:bg-[var(--color-500)] data-[state=active]:text-white">Characters</TabsTrigger>
                </TabsList>

                <TabsContent value="details" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Description</label>
                        {isEditing ? (
                          <Textarea
                            value={magicSystemFormData.description}
                            onChange={(e) => setMagicSystemFormData({...magicSystemFormData, description: e.target.value})}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                            placeholder="Describe the magic system..."
                          />
                        ) : (
                          <p className="text-[var(--color-950)] leading-relaxed">{magicSystem.description || "No description provided"}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="rules" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Rules</label>
                        {isEditing ? (
                          <Textarea
                            value={magicSystemFormData.rules}
                            onChange={(e) => setMagicSystemFormData({...magicSystemFormData, rules: e.target.value})}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                            placeholder="Define the rules of the magic system..."
                          />
                        ) : (
                          <p className="text-[var(--color-950)] leading-relaxed">{magicSystem.rules || "No rules specified"}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="limitations" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Limitations</label>
                        {isEditing ? (
                          <Textarea
                            value={magicSystemFormData.limitations}
                            onChange={(e) => setMagicSystemFormData({...magicSystemFormData, limitations: e.target.value})}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-96"
                            placeholder="What are the limitations and weaknesses..."
                          />
                        ) : (
                          <p className="text-[var(--color-950)] leading-relaxed">{magicSystem.limitations || "No limitations specified"}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="source" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Source</label>
                        {isEditing ? (
                          <Textarea
                            value={magicSystemFormData.source}
                            onChange={(e) => setMagicSystemFormData({...magicSystemFormData, source: e.target.value})}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-48"
                            placeholder="Where does this power come from..."
                          />
                        ) : (
                          <p className="text-[var(--color-950)] leading-relaxed">{magicSystem.source || "No source specified"}</p>
                        )}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-[var(--color-700)] mb-2">Cost</label>
                        {isEditing ? (
                          <Textarea
                            value={magicSystemFormData.cost}
                            onChange={(e) => setMagicSystemFormData({...magicSystemFormData, cost: e.target.value})}
                            className="bg-[var(--color-50)] border-[var(--color-300)] text-[var(--color-950)] min-h-48"
                            placeholder="What does it cost to use..."
                          />
                        ) : (
                          <p className="text-[var(--color-950)] leading-relaxed">{magicSystem.cost || "No cost specified"}</p>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="characters" className="space-y-6 bg-[var(--worldforge-bg)]">
                  <Card className="border border-[var(--color-300)] p-6 bg-[#f4f0cd00]">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-[var(--color-950)]">Connected Characters ({connectedCharacters.length})</h3>
                      {connectedCharacters.length > 0 ? (
                        <MasonryGrid>
                          {connectedCharacters.map((character) => (
                            <MasonryItem key={character.id}>
                              <CharacterCard 
                                character={character}
                                projectId={projectId!}
                              />
                            </MasonryItem>
                          ))}
                        </MasonryGrid>
                      ) : (
                        <div className="text-center py-8">
                          <Users className="mx-auto h-12 w-12 text-[var(--color-600)] mb-4" />
                          <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">No Characters Yet</h3>
                          <p className="text-[var(--color-600)]">
                            No characters are currently using this {magicSystem.category === "power" ? "power" : "magic"} system.
                          </p>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      {magicSystem && (
        <DeleteConfirmationDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={confirmDelete}
          title="Delete Magic System"
          itemName={magicSystem.name}
          description={`Are you sure you want to delete "${magicSystem.name}"? This action cannot be undone and will permanently remove the magic system and all associated data.`}
          isDeleting={deleteMutation.isPending}
        />
      )}
    </div>
  );
}