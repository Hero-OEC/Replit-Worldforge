import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, MapPin, Clock, Sparkles, BookOpen, TrendingUp, Target, Calendar } from "lucide-react";
import type { ProjectWithStats } from "@shared/schema";

interface AnalyticsDashboardProps {
  project: ProjectWithStats;
  characters: any[];
  locations: any[];
  timelineEvents: any[];
  magicSystems: any[];
  loreEntries: any[];
}

export default function AnalyticsDashboard({
  project,
  characters = [],
  locations = [],
  timelineEvents = [],
  magicSystems = [],
  loreEntries = []
}: AnalyticsDashboardProps) {
  
  // Calculate analytics
  const totalEntities = characters.length + locations.length + timelineEvents.length + magicSystems.length + loreEntries.length;
  
  const characterRoles = characters.reduce((acc: Record<string, number>, char) => {
    const role = char.role || 'Unspecified';
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  const eventCategories = timelineEvents.reduce((acc: Record<string, number>, event) => {
    const category = event.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const loreCoverage = loreEntries.reduce((acc: Record<string, number>, entry) => {
    const category = entry.category || 'Uncategorized';
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const magicSystemTypes = magicSystems.reduce((acc: Record<string, number>, system) => {
    const type = system.category || 'magic';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  // Project completion metrics
  const completionScore = Math.min(100, Math.round((totalEntities / 20) * 100)); // Assuming 20 entities is "complete"
  const characterDevelopment = characters.filter(c => c.backstory && c.personality && c.appearance).length;
  const characterCompleteness = characters.length > 0 ? Math.round((characterDevelopment / characters.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-[var(--color-700)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-950)]">Project Completion</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={completionScore} className="flex-1" />
                <span className="text-sm font-medium text-[var(--color-700)]">{completionScore}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-[var(--color-700)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-950)]">Character Development</h3>
              <div className="flex items-center space-x-2 mt-1">
                <Progress value={characterCompleteness} className="flex-1" />
                <span className="text-sm font-medium text-[var(--color-700)]">{characterCompleteness}%</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--color-300)] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[var(--color-800)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-950)]">Total Entities</h3>
              <p className="text-2xl font-bold text-[var(--color-950)] mt-1">{totalEntities}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[var(--color-400)] rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-[var(--color-900)]" />
            </div>
            <div>
              <h3 className="font-semibold text-[var(--color-950)]">Timeline Events</h3>
              <p className="text-2xl font-bold text-[var(--color-950)] mt-1">{timelineEvents.length}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Detailed Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Character Roles */}
        <Card className="p-6">
          <h3 className="font-semibold text-[var(--color-950)] mb-4 flex items-center space-x-2">
            <Users className="w-5 h-5 text-[var(--color-700)]" />
            <span>Character Roles</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(characterRoles).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-700)] capitalize">{role}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-[var(--color-200)] rounded-full h-2">
                    <div 
                      className="bg-[var(--color-500)] h-2 rounded-full" 
                      style={{ width: `${(count / characters.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-950)] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Event Categories */}
        <Card className="p-6">
          <h3 className="font-semibold text-[var(--color-950)] mb-4 flex items-center space-x-2">
            <Clock className="w-5 h-5 text-[var(--color-800)]" />
            <span>Event Categories</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(eventCategories).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-700)]">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-[var(--color-200)] rounded-full h-2">
                    <div 
                      className="bg-[var(--color-500)] h-2 rounded-full" 
                      style={{ width: `${(count / timelineEvents.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-950)] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Lore Coverage */}
        <Card className="p-6">
          <h3 className="font-semibold text-[var(--color-950)] mb-4 flex items-center space-x-2">
            <BookOpen className="w-5 h-5 text-[var(--color-900)]" />
            <span>Lore Coverage</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(loreCoverage).map(([category, count]) => (
              <div key={category} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-700)]">{category}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-[var(--color-200)] rounded-full h-2">
                    <div 
                      className="bg-[var(--color-500)] h-2 rounded-full" 
                      style={{ width: `${(count / loreEntries.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-950)] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Magic System Types */}
        <Card className="p-6">
          <h3 className="font-semibold text-[var(--color-950)] mb-4 flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[var(--color-800)]" />
            <span>Magic System Types</span>
          </h3>
          <div className="space-y-3">
            {Object.entries(magicSystemTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm text-[var(--color-700)] capitalize">{type}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-[var(--color-200)] rounded-full h-2">
                    <div 
                      className="bg-[var(--color-500)] h-2 rounded-full" 
                      style={{ width: `${(count / magicSystems.length) * 100}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-[var(--color-950)] w-6 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recommendations */}
      <Card className="p-6">
        <h3 className="font-semibold text-[var(--color-950)] mb-4">Recommendations</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {characters.length < 5 && (
            <div className="p-4 bg-[var(--color-100)] rounded-lg border border-[var(--color-200)]">
              <h4 className="font-medium text-[var(--color-900)] mb-2">Add More Characters</h4>
              <p className="text-sm text-[var(--color-700)]">Consider adding more characters to enrich your story. Most stories benefit from 5-10 well-developed characters.</p>
            </div>
          )}
          
          {timelineEvents.length < 10 && (
            <div className="p-4 bg-[var(--color-100)] rounded-lg border border-[var(--color-200)]">
              <h4 className="font-medium text-[var(--color-900)] mb-2">Expand Timeline</h4>
              <p className="text-sm text-[var(--color-700)]">Add more timeline events to create a richer narrative structure. Consider key plot points, character development moments, and world events.</p>
            </div>
          )}
          
          {locations.length < 3 && (
            <div className="p-4 bg-[var(--color-100)] rounded-lg border border-[var(--color-200)]">
              <h4 className="font-medium text-[var(--color-900)] mb-2">Develop Locations</h4>
              <p className="text-sm text-[var(--color-700)]">Your story would benefit from more detailed locations. Consider adding important places where key events occur.</p>
            </div>
          )}
          
          {characterCompleteness < 50 && (
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-medium text-orange-900 mb-2">Character Development</h4>
              <p className="text-sm text-orange-700">Complete character profiles by adding backstories, personalities, and detailed appearances to make them more compelling.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}