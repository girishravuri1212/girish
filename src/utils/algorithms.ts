import { 
  School, 
  Student, 
  MonthlyAssessmentStatus, 
  PriorityLevel, 
  SystemConfig, 
  Question,
  Role,
  ClusterPrioritySummary
} from '../types/fln';

export interface RolePriorityScoreBreakdown {
  score: number;
  level: PriorityLevel;
  reason: string;
  enrolmentClass1to5: number;
  enrolmentPoints: number;        // Higher enrolment (0-35 pts)
  visitDeficitPoints: number;     // Less or no monitoring visits by all officers (0-40 pts)
  performanceDeficitPoints: number; // Student performance deficit: lower FLN = higher urgency (0-25 pts)
  isFlaggedRepeatVisit: boolean;  // Visited > 2 times this month
  repeatVisitCount: number;
  rankInScope: number;
}

/**
 * Calculate Great-Circle Distance (Haversine formula in kilometers)
 */
export function calculateDistanceKm(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 1.5;
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Find nearby schools for 2nd school visit recommendation (within 1-5 km)
 */
export interface NearbySchoolOption {
  school: School;
  distanceKm: number;
}

export function findNearbySchools(
  primarySchool: School, 
  allSchools: School[], 
  maxDistanceKm: number = 6
): NearbySchoolOption[] {
  return allSchools
    .filter(s => s.id !== primarySchool.id)
    .map(s => ({
      school: s,
      distanceKm: calculateDistanceKm(
        primarySchool.latitude || 16.4385,
        primarySchool.longitude || 80.5621,
        s.latitude || 16.4385,
        s.longitude || 80.5621
      )
    }))
    .filter(item => item.distanceKm <= maxDistanceKm)
    .sort((a, b) => a.distanceKm - b.distanceKm);
}

/**
 * Role-Based School Visit Prioritization:
 * - For CRP: Directly school-level priority based on:
 *   1) Higher Enrolment (Class 1-5 primary students)
 *   2) No. of schools with less or No monitoring visits by all officers
 *   3) Student Performance (lower FLN % score increases urgency)
 * - Flagged: If visitsThisMonth > 2, flagged with audit requirement
 */
export function calculateRoleBasedSchoolPriority(
  school: School,
  role: Role = 'CRP',
  rank: number = 1,
  totalCount: number = 1,
  jurisdictionScopeLabel: string = 'Cluster'
): RolePriorityScoreBreakdown {
  const enrolment = school.totalStudents || school.enrolmentClass1to5 || 50;
  const visits = school.visitsThisMonth || 0;
  const flnScore = school.lastFLNScore || 60;

  // 1. Higher Enrolment Points (0 to 35 pts)
  // Higher student population = larger foundational learning impact
  const enrolmentPoints = Math.min(35, Math.round((enrolment / 200) * 35));

  // 2. Monitoring Visit Deficit by All Officers (0 to 40 pts)
  // Schools with zero or fewer visits receive highest urgency
  let visitDeficitPoints = 0;
  if (visits === 0) {
    visitDeficitPoints = 40; // 0 visits: Maximum urgency / unserved school
  } else if (visits === 1) {
    visitDeficitPoints = 20; // 1 visit: Moderate coverage
  } else if (visits === 2) {
    visitDeficitPoints = 8;  // 2 visits: Well monitored
  } else {
    visitDeficitPoints = 0;  // > 2 visits: Flagged for repeat audit
  }

  // 3. Student Performance Deficit (0 to 25 pts)
  // Lower FLN % score = higher need for pedagogical intervention
  const performanceDeficitPoints = Math.max(0, Math.min(25, Math.round(((100 - flnScore) / 100) * 25)));

  // Composite Priority Score (0 to 100)
  const compositeScore = enrolmentPoints + visitDeficitPoints + performanceDeficitPoints;

  // Flag logic: If visited more than 2 times in a month, flagged for MEO audit
  const isFlaggedRepeatVisit = visits > 2;

  // Priority Level classification
  let level: PriorityLevel = 'NORMAL';
  if (compositeScore >= 65 || (visits === 0 && enrolment >= 120)) {
    level = 'CRITICAL';
  } else if (compositeScore >= 45 || visits === 0) {
    level = 'HIGH';
  } else if (compositeScore >= 30) {
    level = 'MEDIUM';
  }

  // Construct transparent rationale
  let reason = '';
  if (isFlaggedRepeatVisit) {
    reason = `⚠️ AUDIT FLAG: Visited ${visits} times this month (> 2 threshold). MEO justification & learning output review required.`;
  } else if (visits === 0) {
    reason = `🚨 ZERO monitoring visits this month · ${enrolment} students enrolled · FLN Score: ${flnScore}% (Immediate visit required)`;
  } else {
    reason = `High Enrolment (${enrolment} students) · ${visits} visit(s) this month · FLN Score: ${flnScore}%`;
  }

  return {
    score: compositeScore,
    level,
    reason,
    enrolmentClass1to5: enrolment,
    enrolmentPoints,
    visitDeficitPoints,
    performanceDeficitPoints,
    isFlaggedRepeatVisit,
    repeatVisitCount: visits,
    rankInScope: rank,
  };
}

/**
 * Generic School Priority wrapper for backwards compatibility
 */
export function calculateSchoolPriority(
  school: School,
  config?: SystemConfig,
  currentDateStr: string = '2026-07-15',
  rank: number = 1,
  totalCount: number = 1,
  jurisdictionScopeLabel: string = 'jurisdiction'
): { 
  score: number; 
  level: PriorityLevel; 
  reason: string;
  enrolmentClass1to5: number;
  rankInScope: number;
  breakdown: {
    learningPoints: number;
    visitPoints: number;
    studentCoveragePoints: number;
    coveragePoints: number;
  };
} {
  const result = calculateRoleBasedSchoolPriority(school, 'CRP', rank, totalCount, jurisdictionScopeLabel);

  return { 
    score: result.score, 
    level: result.level, 
    reason: result.reason,
    enrolmentClass1to5: result.enrolmentClass1to5,
    rankInScope: rank,
    breakdown: {
      learningPoints: result.enrolmentPoints,
      visitPoints: result.visitDeficitPoints,
      studentCoveragePoints: result.performanceDeficitPoints,
      coveragePoints: school.monthlyCoveragePercent || 0,
    }
  };
}

/**
 * First Layer for MEO: Aggregate Clusters in the Mandal and Rank by Need
 */
export function aggregateClusterPriorities(
  mandalSchools: School[]
): ClusterPrioritySummary[] {
  const clusterMap: Record<string, School[]> = {};

  mandalSchools.forEach(sch => {
    const key = sch.clusterName || 'General Cluster';
    if (!clusterMap[key]) clusterMap[key] = [];
    clusterMap[key].push(sch);
  });

  const clusterSummaries: ClusterPrioritySummary[] = Object.keys(clusterMap).map(clusterName => {
    const list = clusterMap[clusterName];
    const totalSchools = list.length;
    const unvisitedSchoolsCount = list.filter(s => (s.visitsThisMonth || 0) === 0).length;
    const totalEnrolmentClass1to5 = list.reduce((acc, s) => acc + (s.totalStudents || 0), 0);
    const avgFLNScore = Math.round((list.reduce((acc, s) => acc + (s.lastFLNScore || 0), 0) / (totalSchools || 1)) * 10) / 10;
    const avgVisitsPerSchool = Math.round((list.reduce((acc, s) => acc + (s.visitsThisMonth || 0), 0) / (totalSchools || 1)) * 10) / 10;
    const repeatVisitSchoolsCount = list.filter(s => (s.visitsThisMonth || 0) > 2).length;

    // Cluster Priority Score: Unvisited % (45 pts) + Learning deficit (35 pts) + Enrolment (20 pts)
    const unvisitedRatio = unvisitedSchoolsCount / (totalSchools || 1);
    const unvisitedPts = Math.round(unvisitedRatio * 45);
    const flnDeficitPts = Math.round(((100 - avgFLNScore) / 100) * 35);
    const enrolmentPts = Math.min(20, Math.round((totalEnrolmentClass1to5 / 600) * 20));
    const priorityScore = unvisitedPts + flnDeficitPts + enrolmentPts;

    let priorityLevel: PriorityLevel = 'NORMAL';
    if (unvisitedSchoolsCount >= 2 || avgFLNScore < 52 || priorityScore >= 60) {
      priorityLevel = 'CRITICAL';
    } else if (unvisitedSchoolsCount >= 1 || avgFLNScore < 65 || priorityScore >= 45) {
      priorityLevel = 'HIGH';
    } else if (priorityScore >= 30) {
      priorityLevel = 'MEDIUM';
    }

    const first = list[0];

    return {
      clusterName,
      mandalId: first.mandalId,
      mandalName: first.mandalName,
      districtId: first.districtId,
      districtName: first.districtName,
      totalSchools,
      unvisitedSchoolsCount,
      totalEnrolmentClass1to5,
      avgFLNScore,
      avgVisitsPerSchool,
      repeatVisitSchoolsCount,
      priorityScore,
      priorityLevel,
      priorityRank: 0,
    };
  });

  // Sort by priorityScore descending
  clusterSummaries.sort((a, b) => b.priorityScore - a.priorityScore);
  clusterSummaries.forEach((c, idx) => {
    c.priorityRank = idx + 1;
  });

  return clusterSummaries;
}

/**
 * Filter students into Unassessed and Assessed pools for the given month
 */
export function partitionStudentsByMonthlyStatus(
  students: Student[],
  monthlyStatusList: MonthlyAssessmentStatus[]
): {
  unassessedStudents: Student[];
  assessedStudents: Student[];
  statusMap: Record<string, MonthlyAssessmentStatus>;
} {
  const statusMap: Record<string, MonthlyAssessmentStatus> = {};
  monthlyStatusList.forEach(st => {
    statusMap[st.studentId] = st;
  });

  const unassessedStudents: Student[] = [];
  const assessedStudents: Student[] = [];

  students.forEach(student => {
    const status = statusMap[student.id];
    if (status && status.isAssessedThisMonth) {
      assessedStudents.push(student);
    } else {
      unassessedStudents.push(student);
    }
  });

  return { unassessedStudents, assessedStudents, statusMap };
}

/**
 * Intelligent Random Student Selector:
 * Selects N students STRICTLY from the unassessed pool!
 * If unassessed pool is smaller than required count, selects all unassessed students.
 */
export function selectRandomUnassessedStudents(
  unassessedStudents: Student[],
  count: number = 5,
  excludeIds: string[] = []
): Student[] {
  const eligible = unassessedStudents.filter(s => !excludeIds.includes(s.id));
  if (eligible.length <= count) {
    return [...eligible];
  }

  // Fisher-Yates random sampling
  const shuffled = [...eligible];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, count);
}

/**
 * Performance Band Evaluator based on configurable thresholds
 */
export function evaluatePerformanceBand(
  scorePercent: number,
  config: SystemConfig
): 'BEGINNING' | 'DEVELOPING' | 'PROFICIENT' | 'ADVANCED' {
  if (scorePercent < config.performanceThresholds.beginningMax) return 'BEGINNING';
  if (scorePercent < config.performanceThresholds.developingMax) return 'DEVELOPING';
  if (scorePercent < config.performanceThresholds.proficientMax) return 'PROFICIENT';
  return 'ADVANCED';
}

/**
  * Evaluates score for any question type (MCQ, ORF_TIMER, GRID_TOUCH, NUMERIC_INPUT, ORDERING, ORAL_RUBRIC)
  */
export function evaluateQuestionScore(q: Question, answer: any): { score: number; isCorrect: boolean } {
  if (answer === undefined || answer === null) {
    return { score: 0, isCorrect: false };
  }

  // 1. Timed Oral Reading Fluency (WCPM)
  if (q.questionType === 'ORF_TIMER') {
    const wcpm = typeof answer === 'number' ? answer : (answer?.wcpm ?? 0);
    const target = q.orfTargetWCPM || 35;
    const isCorrect = wcpm >= target;
    const ratio = Math.min(1, Math.max(0, wcpm / target));
    const score = Math.round(ratio * q.maxScore);
    return { score, isCorrect };
  }

  // 2. Letter / Word Touch Grid
  if (q.questionType === 'GRID_TOUCH') {
    const recognizedCount = Array.isArray(answer) 
      ? answer.length 
      : (typeof answer === 'number' ? answer : 0);
    const totalItems = q.gridItems?.length || 10;
    const isCorrect = recognizedCount >= Math.ceil(totalItems * 0.7); // 70% benchmark
    const score = Math.min(q.maxScore, Math.round((recognizedCount / totalItems) * q.maxScore));
    return { score, isCorrect };
  }

  // 3. Direct Numeric Calculation (Mental Math)
  if (q.questionType === 'NUMERIC_INPUT') {
    const num = typeof answer === 'number' ? answer : parseFloat(answer);
    const isCorrect = !isNaN(num) && num === q.correctNumericAnswer;
    return { score: isCorrect ? q.maxScore : 0, isCorrect };
  }

  // 4. Sequencing & Chronological Ordering
  if (q.questionType === 'ORDERING') {
    const order = Array.isArray(answer) ? answer : [];
    const correct = q.correctOrder || [];
    const isCorrect = order.length === correct.length && order.every((val, idx) => val === correct[idx]);
    return { score: isCorrect ? q.maxScore : 0, isCorrect };
  }

  // 5. Direct Assessor Observation Rubric / Oral Performance
  if (q.questionType === 'ORAL_RUBRIC' || answer === 'CORRECT' || answer === 'PARTIAL' || answer === 'INCORRECT') {
    if (answer === 'CORRECT') {
      return { score: q.maxScore, isCorrect: true };
    }
    if (answer === 'PARTIAL') {
      return { score: Math.round(q.maxScore * 0.5), isCorrect: false };
    }
    if (answer === 'INCORRECT') {
      return { score: 0, isCorrect: false };
    }
    const rubricScore = typeof answer === 'number' ? answer : 0;
    const isCorrect = rubricScore >= Math.round(q.maxScore * 0.6);
    return { score: Math.min(q.maxScore, rubricScore), isCorrect };
  }

  // 6. Default Fallback
  if (typeof answer === 'number') {
    if (answer === q.maxScore || answer === q.correctAnswerIndex) {
      return { score: q.maxScore, isCorrect: true };
    }
    if (answer > 0 && answer < q.maxScore) {
      return { score: answer, isCorrect: answer >= Math.round(q.maxScore * 0.6) };
    }
  }
  return { score: 0, isCorrect: false };
}
