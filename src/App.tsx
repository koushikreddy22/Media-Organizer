import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route, HashRouter } from "react-router-dom";
import { PhotosProvider } from "@/contexts/PhotosContext";
import { AppMenu } from "@/components/AppMenu";
import HomePage from "./pages/HomePage";
import ProfilesPage from "./pages/ProfilesPage";
import AddPhotosPage from "./pages/AddPhotosPage";
import FavoritesPage from "./pages/FavoritesPage";
import CategoriesPage from "./pages/CategoriesPage";
import StorageCleanupPage from "./pages/StorageCleanupPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <PhotosProvider>
        <Toaster />
        <Sonner />
        <HashRouter>
          <AppMenu />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/profiles" element={<ProfilesPage />} />
            <Route path="/add-photos" element={<AddPhotosPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
            <Route path="/storage-cleanup" element={<StorageCleanupPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </HashRouter>

      </PhotosProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
