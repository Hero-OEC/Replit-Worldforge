import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, MapPin, Sparkles, Clock } from "lucide-react";

// This would normally come from an API
const recentActivity = [
  {
    id: 1,
    type: "character",
    action: "Added new character",
    target: "Marcus Steele",
    project: "Neon Shadows",
    timestamp: "2 hours ago",
    icon: UserPlus,
    iconColor: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    type: "location",
    action: "Updated location",
    target: "The Crystal Caverns",
    project: "The Chronicles of Elena",
    timestamp: "5 hours ago",
    icon: MapPin,
    iconColor: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    type: "magic",
    action: "Created new magic system",
    target: "Elemental Binding",
    project: "The Chronicles of Elena",
    timestamp: "1 day ago",
    icon: Sparkles,
    iconColor: "bg-purple-100 text-purple-600",
  },
  {
    id: 4,
    type: "timeline",
    action: "Added timeline event",
    target: "The Great War begins",
    project: "Starbound Legacy",
    timestamp: "2 days ago",
    icon: Clock,
    iconColor: "bg-orange-100 text-orange-600",
  },
];

export default function RecentActivity() {
  return (
    <Card className="shadow-sm border border-gray-200 p-6" style={{ backgroundColor: '#f8f6f2' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <Button variant="ghost" className="text-sm text-[var(--worldforge-primary)] hover:text-orange-600 font-medium">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentActivity.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className={`flex-shrink-0 w-8 h-8 ${activity.iconColor} rounded-full flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-900">
                  {activity.action} <span className="font-medium">"{activity.target}"</span> to{" "}
                  <span className="font-medium">{activity.project}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
