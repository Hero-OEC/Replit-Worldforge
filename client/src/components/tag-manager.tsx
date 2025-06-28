import React, { useState, useEffect } from "react";
import { X, Plus, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tag, getTagVariant } from "@/components/ui/tag";

interface TagManagerProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  maxTags?: number;
}

export default function TagManager({
  tags = [],
  onTagsChange,
  suggestions = [],
  placeholder = "Add tags...",
  maxTags = 10,
}: TagManagerProps) {
  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (inputValue.trim() && suggestions.length > 0) {
      const filtered = suggestions
        .filter(
          (suggestion) =>
            suggestion.toLowerCase().includes(inputValue.toLowerCase()) &&
            !tags.includes(suggestion)
        )
        .slice(0, 8);
      setFilteredSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
      setFilteredSuggestions([]);
    }
  }, [inputValue, suggestions, tags]);

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim();
    if (
      trimmedTag &&
      !tags.includes(trimmedTag) &&
      tags.length < maxTags
    ) {
      onTagsChange([...tags, trimmedTag]);
      setInputValue("");
      setShowSuggestions(false);
    }
  };

  const removeTag = (tagToRemove: string) => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    addTag(suggestion);
  };

  return (
    <div className="space-y-2">
      {/* Current Tags */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag) => (
            <Tag
              key={tag}
              title={tag}
              variant={getTagVariant(tag)}
              onRemove={() => removeTag(tag)}
            />
          ))}
        </div>
      )}

      {/* Input */}
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Hash className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-600)] w-4 h-4" />
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => inputValue.trim() && setShowSuggestions(filteredSuggestions.length > 0)}
              placeholder={placeholder}
              className="pl-9"
              disabled={tags.length >= maxTags}
            />
          </div>
          {inputValue.trim() && (
            <Button
              size="sm"
              onClick={() => addTag(inputValue)}
              disabled={tags.length >= maxTags}
              className="bg-[var(--color-500)] hover:bg-[var(--color-600)] text-[var(--color-50)]"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Suggestions Dropdown */}
        {showSuggestions && (
          <Card className="absolute top-full left-0 right-0 mt-1 p-2 shadow-lg border z-50 max-h-40 overflow-y-auto">
            <div className="space-y-1">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="flex items-center space-x-2 p-2 rounded hover:bg-[var(--color-100)] cursor-pointer transition-colors"
                >
                  <Hash className="w-3 h-3 text-[var(--color-600)]" />
                  <span className="text-sm text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Tag Count & Limit */}
      <div className="flex items-center justify-between text-xs text-[var(--color-600)]">
        <span>{tags.length} / {maxTags} tags</span>
        <span>Press Enter or comma to add tag</span>
      </div>
    </div>
  );
}