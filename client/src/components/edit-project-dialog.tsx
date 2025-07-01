import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertProjectSchema, type InsertProject, type Project } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface EditProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

const genres = [
  "High Fantasy",
  "Low Fantasy", 
  "Urban Fantasy",
  "Dark Fantasy",
  "Sword & Sorcery",
  "Romantic Fantasy",
  "Portal Fantasy",
  "Fairy Tale Retellings",
  "Mythic Fantasy",
  "Historical Fantasy",
  "Cozy Fantasy",
  "Flintlock Fantasy",
  "Progression Fantasy",
  "Cultivation (Xianxia / Wuxia)",
  "LitRPG",
  "GameLit",
  "Dungeon Core",
  "Cyberpunk",
  "Biopunk",
  "Time Travel",
  "AI & Robots",
  "Dystopian",
  "Post-Apocalyptic",
  "Alien Invasion",
  "LitRPG Sci-Fi",
  "Romantic Comedy (Rom-Com)",
  "Cozy Mystery",
  "Detective Noir",
  "Spy / Espionage",
  "Crime Fiction",
  "Techno-thriller",
  "Domestic Thriller",
  "Psychological Horror",
  "Supernatural Horror",
  "Slasher",
  "Gothic Horror",
  "Occult Horror",
  "Survival Horror",
  "Monster Horror",
  "YA Fantasy",
  "YA Sci-Fi",
  "YA Romance",
  "YA Contemporary",
  "YA Dystopian",
  "YA Thriller",
  "YA Paranormal",
  "Coming-of-Age",
  "Literary Fiction",
  "Contemporary Fiction",
  "Slice of Life",
  "Magical Realism",
  "Satire",
  "Drama",
  "Alt-History",
  "Dark Academia",
  "Antihero Fiction",
];

const statuses = [
  { value: "active", label: "Active" },
  { value: "planning", label: "Planning" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

export default function EditProjectDialog({ open, onOpenChange, project }: EditProjectDialogProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      title: "",
      genre: "",
      description: "",
      status: "active",
    },
  });

  // Update form values when project changes
  useEffect(() => {
    if (project) {
      form.reset({
        title: project.title,
        genre: project.genre,
        description: project.description || "",
        status: project.status,
      });
    }
  }, [project, form]);

  const updateProjectMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      if (!project) throw new Error("No project to update");
      const response = await apiRequest("PUT", `/api/projects/${project.id}`, data);
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Project updated successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: "Failed to update project",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProject) => {
    updateProjectMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md animate-scale-in">
        <DialogHeader>
          <DialogTitle className="animate-fade-in">Edit Project</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 animate-slide-up">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter project name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="genre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Genre</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a genre" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {genres.map((genre) => (
                        <SelectItem key={genre} value={genre}>
                          {genre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Brief description of your project" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="hover-scale animate-ripple"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="worldforge-primary text-[var(--color-50)] hover:bg-[var(--color-600)] hover-glow animate-ripple"
                disabled={updateProjectMutation.isPending}
              >
                {updateProjectMutation.isPending ? "Updating..." : "Update Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}