import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Photo } from "@/services/mockData";
import { Heart, MapPin, Calendar, Users, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface PhotoViewerProps {
  photo: Photo | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleFavorite: (id: string) => void;
}

export function PhotoViewer({ photo, isOpen, onClose, onToggleFavorite }: PhotoViewerProps) {
  if (!photo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 gap-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 z-50 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="flex flex-col md:flex-row h-full">
          {/* Image Section */}
          <div className="flex-1 bg-muted flex items-center justify-center p-4 md:p-8">
            <img
              src={photo.imageUrl}
              alt={photo.filename}
              className="max-h-full max-w-full object-contain rounded-lg"
            />
          </div>

          {/* Info Section */}
          <div className="w-full md:w-80 bg-background p-6 overflow-y-auto space-y-6">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold text-foreground">{photo.filename}</h2>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 shrink-0",
                  photo.favorites && "text-accent"
                )}
                onClick={() => onToggleFavorite(photo.id)}
              >
                <Heart className={cn("h-5 w-5", photo.favorites && "fill-current")} />
              </Button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>{new Date(photo.timestamp).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}</span>
              </div>

              {photo.place && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{photo.place}</span>
                </div>
              )}

              {photo.people.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">People</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {photo.people.map((person, idx) => (
                      <Badge key={idx} variant="secondary">
                        {person.name || "Unknown"}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {photo.categories.length > 0 && (
                <div>
                  <div className="text-sm font-medium text-foreground mb-2">Categories</div>
                  <div className="flex flex-wrap gap-2">
                    {photo.categories.map((category) => (
                      <Badge key={category} variant="outline">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {photo.metadata && (
                <div className="pt-4 border-t space-y-2">
                  <div className="text-sm font-medium text-foreground mb-2">Details</div>
                  {photo.metadata.camera && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Camera:</span> {photo.metadata.camera}
                    </div>
                  )}
                  {photo.metadata.dimensions && (
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Dimensions:</span> {photo.metadata.dimensions}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
