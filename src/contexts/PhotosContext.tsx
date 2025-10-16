import { createContext, useContext, useState, ReactNode } from "react";
import { mockPhotos, mockProfiles, mockSavedFilters, Photo, Profile, SavedFilter } from "@/services/mockData";

interface PhotosContextType {
  photos: Photo[];
  profiles: Profile[];
  savedFilters: SavedFilter[];
  addPhoto: (photo: Photo) => void;
  updatePhoto: (id: string, updates: Partial<Photo>) => void;
  deletePhoto: (id: string) => void;
  addProfile: (profile: Profile) => void;
  updateProfile: (id: string, updates: Partial<Profile>) => void;
  deleteProfile: (id: string) => void;
  addSavedFilter: (filter: SavedFilter) => void;
  deleteSavedFilter: (id: string) => void;
  toggleFavorite: (photoId: string) => void;
}

const PhotosContext = createContext<PhotosContextType | undefined>(undefined);

export function PhotosProvider({ children }: { children: ReactNode }) {
  const [photos, setPhotos] = useState<Photo[]>(mockPhotos);
  const [profiles, setProfiles] = useState<Profile[]>(mockProfiles);
  const [savedFilters, setSavedFilters] = useState<SavedFilter[]>(mockSavedFilters);

  const addPhoto = (photo: Photo) => {
    setPhotos((prev) => [photo, ...prev]);
  };

  const updatePhoto = (id: string, updates: Partial<Photo>) => {
    setPhotos((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deletePhoto = (id: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const addProfile = (profile: Profile) => {
    setProfiles((prev) => [...prev, profile]);
  };

  const updateProfile = (id: string, updates: Partial<Profile>) => {
    setProfiles((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  };

  const deleteProfile = (id: string) => {
    setProfiles((prev) => prev.filter((p) => p.id !== id));
  };

  const addSavedFilter = (filter: SavedFilter) => {
    setSavedFilters((prev) => [...prev, filter]);
  };

  const deleteSavedFilter = (id: string) => {
    setSavedFilters((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleFavorite = (photoId: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, favorites: !p.favorites } : p))
    );
  };

  return (
    <PhotosContext.Provider
      value={{
        photos,
        profiles,
        savedFilters,
        addPhoto,
        updatePhoto,
        deletePhoto,
        addProfile,
        updateProfile,
        deleteProfile,
        addSavedFilter,
        deleteSavedFilter,
        toggleFavorite,
      }}
    >
      {children}
    </PhotosContext.Provider>
  );
}

export function usePhotos() {
  const context = useContext(PhotosContext);
  if (!context) {
    throw new Error("usePhotos must be used within PhotosProvider");
  }
  return context;
}
