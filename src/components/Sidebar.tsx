import React from 'react';
import { 
  Building2, 
  Smartphone, 
  CalendarDays, 
  ClipboardCheck, 
  AlertCircle, 
  FileSpreadsheet, 
  Settings, 
  BookOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Target
} from 'lucide-react';
import { UserProfile } from '../types/fln';
import { APGovtLogo } from './APGovtLogo';

interface NavItem {
  id: string;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  section: 'OPERATIONS' | 'MANAGEMENT' | 'SYSTEM';
  badge?: string | number;
}

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  currentUser: UserProfile;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  actionCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  isCollapsed,
  setIsCollapsed,
  mobileOpen,
  setMobileOpen,
  actionCount,
}) => {
  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'State Dashboard',
      shortLabel: 'Dashboard',
      icon: Building2,
      section: 'OPERATIONS',
    },
    {
      id: 'tour_diary',
      label: 'Tour Diary & Inspections',
      shortLabel: 'Tour Diary',
      icon: CalendarDays,
      section: 'OPERATIONS',
      badge: 'Visits',
    },
    {
      id: 'assessment',
      label: 'Assessment Engine',
      shortLabel: 'Assess',
      icon: ClipboardCheck,
      section: 'OPERATIONS',
    },
    {
      id: 'actions',
      label: 'Follow-ups & Actions',
      shortLabel: 'Actions',
      icon: AlertCircle,
      section: 'MANAGEMENT',
      badge: actionCount > 0 ? actionCount : undefined,
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      shortLabel: 'Reports',
      icon: FileSpreadsheet,
      section: 'MANAGEMENT',
    },
    {
      id: 'admin',
      label: 'Admin Configuration',
      shortLabel: 'Config',
      icon: Settings,
      section: 'SYSTEM',
    },
    {
      id: 'blueprint',
      label: 'PRD & Architecture',
      shortLabel: 'Blueprint',
      icon: BookOpen,
      section: 'SYSTEM',
    },
  ];

  const handleSelectTab = (tabId: string) => {
    setCurrentTab(tabId);
    setMobileOpen(false);
  };

  const sections: ('OPERATIONS' | 'MANAGEMENT' | 'SYSTEM')[] = ['OPERATIONS', 'MANAGEMENT', 'SYSTEM'];
  const sectionTitles: Record<'OPERATIONS' | 'MANAGEMENT' | 'SYSTEM', string> = {
    OPERATIONS: 'Field Monitoring',
    MANAGEMENT: 'Analysis & Actions',
    SYSTEM: 'Settings & Blueprint',
  };

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-[57px] left-0 z-50 lg:z-30 h-screen lg:h-[calc(100vh-57px)] bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 ease-in-out shrink-0 ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-[72px]' : 'lg:w-64'}`}
      >
        {/* Mobile Sidebar Header */}
        <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2.5">
            <APGovtLogo size="sm" />
            <div className="text-xs font-bold text-white tracking-tight">
              AP School Education
            </div>
          </div>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1 text-slate-400 hover:text-white rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Content Area */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-700">
          {sections.map((sec) => {
            const items = navItems.filter((item) => item.section === sec);
            return (
              <div key={sec} className="space-y-1">
                {/* Section Header (Hidden when collapsed on desktop) */}
                <div
                  className={`px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-opacity ${
                    isCollapsed ? 'lg:hidden' : 'block'
                  }`}
                >
                  {sectionTitles[sec]}
                </div>

                <div className="space-y-1">
                  {items.map((item) => {
                    const Icon = item.icon;
                    const isActive = currentTab === item.id;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelectTab(item.id)}
                        title={isCollapsed ? item.label : undefined}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                          isActive
                            ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        } ${isCollapsed ? 'lg:justify-center lg:px-2' : ''}`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 transition-colors ${
                            isActive
                              ? 'text-white'
                              : 'text-slate-400 group-hover:text-emerald-400'
                          }`}
                        />

                        {/* Label */}
                        <span
                          className={`truncate text-left transition-opacity ${
                            isCollapsed ? 'lg:hidden' : 'inline'
                          }`}
                        >
                          {item.label}
                        </span>

                        {/* Badge */}
                        {item.badge && (
                          <span
                            className={`ml-auto text-[10px] px-1.5 py-0.2 rounded-full font-bold tabular-nums ${
                              isActive
                                ? 'bg-white text-emerald-800'
                                : 'bg-slate-800 text-amber-300 border border-slate-700'
                            } ${isCollapsed ? 'lg:hidden' : 'inline-block'}`}
                          >
                            {item.badge}
                          </span>
                        )}

                        {/* Hover Tooltip when collapsed */}
                        {isCollapsed && (
                          <div className="hidden lg:group-hover:flex absolute left-full ml-2 px-2.5 py-1 bg-slate-950 text-white text-[11px] font-semibold rounded-md shadow-lg whitespace-nowrap z-50 border border-slate-800 pointer-events-none items-center gap-1.5">
                            <span>{item.label}</span>
                            {item.badge && (
                              <span className="text-[9px] bg-amber-400 text-slate-900 px-1 rounded-sm font-bold">
                                {item.badge}
                              </span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* User Card at bottom of sidebar */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60">
          <div
            className={`flex items-center gap-2.5 ${
              isCollapsed ? 'lg:justify-center' : ''
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-800/80 border border-emerald-600/50 flex items-center justify-center text-white text-xs font-bold shrink-0">
              {currentUser.name.charAt(0)}
            </div>
            <div className={`truncate ${isCollapsed ? 'lg:hidden' : 'block'}`}>
              <div className="text-xs font-bold text-white truncate">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1">
                <span>{currentUser.designation.split(',')[0]}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Collapse / Expand Toggle Button (Desktop only) */}
        <div className="hidden lg:flex items-center justify-between p-2 border-t border-slate-800/80 bg-slate-950">
          {!isCollapsed && (
            <span className="text-[10px] text-slate-400 font-medium px-2">
              Minimize Navigation
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors mx-auto"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>
    </>
  );
};
