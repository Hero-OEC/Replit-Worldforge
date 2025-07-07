import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Crown, Shield, Sword, UserCheck, UserX, Scale } from "lucide-react";

interface CharacterCardProps {
  character: {
    id: number;
    name: string;
    prefix?: string | null;
    suffix?: string | null;
    description?: string | null;
    role?: string | null;
    race?: string | null;
    imageUrl?: string | null;
  };
  projectId: string | number;
  onClick?: () => void;
  className?: string;
}

const roleConfig = {
  "Protagonist": { icon: Crown, color: "bg-[var(--color-600)]", bgColor: "bg-[var(--color-500)] text-[var(--color-50)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" },
  "Antagonist": { icon: Sword, color: "bg-[var(--color-950)]", bgColor: "bg-[var(--color-700)] text-[var(--color-50)]", textColor: "text-[var(--color-950)]", borderColor: "border-[var(--color-700)]" },
  "Ally": { icon: Shield, color: "bg-[var(--color-500)]", bgColor: "bg-[var(--color-400)] text-[var(--color-950)]", textColor: "text-[var(--color-700)]", borderColor: "border-[var(--color-300)]" },
  "Enemy": { icon: UserX, color: "bg-[var(--color-800)]", bgColor: "bg-[var(--color-600)] text-[var(--color-50)]", textColor: "text-[var(--color-900)]", borderColor: "border-[var(--color-600)]" },
  "Neutral": { icon: Scale, color: "bg-[var(--color-400)]", bgColor: "bg-[var(--color-300)] text-[var(--color-900)]", textColor: "text-[var(--color-600)]", borderColor: "border-[var(--color-300)]" },
  "Supporting": { icon: UserCheck, color: "bg-[var(--color-700)]", bgColor: "bg-[var(--color-200)] text-[var(--color-800)]", textColor: "text-[var(--color-800)]", borderColor: "border-[var(--color-400)]" }
};

export function CharacterCard({ character, projectId, onClick, className = "" }: CharacterCardProps) {
  const roleInfo = roleConfig[character.role as keyof typeof roleConfig] || roleConfig["Supporting"];
  const RoleIcon = roleInfo.icon;

  const cardContent = (
    <Card 
      className={`overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-[var(--color-300)] cursor-pointer bg-[var(--color-100)] ${className}`}
      onClick={onClick}
    >
      {/* Top Area: Image (1:1 ratio) */}
      <div className="relative aspect-square w-full">
        {/* Image */}
        {character.imageUrl ? (
          <img 
            src={character.imageUrl} 
            alt={character.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-[var(--color-200)] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[var(--color-300)] rounded-full mx-auto mb-2"></div>
              <div className="w-20 h-8 bg-[var(--color-300)] rounded mx-auto"></div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Area: Character Info */}
      <div className="p-4">
        <div className="flex items-start space-x-3 mb-2">
          <div className="w-12 h-12 bg-[var(--color-200)] rounded-lg flex items-center justify-center">
            <RoleIcon className="w-6 h-6 text-[var(--color-700)]" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--color-950)] mb-1">
              {character.prefix && (
                <span className="text-sm font-normal opacity-75 mr-1">{character.prefix}</span>
              )}
              <span>{character.name}</span>
              {character.suffix && (
                <span className="text-sm font-normal opacity-75 ml-1">{character.suffix}</span>
              )}
            </h3>
            <div className="mb-3">
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${roleInfo.bgColor} border ${roleInfo.borderColor}`}>
                {character.role}
              </span>
            </div>
          </div>
        </div>
        <p className="text-sm text-[var(--color-800)] line-clamp-3 mb-4">
          {character.description || "No description provided"}
        </p>
        
        <div className="text-center">
          <span className="text-sm text-[var(--color-600)] font-medium">Click to view details</span>
        </div>
      </div>
    </Card>
  );

  // If no custom onClick is provided, wrap with Link
  if (!onClick) {
    return (
      <Link href={`/project/${projectId}/characters/${character.id}`}>
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}