import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { BottomTabBar } from './components/BottomTabBar';
import { StateDashboard } from './components/StateDashboard';
import { FieldAppSimulator } from './components/FieldAppSimulator';
import { TourDiaryView } from './components/TourDiaryView';
import { ActionTrackerView } from './components/ActionTrackerView';
import { ReportsView } from './components/ReportsView';
import { AdminConfigView } from './components/AdminConfigView';
import { BlueprintView } from './components/BlueprintView';
import { AssessmentStudioView } from './components/AssessmentStudioView';

import { 
  UserProfile, 
  SystemConfig, 
  MonthlyAssessmentStatus, 
  AssessmentRecord, 
  ActionItem, 
  ActionStatus, 
  School,
  PerformanceBand
} from './types/fln';
import { 
  INITIAL_CONFIG, 
  MOCK_USERS, 
  INITIAL_MONTHLY_STATUS, 
  INITIAL_ASSESSMENT_RECORDS, 
  INITIAL_ACTION_ITEMS,
  SCHOOLS_DATA
} from './data/mockData';

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [currentUser, setCurrentUser] = useState<UserProfile>(MOCK_USERS['STATE_LEADERSHIP']);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [syncQueue, setSyncQueue] = useState<{ id: string; type: string; data: any; timestamp: string }[]>([]);

  // Sidebar & Navigation states
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState<boolean>(false);

  // System Configuration state
  const [config, setConfig] = useState<SystemConfig>(INITIAL_CONFIG);

  // Active School for Field Inspection from Tour Diary
  const [activeInspectionSchool, setActiveInspectionSchool] = useState<School | null>(null);

  // Core Data States
  const [monthlyStatusList, setMonthlyStatusList] = useState<MonthlyAssessmentStatus[]>(INITIAL_MONTHLY_STATUS);
  const [assessmentRecords, setAssessmentRecords] = useState<AssessmentRecord[]>(INITIAL_ASSESSMENT_RECORDS);
  const [actionItems, setActionItems] = useState<ActionItem[]>(INITIAL_ACTION_ITEMS);

  // Count active pending action items
  const pendingActionsCount = actionItems.filter(a => a.status === 'OPEN' || a.status === 'IN_PROGRESS').length;

  // Queue an action when offline
  const handleQueueOfflineAction = (type: string, data: any) => {
    const queueItem = {
      id: `SYNC_${Date.now()}`,
      type,
      data,
      timestamp: new Date().toISOString(),
    };
    setSyncQueue(prev => [...prev, queueItem]);
  };

  // Online transition: sync queued items
  const handleToggleOnline = (online: boolean) => {
    setIsOnline(online);
    if (online && syncQueue.length > 0) {
      alert(`Network connection verified. ${syncQueue.length} queued offline assessment/inspection logs synchronized with State VSK Database.`);
      setSyncQueue([]);
    }
  };

  // Monthly Reset Handler (e.g. August 2026 Reset)
  const handleResetMonth = (newMonth: string) => {
    setConfig(prev => ({ ...prev, currentMonthYear: newMonth }));

    // Reset isAssessedThisMonth to false for all students for the new month,
    // while preserving historical logs
    setMonthlyStatusList(prev => prev.map(item => ({
      ...item,
      monthYear: newMonth,
      isAssessedThisMonth: false,
    })));
  };

  // Update Action Status
  const handleUpdateActionStatus = (id: string, status: ActionStatus, remarks?: string) => {
    setActionItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status,
          resolutionRemarks: remarks || item.resolutionRemarks,
        };
      }
      return item;
    }));
  };

  // Add Action Item
  const handleAddActionItem = (newItem: ActionItem) => {
    setActionItems(prev => [newItem, ...prev]);
  };

  // Add Assessment Records
  const handleAddAssessmentRecords = (records: AssessmentRecord[]) => {
    setAssessmentRecords(prev => [...records, ...prev]);
  };

  // Update Monthly Status
  const handleUpdateMonthlyStatus = (updatedList: MonthlyAssessmentStatus[]) => {
    setMonthlyStatusList(updatedList);
  };

  // Dispatch School from Tour Diary or Dashboard into Field Inspection
  const handleSelectSchoolForVisit = (school: School) => {
    setActiveInspectionSchool(school);
    setCurrentTab('tour_diary');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      {/* Simplified, High-Legibility AP School Education Header */}
      <Header
        currentTab={currentTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        isOnline={isOnline}
        setIsOnline={handleToggleOnline}
        syncQueueCount={syncQueue.length}
        config={config}
        onResetMonth={handleResetMonth}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
      />

      {/* Main Structural Body: Sidebar + Main Content Viewport */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Simplified, Icon-Driven Sidebar (Desktop & Tablet Rail + Mobile Drawer) */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          currentUser={currentUser}
          isCollapsed={isSidebarCollapsed}
          setIsCollapsed={setIsSidebarCollapsed}
          mobileOpen={isMobileDrawerOpen}
          setMobileOpen={setIsMobileDrawerOpen}
          actionCount={pendingActionsCount}
        />

        {/* Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 pb-24 lg:pb-12">
            
            {currentTab === 'dashboard' && (
              <StateDashboard
                config={config}
                currentUser={currentUser}
                onSelectSchoolForVisit={handleSelectSchoolForVisit}
                assessmentRecords={assessmentRecords}
                monthlyStatusList={monthlyStatusList}
              />
            )}

            {currentTab === 'tour_diary' && (
              activeInspectionSchool ? (
                <FieldAppSimulator
                  currentUser={currentUser}
                  config={config}
                  monthlyStatusList={monthlyStatusList}
                  onUpdateMonthlyStatus={handleUpdateMonthlyStatus}
                  onAddAssessmentRecords={handleAddAssessmentRecords}
                  onAddActionItem={handleAddActionItem}
                  isOnline={isOnline}
                  onQueueOfflineAction={handleQueueOfflineAction}
                  initialSchool={activeInspectionSchool}
                  onBackToTourDiary={() => setActiveInspectionSchool(null)}
                />
              ) : (
                <TourDiaryView
                  config={config}
                  currentUser={currentUser}
                  onSelectSchool={handleSelectSchoolForVisit}
                />
              )
            )}

            {currentTab === 'assessment' && (
              <AssessmentStudioView
                onOpenMobileApp={() => {
                  setActiveInspectionSchool(SCHOOLS_DATA[0]);
                  setCurrentTab('tour_diary');
                }}
                onRecordStudentScore={(studentId, competencyId, score, maxScore) => {
                  setMonthlyStatusList(prev => {
                    const existingIdx = prev.findIndex(st => st.studentId === studentId);
                    const updatedItem: MonthlyAssessmentStatus = {
                      id: `MS_${studentId}_JUL`,
                      studentId,
                      schoolId: 'SCH_001',
                      classNumber: 3,
                      section: 'A',
                      monthYear: '2026-07',
                      isAssessedThisMonth: true,
                      assessmentCount: (existingIdx >= 0 ? prev[existingIdx].assessmentCount : 0) + 1,
                      lastAssessedDate: '2026-07-15',
                      lastAssessorName: currentUser.name,
                      lastAssessorRole: currentUser.role,
                      literacyScore: competencyId.startsWith('TEL') || competencyId.startsWith('ENG') ? Math.round((score / maxScore) * 30) : undefined,
                      numeracyScore: competencyId.startsWith('NUM') ? Math.round((score / maxScore) * 30) : undefined,
                      performanceBand: (score === maxScore ? 'ADVANCED' : 'PROFICIENT') as PerformanceBand,
                    };
                    if (existingIdx >= 0) {
                      const next = [...prev];
                      next[existingIdx] = { ...next[existingIdx], ...updatedItem };
                      return next;
                    }
                    return [updatedItem, ...prev];
                  });
                }}
              />
            )}

            {currentTab === 'actions' && (
              <ActionTrackerView
                actionItems={actionItems}
                onUpdateStatus={handleUpdateActionStatus}
                onAddAction={handleAddActionItem}
              />
            )}

            {currentTab === 'reports' && (
              <ReportsView
                config={config}
                monthlyStatusList={monthlyStatusList}
                assessmentRecords={assessmentRecords}
              />
            )}

            {currentTab === 'admin' && (
              <AdminConfigView
                config={config}
                onUpdateConfig={setConfig}
                onResetMonth={handleResetMonth}
              />
            )}

            {currentTab === 'blueprint' && (
              <BlueprintView />
            )}

          </main>

          {/* Clean, Non-intrusive Government Footer */}
          <footer className="bg-white border-t border-slate-200 py-4 text-xs text-slate-500 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
              <div>
                <span className="font-semibold text-slate-700">Govt of Andhra Pradesh — School Education Department</span>
                <span className="hidden sm:inline"> · </span>
                <span className="text-[11px] block sm:inline text-slate-400">FLN Monitoring System (2026–2029) • NIPUN Bharat</span>
              </div>
              <div className="text-[11px] text-slate-400">
                SCERT AP · Samagra Shiksha · Vidya Samiksha Kendra (VSK)
              </div>
            </div>
          </footer>
        </div>

      </div>

      {/* Ergonomic Mobile Bottom Tab Bar (Accessible touch navigation) */}
      <BottomTabBar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
        actionCount={pendingActionsCount}
      />
    </div>
  );
}
