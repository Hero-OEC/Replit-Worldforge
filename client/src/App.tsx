import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { NavigationProvider } from "@/contexts/navigation-context";
import { ThemeProvider } from "@/contexts/theme-context";
import Dashboard from "@/pages/dashboard";
import ProjectLayout from "@/pages/project-layout";
import Timeline from "@/pages/timeline";
import TimelineEventDetail from "@/pages/timeline-event-detail";
import NewTimelineEvent from "@/pages/timeline-event-new";
import EditTimelineEvent from "@/pages/timeline-event-edit";
import Characters from "@/pages/characters";
import CharacterDetail from "@/pages/character-detail";
import NewCharacter from "@/pages/character-new";
import Locations from "@/pages/locations";
import LocationDetail from "@/pages/location-detail";
import LocationNew from "@/pages/location-new";
import MagicSystems from "@/pages/magic-systems";
import NewMagicSystem from "@/pages/magic-system-new";
import EditMagicSystem from "@/pages/magic-system-edit";
import MagicSystemDetail from "@/pages/magic-system-detail";
import Lore from "@/pages/lore";
import LoreDetail from "@/pages/lore-detail";
import NewLoreEntry from "@/pages/lore-new";
import EditLoreEntry from "@/pages/lore-edit";
import Notes from "@/pages/notes";
import NoteDetail from "@/pages/note-detail";
import NewNote from "@/pages/note-new";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <NavigationProvider>
          <TooltipProvider>
            <div className="h-screen flex flex-col bg-[var(--color-50)] animate-fade-in">
              <Switch>
                <Route path="/" component={Dashboard} />
                <Route path="/project/:projectId" component={ProjectLayout} />
                <Route path="/project/:projectId/timeline" component={Timeline} />
                <Route path="/project/:projectId/timeline/new" component={NewTimelineEvent} />
                <Route path="/project/:projectId/timeline/:eventId/edit" component={EditTimelineEvent} />
                <Route path="/project/:projectId/timeline/:eventId" component={TimelineEventDetail} />
                <Route path="/project/:projectId/characters" component={Characters} />
                <Route path="/project/:projectId/characters/new" component={NewCharacter} />
                <Route path="/project/:projectId/characters/:characterId" component={CharacterDetail} />
                <Route path="/project/:projectId/locations" component={Locations} />
                <Route path="/project/:projectId/locations/new" component={LocationNew} />
                <Route path="/project/:projectId/locations/:locationId" component={LocationDetail} />
                <Route path="/project/:projectId/magic-systems" component={MagicSystems} />
                <Route path="/project/:projectId/magic-systems/new" component={NewMagicSystem} />
                <Route path="/project/:projectId/magic-systems/:magicSystemId/edit" component={EditMagicSystem} />
                <Route path="/project/:projectId/magic-systems/:magicSystemId" component={MagicSystemDetail} />
                <Route path="/project/:projectId/lore" component={Lore} />
                <Route path="/project/:projectId/lore/new" component={NewLoreEntry} />
                <Route path="/project/:projectId/lore/:loreId/edit" component={EditLoreEntry} />
                <Route path="/project/:projectId/lore/:loreId" component={LoreDetail} />
                <Route path="/project/:projectId/notes" component={Notes} />
                <Route path="/project/:projectId/notes/new" component={NewNote} />
                <Route path="/project/:projectId/notes/:noteId" component={NoteDetail} />
                <Route component={NotFound} />
              </Switch>
            </div>
            <Toaster />
          </TooltipProvider>
        </NavigationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;