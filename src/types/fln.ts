export type Role = 
  | 'STATE_LEADERSHIP'
  | 'DEO'
  | 'DY_DEO'
  | 'MEO'
  | 'CRP'
  | 'HEADMASTER'
  | 'TEACHER'
  | 'ADMIN';

export type PriorityLevel = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'NORMAL';

export type VisitType = 'ROUTINE' | 'FOLLOW_UP' | 'SPECIAL' | 'SURPRISE' | 'REVISIT';

export type PerformanceBand = 'BEGINNING' | 'DEVELOPING' | 'PROFICIENT' | 'ADVANCED';

export type ActionStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface UserProfile {
  id: string;
  name: string;
  role: Role;
  designation: string;
  email: string;
  phone: string;
  districtId: string;
  mandalId?: string;
  clusterId?: string;
  schoolId?: string;
  monthlyVisitTarget: number;
}

export type CadreType = 'DY_DEO' | 'MEO' | 'CRP' | 'DEO';

export interface SupervisoryCadreOfficer {
  id: string;
  name: string;
  cadre: CadreType;
  role: Role;
  designation: string;
  districtId: string;
  districtName: string;
  divisionName?: string;
  mandalId?: string;
  mandalName?: string;
  clusterId?: string;
  clusterName?: string;
  monthlyTarget: number;
  completedVisits: number;
  achievementPercent: number;
  visitGap: number;
  assignedSchools: number;
  studentsAssessed: number;
  criticalSchoolsVisited: number;
  status: 'ON_TRACK' | 'VISIT_LAG' | 'CRITICAL_DEFICIT';
  lastVisitDate: string;
}

export interface District {
  id: string;
  name: string;
  code: string;
  totalSchools: number;
  totalStudents: number;
  visitedSchoolsThisMonth: number;
  targetVisits: number;
  actualVisits: number;
  uniqueStudentsAssessed: number;
  totalEligibleStudents: number;
  avgLiteracyScore: number;
  avgTeluguScore?: number;
  avgEnglishScore?: number;
  avgNumeracyScore: number;
  avgFLNScore: number;
  criticalSchoolsCount: number;
}

export interface Mandal {
  id: string;
  districtId: string;
  name: string;
  totalSchools: number;
  targetVisits: number;
  actualVisits: number;
  uniqueStudentsAssessed: number;
  totalEligibleStudents: number;
  avgFLNScore: number;
  avgTeluguScore?: number;
  avgEnglishScore?: number;
  avgNumeracyScore?: number;
  priorityScore: number;
}

export interface School {
  id: string;
  udiseCode: string;
  name: string;
  districtId: string;
  districtName: string;
  mandalId: string;
  mandalName: string;
  clusterName: string;
  clusterId?: string;
  category: 'Primary' | 'Upper Primary';
  management: 'Government' | 'MPPS' | 'ZPHS';
  headmasterName: string;
  totalStudents: number; // Enrolment in Classes 1–5
  enrolmentClass1to5?: number; // Explicit Class 1–5 primary enrolment
  enrolmentRank?: number; // Priority rank within cluster/mandal/district
  enrolmentTier?: 'TIER_1_HIGH' | 'TIER_2_MODERATE' | 'TIER_3_DEVELOPING' | 'TIER_4_FEEDER';
  lastVisitDate: string;
  visitsThisMonth: number;
  lastFLNScore: number;
  lastLiteracyScore: number;
  lastNumeracyScore: number;
  monthlyCoveragePercent: number;
  priorityScore: number; // Retained for compatibility, set to Class 1-5 enrolment
  priorityLevel: PriorityLevel;
  priorityReason: string;
  pendingActionsCount: number;
  attendancePercent: number;
  latitude: number;
  longitude: number;
}

export interface Student {
  id: string;
  pen: string; // Permanent Education Number / AP Child ID
  name: string;
  nameTelugu: string;
  gender: 'M' | 'F';
  schoolId: string;
  classNumber: number; // 1 to 5
  section: string; // 'A' or 'B'
  rollNumber: number;
  attendancePercent: number;
  category: string;
}

export interface MonthlyAssessmentStatus {
  id: string;
  studentId: string;
  schoolId: string;
  classNumber: number;
  section: string;
  monthYear: string; // e.g. "2026-07"
  isAssessedThisMonth: boolean;
  assessmentCount: number;
  lastAssessedDate?: string;
  lastAssessorName?: string;
  lastAssessorRole?: string;
  literacyScore?: number;
  englishScore?: number;
  numeracyScore?: number;
  flnScore?: number;
  performanceBand?: PerformanceBand;
}

export type QuestionType = 
  | 'MCQ'                       // Traditional 4 options
  | 'ORF_TIMER'                 // Timed Oral Reading Fluency (Passage with WCPM stopwatch & word counter)
  | 'GRID_TOUCH'                // Letter & Word Matrix (tap to toggle recognized/unrecognized)
  | 'NUMERIC_INPUT'             // Mental math direct calculation entry
  | 'ORDERING'                  // Sequence arrangement (ascending numbers, chronological story order)
  | 'ORAL_RUBRIC';              // Open-ended speech/picture description scored on 3-tier rubric

export interface Question {
  id: string;
  subject: 'LITERACY' | 'ENGLISH' | 'NUMERACY';
  medium?: Medium;
  classNumber: number;
  competency: string;
  competencyTelugu?: string;
  difficulty: 'EASY' | 'MODERATE' | 'DIFFICULT';
  text: string;
  textTelugu?: string;
  questionType?: QuestionType; // Defaults to 'MCQ'
  options: string[];
  correctAnswerIndex: number;
  maxScore: number;
  nipunTargetRef: string;
  // Specialized question attributes for non-MCQ types:
  orfPassage?: string;
  orfTargetWCPM?: number;
  gridItems?: string[];
  correctNumericAnswer?: number;
  numericUnit?: string;
  orderingItems?: string[];
  correctOrder?: string[];
  rubricLevels?: { score: number; label: string; labelTelugu: string; desc: string }[];
  instructionPrompt?: string;
}

export interface AssessmentRecord {
  id: string;
  visitId: string;
  schoolId: string;
  schoolName: string;
  studentId: string;
  studentName: string;
  classNumber: number;
  section: string;
  assessorId: string;
  assessorName: string;
  assessorRole: string;
  assessmentDate: string;
  monthYear: string;
  isReassessment: boolean;
  reassessmentReason?: string;
  literacyScore: number;
  literacyMax: number;
  englishScore?: number;
  englishMax?: number;
  numeracyScore: number;
  numeracyMax: number;
  totalScorePercent: number;
  performanceBand: PerformanceBand;
  answers: {
    questionId: string;
    selectedOption: number;
    isCorrect: boolean;
    difficulty: string;
  }[];
}

export interface VisitRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  udiseCode: string;
  officerId: string;
  officerName: string;
  officerDesignation: string;
  date: string;
  monthYear: string;
  checkInTime: string;
  checkOutTime?: string;
  visitType: VisitType;
  gpsLatitude: number;
  gpsLongitude: number;
  status: 'IN_PROGRESS' | 'COMPLETED';
  classesVisited: number[];
  studentsAssessedCount: number;
  uniqueStudentsAssessedCount: number;
  observations: string;
  actionItemsCreated: number;
}

export interface ActionItem {
  id: string;
  schoolId: string;
  schoolName: string;
  mandalName: string;
  classNumber?: number;
  issueTitle: string;
  description: string;
  competencyArea?: string;
  assignedTo: string;
  targetDate: string;
  status: ActionStatus;
  createdDate: string;
  createdBy: string;
  resolutionRemarks?: string;
}

export interface SystemConfig {
  minimumStudentsPerClass: number;
  maximumStudentsPerClass: number;
  targets: {
    DEO: number;
    DY_DEO: number;
    MEO: number;
    CRP: number;
  };
  priorityWeights: {
    learningGap: number; // default 35
    coverageGap: number; // default 25
    visitGap: number;    // default 20
    recencyGap: number;  // default 10
    pendingIssues: number; // default 10
  };
  performanceThresholds: {
    beginningMax: number;   // < 40%
    developingMax: number;  // < 70%
    proficientMax: number;  // < 90%
    // >= 90% is Advanced
  };
  currentMonthYear: string; // e.g. "2026-07"
  academicYear: string;     // "2026-2027"
}

export type Medium = 'TELUGU' | 'ENGLISH';

export type ObservationRating = 'YES' | 'PARTIALLY' | 'NO' | 'NA';

export interface ClassroomObservationIndicator {
  id: number;
  sectionKey: 'TEACHING_LEARNING' | 'TLM_USAGE' | 'MULTIGRADE' | 'ASSESSMENT_ENGAGEMENT';
  sectionTitle: string;
  indicatorText: string;
}

export interface ClassroomObservationData {
  ratings: Record<number, ObservationRating>;
  remarks: string;
  observedTeacherName?: string;
  observedSubject?: string;
  observedGrade?: number;
  observedSection?: string;
  submittedAt?: string;
}

export interface RepeatVisitAuditRecord {
  id: string;
  schoolId: string;
  schoolName: string;
  udiseCode: string;
  mandalName: string;
  clusterName: string;
  visitsThisMonth: number;
  officerName: string;
  officerRole: Role;
  lastVisitDate: string;
  justificationReason: string;
  baselineFLNScore: number;   // Visit 1 FLN
  midlineFLNScore: number;    // Visit 2 FLN
  latestFLNScore: number;     // Visit 3+ FLN
  outputDelta: number;        // latest - baseline
  meoStatus: 'PENDING_REVIEW' | 'APPROVED' | 'EXPLANATION_CALLED';
  meoRemarks?: string;
}

export interface ClusterPrioritySummary {
  clusterName: string;
  mandalId: string;
  mandalName: string;
  districtId: string;
  districtName: string;
  totalSchools: number;
  unvisitedSchoolsCount: number;
  totalEnrolmentClass1to5: number;
  avgFLNScore: number;
  avgVisitsPerSchool: number;
  repeatVisitSchoolsCount: number;
  priorityScore: number;
  priorityLevel: PriorityLevel;
  priorityRank: number;
}

