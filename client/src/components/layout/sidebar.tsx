import { Link, useLocation } from "wouter";
import { 
  Home, 
  Clock, 
  Users, 
  MapPin, 
  Sparkles, 
  BookOpen, 
  Settings
} from "lucide-react";
import inkAlchemyLogo from "@assets/inkalchemy_1751051991309.png";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Characters", href: "/characters", icon: Users },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Magic Systems", href: "/magic-systems", icon: Sparkles },
  { name: "Lore & History", href: "/lore", icon: BookOpen },
];

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="w-64 shadow-lg border-r border-[var(--color-300)] flex flex-col" style={{ backgroundColor: '#f8f6f2' }}>
      {/* Logo Section */}
      <div className="p-6 border-b border-[var(--color-300)]">
        <div className="flex items-center space-x-3">
          <img 
            src={inkAlchemyLogo} 
            alt="InkAlchemy Logo" 
            className="w-12 h-12 object-contain"
          />
          <div>
            <h1 className="text-xl font-bold text-[var(--color-900)]">InkAlchemy</h1>
            <p className="text-xs text-[var(--color-500)]">Creative Writing Companion</p>
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
                    ? "worldforge-primary text-[var(--color-50)]"
                    : "text-[var(--color-700)] hover:bg-[var(--color-200)]"
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
      <div className="p-4 border-t border-[var(--color-300)]">
        <Link href="/settings">
          <a className="flex items-center space-x-3 px-3 py-2 text-[var(--color-700)] hover:bg-[var(--color-200)] rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </a>
        </Link>
      </div>
    </div>
  );
}
