import React, { useState, useEffect, useMemo } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  CheckCircle2,
  Sliders, 
  Clock, 
  Users, 
  Filter, 
  ChevronRight,
  TrendingDown,
  TrendingUp,
  Info,
  Building2,
  Play,
  Compass,
  ArrowRight,
  PlusCircle,
  FileText,
  ShieldAlert,
  Sparkles,
  Layers,
  ArrowLeft,
  X,
  Navigation,
  Check
} from 'lucide-react';
import { 
  School, 
  SystemConfig, 
  PriorityLevel, 
  UserProfile, 
  RepeatVisitAuditRecord,
  ClusterPrioritySummary 
} from '../types/fln';
import { 
  SCHOOLS_DATA, 
  DISTRICTS_DATA, 
  MANDALS_DATA, 
  INITIAL_REPEAT_VISIT_AUDITS 
} from '../data/mockData';
import { 
  calculateRoleBasedSchoolPriority, 
  aggregateClusterPriorities, 
  findNearbySchools,
  calculateDistanceKm
} from '../utils/algorithms';

interface TourDiaryViewProps {
  config: SystemConfig;
  onSelectSchool: (school: School) => void;
  currentUser?: UserProfile;
}

export const TourDiaryView: React.FC<TourDiaryViewProps> = ({ config, onSelectSchool, currentUser }) => {
  // Top Navigation Tabs
  const [activeMainTab, setActiveMainTab] = useState<'VISIT_PRIORITY' | 'REPEAT_VISIT_AUDIT'>('VISIT_PRIORITY');

  // Multi-layer navigation state (First layer = Cluster for MEO, Mandal for DEO; Direct school level for CRP)
  const isCRP = currentUser?.role === 'CRP';
  const isMEO = currentUser?.role === 'MEO';
  const isDEO = currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO';

  // Navigation Layer state: 'MANDAL_LAYER' | 'CLUSTER_LAYER' | 'SCHOOL_LAYER'
  const [navLayer, setNavLayer] = useState<'MANDAL_LAYER' | 'CLUSTER_LAYER' | 'SCHOOL_LAYER'>(
    isCRP ? 'SCHOOL_LAYER' : isMEO ? 'CLUSTER_LAYER' : 'MANDAL_LAYER'
  );

  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('ALL');
  const [selectedMandalId, setSelectedMandalId] = useState<string>('ALL');
  const [selectedClusterName, setSelectedClusterName] = useState<string>('ALL');

  // Today's Route: Optional 2nd nearby school selected by user
  const [plannedSecondSchool, setPlannedSecondSchool] = useState<School | null>(null);

  // Repeat Visit Audit state
  const [auditRecords, setAuditRecords] = useState<RepeatVisitAuditRecord[]>(INITIAL_REPEAT_VISIT_AUDITS);
  const [justificationModalSchool, setJustificationModalSchool] = useState<School | null>(null);
  const [justificationInput, setJustificationInput] = useState<string>(
    'Classroom demonstration & intensive remedial verification for Class 3 subtraction regrouping.'
  );

  // Synchronize initial jurisdiction with currentUser
  useEffect(() => {
    if (!currentUser) return;
    if (currentUser.role === 'CRP') {
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId(currentUser.mandalId || 'MND_MANGALAGIRI');
      setSelectedClusterName('Kaza Cluster');
      setNavLayer('SCHOOL_LAYER');
    } else if (currentUser.role === 'MEO') {
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId(currentUser.mandalId || 'MND_MANGALAGIRI');
      setSelectedClusterName('ALL');
      setNavLayer('CLUSTER_LAYER');
    } else if (currentUser.role === 'DEO' || currentUser.role === 'DY_DEO') {
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId('ALL');
      setSelectedClusterName('ALL');
      setNavLayer('MANDAL_LAYER');
    } else {
      setSelectedDistrictId('ALL');
      setSelectedMandalId('ALL');
      setSelectedClusterName('ALL');
      setNavLayer('CLUSTER_LAYER');
    }
  }, [currentUser]);

  // Active district and mandal objects
  const activeDistrict = DISTRICTS_DATA.find(d => d.id === selectedDistrictId);
  const activeMandal = MANDALS_DATA.find(m => m.id === selectedMandalId);

  let scopeLabel = 'State-Wide';
  if (selectedClusterName !== 'ALL') {
    scopeLabel = `${selectedClusterName}`;
  } else if (selectedMandalId !== 'ALL') {
    scopeLabel = `${activeMandal?.name || selectedMandalId} Mandal`;
  } else if (selectedDistrictId !== 'ALL') {
    scopeLabel = `${activeDistrict?.name || selectedDistrictId} District`;
  }

  // Available Mandals in District
  const availableMandals = selectedDistrictId === 'ALL'
    ? MANDALS_DATA
    : MANDALS_DATA.filter(m => m.districtId === selectedDistrictId);

  // Available Clusters in Mandal
  const availableClusters = useMemo(() => {
    const list = SCHOOLS_DATA.filter(s => {
      if (selectedDistrictId !== 'ALL' && s.districtId !== selectedDistrictId) return false;
      if (selectedMandalId !== 'ALL' && s.mandalId !== selectedMandalId) return false;
      return true;
    }).map(s => s.clusterName);
    return Array.from(new Set(list)).filter(Boolean);
  }, [selectedDistrictId, selectedMandalId]);

  // 1. Schools in current jurisdiction scope
  const inJurisdictionSchools = useMemo(() => {
    return SCHOOLS_DATA.filter(s => {
      if (selectedDistrictId !== 'ALL' && s.districtId !== selectedDistrictId) return false;
      if (selectedMandalId !== 'ALL' && s.mandalId !== selectedMandalId) return false;
      if (selectedClusterName !== 'ALL' && s.clusterName !== selectedClusterName) return false;
      return true;
    });
  }, [selectedDistrictId, selectedMandalId, selectedClusterName]);

  // 2. Schools in active Mandal (used for MEO Cluster Layer aggregation)
  const mandalSchools = useMemo(() => {
    return SCHOOLS_DATA.filter(s => {
      if (selectedDistrictId !== 'ALL' && s.districtId !== selectedDistrictId) return false;
      if (selectedMandalId !== 'ALL' && s.mandalId !== selectedMandalId) return false;
      return true;
    });
  }, [selectedDistrictId, selectedMandalId]);

  // First Layer: Cluster Priority Summaries for MEO / DEO
  const clusterSummaries = useMemo<ClusterPrioritySummary[]>(() => {
    return aggregateClusterPriorities(mandalSchools);
  }, [mandalSchools]);

  // 3. School Prioritization based on Role:
  // For CRP / School Layer: Prioritizes directly on:
  // 1) Higher enrolment
  // 2) Less or NO monitoring visits by all officers
  // 3) Student performance deficit (lower FLN score)
  const prioritizedSchools = useMemo(() => {
    // Score all schools
    const scoredList = inJurisdictionSchools.map(sch => {
      const breakdown = calculateRoleBasedSchoolPriority(
        sch,
        currentUser?.role || 'CRP',
        1,
        inJurisdictionSchools.length,
        scopeLabel
      );
      return {
        ...sch,
        rolePriority: breakdown,
      };
    });

    // Sort descending by composite score
    scoredList.sort((a, b) => b.rolePriority.score - a.rolePriority.score);

    // Reassign ranks
    return scoredList.map((item, idx) => ({
      ...item,
      enrolmentRank: idx + 1,
      rolePriority: {
        ...item.rolePriority,
        rankInScope: idx + 1,
      }
    }));
  }, [inJurisdictionSchools, currentUser?.role, scopeLabel]);

  // Apply filterLevel (ALL, CRITICAL, HIGH, MEDIUM, NORMAL)
  const filteredSchools = useMemo(() => {
    if (filterLevel === 'ALL') return prioritizedSchools;
    return prioritizedSchools.filter(s => s.rolePriority.level === filterLevel);
  }, [prioritizedSchools, filterLevel]);

  // Primary School of the Day: The #1 top-priority school
  const primarySchool = prioritizedSchools[0] || SCHOOLS_DATA[0];

  // Nearby Schools from primary school (within 1-6 km) for 2nd school recommendation
  const nearbySchoolOptions = useMemo(() => {
    if (!primarySchool) return [];
    return findNearbySchools(primarySchool, inJurisdictionSchools, 5);
  }, [primarySchool, inJurisdictionSchools]);

  const recommendedSecondSchool = nearbySchoolOptions[0]?.school || null;
  const recommendedDistance = nearbySchoolOptions[0]?.distanceKm || 1.4;

  // Handle Action button click on school card
  const handleStartInspectionClick = (school: School) => {
    if ((school.visitsThisMonth || 0) > 2) {
      // Flagged: prompt for justification
      setJustificationModalSchool(school);
    } else {
      onSelectSchool(school);
    }
  };

  // Confirm repeat visit justification
  const handleConfirmJustification = () => {
    if (!justificationModalSchool) return;

    // Check if audit record exists or create new
    const existingIdx = auditRecords.findIndex(r => r.schoolId === justificationModalSchool.id);
    const newRecord: RepeatVisitAuditRecord = {
      id: `AUDIT_${Date.now()}`,
      schoolId: justificationModalSchool.id,
      schoolName: justificationModalSchool.name,
      udiseCode: justificationModalSchool.udiseCode,
      mandalName: justificationModalSchool.mandalName,
      clusterName: justificationModalSchool.clusterName,
      visitsThisMonth: (justificationModalSchool.visitsThisMonth || 0) + 1,
      officerName: currentUser?.name || 'Supervisory Officer',
      officerRole: currentUser?.role || 'CRP',
      lastVisitDate: '2026-07-15',
      justificationReason: justificationInput,
      baselineFLNScore: Math.max(40, (justificationModalSchool.lastFLNScore || 50) - 8),
      midlineFLNScore: justificationModalSchool.lastFLNScore || 50,
      latestFLNScore: Math.min(95, (justificationModalSchool.lastFLNScore || 50) + 4),
      outputDelta: 4.0,
      meoStatus: 'APPROVED',
      meoRemarks: 'Justification submitted before inspection. Learning gains tracked.',
    };

    if (existingIdx >= 0) {
      setAuditRecords(prev => {
        const next = [...prev];
        next[existingIdx] = { ...next[existingIdx], ...newRecord };
        return next;
      });
    } else {
      setAuditRecords(prev => [newRecord, ...prev]);
    }

    const schoolToVisit = justificationModalSchool;
    setJustificationModalSchool(null);
    onSelectSchool(schoolToVisit);
  };

  // Update MEO status on repeat audit record
  const handleUpdateAuditStatus = (id: string, status: 'APPROVED' | 'EXPLANATION_CALLED', remarks: string) => {
    setAuditRecords(prev => prev.map(rec => {
      if (rec.id === id) {
        return {
          ...rec,
          meoStatus: status,
          meoRemarks: remarks || rec.meoRemarks,
        };
      }
      return rec;
    }));
  };

  // Count flagged schools in active jurisdiction
  const flaggedSchoolsInJurisdiction = inJurisdictionSchools.filter(s => (s.visitsThisMonth || 0) > 2);

  return (
    <div className="space-y-6 pb-12">
      {/* =========================================================================
          TOP HEADER & ROLE-BASED JURISDICTION CONTROLS
         ========================================================================= */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-emerald-700" />
              <h1 className="text-lg font-bold text-slate-900">
                School Visit Tour Diary &amp; Role-Adaptive Prioritization
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Role-specific supervisory planning for <strong>{currentUser?.designation || 'Educational Officer'}</strong>.
              {isCRP && ' Direct school-level priority based on enrolment, visit deficit, and student performance.'}
              {isMEO && ' Multi-layer priority: First layer evaluates Clusters, second layer drills into Schools.'}
              {isDEO && ' District-wide hierarchical priority: Mandals &rarr; Clusters &rarr; Schools.'}
            </p>
          </div>

          {/* Tab Selector: Route & Priority vs Repeat Visit Audit */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveMainTab('VISIT_PRIORITY')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMainTab === 'VISIT_PRIORITY'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-600" />
              <span>Visit Route &amp; Prioritization</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMainTab('REPEAT_VISIT_AUDIT')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeMainTab === 'REPEAT_VISIT_AUDIT'
                  ? 'bg-rose-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300" />
              <span>MEO Repeat Audit (&gt;2 Visits)</span>
              {flaggedSchoolsInJurisdiction.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
                  {flaggedSchoolsInJurisdiction.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Dynamic Jurisdiction Filter Strip */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-500">Jurisdiction Scope:</span>
            
            {/* District Selector */}
            <select
              value={selectedDistrictId}
              onChange={(e) => {
                setSelectedDistrictId(e.target.value);
                setSelectedMandalId('ALL');
                setSelectedClusterName('ALL');
                if (isDEO) setNavLayer('MANDAL_LAYER');
              }}
              className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Districts</option>
              {DISTRICTS_DATA.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>

            {/* Mandal Selector */}
            <select
              value={selectedMandalId}
              onChange={(e) => {
                setSelectedMandalId(e.target.value);
                setSelectedClusterName('ALL');
                if (isMEO || isDEO) setNavLayer('CLUSTER_LAYER');
              }}
              className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Mandals</option>
              {availableMandals.map(m => (
                <option key={m.id} value={m.id}>{m.name}</option>
              ))}
            </select>

            {/* Cluster Selector */}
            <select
              value={selectedClusterName}
              onChange={(e) => {
                setSelectedClusterName(e.target.value);
                setNavLayer('SCHOOL_LAYER');
              }}
              className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-emerald-500"
            >
              <option value="ALL">All Clusters ({availableClusters.length})</option>
              {availableClusters.map(cl => (
                <option key={cl} value={cl}>{cl}</option>
              ))}
            </select>
          </div>

          {/* Navigation Breadcrumb / Layer Switcher */}
          {!isCRP && (
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
              <span className="text-[11px] font-bold text-slate-500 px-1.5">View Layer:</span>
              <button
                type="button"
                onClick={() => setNavLayer('CLUSTER_LAYER')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  navLayer === 'CLUSTER_LAYER'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>1. Cluster Level</span>
              </button>

              <button
                type="button"
                onClick={() => setNavLayer('SCHOOL_LAYER')}
                className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  navLayer === 'SCHOOL_LAYER'
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3 h-3" />
                <span>2. School Level</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          TAB 1: VISIT ROUTE & PRIORITIZATION
         ========================================================================= */}
      {activeMainTab === 'VISIT_PRIORITY' && (
        <div className="space-y-6">
          {/* DAILY VISIT ROUTE & MANDATORY QUOTA PLANNER (MEO / CRP) */}
          <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Navigation className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span>Today&apos;s Tour Route &amp; Daily Visit Quota</span>
                    <span className="text-[10px] bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 px-2 py-0.5 rounded-full font-bold">
                      Mandatory Daily Quota: Min 1 School / Day
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    MEOs and CRPs must visit a minimum of 1 school daily. Optionally add a 2nd nearby school (&le; 3-5 km) to complete twin-school coverage.
                  </p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[11px] text-slate-400">Today&apos;s Planned Route:</div>
                <div className="text-sm font-extrabold text-emerald-400">
                  {plannedSecondSchool ? '2 of 2 Schools (Twin Route)' : '1 of 1 School (Quota Met)'}
                </div>
              </div>
            </div>

            {/* Route Cards Grid: Primary School + Recommended 2nd Nearby School */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-900">
              {/* Card 1: Primary School of the Day (Top Priority #1) */}
              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                      <span>Primary Visit 1 (Mandatory Quota)</span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-500">
                      Rank #1 in {scopeLabel}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                    {primarySchool.name}
                  </h4>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    UDISE: {primarySchool.udiseCode} • {primarySchool.clusterName} • {primarySchool.mandalName}
                  </div>

                  {/* 3 Key Criteria Badges: Enrolment, Officer Visits, FLN */}
                  <div className="grid grid-cols-3 gap-1.5 pt-2 text-center text-[10px]">
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block">Class 1-5 Enrolment</span>
                      <strong className="text-slate-900 text-xs">{primarySchool.totalStudents}</strong>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block">Visits this Month</span>
                      <strong className={primarySchool.visitsThisMonth === 0 ? 'text-rose-600 text-xs' : 'text-slate-900 text-xs'}>
                        {primarySchool.visitsThisMonth === 0 ? '0 (Unvisited)' : `${primarySchool.visitsThisMonth} visit(s)`}
                      </strong>
                    </div>
                    <div className="bg-slate-50 p-1.5 rounded border border-slate-200">
                      <span className="text-slate-400 block">FLN Score</span>
                      <strong className="text-slate-900 text-xs">{primarySchool.lastFLNScore}%</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    Status: <strong className="text-emerald-700">Planned for Today</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleStartInspectionClick(primarySchool)}
                    className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    <span>Start Primary Visit</span>
                  </button>
                </div>
              </div>

              {/* Card 2: Recommended 2nd Nearby School (Optional Twin Visit) */}
              <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-indigo-700" />
                      <span>Recommended 2nd Nearby School (Optional)</span>
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                      {recommendedDistance} km from Primary School
                    </span>
                  </div>

                  {recommendedSecondSchool ? (
                    <>
                      <h4 className="text-sm font-bold text-slate-900 mt-2 leading-snug">
                        {plannedSecondSchool?.name || recommendedSecondSchool.name}
                      </h4>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        UDISE: {plannedSecondSchool?.udiseCode || recommendedSecondSchool.udiseCode} • {plannedSecondSchool?.clusterName || recommendedSecondSchool.clusterName}
                      </div>

                      {/* Proximity & Efficiency Stats */}
                      <div className="bg-indigo-50/70 p-2 rounded-lg border border-indigo-100 text-[11px] text-indigo-950 flex items-center justify-between mt-2">
                        <span>Route Travel Time: <strong>~{Math.round(recommendedDistance * 3)} mins</strong> drive</span>
                        <span>Cohort: <strong>{(plannedSecondSchool || recommendedSecondSchool).totalStudents} students</strong></span>
                      </div>
                    </>
                  ) : (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      No nearby schools found within 5 km radius.
                    </div>
                  )}
                </div>

                {recommendedSecondSchool && (
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                    {plannedSecondSchool ? (
                      <>
                        <span className="text-[11px] font-bold text-indigo-800 flex items-center gap-1">
                          <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                          <span>Added to Today&apos;s Tour</span>
                        </span>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => setPlannedSecondSchool(null)}
                            className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                          >
                            Remove
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStartInspectionClick(plannedSecondSchool)}
                            className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                          >
                            <Play className="w-3 h-3 fill-current" />
                            <span>Start 2nd Visit</span>
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <span className="text-[11px] text-slate-500">
                          Visit 2 is optional based on officer availability
                        </span>
                        <button
                          type="button"
                          onClick={() => setPlannedSecondSchool(recommendedSecondSchool)}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Add to Today&apos;s Route</span>
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* =========================================================================
              LAYER 1: CLUSTER-LEVEL PRIORITY FOR MEO / DEO
             ========================================================================= */}
          {navLayer === 'CLUSTER_LAYER' && !isCRP && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-emerald-700" />
                    <span>Layer 1: Cluster-Level Priority Ranking for {activeMandal?.name || 'Mandal'}</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    For MEO, clusters are ranked by unvisited schools count, average FLN deficit, and enrolment. Click any cluster to inspect its prioritized schools.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setNavLayer('SCHOOL_LAYER')}
                  className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 self-start"
                >
                  <span>Skip to All Schools List</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Cluster Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {clusterSummaries.map((cluster) => {
                  const isCrit = cluster.priorityLevel === 'CRITICAL';
                  const isHigh = cluster.priorityLevel === 'HIGH';

                  return (
                    <div
                      key={cluster.clusterName}
                      className={`p-4 rounded-xl border bg-white shadow-xs space-y-3 transition-all flex flex-col justify-between ${
                        isCrit 
                          ? 'border-rose-300 ring-1 ring-rose-400/40' 
                          : isHigh 
                          ? 'border-amber-300' 
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                            #{cluster.priorityRank}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            isCrit 
                              ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                              : isHigh 
                              ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                              : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {cluster.priorityLevel} PRIORITY
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-bold text-slate-900">
                            {cluster.clusterName}
                          </h4>
                          <div className="text-[11px] text-slate-500">
                            {cluster.mandalName} Mandal • {cluster.totalSchools} Primary Schools
                          </div>
                        </div>

                        {/* Cluster Metrics Grid */}
                        <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center text-[10px]">
                          <div>
                            <span className="text-slate-400 block">Unvisited</span>
                            <strong className={cluster.unvisitedSchoolsCount > 0 ? 'text-rose-600 text-xs' : 'text-emerald-700 text-xs'}>
                              {cluster.unvisitedSchoolsCount} / {cluster.totalSchools}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Avg FLN</span>
                            <strong className="text-slate-900 text-xs">{cluster.avgFLNScore}%</strong>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Enrolment</span>
                            <strong className="text-slate-900 text-xs">{cluster.totalEnrolmentClass1to5}</strong>
                          </div>
                        </div>

                        {cluster.repeatVisitSchoolsCount > 0 && (
                          <div className="text-[10px] bg-rose-50 border border-rose-200 text-rose-900 p-1.5 rounded flex items-center gap-1 font-semibold">
                            <AlertTriangle className="w-3 h-3 text-rose-700 shrink-0" />
                            <span>{cluster.repeatVisitSchoolsCount} school(s) visited &gt; 2 times this month</span>
                          </div>
                        )}
                      </div>

                      {/* Drill-down action */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClusterName(cluster.clusterName);
                          setNavLayer('SCHOOL_LAYER');
                        }}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <span>Drill-down to Schools ({cluster.totalSchools})</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* =========================================================================
              LAYER 2 / DIRECT CRP: SCHOOL-LEVEL PRIORITIZATION
             ========================================================================= */}
          {(navLayer === 'SCHOOL_LAYER' || isCRP) && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-2">
                  {!isCRP && (
                    <button
                      type="button"
                      onClick={() => setNavLayer('CLUSTER_LAYER')}
                      className="p-1 rounded-lg hover:bg-slate-200 text-slate-700 cursor-pointer"
                      title="Back to Cluster Layer"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </button>
                  )}
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-700" />
                      <span>
                        {isCRP ? 'Direct School Priority for CRP' : `School Priority in ${scopeLabel}`} ({filteredSchools.length} Schools)
                      </span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Prioritized by: <strong>Higher Enrolment</strong> + <strong>Zero/Less Officer Visits</strong> + <strong>Student Performance Deficit</strong>.
                    </p>
                  </div>
                </div>

                {/* Priority Filter Dropdown */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-semibold text-slate-600">Filter Level:</span>
                  <select
                    value={filterLevel}
                    onChange={(e) => setFilterLevel(e.target.value)}
                    className="p-1.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                  >
                    <option value="ALL">All Levels ({prioritizedSchools.length})</option>
                    <option value="CRITICAL">Critical Priority</option>
                    <option value="HIGH">High Priority</option>
                    <option value="MEDIUM">Medium Priority</option>
                    <option value="NORMAL">Normal Priority</option>
                  </select>
                </div>
              </div>

              {/* School Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredSchools.map((school) => {
                  const priority = school.rolePriority;
                  const isCrit = priority.level === 'CRITICAL';
                  const isHigh = priority.level === 'HIGH';
                  const isRepeatFlagged = priority.isFlaggedRepeatVisit;

                  return (
                    <div
                      key={school.id}
                      className={`p-4 rounded-xl border bg-white shadow-xs space-y-3 transition-all flex flex-col justify-between ${
                        isRepeatFlagged
                          ? 'border-rose-400 bg-rose-50/20 ring-1 ring-rose-400'
                          : isCrit 
                          ? 'border-rose-300 bg-rose-50/10' 
                          : isHigh 
                          ? 'border-amber-300' 
                          : 'border-slate-200'
                      }`}
                    >
                      <div className="space-y-2.5">
                        {/* Header: Rank, Name, Badges */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                              #{school.enrolmentRank}
                            </span>
                            <div>
                              <h4 className="text-sm font-bold text-slate-900 leading-snug">
                                {school.name}
                              </h4>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                UDISE: {school.udiseCode} • {school.clusterName} • {school.mandalName}
                              </div>
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                              isCrit 
                                ? 'bg-rose-100 text-rose-900 border border-rose-300' 
                                : isHigh 
                                ? 'bg-amber-100 text-amber-900 border border-amber-300' 
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {priority.level}
                            </span>
                            <div className="text-[10px] font-bold text-slate-500 mt-0.5">
                              Score: {priority.score}/100
                            </div>
                          </div>
                        </div>

                        {/* REPEAT VISIT AUDIT ALERT BANNER (If visits > 2) */}
                        {isRepeatFlagged && (
                          <div className="bg-rose-50 border border-rose-300 p-2.5 rounded-lg text-xs text-rose-950 space-y-1">
                            <div className="flex items-center gap-1.5 font-bold text-rose-900 text-[11px]">
                              <AlertTriangle className="w-3.5 h-3.5 text-rose-700 shrink-0" />
                              <span>⚠️ AUDIT FLAG: Visited {school.visitsThisMonth} Times in Month (&gt; 2 Threshold)</span>
                            </div>
                            <p className="text-[10px] text-rose-800 leading-relaxed">
                              MEO compliance rule requires recording an official reason before conducting another visit. Learning output will be measured against prior visits.
                            </p>
                          </div>
                        )}

                        {/* 3 Core Criteria Breakdown Strip */}
                        <div className="grid grid-cols-3 gap-1.5 bg-slate-50 p-2 rounded-lg border border-slate-100 text-center text-[10px]">
                          <div>
                            <span className="text-slate-400 block">1. Enrolment (35pts)</span>
                            <strong className="text-slate-900 text-xs">{school.totalStudents} students</strong>
                            <span className="text-[9px] text-emerald-700 block font-semibold">+{priority.enrolmentPoints} pts</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">2. Officer Visits (40pts)</span>
                            <strong className={school.visitsThisMonth === 0 ? 'text-rose-600 text-xs font-bold' : 'text-slate-900 text-xs'}>
                              {school.visitsThisMonth === 0 ? '0 Visits' : `${school.visitsThisMonth} visit(s)`}
                            </strong>
                            <span className="text-[9px] text-emerald-700 block font-semibold">+{priority.visitDeficitPoints} pts</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">3. FLN Deficit (25pts)</span>
                            <strong className="text-slate-900 text-xs">{school.lastFLNScore}% FLN</strong>
                            <span className="text-[9px] text-emerald-700 block font-semibold">+{priority.performanceDeficitPoints} pts</span>
                          </div>
                        </div>

                        {/* Transparent Reason Callout */}
                        <div className="text-[11px] text-slate-600 bg-slate-50/70 p-2 rounded-lg border border-slate-100 leading-relaxed">
                          <strong>Priority Rationale: </strong>
                          <span>{priority.reason}</span>
                        </div>
                      </div>

                      {/* Card Footer: Action & Last Visited */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2 mt-2">
                        <span className="text-[10px] text-slate-400">
                          Last Visit: <strong>{school.lastVisitDate}</strong>
                        </span>

                        <button
                          type="button"
                          onClick={() => handleStartInspectionClick(school)}
                          className={`px-3 py-1.5 text-white font-semibold text-xs rounded-lg shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            isRepeatFlagged 
                              ? 'bg-rose-700 hover:bg-rose-800' 
                              : 'bg-emerald-700 hover:bg-emerald-800'
                          }`}
                        >
                          <Play className="w-3 h-3 fill-current" />
                          <span>{isRepeatFlagged ? 'Inspect (Audit Required)' : 'Start Inspection'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: MEO REPEAT VISIT AUDIT & OUTPUT MEASUREMENT
         ========================================================================= */}
      {activeMainTab === 'REPEAT_VISIT_AUDIT' && (
        <div className="space-y-6">
          {/* Audit Rule Policy Banner */}
          <div className="bg-rose-50 border border-rose-200 p-4 sm:p-5 rounded-xl text-xs space-y-2 text-rose-950">
            <div className="flex items-center gap-2 font-bold text-sm text-rose-900">
              <ShieldAlert className="w-5 h-5 text-rose-700" />
              <h3>AP SCERT Compliance Policy: Repeat Visit Audit &amp; Learning Output Measurement</h3>
            </div>
            <p className="text-slate-700 leading-relaxed text-[11px]">
              Officers must visit a minimum of 1 school per day, but visiting any school <strong>more than two times in a month</strong> triggers an automatic audit flag. The Mandal Educational Officer (MEO) must review the stated reason and measure student foundational learning output progress between visit 1, visit 2, and visit 3+.
            </p>
          </div>

          {/* Audit Records Table / Cards */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-rose-700" />
              <span>Flagged Repeat Visits in {scopeLabel} ({auditRecords.length} Records)</span>
            </h3>

            <div className="space-y-4">
              {auditRecords.map((record) => {
                const isApproved = record.meoStatus === 'APPROVED';
                const isPositiveOutput = record.outputDelta >= 5;

                return (
                  <div
                    key={record.id}
                    className="p-4 sm:p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-slate-100 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded border border-rose-300">
                            {record.visitsThisMonth} Visits Completed This Month
                          </span>
                          <span className="text-xs text-slate-500 font-medium">
                            {record.clusterName} • {record.mandalName} Mandal
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 mt-1">
                          {record.schoolName} (UDISE: {record.udiseCode})
                        </h4>
                      </div>

                      <div className="text-right">
                        <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                          isApproved 
                            ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' 
                            : 'bg-amber-100 text-amber-900 border border-amber-300'
                        }`}>
                          {record.meoStatus === 'APPROVED' ? '✓ MEO Approved' : '⚠️ Under MEO Review'}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          Assessor: {record.officerName} ({record.officerRole})
                        </div>
                      </div>
                    </div>

                    {/* Stated Justification by Officer */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs space-y-1">
                      <span className="font-bold text-slate-800 text-[11px] block">
                        Official Justification for Repeat Visit (&gt; 2 times):
                      </span>
                      <p className="text-slate-700 text-[11px] leading-relaxed">
                        &quot;{record.justificationReason}&quot;
                      </p>
                    </div>

                    {/* Output Measurement Strip */}
                    <div className="bg-gradient-to-r from-slate-50 to-emerald-50/50 p-3 rounded-lg border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                        <span>Student Learning Output Measured Across Visits:</span>
                        <span className={`flex items-center gap-1 text-xs font-extrabold ${
                          isPositiveOutput ? 'text-emerald-700' : 'text-amber-700'
                        }`}>
                          {isPositiveOutput ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          <span>{record.outputDelta >= 0 ? `+${record.outputDelta}%` : `${record.outputDelta}%`} FLN Growth</span>
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center text-[11px]">
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Visit 1 (Baseline)</span>
                          <strong className="text-slate-800 text-sm">{record.baselineFLNScore}%</strong>
                        </div>
                        <div className="bg-white p-2 rounded border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Visit 2 (Intermediate)</span>
                          <strong className="text-slate-800 text-sm">{record.midlineFLNScore}%</strong>
                        </div>
                        <div className="bg-white p-2 rounded border border-emerald-300 ring-1 ring-emerald-400/30">
                          <span className="text-slate-400 block text-[10px]">Visit 3 (Latest)</span>
                          <strong className="text-emerald-800 text-sm">{record.latestFLNScore}%</strong>
                        </div>
                      </div>
                    </div>

                    {/* MEO Remarks & Decision Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="text-[11px] text-slate-600">
                        <strong>MEO Audit Remarks: </strong>
                        <span>{record.meoRemarks || 'Pending MEO review.'}</span>
                      </div>

                      <div className="flex items-center gap-2 self-end">
                        <button
                          type="button"
                          onClick={() => handleUpdateAuditStatus(
                            record.id, 
                            'APPROVED', 
                            'Verified learning output gain. Approved as necessary pedagogical follow-up.'
                          )}
                          className="px-3 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Approve Output
                        </button>
                        <button
                          type="button"
                          onClick={() => handleUpdateAuditStatus(
                            record.id, 
                            'EXPLANATION_CALLED', 
                            'Formal explanation called from HM/CRP on marginal learning output delta.'
                          )}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          Call for Explanation
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          MANDATORY REPEAT VISIT JUSTIFICATION MODAL
         ========================================================================= */}
      {justificationModalSchool && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 space-y-4 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-700" />
                <h3 className="text-sm font-bold text-slate-900">
                  Mandatory Repeat Visit Justification (&gt; 2 Visits)
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setJustificationModalSchool(null)}
                className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-950 space-y-1">
              <span className="font-bold block">
                {justificationModalSchool.name} has already been visited {justificationModalSchool.visitsThisMonth} times in July 2026.
              </span>
              <p className="text-[11px] text-rose-800">
                To prevent monitoring concentration and ensure all primary schools receive supervision, MEO regulations mandate recording an official justification before inspecting.
              </p>
            </div>

            {/* Quick Reason Options */}
            <div className="space-y-1.5">
              <label htmlFor="repeat-justification-select" className="text-xs font-bold text-slate-700 block">
                Select or Customize Official Justification:
              </label>
              <select
                id="repeat-justification-select"
                onChange={(e) => setJustificationInput(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="Classroom demonstration & intensive remedial verification for Class 3 subtraction carryover.">
                  Pedagogical demonstration requested by HM
                </option>
                <option value="Special verification after low FLN score in Visit 2 to audit TLM integration.">
                  Special verification of student learning gap (Low FLN)
                </option>
                <option value="Teacher co-teaching follow-up for multi-grade Class 1-2 Telugu reading drills.">
                  Multi-grade classroom co-teaching follow-up
                </option>
                <option value="SMC/Parent request to inspect student attendance and mid-day meal learning environment.">
                  SMC inquiry & student attendance audit
                </option>
              </select>
            </div>

            {/* Custom Notes */}
            <div className="space-y-1">
              <label htmlFor="custom-justification-notes" className="text-xs font-semibold text-slate-600 block">
                Detailed Remarks for MEO Review:
              </label>
              <textarea
                id="custom-justification-notes"
                rows={3}
                value={justificationInput}
                onChange={(e) => setJustificationInput(e.target.value)}
                className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                placeholder="Enter specific rationale for repeat inspection..."
              />
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setJustificationModalSchool(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmJustification}
                className="px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Submit Reason &amp; Proceed</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
