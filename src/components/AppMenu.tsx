import { Home, Users, ImagePlus, Heart, FolderTree, Trash2 } from "lucide-react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const menuItems = [
  { path: "/", label: "Home", icon: Home },
  { path: "/profiles", label: "Profiles", icon: Users },
  { path: "/add-photos", label: "Add New Photos", icon: ImagePlus },
  { path: "/favorites", label: "Favorites", icon: Heart },
  { path: "/categories", label: "Categories", icon: FolderTree },
  { path: "/storage-cleanup", label: "Storage Cleanup", icon: Trash2 },
];

export function AppMenu() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <ImagePlus className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">PhotoVault</h1>
              <p className="text-xs text-muted-foreground">Organize your memories</p>
            </div>
          </div>
          
          <div className="flex gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-smooth",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                <span className="hidden sm:inline">{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
