import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, BookOpen, Clock, Users, MapPin, Sparkles, Scroll, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import worldForgeLogo from "@assets/worldforge logo@10x_1750865164609.png";

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
                <img 
                  src={worldForgeLogo} 
                  alt="WorldForge Logo" 
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h1 className="text-heading-md text-gray-900">WorldForge</h1>
                  <p className="text-xs text-gray-600">Your Creative Writing Companion</p>
                </div>
              </div>
            </Link>
            
            {/* Project Navigation Buttons - Only show when inside a project */}
            {showProjectNav && projectId && (
              <nav className="flex items-center space-x-1">
                <div className="w-px h-6 bg-gray-300 mx-4"></div>
                {projectNavItems.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <button
                        className={`flex items-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors min-h-[36px] ${
                          isActive
                            ? "bg-orange-500 text-white"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </button>
                    </Link>
                  );
                })}
              </nav>
            )}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (onSearch) {
                    onSearch(e.target.value);
                  }
                }}
                className="pl-10 pr-4 py-2 w-80 border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
            
            {rightContent}
          </div>
        </div>
      </div>
    </header>
  );
}