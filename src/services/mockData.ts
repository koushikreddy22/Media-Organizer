export interface Photo {
  id: string;
  filename: string;
  filepath: string;
  timestamp: string;
  place: string | null;
  categories: string[];
  favorites: boolean;
  people: Array<{ profileId: string | null; name: string | null; faceBox: { x: number; y: number; w: number; h: number } }>;
  imageUrl: string;
  metadata?: {
    camera?: string;
    dimensions?: string;
  };
  isBlurred?: boolean;
  isDuplicate?: boolean;
  duplicateGroupId?: string;
}

export interface Profile {
  id: string;
  name: string;
  nicknames: string[];
  avatarPhotoId: string | null;
  samplePhotoIds: string[];
  notes: string;
  photoCount?: number;
}

export interface SavedFilter {
  id: string;
  name: string;
  criteria: {
    people: string[];
    dateFrom: string | null;
    dateTo: string | null;
    place: string | null;
    categories: string[];
    favorites: boolean | null;
  };
}

// Mock profiles
export const mockProfiles: Profile[] = [
  {
    id: "p1",
    name: "Sarah Johnson",
    nicknames: ["Sarah"],
    avatarPhotoId: "ph1",
    samplePhotoIds: ["ph1", "ph3"],
    notes: "Sister",
    photoCount: 45,
  },
  {
    id: "p2",
    name: "Michael Chen",
    nicknames: ["Mike"],
    avatarPhotoId: "ph2",
    samplePhotoIds: ["ph2"],
    notes: "Best friend",
    photoCount: 32,
  },
  {
    id: "p3",
    name: "Emma Davis",
    nicknames: ["Em"],
    avatarPhotoId: "ph4",
    samplePhotoIds: ["ph4", "ph6"],
    notes: "Colleague",
    photoCount: 28,
  },
];

// Mock photos
export const mockPhotos: Photo[] = [
  {
    id: "ph1",
    filename: "beach_sunset_2024.jpg",
    filepath: "/photos/2024/beach_sunset_2024.jpg",
    timestamp: "2024-01-15T18:30:00Z",
    place: "Santa Monica Beach, CA",
    categories: ["Vacation", "Nature"],
    favorites: true,
    people: [{ profileId: "p1", name: "Sarah Johnson", faceBox: { x: 100, y: 50, w: 80, h: 80 } }],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop",
    metadata: { camera: "Canon EOS R5", dimensions: "4000x3000" },
  },
  {
    id: "ph2",
    filename: "mountain_hike.jpg",
    filepath: "/photos/2024/mountain_hike.jpg",
    timestamp: "2024-02-20T14:15:00Z",
    place: "Rocky Mountains, CO",
    categories: ["Adventure", "Nature"],
    favorites: false,
    people: [{ profileId: "p2", name: "Michael Chen", faceBox: { x: 120, y: 60, w: 90, h: 90 } }],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    metadata: { camera: "Sony A7 III", dimensions: "4000x3000" },
  },
  {
    id: "ph3",
    filename: "city_lights.jpg",
    filepath: "/photos/2024/city_lights.jpg",
    timestamp: "2024-03-10T20:45:00Z",
    place: "New York City, NY",
    categories: ["Urban", "Night"],
    favorites: true,
    people: [{ profileId: "p1", name: "Sarah Johnson", faceBox: { x: 110, y: 55, w: 85, h: 85 } }],
    imageUrl: "https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop",
    metadata: { camera: "Nikon Z6", dimensions: "4000x3000" },
  },
  {
    id: "ph4",
    filename: "coffee_morning.jpg",
    filepath: "/photos/2024/coffee_morning.jpg",
    timestamp: "2024-04-05T09:30:00Z",
    place: "Local Cafe, Seattle",
    categories: ["Daily Life", "Food"],
    favorites: false,
    people: [{ profileId: "p3", name: "Emma Davis", faceBox: { x: 130, y: 70, w: 75, h: 75 } }],
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
  },
  {
    id: "ph5",
    filename: "autumn_park.jpg",
    filepath: "/photos/2024/autumn_park.jpg",
    timestamp: "2024-10-12T16:20:00Z",
    place: "Central Park, NY",
    categories: ["Nature", "Seasons"],
    favorites: true,
    people: [],
    imageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=600&fit=crop",
  },
  {
    id: "ph6",
    filename: "concert_night.jpg",
    filepath: "/photos/2024/concert_night.jpg",
    timestamp: "2024-06-18T21:00:00Z",
    place: "Madison Square Garden, NY",
    categories: ["Events", "Music"],
    favorites: false,
    people: [
      { profileId: "p2", name: "Michael Chen", faceBox: { x: 100, y: 50, w: 80, h: 80 } },
      { profileId: "p3", name: "Emma Davis", faceBox: { x: 200, y: 50, w: 80, h: 80 } },
    ],
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop",
  },
  {
    id: "ph7",
    filename: "garden_flowers.jpg",
    filepath: "/photos/2024/garden_flowers.jpg",
    timestamp: "2024-05-22T11:45:00Z",
    place: "Botanical Gardens",
    categories: ["Nature", "Flowers"],
    favorites: true,
    people: [],
    imageUrl: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=600&fit=crop",
  },
  {
    id: "ph8",
    filename: "workspace.jpg",
    filepath: "/photos/2024/workspace.jpg",
    timestamp: "2024-08-30T10:00:00Z",
    place: "Home Office",
    categories: ["Work", "Daily Life"],
    favorites: false,
    people: [],
    imageUrl: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=600&fit=crop",
  },
  {
    id: "ph9",
    filename: "beach_sunset_blur.jpg",
    filepath: "/photos/2024/beach_sunset_blur.jpg",
    timestamp: "2024-01-15T18:31:00Z",
    place: "Santa Monica Beach, CA",
    categories: ["Vacation"],
    favorites: false,
    people: [{ profileId: "p1", name: "Sarah Johnson", faceBox: { x: 100, y: 50, w: 80, h: 80 } }],
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop&blur=50",
    isBlurred: true,
  },
  {
    id: "ph10",
    filename: "mountain_hike_duplicate.jpg",
    filepath: "/photos/2024/mountain_hike_duplicate.jpg",
    timestamp: "2024-02-20T14:15:00Z",
    place: "Rocky Mountains, CO",
    categories: ["Adventure", "Nature"],
    favorites: false,
    people: [{ profileId: "p2", name: "Michael Chen", faceBox: { x: 120, y: 60, w: 90, h: 90 } }],
    imageUrl: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop",
    isDuplicate: true,
    duplicateGroupId: "dup-1",
  },
  {
    id: "ph11",
    filename: "concert_blurry.jpg",
    filepath: "/photos/2024/concert_blurry.jpg",
    timestamp: "2024-06-18T21:01:00Z",
    place: "Madison Square Garden, NY",
    categories: ["Events", "Music"],
    favorites: false,
    people: [],
    imageUrl: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&h=600&fit=crop&blur=30",
    isBlurred: true,
  },
  {
    id: "ph12",
    filename: "coffee_morning_copy.jpg",
    filepath: "/photos/2024/coffee_morning_copy.jpg",
    timestamp: "2024-04-05T09:30:00Z",
    place: "Local Cafe, Seattle",
    categories: ["Daily Life", "Food"],
    favorites: false,
    people: [{ profileId: "p3", name: "Emma Davis", faceBox: { x: 130, y: 70, w: 75, h: 75 } }],
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&h=600&fit=crop",
    isDuplicate: true,
    duplicateGroupId: "dup-2",
  },
];

export const mockCategories = [
  "Vacation",
  "Nature",
  "Adventure",
  "Urban",
  "Night",
  "Daily Life",
  "Food",
  "Events",
  "Music",
  "Flowers",
  "Work",
  "Seasons",
];

export const mockSavedFilters: SavedFilter[] = [
  {
    id: "f1",
    name: "Weekend Family",
    criteria: {
      people: ["p1"],
      dateFrom: null,
      dateTo: null,
      place: null,
      categories: [],
      favorites: null,
    },
  },
  {
    id: "f2",
    name: "Summer Vacation 2024",
    criteria: {
      people: [],
      dateFrom: "2024-06-01",
      dateTo: "2024-08-31",
      place: null,
      categories: ["Vacation", "Nature"],
      favorites: null,
    },
  },
  {
    id: "f3",
    name: "Favorite Moments",
    criteria: {
      people: [],
      dateFrom: null,
      dateTo: null,
      place: null,
      categories: [],
      favorites: true,
    },
  },
];
