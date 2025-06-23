import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Header from "@/components/layout/header";
import Dashboard from "@/pages/dashboard";
import ProjectLayout from "@/pages/project-layout";
import Timeline from "@/pages/timeline";
import Characters from "@/pages/characters";
import Locations from "@/pages/locations";
import MagicSystems from "@/pages/magic-systems";
import Lore from "@/pages/lore";
import NotFound from "@/pages/not-found";

function Router() {
  const [location] = useLocation();
  
  // Only show header on project detail pages, not on the main dashboard
  const showHeader = location !== "/";
  
  return (
    <div className="h-screen bg-[var(--worldforge-cream)]">
      <div className="flex flex-col h-full overflow-hidden">
        {showHeader && (
          <Header
            title={getPageTitle(location)}
            subtitle={getPageSubtitle(location)}
          />
        )}
        <div className="flex-1 overflow-hidden">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/project/:projectId" component={ProjectLayout} />
            <Route path="/project/:projectId/timeline" component={Timeline} />
            <Route path="/project/:projectId/characters" component={Characters} />
            <Route path="/project/:projectId/locations" component={Locations} />
            <Route path="/project/:projectId/magic-systems" component={MagicSystems} />
            <Route path="/project/:projectId/lore" component={Lore} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

function getPageTitle(location: string): string {
  switch (location) {
    case "/timeline": return "Timeline";
    case "/characters": return "Characters";
    case "/locations": return "Locations";
    case "/magic-systems": return "Magic Systems";
    case "/lore": return "Lore & History";
    default: return "WorldForge";
  }
}

function getPageSubtitle(location: string): string {
  switch (location) {
    case "/timeline": return "Organize story events and plot progression";
    case "/characters": return "Manage character profiles, personalities, and relationships";
    case "/locations": return "Document places, geography, and world settings";
    case "/magic-systems": return "Define magical rules, limitations, and power structures";
    case "/lore": return "Document world history, cultures, and background stories";
    default: return "Your Creative Writing Companion";
  }
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
