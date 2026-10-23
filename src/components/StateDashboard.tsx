import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Users, 
  Target, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen, 
  Calculator, 
  ArrowUpRight, 
  Filter, 
  ChevronRight,
  Sparkles,
  Download,
  School as SchoolIcon,
  CheckCircle2,
  Percent,
  BarChart3,
  MapPin,
  Layers,
  ArrowRight,
  Clock,
  Play,
  RotateCcw,
  SlidersHorizontal,
  Compass,
  Info,
  Languages,
  CheckCircle as CheckCircleIcon,
  HelpCircle,
  Eye,
  Activity,
  FileSpreadsheet,
  Timer,
  Award,
  Briefcase,
  ShieldCheck,
  UserCheck,
  Search
} from 'lucide-react';
import { District, School, Mandal, SystemConfig, AssessmentRecord, MonthlyAssessmentStatus, UserProfile, SupervisoryCadreOfficer, CadreType } from '../types/fln';
import { DISTRICTS_DATA, MANDALS_DATA, SCHOOLS_DATA, MOCK_USERS, CADRE_SUMMARY_STATS, SUPERVISORY_OFFICERS_DATA } from '../data/mockData';
import { FLN_TARGETS_2026_27 } from '../data/flnTargets2026_27';
import { APGovtLogo } from './APGovtLogo';

interface StateDashboardProps {
  config: SystemConfig;
  currentUser?: UserProfile;
  onSelectSchoolForVisit: (school: School) => void;
  assessmentRecords?: AssessmentRecord[];
  monthlyStatusList?: MonthlyAssessmentStatus[];
}

export type HierarchyLevel = 'STATE' | 'DISTRICT' | 'MANDAL';
export type DashboardTab = 'FLN' | 'VISITS';

export const StateDashboard: React.FC<StateDashboardProps> = ({ 
  config, 
  currentUser,
  onSelectSchoolForVisit,
  assessmentRecords = [],
  monthlyStatusList = [],
}) => {
  // --------------------------------------------------------------------------
  // PRIMARY TWO TABS: 'FLN' (Learning Outcomes) vs 'VISITS' (Field Monitoring)
  // --------------------------------------------------------------------------
  const [dashboardTab, setDashboardTab] = useState<DashboardTab>('FLN');

  // --------------------------------------------------------------------------
  // HIERARCHY FILTER STATE (State -> District -> Mandal)
  // --------------------------------------------------------------------------
  const [activeLevel, setActiveLevel] = useState<HierarchyLevel>('STATE');
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('ALL');
  const [selectedMandalId, setSelectedMandalId] = useState<string>('ALL');
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>('ALL');
  const [selectedGrade, setSelectedGrade] = useState<number | 'ALL'>('ALL');
  const [targetGradeTab, setTargetGradeTab] = useState<number | 'MATRIX'>(3);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSPSModal, setShowSPSModal] = useState<boolean>(false);

  // Cadre filter & subview state for School Visits & Field Monitoring
  const [selectedCadreFilter, setSelectedCadreFilter] = useState<CadreType | 'ALL' | 'SUBORDINATES'>('SUBORDINATES');
  const [cadreSearchQuery, setCadreSearchQuery] = useState<string>('');
  const [visitsTableTab, setVisitsTableTab] = useState<'CADRES' | 'GEOGRAPHY'>('CADRES');

  // --------------------------------------------------------------------------
  // ROLE-DRIVEN INITIALIZATION: Adapts initial scope and cadre to the user's role
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (!currentUser) return;

    // Synchronize supervisory cadre selection and level with the active user role
    if (currentUser.role === 'DY_DEO') {
      setSelectedCadreFilter('SUBORDINATES'); // Reflects below cadres: MEOs & CRPs
      setVisitsTableTab('CADRES');
      setActiveLevel('DISTRICT');
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId('ALL');
    } else if (currentUser.role === 'MEO') {
      setSelectedCadreFilter('CRP'); // Reflects below cadre: CRPs in mandal
      setVisitsTableTab('CADRES');
      setActiveLevel('MANDAL');
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId(currentUser.mandalId || 'MND_MANGALAGIRI');
    } else if (currentUser.role === 'CRP') {
      setSelectedCadreFilter('CRP'); // Reflects cluster & peer CRPs
      setVisitsTableTab('CADRES');
      setActiveLevel('MANDAL');
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId(currentUser.mandalId || 'MND_MANGALAGIRI');
    } else if (currentUser.role === 'DEO') {
      setSelectedCadreFilter('SUBORDINATES'); // Reflects below cadres: Dy. DEO, MEO, CRP
      setVisitsTableTab('CADRES');
      setActiveLevel('DISTRICT');
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId('ALL');
    } else if (currentUser.role === 'STATE_LEADERSHIP' || currentUser.role === 'ADMIN') {
      setSelectedCadreFilter('ALL');
      setActiveLevel('STATE');
      setSelectedDistrictId('ALL');
      setSelectedMandalId('ALL');
    }
  }, [currentUser]);

  // --------------------------------------------------------------------------
  // LEVEL TOGGLE HANDLERS (ENFORCES ROLE HIERARCHY LIMITS: UPPER LEVELS BLOCKED)
  // --------------------------------------------------------------------------
  const handleToggleLevel = (level: HierarchyLevel) => {
    // Prevent navigating up to upper cadre jurisdictions
    if ((currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO') && level === 'STATE') {
      return;
    }
    if ((currentUser?.role === 'MEO' || currentUser?.role === 'CRP' || currentUser?.role === 'HEADMASTER' || currentUser?.role === 'TEACHER') && (level === 'STATE' || level === 'DISTRICT')) {
      return;
    }

    setActiveLevel(level);
    setSelectedSchoolId('ALL');
    if (level === 'STATE') {
      setSelectedDistrictId('ALL');
      setSelectedMandalId('ALL');
    } else if (level === 'DISTRICT') {
      if (selectedDistrictId === 'ALL') {
        setSelectedDistrictId(currentUser?.districtId || 'DIST_GUNTUR');
      }
      setSelectedMandalId('ALL');
    } else if (level === 'MANDAL') {
      if (selectedDistrictId === 'ALL') {
        setSelectedDistrictId(currentUser?.districtId || 'DIST_GUNTUR');
      }
      if (selectedMandalId === 'ALL') {
        setSelectedMandalId(currentUser?.mandalId || 'MND_MANGALAGIRI');
      }
    }
  };

  const handleDistrictChange = (districtId: string) => {
    // If user is district or lower cadre, they cannot browse ALL or other districts
    if (currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO' || currentUser?.role === 'MEO' || currentUser?.role === 'CRP') {
      setSelectedDistrictId(currentUser?.districtId || 'DIST_GUNTUR');
      return;
    }

    setSelectedDistrictId(districtId);
    setSelectedMandalId('ALL');
    setSelectedSchoolId('ALL');
    if (districtId === 'ALL') {
      setActiveLevel('STATE');
    } else if (activeLevel === 'STATE') {
      setActiveLevel('DISTRICT');
    }
  };

  const handleMandalChange = (mandalId: string) => {
    if (currentUser?.role === 'MEO' || currentUser?.role === 'CRP') {
      setSelectedMandalId(currentUser?.mandalId || 'MND_MANGALAGIRI');
      return;
    }

    setSelectedMandalId(mandalId);
    setSelectedSchoolId('ALL');
    if (mandalId === 'ALL') {
      setActiveLevel('DISTRICT');
    } else {
      setActiveLevel('MANDAL');
    }
  };

  const handleResetToState = () => {
    setSelectedSchoolId('ALL');
    if (currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN') {
      setActiveLevel('STATE');
      setSelectedDistrictId('ALL');
      setSelectedMandalId('ALL');
    } else if (currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO') {
      setActiveLevel('DISTRICT');
      setSelectedDistrictId(currentUser.districtId || 'DIST_GUNTUR');
      setSelectedMandalId('ALL');
    } else {
      setActiveLevel('MANDAL');
      setSelectedDistrictId(currentUser?.districtId || 'DIST_GUNTUR');
      setSelectedMandalId(currentUser?.mandalId || 'MND_MANGALAGIRI');
    }
    setSearchQuery('');
  };

  // --------------------------------------------------------------------------
  // DYNAMIC CONTEXTUAL FILTERING FOR THE CHOSEN SCOPE
  // --------------------------------------------------------------------------
  const availableMandals = selectedDistrictId === 'ALL'
    ? MANDALS_DATA
    : MANDALS_DATA.filter(m => m.districtId === selectedDistrictId);

  let scopedSchools = SCHOOLS_DATA;
  if (selectedDistrictId !== 'ALL') {
    scopedSchools = scopedSchools.filter(s => s.districtId === selectedDistrictId);
  }
  if (selectedMandalId !== 'ALL') {
    scopedSchools = scopedSchools.filter(s => s.mandalId === selectedMandalId);
  }

  const activeDistrict = DISTRICTS_DATA.find(d => d.id === selectedDistrictId);
  const activeMandal = MANDALS_DATA.find(m => m.id === selectedMandalId);

  // --------------------------------------------------------------------------
  // DYNAMIC METRICS COMPUTATION (State / District / Mandal)
  // Explicitly covers: Telugu Literacy, English Literacy, Numeracy, Visits & Student Coverage
  // --------------------------------------------------------------------------
  let totalSchools = 0;
  let totalTargetVisits = 0;
  let totalActualVisits = 0;
  let totalEligibleStudents = 0;
  let totalUniqueStudentsAssessed = 0;
  let totalCriticalSchools = 0;
  let avgTeluguScore = 0;
  let avgEnglishScore = 0;
  let avgNumeracyScore = 0;

  if (activeLevel === 'STATE') {
    totalSchools = DISTRICTS_DATA.reduce((acc, d) => acc + d.totalSchools, 0);
    totalTargetVisits = DISTRICTS_DATA.reduce((acc, d) => acc + d.targetVisits, 0);
    totalActualVisits = DISTRICTS_DATA.reduce((acc, d) => acc + d.actualVisits, 0);
    totalEligibleStudents = DISTRICTS_DATA.reduce((acc, d) => acc + d.totalEligibleStudents, 0);
    totalUniqueStudentsAssessed = DISTRICTS_DATA.reduce((acc, d) => acc + d.uniqueStudentsAssessed, 0);
    totalCriticalSchools = DISTRICTS_DATA.reduce((acc, d) => acc + d.criticalSchoolsCount, 0);
    avgTeluguScore = Math.round((DISTRICTS_DATA.reduce((acc, d) => acc + (d.avgTeluguScore ?? d.avgLiteracyScore), 0) / DISTRICTS_DATA.length) * 10) / 10;
    avgEnglishScore = Math.round((DISTRICTS_DATA.reduce((acc, d) => acc + (d.avgEnglishScore ?? (d.avgLiteracyScore - 3.5)), 0) / DISTRICTS_DATA.length) * 10) / 10;
    avgNumeracyScore = Math.round((DISTRICTS_DATA.reduce((acc, d) => acc + d.avgNumeracyScore, 0) / DISTRICTS_DATA.length) * 10) / 10;
  } else if (activeLevel === 'DISTRICT' && activeDistrict) {
    totalSchools = activeDistrict.totalSchools;
    totalTargetVisits = activeDistrict.targetVisits;
    totalActualVisits = activeDistrict.actualVisits;
    totalEligibleStudents = activeDistrict.totalEligibleStudents;
    totalUniqueStudentsAssessed = activeDistrict.uniqueStudentsAssessed;
    totalCriticalSchools = activeDistrict.criticalSchoolsCount;
    avgTeluguScore = activeDistrict.avgTeluguScore ?? activeDistrict.avgLiteracyScore;
    avgEnglishScore = activeDistrict.avgEnglishScore ?? (activeDistrict.avgLiteracyScore - 3.2);
    avgNumeracyScore = activeDistrict.avgNumeracyScore;
  } else if (activeLevel === 'MANDAL' && activeMandal) {
    totalSchools = activeMandal.totalSchools;
    totalTargetVisits = activeMandal.targetVisits;
    totalActualVisits = activeMandal.actualVisits;
    totalEligibleStudents = activeMandal.totalEligibleStudents;
    totalUniqueStudentsAssessed = activeMandal.uniqueStudentsAssessed;
    totalCriticalSchools = scopedSchools.filter(s => s.priorityLevel === 'CRITICAL').length;
    if (scopedSchools.length > 0) {
      avgTeluguScore = Math.round((scopedSchools.reduce((acc, s) => acc + s.lastLiteracyScore, 0) / scopedSchools.length) * 10) / 10;
      avgEnglishScore = Math.round(Math.max(30, (avgTeluguScore - 3.5)) * 10) / 10;
      avgNumeracyScore = Math.round((scopedSchools.reduce((acc, s) => acc + s.lastNumeracyScore, 0) / scopedSchools.length) * 10) / 10;
    } else {
      avgTeluguScore = 69.5;
      avgEnglishScore = 65.0;
      avgNumeracyScore = 63.0;
    }
  }

  // Visit achievement percent (Visits conducted vs Target)
  const visitAchievementPercent = totalTargetVisits > 0 
    ? Math.round((totalActualVisits / totalTargetVisits) * 1000) / 10 
    : 0;
  const visitGap = Math.max(0, totalTargetVisits - totalActualVisits);

  // --------------------------------------------------------------------------
  // ROLE-BASED CADRE TARGETS & ACHIEVEMENTS (Dy. DEO, MEO, CRP, DEO)
  // --------------------------------------------------------------------------
  const dyDeoStats = CADRE_SUMMARY_STATS.DY_DEO;
  const meoStats = CADRE_SUMMARY_STATS.MEO;
  const crpStats = CADRE_SUMMARY_STATS.CRP;
  const deoStats = CADRE_SUMMARY_STATS.DEO;

  // Active officer stats for logged in persona if supervisory officer
  const loggedInOfficer = SUPERVISORY_OFFICERS_DATA.find(
    o => o.role === currentUser?.role && (!currentUser?.districtId || currentUser.districtId === 'AP_ALL' || o.districtId === currentUser?.districtId)
  ) || SUPERVISORY_OFFICERS_DATA.find(o => o.role === currentUser?.role);

  // Dynamic active role visit metrics
  let activeRoleTitle = 'All Supervisory Cadres';
  let activeRoleBadgeLabel = 'State All Cadres';
  let activeRoleOfficerQuota = 118485;
  let activeRoleOfficerCompleted = 97412;
  let activeRoleOfficerAchievement = 82.2;
  let activeRoleOfficerGap = 21073;
  let activeRoleTargetVisits = dyDeoStats.stateTargetVisits + meoStats.stateTargetVisits + crpStats.stateTargetVisits + deoStats.stateTargetVisits; // 118,485
  let activeRoleActualVisits = dyDeoStats.stateActualVisits + meoStats.stateActualVisits + crpStats.stateActualVisits + deoStats.stateActualVisits; // 97,412
  let activeRoleAchievementPercent = 82.2;
  let activeRoleVisitGap = 21073;
  let cadreAveragePercent = 82.2;

  if (currentUser?.role === 'DY_DEO') {
    activeRoleTitle = 'Dy. DEO';
    activeRoleBadgeLabel = 'Dy. DEO Statutory Quota';
    activeRoleOfficerQuota = 15;
    activeRoleOfficerCompleted = loggedInOfficer?.completedVisits ?? 12;
    activeRoleOfficerAchievement = loggedInOfficer?.achievementPercent ?? 80.0;
    activeRoleOfficerGap = loggedInOfficer?.visitGap ?? 3;
    activeRoleTargetVisits = activeLevel === 'STATE' ? dyDeoStats.stateTargetVisits : dyDeoStats.districtTargetVisits;
    activeRoleActualVisits = activeLevel === 'STATE' ? dyDeoStats.stateActualVisits : dyDeoStats.districtActualVisits;
    activeRoleAchievementPercent = activeRoleOfficerAchievement;
    activeRoleVisitGap = activeRoleOfficerGap;
    cadreAveragePercent = dyDeoStats.stateAchievementPercent;
  } else if (currentUser?.role === 'MEO') {
    activeRoleTitle = 'MEO';
    activeRoleBadgeLabel = 'MEO Statutory Quota';
    activeRoleOfficerQuota = 20;
    activeRoleOfficerCompleted = loggedInOfficer?.completedVisits ?? 16;
    activeRoleOfficerAchievement = loggedInOfficer?.achievementPercent ?? 80.0;
    activeRoleOfficerGap = loggedInOfficer?.visitGap ?? 4;
    activeRoleTargetVisits = activeLevel === 'STATE' ? meoStats.stateTargetVisits : meoStats.districtTargetVisits;
    activeRoleActualVisits = activeLevel === 'STATE' ? meoStats.stateActualVisits : meoStats.districtActualVisits;
    activeRoleAchievementPercent = activeRoleOfficerAchievement;
    activeRoleVisitGap = activeRoleOfficerGap;
    cadreAveragePercent = meoStats.stateAchievementPercent;
  } else if (currentUser?.role === 'CRP') {
    activeRoleTitle = 'CRP';
    activeRoleBadgeLabel = 'CRP Daily Visit Quota';
    activeRoleOfficerQuota = 30;
    activeRoleOfficerCompleted = loggedInOfficer?.completedVisits ?? 24;
    activeRoleOfficerAchievement = loggedInOfficer?.achievementPercent ?? 80.0;
    activeRoleOfficerGap = loggedInOfficer?.visitGap ?? 6;
    activeRoleTargetVisits = activeLevel === 'STATE' ? crpStats.stateTargetVisits : crpStats.districtTargetVisits;
    activeRoleActualVisits = activeLevel === 'STATE' ? crpStats.stateActualVisits : crpStats.districtActualVisits;
    activeRoleAchievementPercent = activeRoleOfficerAchievement;
    activeRoleVisitGap = activeRoleOfficerGap;
    cadreAveragePercent = crpStats.stateAchievementPercent;
  } else if (currentUser?.role === 'DEO') {
    activeRoleTitle = 'DEO';
    activeRoleBadgeLabel = 'DEO Statutory Quota';
    activeRoleOfficerQuota = 10;
    activeRoleOfficerCompleted = loggedInOfficer?.completedVisits ?? 7;
    activeRoleOfficerAchievement = loggedInOfficer?.achievementPercent ?? 70.0;
    activeRoleOfficerGap = loggedInOfficer?.visitGap ?? 3;
    activeRoleTargetVisits = 10;
    activeRoleActualVisits = 7;
    activeRoleAchievementPercent = 70.0;
    activeRoleVisitGap = 3;
    cadreAveragePercent = deoStats.stateAchievementPercent;
  } else if (currentUser?.role === 'HEADMASTER') {
    activeRoleTitle = 'Headmaster';
    activeRoleBadgeLabel = 'HM School Quota';
    activeRoleOfficerQuota = 22;
    activeRoleOfficerCompleted = 20;
    activeRoleOfficerAchievement = 90.9;
    activeRoleOfficerGap = 2;
    activeRoleTargetVisits = 22;
    activeRoleActualVisits = 20;
    activeRoleAchievementPercent = 90.9;
    activeRoleVisitGap = 2;
    cadreAveragePercent = 90.9;
  } else if (currentUser?.role === 'TEACHER') {
    activeRoleTitle = 'Teacher';
    activeRoleBadgeLabel = 'Class Diagnostic Quota';
    activeRoleOfficerQuota = 30;
    activeRoleOfficerCompleted = 25;
    activeRoleOfficerAchievement = 83.3;
    activeRoleOfficerGap = 5;
    activeRoleTargetVisits = 30;
    activeRoleActualVisits = 25;
    activeRoleAchievementPercent = 83.3;
    activeRoleVisitGap = 5;
    cadreAveragePercent = 83.3;
  }

  // Subordinate Cadres computation as per Educational Administrative Hierarchy
  interface SubordinateCadreMeta {
    id: string;
    cadre: CadreType | 'SCHOOLS';
    title: string;
    cadreShort: string;
    quotaBadge: string;
    jurisdictionScope: string;
    officersCount: number;
    targetVisits: number;
    actualVisits: number;
    achievementPercent: number;
    visitGap: number;
    onTrackCount: number;
    lagCount: number;
    officersList: SupervisoryCadreOfficer[];
    mandate: string;
  }

  // Pre-filter officers by user's jurisdiction
  const districtSupervisoryOfficers = SUPERVISORY_OFFICERS_DATA.filter(
    o => !currentUser?.districtId || currentUser.districtId === 'AP_ALL' || o.districtId === currentUser.districtId
  );
  const mandalSupervisoryOfficers = SUPERVISORY_OFFICERS_DATA.filter(
    o => (!currentUser?.mandalId || o.mandalId === currentUser.mandalId) && (!currentUser?.districtId || currentUser.districtId === 'AP_ALL' || o.districtId === currentUser.districtId)
  );

  const subordinateCadresList: SubordinateCadreMeta[] = [];

  if (currentUser?.role === 'DY_DEO') {
    // Dy. DEO supervises MEOs and CRPs in her division / district
    const divisionMEOs = districtSupervisoryOfficers.filter(o => o.cadre === 'MEO');
    const divisionCRPs = districtSupervisoryOfficers.filter(o => o.cadre === 'CRP');

    const meoTargetSum = divisionMEOs.reduce((acc, o) => acc + o.monthlyTarget, 0);
    const meoActualSum = divisionMEOs.reduce((acc, o) => acc + o.completedVisits, 0);
    const meoAch = meoTargetSum > 0 ? Math.round((meoActualSum / meoTargetSum) * 1000) / 10 : 78.3;
    const meoOnTrack = divisionMEOs.filter(o => o.status === 'ON_TRACK').length;

    const crpTargetSum = divisionCRPs.reduce((acc, o) => acc + o.monthlyTarget, 0);
    const crpActualSum = divisionCRPs.reduce((acc, o) => acc + o.completedVisits, 0);
    const crpAch = crpTargetSum > 0 ? Math.round((crpActualSum / crpTargetSum) * 1000) / 10 : 80.6;
    const crpOnTrack = divisionCRPs.filter(o => o.status === 'ON_TRACK').length;

    subordinateCadresList.push({
      id: 'sub_meo',
      cadre: 'MEO',
      title: 'MEOs (Mandal Educational Officers)',
      cadreShort: 'MEO',
      quotaBadge: '20 Visits / Month',
      jurisdictionScope: 'Division Jurisdictional Mandals (Guntur Division)',
      officersCount: divisionMEOs.length,
      targetVisits: meoTargetSum,
      actualVisits: meoActualSum,
      achievementPercent: meoAch,
      visitGap: Math.max(0, meoTargetSum - meoActualSum),
      onTrackCount: meoOnTrack,
      lagCount: divisionMEOs.length - meoOnTrack,
      officersList: divisionMEOs,
      mandate: 'Primary school comprehensive audits, teacher pedagogy verification, TLM kits & attendance.'
    });

    subordinateCadresList.push({
      id: 'sub_crp',
      cadre: 'CRP',
      title: 'CRPs (Cluster Resource Persons)',
      cadreShort: 'CRP',
      quotaBadge: '30 Visits / Month',
      jurisdictionScope: 'Division Jurisdictional Clusters (Guntur Division)',
      officersCount: divisionCRPs.length,
      targetVisits: crpTargetSum,
      actualVisits: crpActualSum,
      achievementPercent: crpAch,
      visitGap: Math.max(0, crpTargetSum - crpActualSum),
      onTrackCount: crpOnTrack,
      lagCount: divisionCRPs.length - crpOnTrack,
      officersList: divisionCRPs,
      mandate: 'Daily school visits, classroom co-teaching, and 1-on-1 diagnostic assessment of min 5 sampled students.'
    });
  } else if (currentUser?.role === 'MEO') {
    // MEO supervises CRPs in his mandal + mandal schools
    const mandalCRPs = mandalSupervisoryOfficers.filter(o => o.cadre === 'CRP');
    const crpTargetSum = mandalCRPs.reduce((acc, o) => acc + o.monthlyTarget, 0);
    const crpActualSum = mandalCRPs.reduce((acc, o) => acc + o.completedVisits, 0);
    const crpAch = crpTargetSum > 0 ? Math.round((crpActualSum / crpTargetSum) * 1000) / 10 : 80.8;
    const crpOnTrack = mandalCRPs.filter(o => o.status === 'ON_TRACK').length;

    subordinateCadresList.push({
      id: 'sub_crp',
      cadre: 'CRP',
      title: 'CRPs in Mandal (Cluster Resource Persons)',
      cadreShort: 'CRP',
      quotaBadge: '30 Visits / Month',
      jurisdictionScope: `${activeMandal?.name || 'Mangalagiri'} Mandal Clusters`,
      officersCount: mandalCRPs.length,
      targetVisits: crpTargetSum,
      actualVisits: crpActualSum,
      achievementPercent: crpAch,
      visitGap: Math.max(0, crpTargetSum - crpActualSum),
      onTrackCount: crpOnTrack,
      lagCount: mandalCRPs.length - crpOnTrack,
      officersList: mandalCRPs,
      mandate: 'Daily classroom observation, phonics drills, and 1-on-1 assessment in mandal primary schools.'
    });

    const mandalSchoolsVisited = scopedSchools.filter(s => s.visitsThisMonth > 0).length;
    const mandalSchoolsPending = Math.max(0, scopedSchools.length - mandalSchoolsVisited);
    const mandalSchoolsPct = scopedSchools.length > 0 ? Math.round((mandalSchoolsVisited / scopedSchools.length) * 1000) / 10 : 75.0;

    subordinateCadresList.push({
      id: 'sub_schools',
      cadre: 'SCHOOLS',
      title: 'Primary Schools & Headmasters in Mandal',
      cadreShort: 'Schools',
      quotaBadge: '100% Monthly Coverage',
      jurisdictionScope: `${scopedSchools.length} Primary Schools in ${activeMandal?.name || 'Mangalagiri'}`,
      officersCount: scopedSchools.length,
      targetVisits: scopedSchools.length,
      actualVisits: mandalSchoolsVisited,
      achievementPercent: mandalSchoolsPct,
      visitGap: mandalSchoolsPending,
      onTrackCount: mandalSchoolsVisited,
      lagCount: mandalSchoolsPending,
      officersList: [],
      mandate: 'Every primary school must receive at least 1 inspection per month. Mandatory visit to SPS >= 70 critical schools.'
    });
  } else if (currentUser?.role === 'CRP') {
    // CRP field delivery tier: Cluster schools and diagnostic quotas
    subordinateCadresList.push({
      id: 'sub_cluster_schools',
      cadre: 'SCHOOLS',
      title: 'Kaza Cluster Primary Schools & HMs',
      cadreShort: 'Schools',
      quotaBadge: 'Daily School Visits (30/mo)',
      jurisdictionScope: 'Kaza Cluster (6 Schools Monitored)',
      officersCount: 6,
      targetVisits: 30,
      actualVisits: 24,
      achievementPercent: 80.0,
      visitGap: 6,
      onTrackCount: 6,
      lagCount: 0,
      officersList: [],
      mandate: 'Daily school co-teaching, Telugu Guninthalu & English CVC phonics mentoring, and minimum 5 sampled students assessed per visit.'
    });
  } else if (currentUser?.role === 'HEADMASTER') {
    // Headmaster supervises primary classrooms & teachers
    subordinateCadresList.push({
      id: 'sub_teachers',
      cadre: 'SCHOOLS',
      title: 'Primary Classrooms & Teachers',
      cadreShort: 'Teachers',
      quotaBadge: 'Daily Pedagogy & FLN Drills',
      jurisdictionScope: 'MPPS Kaza Main (Classes 1 to 5)',
      officersCount: 5,
      targetVisits: 22,
      actualVisits: 20,
      achievementPercent: 90.9,
      visitGap: 2,
      onTrackCount: 5,
      lagCount: 0,
      officersList: [],
      mandate: 'Daily foundational literacy and numeracy classroom instruction, teacher lesson plans, and TLM kit utilization.'
    });
    subordinateCadresList.push({
      id: 'sub_students',
      cadre: 'SCHOOLS',
      title: 'Enrolled Primary Students (Class 1–5)',
      cadreShort: 'Students',
      quotaBadge: '1-on-1 FLN Diagnostic Quota',
      jurisdictionScope: '155 Enrolled Primary Students',
      officersCount: 155,
      targetVisits: 155,
      actualVisits: 124,
      achievementPercent: 80.0,
      visitGap: 31,
      onTrackCount: 124,
      lagCount: 31,
      officersList: [],
      mandate: '1-on-1 diagnostic evaluations in Telugu reading fluency, English word decoding, and foundational numeracy.'
    });
  } else if (currentUser?.role === 'TEACHER') {
    // Teacher delivers 1-on-1 FLN diagnostics in Class 3-A
    subordinateCadresList.push({
      id: 'sub_class3a',
      cadre: 'SCHOOLS',
      title: 'Class 3-A Primary Students',
      cadreShort: 'Students',
      quotaBadge: 'Monthly Diagnostic Tracking',
      jurisdictionScope: '30 Students in Class 3 Section A',
      officersCount: 30,
      targetVisits: 30,
      actualVisits: 25,
      achievementPercent: 83.3,
      visitGap: 5,
      onTrackCount: 25,
      lagCount: 5,
      officersList: [],
      mandate: 'Individual student learning trajectory tracking in Telugu reading fluency, English decoding, and arithmetic.'
    });
  } else if (currentUser?.role === 'DEO') {
    // DEO supervises Dy. DEO, MEO, and CRP in the district
    const distDyDEOs = districtSupervisoryOfficers.filter(o => o.cadre === 'DY_DEO');
    const distMEOs = districtSupervisoryOfficers.filter(o => o.cadre === 'MEO');
    const distCRPs = districtSupervisoryOfficers.filter(o => o.cadre === 'CRP');

    const dyDeoTargetSum = distDyDEOs.reduce((acc, o) => acc + o.monthlyTarget, 0);
    const dyDeoActualSum = distDyDEOs.reduce((acc, o) => acc + o.completedVisits, 0);
    const dyDeoAch = dyDeoTargetSum > 0 ? Math.round((dyDeoActualSum / dyDeoTargetSum) * 1000) / 10 : 76.7;

    const meoTargetSum = distMEOs.reduce((acc, o) => acc + o.monthlyTarget, 0);
    const meoActualSum = distMEOs.reduce((acc, o) => acc + o.completedVisits, 0);
    const meoAch = meoTargetSum > 0 ? Math.round((meoActualSum / meoTargetSum) * 1000) / 10 : 78.3;

    const crpTargetSum = distCRPs.reduce((acc, o) => acc + o.monthlyTarget, 0);
    const crpActualSum = distCRPs.reduce((acc, o) => acc + o.completedVisits, 0);
    const crpAch = crpTargetSum > 0 ? Math.round((crpActualSum / crpTargetSum) * 1000) / 10 : 80.6;

    subordinateCadresList.push({
      id: 'sub_dydeo',
      cadre: 'DY_DEO',
      title: 'Dy. DEOs in District (Deputy DEOs)',
      cadreShort: 'Dy. DEO',
      quotaBadge: '15 Visits / Month',
      jurisdictionScope: 'Guntur & Tenali Educational Divisions',
      officersCount: distDyDEOs.length,
      targetVisits: dyDeoTargetSum,
      actualVisits: dyDeoActualSum,
      achievementPercent: dyDeoAch,
      visitGap: Math.max(0, dyDeoTargetSum - dyDeoActualSum),
      onTrackCount: distDyDEOs.filter(o => o.status === 'ON_TRACK').length,
      lagCount: distDyDEOs.filter(o => o.status !== 'ON_TRACK').length,
      officersList: distDyDEOs,
      mandate: 'Division audits, complex clusters review, and SPS >= 70 critical schools inspection.'
    });

    subordinateCadresList.push({
      id: 'sub_meo',
      cadre: 'MEO',
      title: 'MEOs in District (Mandal Educational Officers)',
      cadreShort: 'MEO',
      quotaBadge: '20 Visits / Month',
      jurisdictionScope: 'District Mandals (Mangalagiri, Tadepalli, etc.)',
      officersCount: distMEOs.length,
      targetVisits: meoTargetSum,
      actualVisits: meoActualSum,
      achievementPercent: meoAch,
      visitGap: Math.max(0, meoTargetSum - meoActualSum),
      onTrackCount: distMEOs.filter(o => o.status === 'ON_TRACK').length,
      lagCount: distMEOs.filter(o => o.status !== 'ON_TRACK').length,
      officersList: distMEOs,
      mandate: 'Comprehensive mandal school inspections, teacher attendance & TLM math kits.'
    });

    subordinateCadresList.push({
      id: 'sub_crp',
      cadre: 'CRP',
      title: 'CRPs in District (Cluster Resource Persons)',
      cadreShort: 'CRP',
      quotaBadge: '30 Visits / Month',
      jurisdictionScope: 'District School Clusters',
      officersCount: distCRPs.length,
      targetVisits: crpTargetSum,
      actualVisits: crpActualSum,
      achievementPercent: crpAch,
      visitGap: Math.max(0, crpTargetSum - crpActualSum),
      onTrackCount: distCRPs.filter(o => o.status === 'ON_TRACK').length,
      lagCount: distCRPs.filter(o => o.status !== 'ON_TRACK').length,
      officersList: distCRPs,
      mandate: 'Daily school visits, co-teaching & 1-on-1 student assessment diagnostics.'
    });
  } else {
    // State Leadership / Admin: Full state hierarchy (DEO, Dy. DEO, MEO, CRP)
    subordinateCadresList.push({
      id: 'sub_deo',
      cadre: 'DEO',
      title: 'DEOs (District Educational Officers)',
      cadreShort: 'DEO',
      quotaBadge: '10 Visits / Month',
      jurisdictionScope: 'All 28 Districts of Andhra Pradesh',
      officersCount: deoStats.stateOfficersCount,
      targetVisits: deoStats.stateTargetVisits,
      actualVisits: deoStats.stateActualVisits,
      achievementPercent: deoStats.stateAchievementPercent,
      visitGap: deoStats.stateTargetVisits - deoStats.stateActualVisits,
      onTrackCount: 22,
      lagCount: 6,
      officersList: SUPERVISORY_OFFICERS_DATA.filter(o => o.cadre === 'DEO'),
      mandate: 'District administration, cross-mandal compliance audits, addressing chronic lag mandals.'
    });

    subordinateCadresList.push({
      id: 'sub_dydeo',
      cadre: 'DY_DEO',
      title: 'Dy. DEOs (Deputy Educational Officers)',
      cadreShort: 'Dy. DEO',
      quotaBadge: '15 Visits / Month',
      jurisdictionScope: '75 Educational Divisions Statewide',
      officersCount: dyDeoStats.stateOfficersCount,
      targetVisits: dyDeoStats.stateTargetVisits,
      actualVisits: dyDeoStats.stateActualVisits,
      achievementPercent: dyDeoStats.stateAchievementPercent,
      visitGap: dyDeoStats.stateTargetVisits - dyDeoStats.stateActualVisits,
      onTrackCount: 59,
      lagCount: 16,
      officersList: SUPERVISORY_OFFICERS_DATA.filter(o => o.cadre === 'DY_DEO'),
      mandate: 'High-need primary sections, complex clusters, and SPS >= 70 Critical schools.'
    });

    subordinateCadresList.push({
      id: 'sub_meo',
      cadre: 'MEO',
      title: 'MEOs (Mandal Educational Officers)',
      cadreShort: 'MEO',
      quotaBadge: '20 Visits / Month',
      jurisdictionScope: '679 Mandals Statewide',
      officersCount: meoStats.stateOfficersCount,
      targetVisits: meoStats.stateTargetVisits,
      actualVisits: meoStats.stateActualVisits,
      achievementPercent: meoStats.stateAchievementPercent,
      visitGap: meoStats.stateTargetVisits - meoStats.stateActualVisits,
      onTrackCount: 551,
      lagCount: 128,
      officersList: SUPERVISORY_OFFICERS_DATA.filter(o => o.cadre === 'MEO'),
      mandate: 'Comprehensive primary school monitoring, TLM kits & teacher pedagogical drills.'
    });

    subordinateCadresList.push({
      id: 'sub_crp',
      cadre: 'CRP',
      title: 'CRPs (Cluster Resource Persons)',
      cadreShort: 'CRP',
      quotaBadge: '30 Visits / Month',
      jurisdictionScope: '3,450 School Clusters Statewide',
      officersCount: crpStats.stateOfficersCount,
      targetVisits: crpStats.stateTargetVisits,
      actualVisits: crpStats.stateActualVisits,
      achievementPercent: crpStats.stateAchievementPercent,
      visitGap: crpStats.stateTargetVisits - crpStats.stateActualVisits,
      onTrackCount: 2842,
      lagCount: 608,
      officersList: SUPERVISORY_OFFICERS_DATA.filter(o => o.cadre === 'CRP'),
      mandate: 'Daily school visits, co-teaching, and 1-on-1 assessment of min 5 sampled students per class visit.'
    });
  }

  // --------------------------------------------------------------------------
  // HIERARCHY RANKING & DOWNWARDS-ONLY FILTERING
  // Upper cadres and same-tier peers are strictly hidden per administrative protocol
  // --------------------------------------------------------------------------
  const CADRE_RANK: Record<string, number> = {
    STATE_LEADERSHIP: 0,
    ADMIN: 0,
    DEO: 1,
    DY_DEO: 2,
    MEO: 3,
    CRP: 4,
    HEADMASTER: 5,
    TEACHER: 6,
  };
  const activeUserRank = CADRE_RANK[currentUser?.role || 'STATE_LEADERSHIP'] ?? 0;

  const hierarchyFullSteps = [
    { role: 'STATE_LEADERSHIP', label: '1. State Apex (SPD/DSE)', quota: 'Policy' },
    { role: 'DEO', label: '2. District (DEO)', quota: '10/mo' },
    { role: 'DY_DEO', label: '3. Division (Dy. DEO)', quota: '15/mo' },
    { role: 'MEO', label: '4. Mandal (MEO)', quota: '20/mo' },
    { role: 'CRP', label: '5. Cluster (CRP)', quota: '30/mo' },
    { role: 'HEADMASTER', label: '6. Primary School (HM/Teacher)', quota: 'Coverage' },
  ];

  // Visible hierarchy chain: Only the active supervising persona (as owner) and downwards
  const visibleHierarchySteps = hierarchyFullSteps.filter(step => {
    const stepRank = CADRE_RANK[step.role] ?? 99;
    return stepRank >= activeUserRank;
  });

  // Filtered list of supervisory officers (Strictly downward cadres)
  const searchedSupervisoryOfficers = SUPERVISORY_OFFICERS_DATA.filter(officer => {
    const officerRank = CADRE_RANK[officer.cadre] ?? 99;

    // RULE: Upper cadres and same-rank officers must NEVER be visible in downwards reporting
    if (officerRank <= activeUserRank) {
      return false;
    }

    // Jurisdictional boundary matching
    if (currentUser?.role === 'DEO') {
      if (currentUser.districtId && officer.districtId !== currentUser.districtId) return false;
    } else if (currentUser?.role === 'DY_DEO') {
      if (currentUser.districtId && officer.districtId !== currentUser.districtId) return false;
    } else if (currentUser?.role === 'MEO') {
      if (currentUser.mandalId && officer.mandalId !== currentUser.mandalId) return false;
    } else if (currentUser?.role === 'CRP') {
      if (currentUser.clusterId && officer.clusterId !== currentUser.clusterId) return false;
    }

    // Specific cadre filter pill
    if (selectedCadreFilter !== 'ALL' && selectedCadreFilter !== 'SUBORDINATES') {
      if (officer.cadre !== selectedCadreFilter) return false;
    }

    if (!cadreSearchQuery.trim()) return true;
    const q = cadreSearchQuery.toLowerCase();
    return (
      officer.name.toLowerCase().includes(q) ||
      officer.designation.toLowerCase().includes(q) ||
      officer.districtName.toLowerCase().includes(q) ||
      (officer.mandalName && officer.mandalName.toLowerCase().includes(q)) ||
      (officer.divisionName && officer.divisionName.toLowerCase().includes(q)) ||
      (officer.clusterName && officer.clusterName.toLowerCase().includes(q))
    );
  });

  // Student assessment coverage percent (Students assessed vs Total eligible)
  const studentCoveragePercent = totalEligibleStudents > 0 
    ? Math.round((totalUniqueStudentsAssessed / totalEligibleStudents) * 1000) / 10 
    : 0;
  const studentAssessmentGap = Math.max(0, totalEligibleStudents - totalUniqueStudentsAssessed);

  // Live assessment records update if present in state
  let liveAvgTelugu = avgTeluguScore;
  let liveAvgEnglish = avgEnglishScore;
  let liveAvgNumeracy = avgNumeracyScore;
  let teluguMasteryRate = activeLevel === 'MANDAL' ? 73.0 : activeLevel === 'DISTRICT' ? 73.5 : 74.2;
  let englishMasteryRate = activeLevel === 'MANDAL' ? 66.0 : activeLevel === 'DISTRICT' ? 67.5 : 68.4;
  let numeracyMasteryRate = activeLevel === 'MANDAL' ? 55.0 : activeLevel === 'DISTRICT' ? 56.0 : 56.4;

  if (assessmentRecords.length > 0) {
    const telSum = assessmentRecords.reduce((acc, r) => acc + ((r.literacyScore / (r.literacyMax || 30)) * 100), 0);
    const engSum = assessmentRecords.reduce((acc, r) => acc + (((r.englishScore ?? (r.literacyScore * 0.95)) / (r.englishMax || 30)) * 100), 0);
    const numSum = assessmentRecords.reduce((acc, r) => acc + ((r.numeracyScore / (r.numeracyMax || 30)) * 100), 0);
    liveAvgTelugu = Math.round((telSum / assessmentRecords.length) * 10) / 10;
    liveAvgEnglish = Math.round((engSum / assessmentRecords.length) * 10) / 10;
    liveAvgNumeracy = Math.round((numSum / assessmentRecords.length) * 10) / 10;

    const telPass = assessmentRecords.filter(r => ((r.literacyScore / (r.literacyMax || 30)) * 100) >= 70).length;
    const engPass = assessmentRecords.filter(r => (((r.englishScore ?? (r.literacyScore * 0.95)) / (r.englishMax || 30)) * 100) >= 70).length;
    const numPass = assessmentRecords.filter(r => ((r.numeracyScore / (r.numeracyMax || 30)) * 100) >= 70).length;
    teluguMasteryRate = Math.round((telPass / assessmentRecords.length) * 1000) / 10;
    englishMasteryRate = Math.round((engPass / assessmentRecords.length) * 1000) / 10;
    numeracyMasteryRate = Math.round((numPass / assessmentRecords.length) * 1000) / 10;
  }

  // Composite FLN Average
  const compositeFLNScore = Math.round(((liveAvgTelugu * 0.35) + (liveAvgEnglish * 0.35) + (liveAvgNumeracy * 0.30)) * 10) / 10;

  // --------------------------------------------------------------------------
  // GRADE-WISE PERFORMANCE DATA (Classes 1 to 5) — TELUGU, ENGLISH, NUMERACY
  // --------------------------------------------------------------------------
  const gradeBaselines = [
    { 
      grade: 1, 
      name: 'Class 1', 
      fullName: 'Class 1 (Grade 1)', 
      stage: 'Foundational Stage (Balvatika - 2)', 
      telDelta: 4.5, 
      engDelta: 3.2, 
      numDelta: 4.8, 
      telMastery: 78.5, 
      engMastery: 72.0, 
      numMastery: 73.2, 
      keyTelCompetency: 'Read 2-letter words with Matras & write 2-letter words', 
      keyEngCompetency: 'Read small sentences with 2-letter words & write 2-letter words', 
      keyNumCompetency: 'Simple numeric addition and subtraction with 1-digit numbers' 
    },
    { 
      grade: 2, 
      name: 'Class 2', 
      fullName: 'Class 2 (Grade 2)', 
      stage: 'Foundational Stage', 
      telDelta: 2.0, 
      engDelta: 1.0, 
      numDelta: 0.6, 
      telMastery: 75.0, 
      engMastery: 68.5, 
      numMastery: 67.5, 
      keyTelCompetency: 'Read simple sentences (2–3 letter words) at 10 WCPM & write short sentences', 
      keyEngCompetency: 'Read short paragraphs (2–3 letter words) at 10 WCPM & write short sentences', 
      keyNumCompetency: 'Addition and subtraction with 1-digit numbers' 
    },
    { 
      grade: 3, 
      name: 'Class 3', 
      fullName: 'Class 3 (Grade 3 ⭐ NIPUN Gateway)', 
      stage: 'Critical Gateway Stage', 
      telDelta: -1.8, 
      engDelta: -2.8, 
      numDelta: -4.5, 
      telMastery: 70.4, 
      engMastery: 64.2, 
      numMastery: 58.2, 
      keyTelCompetency: 'Read simple stories (20 words) in Telugu at 30 WCPM & write short sentences (3–4 letter words)', 
      keyEngCompetency: 'Read short paragraphs (3–4 letter words) at 30 WCPM & write sentences with 4–5 letter words', 
      keyNumCompetency: 'Simple addition, subtraction (2 by 1), multiplication, division (1 by 1)' 
    },
    { 
      grade: 4, 
      name: 'Class 4', 
      fullName: 'Class 4 (Grade 4)', 
      stage: 'Preparatory Stage', 
      telDelta: 0.8, 
      engDelta: -0.5, 
      numDelta: -2.2, 
      telMastery: 73.2, 
      engMastery: 67.0, 
      numMastery: 62.4, 
      keyTelCompetency: 'Read simple stories in (30 words) Telugu at 30 WCPM & write short sentences (3–4 letter words)', 
      keyEngCompetency: 'Read short paragraphs (3–4 letter words) at 30 WCPM & write sentences with 4–5 letter words', 
      keyNumCompetency: 'Simple Addition, Subtractions (2 by 1), multiplication, division (1 by 1)' 
    },
    { 
      grade: 5, 
      name: 'Class 5', 
      fullName: 'Class 5 (Grade 5)', 
      stage: 'Preparatory Stage', 
      telDelta: 3.0, 
      engDelta: 1.5, 
      numDelta: -0.8, 
      telMastery: 76.8, 
      engMastery: 70.5, 
      numMastery: 64.9, 
      keyTelCompetency: 'Read simple stories in (40 words) Telugu at 30 WCPM & write short sentences (3–4 letter words)', 
      keyEngCompetency: 'Read short paragraphs (3–4 letter words) at 30 WCPM & write sentences with 4–5 letter words', 
      keyNumCompetency: 'Simple Addition, Subtractions (2 by 2), multiplication, division (1 by 1)' 
    },
  ];

  const gradeMetrics = gradeBaselines.map(gb => {
    const classRecords = assessmentRecords.filter(r => r.classNumber === gb.grade);
    let avgTel = Math.min(100, Math.max(30, Math.round((liveAvgTelugu + gb.telDelta) * 10) / 10));
    let avgEng = Math.min(100, Math.max(30, Math.round((liveAvgEnglish + gb.engDelta) * 10) / 10));
    let avgNum = Math.min(100, Math.max(30, Math.round((liveAvgNumeracy + gb.numDelta) * 10) / 10));
    let telMastery = Math.min(100, Math.max(20, Math.round((teluguMasteryRate + (gb.telMastery - 74.2)) * 10) / 10));
    let engMastery = Math.min(100, Math.max(20, Math.round((englishMasteryRate + (gb.engMastery - 68.4)) * 10) / 10));
    let numMastery = Math.min(100, Math.max(20, Math.round((numeracyMasteryRate + (gb.numMastery - 56.4)) * 10) / 10));

    if (classRecords.length > 0) {
      const telSum = classRecords.reduce((acc, r) => acc + ((r.literacyScore / (r.literacyMax || 30)) * 100), 0);
      const engSum = classRecords.reduce((acc, r) => acc + (((r.englishScore ?? (r.literacyScore * 0.95)) / (r.englishMax || 30)) * 100), 0);
      const numSum = classRecords.reduce((acc, r) => acc + ((r.numeracyScore / (r.numeracyMax || 30)) * 100), 0);
      avgTel = Math.round((telSum / classRecords.length) * 10) / 10;
      avgEng = Math.round((engSum / classRecords.length) * 10) / 10;
      avgNum = Math.round((numSum / classRecords.length) * 10) / 10;
      const telPass = classRecords.filter(r => ((r.literacyScore / (r.literacyMax || 30)) * 100) >= 70).length;
      const engPass = classRecords.filter(r => (((r.englishScore ?? (r.literacyScore * 0.95)) / (r.englishMax || 30)) * 100) >= 70).length;
      const numPass = classRecords.filter(r => ((r.numeracyScore / (r.numeracyMax || 30)) * 100) >= 70).length;
      telMastery = Math.round((telPass / classRecords.length) * 1000) / 10;
      engMastery = Math.round((engPass / classRecords.length) * 1000) / 10;
      numMastery = Math.round((numPass / classRecords.length) * 1000) / 10;
    }

    const estimatedAssessed = Math.round(totalUniqueStudentsAssessed / 5);

    return {
      ...gb,
      avgTel,
      avgEng,
      avgNum,
      telMastery,
      engMastery,
      numMastery,
      languageGap: Math.round((avgTel - avgEng) * 10) / 10,
      mathGap: Math.round((avgTel - avgNum) * 10) / 10,
      studentsAssessed: classRecords.length > 0 ? classRecords.length : estimatedAssessed
    };
  });

  // Monitored schools count in scope
  const schoolsAssessedCount = activeLevel === 'MANDAL'
    ? scopedSchools.filter(s => s.visitsThisMonth > 0).length
    : activeLevel === 'DISTRICT'
    ? (activeDistrict ? activeDistrict.visitedSchoolsThisMonth : scopedSchools.filter(s => s.visitsThisMonth > 0).length)
    : DISTRICTS_DATA.reduce((acc, d) => acc + d.visitedSchoolsThisMonth, 0);

  const schoolsAssessedPercentage = totalSchools > 0 
    ? Math.round((schoolsAssessedCount / totalSchools) * 1000) / 10 
    : 0;
  const schoolsPendingAssessment = Math.max(0, totalSchools - schoolsAssessedCount);

  // Search filtered rows (All 28 districts)
  const searchedDistricts = DISTRICTS_DATA.filter(d => 
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) || d.code.includes(searchQuery)
  );

  const searchedMandals = availableMandals.filter(m =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const searchedSchools = scopedSchools.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.udiseCode.includes(searchQuery) ||
    s.mandalName.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));

  return (
    <div className="space-y-4 pb-12 font-sans">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. PERSISTENT SCOPE & FILTER BAR (Hierarchy + All 28 Districts) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm transition-all duration-200">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          
          {/* Hierarchy Level Controls */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mr-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-700" />
              <span>Scope:</span>
            </div>

            <div className="inline-flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
              {(currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN') && (
                <button
                  type="button"
                  onClick={() => handleToggleLevel('STATE')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeLevel === 'STATE'
                      ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>State (28 Districts)</span>
                </button>
              )}

              {(currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN' || currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO') && (
                <button
                  type="button"
                  onClick={() => handleToggleLevel('DISTRICT')}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    activeLevel === 'DISTRICT'
                      ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 text-blue-700" />
                  <span>{currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO' ? `${activeDistrict?.name || 'Guntur'} District Scope` : 'District Level'}</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => handleToggleLevel('MANDAL')}
                className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeLevel === 'MANDAL'
                    ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200/80'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5 text-amber-700" />
                <span>{currentUser?.role === 'MEO' ? `${activeMandal?.name || 'Mangalagiri'} Mandal Scope` : currentUser?.role === 'CRP' ? `${activeMandal?.name || 'Mangalagiri'} Cluster Scope` : 'Mandal Level'}</span>
              </button>
            </div>
          </div>

          {/* Dynamic Dropdowns for Jurisdiction Scope */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* District Selector */}
            <div className="flex items-center gap-1.5">
              <label htmlFor="district-select" className="text-slate-500 font-medium">District:</label>
              {currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO' || currentUser?.role === 'MEO' || currentUser?.role === 'CRP' ? (
                <span className="border border-emerald-300 bg-emerald-50 px-2.5 py-1.5 rounded-lg text-emerald-950 font-semibold text-xs">
                  {activeDistrict?.name || 'Guntur'} District (Assigned)
                </span>
              ) : (
                <select
                  id="district-select"
                  value={selectedDistrictId}
                  onChange={(e) => handleDistrictChange(e.target.value)}
                  className={`border rounded-lg px-2.5 py-1.5 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
                    activeLevel === 'STATE' 
                      ? 'bg-slate-50 border-slate-300 text-slate-700' 
                      : 'bg-emerald-50/80 border-emerald-300 text-emerald-900 font-semibold'
                  }`}
                >
                  <option value="ALL">All Districts</option>
                  {DISTRICTS_DATA.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              )}
            </div>

            {/* Mandal Selector */}
            {selectedDistrictId !== 'ALL' && (
              <div className="flex items-center gap-1.5">
                <label htmlFor="mandal-select" className="text-slate-500 font-medium">Mandal:</label>
                {currentUser?.role === 'MEO' || currentUser?.role === 'CRP' ? (
                  <span className="border border-amber-300 bg-amber-50 px-2.5 py-1.5 rounded-lg text-amber-950 font-semibold text-xs">
                    {activeMandal?.name || 'Mangalagiri'} Mandal (Assigned)
                  </span>
                ) : (
                  <select
                    id="mandal-select"
                    value={selectedMandalId}
                    onChange={(e) => handleMandalChange(e.target.value)}
                    className={`border rounded-lg px-2.5 py-1.5 font-medium text-xs focus:ring-2 focus:ring-emerald-500 focus:outline-none transition-colors ${
                      activeLevel === 'MANDAL' 
                        ? 'bg-amber-50/80 border-amber-300 text-amber-900 font-semibold' 
                        : 'bg-slate-50 border-slate-300 text-slate-700'
                    }`}
                  >
                    <option value="ALL">All Mandals</option>
                    {availableMandals.map(m => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {/* Conditional School Selector when Mandal is chosen */}
            {selectedMandalId !== 'ALL' && (
              <div className="flex items-center gap-1.5">
                <label htmlFor="school-select" className="text-slate-500 font-medium">School:</label>
                <select
                  id="school-select"
                  value={selectedSchoolId}
                  onChange={(e) => setSelectedSchoolId(e.target.value)}
                  className={`border rounded-lg px-2.5 py-1.5 font-medium text-xs focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors max-w-[210px] ${
                    selectedSchoolId !== 'ALL'
                      ? 'bg-blue-50 border-blue-400 text-blue-900 font-semibold'
                      : 'bg-slate-50 border-slate-300 text-slate-700'
                  }`}
                >
                  <option value="ALL">All Schools ({scopedSchools.length})</option>
                  {scopedSchools.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.category})</option>
                  ))}
                </select>
              </div>
            )}

            {/* Reset Scope Button */}
            {((currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN') && (activeLevel !== 'STATE' || selectedDistrictId !== 'ALL' || selectedMandalId !== 'ALL' || selectedSchoolId !== 'ALL')) ||
             ((currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO') && (activeLevel !== 'DISTRICT' || selectedMandalId !== 'ALL' || selectedSchoolId !== 'ALL')) ||
             (selectedSchoolId !== 'ALL') ? (
              <button
                type="button"
                onClick={handleResetToState}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
                title="Reset Scope to Base Authority Level"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset Scope</span>
              </button>
            ) : null}

            {/* Enrolment Visit Priority Guide Trigger */}
            <button
              type="button"
              onClick={() => setShowSPSModal(true)}
              className="px-2.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-900 rounded-lg text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1"
              title="Official Visit Priority Policy: Class 1–5 Enrolment (Role-Based Scoping)"
            >
              <HelpCircle className="w-3.5 h-3.5 text-indigo-700" />
              <span>Visit Priority Policy</span>
            </button>
          </div>
        </div>

        {/* Active Scope Sub-Bar */}
        <div className="mt-2.5 pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between text-xs text-slate-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Active Scope:</span>
            <span className="font-bold text-slate-900 flex items-center gap-1.5">
              {activeLevel === 'STATE' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-600" />
                  <span>Statewide Overview (All 28 Districts of Andhra Pradesh)</span>
                </>
              )}
              {activeLevel === 'DISTRICT' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                  <span>District View: {activeDistrict?.name || 'Selected District'}</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    ({availableMandals.length} Mandals · {totalSchools.toLocaleString()} Schools)
                  </span>
                </>
              )}
              {activeLevel === 'MANDAL' && (
                <>
                  <span className="w-2 h-2 rounded-full bg-amber-600" />
                  <span>Mandal View: {activeMandal?.name || 'Selected Mandal'} ({activeDistrict?.name || 'District'})</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    ({scopedSchools.length} Schools monitored)
                  </span>
                </>
              )}
            </span>
          </div>

          <div className="text-[11px] text-slate-500">
            Academic Cycle: <strong className="text-slate-800">{config.currentMonthYear}</strong> · Academic Year {config.academicYear}
          </div>
        </div>

        {/* Conditional School Spotlight Card (Seamless link to Field App) */}
        {selectedSchoolId !== 'ALL' && (() => {
          const spotlightSchool = scopedSchools.find(s => s.id === selectedSchoolId);
          if (!spotlightSchool) return null;
          return (
            <div className="mt-3 p-3.5 bg-gradient-to-r from-blue-50/90 via-white to-blue-50/70 border border-blue-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs animate-in fade-in">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-700 text-white uppercase tracking-wider">
                    School Selected
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{spotlightSchool.name}</h4>
                  <span className="text-xs text-slate-500 font-mono">UDISE: {spotlightSchool.udiseCode}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                    Class 1–5 Enrolment: {spotlightSchool.totalStudents} Students • Visit Rank #{spotlightSchool.enrolmentRank || 1}
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1 flex flex-wrap items-center gap-3">
                  <span>Mandal: <strong className="text-slate-800">{spotlightSchool.mandalName}</strong></span>
                  <span>•</span>
                  <span>HM: <strong className="text-slate-800">{spotlightSchool.headmasterName}</strong></span>
                  <span>•</span>
                  <span>Enrolled: <strong className="text-slate-800">{spotlightSchool.totalStudents}</strong></span>
                  <span>•</span>
                  <span>FLN Score: <strong className="text-emerald-700">{spotlightSchool.lastFLNScore}%</strong></span>
                  <span>•</span>
                  <span>Visits This Month: <strong className="text-blue-700">{spotlightSchool.visitsThisMonth}</strong></span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => onSelectSchoolForVisit(spotlightSchool)}
                  className="px-3.5 py-2 bg-blue-700 hover:bg-blue-600 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1.5"
                >
                  <SchoolIcon className="w-3.5 h-3.5" />
                  <span>Inspect in Field App</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedSchoolId('ALL')}
                  className="px-2.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition-colors cursor-pointer"
                >
                  Clear School
                </button>
              </div>
            </div>
          );
        })()}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. TOP BANNER: ROLE-BASED IDENTITY & QUICK ACTION ADVISORY */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <APGovtLogo size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 tracking-tight">
                FLN Monitoring Command Center
              </h1>
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                28 Districts
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5">
              School Education Department — Government of Andhra Pradesh
            </p>
          </div>
        </div>

        {/* Current Officer Identity & Quick Context */}
        {currentUser && (
          <div className="flex items-center gap-2.5 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200 text-xs self-start md:self-auto">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-slate-900">{currentUser.name}</div>
              <div className="text-[11px] text-slate-500">{currentUser.designation} · Monthly Target: {currentUser.monthlyVisitTarget} Visits</div>
            </div>
          </div>
        )}
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 3. ROLE-DRIVEN QUICK DECISION BRIEFING (Reduces Clutter, Action-Oriented) */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 rounded-xl shadow-xs">
        <div className="flex items-center justify-between pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Role-Based Decision Briefing — {currentUser?.role.replace('_', ' ')}</span>
          </div>
          <span className="text-[11px] text-emerald-300">
            Real-time Supervisory Highlights
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3 text-xs">
          {currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN' ? (
            <>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>1. English Literacy Hotspot</span>
                  </div>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    Kurnool (57.9%) & Polavaram (55.7%) lag State average by &gt;10%. Language specialist taskforce review mandated.
                  </p>
                </div>
                <button 
                  onClick={() => { setDashboardTab('FLN'); handleDistrictChange('DIST_KURNOOL'); }}
                  className="mt-2 text-[11px] font-semibold text-emerald-300 hover:text-white inline-flex items-center gap-1 cursor-pointer self-start"
                >
                  <span>Inspect Kurnool FLN</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white/10 p-3 rounded-lg border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>2. School Visit Deficit Mandals</span>
                  </div>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    Alluri Sitharama Raju (ASR) & Parvathipuram have completed &lt;75% planned inspection visits. Review MEO tour diaries.
                  </p>
                </div>
                <button 
                  onClick={() => { setDashboardTab('VISITS'); handleDistrictChange('DIST_ALLURI'); }}
                  className="mt-2 text-[11px] font-semibold text-emerald-300 hover:text-white inline-flex items-center gap-1 cursor-pointer self-start"
                >
                  <span>Review ASR Visit Ledgers</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="bg-white/10 p-3 rounded-lg border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>3. Student Assessment Quota</span>
                  </div>
                  <p className="text-slate-200 mt-1 leading-relaxed">
                    Overall student assessment coverage is {studentCoveragePercent}%. 8 districts are below the 70% threshold this monthly cycle.
                  </p>
                </div>
                <button 
                  onClick={() => setDashboardTab('FLN')}
                  className="mt-2 text-[11px] font-semibold text-emerald-300 hover:text-white inline-flex items-center gap-1 cursor-pointer self-start"
                >
                  <span>View Student Coverage Table</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </>
          ) : currentUser?.role === 'DY_DEO' ? (
            <>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">1. Dy. DEO Monthly Visit Target: 15 Visits</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  You have completed <strong>{activeRoleOfficerCompleted} of {activeRoleOfficerQuota} visits ({activeRoleOfficerAchievement}%)</strong>. {activeRoleOfficerGap} visits remaining this cycle. Division Cadre: {dyDeoStats.districtActualVisits}/{dyDeoStats.districtTargetVisits} ({dyDeoStats.districtAchievementPercent}%).
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">2. Division High Enrolment Schools ({totalCriticalSchools})</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Schools with highest Class 1–5 enrolment are prioritized for inspection to maximize foundational learning reach across students.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">3. Primary Pedagogical Oversight</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Audit FLN textbooks, workbooks, math TLM kit availability, and teacher lesson plans during classroom visits.
                </p>
              </div>
            </>
          ) : currentUser?.role === 'MEO' ? (
            <>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">1. MEO Monthly Visit Target: 20 Visits</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  You have completed <strong>{activeRoleOfficerCompleted} of {activeRoleOfficerQuota} visits ({activeRoleOfficerAchievement}%)</strong>. {activeRoleOfficerGap} visits remaining in {activeMandal?.name || 'Mandal'}. Mandal Cadre: {meoStats.districtActualVisits}/{meoStats.districtTargetVisits} ({meoStats.districtAchievementPercent}%).
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">2. 100% Primary School Coverage</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Every primary school in the mandal must receive at least 1 inspection per month. Prioritize unvisited schools and zero-coverage clusters.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">3. Action Verification & Remediation</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Verify teacher attendance, MDM quality, classroom observation rubrics, and resolve open school infrastructure action items.
                </p>
              </div>
            </>
          ) : currentUser?.role === 'CRP' ? (
            <>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">1. CRP Daily Visit Target: 30 Visits/Month</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  You have completed <strong>{activeRoleOfficerCompleted} of {activeRoleOfficerQuota} visits ({activeRoleOfficerAchievement}%)</strong>. Daily classroom co-teaching and mentoring in cluster schools mandated.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">2. 1-on-1 Student Assessment Quota</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Statutory requirement: Assess at least 5 sampled students per class visit across Telugu literacy, English literacy & Numeracy.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">3. Teacher Mentoring & Phonics Drills</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Conduct demonstrative reading sessions for Telugu Guninthalu and English CVC decodable words with primary teachers.
                </p>
              </div>
            </>
          ) : currentUser?.role === 'DEO' ? (
            <>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">1. DEO Visit Target: 10 Visits/Month</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Completed <strong>{activeRoleOfficerCompleted} of {activeRoleOfficerQuota} visits ({activeRoleOfficerAchievement}%)</strong>. Lead cross-mandal compliance reviews and address chronic lag schools.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">2. District Supervisory Fleet Overview</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Guntur District Fleet: 3 Dy. DEOs (77.8%), 6 MEOs (81.7%), 38 CRPs (82.6%). Total completed: 1,082 of 1,315 visits (82.3%).
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">3. District High Enrolment Schools ({totalCriticalSchools})</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Dispatch Dy. DEOs and MEOs to schools prioritized by Class 1–5 enrolment for high-impact foundational learning oversight.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">1. Today's Top Priority School</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  MPPS Kaza Main (148 Students in Class 1–5) — Highest enrolment in Kaza Cluster. Tap 'Field App Simulator' to inspect.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">2. Student Assessment Target</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Assess at least 5 new unassessed students in Class 3 for both Telugu & English literacy plus numeracy.
                </p>
              </div>
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300">3. Action Verification</div>
                <p className="text-slate-200 mt-1 leading-relaxed">
                  Verify teacher lesson plans and TLM math kits during classroom observation.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 4. THE TWO CORE DASHBOARD TABS: [FLN] vs [VISITS] */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs">
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setDashboardTab('FLN')}
            className={`py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
              dashboardTab === 'FLN'
                ? 'bg-emerald-700 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. FLN Learning Outcomes (Telugu, English & Numeracy)</span>
          </button>

          <button
            type="button"
            onClick={() => setDashboardTab('VISITS')}
            className={`py-3 px-4 rounded-lg font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2 ${
              dashboardTab === 'VISITS'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200/60'
            }`}
          >
            <SchoolIcon className="w-4 h-4" />
            <span>2. School Visits & Field Monitoring</span>
          </button>
        </div>
      </div>

      {/* ====================================================================== */}
      {/* VIEW A: FLN LEARNING OUTCOMES TAB */}
      {/* ====================================================================== */}
      {dashboardTab === 'FLN' && (
        <div className="space-y-4">
          
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 pb-2">
            <div>
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
                <span>Foundational Learning Diagnostics — Subject Proficiency</span>
              </h2>
              <p className="text-xs text-slate-500">
                Independent subject tracking: Telugu Literacy, English Literacy, and Numeracy.
              </p>
            </div>
            <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200">
              Student Assessment Coverage: <strong className="text-emerald-800 font-bold">{studentCoveragePercent}%</strong> ({totalUniqueStudentsAssessed.toLocaleString()} / {totalEligibleStudents.toLocaleString()} children tested)
            </div>
          </div>

          {/* 4 FLN Diagnostic Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Telugu Literacy */}
            <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    <span>Telugu Literacy</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {teluguMasteryRate >= 70 ? 'Proficient' : 'Developing'}
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-emerald-950 tabular-nums">
                    {teluguMasteryRate}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Mastery Rate (&ge; 70%)
                  </span>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, teluguMasteryRate)}%` }}
                  />
                </div>

                <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
                  <span className="text-slate-500">Average Class Score:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{liveAvgTelugu}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Reading Fluency (ORF)</span>
                <span className="text-emerald-700 font-semibold">60 WPM Standard</span>
              </div>
            </div>

            {/* Card 2: English Literacy (Explicitly Included) */}
            <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Languages className="w-4 h-4 text-indigo-700" />
                    <span>English Literacy</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-100 text-indigo-800">
                    {englishMasteryRate >= 70 ? 'Proficient' : 'Intervention Needed'}
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-indigo-950 tabular-nums">
                    {englishMasteryRate}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Mastery Rate (&ge; 70%)
                  </span>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, englishMasteryRate)}%` }}
                  />
                </div>

                <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
                  <span className="text-slate-500">Average Class Score:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{liveAvgEnglish}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Phonics & Comprehension</span>
                <span className="text-indigo-700 font-semibold">CVC & Fluency</span>
              </div>
            </div>

            {/* Card 3: Foundational Numeracy */}
            <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Calculator className="w-4 h-4 text-blue-700" />
                    <span>Foundational Numeracy</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                    {numeracyMasteryRate >= 70 ? 'Proficient' : 'Remediation Focus'}
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-blue-950 tabular-nums">
                    {numeracyMasteryRate}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Mastery Rate (&ge; 70%)
                  </span>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, numeracyMasteryRate)}%` }}
                  />
                </div>

                <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
                  <span className="text-slate-500">Average Class Score:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{liveAvgNumeracy}%</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Number Operations</span>
                <span className="text-blue-700 font-semibold">Addition & Regrouping</span>
              </div>
            </div>

            {/* Card 4: Student Assessment Coverage (Clarified) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-700" />
                    <span>Student Assessment Coverage</span>
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    1-on-1 Tests
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {studentCoveragePercent}%
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Assessed This Month
                  </span>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, studentCoveragePercent)}%` }}
                  />
                </div>

                <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
                  <span className="text-slate-500">Tested Children:</span>
                  <span className="font-bold text-slate-900 tabular-nums">{totalUniqueStudentsAssessed.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Remaining to Assess:</span>
                <span className="text-amber-700 font-semibold">{studentAssessmentGap.toLocaleString()}</span>
              </div>
            </div>

          </div>

          {/* ====================================================================== */}
          {/* CORE FOUNDATIONAL LEARNING COMPETENCIES (Official Curriculum Framework 2026-27) */}
          {/* ====================================================================== */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 uppercase tracking-wider border border-emerald-200">
                    Official Curriculum Framework
                  </span>
                  <span className="text-xs font-semibold text-slate-500">Academic Year 2026-27</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Award className="w-5 h-5 text-emerald-700 shrink-0" />
                  <span>Core Foundational Learning Competencies</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Grade-wise &amp; subject-wise statutory targets, curriculum goals, and diagnostic student mastery (Classes 1–5).
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start lg:self-auto">
                <div className="text-[11px] text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 hidden sm:block">
                  Benchmark: <strong className="text-slate-800">&ge; 70%</strong> Score
                </div>

                {/* Grade Switcher Tabs right in the header */}
                <div className="flex flex-wrap items-center gap-1 bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                  {[1, 2, 3, 4, 5].map(gNum => (
                    <button
                      key={gNum}
                      type="button"
                      onClick={() => setTargetGradeTab(gNum)}
                      className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                        targetGradeTab === gNum
                          ? 'bg-emerald-700 text-white shadow-xs font-bold'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                      }`}
                    >
                      Class {gNum}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => setTargetGradeTab('MATRIX')}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      targetGradeTab === 'MATRIX'
                        ? 'bg-blue-800 text-white shadow-xs font-bold'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                    }`}
                  >
                    All Grades Matrix
                  </button>
                </div>
              </div>
            </div>

            {/* VIEW 1: Specific Selected Grade Cards */}
            {typeof targetGradeTab === 'number' && (() => {
              const gradeItem = FLN_TARGETS_2026_27.find(t => t.grade === targetGradeTab) || FLN_TARGETS_2026_27[2];
              
              // Calculate live or grade-adjusted averages for the selected grade
              const gradeMetric = gradeMetrics.find(m => m.grade === targetGradeTab);
              const displayTelAvg = gradeMetric ? gradeMetric.avgTel : gradeItem.subjects.telugu.averageScore;
              const displayEngAvg = gradeMetric ? gradeMetric.avgEng : gradeItem.subjects.english.averageScore;
              const displayNumAvg = gradeMetric ? gradeMetric.avgNum : gradeItem.subjects.math.averageScore;

              return (
                <div className="space-y-4">
                  {/* Context Bar */}
                  <div className="text-xs font-bold text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-1 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                      <span>Showing <strong>{gradeItem.gradeLabel}</strong> ({gradeItem.stage}) Official Curriculum Targets &amp; Competencies:</span>
                    </div>
                    <span className="text-[11px] font-normal text-slate-500">
                      Assessment questions strictly aligned to 2026-27 milestone targets
                    </span>
                  </div>

                  {/* 3 Core Subject Panels */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Column 1: Telugu Competencies */}
                    <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-3.5 flex flex-col justify-between shadow-xs">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                          <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                            <BookOpen className="w-4 h-4 text-emerald-700" />
                            <span>{gradeItem.subjects.telugu.subjectTitle}</span>
                          </span>
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-200">
                            Average: {displayTelAvg}%
                          </span>
                        </div>

                        {/* 2026-27 Milestone Target Banner */}
                        <div className="bg-white p-3 rounded-lg border border-emerald-200 space-y-1.5 shadow-2xs">
                          <div className="text-[11px] font-bold text-emerald-900 uppercase tracking-wide flex items-center gap-1">
                            <span className="text-emerald-700">★</span>
                            <span>2026-27 Milestone Target:</span>
                          </div>
                          <ul className="text-xs text-slate-800 space-y-1 list-disc list-inside">
                            {gradeItem.subjects.telugu.target2026_27.map((item, idx) => (
                              <li key={idx} className="font-semibold text-emerald-950">{item}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Long-Term Goal Block */}
                        <div className="p-2.5 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs text-slate-600 space-y-1">
                          <div className="text-[10px] font-bold text-emerald-800 uppercase">Long-Term Goal (లక్ష్యం):</div>
                          <ul className="space-y-0.5 list-disc list-inside text-[11px]">
                            {gradeItem.subjects.telugu.goal.map((g, idx) => (
                              <li key={idx}>{g}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Official Competency Mastery Progress */}
                        <div className="pt-2 border-t border-emerald-200/60 space-y-2.5 text-xs">
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            Official Competencies Breakdown:
                          </div>
                          {gradeItem.subjects.telugu.competencies.map((comp, idx) => {
                            const pct = comp.benchmarkPercent;
                            const barColor = pct >= 70 ? 'bg-emerald-600' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
                            const textColor = pct >= 70 ? 'text-emerald-800' : pct >= 60 ? 'text-amber-700' : 'text-rose-700';
                            return (
                              <div key={comp.id || idx} className="space-y-1 bg-white/70 p-2 rounded-md border border-emerald-100">
                                <div className="flex justify-between items-start gap-1 text-[11px]">
                                  <span className="font-medium text-slate-800 leading-tight">
                                    {idx + 1}. {comp.name}
                                  </span>
                                  <span className={`font-bold shrink-0 ${textColor}`}>
                                    {pct}%
                                  </span>
                                </div>
                                {comp.isTarget2026_27 && (
                                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
                                    <span>★ 2026-27 Target</span>
                                  </div>
                                )}
                                <div className="text-[10px] text-slate-500 leading-tight">
                                  {comp.targetMilestone}
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Column 2: English Competencies */}
                    <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/20 space-y-3.5 flex flex-col justify-between shadow-xs">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-indigo-200/80">
                          <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                            <Languages className="w-4 h-4 text-indigo-700" />
                            <span>{gradeItem.subjects.english.subjectTitle}</span>
                          </span>
                          <span className="text-xs font-bold text-indigo-800 bg-indigo-100 px-2 py-0.5 rounded border border-indigo-200">
                            Average: {displayEngAvg}%
                          </span>
                        </div>

                        {/* 2026-27 Milestone Target Banner */}
                        <div className="bg-white p-3 rounded-lg border border-indigo-200 space-y-1.5 shadow-2xs">
                          <div className="text-[11px] font-bold text-indigo-900 uppercase tracking-wide flex items-center gap-1">
                            <span className="text-indigo-700">★</span>
                            <span>2026-27 Milestone Target:</span>
                          </div>
                          <ul className="text-xs text-slate-800 space-y-1 list-disc list-inside">
                            {gradeItem.subjects.english.target2026_27.map((item, idx) => (
                              <li key={idx} className="font-semibold text-indigo-950">{item}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Long-Term Goal Block */}
                        <div className="p-2.5 bg-indigo-50/50 rounded-lg border border-indigo-100 text-xs text-slate-600 space-y-1">
                          <div className="text-[10px] font-bold text-indigo-800 uppercase">Long-Term Goal:</div>
                          <ul className="space-y-0.5 list-disc list-inside text-[11px]">
                            {gradeItem.subjects.english.goal.map((g, idx) => (
                              <li key={idx}>{g}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Official Competency Mastery Progress */}
                        <div className="pt-2 border-t border-indigo-200/60 space-y-2.5 text-xs">
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            Official Competencies Breakdown:
                          </div>
                          {gradeItem.subjects.english.competencies.map((comp, idx) => {
                            const pct = comp.benchmarkPercent;
                            const barColor = pct >= 70 ? 'bg-indigo-600' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
                            const textColor = pct >= 70 ? 'text-indigo-800' : pct >= 60 ? 'text-amber-700' : 'text-rose-700';
                            return (
                              <div key={comp.id || idx} className="space-y-1 bg-white/70 p-2 rounded-md border border-indigo-100">
                                <div className="flex justify-between items-start gap-1 text-[11px]">
                                  <span className="font-medium text-slate-800 leading-tight">
                                    {idx + 1}. {comp.name}
                                  </span>
                                  <span className={`font-bold shrink-0 ${textColor}`}>
                                    {pct}%
                                  </span>
                                </div>
                                {comp.isTarget2026_27 && (
                                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-800 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                                    <span>★ 2026-27 Target</span>
                                  </div>
                                )}
                                <div className="text-[10px] text-slate-500 leading-tight">
                                  {comp.targetMilestone}
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Column 3: Numeracy Competencies */}
                    <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/20 space-y-3.5 flex flex-col justify-between shadow-xs">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between pb-2 border-b border-blue-200/80">
                          <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                            <Calculator className="w-4 h-4 text-blue-700" />
                            <span>{gradeItem.subjects.math.subjectTitle}</span>
                          </span>
                          <span className="text-xs font-bold text-blue-800 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                            Average: {displayNumAvg}%
                          </span>
                        </div>

                        {/* 2026-27 Milestone Target Banner */}
                        <div className="bg-white p-3 rounded-lg border border-blue-200 space-y-1.5 shadow-2xs">
                          <div className="text-[11px] font-bold text-blue-900 uppercase tracking-wide flex items-center gap-1">
                            <span className="text-blue-700">★</span>
                            <span>2026-27 Milestone Target:</span>
                          </div>
                          <ul className="text-xs text-slate-800 space-y-1 list-disc list-inside">
                            {gradeItem.subjects.math.target2026_27.map((item, idx) => (
                              <li key={idx} className="font-semibold text-blue-950">{item}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Long-Term Goal Block */}
                        <div className="p-2.5 bg-blue-50/50 rounded-lg border border-blue-100 text-xs text-slate-600 space-y-1">
                          <div className="text-[10px] font-bold text-blue-800 uppercase">Long-Term Goal:</div>
                          <ul className="space-y-0.5 list-disc list-inside text-[11px]">
                            {gradeItem.subjects.math.goal.map((g, idx) => (
                              <li key={idx}>{g}</li>
                            ))}
                          </ul>
                        </div>

                        {/* Official Competency Mastery Progress */}
                        <div className="pt-2 border-t border-blue-200/60 space-y-2.5 text-xs">
                          <div className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                            Official Competencies Breakdown:
                          </div>
                          {gradeItem.subjects.math.competencies.map((comp, idx) => {
                            const pct = comp.benchmarkPercent;
                            const barColor = pct >= 70 ? 'bg-blue-600' : pct >= 60 ? 'bg-amber-500' : 'bg-rose-500';
                            const textColor = pct >= 70 ? 'text-blue-800' : pct >= 60 ? 'text-amber-700' : 'text-rose-700';
                            return (
                              <div key={comp.id || idx} className="space-y-1 bg-white/70 p-2 rounded-md border border-blue-100">
                                <div className="flex justify-between items-start gap-1 text-[11px]">
                                  <span className="font-medium text-slate-800 leading-tight">
                                    {idx + 1}. {comp.name}
                                  </span>
                                  <span className={`font-bold shrink-0 ${textColor}`}>
                                    {pct}%
                                  </span>
                                </div>
                                {comp.isTarget2026_27 && (
                                  <div className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.2 rounded border border-blue-200">
                                    <span>★ 2026-27 Target</span>
                                  </div>
                                )}
                                <div className="text-[10px] text-slate-500 leading-tight">
                                  {comp.targetMilestone}
                                </div>
                                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                                  <div className={`${barColor} h-1.5 rounded-full`} style={{ width: `${pct}%` }} />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })()}

            {/* VIEW 2: Complete All-Grades Targets Matrix (Classes 1 to 5) */}
            {targetGradeTab === 'MATRIX' && (
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700 flex items-center justify-between bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                  <span>Comprehensive Multi-Grade Comparative Matrix (Classes 1–5):</span>
                  <span className="text-[11px] font-normal text-slate-500">Official Curriculum Framework 2026-27</span>
                </div>
                <div className="overflow-x-auto rounded-xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left text-xs bg-white">
                    <thead className="bg-slate-800 text-white font-semibold">
                      <tr>
                        <th className="px-3.5 py-3 w-28">Grade</th>
                        <th className="px-3 py-3 w-36">Subject</th>
                        <th className="px-4 py-3">Curriculum Goal</th>
                        <th className="px-4 py-3 bg-slate-900 text-emerald-400 font-bold">2026-27 Target Milestone</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {FLN_TARGETS_2026_27.map((gt) => (
                        <React.Fragment key={gt.grade}>
                          {/* Telugu Row */}
                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td rowSpan={3} className="px-3.5 py-3 font-bold text-slate-900 align-top bg-slate-50/50 border-r border-slate-200">
                              <div className="text-sm font-extrabold text-slate-900">{gt.gradeLabel}</div>
                              <div className="text-[10px] text-slate-500 font-normal">{gt.stage}</div>
                            </td>
                            <td className="px-3 py-3 font-bold text-emerald-900 flex items-center gap-1.5">
                              <BookOpen className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                              <span>{gt.subjects.telugu.subjectTitle}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 text-xs leading-relaxed">
                              <ul className="list-disc list-inside space-y-0.5">
                                {gt.subjects.telugu.goal.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-4 py-3 bg-emerald-50/60 font-semibold text-emerald-950 border-l border-emerald-100">
                              <ul className="list-disc list-inside space-y-0.5">
                                {gt.subjects.telugu.target2026_27.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>

                          {/* English Row */}
                          <tr className="hover:bg-slate-50/80 transition-colors">
                            <td className="px-3 py-3 font-bold text-indigo-900 flex items-center gap-1.5">
                              <Languages className="w-3.5 h-3.5 text-indigo-700 shrink-0" />
                              <span>{gt.subjects.english.subjectTitle}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 text-xs leading-relaxed">
                              <ul className="list-disc list-inside space-y-0.5">
                                {gt.subjects.english.goal.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-4 py-3 bg-indigo-50/60 font-semibold text-indigo-950 border-l border-indigo-100">
                              <ul className="list-disc list-inside space-y-0.5">
                                {gt.subjects.english.target2026_27.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>

                          {/* Math Row */}
                          <tr className="hover:bg-slate-50/80 transition-colors border-b-2 border-slate-300">
                            <td className="px-3 py-3 font-bold text-blue-900 flex items-center gap-1.5">
                              <Calculator className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                              <span>{gt.subjects.math.subjectTitle}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-700 text-xs leading-relaxed">
                              <ul className="list-disc list-inside space-y-0.5">
                                {gt.subjects.math.goal.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </td>
                            <td className="px-4 py-3 bg-blue-50/60 font-semibold text-blue-950 border-l border-blue-100">
                              <ul className="list-disc list-inside space-y-0.5">
                                {gt.subjects.math.target2026_27.map((item, i) => (
                                  <li key={i}>{item}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Grade-Wise Analytics: Shows TELUGU, ENGLISH, NUMERACY Triple Bars */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-emerald-700" />
                  <span>Grade-Wise FLN Competency Analytics (Classes 1–5)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Side-by-side comparative evaluation of Telugu, English, and Mathematics across primary classes.
                </p>
              </div>

              {/* Grade Selector */}
              <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-lg text-xs font-semibold self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => setSelectedGrade('ALL')}
                  className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                    selectedGrade === 'ALL'
                      ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All Grades (1–5)
                </button>
                {gradeMetrics.map(g => (
                  <button
                    key={g.grade}
                    type="button"
                    onClick={() => setSelectedGrade(g.grade)}
                    className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
                      selectedGrade === g.grade
                        ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {g.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Color Legend */}
            <div className="flex flex-wrap items-center justify-between text-xs gap-3 bg-slate-50 px-3 py-2 rounded-lg border border-slate-200/60">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-emerald-600 inline-block" />
                  <span className="font-semibold text-emerald-950">Telugu Literacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-indigo-600 inline-block" />
                  <span className="font-semibold text-indigo-950">English Literacy</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-xs bg-blue-600 inline-block" />
                  <span className="font-semibold text-blue-950">Foundational Numeracy</span>
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Benchmark Standard: <strong className="text-slate-800">&ge; 70%</strong> score
              </div>
            </div>

            {/* Triple Bar Graph Visualization for All Grades */}
            {selectedGrade === 'ALL' && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 pt-3 pb-2 border-b border-slate-100">
                  {gradeMetrics.map(g => (
                    <div key={g.grade} className="bg-slate-50/70 p-3 rounded-xl border border-slate-200 flex flex-col justify-between">
                      <div className="text-center pb-2 border-b border-slate-200/60">
                        <div className="font-bold text-xs text-slate-900">{g.name}</div>
                        <div className="text-[10px] text-slate-500 truncate">{g.stage.split('(')[0]}</div>
                      </div>

                      {/* Triple Bar Visual Column */}
                      <div className="h-44 flex items-end justify-center gap-2 pt-4 pb-2 px-1">
                        {/* Telugu Bar */}
                        <div className="flex flex-col items-center gap-1 w-7">
                          <span className="text-[9px] font-bold text-emerald-800 tabular-nums">{g.avgTel}%</span>
                          <div className="w-full bg-slate-200 rounded-t-md h-32 flex items-end overflow-hidden">
                            <div 
                              className="w-full bg-emerald-600 rounded-t-md transition-all duration-500 hover:brightness-110"
                              style={{ height: `${g.avgTel}%` }}
                              title={`Class ${g.grade} Telugu: ${g.avgTel}%`}
                            />
                          </div>
                          <span className="text-[8px] font-bold text-emerald-800 uppercase">TEL</span>
                        </div>

                        {/* English Bar */}
                        <div className="flex flex-col items-center gap-1 w-7">
                          <span className="text-[9px] font-bold text-indigo-800 tabular-nums">{g.avgEng}%</span>
                          <div className="w-full bg-slate-200 rounded-t-md h-32 flex items-end overflow-hidden">
                            <div 
                              className="w-full bg-indigo-600 rounded-t-md transition-all duration-500 hover:brightness-110"
                              style={{ height: `${g.avgEng}%` }}
                              title={`Class ${g.grade} English: ${g.avgEng}%`}
                            />
                          </div>
                          <span className="text-[8px] font-bold text-indigo-800 uppercase">ENG</span>
                        </div>

                        {/* Numeracy Bar */}
                        <div className="flex flex-col items-center gap-1 w-7">
                          <span className="text-[9px] font-bold text-blue-800 tabular-nums">{g.avgNum}%</span>
                          <div className="w-full bg-slate-200 rounded-t-md h-32 flex items-end overflow-hidden">
                            <div 
                              className="w-full bg-blue-600 rounded-t-md transition-all duration-500 hover:brightness-110"
                              style={{ height: `${g.avgNum}%` }}
                              title={`Class ${g.grade} Numeracy: ${g.avgNum}%`}
                            />
                          </div>
                          <span className="text-[8px] font-bold text-blue-800 uppercase">NUM</span>
                        </div>
                      </div>

                      {/* Mastery & Gap Pill */}
                      <div className="pt-2 border-t border-slate-200/60 text-center space-y-1">
                        <div className="flex items-center justify-between text-[9px] text-slate-600">
                          <span>Mastery:</span>
                          <span className="text-emerald-700 font-bold">{g.telMastery}%</span>
                          <span>|</span>
                          <span className="text-indigo-700 font-bold">{g.engMastery}%</span>
                          <span>|</span>
                          <span className="text-blue-700 font-bold">{g.numMastery}%</span>
                        </div>
                        <div className="text-[9px]">
                          <span className="text-amber-700 font-semibold">
                            Eng Lag: -{g.languageGap}% · Math Lag: -{g.mathGap}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Grade Table Breakdown */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                      <tr>
                        <th className="px-3 py-2.5">Grade Level</th>
                        <th className="px-3 py-2.5 text-right text-emerald-800 font-bold">Telugu Avg</th>
                        <th className="px-3 py-2.5 text-right text-indigo-800 font-bold">English Avg</th>
                        <th className="px-3 py-2.5 text-right text-blue-800 font-bold">Numeracy Avg</th>
                        <th className="px-3 py-2.5">Telugu Key Competency</th>
                        <th className="px-3 py-2.5">English Key Competency</th>
                        <th className="px-3 py-2.5">Math Key Competency</th>
                        <th className="px-3 py-2.5 text-center">Lang Gap (Tel vs Eng)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {gradeMetrics.map(g => (
                        <tr key={g.grade} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-3 py-2.5 font-bold text-slate-900">{g.fullName}</td>
                          <td className="px-3 py-2.5 text-right font-bold text-emerald-800 tabular-nums">{g.avgTel}%</td>
                          <td className="px-3 py-2.5 text-right font-bold text-indigo-800 tabular-nums">{g.avgEng}%</td>
                          <td className="px-3 py-2.5 text-right font-bold text-blue-800 tabular-nums">{g.avgNum}%</td>
                          <td className="px-3 py-2.5 text-slate-700 text-[11px]">{g.keyTelCompetency}</td>
                          <td className="px-3 py-2.5 text-slate-700 text-[11px]">{g.keyEngCompetency}</td>
                          <td className="px-3 py-2.5 text-slate-700 text-[11px]">{g.keyNumCompetency}</td>
                          <td className="px-3 py-2.5 text-center tabular-nums">
                            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-800 border border-amber-200">
                              {g.languageGap > 0 ? `+${g.languageGap}% Telugu Lead` : `${g.languageGap}%`}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Deep Dive for a Single Selected Grade */}
            {selectedGrade !== 'ALL' && (
              <div className="space-y-4 pt-1">
                {(() => {
                  const g = gradeMetrics.find(m => m.grade === selectedGrade) || gradeMetrics[2];
                  return (
                    <div className="space-y-4">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h4 className="font-bold text-sm text-slate-900">{g.fullName} Detailed Diagnostic Profile</h4>
                          <p className="text-xs text-slate-500">{g.stage} · Sampled Students: ~{g.studentsAssessed.toLocaleString()} children</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedGrade('ALL')}
                          className="text-xs text-emerald-800 hover:underline font-semibold cursor-pointer self-start sm:self-auto"
                        >
                          ← Back to All Grades Comparison
                        </button>
                      </div>

                      {/* 3 Horizontal Cards: Telugu, English, Math */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Telugu Card */}
                        <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-emerald-900">Telugu</span>
                            <span className="text-xs font-bold text-emerald-700">{g.telMastery}% Mastery</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-600">Average Score:</span>
                              <span className="font-bold text-slate-900">{g.avgTel}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: `${g.avgTel}%` }} />
                            </div>
                          </div>
                          <div className="bg-emerald-50/70 p-2.5 rounded-lg border border-emerald-100 text-[11px] text-emerald-950">
                            <strong>Target Competency:</strong> {g.keyTelCompetency}
                          </div>
                        </div>

                        {/* English Card */}
                        <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-indigo-900">English</span>
                            <span className="text-xs font-bold text-indigo-700">{g.engMastery}% Mastery</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-600">Average Score:</span>
                              <span className="font-bold text-slate-900">{g.avgEng}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${g.avgEng}%` }} />
                            </div>
                          </div>
                          <div className="bg-indigo-50/70 p-2.5 rounded-lg border border-indigo-100 text-[11px] text-indigo-950">
                            <strong>Target Competency:</strong> {g.keyEngCompetency}
                          </div>
                        </div>

                        {/* Math Card */}
                        <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-xs uppercase tracking-wider text-blue-900">Mathematics</span>
                            <span className="text-xs font-bold text-blue-700">{g.numMastery}% Mastery</span>
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-slate-600">Average Score:</span>
                              <span className="font-bold text-slate-900">{g.avgNum}%</span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${g.avgNum}%` }} />
                            </div>
                          </div>
                          <div className="bg-blue-50/70 p-2.5 rounded-lg border border-blue-100 text-[11px] text-blue-950">
                            <strong>Target Competency:</strong> {g.keyNumCompetency}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* FLN LEADERBOARD TABLE ACROSS ALL 28 DISTRICTS */}
          {activeLevel === 'STATE' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    State FLN Diagnostic League Table — All 28 Districts of Andhra Pradesh
                  </h3>
                  <p className="text-xs text-slate-500">
                    Independent subject performance and student assessment coverage across all 28 districts.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Search district name or code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-56"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">District Name & Code</th>
                      <th className="px-3 py-3 text-right">Student Coverage %</th>
                      <th className="px-3 py-3 text-right text-emerald-800 font-bold">Telugu Avg</th>
                      <th className="px-3 py-3 text-right text-indigo-800 font-bold">English Avg</th>
                      <th className="px-3 py-3 text-right text-blue-800 font-bold">Numeracy Avg</th>
                      <th className="px-3 py-3 text-right">Composite FLN</th>
                      <th className="px-3 py-3 text-center">Language Lag</th>
                      <th className="px-3 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {searchedDistricts.map((d) => {
                      const cov = Math.round((d.uniqueStudentsAssessed / d.totalEligibleStudents) * 100);
                      const tel = d.avgTeluguScore ?? d.avgLiteracyScore;
                      const eng = d.avgEnglishScore ?? (d.avgLiteracyScore - 3.5);
                      const lag = Math.round((tel - eng) * 10) / 10;
                      return (
                        <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-1.5">
                              <span>{d.name}</span>
                              <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                                {d.code}
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-400 font-normal">
                              {d.totalSchools.toLocaleString()} schools · {d.uniqueStudentsAssessed.toLocaleString()} students tested
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums">
                            <span className={`font-semibold ${cov >= 70 ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {cov}%
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-emerald-800">{tel}%</td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-indigo-800">{eng}%</td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-blue-800">{d.avgNumeracyScore}%</td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-slate-900">{d.avgFLNScore}%</td>
                          <td className="px-3 py-3 text-center">
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                              -{lag}% English
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleDistrictChange(d.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-xs border border-emerald-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Drilldown</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FLN DISTRICT VIEW: MANDAL TABLE */}
          {activeLevel === 'DISTRICT' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeDistrict?.name} District — Mandal FLN Diagnostic Matrix
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mandal-level learning diagnostics and student assessment coverage.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Search mandal..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-48"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Mandal Name</th>
                      <th className="px-3 py-3 text-right">Total Schools</th>
                      <th className="px-3 py-3 text-right">Student Coverage %</th>
                      <th className="px-3 py-3 text-right font-bold text-emerald-800">Telugu Avg</th>
                      <th className="px-3 py-3 text-right font-bold text-indigo-800">English Avg</th>
                      <th className="px-3 py-3 text-right font-bold text-blue-800">Numeracy Avg</th>
                      <th className="px-3 py-3 text-right font-bold text-slate-900">Composite FLN</th>
                      <th className="px-3 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {searchedMandals.map(m => {
                      const cov = Math.round((m.uniqueStudentsAssessed / m.totalEligibleStudents) * 100);
                      const tel = Math.round((m.avgFLNScore + 2.5) * 10) / 10;
                      const eng = Math.round((m.avgFLNScore - 1.5) * 10) / 10;
                      const num = Math.round((m.avgFLNScore - 2.0) * 10) / 10;
                      return (
                        <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">{m.name} Mandal</td>
                          <td className="px-3 py-3 text-right tabular-nums text-slate-600">{m.totalSchools}</td>
                          <td className="px-3 py-3 text-right tabular-nums font-semibold text-emerald-700">{cov}%</td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-emerald-800">{tel}%</td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-indigo-800">{eng}%</td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-blue-800">{num}%</td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-slate-900">{m.avgFLNScore}%</td>
                          <td className="px-3 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleMandalChange(m.id)}
                              className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-xs border border-emerald-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                            >
                              <span>Drilldown</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FLN MANDAL VIEW: SCHOOL ROSTER */}
          {activeLevel === 'MANDAL' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
              <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    {activeMandal?.name} Mandal — School FLN Diagnostics & Student Mastery
                  </h3>
                  <p className="text-xs text-slate-500">
                    Individual school diagnostic scores for Telugu, English, and Numeracy.
                  </p>
                </div>
                <input
                  type="text"
                  placeholder="Search school name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-56"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">School Name & UDISE</th>
                      <th className="px-3 py-3 text-center">Cluster</th>
                      <th className="px-3 py-3 text-right font-bold text-emerald-800">Telugu Score</th>
                      <th className="px-3 py-3 text-right font-bold text-indigo-800">English Score</th>
                      <th className="px-3 py-3 text-right font-bold text-blue-800">Numeracy Score</th>
                      <th className="px-3 py-3 text-right font-bold text-slate-900">Student Coverage</th>
                      <th className="px-3 py-3 text-right">Field Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {searchedSchools.map(s => {
                      const tel = s.lastLiteracyScore;
                      const eng = Math.max(30, Math.round((s.lastLiteracyScore - 3.8) * 10) / 10);
                      const num = s.lastNumeracyScore;
                      return (
                        <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <div>{s.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">UDISE: {s.udiseCode} · HM: {s.headmasterName}</div>
                          </td>
                          <td className="px-3 py-3 text-center text-slate-600">{s.clusterName}</td>
                          <td className="px-3 py-3 text-right font-bold text-emerald-800 tabular-nums">{tel}%</td>
                          <td className="px-3 py-3 text-right font-bold text-indigo-800 tabular-nums">{eng}%</td>
                          <td className="px-3 py-3 text-right font-bold text-blue-800 tabular-nums">{num}%</td>
                          <td className="px-3 py-3 text-right font-semibold text-slate-700 tabular-nums">{s.monthlyCoveragePercent}%</td>
                          <td className="px-3 py-3 text-right">
                            <button
                              type="button"
                              onClick={() => onSelectSchoolForVisit(s)}
                              className="px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Assess Students</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      )}

      {/* ====================================================================== */}
      {/* VIEW B: SCHOOL VISITS & FIELD MONITORING TAB */}
      {/* ====================================================================== */}
      {dashboardTab === 'VISITS' && (
        <div className="space-y-4">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b border-slate-200 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <SchoolIcon className="w-4.5 h-4.5 text-blue-700" />
                  <span>Supervisory Tour Diary & Field Inspection Compliance</span>
                </h2>
                {currentUser && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                    Role: {currentUser.role.replace('_', ' ')}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {currentUser?.role === 'DEO'
                  ? 'Tracking downward officer inspections in the district: Dy. DEOs (15/mo), MEOs (20/mo), and CRPs (30/mo).'
                  : currentUser?.role === 'DY_DEO'
                  ? 'Tracking downward officer inspections in the division: MEOs (20/mo) and CRPs (30/mo).'
                  : currentUser?.role === 'MEO'
                  ? 'Tracking downward inspections in the mandal: Cluster Resource Persons (30/mo) and Primary Schools (100% Coverage).'
                  : currentUser?.role === 'CRP'
                  ? 'Tracking cluster field inspections and 1-on-1 student FLN diagnostics in primary schools.'
                  : currentUser?.role === 'HEADMASTER'
                  ? 'Tracking primary school classroom observations, teacher lesson plans, and student FLN assessments.'
                  : currentUser?.role === 'TEACHER'
                  ? 'Tracking Class 3-A student foundational literacy and numeracy 1-on-1 diagnostic evaluations.'
                  : 'Tracking physical officer inspections against statutory monthly targets across all supervisory cadres.'}
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 shrink-0">
              <span className="font-semibold text-slate-700">{activeRoleBadgeLabel}:</span>
              <span>Target: <strong className="text-slate-900 tabular-nums">{activeRoleOfficerQuota.toLocaleString()}</strong></span>
              <span className="text-slate-300">·</span>
              <span>Completed: <strong className="text-blue-700 tabular-nums font-bold">{activeRoleOfficerCompleted.toLocaleString()}</strong></span>
              <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${
                activeRoleOfficerAchievement >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}>
                {activeRoleOfficerAchievement}% Achieved
              </span>
            </div>
          </div>

          {/* 4 School Visit Monitoring KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Schools Monitored in Scope */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Schools Monitored
                  </span>
                  <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
                    <SchoolIcon className="w-4 h-4" />
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {schoolsAssessedCount.toLocaleString()}
                  </span>
                  <span className="text-xs font-semibold text-blue-700 tabular-nums">
                    ({schoolsAssessedPercentage}%)
                  </span>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, schoolsAssessedPercentage)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Total Schools: <strong className="text-slate-800 tabular-nums">{totalSchools.toLocaleString()}</strong></span>
                <span>Unvisited: <strong className="text-amber-700 tabular-nums">{schoolsPendingAssessment.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Card 2: Officer Visit Target Achievement (Role-Driven) */}
            <div className={`p-4 rounded-xl border shadow-xs flex flex-col justify-between transition-all ${
              currentUser?.role === 'DY_DEO' || currentUser?.role === 'MEO' || currentUser?.role === 'CRP' || currentUser?.role === 'DEO'
                ? 'bg-gradient-to-br from-white to-blue-50/50 border-blue-300 ring-1 ring-blue-300'
                : 'bg-white border-slate-200'
            }`}>
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <span>{activeRoleTitle} Statutory Quota</span>
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${activeRoleOfficerAchievement >= 80 ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                    {activeRoleOfficerAchievement >= 80 ? 'On Track' : 'Visit Lag'}
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-slate-900 tabular-nums">
                    {currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN'
                      ? `${activeRoleOfficerAchievement}%`
                      : `${activeRoleOfficerCompleted} / ${activeRoleOfficerQuota}`}
                  </span>
                  <span className="text-xs font-semibold text-blue-700">
                    {currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN'
                      ? `(${activeRoleOfficerCompleted.toLocaleString()}/${activeRoleOfficerQuota.toLocaleString()} Visits)`
                      : `(${activeRoleOfficerAchievement}% Achieved)`}
                  </span>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full transition-all duration-500 ${
                      activeRoleOfficerAchievement >= 80 ? 'bg-emerald-600' : activeRoleOfficerAchievement >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                    }`} 
                    style={{ width: `${Math.min(100, activeRoleOfficerAchievement)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Completed: <strong className="text-slate-800">{activeRoleOfficerCompleted.toLocaleString()}</strong></span>
                <span>Visit Gap: <strong className="text-amber-700">-{activeRoleOfficerGap.toLocaleString()}</strong></span>
              </div>
            </div>

            {/* Card 3: High Enrolment Schools (Class 1–5) */}
            <div className="bg-white p-4 rounded-xl border border-indigo-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                    High Enrolment Schools (Class 1–5)
                  </span>
                  <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-md">
                    <Users className="w-4 h-4" />
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-indigo-700 tabular-nums">
                    {totalCriticalSchools}
                  </span>
                  <span className="text-xs font-medium text-slate-500">
                    Schools (Enrolment &ge; 100)
                  </span>
                </div>

                <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (totalCriticalSchools / Math.max(1, totalSchools)) * 100)}%` }}
                  />
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-500 flex justify-between">
                <span>Visit Priority:</span>
                <span className="text-indigo-700 font-bold">Top Visit Priority Roster</span>
              </div>
            </div>

            {/* Card 4: Role-Based Enrolment Prioritization Explainer */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Role-Based Jurisdiction Priority
                  </span>
                  <span className="p-1.5 bg-blue-50 text-blue-700 rounded-md">
                    <Info className="w-4 h-4" />
                  </span>
                </div>

                <div className="mt-2">
                  <div className="text-xs font-bold text-slate-900">
                    CRP: Cluster • MEO: Mandal • DEO: District
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    School visits are prioritized directly by Class 1–5 enrolment within the officer's administrative jurisdiction to maximize foundational learning impact.
                  </p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setShowSPSModal(true)}
                  className="text-indigo-700 font-bold hover:underline cursor-pointer"
                >
                  View Enrolment Priority Policy →
                </button>
              </div>
            </div>

          </div>

          {/* Transparent Enrolment-Based Prioritization Policy Banner */}
          <div className="bg-slate-900 text-white p-4 rounded-xl text-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-sm text-indigo-300">
                  School Visit Prioritization Policy (Class 1–5 Enrolment Hierarchy)
                </h4>
              </div>
              <span className="text-[11px] text-slate-300">
                Official Rule: Highest Class 1–5 enrolment visited first within the role's jurisdiction
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1 text-[11px]">
              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <SchoolIcon className="w-3.5 h-3.5" />
                  <span>1. CRP: Cluster Scoping</span>
                </div>
                <div className="text-slate-300 mt-1 leading-relaxed">
                  Priority is scoped within the assigned <strong>Cluster</strong> (e.g., Kaza Cluster). Primary schools with the largest student counts receive first supervisory and coaching visits.
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>2. MEO: Mandal Scoping</span>
                </div>
                <div className="text-slate-300 mt-1 leading-relaxed">
                  Priority is scoped across the entire <strong>Mandal</strong> (e.g., Mangalagiri Mandal). Visits are ranked by Class 1–5 strength to cover key educational hubs first.
                </div>
              </div>

              <div className="bg-white/10 p-3 rounded-lg border border-white/10">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  <span>3. DEO / Dy. DEO: District Scoping</span>
                </div>
                <div className="text-slate-300 mt-1 leading-relaxed">
                  Priority is scoped at the <strong>District or Division</strong> level. Highest-enrolment primary schools are targeted for macro inspection and resources.
                </div>
              </div>
            </div>
          </div>

          {/* ====================================================================== */}
          {/* SUPERVISORY CADRES TARGET & ACHIEVEMENT SHOWCASE (HIERARCHY-BASED) */}
          {/* ====================================================================== */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4.5 h-4.5 text-blue-700" />
                    <span>
                      {currentUser?.role === 'DEO' 
                        ? 'District Supervisory Reporting Hierarchy & Downward Cadres' 
                        : currentUser?.role === 'DY_DEO'
                        ? 'Division Supervisory Reporting Hierarchy & Downward Cadres'
                        : currentUser?.role === 'MEO'
                        ? 'Mandal Supervisory Reporting Hierarchy & Downward Cadres'
                        : currentUser?.role === 'CRP'
                        ? 'Cluster Field Delivery Tier & Monitored Schools'
                        : 'Supervisory Reporting Hierarchy & Subordinate Cadres Status'}
                    </span>
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                    Downwards Hierarchy Only
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentUser?.role === 'DEO' 
                    ? 'Supervising downward cadres in Guntur District: Dy. DEOs (15 Visits/mo), MEOs (20 Visits/mo), and CRPs (30 Visits/mo). Upper cadres hidden.'
                    : currentUser?.role === 'DY_DEO'
                    ? 'Supervising downward cadres in Guntur Division: MEOs (20 Visits/mo) and CRPs (30 Visits/mo). Upper cadres hidden.'
                    : currentUser?.role === 'MEO'
                    ? 'Supervising downward cadre in Mangalagiri Mandal: CRPs (30 Visits/mo) and Primary Schools (100% Monthly Coverage). Upper cadres hidden.'
                    : currentUser?.role === 'CRP'
                    ? 'Cluster field delivery: 6 Primary Schools with 1-on-1 Student FLN Diagnostics. Upper cadres hidden.'
                    : 'Statutory monthly school inspection quotas: Dy. DEOs (15 Visits), MEOs (20 Visits), and CRPs (30 Visits). Subordinates reporting under State Apex.'}
                </p>
              </div>
              <div className="text-xs text-slate-600 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto flex items-center gap-1.5">
                <span className="text-slate-500">Supervising Authority:</span>
                <strong className="text-blue-900 font-bold">{currentUser?.role.replace('_', ' ')}</strong>
              </div>
            </div>

            {/* Educational Administration Hierarchy Flowbar (Only Owner Level & Downwards Visible) */}
            <div className="flex flex-wrap items-center gap-1.5 p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-xs text-slate-600">
              <span className="font-bold text-slate-700 flex items-center gap-1 shrink-0">
                <Layers className="w-3.5 h-3.5 text-blue-700" />
                <span>Active Chain:</span>
              </span>
              {visibleHierarchySteps.map((step, idx) => {
                const isOwner = idx === 0;
                return (
                  <div key={step.role} className="flex items-center gap-1.5">
                    {idx > 0 && <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />}
                    <span className={`px-2 py-0.5 rounded text-[11px] font-semibold flex items-center gap-1 ${
                      isOwner 
                        ? 'bg-blue-700 text-white font-bold shadow-xs' 
                        : 'bg-white text-slate-700 border border-slate-200'
                    }`}>
                      {isOwner && <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />}
                      <span>{step.label}</span>
                      {isOwner && <span className="text-[9px] bg-blue-800 text-blue-100 px-1 py-0.2 rounded ml-0.5 font-bold">OWNER</span>}
                    </span>
                  </div>
                );
              })}
              {activeUserRank > 0 && (
                <span className="ml-auto text-[10px] text-slate-400 italic">
                  * Upper cadres hidden per administrative protocol
                </span>
              )}
            </div>

            {/* Active Supervising Authority Banner */}
            <div className="p-3.5 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                    ★ Active Supervising Persona
                  </span>
                  <span className="text-xs text-blue-200 font-semibold">
                    {currentUser?.role === 'DY_DEO' ? 'Division Authority' : currentUser?.role === 'MEO' ? 'Mandal Authority' : currentUser?.role === 'CRP' ? 'Cluster Authority' : currentUser?.role === 'DEO' ? 'District Authority' : currentUser?.role === 'HEADMASTER' ? 'School Authority' : currentUser?.role === 'TEACHER' ? 'Classroom Authority' : 'State Leadership Apex'}
                  </span>
                </div>
                <div className="text-base font-bold text-white mt-1 flex items-center gap-2">
                  <span>{loggedInOfficer?.name || currentUser?.name}</span>
                  <span className="text-xs font-normal text-blue-200">({currentUser?.designation})</span>
                </div>
                <div className="text-xs text-slate-300 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>Personal Target: <strong className="text-amber-300">{activeRoleOfficerQuota} Visits/mo</strong></span>
                  <span className="text-white/30">·</span>
                  <span>Completed: <strong className="text-emerald-400">{activeRoleOfficerCompleted} Visits ({activeRoleOfficerAchievement}%)</strong></span>
                  <span className="text-white/30">·</span>
                  <span>Remaining: <strong className="text-amber-300">{activeRoleOfficerGap} Visits</strong></span>
                  <span className={`px-1.5 py-0.2 rounded font-bold text-[10px] ${activeRoleOfficerAchievement >= 80 ? 'bg-emerald-900 text-emerald-300 border border-emerald-700' : 'bg-amber-900 text-amber-300 border border-amber-700'}`}>
                    {activeRoleOfficerAchievement >= 80 ? 'On Track' : 'Visit Lag'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
                <div className="text-right hidden sm:block">
                  <div className="text-[11px] text-blue-300 font-medium">Reporting Subordinates</div>
                  <div className="text-sm font-bold text-white">{subordinateCadresList.reduce((acc, s) => acc + s.officersCount, 0)} Officers / Units</div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedCadreFilter('SUBORDINATES'); setVisitsTableTab('CADRES'); }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs transition-colors cursor-pointer shadow-xs inline-flex items-center gap-1"
                >
                  <span>Filter Below Cadres</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Subordinate Cadres Section Title */}
            <div className="pt-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowRight className="w-3.5 h-3.5 text-blue-700" />
                    <span>Subordinate Cadres Reporting in Hierarchy</span>
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    Targets and achievements for supervisory cadres functioning directly below <strong>{currentUser?.role.replace('_', ' ')}</strong> in the hierarchy.
                  </p>
                </div>
                <div className="text-[11px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  {subordinateCadresList.length} Subordinate Cadre{subordinateCadresList.length === 1 ? '' : 's'} Reporting
                </div>
              </div>

              {/* Subordinate Cadres Cards Grid */}
              <div className={`grid gap-3.5 mt-2 ${
                subordinateCadresList.length === 1 ? 'grid-cols-1' : subordinateCadresList.length === 2 ? 'grid-cols-1 md:grid-cols-2' : subordinateCadresList.length === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
              }`}>
                {subordinateCadresList.map(sub => {
                  const isSelected = selectedCadreFilter === sub.cadre || (selectedCadreFilter === 'SUBORDINATES' && sub.cadre !== 'SCHOOLS');
                  return (
                    <div
                      key={sub.id}
                      onClick={() => {
                        if (sub.cadre !== 'SCHOOLS') {
                          setSelectedCadreFilter(sub.cadre);
                          setVisitsTableTab('CADRES');
                        } else {
                          setVisitsTableTab('GEOGRAPHY');
                          setActiveLevel('MANDAL');
                        }
                      }}
                      className={`p-4 rounded-xl border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-50/70 via-white to-blue-50/30 border-blue-400 ring-2 ring-blue-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs'
                      }`}
                    >
                      <div>
                        {/* Cadre Card Header */}
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide flex items-center gap-1.5">
                            {sub.cadre === 'MEO' ? (
                              <SchoolIcon className="w-3.5 h-3.5 text-emerald-700" />
                            ) : sub.cadre === 'CRP' ? (
                              <Users className="w-3.5 h-3.5 text-indigo-700" />
                            ) : sub.cadre === 'DY_DEO' ? (
                              <Briefcase className="w-3.5 h-3.5 text-blue-700" />
                            ) : sub.cadre === 'DEO' ? (
                              <ShieldCheck className="w-3.5 h-3.5 text-slate-800" />
                            ) : (
                              <Building2 className="w-3.5 h-3.5 text-amber-700" />
                            )}
                            <span>{sub.title}</span>
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                            sub.cadre === 'MEO' 
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-200' 
                              : sub.cadre === 'CRP' 
                              ? 'bg-indigo-100 text-indigo-900 border-indigo-200'
                              : 'bg-blue-100 text-blue-900 border-blue-200'
                          }`}>
                            {sub.quotaBadge}
                          </span>
                        </div>

                        {/* Jurisdiction Scope */}
                        <div className="mt-2 text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded-md border border-slate-100 flex items-center justify-between">
                          <span className="truncate">{sub.jurisdictionScope}</span>
                          <span className="font-bold text-blue-900 shrink-0 ml-1">({sub.officersCount} Officers/Units)</span>
                        </div>

                        {/* Target vs Actual Numbers */}
                        <div className="mt-2.5 grid grid-cols-2 gap-2 text-xs">
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="text-[10px] text-slate-500 uppercase font-semibold">Target Visits</div>
                            <div className="text-base font-bold text-slate-900 tabular-nums">
                              {sub.targetVisits.toLocaleString()}
                            </div>
                            <div className="text-[10px] text-slate-400">{sub.officersCount} reporting units</div>
                          </div>
                          <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <div className="text-[10px] text-slate-500 uppercase font-semibold">Completed Visits</div>
                            <div className="text-base font-bold text-blue-700 tabular-nums">
                              {sub.actualVisits.toLocaleString()}
                            </div>
                            <div className="text-[10px] font-bold text-emerald-700">{sub.achievementPercent}% Achieved</div>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="mt-2.5 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className={`h-1.5 rounded-full transition-all duration-500 ${
                              sub.achievementPercent >= 80 ? 'bg-emerald-600' : sub.achievementPercent >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                            }`} 
                            style={{ width: `${Math.min(100, sub.achievementPercent)}%` }}
                          />
                        </div>

                        {/* Subordinate Officers Roster Sample Chips */}
                        {sub.officersList.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-100">
                            <div className="text-[10px] font-semibold text-slate-500 uppercase mb-1">
                              Reporting Officers Sample:
                            </div>
                            <div className="flex flex-wrap gap-1">
                              {sub.officersList.slice(0, 4).map(off => (
                                <span 
                                  key={off.id}
                                  className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                                    off.status === 'ON_TRACK' 
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                                  }`}
                                  title={`${off.designation}: ${off.completedVisits}/${off.monthlyTarget} visits`}
                                >
                                  {off.name.split(' ')[0]} {off.name.split(' ')[1] || ''} ({off.completedVisits}/{off.monthlyTarget})
                                </span>
                              ))}
                              {sub.officersList.length > 4 && (
                                <span className="text-[10px] px-1 py-0.5 text-slate-500">
                                  +{sub.officersList.length - 4} more
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] flex justify-between items-center text-slate-500">
                        <span>Visit Gap: <strong className="text-amber-700">-{sub.visitGap.toLocaleString()}</strong></span>
                        <span className="font-semibold text-blue-700 hover:underline inline-flex items-center gap-0.5">
                          <span>Inspect Roster</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Downward Cadres Switcher (Strictly Downwards Only) */}
            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <Compass className="w-4 h-4 text-blue-700 shrink-0" />
                <span className="text-slate-700">
                  <strong>Inspect Downward Cadres:</strong> {
                    currentUser?.role === 'DEO'
                      ? 'Dy. DEOs (15/mo), MEOs (20/mo), and CRPs (30/mo) in Guntur District.'
                      : currentUser?.role === 'DY_DEO'
                      ? 'MEOs (20/mo) and CRPs (30/mo) in Guntur Division.'
                      : currentUser?.role === 'MEO'
                      ? 'CRPs (30/mo) and Primary Schools in Mangalagiri Mandal.'
                      : currentUser?.role === 'CRP'
                      ? 'Cluster Primary Schools and Student Diagnostics.'
                      : 'DEOs (10/mo), Dy. DEOs (15/mo), MEOs (20/mo), and CRPs (30/mo) across Andhra Pradesh.'
                  }
                </span>
              </div>
              <div className="flex items-center gap-1.5 self-start sm:self-auto shrink-0 flex-wrap">
                {(currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN') && (
                  <button
                    type="button"
                    onClick={() => { setSelectedCadreFilter('DEO'); setVisitsTableTab('CADRES'); }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${
                      selectedCadreFilter === 'DEO' ? 'bg-slate-900 text-white border-slate-900' : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                    }`}
                  >
                    DEOs (10)
                  </button>
                )}
                {(currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN' || currentUser?.role === 'DEO') && (
                  <button
                    type="button"
                    onClick={() => { setSelectedCadreFilter('DY_DEO'); setVisitsTableTab('CADRES'); }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${
                      selectedCadreFilter === 'DY_DEO' ? 'bg-blue-800 text-white border-blue-800' : 'bg-white hover:bg-blue-50 text-blue-800 border-slate-200'
                    }`}
                  >
                    Dy. DEOs (15)
                  </button>
                )}
                {(currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN' || currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO') && (
                  <button
                    type="button"
                    onClick={() => { setSelectedCadreFilter('MEO'); setVisitsTableTab('CADRES'); }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${
                      selectedCadreFilter === 'MEO' ? 'bg-emerald-800 text-white border-emerald-800' : 'bg-white hover:bg-emerald-50 text-emerald-800 border-slate-200'
                    }`}
                  >
                    MEOs (20)
                  </button>
                )}
                {(currentUser?.role === 'STATE_LEADERSHIP' || currentUser?.role === 'ADMIN' || currentUser?.role === 'DEO' || currentUser?.role === 'DY_DEO' || currentUser?.role === 'MEO') && (
                  <button
                    type="button"
                    onClick={() => { setSelectedCadreFilter('CRP'); setVisitsTableTab('CADRES'); }}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold border cursor-pointer ${
                      selectedCadreFilter === 'CRP' ? 'bg-indigo-800 text-white border-indigo-800' : 'bg-white hover:bg-indigo-50 text-indigo-800 border-slate-200'
                    }`}
                  >
                    CRPs (30)
                  </button>
                )}
                {(currentUser?.role === 'MEO' || currentUser?.role === 'CRP') && (
                  <button
                    type="button"
                    onClick={() => { setVisitsTableTab('GEOGRAPHY'); setActiveLevel('MANDAL'); }}
                    className="px-2 py-0.5 rounded bg-white hover:bg-amber-50 text-amber-800 text-[11px] font-semibold border border-slate-200 cursor-pointer"
                  >
                    Primary Schools
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ====================================================================== */}
          {/* SUB-VIEW SELECTOR: CADRES ROSTER vs GEOGRAPHIC HIERARCHY */}
          {/* ====================================================================== */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 w-fit">
              <button
                type="button"
                onClick={() => setVisitsTableTab('CADRES')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  visitsTableTab === 'CADRES'
                    ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-blue-700" />
                <span>1. Supervisory Cadre Officers Roster ({currentUser?.role === 'DEO' ? 'Dy. DEOs, MEOs, CRPs' : currentUser?.role === 'DY_DEO' ? 'MEOs & CRPs' : currentUser?.role === 'MEO' ? 'Mandal CRPs' : currentUser?.role === 'CRP' ? 'Cluster Units' : 'All Cadres'})</span>
                <span className="px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold">
                  {searchedSupervisoryOfficers.length}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setVisitsTableTab('GEOGRAPHY')}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  visitsTableTab === 'GEOGRAPHY'
                    ? 'bg-white text-blue-900 shadow-xs border border-slate-200'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-emerald-700" />
                <span>2. Geographic Hierarchy ({activeLevel})</span>
              </button>
            </div>
          </div>

          {/* ====================================================================== */}
          {/* TAB 1: SUPERVISORY CADRE OFFICERS ROSTER TABLE */}
          {/* ====================================================================== */}
          {visitsTableTab === 'CADRES' && (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs space-y-0">
              <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-blue-700" />
                    <span>
                      {currentUser?.role === 'DEO' 
                        ? 'District Subordinate Officers Compliance Roster (Dy. DEOs, MEOs, CRPs)' 
                        : currentUser?.role === 'DY_DEO'
                        ? 'Division Subordinate Officers Compliance Roster (MEOs & CRPs)'
                        : currentUser?.role === 'MEO'
                        ? 'Mandal Subordinate CRPs Compliance Roster'
                        : currentUser?.role === 'CRP'
                        ? 'Cluster Inspection & Monitoring Compliance Roster'
                        : 'Supervisory Officers Inspection Compliance Roster'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500">
                    {currentUser?.role === 'DEO'
                      ? 'Monitoring downward cadres in Guntur District: Dy. DEOs (15/mo), MEOs (20/mo), and CRPs (30/mo). Upper cadres hidden.'
                      : currentUser?.role === 'DY_DEO'
                      ? 'Monitoring downward cadres in Guntur Division: MEOs (20/mo) and CRPs (30/mo). Upper cadres hidden.'
                      : currentUser?.role === 'MEO'
                      ? 'Monitoring downward cadre in Mangalagiri Mandal: Cluster Resource Persons (30 visits/mo). Upper cadres hidden.'
                      : currentUser?.role === 'CRP'
                      ? 'Cluster field visits to 6 primary schools with 1-on-1 student FLN diagnostics.'
                      : 'Individual officer performance against statutory monthly targets: Dy. DEOs (15), MEOs (20), and CRPs (30).'}
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  {/* Cadre Filter Pills based on Role Hierarchy (Upper Cadres & Peers Strictly Excluded) */}
                  <div className="flex flex-wrap items-center gap-1 bg-white p-1 rounded-lg border border-slate-200 text-xs">
                    {currentUser?.role === 'DEO' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('SUBORDINATES')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'SUBORDINATES' || selectedCadreFilter === 'ALL'
                              ? 'bg-blue-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          All Below Cadres ({searchedSupervisoryOfficers.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('DY_DEO')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'DY_DEO'
                              ? 'bg-blue-800 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Dy. DEOs (15/mo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('MEO')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'MEO'
                              ? 'bg-emerald-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          MEOs (20/mo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('CRP')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'CRP'
                              ? 'bg-indigo-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          CRPs (30/mo)
                        </button>
                      </>
                    ) : currentUser?.role === 'DY_DEO' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('SUBORDINATES')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'SUBORDINATES' || selectedCadreFilter === 'ALL'
                              ? 'bg-blue-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          All Below Cadres (MEOs & CRPs: {searchedSupervisoryOfficers.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('MEO')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'MEO'
                              ? 'bg-emerald-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          MEOs (20/mo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('CRP')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'CRP'
                              ? 'bg-indigo-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          CRPs (30/mo)
                        </button>
                      </>
                    ) : currentUser?.role === 'MEO' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('CRP')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'CRP' || selectedCadreFilter === 'SUBORDINATES' || selectedCadreFilter === 'ALL'
                              ? 'bg-indigo-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Mandal Subordinate CRPs (30/mo: {searchedSupervisoryOfficers.length})
                        </button>
                      </>
                    ) : currentUser?.role === 'CRP' ? (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('CRP')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'CRP'
                              ? 'bg-indigo-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Cluster Monitored Schools
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('ALL')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'ALL' || selectedCadreFilter === 'SUBORDINATES'
                              ? 'bg-blue-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          All Subordinate Cadres ({searchedSupervisoryOfficers.length})
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('DEO')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'DEO'
                              ? 'bg-slate-900 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          DEOs (10/mo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('DY_DEO')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'DY_DEO'
                              ? 'bg-blue-800 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          Dy. DEOs (15/mo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('MEO')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'MEO'
                              ? 'bg-emerald-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          MEOs (20/mo)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedCadreFilter('CRP')}
                          className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors cursor-pointer ${
                            selectedCadreFilter === 'CRP'
                              ? 'bg-indigo-700 text-white'
                              : 'text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          CRPs (30/mo)
                        </button>
                      </>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search officer name, mandal..."
                      value={cadreSearchQuery}
                      onChange={(e) => setCadreSearchQuery(e.target.value)}
                      className="text-xs pl-8 pr-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none w-full sm:w-48 bg-white"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                    <tr>
                      <th className="px-4 py-3">Officer Name & Designation</th>
                      <th className="px-3 py-3">Cadre & Quota</th>
                      <th className="px-3 py-3">Jurisdiction</th>
                      <th className="px-3 py-3 text-right">Target Visits</th>
                      <th className="px-3 py-3 text-right font-bold text-slate-900">Actual Visits</th>
                      <th className="px-3 py-3 text-right">Achievement %</th>
                      <th className="px-3 py-3 text-right">Visit Gap</th>
                      <th className="px-3 py-3 text-center">Assigned / Tested</th>
                      <th className="px-3 py-3 text-center">High Enrolment (Class 1–5)</th>
                      <th className="px-3 py-3 text-center">Status</th>
                      <th className="px-3 py-3 text-right">Last Visit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {searchedSupervisoryOfficers.map(officer => {
                      const isLag = officer.status === 'VISIT_LAG';
                      const isDeficit = officer.status === 'CRITICAL_DEFICIT';
                      return (
                        <tr 
                          key={officer.id} 
                          className="hover:bg-slate-50/80 transition-colors bg-emerald-50/10"
                        >
                          <td className="px-4 py-3 font-semibold text-slate-900">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span>{officer.name}</span>
                              <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                                SUBORDINATE
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500 font-normal">
                              {officer.designation}
                            </div>
                          </td>
                          <td className="px-3 py-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              officer.cadre === 'DY_DEO' 
                                ? 'bg-blue-100 text-blue-900 border border-blue-200' 
                                : officer.cadre === 'MEO' 
                                ? 'bg-emerald-100 text-emerald-900 border border-emerald-200' 
                                : officer.cadre === 'CRP'
                                ? 'bg-indigo-100 text-indigo-900 border border-indigo-200'
                                : 'bg-slate-100 text-slate-900 border border-slate-300'
                            }`}>
                              {officer.cadre.replace('_', '. ')} ({officer.monthlyTarget}/mo)
                            </span>
                          </td>
                          <td className="px-3 py-3 text-slate-600">
                            <div>{officer.clusterName || officer.mandalName || officer.divisionName || officer.districtName}</div>
                            <div className="text-[10px] text-slate-400">{officer.districtName} District</div>
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums text-slate-600 font-semibold">
                            {officer.monthlyTarget}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold text-slate-900">
                            {officer.completedVisits}
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums font-bold">
                            <div className="flex items-center justify-end gap-1.5">
                              <span className={officer.achievementPercent >= 80 ? 'text-emerald-700' : 'text-amber-700'}>
                                {officer.achievementPercent}%
                              </span>
                              <div className="w-12 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className={`h-1.5 rounded-full ${officer.achievementPercent >= 80 ? 'bg-emerald-600' : 'bg-amber-500'}`} 
                                  style={{ width: `${Math.min(100, officer.achievementPercent)}%` }}
                                />
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums font-mono text-amber-700 font-bold">
                            {officer.visitGap > 0 ? `-${officer.visitGap}` : 'Met'}
                          </td>
                          <td className="px-3 py-3 text-center tabular-nums text-slate-600">
                            <div>{officer.assignedSchools} schools</div>
                            <div className="text-[10px] text-slate-400 font-semibold">{officer.studentsAssessed} tested</div>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              officer.criticalSchoolsVisited > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {officer.criticalSchoolsVisited} visited
                            </span>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isDeficit ? 'bg-rose-100 text-rose-800' : isLag ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {officer.status === 'ON_TRACK' ? 'On Track' : officer.status === 'VISIT_LAG' ? 'Visit Lag' : 'Deficit'}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right tabular-nums text-slate-500">
                            {officer.lastVisitDate}
                          </td>
                        </tr>
                      );
                    })}
                    {searchedSupervisoryOfficers.length === 0 && (
                      <tr>
                        <td colSpan={11} className="px-4 py-8 text-center text-slate-500">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-slate-300" />
                            <div className="font-semibold text-slate-700">
                              {currentUser?.role === 'CRP'
                                ? 'Cluster Field Monitoring Tier: Direct Primary Schools Oversight'
                                : 'No subordinate officers found matching criteria'}
                            </div>
                            <p className="text-xs text-slate-400 max-w-md">
                              {currentUser?.role === 'CRP'
                                ? 'Cluster Resource Persons inspect assigned cluster primary schools and test sampled students directly. Upper cadre officers (MEO, Dy. DEO, DEO) are hidden.'
                                : 'Upper cadre officers and same-rank peers are hidden per administrative protocol.'}
                            </p>
                            {currentUser?.role === 'CRP' && (
                              <button
                                type="button"
                                onClick={() => { setVisitsTableTab('GEOGRAPHY'); setActiveLevel('MANDAL'); }}
                                className="mt-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                              >
                                View Cluster Primary Schools (6 Schools)
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ====================================================================== */}
          {/* TAB 2: GEOGRAPHIC HIERARCHY TABLES (DISTRICTS / MANDALS / SCHOOLS) */}
          {/* ====================================================================== */}
          {visitsTableTab === 'GEOGRAPHY' && (
            <>
              {/* ALL 28 DISTRICTS SCHOOL VISIT COMPLIANCE TABLE */}
              {activeLevel === 'STATE' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        State School Inspection & Visit Compliance — All 28 Districts of Andhra Pradesh
                      </h3>
                      <p className="text-xs text-slate-500">
                        Target visits vs actual physical visits completed by supervisory officers.
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="Search district name or code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-56"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="px-4 py-3">District Name & Code</th>
                          <th className="px-3 py-3 text-right">Total Schools</th>
                          <th className="px-3 py-3 text-right">Target Visits</th>
                          <th className="px-3 py-3 text-right font-bold text-slate-900">Actual Visits</th>
                          <th className="px-3 py-3 text-right">Achievement %</th>
                          <th className="px-3 py-3 text-right">Schools Visited %</th>
                          <th className="px-3 py-3 text-center">High Enrolment (Class 1–5)</th>
                          <th className="px-3 py-3 text-right">Hierarchy Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {searchedDistricts.map(d => {
                          const ach = Math.round((d.actualVisits / d.targetVisits) * 100);
                          const schCov = Math.round((d.visitedSchoolsThisMonth / d.totalSchools) * 100);
                          return (
                            <tr key={d.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-900">
                                <div className="flex items-center gap-1.5">
                                  <span>{d.name}</span>
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-mono">
                                    {d.code}
                                  </span>
                                </div>
                                <div className="text-[10px] text-slate-400 font-normal">
                                  {d.totalStudents.toLocaleString()} students enrolled
                                </div>
                              </td>
                              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{d.totalSchools.toLocaleString()}</td>
                              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{d.targetVisits.toLocaleString()}</td>
                              <td className="px-3 py-3 text-right tabular-nums font-bold text-slate-900">{d.actualVisits.toLocaleString()}</td>
                              <td className="px-3 py-3 text-right tabular-nums font-bold">
                                <span className={ach >= 85 ? 'text-emerald-700' : ach >= 70 ? 'text-amber-700' : 'text-rose-700'}>
                                  {ach}%
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right tabular-nums text-slate-700">{schCov}%</td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  d.criticalSchoolsCount > 50 ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                                }`}>
                                  {d.criticalSchoolsCount}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleDistrictChange(d.id)}
                                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-semibold text-xs border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                                >
                                  <span>Inspect Mandals</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VISITS DISTRICT VIEW: MANDAL PROGRESS TABLE */}
              {activeLevel === 'DISTRICT' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeDistrict?.name} District — Mandal Visit Achievement Table
                      </h3>
                      <p className="text-xs text-slate-500">
                        DEO & Dy. DEO Monitoring: Review mandal inspection targets and drill to individual schools.
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="Search mandal..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-48"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="px-4 py-3">Mandal Name</th>
                          <th className="px-3 py-3 text-right">Total Schools</th>
                          <th className="px-3 py-3 text-right">Target Visits</th>
                          <th className="px-3 py-3 text-right font-bold text-slate-900">Actual Visits</th>
                          <th className="px-3 py-3 text-right">Achievement %</th>
                          <th className="px-3 py-3 text-right font-mono">Visit Gap</th>
                          <th className="px-3 py-3 text-right">Hierarchy Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {searchedMandals.map(m => {
                          const ach = Math.round((m.actualVisits / m.targetVisits) * 100);
                          const gap = m.targetVisits - m.actualVisits;
                          return (
                            <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-900">{m.name} Mandal</td>
                              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{m.totalSchools}</td>
                              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{m.targetVisits}</td>
                              <td className="px-3 py-3 text-right tabular-nums font-bold text-slate-900">{m.actualVisits}</td>
                              <td className="px-3 py-3 text-right tabular-nums font-bold">
                                <span className={ach >= 85 ? 'text-emerald-700' : 'text-amber-700'}>
                                  {ach}%
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right tabular-nums font-mono text-amber-700 font-bold">{gap > 0 ? `-${gap}` : 'Met'}</td>
                              <td className="px-3 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleMandalChange(m.id)}
                                  className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-800 rounded font-semibold text-xs border border-blue-200 transition-colors cursor-pointer inline-flex items-center gap-1"
                                >
                                  <span>Drill to Schools</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* VISITS MANDAL VIEW: SCHOOL INSPECTION ROSTER */}
              {activeLevel === 'MANDAL' && (
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
                  <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {activeMandal?.name} Mandal — School Inspection Dispatch Roster
                      </h3>
                      <p className="text-xs text-slate-500">
                        MEO & CRP supervisory visit priority ordered by Class 1–5 Enrolment (higher enrolment visited first).
                      </p>
                    </div>
                    <input
                      type="text"
                      placeholder="Search school or UDISE..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-full sm:w-56"
                    />
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 font-semibold">
                        <tr>
                          <th className="px-4 py-3">School Name & UDISE</th>
                          <th className="px-3 py-3">Cluster</th>
                          <th className="px-3 py-3 text-center">
                            <div>Visit Priority (Class 1–5 Enrolment)</div>
                            <div className="text-[9px] text-slate-400 font-normal">Ranked by Primary Students Enrolled</div>
                          </th>
                          <th className="px-3 py-3 text-center">Visits This Month</th>
                          <th className="px-3 py-3 text-right">Last Visit Date</th>
                          <th className="px-3 py-3 text-right">Field Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {searchedSchools.map((s, idx) => {
                          const isHighDensity = s.totalStudents >= 140;
                          const isMediumDensity = s.totalStudents >= 100;
                          return (
                            <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                              <td className="px-4 py-3 font-semibold text-slate-900">
                                <div>{s.name}</div>
                                <div className="text-[10px] text-slate-400 font-normal">UDISE: {s.udiseCode} · HM: {s.headmasterName}</div>
                              </td>
                              <td className="px-3 py-3 text-slate-600">{s.clusterName}</td>
                              <td className="px-3 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  isHighDensity 
                                    ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' 
                                    : isMediumDensity 
                                    ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                                    : 'bg-slate-100 text-slate-700'
                                }`}>
                                  Rank #{idx + 1} · {s.totalStudents} Students
                                </span>
                              </td>
                              <td className="px-3 py-3 text-center tabular-nums">
                                <span className={`font-semibold ${s.visitsThisMonth > 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                                  {s.visitsThisMonth} visit{s.visitsThisMonth === 1 ? '' : 's'}
                                </span>
                              </td>
                              <td className="px-3 py-3 text-right tabular-nums text-slate-600">{s.lastVisitDate}</td>
                              <td className="px-3 py-3 text-right">
                                <button
                                  type="button"
                                  onClick={() => onSelectSchoolForVisit(s)}
                                  className="px-2.5 py-1.5 bg-blue-700 hover:bg-blue-800 text-white rounded font-semibold text-xs shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
                                >
                                  <Play className="w-3 h-3 fill-current" />
                                  <span>Start Inspection</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}

        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 5. MODAL: CLASS 1-5 ENROLMENT VISIT PRIORITIZATION & JURISDICTION POLICY */}
      {/* ---------------------------------------------------------------------- */}
      {showSPSModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-800 flex items-center justify-center">
                  <Info className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    School Visit Prioritization Policy (Class 1–5 Enrolment)
                  </h3>
                  <p className="text-xs text-slate-500">
                    Role-Based Jurisdiction Scoping: Cluster (CRP) • Mandal (MEO) • District (DEO)
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowSPSModal(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Core Policy Rule Box */}
            <div className="bg-indigo-50 p-3.5 rounded-xl border border-indigo-200 text-xs space-y-2 text-indigo-950">
              <div className="font-bold flex items-center gap-1.5 text-indigo-900 text-sm">
                <span>📋 Official Prioritization Rule: Primary Student Enrolment Order</span>
              </div>
              <p className="text-slate-700 leading-relaxed text-[11px]">
                Under the revised foundational learning directive, school visit priority is directly determined by <strong>Class 1–5 student enrolment</strong> within the designated administrative jurisdiction of each officer cadre. Schools with larger student cohorts are scheduled first to maximize supervisory coverage, classroom support, and diagnostic impact.
              </p>
            </div>

            {/* Role-Based Jurisdiction Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="font-bold text-slate-900 text-sm">Role-Based Jurisdiction Hierarchy:</div>

              <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <SchoolIcon className="w-4 h-4 text-emerald-700" />
                    <span>1. Cluster Resource Person (CRP) — Cluster Scoping</span>
                  </span>
                  <span className="text-[11px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-mono">Cluster Level</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Schools are ranked by Class 1–5 enrolment strictly within the officer's assigned <strong>Cluster</strong> (e.g., Kaza Cluster). High-enrolment primary schools are visited first for intensive teacher coaching, lesson plan auditing, and 1-on-1 student assessment.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                <div className="flex justify-between font-bold text-amber-900">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-amber-700" />
                    <span>2. Mandal Educational Officer (MEO) — Mandal Scoping</span>
                  </span>
                  <span className="text-[11px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-mono">Mandal Level</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Schools are ranked by Class 1–5 enrolment across all clusters within the <strong>Mandal</strong> (e.g., Mangalagiri Mandal). Visits are sequenced so that mandal-wide foundational learning hubs with the highest student concentration receive early supervisory oversight.
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl p-3 space-y-1">
                <div className="flex justify-between font-bold text-blue-900">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-blue-700" />
                    <span>3. DEO & Dy. DEO — District / Division Scoping</span>
                  </span>
                  <span className="text-[11px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-mono">District Level</span>
                </div>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Schools are ranked by Class 1–5 enrolment across the entire <strong>District or Division</strong> (e.g., Guntur District). District leadership focuses routine inspections on institutions with the largest primary school populations.
                </p>
              </div>
            </div>

            {/* Enrolment Density Tiers */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="font-bold text-slate-900 mb-1">Enrolment-Based Priority Tiers (Classes 1–5):</div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-[11px]">
                <div className="p-2 rounded bg-indigo-100 text-indigo-900 font-bold border border-indigo-200">
                  <div>&ge; 140 Students</div>
                  <div className="text-[10px] font-normal">CRITICAL (Top Priority)</div>
                </div>
                <div className="p-2 rounded bg-blue-100 text-blue-900 font-bold border border-blue-200">
                  <div>100–139 Students</div>
                  <div className="text-[10px] font-normal">HIGH Priority</div>
                </div>
                <div className="p-2 rounded bg-amber-100 text-amber-900 font-bold border border-amber-200">
                  <div>60–99 Students</div>
                  <div className="text-[10px] font-normal">MEDIUM Priority</div>
                </div>
                <div className="p-2 rounded bg-slate-100 text-slate-800 font-bold border border-slate-200">
                  <div>&lt; 60 Students</div>
                  <div className="text-[10px] font-normal">NORMAL Priority</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setShowSPSModal(false)}
                className="px-4 py-2 bg-slate-900 text-white font-semibold text-xs rounded-xl hover:bg-slate-800 cursor-pointer"
              >
                Close Policy Guide
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
