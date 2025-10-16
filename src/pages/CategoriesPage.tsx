import { useState } from "react";
import { usePhotos } from "@/contexts/PhotosContext";
import { PhotoCard } from "@/components/PhotoCard";
import { PhotoViewer } from "@/components/PhotoViewer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { FolderTree, Grid3x3 } from "lucide-react";
import { mockCategories, Photo } from "@/services/mockData";

export default function CategoriesPage() {
  const { photos, toggleFavorite } = usePhotos();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  const getCategoryCount = (category: string) => {
    return photos.filter((photo) => photo.categories.includes(category)).length;
  };

  const categoryStats = mockCategories.map((category) => ({
    name: category,
    count: getCategoryCount(category),
  }));

  const filteredPhotos = selectedCategory
    ? photos.filter((photo) => photo.categories.includes(selectedCategory))
    : [];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <FolderTree className="h-8 w-8 text-primary" />
            Categories
          </h1>
          <p className="text-muted-foreground">Browse your photos by category</p>
        </div>

        {/* Category Grid */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Grid3x3 className="h-5 w-5" />
            All Categories
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categoryStats.map((category) => (
              <Card
                key={category.name}
                className={`p-6 cursor-pointer transition-smooth hover:shadow-card-hover ${
                  selectedCategory === category.name
                    ? "ring-2 ring-primary shadow-card-hover"
                    : ""
                }`}
                onClick={() =>
                  setSelectedCategory(
                    selectedCategory === category.name ? null : category.name
                  )
                }
              >
                <div className="text-center space-y-2">
                  <div className="rounded-lg bg-primary/10 p-4 inline-block">
                    <FolderTree className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground">{category.name}</h3>
                  <Badge variant="secondary">{category.count} photos</Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Photos in Selected Category */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">
                {selectedCategory} Photos
              </h2>
              <Button variant="outline" onClick={() => setSelectedCategory(null)}>
                Clear Selection
              </Button>
            </div>

            {filteredPhotos.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <FolderTree className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No photos in this category
                </h3>
                <p className="text-muted-foreground">
                  Add categories to your photos to organize them better
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredPhotos.map((photo) => (
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
