export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: {
    amount: number;
    period: 'day' | 'month';
  };
  type: 'full-time' | 'part-time' | 'contract';
  description: string;
  requirements: string[];
  postedDate: string;
  status: 'open' | 'closed';
  category: 'Driver' | 'Construction' | 'Factory' | 'Housekeeping' | 'Security' | 'Other';
  skills: string[];
  experience: string;
  applicationDeadline: string;
  numberOfPositions: number;
  coordinates: {
    type: 'Point';
    coordinates: [number, number]; // [longitude, latitude]
  };
  workingHours: string;
  isVerified: boolean;
  distance?: number; // Added by the server based on geolocation query
  createdAt: string;
  updatedAt: string;
}
