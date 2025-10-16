import { useState } from "react";
import { usePhotos } from "@/contexts/PhotosContext";
import { PhotoCard } from "@/components/PhotoCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Trash2, CheckSquare, Square } from "lucide-react";
import { toast } from "sonner";

export default function StorageCleanupPage() {
  const { photos, deletePhoto, toggleFavorite } = usePhotos();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const blurredPhotos = photos.filter((p) => p.isBlurred);
  const duplicatePhotos = photos.filter((p) => p.isDuplicate);
  const allIssuePhotos = [...blurredPhotos, ...duplicatePhotos];

  const toggleSelect = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const selectAll = (photoList: typeof photos) => {
    const ids = photoList.map((p) => p.id);
    setSelectedIds(new Set(ids));
  };

  const deselectAll = () => {
    setSelectedIds(new Set());
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) {
      toast.error("No photos selected");
      return;
    }

    selectedIds.forEach((id) => deletePhoto(id));
    toast.success(`Deleted ${selectedIds.size} photo${selectedIds.size > 1 ? "s" : ""}`);
    setSelectedIds(new Set());
  };

  const PhotoGrid = ({ photoList }: { photoList: typeof photos }) => {
    if (photoList.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground">No issues detected! Your storage is clean.</p>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {photoList.map((photo) => {
          const isSelected = selectedIds.has(photo.id);
          return (
            <div key={photo.id} className="relative">
              <div
                className={`transition-all ${
                  isSelected ? "ring-2 ring-primary ring-offset-2 rounded-xl" : ""
                }`}
              >
                <PhotoCard
                  photo={photo}
                  onToggleFavorite={toggleFavorite}
                  onClick={() => toggleSelect(photo.id)}
                />
              </div>
              <div className="absolute top-2 left-2 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSelect(photo.id);
                  }}
                >
                  {isSelected ? (
                    <CheckSquare className="h-4 w-4 text-primary" />
                  ) : (
                    <Square className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <div className="absolute bottom-16 left-2 z-10 flex gap-1">
                {photo.isBlurred && (
                  <Badge variant="destructive" className="text-xs">
                    Blurred
                  </Badge>
                )}
                {photo.isDuplicate && (
                  <Badge variant="destructive" className="text-xs">
                    Duplicate
                  </Badge>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Storage Cleanup
            </h1>
            <p className="text-muted-foreground mt-1">
              Remove duplicate and blurred photos to free up space
            </p>
          </div>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-base px-4 py-2">
                {selectedIds.size} selected
              </Badge>
              <Button variant="outline" onClick={deselectAll}>
                Deselect All
              </Button>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="all">
              All Issues ({allIssuePhotos.length})
            </TabsTrigger>
            <TabsTrigger value="blurred">
              Blurred ({blurredPhotos.length})
            </TabsTrigger>
            <TabsTrigger value="duplicates">
              Duplicates ({duplicatePhotos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectAll(allIssuePhotos)}
              >
                Select All
              </Button>
            </div>
            <PhotoGrid photoList={allIssuePhotos} />
          </TabsContent>

          <TabsContent value="blurred" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectAll(blurredPhotos)}
              >
                Select All
              </Button>
            </div>
            <PhotoGrid photoList={blurredPhotos} />
          </TabsContent>

          <TabsContent value="duplicates" className="mt-6">
            <div className="flex justify-end mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectAll(duplicatePhotos)}
              >
                Select All
              </Button>
            </div>
            <PhotoGrid photoList={duplicatePhotos} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
