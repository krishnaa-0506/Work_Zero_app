import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { HomeIcon, MessageSquare, Award, HelpCircle, Settings, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  match?: (path: string) => boolean;
}

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useLanguage();

  const navItems: NavItem[] = useMemo(
    () => [
      {
        label: t.navJobs,
        href: "/home",
        icon: HomeIcon,
      },
      {
        label: t.navMessages,
        href: "/messages",
        icon: MessageSquare,
      },
      {
        label: t.navSkills,
        href: "/skills",
        icon: Award,
      },
      {
        label: t.navSupport,
        href: "/support",
        icon: HelpCircle,
      },
      {
        label: t.navSettings,
        href: "/settings",
        icon: Settings,
      },
    ],
    [t]
  );

  const getIsActive = (item: NavItem) => {
    if (item.match) return item.match(location.pathname);
    return location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t shadow-lg shadow-black/5">
      <div className="mx-auto max-w-3xl grid grid-cols-5 gap-1 px-2 py-2">
        {navItems.map((item) => {
          const active = getIsActive(item);
          const Icon = item.icon;
          return (
            <Button
              key={item.href}
              variant="ghost"
              className={cn(
                "flex flex-col items-center justify-center h-14 rounded-xl transition-colors",
                active ? "text-blue-600 bg-blue-50" : "text-muted-foreground"
              )}
              onClick={() => navigate(item.href)}
              aria-label={item.label}
            >
              <Icon
                className={cn(
                  "h-5 w-5 mb-1",
                  active ? "text-blue-600" : "text-muted-foreground"
                )}
              />
              <span className="text-[11px] leading-none font-semibold tracking-tight">
                {item.label}
              </span>
            </Button>
          );
        })}
      </div>
    </nav>
  );
};
