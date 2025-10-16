import { useState } from "react";
import { usePhotos } from "@/contexts/PhotosContext";
import { PhotoCard } from "@/components/PhotoCard";
import { PhotoViewer } from "@/components/PhotoViewer";
import { Heart } from "lucide-react";
import { Photo } from "@/services/mockData";

export default function FavoritesPage() {
  const { photos, toggleFavorite } = usePhotos();
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const favoritePhotos = photos.filter((photo) => photo.favorites);

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Heart className="h-8 w-8 text-accent fill-current" />
            Favorites
          </h1>
          <p className="text-muted-foreground">
            {favoritePhotos.length} {favoritePhotos.length === 1 ? "photo" : "photos"} you love
          </p>
        </div>

        {favoritePhotos.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No favorites yet</h3>
            <p className="text-muted-foreground">
              Click the heart icon on photos to add them to your favorites
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {favoritePhotos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onToggleFavorite={toggleFavorite}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        )}
      </div>

      <PhotoViewer
        photo={selectedPhoto}
        isOpen={selectedPhoto !== null}
        onClose={() => setSelectedPhoto(null)}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  );
}
