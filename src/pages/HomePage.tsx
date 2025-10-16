import { useState } from "react";
import { usePhotos } from "@/contexts/PhotosContext";
import { PhotoCard } from "@/components/PhotoCard";
import { PhotoViewer } from "@/components/PhotoViewer";
import { FilterPanel, FilterCriteria } from "@/components/FilterPanel";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Photo, SavedFilter } from "@/services/mockData";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";

export default function HomePage() {
  const { photos, profiles, savedFilters, toggleFavorite, addSavedFilter } = usePhotos();
  const [isFilterExpanded, setIsFilterExpanded] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({
    people: [],
    dateFrom: "",
    dateTo: "",
    place: "",
    categories: [],
    favorites: null,
    searchTerm: "",
  });

  const filterPhotos = (photos: Photo[]): Photo[] => {
    return photos.filter((photo) => {
      // Search term
      if (activeFilters.searchTerm) {
        const searchLower = activeFilters.searchTerm.toLowerCase();
        const matchesSearch =
          photo.filename.toLowerCase().includes(searchLower) ||
          photo.place?.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // People filter
      if (activeFilters.people.length > 0) {
        const hasMatchingPerson = photo.people.some((p) =>
          activeFilters.people.includes(p.profileId || "")
        );
        if (!hasMatchingPerson) return false;
      }

      // Date range filter
      if (activeFilters.dateFrom) {
        const photoDate = new Date(photo.timestamp);
        const fromDate = new Date(activeFilters.dateFrom);
        if (photoDate < fromDate) return false;
      }

      if (activeFilters.dateTo) {
        const photoDate = new Date(photo.timestamp);
        const toDate = new Date(activeFilters.dateTo);
        toDate.setHours(23, 59, 59);
        if (photoDate > toDate) return false;
      }

      // Place filter
      if (activeFilters.place && photo.place) {
        if (!photo.place.toLowerCase().includes(activeFilters.place.toLowerCase())) {
          return false;
        }
      }

      // Categories filter
      if (activeFilters.categories.length > 0) {
        const hasMatchingCategory = activeFilters.categories.some((cat) =>
          photo.categories.includes(cat)
        );
        if (!hasMatchingCategory) return false;
      }

      // Favorites filter
      if (activeFilters.favorites !== null && photo.favorites !== activeFilters.favorites) {
        return false;
      }

      return true;
    });
  };

  const filteredPhotos = filterPhotos(photos);

  const groupPhotosByDate = (photos: Photo[]) => {
    const groups: { [key: string]: Photo[] } = {};
    
    photos.forEach((photo) => {
      const date = new Date(photo.timestamp);
      const key = date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(photo);
    });

    return Object.entries(groups).sort((a, b) => {
      return new Date(b[1][0].timestamp).getTime() - new Date(a[1][0].timestamp).getTime();
    });
  };

  const photoGroups = groupPhotosByDate(filteredPhotos);

  const loadSavedFilter = (filter: SavedFilter) => {
    setActiveFilters({
      people: filter.criteria.people,
      dateFrom: filter.criteria.dateFrom || "",
      dateTo: filter.criteria.dateTo || "",
      place: filter.criteria.place || "",
      categories: filter.criteria.categories,
      favorites: filter.criteria.favorites,
      searchTerm: "",
    });
  };

  const handleSaveFilter = (name: string, criteria: FilterCriteria) => {
    const newFilter: SavedFilter = {
      id: `f${Date.now()}`,
      name,
      criteria: {
        people: criteria.people,
        dateFrom: criteria.dateFrom || null,
        dateTo: criteria.dateTo || null,
        place: criteria.place || null,
        categories: criteria.categories,
        favorites: criteria.favorites,
      },
    };
    addSavedFilter(newFilter);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        {/* Filter Toggle - Always Visible */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>{isFilterExpanded ? 'Hide Filters' : 'Show Filters'}</span>
            {isFilterExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className={`space-y-6 transition-all duration-300 ${isFilterExpanded ? 'lg:col-span-1' : 'lg:hidden'}`}>

            <div className="space-y-6">
              <FilterPanel
                profiles={profiles}
                onFilterChange={setActiveFilters}
                onSaveFilter={handleSaveFilter}
              />

              {savedFilters.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-foreground">Saved Filters</h3>
                  <div className="space-y-2">
                    {savedFilters.map((filter) => (
                      <Button
                        key={filter.id}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => loadSavedFilter(filter)}
                      >
                        {filter.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className={`transition-all duration-300 ${isFilterExpanded ? 'lg:col-span-3' : 'lg:col-span-4'}`}>
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-foreground mb-2">Your Photos</h1>
              <p className="text-muted-foreground">
                {filteredPhotos.length} {filteredPhotos.length === 1 ? "photo" : "photos"} found
              </p>
            </div>

            {photoGroups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="rounded-full bg-muted p-6 mb-4">
                  <svg
                    className="h-12 w-12 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No photos found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or add new photos to get started
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {photoGroups.map(([date, groupPhotos]) => (
                  <div key={date}>
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="outline" className="text-sm font-semibold">
                        {date}
                      </Badge>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      {groupPhotos.map((photo) => (
                        <PhotoCard
                          key={photo.id}
                          photo={photo}
                          onToggleFavorite={toggleFavorite}
                          onClick={() => setSelectedPhoto(photo)}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
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
