import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, BookOpen, Clock, Users, MapPin, Sparkles, Scroll, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const projectNavItems = [
    { name: "Overview", href: `/project/${projectId}`, icon: BookOpen },
    { name: "Timeline", href: `/project/${projectId}/timeline`, icon: Clock },
    { name: "Characters", href: `/project/${projectId}/characters`, icon: Users },
    { name: "Locations", href: `/project/${projectId}/locations`, icon: MapPin },
    { name: "Lore", href: `/project/${projectId}/lore`, icon: Sparkles },
    { name: "Notes", href: `/project/${projectId}/notes`, icon: Scroll },
  ];

  return (
    <header className="bg-[var(--worldforge-card)] border-b border-[var(--border)]">
      <div className="px-6 py-4">
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
            
            {/* Project Navigation Buttons - Only show when inside a project */}
            {showProjectNav && projectId && projectTitle && (
              <nav className="flex items-center space-x-1">
                <div className="w-px h-6 bg-gray-300 mx-4"></div>
                <div className="flex items-center space-x-2 mr-4">
                  <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">{projectTitle}</span>
                </div>
                {projectNavItems.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <button
                        className={`flex items-center space-x-1 py-1.5 px-3 rounded-lg text-sm transition-colors ${
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
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div 
                className="flex items-center bg-white border border-gray-300 rounded-md px-3 py-2 w-64 cursor-pointer hover:border-gray-400 transition-colors"
                onClick={() => setShowSearchDropdown(!showSearchDropdown)}
              >
                <Search className="w-4 h-4 text-gray-400 mr-2" />
                <span className="text-gray-500 flex-1">{searchPlaceholder}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showSearchDropdown ? 'rotate-180' : ''}`} />
              </div>
              
              {showSearchDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
                  <div className="p-3">
                    <Input 
                      type="text" 
                      placeholder={searchPlaceholder}
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value);
                        onSearch?.(e.target.value);
                      }}
                      className="w-full"
                      autoFocus
                    />
                  </div>
                  {searchTerm && (
                    <div className="border-t border-gray-100 p-2">
                      <div className="text-xs text-gray-500 p-2">
                        Search results will appear here
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            
            {rightContent}
          </div>
        </div>
      </div>
    </header>
  );
}