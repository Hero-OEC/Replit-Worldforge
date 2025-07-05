import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { User, Sparkles, Heart, Brain, Save, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { characters } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import type { InsertCharacter, ProjectWithStats } from "@shared/schema";

const insertCharacterSchema = createInsertSchema(characters);

export default function CharacterNewSimplified() {
  const { projectId } = useParams();
  const [, setLocation] = useLocation();
  const [selectedPowerSystems, setSelectedPowerSystems] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: project } = useQuery<ProjectWithStats>({
    queryKey: ['/api/projects', projectId],
    queryFn: async () => {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project');
      }
      return response.json();
    },
    enabled: !!projectId,
  });

  const form = useForm<InsertCharacter>({
    resolver: zodResolver(insertCharacterSchema),
    defaultValues: {
      projectId: parseInt(projectId!),
      name: "",
      role: "",
      age: "",
      race: "",
      appearance: "",
      personality: "",
      backstory: "",
      powerSystems: [],
    },
  });

  const createCharacterMutation = useMutation({
    mutationFn: async (character: InsertCharacter) => {
      const response = await fetch(`/api/projects/${projectId}/characters`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...character,
          powerSystems: selectedPowerSystems,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create character');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Character created successfully",
        description: "Your character has been added to the project.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setLocation(`/project/${projectId}/characters`);
    },
    onError: (error) => {
      toast({
        title: "Error creating character",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = async (data: InsertCharacter) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await createCharacterMutation.mutateAsync(data);
    } catch (error) {
      console.error('Error creating character:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setLocation(`/project/${projectId}/characters`);
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'protagonist':
        return <User className="w-4 h-4 text-blue-500" />;
      case 'antagonist':
        return <User className="w-4 h-4 text-red-500" />;
      case 'ally':
        return <Heart className="w-4 h-4 text-green-500" />;
      case 'enemy':
        return <X className="w-4 h-4 text-red-400" />;
      case 'supporting':
        return <User className="w-4 h-4 text-purple-500" />;
      case 'neutral':
        return <User className="w-4 h-4 text-gray-500" />;
      default:
        return <User className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleAddPowerSystem = (system: string) => {
    if (!selectedPowerSystems.includes(system)) {
      setSelectedPowerSystems([...selectedPowerSystems, system]);
    }
  };

  const handleRemovePowerSystem = (system: string) => {
    setSelectedPowerSystems(selectedPowerSystems.filter(s => s !== system));
  };

  if (!project) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId!} 
          projectTitle="Loading..." 
          showProjectNav={true}
        />
        <main className="p-8 bg-[var(--worldforge-cream)]">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="text-[var(--color-600)]">Loading...</div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--worldforge-cream)]">
      <Navbar 
        projectId={projectId!} 
        projectTitle={project.title} 
        showProjectNav={true}
      />
      
      <main className="p-8 bg-[var(--worldforge-cream)]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6 text-[var(--color-700)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">Create Character</h1>
                  <p className="text-[var(--color-600)]">Add a new character to your project</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button 
                  onClick={handleCancel}
                  variant="outline"
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={form.handleSubmit(handleSave)}
                  disabled={isSubmitting}
                  className="bg-[var(--color-500)] text-[var(--color-50)] hover:bg-[var(--color-600)]"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSubmitting ? 'Creating...' : 'Create Character'}
                </Button>
              </div>
            </div>
          </div>

          <Card className="border-[var(--color-300)] bg-[var(--color-50)]">
            <CardHeader>
              <CardTitle className="text-[var(--color-950)]">Character Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    {...form.register('name')}
                    placeholder="Character name"
                    className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)]"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  <Select onValueChange={(value) => form.setValue('role', value)}>
                    <SelectTrigger className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)]">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="protagonist">Protagonist</SelectItem>
                      <SelectItem value="antagonist">Antagonist</SelectItem>
                      <SelectItem value="ally">Ally</SelectItem>
                      <SelectItem value="enemy">Enemy</SelectItem>
                      <SelectItem value="supporting">Supporting</SelectItem>
                      <SelectItem value="neutral">Neutral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    {...form.register('age')}
                    placeholder="Character age"
                    className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)]"
                  />
                </div>
                <div>
                  <Label htmlFor="race">Race</Label>
                  <Input
                    id="race"
                    {...form.register('race')}
                    placeholder="Character race"
                    className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)]"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="appearance">Appearance</Label>
                <Textarea
                  id="appearance"
                  {...form.register('appearance')}
                  placeholder="Describe the character's appearance"
                  className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)] h-20"
                />
              </div>

              <div>
                <Label htmlFor="personality">Personality</Label>
                <Textarea
                  id="personality"
                  {...form.register('personality')}
                  placeholder="Describe the character's personality"
                  className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)] h-20"
                />
              </div>

              <div>
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea
                  id="backstory"
                  {...form.register('backstory')}
                  placeholder="Character's backstory"
                  className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)] h-24"
                />
              </div>

              <div>
                <Label>Power Systems</Label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedPowerSystems.map((system) => (
                      <span
                        key={system}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[var(--color-200)] text-[var(--color-800)] border border-[var(--color-300)]"
                      >
                        {system}
                        <button
                          onClick={() => handleRemovePowerSystem(system)}
                          className="ml-2 w-4 h-4 rounded-full bg-[var(--color-300)] hover:bg-[var(--color-400)] flex items-center justify-center transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="text-sm text-[var(--color-600)]">
                    Power systems can be added after character creation
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}