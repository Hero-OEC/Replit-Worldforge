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
  { name: "High Fantasy", description: "Epic worlds with magic, quests, and mythical creatures" },
  { name: "Low Fantasy", description: "Subtle magic in realistic settings" },
  { name: "Urban Fantasy", description: "Magic hidden in modern city life" },
  { name: "Dark Fantasy", description: "Horror meets fantasy with gothic themes" },
  { name: "Sword & Sorcery", description: "Adventure-focused with warriors and magic" },
  { name: "Romantic Fantasy", description: "Love stories with magical elements" },
  { name: "Portal Fantasy", description: "Characters travel to magical worlds" },
  { name: "Fairy Tale Retellings", description: "Classic tales with fresh twists" },
  { name: "Mythic Fantasy", description: "Stories rooted in ancient myths" },
  { name: "Historical Fantasy", description: "Magic woven into historical periods" },
  { name: "Cozy Fantasy", description: "Gentle, comforting magical stories" },
  { name: "Flintlock Fantasy", description: "Fantasy with early firearms technology" },
  { name: "Progression Fantasy", description: "Characters grow stronger through systems" },
  { name: "Cultivation (Xianxia / Wuxia)", description: "Martial arts and spiritual power growth" },
  { name: "LitRPG", description: "Game mechanics in story format" },
  { name: "GameLit", description: "Gaming elements without strict rules" },
  { name: "Dungeon Core", description: "Building and managing dungeons" },
  { name: "Cyberpunk", description: "High tech, low life dystopian future" },
  { name: "Biopunk", description: "Biotechnology and genetic engineering focus" },
  { name: "Time Travel", description: "Stories involving temporal journeys" },
  { name: "AI & Robots", description: "Artificial intelligence and robotics themes" },
  { name: "Dystopian", description: "Oppressive future societies" },
  { name: "Post-Apocalyptic", description: "Survival after civilization's collapse" },
  { name: "Alien Invasion", description: "Earth under extraterrestrial attack" },
  { name: "LitRPG Sci-Fi", description: "Game systems in futuristic settings" },
  { name: "Romantic Comedy (Rom-Com)", description: "Light-hearted love stories" },
  { name: "Cozy Mystery", description: "Gentle mysteries in small communities" },
  { name: "Detective Noir", description: "Dark, gritty crime investigations" },
  { name: "Spy / Espionage", description: "Secret agents and international intrigue" },
  { name: "Crime Fiction", description: "Criminal activities and investigations" },
  { name: "Techno-thriller", description: "Technology-driven suspense stories" },
  { name: "Domestic Thriller", description: "Suspense in everyday relationships" },
  { name: "Psychological Horror", description: "Fear from mental manipulation" },
  { name: "Supernatural Horror", description: "Ghosts, demons, and otherworldly terror" },
  { name: "Slasher", description: "Killer stalking multiple victims" },
  { name: "Gothic Horror", description: "Dark atmosphere with classic monsters" },
  { name: "Occult Horror", description: "Dark magic and forbidden knowledge" },
  { name: "Survival Horror", description: "Characters fighting to stay alive" },
  { name: "Monster Horror", description: "Creatures terrorizing protagonists" },
  { name: "YA Fantasy", description: "Young adult fantasy adventures" },
  { name: "YA Sci-Fi", description: "Teen-focused science fiction" },
  { name: "YA Romance", description: "Young love and relationships" },
  { name: "YA Contemporary", description: "Modern teen life and issues" },
  { name: "YA Dystopian", description: "Young heroes in broken societies" },
  { name: "YA Thriller", description: "Teen suspense and danger" },
  { name: "YA Paranormal", description: "Young adult supernatural stories" },
  { name: "Coming-of-Age", description: "Growing up and self-discovery" },
  { name: "Literary Fiction", description: "Character-driven artistic prose" },
  { name: "Contemporary Fiction", description: "Modern life and relationships" },
  { name: "Slice of Life", description: "Everyday moments and experiences" },
  { name: "Magical Realism", description: "Subtle magic in realistic settings" },
  { name: "Satire", description: "Humor to critique society" },
  { name: "Drama", description: "Serious emotional conflicts" },
  { name: "Alt-History", description: "What if history went differently" },
  { name: "Dark Academia", description: "Academic settings with dark secrets" },
  { name: "Antihero Fiction", description: "Morally complex protagonists" },
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
      <DialogContent className="max-w-md animate-scale-in bg-[var(--color-50)] border border-[var(--color-300)]">
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
                        <SelectItem key={genre.name} value={genre.name}>
                          {genre.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {field.value && (
                    <p className="text-sm text-[var(--color-600)] mt-1">
                      {genres.find(g => g.name === field.value)?.description}
                    </p>
                  )}
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