import { Link, useLocation } from "wouter";
import { Search, Settings, BookOpen, Clock, Users, MapPin, Sparkles, Scroll } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const navigation = [
  { name: "Timeline", href: "timeline", icon: Clock },
  { name: "Characters", href: "characters", icon: Users },
  { name: "Locations", href: "locations", icon: MapPin },
  { name: "Lore", href: "lore", icon: Sparkles },
  { name: "Notes", href: "notes", icon: Scroll },
];

interface NavbarProps {
  projectId?: string;
  projectTitle?: string;
  showProjectNav?: boolean;
  searchPlaceholder?: string;
  onSearch?: (term: string) => void;
  rightContent?: React.ReactNode;
}

export default function Navbar({ 
  projectId, 
  projectTitle, 
  showProjectNav = false, 
  searchPlaceholder = "Search projects...",
  onSearch,
  rightContent 
}: NavbarProps) {
  const [location] = useLocation();

  return (
    <header className="bg-[var(--worldforge-card)] border-b border-[var(--border)]">
      {/* Top Navigation Bar */}
      <div className="px-6 py-4 border-b border-[var(--border)]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">WorldForge</h1>
                  <p className="text-xs text-gray-600">Your Creative Writing Companion</p>
                </div>
              </div>
            </Link>
            
            {showProjectNav && projectId && (
              <Link href={`/project/${projectId}`}>
                <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900">
                  Project Overview
                </Button>
              </Link>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Input 
                type="text" 
                placeholder={searchPlaceholder}
                onChange={(e) => onSearch?.(e.target.value)}
                className="pl-10 pr-4 py-2 w-64 bg-white"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            </div>
            
            {rightContent}
            
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>
      
      {/* Project Navigation */}
      {showProjectNav && projectId && projectTitle && (
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">{projectTitle}</h2>
              </div>
              
              <nav className="flex space-x-6">
                {navigation.map((item) => {
                  const isActive = location.includes(item.href);
                  const Icon = item.icon;
                  
                  return (
                    <Link key={item.name} href={`/project/${projectId}/${item.href}`}>
                      <button
                        className={`flex items-center space-x-2 py-2 px-3 rounded-lg transition-colors ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{item.name}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}