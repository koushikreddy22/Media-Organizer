import { Heart, MapPin, Users } from "lucide-react";
import { Photo } from "@/services/mockData";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface PhotoCardProps {
  photo: Photo;
  onToggleFavorite: (id: string) => void;
  onClick?: () => void;
}

export function PhotoCard({ photo, onToggleFavorite, onClick }: PhotoCardProps) {
  return (
    <div
      className="group relative overflow-hidden rounded-lg bg-card shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={onClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={photo.imageUrl}
          alt={photo.filename}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        {/* Overlay with info on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 space-y-2">
            <h3 className="font-medium text-white text-sm truncate">{photo.filename}</h3>
            
            <div className="flex items-center gap-3 text-xs text-white/90">
              {photo.place && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate">{photo.place}</span>
                </div>
              )}
              
              {photo.people.length > 0 && (
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{photo.people.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Favorite button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-2 right-2 h-8 w-8 rounded-full bg-black/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60",
            photo.favorites && "opacity-100 text-accent"
          )}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(photo.id);
          }}
        >
          <Heart className={cn("h-4 w-4 text-white", photo.favorites && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}
