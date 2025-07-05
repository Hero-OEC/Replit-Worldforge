import React, { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { User, Edit, Trash2, Save, X, ArrowLeft } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createInsertSchema } from "drizzle-zod";
import { characters } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import type { Character, ProjectWithStats } from "@shared/schema";

const insertCharacterSchema = createInsertSchema(characters);

export default function CharacterDetail() {
  const { projectId, characterId } = useParams();
  const [, setLocation] = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
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

  const { data: character, isLoading } = useQuery<Character>({
    queryKey: ['/api/characters', characterId],
    queryFn: async () => {
      const response = await fetch(`/api/characters/${characterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch character');
      }
      return response.json();
    },
    enabled: !!characterId,
  });

  const form = useForm({
    resolver: zodResolver(insertCharacterSchema),
    defaultValues: character || {},
  });

  // Update form when character data loads
  React.useEffect(() => {
    if (character) {
      form.reset(character);
    }
  }, [character, form]);

  const updateCharacterMutation = useMutation({
    mutationFn: async (updatedCharacter: Partial<Character>) => {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedCharacter),
      });

      if (!response.ok) {
        throw new Error('Failed to update character');
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Character updated successfully",
        description: "Your changes have been saved.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/characters', characterId] });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setIsEditing(false);
    },
    onError: (error) => {
      toast({
        title: "Error updating character",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteCharacterMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/characters/${characterId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete character');
      }
    },
    onSuccess: () => {
      toast({
        title: "Character deleted successfully",
        description: "The character has been removed from your project.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/projects', projectId, 'characters'] });
      setLocation(`/project/${projectId}/characters`);
    },
    onError: (error) => {
      toast({
        title: "Error deleting character",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSave = (data: any) => {
    updateCharacterMutation.mutate(data);
  };

  const handleCancel = () => {
    form.reset(character);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteCharacterMutation.mutate();
    setShowDeleteDialog(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8 bg-[var(--worldforge-cream)]">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="text-[var(--color-600)]">Loading character...</div>
          </div>
        </main>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="min-h-screen bg-[var(--worldforge-cream)]">
        <Navbar 
          projectId={projectId}
          projectTitle={project?.title}
          showProjectNav={true}
        />
        <main className="p-8 bg-[var(--worldforge-cream)]">
          <div className="max-w-6xl mx-auto text-center py-12">
            <div className="text-[var(--color-600)]">Character not found</div>
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
      
      <main className="p-8 bg-[var(--worldforge-cream)]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Button
                  onClick={() => setLocation(`/project/${projectId}/characters`)}
                  variant="outline"
                  size="sm"
                  className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Characters
                </Button>
                <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center shadow-sm">
                  <User className="w-6 h-6 text-[var(--color-700)]" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[var(--color-950)]">{character.name}</h1>
                  <p className="text-[var(--color-600)]">{character.role}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {isEditing ? (
                  <>
                    <Button 
                      onClick={handleCancel}
                      variant="outline"
                      className="border-[var(--color-300)] text-[var(--color-700)] hover:bg-[var(--color-100)]"
                    >
                      Cancel
                    </Button>
                    <Button 
                      onClick={form.handleSubmit(handleSave)}
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
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button 
                      onClick={() => setShowDeleteDialog(true)}
                      variant="outline"
                      className="border-red-300 text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--color-950)] mb-4">Basic Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="name">Name</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      {...form.register('name')}
                      className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)]"
                    />
                  ) : (
                    <div className="text-[var(--color-900)] p-2">{character.name}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="role">Role</Label>
                  {isEditing ? (
                    <Select onValueChange={(value) => form.setValue('role', value)} defaultValue={character.role || ""}>
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
                  ) : (
                    <div className="text-[var(--color-900)] p-2">{character.role}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="age">Age</Label>
                  {isEditing ? (
                    <Input
                      id="age"
                      {...form.register('age')}
                      className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)]"
                    />
                  ) : (
                    <div className="text-[var(--color-900)] p-2">{character.age}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="race">Race</Label>
                  {isEditing ? (
                    <Input
                      id="race"
                      {...form.register('race')}
                      className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)]"
                    />
                  ) : (
                    <div className="text-[var(--color-900)] p-2">{character.race}</div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[var(--color-50)] border border-[var(--color-300)] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-[var(--color-950)] mb-4">Character Details</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="appearance">Appearance</Label>
                  {isEditing ? (
                    <Textarea
                      id="appearance"
                      {...form.register('appearance')}
                      className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)] h-20"
                    />
                  ) : (
                    <div className="text-[var(--color-900)] p-2 min-h-[80px] whitespace-pre-wrap">{character.appearance}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="personality">Personality</Label>
                  {isEditing ? (
                    <Textarea
                      id="personality"
                      {...form.register('personality')}
                      className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)] h-20"
                    />
                  ) : (
                    <div className="text-[var(--color-900)] p-2 min-h-[80px] whitespace-pre-wrap">{character.personality}</div>
                  )}
                </div>
                <div>
                  <Label htmlFor="backstory">Backstory</Label>
                  {isEditing ? (
                    <Textarea
                      id="backstory"
                      {...form.register('backstory')}
                      className="text-[var(--color-950)] bg-[var(--color-50)] border-[var(--color-300)] h-24"
                    />
                  ) : (
                    <div className="text-[var(--color-900)] p-2 min-h-[96px] whitespace-pre-wrap">{character.backstory}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Delete Character</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{character.name}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button 
                onClick={() => setShowDeleteDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleDelete}
                variant="destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}