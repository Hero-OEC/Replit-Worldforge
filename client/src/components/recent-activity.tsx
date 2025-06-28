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
    iconColor: "bg-[var(--color-200)] text-orange-600",
  },
];

export default function RecentActivity() {
  return (
    <Card className="shadow-sm border border-gray-200 p-6 animate-slide-up hover-lift" style={{ backgroundColor: '#f8f6f2' }}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-[var(--color-950)] animate-fade-in">Recent Activity</h3>
        <Button variant="ghost" className="text-sm text-[var(--worldforge-primary)] hover:text-orange-600 font-medium hover-scale animate-ripple">
          View All
        </Button>
      </div>
      
      <div className="space-y-4">
        {recentActivity.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div 
              key={activity.id} 
              className="flex items-start space-x-4 animate-slide-up hover-lift group cursor-pointer transition-all duration-200"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`flex-shrink-0 w-8 h-8 ${activity.iconColor} rounded-full flex items-center justify-center hover-scale group-hover:shadow-md transition-all duration-200`}>
                <Icon className="w-4 h-4 group-hover:animate-bounce-gentle" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[var(--color-950)] group-hover:text-gray-700 transition-colors duration-200">
                  {activity.action} <span className="font-medium">"{activity.target}"</span> to{" "}
                  <span className="font-medium">{activity.project}</span>
                </p>
                <p className="text-xs text-[var(--color-600)] mt-1 group-hover:text-[var(--color-600)] transition-colors duration-200">{activity.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
