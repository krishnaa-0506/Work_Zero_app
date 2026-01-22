// Mock data for fallback when API calls fail

export const mockUserProfile = {
  id: 'mock-user-123',
  name: 'Demo User 👤',
  aadhaarNumber: '****-****-1234',
  phone: '+91 98765 43210',
  email: 'demo@workzeroapp.com',
  location: {
    city: 'Mumbai',
    state: 'Maharashtra',
    coordinates: [19.0760, 72.8777]
  },
  skills: ['👷 Construction', '🔧 Maintenance', '🚛 Delivery', '🧹 Cleaning'],
  experience: [
    {
      id: 'exp1',
      company: 'ABC Construction 🏗️',
      role: 'Helper',
      duration: '2 years',
      description: 'Assisted in building construction work'
    }
  ],
  isVerified: true,
  rating: 4.5,
  completedJobs: 15
};

export const mockJobs = [
  {
    id: 'job1',
    title: '🏗️ Construction Worker Needed',
    company: 'BuildRight Construction',
    location: 'Mumbai, Maharashtra',
    salary: '₹15,000 - ₹20,000/month',
    type: 'full-time',
    description: 'Looking for experienced construction workers for building project',
    requirements: ['Physical fitness', 'Basic construction knowledge', 'Teamwork'],
    posted: '2025-01-20',
    category: 'construction',
    urgent: true,
    verified: true
  },
  {
    id: 'job2',
    title: '🚛 Delivery Executive',
    company: 'QuickDelivery Services',
    location: 'Pune, Maharashtra',
    salary: '₹12,000 - ₹18,000/month',
    type: 'part-time',
    description: 'Deliver packages across the city using company vehicle',
    requirements: ['Valid driving license', 'Know local roads', 'Smartphone'],
    posted: '2025-01-21',
    category: 'delivery',
    urgent: false,
    verified: true
  },
  {
    id: 'job3',
    title: '🧹 Office Cleaning Staff',
    company: 'CleanSpace Solutions',
    location: 'Bangalore, Karnataka',
    salary: '₹10,000 - ₹14,000/month',
    type: 'full-time',
    description: 'Maintain cleanliness in corporate office spaces',
    requirements: ['Attention to detail', 'Reliability', 'Morning shifts'],
    posted: '2025-01-19',
    category: 'cleaning',
    urgent: false,
    verified: true
  }
];

export const mockApplications = [
  {
    id: 'app1',
    jobId: 'job1',
    jobTitle: '🏗️ Construction Worker Needed',
    company: 'BuildRight Construction',
    appliedDate: '2025-01-21',
    status: 'pending',
    feedback: null
  },
  {
    id: 'app2',
    jobId: 'job2',
    jobTitle: '🚛 Delivery Executive',
    company: 'QuickDelivery Services',
    appliedDate: '2025-01-20',
    status: 'interview',
    feedback: 'Interview scheduled for tomorrow at 2 PM'
  }
];

export const mockConversations = [
  {
    id: 'conv1',
    participantName: 'HR - BuildRight Construction 🏗️',
    lastMessage: 'Your application has been reviewed. Interview scheduled.',
    lastMessageTime: '2025-01-22T10:30:00Z',
    unreadCount: 1,
    messages: [
      {
        id: 'msg1',
        senderId: 'hr-buildright',
        content: 'Thank you for applying! We would like to schedule an interview.',
        timestamp: '2025-01-22T10:30:00Z',
        read: false
      }
    ]
  },
  {
    id: 'conv2',
    participantName: 'Support Team 💬',
    lastMessage: 'How can we help you today?',
    lastMessageTime: '2025-01-22T09:15:00Z',
    unreadCount: 0,
    messages: [
      {
        id: 'msg2',
        senderId: 'support',
        content: 'Hello! How can we help you today? 😊',
        timestamp: '2025-01-22T09:15:00Z',
        read: true
      }
    ]
  }
];

export const mockVerificationResult = {
  success: true,
  message: 'Verification successful! ✅',
  confidence: 0.95
};

export const mockJobRecommendations = [
  {
    id: 'rec1',
    reason: 'Based on your construction experience 🏗️',
    jobs: mockJobs.filter(job => job.category === 'construction')
  },
  {
    id: 'rec2',
    reason: 'Jobs near your location 📍',
    jobs: mockJobs.slice(0, 2)
  }
];