import { useState } from "react";
import { Search, Calendar, MapPin, Tag, Heart, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { mockCategories } from "@/services/mockData";

export interface FilterCriteria {
  people: string[];
  dateFrom: string;
  dateTo: string;
  place: string;
  categories: string[];
  favorites: boolean | null;
  searchTerm: string;
}

interface FilterPanelProps {
  profiles: Array<{ id: string; name: string }>;
  onFilterChange: (filters: FilterCriteria) => void;
  onSaveFilter: (name: string, criteria: FilterCriteria) => void;
}

export function FilterPanel({ profiles, onFilterChange, onSaveFilter }: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterCriteria>({
    people: [],
    dateFrom: "",
    dateTo: "",
    place: "",
    categories: [],
    favorites: null,
    searchTerm: "",
  });
  const [filterName, setFilterName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);

  const updateFilters = (updates: Partial<FilterCriteria>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const addPerson = (personId: string) => {
    if (!filters.people.includes(personId)) {
      updateFilters({ people: [...filters.people, personId] });
    }
  };

  const removePerson = (personId: string) => {
    updateFilters({ people: filters.people.filter((id) => id !== personId) });
  };

  const addCategory = (category: string) => {
    if (!filters.categories.includes(category)) {
      updateFilters({ categories: [...filters.categories, category] });
    }
  };

  const removeCategory = (category: string) => {
    updateFilters({ categories: filters.categories.filter((c) => c !== category) });
  };

  const clearFilters = () => {
    const emptyFilters: FilterCriteria = {
      people: [],
      dateFrom: "",
      dateTo: "",
      place: "",
      categories: [],
      favorites: null,
      searchTerm: "",
    };
    setFilters(emptyFilters);
    onFilterChange(emptyFilters);
  };

  const handleSaveFilter = () => {
    if (filterName.trim()) {
      onSaveFilter(filterName, filters);
      setFilterName("");
      setShowSaveDialog(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search & Filter
        </h2>
        <Button variant="ghost" size="sm" onClick={clearFilters}>
          Clear All
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="search" className="text-sm font-medium">
            Search
          </Label>
          <Input
            id="search"
            placeholder="Search by filename, place..."
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            People
          </Label>
          <Select onValueChange={addPerson}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select people..." />
            </SelectTrigger>
            <SelectContent>
              {profiles.map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.people.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.people.map((personId) => {
                const profile = profiles.find((p) => p.id === personId);
                return (
                  <Badge key={personId} variant="secondary" className="gap-1">
                    {profile?.name}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removePerson(personId)}
                    />
                  </Badge>
                );
              })}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="dateFrom" className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              From
            </Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => updateFilters({ dateFrom: e.target.value })}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="dateTo" className="text-sm font-medium">
              To
            </Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => updateFilters({ dateTo: e.target.value })}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="place" className="text-sm font-medium flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Place
          </Label>
          <Input
            id="place"
            placeholder="Enter location..."
            value={filters.place}
            onChange={(e) => updateFilters({ place: e.target.value })}
            className="mt-1.5"
          />
        </div>

        <div>
          <Label className="text-sm font-medium flex items-center gap-2">
            <Tag className="h-4 w-4" />
            Categories
          </Label>
          <Select onValueChange={addCategory}>
            <SelectTrigger className="mt-1.5">
              <SelectValue placeholder="Select categories..." />
            </SelectTrigger>
            <SelectContent>
              {mockCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filters.categories.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {filters.categories.map((category) => (
                <Badge key={category} variant="secondary" className="gap-1">
                  {category}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeCategory(category)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            variant={filters.favorites === true ? "default" : "outline"}
            size="sm"
            onClick={() => updateFilters({ favorites: filters.favorites === true ? null : true })}
            className="flex-1"
          >
            <Heart className="h-4 w-4 mr-2" />
            Favorites Only
          </Button>
        </div>

        {!showSaveDialog ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setShowSaveDialog(true)}
          >
            <Save className="h-4 w-4 mr-2" />
            Save Filter
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              placeholder="Filter name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
            <div className="flex gap-2">
              <Button onClick={handleSaveFilter} className="flex-1">
                Save
              </Button>
              <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

function Users({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
