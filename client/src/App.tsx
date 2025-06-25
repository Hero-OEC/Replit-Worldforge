import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import ProjectLayout from "@/pages/project-layout";
import Timeline from "@/pages/timeline";
import Characters from "@/pages/characters";
import CharacterDetail from "@/pages/character-detail";
import NewCharacter from "@/pages/character-new";
import Locations from "@/pages/locations";
import LocationDetail from "@/pages/location-detail";
import LocationNew from "@/pages/location-new";
import Lore from "@/pages/lore";
import Notes from "@/pages/notes";
import NotFound from "@/pages/not-found";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="h-screen flex flex-col bg-[var(--worldforge-cream)]">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/project/:projectId" component={ProjectLayout} />
            <Route path="/project/:projectId/timeline" component={Timeline} />
            <Route path="/project/:projectId/characters" component={Characters} />
            <Route path="/project/:projectId/characters/new" component={NewCharacter} />
            <Route path="/project/:projectId/characters/:characterId" component={CharacterDetail} />
            <Route path="/project/:projectId/locations" component={Locations} />
            <Route path="/project/:projectId/locations/new" component={LocationNew} />
            <Route path="/project/:projectId/locations/:locationId" component={LocationDetail} />
            <Route path="/project/:projectId/lore" component={Lore} />
            <Route path="/project/:projectId/notes" component={Notes} />
            <Route component={NotFound} />
          </Switch>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
