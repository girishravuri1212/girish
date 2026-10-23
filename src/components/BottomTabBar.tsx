import React from 'react';
import { 
  Building2, 
  CalendarDays, 
  AlertCircle, 
  FileSpreadsheet,
  Menu
} from 'lucide-react';

interface BottomTabBarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
  actionCount: number;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenMobileMenu,
  actionCount,
}) => {
  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Building2,
    },
    {
      id: 'tour_diary',
      label: 'Tour Diary',
      icon: CalendarDays,
    },
    {
      id: 'actions',
      label: 'Actions',
      icon: AlertCircle,
      badge: actionCount > 0 ? actionCount : undefined,
    },
    {
      id: 'reports',
      label: 'Reports',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <nav
      aria-label="Mobile bottom navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1 shadow-lg safe-area-bottom"
    >
      <div className="flex items-center justify-around h-14 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all relative ${
                isActive
                  ? 'text-emerald-700 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    isActive ? 'scale-110 text-emerald-700' : 'text-slate-500'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2 bg-amber-500 text-slate-900 text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-white">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
              )}
            </button>
          );
        })}

        {/* More Menu button to open remaining tools (Reports, Config, Blueprint) */}
        <button
          onClick={onOpenMobileMenu}
          className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all ${
            ['assessment', 'reports', 'admin', 'blueprint'].includes(currentTab)
              ? 'text-emerald-700 font-bold'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-0.5 whitespace-nowrap">
            More
          </span>
          {['assessment', 'reports', 'admin', 'blueprint'].includes(currentTab) && (
            <span className="w-1 h-1 rounded-full bg-emerald-600 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};
