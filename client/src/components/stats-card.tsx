import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface StatsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  iconColor: string;
}

export default function StatsCard({ title, value, icon: Icon, iconColor }: StatsCardProps) {
  return (
    <Card className="shadow-sm border border-[var(--color-300)] p-6 animate-slide-up hover-lift group" style={{ backgroundColor: '#f8f6f2' }}>
      <div className="flex items-center">
        <div className={`p-3 ${iconColor} rounded-lg hover-scale group-hover:shadow-lg transition-all duration-300`}>
          <Icon className="w-5 h-5 group-hover:animate-bounce-gentle" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-[var(--color-600)] transition-colors duration-200 group-hover:text-[var(--color-800)]">{title}</p>
          <p className="text-2xl font-bold text-[var(--color-900)] animate-fade-in group-hover:scale-105 transition-transform duration-200">{value}</p>
        </div>
      </div>
    </Card>
  );
}
