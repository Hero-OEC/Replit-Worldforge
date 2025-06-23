import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/layout/sidebar";
import Dashboard from "@/pages/dashboard";
import Timeline from "@/pages/timeline";
import Characters from "@/pages/characters";
import Locations from "@/pages/locations";
import MagicSystems from "@/pages/magic-systems";
import Lore from "@/pages/lore";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="flex h-screen bg-[var(--worldforge-cream)]">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/timeline" component={Timeline} />
          <Route path="/characters" component={Characters} />
          <Route path="/locations" component={Locations} />
          <Route path="/magic-systems" component={MagicSystems} />
          <Route path="/lore" component={Lore} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
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
