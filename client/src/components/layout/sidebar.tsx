import { Link, useLocation } from "wouter";
import { 
  Home, 
  Clock, 
  Users, 
  MapPin, 
  Sparkles, 
  Scroll, 
  Settings,
  BookOpen
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Characters", href: "/characters", icon: Users },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Magic Systems", href: "/magic-systems", icon: Sparkles },
  { name: "Lore & History", href: "/lore", icon: Scroll },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 worldforge-primary rounded-lg flex items-center justify-center">
            <BookOpen className="text-white w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">WorldForge</h1>
            <p className="text-xs text-gray-500">Creative Writing Companion</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          const Icon = item.icon;
          
          return (
            <Link key={item.name} href={item.href}>
              <a
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "worldforge-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </a>
            </Link>
          );
        })}
      </nav>

      {/* Settings */}
      <div className="p-4 border-t border-gray-200">
        <Link href="/settings">
          <a className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
