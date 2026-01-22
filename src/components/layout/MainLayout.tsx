import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomNav } from "@/components/ui/bottom-nav";
import { VoiceToggle } from "@/components/ui/voice-toggle";
import { TTSControls } from "@/components/TTSControls";
import { usePageNarration } from "@/hooks/usePageNarration";
import { useLanguage } from "@/contexts/LanguageContext";

const NARRATION_STORAGE_KEY = "zeroBarrierVoiceEnabled";

const getNarrationForPath = (path: string, t: ReturnType<typeof useLanguage>["t"]) => {
  const narrations: { match: (p: string) => boolean; text: string }[] = [
    { 
      match: (p: string) => p === "/home", 
      text: `🏠 ${t.appName}. 🚀 ${t.nearbyJobs}. 🎤 ${t.voiceSupport}. ✨ ${t.applyNow} to explore opportunities.`
    },
    { 
      match: (p: string) => p === "/messages", 
      text: `💬 ${t.navMessages}. 📱 ${t.messages}. Chat with employers and workers directly.`
    },
    { 
      match: (p: string) => p === "/skills", 
      text: `🏆 ${t.navSkills}. 💪 ${t.skillsAndExperience}. Track your professional skills and badges.`
    },
    { 
      match: (p: string) => p === "/support", 
      text: `🆘 ${t.helpAndSupport}. 👋 ${t.weAreHere}. Get assistance through chat or call support.`
    },
    { 
      match: (p: string) => p === "/settings", 
      text: `⚙️ ${t.navSettings}. 🔧 Customize your preferences and language settings.`
    },
    { 
      match: (p: string) => p === "/notifications", 
      text: `🔔 ${t.notifications}. 📋 Check your application updates, interviews, and job matches.`
    },
    { 
      match: (p: string) => p === "/profile", 
      text: `👤 ${t.profile}. ✅ ${t.profileSettings}. View your verified profile and earned badges.`
    },
    { 
      match: (p: string) => p.startsWith("/job"), 
      text: `💼 ${t.jobDetails}. 🔍 Browse opportunities and ${t.applyNow}.`
    },
    { 
      match: (p: string) => p === "/applications", 
      text: `📊 ${t.myApplications}. 📈 ${t.trackApplications}. Check your application statuses.`
    },
    { 
      match: (p: string) => p.startsWith("/application-status"), 
      text: `📋 ${t.applicationStatus}. 👀 Follow your application through each stage.`
    },
    { 
      match: (p: string) => p === "/payment", 
      text: `💰 ${t.paymentHistory}. 💳 Manage your earnings and withdraw money.`
    },
    { 
      match: (p: string) => p.startsWith("/verification"), 
      text: `✅ ${t.verifyIdentity}. 🔐 Complete your profile verification.`
    },
  ];

  const entry = narrations.find((e) => e.match(path));
  return entry ? entry.text : `📱 ${t.appName}. 🎤 ${t.voiceSupport}.`;
};

const getTitleForPath = (path: string, t: ReturnType<typeof useLanguage>["t"]) => {
  const titles = [
    { match: (p: string) => p.startsWith("/home"), text: `${t.navJobs} | ${t.appName}` },
    { match: (p: string) => p.startsWith("/messages"), text: `${t.navMessages} | ${t.appName}` },
    { match: (p: string) => p.startsWith("/skills"), text: `${t.navSkills} | ${t.appName}` },
    { match: (p: string) => p.startsWith("/support"), text: `${t.navSupport} | ${t.appName}` },
    { match: (p: string) => p.startsWith("/settings"), text: `${t.navSettings} | ${t.appName}` },
  ];

  const entry = titles.find((e) => e.match(path));
  return entry ? entry.text : t.appName;
};

export const MainLayout = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { readPageContent, stop, isSupported } = usePageNarration({
    enabled: true,
    autoRead: false
  });
  const [voiceEnabled, setVoiceEnabled] = useState<boolean>(() => {
    const stored = localStorage.getItem(NARRATION_STORAGE_KEY);
    return stored ? stored === "true" : true;
  });

  useEffect(() => {
    localStorage.setItem(NARRATION_STORAGE_KEY, String(voiceEnabled));
  }, [voiceEnabled]);

  useEffect(() => {
    document.title = getTitleForPath(location.pathname, t);
  }, [location.pathname, t]);

  useEffect(() => {
    if (!voiceEnabled || !isSupported) return;

    const narration = getNarrationForPath(location.pathname, t);
    const pageTitle = getTitleForPath(location.pathname, t);
    
    const timeout = setTimeout(() => {
      stop();
      readPageContent(pageTitle, narration);
    }, 250);

    return () => {
      clearTimeout(timeout);
      stop();
    };
  }, [location.pathname, readPageContent, stop, t, voiceEnabled, isSupported]);

  const handleToggleVoice = () => {
    setVoiceEnabled((prev) => {
      const next = !prev;
      if (!next) {
        stop();
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-24 bg-background">
      {/* TTS Controls - Fixed position for accessibility */}
      <div className="fixed top-4 right-4 z-50">
        <TTSControls />
      </div>
      
      <main>
        <Outlet />
      </main>
      
      <VoiceToggle enabled={voiceEnabled} onToggle={handleToggleVoice} isSupported={isSupported} />
      <BottomNav />
    </div>
  );
};

export default MainLayout;
