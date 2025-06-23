import { Search, Sun, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  title: string;
  subtitle: string;
  onNewProject?: () => void;
  showNewProject?: boolean;
}

export default function Header({ title, subtitle, onNewProject, showNewProject = false }: HeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          <p className="text-gray-600 mt-1">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative">
            <Input 
              type="text" 
              placeholder="Search projects..." 
              className="pl-10 pr-4 py-2 w-64"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          </div>
          
          {/* Theme Toggle */}
          <Button variant="ghost" size="icon">
            <Sun className="w-4 h-4" />
          </Button>
          
          {/* New Project Button */}
          {showNewProject && (
            <Button onClick={onNewProject} className="worldforge-primary text-white hover:bg-orange-600">
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
