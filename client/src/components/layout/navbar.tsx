import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, BookOpen, Clock, Users, MapPin, Sparkles, Scroll, ChevronDown, Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/theme-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import inkAlchemyLogo from "@assets/inkalchemy_1751051991309.png";

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
  const { theme, toggleTheme } = useTheme();

  const projectNavItems = [
    { name: "Overview", href: `/project/${projectId}`, icon: BookOpen },
    { name: "Timeline", href: `/project/${projectId}/timeline`, icon: Clock },
    { name: "Characters", href: `/project/${projectId}/characters`, icon: Users },
    { name: "Locations", href: `/project/${projectId}/locations`, icon: MapPin },
    { name: "Magic", href: `/project/${projectId}/magic-systems`, icon: Sparkles },
    { name: "Lore", href: `/project/${projectId}/lore`, icon: BookOpen },
    { name: "Notes", href: `/project/${projectId}/notes`, icon: Scroll },
  ];

  return (
    <header className="bg-[var(--color-100)]">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer hover-scale animate-ripple">
                <img 
                  src={inkAlchemyLogo} 
                  alt="InkAlchemy Logo" 
                  className="w-12 h-12 object-contain hover-scale"
                />
                <div>
                  <h1 className="text-heading-md text-[var(--color-900)]">InkAlchemy</h1>
                  <p className="text-xs text-[var(--color-600)]">Your Creative Writing Companion</p>
                </div>
              </div>
            </Link>
            
            {/* Project Navigation Buttons - Only show when inside a project */}
            {showProjectNav && projectId && (
              <nav className="flex items-center space-x-1">
                <div className="w-px h-6 bg-[var(--color-300)] mx-4"></div>
                {projectNavItems.map((item) => {
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link key={item.name} href={item.href}>
                      <button
                        className={`flex items-center space-x-1 py-2 px-3 rounded-lg text-sm font-medium transition-all duration-200 min-h-[36px] hover-scale animate-ripple ${
                          isActive
                            ? "bg-[var(--color-500)] text-[var(--color-50)] hover-glow"
                            : "text-[var(--color-700)] hover:text-[var(--color-950)] hover:bg-[var(--color-200)]"
                        }`}
                      >
                        <Icon className="w-4 h-4 transition-transform duration-300 hover:bounce hover:scale-110" />
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
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-600)] w-4 h-4 transition-transform duration-300 hover:rotate-12 hover:scale-110" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  if (onSearch) {
                    onSearch(e.target.value);
                  }
                }}
                className="pl-10 pr-4 py-2 w-80 border-[var(--color-300)] focus:border-[var(--color-500)] focus:ring-[var(--color-500)]"
              />
            </div>
            
            {/* Dark mode toggle - only show on welcome page */}
            {!showProjectNav && (
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-[var(--color-200)] hover:bg-[var(--color-300)] transition-colors duration-200 border border-[var(--color-400)]"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5 text-[var(--color-800)]" />
                ) : (
                  <Sun className="w-5 h-5 text-[var(--color-800)]" />
                )}
              </Button>
            )}
            
            {rightContent}
          </div>
        </div>
      </div>
    </header>
  );
}