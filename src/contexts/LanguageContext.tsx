import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'hi' | 'ta';

interface Translations {
  // App
  appName: string;
  appTitle: string;
  tagline: string;
  
  // Job Categories
  logistics: string;
  
  // Language Selection
  chooseLanguage: string;
  voicePrompt: string;
  welcome: string;
  verifyIdentity: string;
  
  // Common UI
  myApplications: string;
  trackApplications: string;
  construction: string;
  delivery: string;
  applied: string;
  interviewScheduled: string;
  underReview: string;
  noApplicationsYet: string;
  startApplying: string;
  browseJobs: string;
  notifications: string;
  totalNotifications: string;
  unreadNotifications: string;
  noNotificationsYet: string;
  whenYouApply: string;
  takeAction: string;
  viewDetails: string;
  profileSettings: string;
  verifiedProfile: string;
  completedJobs: string;
  totalEarnings: string;
  skillsAndExperience: string;
  addExperience: string;
  yearsOfExperience: string;
  certificates: string;
  uploadCertificate: string;
  rating: string;
  feedback: string;
  feedbackFrom: string;
  excellent: string;
  good: string;
  jobDetails: string;
  applyForJob: string;
  salary: string;
  perMonth: string;
  perDay: string;
  location: string;
  workingHours: string;
  applicationSent: string;
  applicationSubmitted: string;
  yourApplicationReceived: string;
  successfullySent: string;
  goHome: string;
  trackApplication: string;
  applicationStatus: string;
  applicationStatusDesc: string;
  submitted: string;
  submittedDesc: string;
  reviewInProgress: string;
  reviewInProgressDesc: string;
  interviewSchedulingPhase: string;
  interviewSchedulingDesc: string;
  finalDecision: string;
  finalDecisionDesc: string;
  contactRecruiter: string;
  viewFeedback: string;
  supportPage: string;
  helpAndSupport: string;
  weAreHere: string;
  emergencySupport: string;
  roundTheClock: string;
  reportSafetyConcerns: string;
  quickActions: string;
  callSupport: string;
  chatSupport: string;
  frequentlyAskedQuestions: string;
  faqHowToApply: string;
  faqAnswer1: string;
  faqTrackApplications: string;
  faqAnswer2: string;
  faqSkillBadges: string;
  faqAnswer3: string;
  faqContactEmployers: string;
  faqAnswer4: string;
  howToApply: string;
  howToPost: string;
  acceptedJobs: string;
  rejectedJobs: string;
  pending: string;
  reviewing: string;
  interview: string;
  accepted: string;
  rejected: string;
  
  // Signup Flow
  aadhaar: {
    label: string;
    placeholder: string;
    verify: string;
  };
  details: {
    title: string;
    name: string;
    dob: string;
    gender: string;
    address: string;
  };
  selfie: {
    title: string;
    description: string;
  };
  success: {
    title: string;
    description: string;
  };
  button: {
    continue: string;
    start: string;
  };
  
  // Other Translations
  enterName: string;
  enterAadhaar: string;
  aadhaarNumber: string;
  sendOtp: string;
  enterOtp: string;
  verifyOtp: string;
  otpSent: string;
  otpVerified: string;
  uploadAadhaar: string;
  takeSelfie: string;
  faceVerification: string;
  faceMatched: string;
  faceNotMatched: string;
  retakeSelfie: string;
  selectAge: string;
  selectGender: string;
  male: string;
  female: string;
  other: string;
  next: string;
  verify: string;
  aadhaarVerified: string;
  
  // Home/Job Feed
  nearbyJobs: string;
  kmAway: string;
  perMonth: string;
  perDay: string;
  applyNow: string;
  companyVerified: string;
  
  // Job Categories
  delivery: string;
  cleaning: string;
  cooking: string;
  security: string;
  construction: string;
  retail: string;
  
  // Application
  applicationSent: string;
  trackApplication: string;
  goHome: string;
  
  // Application Status
  applicationStatus: string;
  applicationSubmitted: string;
  applicationSubmittedDesc: string;
  applicationReview: string;
  applicationReviewDesc: string;
  interviewScheduling: string;
  interviewSchedulingDesc: string;
  finalDecision: string;
  finalDecisionDesc: string;
  contactRecruiter: string;
  viewFeedback: string;
  
  // Profile
  profile: string;
  skills: string;
  addSkill: string;
  
  // Voice Assistant
  listening: string;
  tapToSpeak: string;
  voiceSupport: string;
  navJobs: string;
  navMessages: string;
  navSkills: string;
  navSupport: string;
  navSettings: string;
  
  // User Type Selection
  selectUserType: string;
  worker: string;
  company: string;
  workerDescription: string;
  companyDescription: string;
  alreadyHaveAccount: string;
  login: string;
  
  // Company Features
  dashboard: string;
  postJob: string;
  viewApplications: string;
  messages: string;
  jobTitle: string;
  jobDescription: string;
  requirements: string;
  salary: string;
  location: string;
  workingHours: string;
  jobType: string;
  fullTime: string;
  partTime: string;
  contract: string;
  
  // Additional Features
  earnings: string;
  withdraw: string;
  bankAccount: string;
  upiPayment: string;
  paymentHistory: string;
  skillsAndExperience: string;
  addExperience: string;
  yearsOfExperience: string;
  certificates: string;
  uploadCertificate: string;
  
  // Login
  email: string;
  password: string;
  forgotPassword: string;
  dontHaveAccount: string;
  
  // Company
  companyName: string;
  companySize: string;
  industry: string;
  website: string;
  description: string;
  manageJobs: string;
  
  // Messages
  typeMessage: string;
  noMessages: string;
  send: string;
  
  // Settings
  settings: string;
  language: string;
  darkMode: string;
  pushNotifications: string;
  emailNotifications: string;
  
  // Help
  help: string;
  faq: string;
  contactSupport: string;
  howToApply: string;
  howToPost: string;
  
  // Notifications
  notifications: string;
  totalNotifications: string;
  unreadNotifications: string;
  interviewScheduled: string;
  applicationApproved: string;
  callScheduled: string;
  newJobMatch: string;
  interviewTomorrow: string;
  applicationApprovedMsg: string;
  callTodayMsg: string;
  newJobMatchMsg: string;
  actionRequired: string;
  takeAction: string;
  viewDetails: string;
  noNotifications: string;
  noNotificationsMsg: string;
  findJobs: string;
  actionsRequired: string;
  itemsNeedAttention: string;
  review: string;
  myApplications: string;
  trackApplications: string;
  applied: string;
  noApplicationsYet: string;
  startApplying: string;
  browseJobs: string;
  completedJobs: string;
  totalEarnings: string;
  verifiedProfile: string;
  profileSettings: string;
  rating: string;
  feedback: string;
  feedbackFrom: string;
  excellent: string;
  good: string;
  jobDetails: string;
  applyForJob: string;
  helpAndSupport: string;
  weAreHere: string;
  emergencySupport: string;
  roundTheClock: string;
  reportSafetyConcerns: string;
  quickActions: string;
  callSupport: string;
  chatSupport: string;
  frequentlyAskedQuestions: string;
  faqHowToApply: string;
  faqAnswer1: string;
  faqTrackApplications: string;
  faqAnswer2: string;
  faqSkillBadges: string;
  faqAnswer3: string;
  faqContactEmployers: string;
  faqAnswer4: string;
  pending: string;
  reviewing: string;
}

const translations: Record<Language, Translations> = {
  en: {
    appName: "Zero Barrier",
    appTitle: "Jobs Without Barriers",
    tagline: "Jobs Made Simple",
    logistics: "Logistics",
    welcome: "Welcome to Zero Barrier",
    verifyIdentity: "Let's verify your identity to get started",
    aadhaar: {
      label: "Enter Your Aadhaar Number",
      placeholder: "XXXX XXXX XXXX",
      verify: "Verify Aadhaar"
    },
    details: {
      title: "Verified Details",
      name: "Name",
      dob: "Date of Birth",
      gender: "Gender",
      address: "Address"
    },
    selfie: {
      title: "Take a Selfie",
      description: "Please ensure good lighting and look directly at the camera"
    },
    success: {
      title: "Verification Complete!",
      description: "Your identity has been successfully verified"
    },
    button: {
      continue: "Continue",
      start: "Start Your Journey"
    },
    chooseLanguage: "Choose Your Language",
    voicePrompt: "Please choose your language",
    enterName: "Enter Your Name",
    enterAadhaar: "Enter Aadhaar Number",
    aadhaarNumber: "Aadhaar Number",
    sendOtp: "Send OTP",
    enterOtp: "Enter OTP",
    verifyOtp: "Verify OTP",
    otpSent: "OTP sent to your registered mobile",
    otpVerified: "OTP Verified Successfully",
    uploadAadhaar: "Upload Aadhaar Photo",
    takeSelfie: "Take Selfie",
    faceVerification: "Face Verification",
    faceMatched: "Face Matched Successfully",
    faceNotMatched: "Face does not match. Please try again",
    retakeSelfie: "Retake Selfie",
    selectAge: "Select Age",
    selectGender: "Select Gender",
    male: "Male",
    female: "Female",
    other: "Other",
    next: "Next",
    verify: "Verify",
    aadhaarVerified: "Verified",
    nearbyJobs: "Nearby Jobs",
    kmAway: "km away",
    perMonth: "/month",
    perDay: "/day",
    applyNow: "Apply Now",
    companyVerified: "Verified",
    delivery: "Delivery",
    cleaning: "Cleaning",
    cooking: "Cooking",
    security: "Security",
    construction: "Construction",
    retail: "Retail",
    applicationSent: "Application sent successfully!",
    trackApplication: "Track Application",
    goHome: "Go Home",
    profile: "Profile",
    skills: "Skills",
    addSkill: "Add Skill",
    listening: "Listening...",
    tapToSpeak: "Tap to Speak",
    voiceSupport: "Voice Support Available",
    navJobs: "Jobs",
    navMessages: "Messages",
    navSkills: "Skills",
    navSupport: "Support",
    navSettings: "Settings",
    selectUserType: "Select User Type",
    worker: "Worker",
    company: "Company",
    workerDescription: "Looking for jobs and opportunities",
    companyDescription: "Hiring workers and posting jobs",
    login: "Login",
    email: "Email",
    password: "Password",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    companyName: "Company Name",
    companySize: "Company Size",
    industry: "Industry",
    website: "Website",
    description: "Description",
    dashboard: "Dashboard",
    postJob: "Post Job",
    viewApplications: "View Applications",
    manageJobs: "Manage Jobs",
    jobTitle: "Job Title",
    jobDescription: "Job Description",
    requirements: "Requirements",
    salary: "Salary",
    location: "Location",
    workingHours: "Working Hours",
    jobType: "Job Type",
    fullTime: "Full Time",
    partTime: "Part Time",
    contract: "Contract",
    messages: "Messages",
    noMessages: "No messages yet",
    typeMessage: "Type a message...",
    send: "Send",
    settings: "Settings",
    language: "Language",
    darkMode: "Dark Mode",
    pushNotifications: "Push Notifications",
    emailNotifications: "Email Notifications",
    help: "Help",
    faq: "FAQ",
    contactSupport: "Contact Support",
    howToApply: "How to Apply for Jobs",
    howToPost: "How to Post Jobs",
    notifications: "Notifications",
    totalNotifications: "total",
    unreadNotifications: "unread",
    interviewScheduled: "Interview Scheduled",
    applicationApproved: "Application Approved",
    callScheduled: "Call Scheduled",
    newJobMatch: "New Job Match",
    interviewTomorrow: "Your interview for Delivery Partner at QuickEats is scheduled for tomorrow at 10:00 AM",
    applicationApprovedMsg: "Great news! Your application for Office Cleaner at CleanCorp has been approved. Wait for the call.",
    callTodayMsg: "The employer will call you today between 2:00 PM - 4:00 PM for Cook Assistant position.",
    newJobMatchMsg: "A new Security Guard position near you matches your skills and preferences.",
    actionRequired: "Action Required",
    takeAction: "Take Action",
    viewDetails: "View Details",
    noNotifications: "No notifications yet",
    noNotificationsMsg: "When you apply for jobs, you'll receive updates here about your applications, interviews, and new job matches.",
    findJobs: "Find Jobs",
    actionsRequired: "Actions Required",
    itemsNeedAttention: "items that need your attention",
    review: "Review",
    earnings: "Earnings",
    withdraw: "Withdraw",
    bankAccount: "Bank Account",
    upiPayment: "UPI Payment",
    paymentHistory: "Payment History",
    skillsAndExperience: "Skills & Experience",
    addExperience: "Add Experience",
    yearsOfExperience: "Years of Experience",
    certificates: "Certificates",
    uploadCertificate: "Upload Certificate",
    applicationStatus: "Application Status",
    applicationSubmitted: "Application Submitted",
    applicationSubmittedDesc: "Your application has been received",
    applicationReview: "Application Review",
    applicationReviewDesc: "Recruiter is reviewing your profile",
    interviewScheduling: "Interview Scheduling",
    interviewSchedulingDesc: "Waiting for interview schedule",
    finalDecision: "Final Decision",
    finalDecisionDesc: "Awaiting final decision",
    contactRecruiter: "Contact Recruiter",
    viewFeedback: "View Feedback",
    myApplications: "My Applications",
    trackApplications: "Track your job applications",
    applied: "Applied",
    noApplicationsYet: "No applications yet",
    startApplying: "Start applying for jobs to see your applications here",
    browseJobs: "Browse Jobs",
    completedJobs: "Completed Jobs",
    totalEarnings: "Total Earnings",
    verifiedProfile: "Verified Profile",
    profileSettings: "Profile Settings",
    rating: "Rating",
    feedback: "Feedback",
    feedbackFrom: "Feedback from",
    excellent: "Excellent work! Very punctual and professional.",
    good: "Good delivery service. Items delivered safely and on time.",
    jobDetails: "Job Details",
    applyForJob: "Apply for Job",
    helpAndSupport: "Help & Support",
    weAreHere: "We are here to help you",
    emergencySupport: "Emergency Support",
    roundTheClock: "Round-the-clock support for urgent assistance",
    reportSafetyConcerns: "Report safety concerns or workplace issues",
    quickActions: "Quick Actions",
    callSupport: "Call Support",
    chatSupport: "Chat Support",
    frequentlyAskedQuestions: "Frequently Asked Questions",
    faqHowToApply: "How do I apply for jobs?",
    faqAnswer1: "To apply for a job, browse through available jobs, select a job, review details, and tap Apply Now.",
    faqTrackApplications: "How can I track my applications?",
    faqAnswer2: "You can follow your job updates from notifications and messages in the bottom navigation.",
    faqSkillBadges: "What are skill badges?",
    faqAnswer3: "Skill badges are verifications of your abilities. You can earn them by completing skill assessments.",
    faqContactEmployers: "How do I contact employers?",
    faqAnswer4: "After applying for a job, message employers directly through the chat feature.",
    pending: "Pending",
    reviewing: "Reviewing",
    interview: "Interview",
    accepted: "Accepted",
    rejected: "Rejected",
  },
  hi: {
    appName: "ज़ीरो बैरियर",
    appTitle: "बिना बाधाओं के नौकरियां",
    tagline: "नौकरी आसान बनाई",
    logistics: "लॉजिस्टिक्स",
    welcome: "ज़ीरो बैरियर में आपका स्वागत है",
    verifyIdentity: "शुरू करने के लिए अपनी पहचान सत्यापित करें",
    aadhaar: {
      label: "अपना आधार नंबर दर्ज करें",
      placeholder: "XXXX XXXX XXXX",
      verify: "आधार सत्यापित करें"
    },
    details: {
      title: "सत्यापित विवरण",
      name: "नाम",
      dob: "जन्म तिथि",
      gender: "लिंग",
      address: "पता"
    },
    selfie: {
      title: "सेल्फी लें",
      description: "कृपया अच्छी रोशनी सुनिश्चित करें और सीधे कैमरे की तरफ देखें"
    },
    success: {
      title: "सत्यापन पूर्ण!",
      description: "आपकी पहचान सफलतापूर्वक सत्यापित कर ली गई है"
    },
    button: {
      continue: "जारी रखें",
      start: "अपनी यात्रा शुरू करें"
    },
    chooseLanguage: "अपनी भाषा चुनें",
    voicePrompt: "कृपया अपनी भाषा चुनें",
    enterName: "अपना नाम दर्ज करें",
    enterAadhaar: "आधार नंबर दर्ज करें",
    aadhaarNumber: "आधार नंबर",
    sendOtp: "ओटीपी भेजें",
    enterOtp: "ओटीपी दर्ज करें",
    verifyOtp: "ओटीपी सत्यापित करें",
    otpSent: "आपके पंजीकृत मोबाइल पर ओटीपी भेजा गया",
    otpVerified: "ओटीपी सफलतापूर्वक सत्यापित",
    uploadAadhaar: "आधार फोटो अपलोड करें",
    takeSelfie: "सेल्फी लें",
    faceVerification: "चेहरा सत्यापन",
    faceMatched: "चेहरा सफलतापूर्वक मैच हुआ",
    faceNotMatched: "चेहरा मैच नहीं हुआ। कृपया पुनः प्रयास करें",
    retakeSelfie: "सेल्फी दोबारा लें",
    selectAge: "उम्र चुनें",
    selectGender: "लिंग चुनें",
    male: "पुरुष",
    female: "महिला",
    other: "अन्य",
    next: "आगे",
    verify: "सत्यापित करें",
    aadhaarVerified: "सत्यापित",
    nearbyJobs: "पास की नौकरियां",
    kmAway: "किमी दूर",
    perMonth: "/महीना",
    perDay: "/दिन",
    applyNow: "अभी आवेदन करें",
    companyVerified: "सत्यापित",
    delivery: "डिलीवरी",
    cleaning: "सफाई",
    cooking: "खाना बनाना",
    security: "सुरक्षा",
    construction: "निर्माण",
    retail: "खुदरा",
    applicationSent: "आवेदन सफलतापूर्वक भेजा गया!",
    trackApplication: "आवेदन ट्रैक करें",
    goHome: "घर जाएं",
    profile: "प्रोफ़ाइल",
    skills: "कौशल",
    addSkill: "कौशल जोड़ें",
    listening: "सुन रहे हैं...",
    tapToSpeak: "बोलने के लिए टैप करें",
    voiceSupport: "आवाज़ सहायता उपलब्ध",
    navJobs: "नौकरियां",
    navMessages: "संदेश",
    navSkills: "कौशल",
    navSupport: "सहायता",
    navSettings: "सेटिंग्स",
    selectUserType: "उपयोगकर्ता प्रकार चुनें",
    worker: "कामगार",
    company: "कंपनी",
    workerDescription: "नौकरी और अवसर खोज रहे हैं",
    companyDescription: "कामगार भर्ती और नौकरी पोस्ट करना",
    login: "लॉगिन",
    email: "ईमेल",
    password: "पासवर्ड",
    forgotPassword: "पासवर्ड भूल गए?",
    dontHaveAccount: "खाता नहीं है?",
    alreadyHaveAccount: "पहले से खाता है?",
    companyName: "कंपनी का नाम",
    companySize: "कंपनी का आकार",
    industry: "उद्योग",
    website: "वेबसाइट",
    description: "विवरण",
    dashboard: "डैशबोर्ड",
    postJob: "नौकरी पोस्ट करें",
    viewApplications: "आवेदन देखें",
    manageJobs: "नौकरियां प्रबंधित करें",
    jobTitle: "नौकरी का शीर्षक",
    jobDescription: "नौकरी का विवरण",
    requirements: "आवश्यकताएं",
    salary: "वेतन",
    location: "स्थान",
    workingHours: "काम के घंटे",
    jobType: "नौकरी का प्रकार",
    fullTime: "पूर्णकालिक",
    partTime: "अंशकालिक",
    contract: "अनुबंध",
    messages: "संदेश",
    noMessages: "अभी तक कोई संदेश नहीं",
    typeMessage: "संदेश टाइप करें...",
    send: "भेजें",
    settings: "सेटिंग्स",
    language: "भाषा",
    darkMode: "डार्क मोड",
    pushNotifications: "पुश नोटिफिकेशन",
    emailNotifications: "ईमेल नोटिफिकेशन",
    help: "सहायता",
    faq: "अक्सर पूछे जाने वाले प्रश्न",
    contactSupport: "सहायता से संपर्क करें",
    howToApply: "नौकरी के लिए आवेदन कैसे करें",
    howToPost: "नौकरी कैसे पोस्ट करें",
    notifications: "सूचनाएं",
    totalNotifications: "कुल",
    unreadNotifications: "अपठित",
    interviewScheduled: "साक्षात्कार निर्धारित",
    applicationApproved: "आवेदन स्वीकृत",
    callScheduled: "कॉल निर्धारित",
    newJobMatch: "नई नौकरी मैच",
    interviewTomorrow: "क्विकईट्स में डिलीवरी पार्टनर के लिए आपका साक्षात्कार कल सुबह 10:00 बजे निर्धारित है",
    applicationApprovedMsg: "बधाई हो! क्लीनकॉर्प में ऑफिस क्लीनर के लिए आपका आवेदन स्वीकृत हो गया है। कॉल का इंतजार करें।",
    callTodayMsg: "नियोक्ता आज दोपहर 2:00 बजे - शाम 4:00 बजे के बीच कुक असिस्टेंट पद के लिए आपको कॉल करेगा।",
    newJobMatchMsg: "आपके पास एक नई सिक्यूरिटी गार्ड पोजीशन आपके कौशल और प्राथमिकताओं से मेल खाती है।",
    actionRequired: "कार्य आवश्यक",
    takeAction: "कार्य करें",
    viewDetails: "विवरण देखें",
    noNotifications: "अभी तक कोई सूचना नहीं",
    noNotificationsMsg: "जब आप नौकरियों के लिए आवेदन करेंगे, तो आपको यहां आपके आवेदन, साक्षात्कार और नई नौकरी मैच के बारे में अपडेट मिलेंगे।",
    findJobs: "नौकरियां खोजें",
    actionsRequired: "आवश्यक कार्य",
    itemsNeedAttention: "आइटम जिन पर ध्यान देने की आवश्यकता है",
    review: "समीक्षा करें",
    earnings: "कमाई",
    withdraw: "निकालें",
    bankAccount: "बैंक खाता",
    upiPayment: "UPI भुगतान",
    paymentHistory: "भुगतान इतिहास",
    skillsAndExperience: "कौशल और अनुभव",
    addExperience: "अनुभव जोड़ें",
    yearsOfExperience: "अनुभव के वर्ष",
    certificates: "प्रमाणपत्र",
    uploadCertificate: "प्रमाणपत्र अपलोड करें",

    // Application Status
    applicationStatus: "आवेदन की स्थिति",
    applicationSubmitted: "आवेदन जमा किया गया",
    applicationSubmittedDesc: "आपका आवेदन प्राप्त हो गया है",
    applicationReview: "आवेदन समीक्षा",
    applicationReviewDesc: "नियोक्ता आपका प्रोफाइल देख रहा है",
    interviewScheduling: "साक्षात्कार निर्धारण",
    interviewSchedulingDesc: "साक्षात्कार शेड्यूल की प्रतीक्षा",
    finalDecision: "अंतिम निर्णय",
    finalDecisionDesc: "अंतिम निर्णय की प्रतीक्षा",
    contactRecruiter: "नियोक्ता से संपर्क करें",
    viewFeedback: "प्रतिक्रिया देखें",
    myApplications: "मेरे आवेदन",
    trackApplications: "अपने नौकरी आवेदनों को ट्रैक करें",
    applied: "आवेदन किया",
    noApplicationsYet: "अभी तक कोई आवेदन नहीं",
    startApplying: "नौकरी के लिए आवेदन करना शुरू करें",
    browseJobs: "नौकरियां ब्राउज़ करें",
    completedJobs: "पूर्ण किई गई नौकरियां",
    totalEarnings: "कुल कमाई",
    verifiedProfile: "सत्यापित प्रोफ़ाइल",
    profileSettings: "प्रोफ़ाइल सेटिंग्स",
    rating: "रेटिंग",
    feedback: "प्रतिक्रिया",
    feedbackFrom: "यहाँ से प्रतिक्रिया",
    excellent: "उत्कृष्ट काम! बहुत समय पर और पेशेवर।",
    good: "अच्छी डिलीवरी सेवा। सुरक्षित और समय पर।",
    jobDetails: "नौकरी विवरण",
    applyForJob: "नौकरी के लिए आवेदन करें",
    helpAndSupport: "सहायता और समर्थन",
    weAreHere: "हम आपकी मदद के लिए यहाँ हैं",
    emergencySupport: "आपातकालीन समर्थन",
    roundTheClock: "तत्काल सहायता के लिए चौबीसों घंटे समर्थन",
    reportSafetyConcerns: "सुरक्षा चिंताएं या कार्यस्थल के मुद्दों की रिपोर्ट करें",
    quickActions: "त्वरित कार्य",
    callSupport: "सहायता को कॉल करें",
    chatSupport: "चैट समर्थन",
    frequentlyAskedQuestions: "अक्सर पूछे जाने वाले प्रश्न",
    faqHowToApply: "मैं नौकरी के लिए आवेदन कैसे करूँ?",
    faqAnswer1: "नौकरी के लिए आवेदन करने के लिए, उपलब्ध नौकरियां ब्राउज़ करें, नौकरी चुनें, विवरण देखें, और अभी आवेदन करें पर टैप करें।",
    faqTrackApplications: "मैं अपने आवेदनों को कैसे ट्रैक कर सकता हूँ?",
    faqAnswer2: "आप अपने नौकरी अपडेट को सूचनाओं और संदेशों से ट्रैक कर सकते हैं।",
    faqSkillBadges: "कौशल बैज क्या हैं?",
    faqAnswer3: "कौशल बैज आपकी क्षमताओं का सत्यापन हैं। आप उन्हें कौशल मूल्यांकन पूरा करके अर्जित कर सकते हैं।",
    faqContactEmployers: "मैं नियोक्ताओं से संपर्क कैसे करूँ?",
    faqAnswer4: "नौकरी के लिए आवेदन करने के बाद, चैट सुविधा के माध्यम से नियोक्ताओं से संपर्क करें।",
    pending: "लंबित",
    reviewing: "समीक्षा",
    interview: "साक्षात्कार",
    accepted: "स्वीकृत",
    rejected: "अस्वीकृत",
  },
  ta: {
    appName: "ஜீரோ பேரியர்",
    appTitle: "தடைகள் இல்லாத வேலைகள்",
    tagline: "வேலைகள் எளிதாக்கப்பட்டன",
    logistics: "லாஜிஸ்டிக்ஸ்",
    welcome: "ஜீரோ பேரியருக்கு வரவேற்கிறோம்",
    verifyIdentity: "தொடங்குவதற்கு உங்கள் அடையாளத்தை சரிபார்ப்போம்",
    aadhaar: {
      label: "உங்கள் ஆதார் எண்ணை உள்ளிடவும்",
      placeholder: "XXXX XXXX XXXX",
      verify: "ஆதார் சரிபார்க்கவும்"
    },
    details: {
      title: "சரிபார்க்கப்பட்ட விவரங்கள்",
      name: "பெயர்",
      dob: "பிறந்த தேதி",
      gender: "பாலினம்",
      address: "முகவரி"
    },
    selfie: {
      title: "செல்ஃபி எடுக்கவும்",
      description: "சிறந்த வெளிச்சத்தை உறுதி செய்து நேராக கேமராவை பார்க்கவும்"
    },
    success: {
      title: "சரிபார்ப்பு முடிந்தது!",
      description: "உங்கள் அடையாளம் வெற்றிகரமாக சரிபார்க்கப்பட்டது"
    },
    button: {
      continue: "தொடரவும்",
      start: "உங்கள் பயணத்தை தொடங்குங்கள்"
    },
    chooseLanguage: "உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    voicePrompt: "தயவுசெய்து உங்கள் மொழியைத் தேர்ந்தெடுக்கவும்",
    enterName: "உங்கள் பெயரை உள்ளிடவும்",
    enterAadhaar: "ஆதார் எண்ணை உள்ளிடவும்",
    aadhaarNumber: "ஆதார் எண்",
    sendOtp: "OTP அனுப்பவும்",
    enterOtp: "OTP உள்ளிடவும்",
    verifyOtp: "OTP சரிபார்க்கவும்",
    otpSent: "உங்கள் பதிவு செய்யப்பட்ட மொபைலுக்கு OTP அனுப்பப்பட்டது",
    otpVerified: "OTP வெற்றிகரமாக சரிபார்க்கப்பட்டது",
    uploadAadhaar: "ஆதார் புகைப்படத்தை பதிவேற்றவும்",
    takeSelfie: "செல்ஃபி எடுக்கவும்",
    faceVerification: "முக சரிபார்ப்பு",
    faceMatched: "முகம் வெற்றிகரமாக பொருந்தியது",
    faceNotMatched: "முகம் பொருந்தவில்லை. மீண்டும் முயற்சிக்கவும்",
    retakeSelfie: "செல்ஃபி மீண்டும் எடுக்கவும்",
    selectAge: "வயதைத் தேர்ந்தெடுக்கவும்",
    selectGender: "பாலினத்தைத் தேர்ந்தெடுக்கவும்",
    male: "ஆண்",
    female: "பெண்",
    other: "மற்றவை",
    next: "அடுத்து",
    verify: "சரிபார்க்கவும்",
    aadhaarVerified: "சரிபார்க்கப்பட்டது",
    nearbyJobs: "அருகிலுள்ள வேலைகள்",
    kmAway: "கி.மீ தொலைவில்",
    perMonth: "/மாதம்",
    perDay: "/நாள்",
    applyNow: "இப்போது விண்ணப்பிக்கவும்",
    companyVerified: "சரிபார்க்கப்பட்டது",
    delivery: "விநியோகம்",
    cleaning: "சுத்தம்",
    cooking: "சமையல்",
    security: "பாதுகாப்பு",
    construction: "கட்டுமானம்",
    retail: "சில்லறை",
    applicationSent: "விண்ணப்பம் வெற்றிகரமாக அனுப்பப்பட்டது!",
    trackApplication: "விண்ணப்பத்தைக் கண்காணிக்கவும்",
    goHome: "வீட்டிற்குச் செல்லவும்",
    profile: "சுயவிவரம்",
    skills: "திறன்கள்",
    addSkill: "திறன் சேர்க்கவும்",
    listening: "கேட்டுக்கொண்டிருக்கிறது...",
    tapToSpeak: "பேச தட்டவும்",
    voiceSupport: "குரல் ஆதரவு கிடைக்கிறது",
    navJobs: "வேலைகள்",
    navMessages: "செய்திகள்",
    navSkills: "திறன்கள்",
    navSupport: "உதவி",
    navSettings: "அமைப்புகள்",
    selectUserType: "பயனர் வகையைத் தேர்ந்தெடுக்கவும்",
    worker: "தொழிலாளி",
    company: "நிறுவனம்",
    workerDescription: "வேலைகள் மற்றும் வாய்ப்புகளைத் தேடுகிறது",
    companyDescription: "தொழிலாளர்களை பணியமர்த்துதல் மற்றும் வேலைகளை இடுகை செய்தல்",
    login: "உள்நுழைவு",
    email: "மின்னஞ்சல்",
    password: "கடவுச்சொல்",
    forgotPassword: "கடவுச்சொல்லை மறந்துவிட்டீர்களா?",
    dontHaveAccount: "கணக்கு இல்லையா?",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா?",
    companyName: "நிறுவனத்தின் பெயர்",
    companySize: "நிறுவன அளவு",
    industry: "தொழில்துறை",
    website: "வலைத்தளம்",
    description: "விளக்கம்",
    dashboard: "டாஷ்போர்டு",
    postJob: "வேலை இடுகை செய்யவும்",
    viewApplications: "விண்ணப்பங்களைப் பார்க்கவும்",
    manageJobs: "வேலைகளை நிர்வகிக்கவும்",
    jobTitle: "வேலை தலைப்பு",
    jobDescription: "வேலை விளக்கம்",
    requirements: "தேவைகள்",
    salary: "சம்பளம்",
    location: "இடம்",
    workingHours: "வேலை நேரம்",
    jobType: "வேலை வகை",
    fullTime: "முழு நேரம்",
    partTime: "பகுதி நேரம்",
    contract: "ஒப்பந்தம்",
    messages: "செய்திகள்",
    noMessages: "இன்னும் செய்திகள் இல்லை",
    typeMessage: "செய்தி தட்டச்சு செய்யவும்...",
    send: "அனுப்பவும்",
    settings: "அமைப்புகள்",
    language: "மொழி",
    darkMode: "இருண்ட பயன்முறை",
    pushNotifications: "புஷ் அறிவிப்புகள்",
    emailNotifications: "மின்னஞ்சல் அறிவிப்புகள்",
    help: "உதவி",
    faq: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    contactSupport: "ஆதரவைத் தொடர்பு கொள்ளவும்",
    howToApply: "வேலைகளுக்கு எப்படி விண்ணப்பிப்பது",
    howToPost: "வேலைகளை எப்படி இடுகை செய்வது",
    notifications: "அறிவிப்புகள்",
    totalNotifications: "மொத்தம்",
    unreadNotifications: "படிக்காதவை",
    interviewScheduled: "நேர்காணல் திட்டமிடப்பட்டது",
    applicationApproved: "விண்ணப்பம் அங்கீகரிக்கப்பட்டது",
    callScheduled: "அழைப்பு திட்டமிடப்பட்டது",
    newJobMatch: "புதிய வேலை பொருத்தம்",
    interviewTomorrow: "QuickEats இல் டெலிவரி பார்ட்னர் பணிக்கான உங்கள் நேர்காணல் நாளை காலை 10:00 மணிக்கு திட்டமிடப்பட்டுள்ளது",
    applicationApprovedMsg: "நல்ல செய்தி! CleanCorp இல் அலுவலக சுத்தம் செய்பவர் பணிக்கான உங்கள் விண்ணப்பம் அங்கீகரிக்கப்பட்டுள்ளது. அழைப்புக்காக காத்திருக்கவும்.",
    callTodayMsg: "நியமிக்கும் நிறுவனம் இன்று மாலை 2:00 - 4:00 மணி வரை சமையல் உதவியாளர் பணிக்காக உங்களை அழைக்கும்.",
    newJobMatchMsg: "உங்கள் அருகில் ஒரு புதிய பாதுகாப்பு காவலர் பணி உங்கள் திறன்கள் மற்றும் விருப்பங்களுக்கு பொருந்துகிறது.",
    actionRequired: "நடவடிக்கை தேவை",
    takeAction: "நடவடிக்கை எடுக்கவும்",
    viewDetails: "விவரங்களைப் பார்க்கவும்",
    noNotifications: "இன்னும் அறிவிப்புகள் இல்லை",
    noNotificationsMsg: "நீங்கள் வேலைகளுக்கு விண்ணப்பிக்கும்போது, உங்கள் விண்ணப்பங்கள், நேர்காணல்கள் மற்றும் புதிய வேலை பொருத்தங்கள் பற்றிய புதுப்பிப்புகளை இங்கே பெறுவீர்கள்.",
    findJobs: "வேலைகளைக் கண்டறியவும்",
    actionsRequired: "தேவையான நடவடிக்கைகள்",
    itemsNeedAttention: "கவனம் தேவைப்படும் பொருட்கள்",
    review: "மதிப்பாய்வு",
    earnings: "வருமானம்",
    withdraw: "பணம் எடுக்கவும்",
    bankAccount: "வங்கி கணக்கு",
    upiPayment: "UPI பணம்",
    paymentHistory: "பணம் செலுத்தும் வரலாறு",
    skillsAndExperience: "திறன்கள் மற்றும் அனுபவம்",
    addExperience: "அனுபவம் சேர்க்கவும்",
    yearsOfExperience: "அனுபவ ஆண்டுகள்",
    certificates: "சான்றிதழ்கள்",
    uploadCertificate: "சான்றிதழ் பதிவேற்றவும்",

    // Application Status
    applicationStatus: "விண்ணப்ப நிலை",
    applicationSubmitted: "விண்ணப்பம் சமர்ப்பிக்கப்பட்டது",
    applicationSubmittedDesc: "உங்கள் விண்ணப்பம் பெறப்பட்டது",
    applicationReview: "விண்ணப்ப மதிப்பாய்வு",
    applicationReviewDesc: "நியமனம் செய்பவர் உங்கள் சுயவிவரத்தை மதிப்பாய்வு செய்கிறார்",
    interviewScheduling: "நேர்காணல் திட்டமிடல்",
    interviewSchedulingDesc: "நேர்காணல் அட்டவணைக்காக காத்திருக்கிறது",
    finalDecision: "இறுதி முடிவு",
    finalDecisionDesc: "இறுதி முடிவுக்காக காத்திருக்கிறது",
    contactRecruiter: "நியமனம் செய்பவரை தொடர்பு கொள்ளவும்",
    viewFeedback: "கருத்துகளைப் பார்க்கவும்",
    myApplications: "எனது விண்ணப்பங்கள்",
    trackApplications: "உங்கள் வேலை விண்ணப்பங்களைக் கண்காணிக்கவும்",
    applied: "விண்ணப்பிக்கப்பட்டது",
    noApplicationsYet: "இன்னும் விண்ணப்பங்கள் இல்லை",
    startApplying: "வேலைகளுக்கு விண்ணப்பிக்கத் தொடங்குங்கள்",
    browseJobs: "வேலைகளை ব்রাউজ் செய்யவும்",
    completedJobs: "முடிந்த வேலைகள்",
    totalEarnings: "மொத்த வருமானம்",
    verifiedProfile: "சரிபார்க்கப்பட்ட சுயவிவரம்",
    profileSettings: "சுயவிவர அமைப்புகள்",
    rating: "மதிப்பீடு",
    feedback: "கருத்து",
    feedbackFrom: "இதிலிருந்து கருத்து",
    excellent: "சிறந்த வேலை! மிக நேரமான மற்றும் தொழிலாதாரமான.",
    good: "நல்ல வழங்கல் சேவை. பொருட்கள் பாதுகாப்பாகவும் சரியான நேரத்தில் வழங்கப்பட்டன.",
    jobDetails: "வேலை விவரங்கள்",
    applyForJob: "வேலைக்கு விண்ணப்பிக்கவும்",
    helpAndSupport: "உதவி மற்றும் ஆதரவு",
    weAreHere: "நாங்கள் உங்களுக்கு உதவ இங்கே இருக்கிறோம்",
    emergencySupport: "அவசரகால ஆதரவு",
    roundTheClock: "அவசரகால உதவிக்கான 24 மணி ஆதரவு",
    reportSafetyConcerns: "பாதுகாப்பு கவலைகள் அல்லது பணிச்சூழல் சிக்கல்களைப் புகாரளிக்கவும்",
    quickActions: "விரைவான நடவடிக்கைகள்",
    callSupport: "ஆதரவை அழைக்கவும்",
    chatSupport: "சேட் ஆதரவு",
    frequentlyAskedQuestions: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faqHowToApply: "வேலைக்கு எப்படி விண்ணப்பிப்பது?",
    faqAnswer1: "வேலைக்கு விண்ணப்பிக்க, கிடைக்கும் வேலைகளைப் பார்க்கவும், வேலையைத் தேர்ந்தெடுக்கவும், விவரங்களை மதிப்பாய்வு செய்யவும், இப்போது விண்ணப்பிக்கவும் என்பதை தட்டவும்.",
    faqTrackApplications: "நான் என் விண்ணப்பங்களைக் கண்காணிக்க முடியுமா?",
    faqAnswer2: "அறிவிப்புகள் மற்றும் செய்திகளில் இருந்து உங்கள் வேலை புதுப்பிப்புகளைக் கண்காணிக்க முடியும்.",
    faqSkillBadges: "திறன் பூண்கள் என்றால் என்ன?",
    faqAnswer3: "திறன் பூண்கள் உங்கள் திறன்களின் சரிபார்ப்பு. திறன் மதிப்பீடுகளை நிறைவு செய்வதன் மூலம் அவற்றைப் பெறலாம்.",
    faqContactEmployers: "நான் பணியமர்த்துபவர்களைத் தொடர்பு கொள்ள முடியுமா?",
    faqAnswer4: "வேலைக்கு விண்ணப்பித்த பின், சேட் சாத்தியங்கள் மூலம் பணியமர்த்துபவர்களைத் தொடர்பு கொள்ளவும்.",
    pending: "நிலுவையில் உள்ளது",
    reviewing: "மதிப்பாய்வு செய்தல்",
    interview: "நேர்காணல்",
    accepted: "ஏற்றுக்கொள்ளப்பட்டது",
    rejected: "நிராகரிக்கப்பட்டது",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('zeroBarrierLanguage');
    return (saved as Language) || 'ta';
  });

  useEffect(() => {
    localStorage.setItem('zeroBarrierLanguage', language);
    document.documentElement.lang = language;
    
    // Set RTL for Arabic/Urdu if needed in future
    const isRTL = false; // Currently all supported languages are LTR
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: translations[language],
    isRTL: false,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};