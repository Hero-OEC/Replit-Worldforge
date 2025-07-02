// This component is deprecated and redirects to main timeline
// Character and location timelines now use the main timeline page implementation

export interface TimelineEventData {
  id: number;
  title: string;
  date: string;
  importance: "high" | "medium" | "low";
  category: string;
  description?: string;
  location?: string;
  characters?: string[];
}

interface SerpentineTimelineProps {
  events: TimelineEventData[];
  onEventClick?: (event: TimelineEventData) => void;
  onEventEdit?: (event: TimelineEventData) => void;
  filterCharacter?: string;
  filterLocation?: string;
  showEditButtons?: boolean;
  className?: string;
}

// Deprecated component - redirects to main timeline functionality
export default function SerpentineTimeline({
  filterCharacter,
  filterLocation,
  className = "",
}: SerpentineTimelineProps) {
  return (
    <div className={`text-center py-12 ${className}`}>
      <h3 className="text-lg font-medium text-[var(--color-950)] mb-2">
        Timeline View
      </h3>
      <p className="text-[var(--color-600)]">
        {filterCharacter 
          ? `Timeline events for ${filterCharacter} are shown on the main timeline page.`
          : filterLocation
          ? `Timeline events for ${filterLocation} are shown on the main timeline page.`
          : "Please use the main timeline page to view timeline events."
        }
      </p>
    </div>
  );
}