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
    <Card className="bg-white shadow-sm border border-gray-200 p-6">
      <div className="flex items-center">
        <div className={`p-3 ${iconColor} rounded-lg`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </Card>
  );
}
