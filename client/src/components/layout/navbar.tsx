import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, BookOpen, Clock, Users, MapPin, Sparkles, Scroll, ChevronDown } from "lucide-react";
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
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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