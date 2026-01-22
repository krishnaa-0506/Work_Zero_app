import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "@/contexts/LanguageContext";

import SplashScreen from "./pages/SplashScreen";
import LanguageSelection from "./pages/LanguageSelection";
import UserTypeSelection from "./pages/UserTypeSelection";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Home from "./pages/Home";
import JobDetails from "./pages/JobDetails";
import ApplicationConfirmation from "./pages/ApplicationConfirmation";
import Profile from "./pages/Profile";
import Notifications from "./pages/Notifications";
import Messages from "./pages/Messages";
import Skills from "./pages/Skills";
import MyApplications from "./pages/MyApplications";
import Support from "./pages/Support";
import Verification from "./pages/Verification";
import Payment from "./pages/Payment";
import Feedback from "./pages/Feedback";
import Settings from "./pages/Settings";
import ApplicationStatus from "./pages/ApplicationStatus";
import Help from "./pages/Help";
import NotFound from "./pages/NotFound";
import DigitalVerification from "./pages/DigitalVerification";
import VerificationDemo from "./pages/VerificationDemo";
import AddNewSkill from "./pages/AddNewSkill";
import ChatSupport from "./pages/ChatSupport";
import CallSupport from "./pages/CallSupport";
import MainLayout from "@/components/layout/MainLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <LanguageProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<SplashScreen />} />
            <Route path="/language" element={<LanguageSelection />} />
            <Route path="/user-type" element={<UserTypeSelection />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verification-demo" element={<VerificationDemo />} />

            {/* Main Routes with shared layout */}
            <Route element={<MainLayout />}>
              <Route path="/digital-verification" element={<DigitalVerification />} />
              <Route path="/home" element={<Home />} />
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="/application-sent" element={<ApplicationConfirmation />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/skills/add" element={<AddNewSkill />} />
              <Route path="/applications" element={<MyApplications />} />
              <Route path="/support" element={<Support />} />
              <Route path="/support/chat" element={<ChatSupport />} />
              <Route path="/support/call" element={<CallSupport />} />
              <Route path="/verification" element={<Verification />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/feedback" element={<Feedback />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/help" element={<Help />} />
              <Route path="/application-status" element={<ApplicationStatus />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </LanguageProvider>
  </QueryClientProvider>
);

export default App;
