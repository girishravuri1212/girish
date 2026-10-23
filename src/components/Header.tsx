import React from 'react';
import { 
  Wifi, 
  WifiOff, 
  Menu,
  ChevronRight
} from 'lucide-react';
import { Role, UserProfile, SystemConfig } from '../types/fln';
import { MOCK_USERS } from '../data/mockData';
import { APGovtLogo } from './APGovtLogo';

interface HeaderProps {
  currentTab: string;
  currentUser: UserProfile;
  setCurrentUser: (user: UserProfile) => void;
  isOnline: boolean;
  setIsOnline: (online: boolean) => void;
  syncQueueCount: number;
  config: SystemConfig;
  onResetMonth: (newMonth: string) => void;
  onOpenMobileMenu: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  currentUser,
  setCurrentUser,
  isOnline,
  setIsOnline,
  syncQueueCount,
  config,
  onResetMonth,
  onOpenMobileMenu,
}) => {
  const roles: Role[] = ['STATE_LEADERSHIP', 'DEO', 'DY_DEO', 'MEO', 'CRP', 'HEADMASTER', 'TEACHER', 'ADMIN'];

  const tabTitles: Record<string, string> = {
    dashboard: 'State Dashboard',
    tour_diary: 'Tour Diary & School Inspections',
    assessment: 'FLN Diagnostic Engine',
    actions: 'Follow-ups & Remediation Tracker',
    reports: 'Reports & Data Exports',
    admin: 'Rule & Parameter Configuration',
    blueprint: 'PRD & Architecture Specification',
  };

  return (
    <header className="bg-emerald-900 text-white border-b border-emerald-950 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex items-center justify-between h-14 gap-3">
          
          {/* Zone 1: Brand & Mobile Menu Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Mobile Drawer Trigger */}
            <button
              onClick={onOpenMobileMenu}
              className="lg:hidden p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-800 transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Official AP Govt Logo */}
            <APGovtLogo size="md" />

            <div>
              <div className="font-bold text-xs sm:text-sm text-white tracking-tight flex items-center gap-1.5">
                <span>AP School Education Department</span>
              </div>
              <div className="text-[10px] text-emerald-300 font-medium hidden sm:block">
                FLN Monitoring System · Govt of Andhra Pradesh
              </div>
            </div>
          </div>

          {/* Zone 2: Contextual Breadcrumb Indicator (Desktop) */}
          <div className="hidden md:flex items-center gap-1.5 text-xs text-emerald-200/90 font-medium">
            <span className="text-emerald-400">Portal</span>
            <ChevronRight className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-white font-semibold truncate max-w-[240px]">
              {tabTitles[currentTab] || 'State Dashboard'}
            </span>
          </div>

          {/* Zone 3: Essential Controls (Month, Offline status, Role) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* Active Month Selector */}
            <div className="flex items-center gap-1 bg-emerald-800/90 px-2 py-1 rounded-lg border border-emerald-700/80 text-xs">
              <span className="hidden sm:inline text-emerald-300 text-[11px]">Month:</span>
              <select
                value={config.currentMonthYear}
                onChange={(e) => onResetMonth(e.target.value)}
                className="bg-transparent text-white font-semibold text-xs focus:outline-none cursor-pointer"
                title="Active Academic Cycle Month"
              >
                <option value="2026-07" className="text-slate-900">July 2026</option>
                <option value="2026-08" className="text-slate-900">August 2026</option>
                <option value="2026-09" className="text-slate-900">September 2026</option>
              </select>
            </div>

            {/* Offline / Online Indicator */}
            <button
              onClick={() => setIsOnline(!isOnline)}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                isOnline 
                  ? 'bg-emerald-800/80 text-emerald-200 hover:bg-emerald-700/80 border border-emerald-700/80' 
                  : 'bg-amber-500 text-slate-950 shadow-xs'
              }`}
              title={isOnline ? 'Online (Connected to VSK Cloud)' : 'Offline Mode (Local Storage)'}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isOnline ? 'Online' : 'Offline'}</span>
              {syncQueueCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-950 px-1 rounded-full font-bold text-[10px]">
                  {syncQueueCount}
                </span>
              )}
            </button>

            {/* Role Switcher */}
            <div className="flex items-center gap-1 bg-slate-950/60 px-2 py-1 rounded-lg border border-emerald-700/60 text-xs">
              <span className="hidden sm:inline text-slate-300 text-[11px]">Role:</span>
              <select
                value={currentUser.role}
                onChange={(e) => {
                  const selectedRole = e.target.value as Role;
                  if (MOCK_USERS[selectedRole]) {
                    setCurrentUser(MOCK_USERS[selectedRole]);
                  }
                }}
                className="bg-transparent text-amber-300 font-bold text-xs focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
                title="Switch persona to test role-based access"
              >
                {roles.map(r => (
                  <option key={r} value={r} className="text-slate-900 font-normal">
                    {r.replace('_', ' ')}: {MOCK_USERS[r]?.name.split(',')[0]}
                  </option>
                ))}
              </select>
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
