import { useState } from "react";
import { usePhotos } from "@/contexts/PhotosContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, User, Edit, Trash2, Search } from "lucide-react";
import { Profile } from "@/services/mockData";
import { toast } from "sonner";

export default function ProfilesPage() {
  const { profiles, addProfile, updateProfile, deleteProfile } = usePhotos();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    nicknames: "",
    notes: "",
  });

  const resetForm = () => {
    setFormData({ name: "", nicknames: "", notes: "" });
    setEditingProfile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    const profileData = {
      name: formData.name,
      nicknames: formData.nicknames.split(",").map((n) => n.trim()).filter(Boolean),
      notes: formData.notes,
    };

    if (editingProfile) {
      updateProfile(editingProfile.id, profileData);
      toast.success("Profile updated successfully");
    } else {
      const newProfile: Profile = {
        id: `p${Date.now()}`,
        ...profileData,
        avatarPhotoId: null,
        samplePhotoIds: [],
        photoCount: 0,
      };
      addProfile(newProfile);
      toast.success("Profile created successfully");
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      name: profile.name,
      nicknames: profile.nicknames.join(", "),
      notes: profile.notes,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this profile?")) {
      deleteProfile(id);
      toast.success("Profile deleted successfully");
    }
  };

  const filteredProfiles = profiles.filter((profile) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      profile.name.toLowerCase().includes(query) ||
      profile.nicknames.some((nickname) => nickname.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">People Profiles</h1>
              <p className="text-muted-foreground">Manage the people in your photos</p>
            </div>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Profile
                </Button>
              </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingProfile ? "Edit Profile" : "Add New Profile"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="nicknames">Nicknames</Label>
                  <Input
                    id="nicknames"
                    value={formData.nicknames}
                    onChange={(e) => setFormData({ ...formData, nicknames: e.target.value })}
                    placeholder="Separate with commas"
                  />
                </div>
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional information..."
                    rows={3}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    {editingProfile ? "Update" : "Create"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
          </div>
          
          {profiles.length > 0 && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search profiles by name or nickname..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          )}
        </div>

        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <User className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No profiles yet</h3>
            <p className="text-muted-foreground mb-4">
              Add profiles to organize people in your photos
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Your First Profile
            </Button>
          </div>
        ) : filteredProfiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Search className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No profiles found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search terms
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <Card key={profile.id} className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {profile.photoCount || 0} photos
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(profile)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(profile.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>

                {profile.nicknames.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {profile.nicknames.map((nickname) => (
                      <Badge key={nickname} variant="secondary" className="text-xs">
                        {nickname}
                      </Badge>
                    ))}
                  </div>
                )}

                {profile.notes && (
                  <p className="text-sm text-muted-foreground line-clamp-2">{profile.notes}</p>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
