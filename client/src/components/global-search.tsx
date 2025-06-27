import React, { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Search, FileText, Users, MapPin, Clock, Sparkles, BookOpen, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { searchAcrossEntities, SearchResult } from "@/lib/search";

interface GlobalSearchProps {
  onResultClick?: (result: SearchResult) => void;
}

export default function GlobalSearch({ onResultClick }: GlobalSearchProps) {
  const { projectId } = useParams<{ projectId: string }>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Fetch all entities for search
  const { data: characters = [] } = useQuery({
    queryKey: ["/api/characters", projectId],
    enabled: !!projectId,
  });

  const { data: locations = [] } = useQuery({
    queryKey: ["/api/locations", projectId],
    enabled: !!projectId,
  });

  const { data: timelineEvents = [] } = useQuery({
    queryKey: ["/api/timeline-events", projectId],
    enabled: !!projectId,
  });

  const { data: magicSystems = [] } = useQuery({
    queryKey: ["/api/magic-systems", projectId],
    enabled: !!projectId,
  });

  const { data: loreEntries = [] } = useQuery({
    queryKey: ["/api/lore-entries", projectId],
    enabled: !!projectId,
  });

  useEffect(() => {
    if (query.trim().length > 1) {
      const searchResults = searchAcrossEntities(query, {
        characters,
        locations,
        timelineEvents,
        magicSystems,
        loreEntries,
      });
      setResults(searchResults);
      setIsOpen(true);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [query, characters, locations, timelineEvents, magicSystems, loreEntries]);

  const getIcon = (type: SearchResult['type']) => {
    switch (type) {
      case 'character': return Users;
      case 'location': return MapPin;
      case 'timeline': return Clock;
      case 'magic': return Sparkles;
      case 'lore': return BookOpen;
      default: return FileText;
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'character': return 'bg-blue-100 text-blue-800';
      case 'location': return 'bg-green-100 text-green-800';
      case 'timeline': return 'bg-purple-100 text-purple-800';
      case 'magic': return 'bg-yellow-100 text-yellow-800';
      case 'lore': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setQuery("");
    setIsOpen(false);
    onResultClick?.(result);
    
    // Navigate to the result
    const path = `/project/${projectId}/${result.type === 'timeline' ? 'timeline' : result.type === 'magic' ? 'magic-systems' : result.type === 'lore' ? 'lore' : result.type}/${result.id}`;
    window.location.href = path;
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="Search across all project content..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-9 pr-10 w-80"
          onFocus={() => query.trim().length > 1 && setIsOpen(true)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg border z-50 max-h-96 overflow-y-auto">
          <div className="space-y-2">
            {results.map((result) => {
              const Icon = getIcon(result.type);
              return (
                <div
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleResultClick(result)}
                  className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-4 h-4 text-gray-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-medium text-gray-900 truncate">
                        {result.title}
                      </h3>
                      <Badge className={`text-xs ${getTypeColor(result.type)}`}>
                        {result.type}
                      </Badge>
                      {result.category && (
                        <Badge variant="outline" className="text-xs">
                          {result.category}
                        </Badge>
                      )}
                    </div>
                    {result.description && (
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {result.description}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-gray-500">
                        Matched: {result.matchedFields.join(", ")}
                      </span>
                      <span className="text-xs text-gray-400">
                        Score: {result.relevance}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {isOpen && results.length === 0 && query.trim().length > 1 && (
        <Card className="absolute top-full left-0 right-0 mt-2 p-4 shadow-lg border z-50">
          <p className="text-sm text-gray-500 text-center">
            No results found for "{query}"
          </p>
        </Card>
      )}
    </div>
  );
}