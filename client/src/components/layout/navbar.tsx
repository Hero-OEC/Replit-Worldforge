import { useState } from "react";
import { Link, useLocation } from "wouter";
import { BookOpen, Clock, Users, MapPin, Sparkles, Scroll, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import inkAlchemyLogo from "@assets/inkalchemy_1751051991309.png";

interface NavbarProps {
  projectId?: string;
  projectTitle?: string;
  showProjectNav?: boolean;
  rightContent?: React.ReactNode;
}

export default function Navbar({ 
  projectId, 
  projectTitle, 
  showProjectNav = false, 
  rightContent 
}: NavbarProps) {
  const [location] = useLocation();

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
            {rightContent}
          </div>
        </div>
      </div>
    </header>
  );
}