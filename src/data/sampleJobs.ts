export interface Job {
  id: string;
  title: string;
  category: 'delivery' | 'cleaning' | 'cooking' | 'security' | 'construction' | 'retail';
  company: string;
  location: string;
  distance: number; // in km
  salary: {
    amount: number;
    period: 'month' | 'day';
  };
  isVerified: boolean;
  description: string;
  requirements: string[];
  workingHours: string;
  icon: string;
}

export const sampleJobs: Job[] = [
  {
    id: '1',
    title: 'Food Delivery Partner',
    category: 'delivery',
    company: 'QuickEats',
    location: 'Koramangala, Bangalore',
    distance: 1.2,
    salary: { amount: 25000, period: 'month' },
    isVerified: true,
    description: 'Deliver food orders to customers using your own vehicle',
    requirements: ['Own vehicle', 'Valid driving license', 'Smartphone'],
    workingHours: '10 AM - 10 PM',
    icon: '🚚'
  },
  {
    id: '2',
    title: 'Office Cleaner',
    category: 'cleaning',
    company: 'CleanCorp',
    location: 'Electronic City, Bangalore',
    distance: 2.5,
    salary: { amount: 800, period: 'day' },
    isVerified: true,
    description: 'Clean office spaces and maintain hygiene standards',
    requirements: ['No experience needed', 'Reliable and punctual'],
    workingHours: '9 AM - 6 PM',
    icon: '🧹'
  },
  {
    id: '3',
    title: 'Cook Assistant',
    category: 'cooking',
    company: 'Tasty Bites Restaurant',
    location: 'Indiranagar, Bangalore',
    distance: 3.1,
    salary: { amount: 18000, period: 'month' },
    isVerified: true,
    description: 'Assist head chef in food preparation and kitchen maintenance',
    requirements: ['Basic cooking knowledge', 'Food safety awareness'],
    workingHours: '11 AM - 11 PM',
    icon: '🍳'
  },
  {
    id: '4',
    title: 'Security Guard',
    category: 'security',
    company: 'SecureShield Services',
    location: 'Whitefield, Bangalore',
    distance: 5.2,
    salary: { amount: 22000, period: 'month' },
    isVerified: true,
    description: 'Provide security services for residential complex',
    requirements: ['12th pass', 'Good physical fitness', 'Night shift available'],
    workingHours: '12 hour shifts',
    icon: '🛡️'
  },
  {
    id: '5',
    title: 'Construction Helper',
    category: 'construction',
    company: 'BuildRight Constructions',
    location: 'Hebbal, Bangalore',
    distance: 4.8,
    salary: { amount: 600, period: 'day' },
    isVerified: true,
    description: 'Assist skilled workers in construction activities',
    requirements: ['Physical strength', 'Basic construction knowledge helpful'],
    workingHours: '7 AM - 5 PM',
    icon: '🏗️'
  },
  {
    id: '6',
    title: 'Store Assistant',
    category: 'retail',
    company: 'MegaMart',
    location: 'JP Nagar, Bangalore',
    distance: 2.8,
    salary: { amount: 16000, period: 'month' },
    isVerified: true,
    description: 'Help customers and maintain store inventory',
    requirements: ['Basic English', 'Customer service attitude'],
    workingHours: '10 AM - 9 PM',
    icon: '🏪'
  },
  {
    id: '7',
    title: 'Package Delivery',
    category: 'delivery',
    company: 'FastCourier',
    location: 'Malleshwaram, Bangalore',
    distance: 3.7,
    salary: { amount: 700, period: 'day' },
    isVerified: true,
    description: 'Deliver packages to residential and commercial addresses',
    requirements: ['Own two-wheeler', 'Knowledge of local area'],
    workingHours: '9 AM - 7 PM',
    icon: '📦'
  },
  {
    id: '8',
    title: 'Home Cook',
    category: 'cooking',
    company: 'HomeMeals Service',
    location: 'Jayanagar, Bangalore',
    distance: 1.9,
    salary: { amount: 20000, period: 'month' },
    isVerified: true,
    description: 'Prepare home-style meals for families',
    requirements: ['Good cooking skills', 'Knowledge of various cuisines'],
    workingHours: '7 AM - 12 PM, 4 PM - 8 PM',
    icon: '👨‍🍳'
  }
];

export const jobCategories = [
  { key: 'delivery', icon: '🚚', color: 'bg-blue-100 text-blue-800' },
  { key: 'cleaning', icon: '🧹', color: 'bg-green-100 text-green-800' },
  { key: 'cooking', icon: '🍳', color: 'bg-orange-100 text-orange-800' },
  { key: 'security', icon: '🛡️', color: 'bg-purple-100 text-purple-800' },
  { key: 'construction', icon: '🏗️', color: 'bg-yellow-100 text-yellow-800' },
  { key: 'retail', icon: '🏪', color: 'bg-pink-100 text-pink-800' },
];