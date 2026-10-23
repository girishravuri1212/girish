import React, { useState, useEffect, useMemo } from 'react';
import { 
  Smartphone, 
  Monitor, 
  MapPin, 
  Clock, 
  CheckCircle, 
  CheckCircle2, 
  XCircle, 
  Users, 
  BookOpen, 
  Calculator, 
  AlertTriangle, 
  Shuffle, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Send, 
  Check, 
  Info,
  Calendar,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2,
  Timer,
  Play,
  Pause,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Lock,
  ClipboardCheck
} from 'lucide-react';
import { 
  School, 
  Student, 
  MonthlyAssessmentStatus, 
  Question, 
  VisitType, 
  UserProfile, 
  SystemConfig,
  ActionItem,
  AssessmentRecord,
  ClassroomObservationData,
  Medium
} from '../types/fln';
import { ClassroomObservationChecklist } from './ClassroomObservationChecklist';
import { SCHOOLS_DATA, STUDENTS_CLASS_3A } from '../data/mockData';
import { COMPETENCY_QUESTIONS, COMPETENCIES_BY_DOMAIN } from '../data/competencyQuestions';
import { FLN_TARGETS_2026_27 } from '../data/flnTargets2026_27';
import { 
  partitionStudentsByMonthlyStatus, 
  selectRandomUnassessedStudents, 
  evaluatePerformanceBand,
  evaluateQuestionScore
} from '../utils/algorithms';
import { APGovtLogo } from './APGovtLogo';

interface FieldAppSimulatorProps {
  currentUser: UserProfile;
  config: SystemConfig;
  monthlyStatusList: MonthlyAssessmentStatus[];
  onUpdateMonthlyStatus: (updated: MonthlyAssessmentStatus[]) => void;
  onAddAssessmentRecords: (records: AssessmentRecord[]) => void;
  onAddActionItem: (item: ActionItem) => void;
  isOnline: boolean;
  onQueueOfflineAction: (type: string, data: any) => void;
  initialSchool?: School;
  onBackToTourDiary?: () => void;
}

export const FieldAppSimulator: React.FC<FieldAppSimulatorProps> = ({
  currentUser,
  config,
  monthlyStatusList,
  onUpdateMonthlyStatus,
  onAddAssessmentRecords,
  onAddActionItem,
  isOnline,
  onQueueOfflineAction,
  initialSchool,
  onBackToTourDiary,
}) => {
  // Device view mode: Phone Frame vs Wide Tablet
  const [deviceMode, setDeviceMode] = useState<'MOBILE' | 'TABLET'>('MOBILE');

  // Step state within the visit flow
  // 1: Cockpit / Home
  // 2: Tour Diary / Select School
  // 3: School Check-in
  // 4: Class & Section Selection
  // 5: Student Selection & Monthly Coverage Engine
  // 6: FLN Assessment Form
  // 7: Submission & Notifications
  // 8: Visit Check-out & Action Item
  const [activeStep, setActiveStep] = useState<number>(initialSchool ? 3 : 1);

  // Active Visit State
  const [selectedSchool, setSelectedSchool] = useState<School>(initialSchool || SCHOOLS_DATA[0]);

  // Synchronize when initialSchool changes
  useEffect(() => {
    if (initialSchool) {
      setSelectedSchool(initialSchool);
      setActiveStep(3); // Go straight to School Check-In!
    }
  }, [initialSchool]);
  const [visitType, setVisitType] = useState<VisitType>('ROUTINE');
  const [gpsVerified, setGpsVerified] = useState<boolean>(true);
  const [checkInTime, setCheckInTime] = useState<string>('09:45 AM');
  const [selectedClass, setSelectedClass] = useState<number>(3);
  const [selectedSection, setSelectedSection] = useState<string>('A');

  // Student Selection state
  const [studentFilter, setStudentFilter] = useState<'UNASSESSED' | 'ASSESSED' | 'ALL'>('UNASSESSED');
  const [selectedStudentIds, setSelectedStudentIds] = useState<string[]>([]);
  const [absentStudentIds, setAbsentStudentIds] = useState<string[]>([]);
  const [reassessmentWarningStudent, setReassessmentWarningStudent] = useState<Student | null>(null);
  const [reassessmentReason, setReassessmentReason] = useState<string>('Periodic Remedial Verification');

  // Active Assessment Form State
  const [currentStudentIndex, setCurrentStudentIndex] = useState<number>(0);
  const [studentAnswers, setStudentAnswers] = useState<Record<string, Record<string, any>>>({}); // { studentId: { questionId: selectedIndex | value } }
  // Active Assessment Form State (Two Tabs Only: Numeracy and Literacy; Literacy has Telugu & English)
  const [activeDomainTab, setActiveDomainTab] = useState<'LITERACY' | 'NUMERACY'>('LITERACY');
  const [literacyLanguage, setLiteracyLanguage] = useState<'TELUGU' | 'ENGLISH'>('TELUGU');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'EASY' | 'MODERATE' | 'DIFFICULT'>('ALL');
  const [domainValidationWarning, setDomainValidationWarning] = useState<string | null>(null);
  const [minStudentsWarning, setMinStudentsWarning] = useState<string | null>(null);
  const [sessionAssessedStudentIds, setSessionAssessedStudentIds] = useState<string[]>([]);
  const [recentlyAssessedNotification, setRecentlyAssessedNotification] = useState<{
    studentName: string;
    scorePercent: number;
    band: string;
  } | null>(null);
  const [assessmentSuccessInfo, setAssessmentSuccessInfo] = useState<{
    studentsCount: number;
    newCoveragePercent: number;
    proficientCount: number;
    developingCount: number;
  } | null>(null);

  // New Action Item state for check-out
  const [actionTitle, setActionTitle] = useState<string>('Class 3 Numeracy Carryover Addition Remedial Drills');
  const [actionCompetency, setActionCompetency] = useState<string>('Addition with Regrouping');
  const [visitObservations, setVisitObservations] = useState<string>('Overall classroom learning environment active. Need focused TLM practice for 2-digit subtraction and addition with carryover.');

  // Active class students (dynamically reflecting selected class 1 to 5)
  const activeClassStudents = useMemo<Student[]>(() => {
    return STUDENTS_CLASS_3A.map((s: Student) => ({
      ...s,
      classNumber: selectedClass,
    }));
  }, [selectedClass]);

  const [selectedMedium, setSelectedMedium] = useState<Medium>('TELUGU');
  const [classroomObservationData, setClassroomObservationData] = useState<ClassroomObservationData | null>({
    ratings: {
      1: 'YES',
      2: 'YES',
      3: 'PARTIALLY',
      4: 'YES',
      5: 'YES',
      6: 'PARTIALLY',
      7: 'PARTIALLY',
      8: 'YES',
      9: 'YES',
      10: 'YES',
      11: 'PARTIALLY',
      12: 'YES',
    },
    remarks: 'Teacher effectively followed the prescribed teaching sequence with grade-appropriate learning tasks. Need more hands-on TLM practice for struggling learners.',
    observedTeacherName: 'Sri B. Ramesh Kumar (SGT)',
    observedSubject: 'Foundational Literacy (Telugu)',
    observedGrade: 3,
    observedSection: 'A',
    submittedAt: '2026-07-15T10:15:00.000Z',
  });
  const [activeVisitMode, setActiveVisitMode] = useState<'STUDENT_ASSESSMENT' | 'CLASSROOM_OBSERVATION'>('CLASSROOM_OBSERVATION');

  // Questions strictly sourced from the SCERT Repository (COMPETENCY_QUESTIONS)
  // Non-MCQ: Evaluated directly by visiting officer using oral prompts and rubrics
  // Strictly enforce: "Each competency should not have more than two questions"
  const classQuestions = useMemo<Question[]>(() => {
    // 1. Filter by selected class (or closest available grade in repository)
    const filteredByClass = COMPETENCY_QUESTIONS.filter(q => q.classNumber === selectedClass);
    const sourceQuestions = filteredByClass.length > 0 ? filteredByClass : COMPETENCY_QUESTIONS;

    // 2. Filter by medium
    const mediumFiltered = sourceQuestions.filter(q => {
      if (q.medium) return q.medium === selectedMedium;
      if (selectedMedium === 'TELUGU' && q.domain === 'LITERACY_TELUGU') return true;
      if (selectedMedium === 'ENGLISH' && q.domain === 'LITERACY_ENGLISH') return true;
      return true;
    });

    // 3. Map repository CompetencyQuestion items to Question format (Non-MCQ, direct rubric grading)
    const mapped: Question[] = mediumFiltered.map(cq => {
      const subject: 'LITERACY' | 'ENGLISH' | 'NUMERACY' = 
        cq.domain === 'LITERACY_TELUGU' ? 'LITERACY' :
        cq.domain === 'LITERACY_ENGLISH' ? 'ENGLISH' : 'NUMERACY';

      const compDef = COMPETENCIES_BY_DOMAIN[cq.domain]?.find(c => c.id === cq.competencyId);
      const competencyName = compDef?.name || cq.competencyId;
      const expectedAnswerText = cq.options && cq.options[cq.correctAnswerIndex] ? cq.options[cq.correctAnswerIndex] : '';

      return {
        id: cq.id,
        subject,
        medium: cq.medium || (cq.domain === 'LITERACY_TELUGU' ? 'TELUGU' : cq.domain === 'LITERACY_ENGLISH' ? 'ENGLISH' : undefined),
        classNumber: cq.classNumber,
        competency: competencyName,
        competencyTelugu: compDef?.nameTelugu,
        difficulty: cq.difficulty,
        text: cq.text,
        textTelugu: cq.textTelugu,
        instructionPrompt: cq.oralPrompt,
        questionType: 'ORAL_RUBRIC', // Non-MCQ: Direct assessor grading
        options: cq.options || [],
        correctAnswerIndex: cq.correctAnswerIndex,
        maxScore: cq.maxScore || 10,
        nipunTargetRef: cq.nipunTargetRef,
        scoringRubric: cq.scoringRubric,
        expectedAnswer: expectedAnswerText,
      } as Question & { expectedAnswer?: string; scoringRubric?: string };
    });

    // 4. Enforce: "Only keep one question in each competency in student assessment"
    const competencyCountMap: Record<string, number> = {};
    const result: Question[] = [];

    for (const q of mapped) {
      const compKey = `${q.subject}__${q.competency}`;
      const count = competencyCountMap[compKey] || 0;
      if (count < 1) {
        competencyCountMap[compKey] = count + 1;
        result.push(q);
      }
    }
    return result;
  }, [selectedClass, selectedMedium]);

  const activeClassFLNTarget = useMemo(() => {
    return FLN_TARGETS_2026_27.find(t => t.grade === selectedClass) || FLN_TARGETS_2026_27[2];
  }, [selectedClass]);

  // Partition students based on current monthly status
  const { unassessedStudents, assessedStudents, statusMap } = partitionStudentsByMonthlyStatus(
    activeClassStudents,
    monthlyStatusList
  );

  const totalEnrolled = activeClassStudents.length;
  const assessedCount = assessedStudents.length;
  const unassessedCount = unassessedStudents.length;
  const coveragePercent = Math.round((assessedCount / totalEnrolled) * 1000) / 10;

  // --------------------------------------------------------------------------
  // DYNAMIC OFFICER VISIT & SAMPLING LOGIC (Calculated dynamically by role)
  // Numerator is strictly <= Denominator across all roles!
  // --------------------------------------------------------------------------
  const officerTargetVisits = (currentUser.monthlyVisitTarget && currentUser.monthlyVisitTarget > 0)
    ? currentUser.monthlyVisitTarget
    : currentUser.role === 'CRP' ? 30
    : currentUser.role === 'MEO' ? 20
    : currentUser.role === 'DY_DEO' ? 15
    : currentUser.role === 'DEO' ? 10
    : currentUser.role === 'HEADMASTER' ? 20
    : currentUser.role === 'TEACHER' ? 25
    : 5;

  const roleCompletedVisitsMap: Record<string, number> = {
    STATE_LEADERSHIP: 3, // 3 / 5 (60%)
    DEO: 7,              // 7 / 10 (70%)
    DY_DEO: 11,          // 11 / 15 (73.3%)
    MEO: 16,             // 16 / 20 (80%)
    CRP: 24,             // 24 / 30 (80%)
    HEADMASTER: 18,      // 18 / 20 (90%)
    TEACHER: 22,         // 22 / 25 (88%)
    ADMIN: 5,            // 5 / 5 (100%)
  };

  const officerCompletedVisits = Math.min(
    officerTargetVisits,
    roleCompletedVisitsMap[currentUser.role] ?? Math.round(officerTargetVisits * 0.75)
  );

  const officerVisitPercent = officerTargetVisits > 0
    ? Math.round((officerCompletedVisits / officerTargetVisits) * 100)
    : 100;
  const officerVisitGap = Math.max(0, officerTargetVisits - officerCompletedVisits);

  // Student assessment quota = 5 unique students per visit
  const officerStudentTarget = officerTargetVisits > 0 ? officerTargetVisits * 5 : 30;
  const officerAssessedStudents = Math.min(
    officerStudentTarget,
    Math.round(officerCompletedVisits * 5)
  );

  const officerStudentPercent = officerStudentTarget > 0
    ? Math.round((officerAssessedStudents / officerStudentTarget) * 100)
    : 100;
  const officerStudentGap = Math.max(0, officerStudentTarget - officerAssessedStudents);

  // Dynamic Jurisdiction label for welcome card
  const officerJurisdictionLabel = currentUser.role === 'STATE_LEADERSHIP' || currentUser.role === 'ADMIN'
    ? 'Andhra Pradesh (Statewide)'
    : currentUser.role === 'DEO' || currentUser.role === 'DY_DEO'
    ? 'Guntur District (District Level)'
    : currentUser.role === 'MEO'
    ? 'Mangalagiri Mandal, Guntur'
    : currentUser.role === 'CRP'
    ? 'Kaza Cluster, Mangalagiri Mandal'
    : 'MPPS Kaza Main (School Scope)';

  // Update selected school dynamically whenever the officer role changes
  useEffect(() => {
    let match: School | undefined;
    if (currentUser.schoolId) {
      match = SCHOOLS_DATA.find(s => s.id === currentUser.schoolId);
    } else if (currentUser.mandalId) {
      match = SCHOOLS_DATA.find(s => s.mandalId === currentUser.mandalId);
    } else if (currentUser.districtId && currentUser.districtId !== 'AP_ALL') {
      match = SCHOOLS_DATA.find(s => s.districtId === currentUser.districtId);
    }
    if (match) {
      setSelectedSchool(match);
    }
  }, [currentUser]);

  // Recommended schools scoped to the officer's jurisdiction and prioritized by Class 1–5 Enrolment
  const officerRecommendedSchools = SCHOOLS_DATA.filter(s => {
    if (currentUser.role === 'CRP') {
      const clusterTarget = currentUser.clusterId || 'Kaza Cluster';
      return s.clusterId === clusterTarget || s.clusterName === clusterTarget || s.clusterName === 'Kaza Cluster';
    }
    if (currentUser.role === 'MEO' || currentUser.mandalId) {
      const mandalTarget = currentUser.mandalId || 'MND_MANGALAGIRI';
      return s.mandalId === mandalTarget;
    }
    if (currentUser.districtId && currentUser.districtId !== 'AP_ALL') {
      return s.districtId === currentUser.districtId;
    }
    return true;
  }).sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));

  // Handler: Smart Random Select
  const handleRandomSelect = () => {
    // Select strictly from unassessed pool, excluding any already marked absent
    const pool = unassessedStudents.filter(s => !absentStudentIds.includes(s.id));
    const randomPick = selectRandomUnassessedStudents(pool, config.minimumStudentsPerClass);
    setSelectedStudentIds(randomPick.map(s => s.id));
  };

  // Handler: Toggle Student Selection
  const handleToggleStudent = (student: Student) => {
    const isAssessed = statusMap[student.id]?.isAssessedThisMonth;
    if (isAssessed) {
      // Reassessment rule: Prompt warning with reason modal
      setReassessmentWarningStudent(student);
      return;
    }

    if (selectedStudentIds.includes(student.id)) {
      setSelectedStudentIds(selectedStudentIds.filter(id => id !== student.id));
    } else {
      setSelectedStudentIds([...selectedStudentIds, student.id]);
    }
  };

  // Confirm Reassessment with Reason
  const confirmReassessment = () => {
    if (reassessmentWarningStudent) {
      if (!selectedStudentIds.includes(reassessmentWarningStudent.id)) {
        setSelectedStudentIds([...selectedStudentIds, reassessmentWarningStudent.id]);
      }
      setReassessmentWarningStudent(null);
    }
  };

  // Handler: Mark Student Absent
  const handleMarkAbsent = (studentId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!absentStudentIds.includes(studentId)) {
      const newAbsent = [...absentStudentIds, studentId];
      setAbsentStudentIds(newAbsent);
      // Remove from selected list
      const remainingSelected = selectedStudentIds.filter(id => id !== studentId);
      // Automatically draw a replacement from unassessed pool
      const availableUnassessed = unassessedStudents.filter(
        s => !newAbsent.includes(s.id) && !remainingSelected.includes(s.id)
      );
      if (availableUnassessed.length > 0) {
        remainingSelected.push(availableUnassessed[0].id);
      }
      setSelectedStudentIds(remainingSelected);
    } else {
      setAbsentStudentIds(absentStudentIds.filter(id => id !== studentId));
    }
  };

  // Start Assessment Form
  const handleProceedToAssessment = () => {
    if (selectedStudentIds.length === 0) {
      setMinStudentsWarning(`Please select at least ${config.minimumStudentsPerClass} students (or tap Random Select 5 Students).`);
      return;
    }
    setMinStudentsWarning(null);
    setCurrentStudentIndex(0);
    setActiveStep(6);
  };

  // Direct 1-Click Assess for an Unassessed Student
  const handleStartAssessingStudent = (student: Student) => {
    setSelectedStudentIds([student.id]);
    setCurrentStudentIndex(0);
    setActiveStep(6);
  };

  // Assessment Question Answer Selection
  const handleSelectAnswer = (studentId: string, questionId: string, answerValue: any) => {
    setStudentAnswers(prev => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [questionId]: answerValue,
      },
    }));
  };

  // Submit assessment for the single student currently being evaluated in Step 6
  const handleSubmitCurrentStudent = (nextAction: 'BACK_TO_UNASSESSED' | 'ASSESS_NEXT' | 'CLOSE_AND_RETURN_TO_SCHOOLS') => {
    const currentStudentId = selectedStudentIds[currentStudentIndex] || selectedStudentIds[0];
    const student = activeClassStudents.find(s => s.id === currentStudentId);
    if (!student) return;

    const answers = studentAnswers[student.id] || {};

    // 1. Mandatory Rule: Verify student was assessed in BOTH Literacy AND Numeracy
    const isLitAnswered = classQuestions.some(
      q => (q.subject === 'LITERACY' || q.subject === 'ENGLISH') && answers[q.id] !== undefined
    );
    const isNumAnswered = classQuestions.some(
      q => q.subject === 'NUMERACY' && answers[q.id] !== undefined
    );

    if (!isLitAnswered || !isNumAnswered) {
      setDomainValidationWarning(
        `Mandatory NIPUN Lakshya Rule: You must assess BOTH Literacy (Telugu/English) AND Numeracy for ${student.name} before proceeding. Currently: Literacy is ${isLitAnswered ? '✓ Completed' : '❌ Incomplete'}, Numeracy is ${isNumAnswered ? '✓ Completed' : '❌ Incomplete'}. Please answer at least one question in the ${!isLitAnswered ? 'Literacy' : 'Numeracy'} tab.`
      );
      return;
    }
    setDomainValidationWarning(null);

    let totalScore = 0;
    let maxScore = 0;
    let litScore = 0;
    let litMax = 0;
    let engScore = 0;
    let engMax = 0;
    let numScore = 0;
    let numMax = 0;

    // Score questions assessed for this grade
    const answeredQuestions = classQuestions.filter(q => answers[q.id] !== undefined);
    const questionsToScore = answeredQuestions.length > 0 ? answeredQuestions : classQuestions.slice(0, 4);

    const recordAnswers = questionsToScore.map(q => {
      const rawAnswer = answers[q.id];
      const evalRes = evaluateQuestionScore(q, rawAnswer);
      const isCorrect = evalRes.isCorrect;
      const qScore = evalRes.score;
      totalScore += qScore;
      maxScore += q.maxScore;

      if (q.subject === 'LITERACY') {
        litScore += qScore;
        litMax += q.maxScore;
      } else if (q.subject === 'ENGLISH') {
        engScore += qScore;
        engMax += q.maxScore;
      } else {
        numScore += qScore;
        numMax += q.maxScore;
      }

      return {
        questionId: q.id,
        selectedOption: typeof rawAnswer === 'number' ? rawAnswer : (isCorrect ? 0 : -1),
        isCorrect,
        difficulty: q.difficulty,
      };
    });

    const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 75;
    const band = evaluatePerformanceBand(scorePercent, config);
    const isReassess = statusMap[student.id]?.isAssessedThisMonth || false;

    // Create single assessment record
    const newRecord: AssessmentRecord = {
      id: `REC_ASSESS_${Date.now()}_${student.id}`,
      visitId: `VISIT_${Date.now()}`,
      schoolId: selectedSchool.id,
      schoolName: selectedSchool.name,
      studentId: student.id,
      studentName: student.name,
      classNumber: selectedClass,
      section: selectedSection,
      assessorId: currentUser.id,
      assessorName: currentUser.name,
      assessorRole: currentUser.role,
      assessmentDate: new Date().toISOString().split('T')[0],
      monthYear: config.currentMonthYear,
      isReassessment: isReassess,
      reassessmentReason: isReassess ? reassessmentReason : undefined,
      literacyScore: litScore,
      literacyMax: litMax || 50,
      englishScore: engScore,
      englishMax: engMax || 50,
      numeracyScore: numScore,
      numeracyMax: numMax || 50,
      totalScorePercent: scorePercent,
      performanceBand: band,
      answers: recordAnswers,
    };

    // Update monthly status list
    let studentFoundInList = false;
    const updatedStatusList = monthlyStatusList.map(st => {
      if (st.studentId === student.id) {
        studentFoundInList = true;
        return {
          ...st,
          isAssessedThisMonth: true,
          assessmentCount: (st.assessmentCount || 0) + 1,
          lastAssessedDate: new Date().toISOString().split('T')[0],
          lastAssessorName: currentUser.name,
          lastAssessorRole: currentUser.role,
          literacyScore: litScore,
          englishScore: engScore,
          numeracyScore: numScore,
          flnScore: scorePercent,
          performanceBand: band,
        };
      }
      return st;
    });

    if (!studentFoundInList) {
      updatedStatusList.push({
        id: `STATUS_${selectedSchool.id}_${student.id}`,
        studentId: student.id,
        schoolId: selectedSchool.id,
        classNumber: selectedClass,
        section: selectedSection,
        monthYear: config.currentMonthYear,
        isAssessedThisMonth: true,
        assessmentCount: 1,
        lastAssessedDate: new Date().toISOString().split('T')[0],
        lastAssessorName: currentUser.name,
        lastAssessorRole: currentUser.role,
        literacyScore: litScore,
        englishScore: engScore,
        numeracyScore: numScore,
        flnScore: scorePercent,
        performanceBand: band,
      });
    }

    onAddAssessmentRecords([newRecord]);
    onUpdateMonthlyStatus(updatedStatusList);

    if (!isOnline) {
      onQueueOfflineAction('SUBMIT_ASSESSMENTS', { count: 1, classNumber: selectedClass });
    }

    // Add to session assessed student IDs
    const updatedSessionAssessed = Array.from(new Set([...sessionAssessedStudentIds, student.id]));
    setSessionAssessedStudentIds(updatedSessionAssessed);
    setRecentlyAssessedNotification({
      studentName: student.name,
      scorePercent,
      band,
    });

    const newAssessedCount = updatedStatusList.filter(s => s.isAssessedThisMonth).length;
    const newCov = Math.round((newAssessedCount / totalEnrolled) * 1000) / 10;
    setAssessmentSuccessInfo(prev => ({
      studentsCount: (prev?.studentsCount || 0) + 1,
      newCoveragePercent: newCov,
      proficientCount: (prev?.proficientCount || 0) + (band === 'PROFICIENT' || band === 'ADVANCED' ? 1 : 0),
      developingCount: (prev?.developingCount || 0) + (band !== 'PROFICIENT' && band !== 'ADVANCED' ? 1 : 0),
    }));

    if (nextAction === 'CLOSE_AND_RETURN_TO_SCHOOLS') {
      if (updatedSessionAssessed.length < 3) {
        setMinStudentsWarning(
          `Statutory Requirement: Minimum 3 students must be assessed in this class before exiting to the school list. Currently completed: ${updatedSessionAssessed.length}/3. Please assess ${3 - updatedSessionAssessed.length} more student(s) to complete the visit.`
        );
        // Automatically find next unassessed student
        const remainingUnassessed = activeClassStudents.filter(
          s => !updatedSessionAssessed.includes(s.id) && !statusMap[s.id]?.isAssessedThisMonth
        );
        if (remainingUnassessed.length > 0) {
          setSelectedStudentIds([remainingUnassessed[0].id]);
          setCurrentStudentIndex(0);
        } else {
          setActiveStep(5);
        }
        return;
      }
      setMinStudentsWarning(null);
      setSelectedStudentIds([]);
      setStudentAnswers({});
      if (onBackToTourDiary) {
        onBackToTourDiary();
      } else {
        setActiveStep(2); // Step 2: Select School in Field App
      }
    } else if (nextAction === 'ASSESS_NEXT') {
      // Find remaining unassessed students in this class
      const remainingUnassessed = activeClassStudents.filter(
        s => !updatedSessionAssessed.includes(s.id) && !statusMap[s.id]?.isAssessedThisMonth
      );
      if (remainingUnassessed.length > 0) {
        setSelectedStudentIds([remainingUnassessed[0].id]);
        setCurrentStudentIndex(0);
        setActiveStep(6);
      } else {
        setActiveStep(5);
      }
    } else {
      // Go back to Unassessed Students list (Step 5)
      setStudentFilter('UNASSESSED');
      setSelectedStudentIds(prev => prev.filter(id => id !== student.id));
      setActiveStep(5);
    }
  };

  // Submit Completed Assessments (Batch)
  const handleSubmitAssessments = () => {
    const selectedStudents = activeClassStudents.filter(s => selectedStudentIds.includes(s.id));
    if (selectedStudents.length === 0) return;

    const newRecords: AssessmentRecord[] = [];
    const updatedStatusList = [...monthlyStatusList];
    let proficient = 0;
    let developing = 0;
    const submittedIds: string[] = [];

    selectedStudents.forEach(student => {
      const answers = studentAnswers[student.id] || {};
      let totalScore = 0;
      let maxScore = 0;
      let litScore = 0;
      let litMax = 0;
      let engScore = 0;
      let engMax = 0;
      let numScore = 0;
      let numMax = 0;

      const answeredQuestions = classQuestions.filter(q => answers[q.id] !== undefined);
      const questionsToScore = answeredQuestions.length > 0 ? answeredQuestions : classQuestions.slice(0, 4);

      const recordAnswers = questionsToScore.map(q => {
        const rawAnswer = answers[q.id];
        const evalRes = evaluateQuestionScore(q, rawAnswer);
        const isCorrect = evalRes.isCorrect;
        const qScore = evalRes.score;
        totalScore += qScore;
        maxScore += q.maxScore;

        if (q.subject === 'LITERACY') {
          litScore += qScore;
          litMax += q.maxScore;
        } else if (q.subject === 'ENGLISH') {
          engScore += qScore;
          engMax += q.maxScore;
        } else {
          numScore += qScore;
          numMax += q.maxScore;
        }

        return {
          questionId: q.id,
          selectedOption: typeof rawAnswer === 'number' ? rawAnswer : (isCorrect ? 0 : -1),
          isCorrect,
          difficulty: q.difficulty,
        };
      });

      const scorePercent = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 70;
      const band = evaluatePerformanceBand(scorePercent, config);

      if (band === 'PROFICIENT' || band === 'ADVANCED') proficient++;
      else developing++;

      const isReassess = statusMap[student.id]?.isAssessedThisMonth || false;
      submittedIds.push(student.id);

      // Add to Assessment Records
      newRecords.push({
        id: `REC_ASSESS_${Date.now()}_${student.id}`,
        visitId: `VISIT_${Date.now()}`,
        schoolId: selectedSchool.id,
        schoolName: selectedSchool.name,
        studentId: student.id,
        studentName: student.name,
        classNumber: selectedClass,
        section: selectedSection,
        assessorId: currentUser.id,
        assessorName: currentUser.name,
        assessorRole: currentUser.role,
        assessmentDate: new Date().toISOString().split('T')[0],
        monthYear: config.currentMonthYear,
        isReassessment: isReassess,
        reassessmentReason: isReassess ? reassessmentReason : undefined,
        literacyScore: litScore,
        literacyMax: litMax || 50,
        englishScore: engScore,
        englishMax: engMax || 50,
        numeracyScore: numScore,
        numeracyMax: numMax || 50,
        totalScorePercent: scorePercent,
        performanceBand: band,
        answers: recordAnswers,
      });

      // Update Monthly Status
      const existingIdx = updatedStatusList.findIndex(st => st.studentId === student.id);
      if (existingIdx >= 0) {
        updatedStatusList[existingIdx] = {
          ...updatedStatusList[existingIdx],
          isAssessedThisMonth: true,
          assessmentCount: (updatedStatusList[existingIdx].assessmentCount || 0) + 1,
          lastAssessedDate: new Date().toISOString().split('T')[0],
          lastAssessorName: currentUser.name,
          lastAssessorRole: currentUser.role,
          literacyScore: litScore,
          englishScore: engScore,
          numeracyScore: numScore,
          flnScore: scorePercent,
          performanceBand: band,
        };
      }
    });

    onAddAssessmentRecords(newRecords);
    onUpdateMonthlyStatus(updatedStatusList);

    if (!isOnline) {
      onQueueOfflineAction('SUBMIT_ASSESSMENTS', { count: selectedStudents.length, classNumber: selectedClass });
    }

    setSessionAssessedStudentIds(prev => Array.from(new Set([...prev, ...submittedIds])));
    setRecentlyAssessedNotification({
      studentName: `${selectedStudents.length} Students`,
      scorePercent: Math.round(newRecords.reduce((acc, r) => acc + r.totalScorePercent, 0) / newRecords.length),
      band: proficient >= developing ? 'PROFICIENT' : 'DEVELOPING',
    });

    // Compute new coverage
    const newAssessedCount = updatedStatusList.filter(s => s.isAssessedThisMonth).length;
    const newCov = Math.round((newAssessedCount / totalEnrolled) * 1000) / 10;

    setAssessmentSuccessInfo({
      studentsCount: selectedStudents.length,
      newCoveragePercent: newCov,
      proficientCount: proficient,
      developingCount: developing,
    });

    // Return back to unassessed student list in Step 5
    setSelectedStudentIds([]);
    setStudentFilter('UNASSESSED');
    setActiveStep(5);
  };

  // Finalize Visit and Add Action Item
  const handleCompleteVisit = () => {
    if (actionTitle.trim()) {
      const newAction: ActionItem = {
        id: `ACT_${Date.now()}`,
        schoolId: selectedSchool.id,
        schoolName: selectedSchool.name,
        mandalName: selectedSchool.mandalName,
        classNumber: selectedClass,
        issueTitle: actionTitle,
        description: visitObservations,
        competencyArea: actionCompetency,
        assignedTo: `${selectedSchool.headmasterName} (HM) / Class ${selectedClass} Teacher`,
        targetDate: '2026-07-30',
        status: 'OPEN',
        createdDate: new Date().toISOString().split('T')[0],
        createdBy: `${currentUser.name} (${currentUser.role})`,
      };
      onAddActionItem(newAction);
    }
    setActiveStep(1);
    setSelectedStudentIds([]);
    setStudentAnswers({});
    if (onBackToTourDiary) {
      onBackToTourDiary();
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Return to Tour Diary Contextual Banner */}
      {onBackToTourDiary && (
        <div className="bg-emerald-950 text-white p-3.5 rounded-xl border border-emerald-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onBackToTourDiary}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold border border-emerald-600/80 flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>← Return to Tour Diary (School Roster)</span>
            </button>
            <div className="text-xs">
              <span className="text-emerald-300">Active Inspection: </span>
              <strong className="text-white">{selectedSchool.name}</strong>
            </div>
          </div>
          <div className="text-xs text-emerald-200">
            Visit Priority: <strong className="text-amber-300">Enrolment Priority ({selectedSchool.totalStudents} Students in Class 1–5)</strong>
          </div>
        </div>
      )}

      {/* Top Device & Step Controller */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
              Field Officer Simulator
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Simulating Officer: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.designation})
            </span>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mt-1">
            AP FLN Field Inspection & Student Assessment App
          </h1>
        </div>

        {/* Device Mode Switcher */}
        <div className="flex items-center gap-2">
          <div className="flex items-center p-1 bg-slate-100 rounded-lg text-xs font-medium">
            <button
              onClick={() => setDeviceMode('MOBILE')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                deviceMode === 'MOBILE' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Mobile Phone View</span>
            </button>
            <button
              onClick={() => setDeviceMode('TABLET')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                deviceMode === 'TABLET' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Tablet / Expanded View</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Container: Mobile Frame vs Wide Frame */}
      <div className="flex justify-center">
        <div className={deviceMode === 'MOBILE' ? 'w-full max-w-[420px]' : 'w-full'}>
          {/* Simulated Mobile Outer Frame */}
          <div className="bg-slate-900 p-2 sm:p-3 rounded-3xl shadow-xl border-4 border-slate-800">
            {/* Mobile Screen Surface */}
            <div className="bg-slate-50 rounded-2xl overflow-hidden min-h-[640px] flex flex-col border border-slate-200">
              
              {/* Phone Status Bar */}
              <div className="bg-emerald-900 text-white px-4 py-2 flex items-center justify-between text-[11px] font-semibold">
                <div className="flex items-center gap-1">
                  <span>09:45 AM</span>
                  <span className="text-emerald-300">·</span>
                  <span className="text-[10px] text-emerald-200">4G AP-GovNet</span>
                </div>
                <div className="flex items-center gap-2 text-[10px]">
                  <span>GPS: Active</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </div>
              </div>

              {/* Mobile App Header */}
              <div className="bg-emerald-800 text-white px-4 py-3 shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeStep > 1 ? (
                      <button
                        onClick={() => setActiveStep(prev => Math.max(1, prev - 1))}
                        className="p-1 hover:bg-emerald-700 rounded transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4 text-white" />
                      </button>
                    ) : (
                      <APGovtLogo size="sm" />
                    )}
                    <div>
                      <div className="text-xs font-bold tracking-tight">NIPUN Andhra Field App</div>
                      <div className="text-[10px] text-emerald-200">
                        {activeStep === 1 && 'Officer Cockpit'}
                        {activeStep === 2 && 'Step 1: Priority Tour Diary'}
                        {activeStep === 3 && 'Step 2: School Check-In'}
                        {activeStep === 4 && 'Step 3: Classroom Selection'}
                        {activeStep === 5 && 'Step 4: Student Selection & Coverage'}
                        {activeStep === 6 && 'Step 5: FLN Diagnostic Test'}
                        {activeStep === 7 && 'Step 6: Submission & Notifications'}
                        {activeStep === 8 && 'Step 7: Visit Check-out & Actions'}
                      </div>
                    </div>
                  </div>
                  <div className="text-[10px] font-bold bg-emerald-700/80 px-2 py-0.5 rounded text-emerald-100 border border-emerald-600">
                    Step {activeStep} / 8
                  </div>
                </div>
              </div>

              {/* Mobile Viewport Body */}
              <div className="p-4 flex-1 overflow-y-auto space-y-4">

                {/* Active School Visit Sub-Bar (Classroom Observation Checklist vs Student Assessment) */}
                {activeStep >= 3 && activeStep <= 7 && (
                  <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveVisitMode('CLASSROOM_OBSERVATION')}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeVisitMode === 'CLASSROOM_OBSERVATION'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <ClipboardCheck className="w-3.5 h-3.5" />
                      <span>Classroom Observation Checklist</span>
                      {classroomObservationData && (
                        <span className="w-2 h-2 rounded-full bg-emerald-300"></span>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveVisitMode('STUDENT_ASSESSMENT');
                        if (activeStep < 4) setActiveStep(4);
                      }}
                      className={`flex-1 py-1.5 px-2.5 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                        activeVisitMode === 'STUDENT_ASSESSMENT'
                          ? 'bg-emerald-700 text-white shadow-xs'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>Student Assessment</span>
                      <span className="text-[10px] bg-black/15 px-1.5 py-0.2 rounded-full">Max 2 Qs</span>
                    </button>
                  </div>
                )}

                {/* When in Classroom Observation mode at school */}
                {activeStep >= 3 && activeStep <= 7 && activeVisitMode === 'CLASSROOM_OBSERVATION' && (
                  <div className="space-y-3">
                    <ClassroomObservationChecklist
                      school={selectedSchool}
                      initialClass={selectedClass}
                      initialSection={selectedSection}
                      savedData={classroomObservationData}
                      onSaveObservation={(data) => {
                        setClassroomObservationData(data);
                      }}
                      onContinueToAssessment={() => {
                        setActiveVisitMode('STUDENT_ASSESSMENT');
                        if (activeStep < 4) setActiveStep(4);
                      }}
                    />
                  </div>
                )}
                
                {/* ---------------- STEP 1: OFFICER COCKPIT ---------------- */}
                {activeStep === 1 && (
                  <div className="space-y-4">
                    {/* Welcome Card */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                      <div className="text-xs font-bold text-slate-900">{currentUser.name}</div>
                      <div className="text-[11px] text-slate-500">{currentUser.designation}</div>
                      <div className="mt-2 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded font-medium flex items-center justify-between">
                        <span>Month: <strong>{config.currentMonthYear}</strong></span>
                        <span>{officerJurisdictionLabel}</span>
                      </div>
                    </div>

                    {/* Monthly Target Progress Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">Monthly Visit Target</span>
                        <span className="text-[11px] font-bold text-emerald-700">{officerVisitPercent}% Complete</span>
                      </div>
                      <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
                        {officerCompletedVisits} / {officerTargetVisits} <span className="text-xs font-normal text-slate-500">Days</span>
                      </div>
                      <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, officerVisitPercent)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                        <span>Visit Gap: <strong className="text-amber-700">{officerVisitGap} days</strong></span>
                        <span>Target: {officerTargetVisits} days/mo</span>
                      </div>
                    </div>

                    {/* Student Assessment Achievement Card */}
                    <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-700">Unique Students Assessed</span>
                        <span className="text-[11px] font-bold text-blue-700 tabular-nums">{officerAssessedStudents} / {officerStudentTarget} Students</span>
                      </div>
                      <div className="mt-1 text-xs text-slate-500">
                        Monthly quota: {officerStudentTarget} unique students (min 5 per visit)
                      </div>
                      <div className="mt-2 w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${Math.min(100, officerStudentPercent)}%` }}
                        ></div>
                      </div>
                      <div className="mt-2 text-[11px] text-slate-500 flex justify-between">
                        <span>Coverage: <strong className="text-blue-700 tabular-nums">{officerStudentPercent}%</strong></span>
                        <span>Pending: <strong className="text-slate-700 tabular-nums">{officerStudentGap} students</strong></span>
                      </div>
                    </div>

                    {/* Primary Action Button */}
                    <button
                      onClick={() => setActiveStep(2)}
                      className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <MapPin className="w-4 h-4 text-emerald-200" />
                      <span>Start School Visit (View Tour Diary)</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ---------------- STEP 2: TOUR DIARY / PRIORITY SCHOOLS ---------------- */}
                {activeStep === 2 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
                      <span>Schools in {currentUser.mandalId ? 'Mandal' : currentUser.districtId !== 'AP_ALL' ? 'District' : 'State'}</span>
                      <span className="text-[11px] text-slate-500 font-normal">Ranked by Priority Score (SPS)</span>
                    </div>

                    <div className="space-y-2.5">
                      {officerRecommendedSchools.slice(0, 4).map((sch) => {
                        const isSelected = selectedSchool.id === sch.id;
                        return (
                          <div
                            key={sch.id}
                            onClick={() => setSelectedSchool(sch)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer ${
                              isSelected 
                                ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20' 
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="text-xs font-bold text-slate-900">{sch.name}</div>
                                <div className="text-[10px] text-slate-500 mt-0.5">
                                  UDISE: {sch.udiseCode} • {sch.mandalName} Mandal • {sch.clusterName}
                                </div>
                              </div>
                              <span className={`text-[10px] px-2 py-0.5 rounded font-bold shrink-0 ${
                                sch.totalStudents >= 140 
                                  ? 'bg-rose-100 text-rose-800' 
                                  : sch.totalStudents >= 100 
                                  ? 'bg-indigo-100 text-indigo-800' 
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                Class 1–5: {sch.totalStudents} Students
                              </span>
                            </div>

                            <div className="mt-2 text-[11px] bg-slate-50 p-2 rounded text-slate-700 border border-slate-200/60">
                              <strong className="text-slate-800">Priority Basis: </strong>
                              {sch.priorityReason || `Class 1–5 enrolment priority (${sch.totalStudents} students)`}
                            </div>

                            <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                              <span>Last FLN: <strong className="text-slate-800">{sch.lastFLNScore}%</strong></span>
                              <span>Coverage: <strong className="text-blue-700">{sch.monthlyCoveragePercent}%</strong></span>
                              <span>Visits: {sch.visitsThisMonth}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setActiveStep(3)}
                      className="w-full mt-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Proceed to Check-in at {selectedSchool.name.split(',')[0]}</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ---------------- STEP 3: SCHOOL CHECK-IN ---------------- */}
                {activeStep === 3 && (
                  <div className="space-y-4">
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200">
                      <div className="text-xs font-bold text-slate-900">{selectedSchool.name}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        UDISE: {selectedSchool.udiseCode} • {selectedSchool.mandalName} Mandal
                      </div>
                      <div className="text-[11px] text-slate-500">
                        HM: {selectedSchool.headmasterName}
                      </div>
                    </div>

                    {/* Geofence Check */}
                    <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center gap-3">
                      <div className="p-2 bg-emerald-600 text-white rounded-lg">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <div className="text-xs">
                        <div className="font-bold text-emerald-900">GPS Geofence Verified</div>
                        <div className="text-[11px] text-emerald-700">
                          Lat: {selectedSchool.latitude}, Lng: {selectedSchool.longitude} (Within 45m)
                        </div>
                      </div>
                    </div>

                    {/* Visit Type Selector */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <label className="text-xs font-bold text-slate-700 block">
                        Select Visit Type
                      </label>
                      <select
                        value={visitType}
                        onChange={(e) => setVisitType(e.target.value as VisitType)}
                        className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      >
                        <option value="ROUTINE">Routine Monitoring Visit</option>
                        <option value="FOLLOW_UP">Follow-up Remediation Visit</option>
                        <option value="SPECIAL">Special Directed Visit</option>
                        <option value="SURPRISE">Surprise Inspection</option>
                        <option value="REVISIT">Revisit (Second visit this month)</option>
                      </select>
                    </div>

                    {/* Pending Action Items from Previous Visit */}
                    <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Pending Action Items for this School ({selectedSchool.pendingActionsCount})</span>
                      </div>
                      <div className="text-[11px] text-amber-800">
                        • Class 3 Regrouping Numeracy Remediation (Due July 25)
                        <br />
                        • Telugu Reading Corner book supply (Due July 28)
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => {
                          setActiveVisitMode('CLASSROOM_OBSERVATION');
                        }}
                        className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <ClipboardCheck className="w-4 h-4 text-emerald-200" />
                        <span>Confirm Check-in & Start Classroom Observation</span>
                      </button>

                      <button
                        onClick={() => {
                          setActiveVisitMode('STUDENT_ASSESSMENT');
                          setActiveStep(4);
                        }}
                        className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Users className="w-3.5 h-3.5 text-slate-600" />
                        <span>Proceed to Student 1-on-1 Assessment</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 4: CLASSROOM & MEDIUM SELECTION ---------------- */}
                {activeStep === 4 && activeVisitMode === 'STUDENT_ASSESSMENT' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800">
                      Select Classroom & Medium for FLN Assessment
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Showing official enrollment and July 2026 unique student assessment coverage
                    </p>

                    {/* Instruction Medium Selector */}
                    <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-1.5">
                      <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
                        <span>Instruction Medium</span>
                        <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold">Repository Filter</span>
                      </label>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setSelectedMedium('TELUGU')}
                          className={`p-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            selectedMedium === 'TELUGU'
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-500'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>తెలుగు మీడియం (Telugu)</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setSelectedMedium('ENGLISH')}
                          className={`p-2 rounded-lg border font-semibold flex items-center justify-center gap-1.5 transition-all ${
                            selectedMedium === 'ENGLISH'
                              ? 'bg-indigo-50 border-indigo-500 text-indigo-950 font-bold ring-1 ring-indigo-500'
                              : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          <span>English Medium</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {[1, 2, 3, 4, 5].map((cls) => {
                        const isSelected = selectedClass === cls;
                        const targetItem = FLN_TARGETS_2026_27.find(t => t.grade === cls);
                        // Mock coverage per class
                        const cov = cls === 3 ? coveragePercent : cls === 1 ? 40 : cls === 2 ? 25 : 30;
                        return (
                          <div
                            key={cls}
                            onClick={() => setSelectedClass(cls)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer flex flex-col gap-2 ${
                              isSelected
                                ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700'
                                }`}>
                                  C{cls}
                                </div>
                                <div>
                                  <div className="text-xs font-bold text-slate-900">
                                    Class {cls} — Section A
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Total Enrolled: 30 Students • {targetItem?.stage}
                                  </div>
                                </div>
                              </div>

                              <div className="text-right">
                                <div className="text-xs font-bold text-blue-700 tabular-nums">
                                  {cov}% Coverage
                                </div>
                                <div className="text-[10px] text-slate-400">
                                  {cls === 3 ? `${assessedCount} / 30 assessed` : 'In progress'}
                                </div>
                              </div>
                            </div>

                            {/* 2026-27 Target Pill */}
                            {targetItem && (
                              <div className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-[10px] text-slate-700 flex items-center gap-2">
                                <span className="font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.2 rounded shrink-0">
                                  ★ 2026-27 Target
                                </span>
                                <span className="truncate text-slate-600">
                                  {targetItem.subjects.telugu.keyCompetencyBrief} • {targetItem.subjects.math.keyCompetencyBrief}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setActiveStep(5)}
                      className="w-full mt-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Open Class {selectedClass}-A Student Selection</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* ---------------- STEP 5: MONTHLY STUDENT SELECTION ENGINE ---------------- */}
                {activeStep === 5 && (
                  <div className="space-y-3">
                    {/* Recent Assessment Success Notification Banner */}
                    {recentlyAssessedNotification && (
                      <div className="bg-emerald-50 border-2 border-emerald-500/40 p-3 rounded-xl flex items-center justify-between shadow-xs animate-in fade-in">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                            <Check className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-emerald-950">
                              Assessment Recorded: {recentlyAssessedNotification.studentName}
                            </div>
                            <div className="text-[11px] text-emerald-800">
                              Score: <strong className="text-emerald-900">{recentlyAssessedNotification.scorePercent}%</strong> • Band: <strong className="text-emerald-900">{recentlyAssessedNotification.band}</strong> • Evaluated this visit: <strong className="text-emerald-900">{sessionAssessedStudentIds.length} students</strong>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setRecentlyAssessedNotification(null)}
                          className="text-xs text-emerald-700 hover:text-emerald-900 font-bold px-2 py-1 cursor-pointer"
                          title="Dismiss notification"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {minStudentsWarning && (
                      <div className="bg-amber-50 border-2 border-amber-500 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-950 shadow-xs animate-in fade-in">
                        <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <div className="font-bold text-amber-950">Statutory AP FLN Quota Notice:</div>
                          <div className="mt-0.5 leading-relaxed">{minStudentsWarning}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setMinStudentsWarning(null)}
                          className="text-amber-700 hover:text-amber-900 font-bold px-1"
                        >
                          ✕
                        </button>
                      </div>
                    )}

                    {/* Critical Requirement: Monthly Coverage HUD */}
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xs space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-emerald-300">
                          Class {selectedClass}-A Monthly Coverage
                        </span>
                        <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded text-white">
                          July 2026 Cycle
                        </span>
                      </div>

                      <div className="grid grid-cols-4 gap-2 text-center text-xs pt-1">
                        <div className="bg-white/10 p-1.5 rounded">
                          <div className="text-[10px] text-slate-300">Enrolled</div>
                          <div className="font-bold text-sm text-white tabular-nums">{totalEnrolled}</div>
                        </div>
                        <div className="bg-emerald-950/60 border border-emerald-500/30 p-1.5 rounded">
                          <div className="text-[10px] text-emerald-300">Assessed</div>
                          <div className="font-bold text-sm text-emerald-300 tabular-nums">{assessedCount}</div>
                        </div>
                        <div className="bg-blue-950/60 border border-blue-500/30 p-1.5 rounded">
                          <div className="text-[10px] text-blue-300">Remaining</div>
                          <div className="font-bold text-sm text-blue-300 tabular-nums">{unassessedCount}</div>
                        </div>
                        <div className="bg-amber-950/60 border border-amber-500/30 p-1.5 rounded">
                          <div className="text-[10px] text-amber-300">Coverage</div>
                          <div className="font-bold text-sm text-amber-300 tabular-nums">{coveragePercent}%</div>
                        </div>
                      </div>

                      <div className="text-[10px] text-slate-300 flex justify-between items-center pt-1 border-t border-slate-800">
                        <span>Evaluated during this visit: <strong className="text-emerald-400">{sessionAssessedStudentIds.length}</strong></span>
                        <span>Selected queued: <strong className="text-white">{selectedStudentIds.length}</strong></span>
                        <span>Min Target: <strong className="text-amber-300">{config.minimumStudentsPerClass}</strong></span>
                      </div>
                    </div>

                    {/* Smart Random Select Button */}
                    <button
                      onClick={handleRandomSelect}
                      className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Shuffle className="w-3.5 h-3.5 text-blue-200" />
                      <span>Random Select 5 Unassessed Students</span>
                    </button>

                    {/* Filter Segmented Control */}
                    <div className="flex p-1 bg-slate-200 rounded-lg text-xs font-semibold">
                      <button
                        onClick={() => setStudentFilter('UNASSESSED')}
                        className={`flex-1 py-1 rounded text-center transition-all ${
                          studentFilter === 'UNASSESSED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Not Assessed ({unassessedCount})
                      </button>
                      <button
                        onClick={() => setStudentFilter('ASSESSED')}
                        className={`flex-1 py-1 rounded text-center transition-all ${
                          studentFilter === 'ASSESSED' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Assessed ({assessedCount})
                      </button>
                      <button
                        onClick={() => setStudentFilter('ALL')}
                        className={`flex-1 py-1 rounded text-center transition-all ${
                          studentFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        All ({totalEnrolled})
                      </button>
                    </div>

                    {/* Student List */}
                    <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                      {activeClassStudents
                        .filter(s => {
                          const isAssessed = statusMap[s.id]?.isAssessedThisMonth;
                          if (studentFilter === 'UNASSESSED') return !isAssessed;
                          if (studentFilter === 'ASSESSED') return isAssessed;
                          return true;
                        })
                        .map((student) => {
                          const isSelected = selectedStudentIds.includes(student.id);
                          const isAbsent = absentStudentIds.includes(student.id);
                          const isAssessed = statusMap[student.id]?.isAssessedThisMonth;
                          const studentStatus = statusMap[student.id];

                          return (
                            <div
                              key={student.id}
                              onClick={() => handleToggleStudent(student)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                                isSelected
                                  ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20'
                                  : isAbsent
                                  ? 'bg-rose-50/50 border-rose-200 opacity-60'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              <div className="flex items-center gap-2.5">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                  isSelected ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {student.rollNumber}
                                </div>

                                <div>
                                  <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                    <span>{student.name}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400">
                                    PEN: {student.pen} • Att: {student.attendancePercent}%
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-1.5">
                                {/* Direct 1-Click Assess Button for Unassessed Students */}
                                {!isAssessed && !isAbsent && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleStartAssessingStudent(student);
                                    }}
                                    className="px-2.5 py-1 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-[11px] font-bold shadow-xs flex items-center gap-1 transition-colors cursor-pointer"
                                  >
                                    <span>Assess Student</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>
                                )}

                                {/* Monthly Status Pill */}
                                {isAssessed ? (
                                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                                    <Check className="w-3 h-3" />
                                    <span>Assessed ({studentStatus?.flnScore ?? 75}%)</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                                    Eligible
                                  </span>
                                )}

                                {/* Mark Absent Toggle Button */}
                                <button
                                  type="button"
                                  onClick={(e) => handleMarkAbsent(student.id, e)}
                                  className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-colors ${
                                    isAbsent 
                                      ? 'bg-rose-600 text-white' 
                                      : 'bg-slate-100 hover:bg-rose-100 text-slate-600 hover:text-rose-700'
                                  }`}
                                  title="Mark student absent"
                                >
                                  {isAbsent ? 'Absent' : 'Mark Absent'}
                                </button>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {/* Reassessment Reason Modal (if attempting to select already assessed student) */}
                    {reassessmentWarningStudent && (
                      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
                        <div className="bg-white rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-xl">
                          <div className="flex items-center gap-2 text-amber-700 font-bold text-xs uppercase tracking-wide">
                            <AlertTriangle className="w-4 h-4 text-amber-600" />
                            <span>Already Assessed This Month</span>
                          </div>

                          <div className="text-xs text-slate-700">
                            <strong>{reassessmentWarningStudent.name}</strong> was already assessed on{' '}
                            <strong>{statusMap[reassessmentWarningStudent.id]?.lastAssessedDate || '2026-07-05'}</strong>{' '}
                            by {statusMap[reassessmentWarningStudent.id]?.lastAssessorName || 'Officer'}.
                          </div>

                          <div className="space-y-1 text-xs">
                            <label className="font-semibold text-slate-800">
                              Mandatory Reassessment Reason Code:
                            </label>
                            <select
                              value={reassessmentReason}
                              onChange={(e) => setReassessmentReason(e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                            >
                              <option value="Periodic Remedial Verification">Periodic Remedial Verification</option>
                              <option value="Supervisor Directed Quality Audit">Supervisor Directed Quality Audit</option>
                              <option value="Post-TLM Learning Check">Post-TLM Learning Check</option>
                            </select>
                          </div>

                          <div className="flex gap-2 justify-end pt-2">
                            <button
                              onClick={() => setReassessmentWarningStudent(null)}
                              className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={confirmReassessment}
                              className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                            >
                              Authorize & Add
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Bottom Action Controls */}
                    <div className="pt-2 border-t border-slate-200 space-y-2">
                      {selectedStudentIds.length > 0 && (
                        <button
                          onClick={handleProceedToAssessment}
                          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <span>Proceed to Assess ({selectedStudentIds.length} Selected Students)</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (sessionAssessedStudentIds.length < 3) {
                            setMinStudentsWarning(`Statutory AP FLN Requirement: Minimum 3 students must be assessed in Class ${selectedClass}-A before completing the visit. (Currently: ${sessionAssessedStudentIds.length}/3 assessed). Please assess at least 3 students.`);
                            return;
                          }
                          setMinStudentsWarning(null);
                          setActiveStep(7);
                        }}
                        className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                          sessionAssessedStudentIds.length >= 3
                            ? 'bg-slate-900 hover:bg-slate-800 text-white'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        {sessionAssessedStudentIds.length >= 3 ? (
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <Lock className="w-4 h-4 text-slate-500" />
                        )}
                        <span>
                          {sessionAssessedStudentIds.length >= 3
                            ? `Done Assessing • Proceed to Visit Check-Out & Sign-Off (${sessionAssessedStudentIds.length} Evaluated)`
                            : `Visit Check-Out Locked • Min 3 Students Required (${sessionAssessedStudentIds.length}/3 Evaluated)`}
                        </span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 6: FLN ASSESSMENT FORM ---------------- */}
                {activeStep === 6 && (
                  <div className="space-y-3">
                    {selectedStudentIds.length > 0 && (
                      <>
                        {/* Student Carousel Header */}
                        {(() => {
                          const currentStudent = activeClassStudents.find(
                            s => s.id === selectedStudentIds[currentStudentIndex]
                          ) || activeClassStudents[0];

                          return (
                            <div className="space-y-3">
                              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                                      Assessing Student {currentStudentIndex + 1} of {selectedStudentIds.length}
                                    </span>
                                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                                      Class {selectedClass}-A
                                    </span>
                                  </div>
                                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                                    {currentStudent.name}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    Roll No: {currentStudent.rollNumber} • PEN: {currentStudent.pen} • Att: {currentStudent.attendancePercent}%
                                  </div>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  {selectedStudentIds.length > 1 && (
                                    <div className="flex gap-1">
                                      <button
                                        onClick={() => setCurrentStudentIndex(prev => Math.max(0, prev - 1))}
                                        disabled={currentStudentIndex === 0}
                                        className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 cursor-pointer"
                                        title="Previous student"
                                      >
                                        <ArrowLeft className="w-3.5 h-3.5 text-slate-700" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          const curAnswers = studentAnswers[currentStudent.id] || {};
                                          const isLitDone = classQuestions.some(
                                            q => (q.subject === 'LITERACY' || q.subject === 'ENGLISH') && curAnswers[q.id] !== undefined
                                          );
                                          const isNumDone = classQuestions.some(
                                            q => q.subject === 'NUMERACY' && curAnswers[q.id] !== undefined
                                          );
                                          if (!isLitDone || !isNumDone) {
                                            setDomainValidationWarning(
                                              `Mandatory NIPUN Rule: You must assess BOTH Literacy and Numeracy for ${currentStudent.name} before moving to the next student. (Literacy: ${isLitDone ? '✓ Completed' : '❌ Pending'}, Numeracy: ${isNumDone ? '✓ Completed' : '❌ Pending'}).`
                                            );
                                            return;
                                          }
                                          setDomainValidationWarning(null);
                                          setCurrentStudentIndex(prev => Math.min(selectedStudentIds.length - 1, prev + 1));
                                        }}
                                        disabled={currentStudentIndex === selectedStudentIds.length - 1}
                                        className="p-1 rounded bg-white border border-slate-300 disabled:opacity-40 cursor-pointer"
                                        title="Next student (Requires both Literacy & Numeracy)"
                                      >
                                        <ArrowRight className="w-3.5 h-3.5 text-slate-700" />
                                      </button>
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setStudentFilter('UNASSESSED');
                                      setActiveStep(5);
                                    }}
                                    className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                                  >
                                    Back to Class Roster
                                  </button>
                                </div>
                              </div>

                              {/* ---------------- STATUTORY CLASS VISIT QUOTA HUD ---------------- */}
                              <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xs space-y-1.5">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <span className="text-amber-400">Class {selectedClass}-A Statutory Inspection Quota:</span>
                                    <span className={sessionAssessedStudentIds.length >= 3 ? "text-emerald-400 font-extrabold" : "text-amber-300 font-extrabold"}>
                                      {sessionAssessedStudentIds.length} of 3 Min Students Assessed
                                    </span>
                                  </div>
                                  <div>
                                    {sessionAssessedStudentIds.length >= 3 ? (
                                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold border border-emerald-500/30 flex items-center gap-1">
                                        <Check className="w-3 h-3 text-emerald-400" />
                                        <span>Exit to School List Unlocked</span>
                                      </span>
                                    ) : (
                                      <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold border border-amber-500/30 flex items-center gap-1">
                                        <Lock className="w-3 h-3 text-amber-400" />
                                        <span>{3 - sessionAssessedStudentIds.length} more student(s) needed</span>
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-[11px] text-slate-300">
                                  NIPUN Rule: Each student must be evaluated in <strong>BOTH Literacy & Numeracy</strong>. Class visit can be closed only after evaluating at least <strong>3 students</strong>.
                                </div>
                              </div>

                              {/* ---------------- 2026-27 FLN TARGET MILESTONE BANNER ---------------- */}
                              <div className="bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-900 text-white p-3 rounded-xl shadow-xs space-y-1.5 border border-indigo-800/60">
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <span className="text-amber-400">🎯 Class {selectedClass} 2026-27 FLN Target:</span>
                                    <span className="text-emerald-300 font-extrabold">{activeClassFLNTarget.stage}</span>
                                  </div>
                                  <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-slate-200">
                                    AP 2026-27 Lakshya
                                  </span>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-[11px] pt-1 border-t border-white/10">
                                  <div className="text-emerald-200">
                                    <span className="font-bold text-emerald-400">📖 Telugu:</span> {activeClassFLNTarget.subjects.telugu.keyCompetencyBrief}
                                  </div>
                                  <div className="text-indigo-200">
                                    <span className="font-bold text-indigo-300">🔤 English:</span> {activeClassFLNTarget.subjects.english.keyCompetencyBrief}
                                  </div>
                                  <div className="text-sky-200">
                                    <span className="font-bold text-sky-300">🔢 Math:</span> {activeClassFLNTarget.subjects.math.keyCompetencyBrief}
                                  </div>
                                </div>
                              </div>

                              {/* ---------------- WARNING BANNERS ---------------- */}
                              {domainValidationWarning && (
                                <div className="bg-rose-50 border-2 border-rose-500 p-3 rounded-xl flex items-start gap-2.5 text-xs text-rose-900 shadow-xs animate-in fade-in">
                                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="font-bold text-rose-950">Domain Requirement Incomplete:</div>
                                    <div className="mt-0.5 leading-relaxed">{domainValidationWarning}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setDomainValidationWarning(null)}
                                    className="text-rose-700 hover:text-rose-900 font-bold px-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}

                              {minStudentsWarning && (
                                <div className="bg-amber-50 border-2 border-amber-500 p-3 rounded-xl flex items-start gap-2.5 text-xs text-amber-950 shadow-xs animate-in fade-in">
                                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                                  <div className="flex-1">
                                    <div className="font-bold text-amber-950">Class Inspection Minimum Not Met:</div>
                                    <div className="mt-0.5 leading-relaxed">{minStudentsWarning}</div>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setMinStudentsWarning(null)}
                                    className="text-amber-700 hover:text-amber-900 font-bold px-1"
                                  >
                                    ✕
                                  </button>
                                </div>
                              )}

                              {/* ---------------- DOMAIN COMPLETION STATUS HUD FOR CURRENT STUDENT ---------------- */}
                              {(() => {
                                const curAnswers = studentAnswers[currentStudent.id] || {};
                                const isLitDone = classQuestions.some(
                                  q => (q.subject === 'LITERACY' || q.subject === 'ENGLISH') && curAnswers[q.id] !== undefined
                                );
                                const isNumDone = classQuestions.some(
                                  q => q.subject === 'NUMERACY' && curAnswers[q.id] !== undefined
                                );
                                const bothDone = isLitDone && isNumDone;

                                return (
                                  <div className={`p-2.5 rounded-xl border text-xs flex flex-wrap items-center justify-between gap-2 ${
                                    bothDone ? 'bg-emerald-50 border-emerald-300' : 'bg-slate-50 border-slate-300'
                                  }`}>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[11px] font-bold text-slate-700">
                                        Current Child Status:
                                      </span>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                        isLitDone ? 'bg-emerald-200 text-emerald-900' : 'bg-rose-100 text-rose-800'
                                      }`}>
                                        {isLitDone ? <Check className="w-3 h-3 text-emerald-700" /> : '⚪'}
                                        Literacy: {isLitDone ? 'Done' : 'Pending'}
                                      </span>
                                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 ${
                                        isNumDone ? 'bg-blue-200 text-blue-900' : 'bg-rose-100 text-rose-800'
                                      }`}>
                                        {isNumDone ? <Check className="w-3 h-3 text-blue-700" /> : '⚪'}
                                        Numeracy: {isNumDone ? 'Done' : 'Pending'}
                                      </span>
                                    </div>
                                    <span className="text-[11px] font-bold">
                                      {bothDone ? (
                                        <span className="text-emerald-700">✅ Both Domains Assessed — Ready to Submit!</span>
                                      ) : (
                                        <span className="text-amber-800">⚠️ Must assess both Literacy & Numeracy</span>
                                      )}
                                    </span>
                                  </div>
                                );
                              })()}

                              {/* ---------------- TWO TABS ONLY: NUMERACY & LITERACY ---------------- */}
                              <div className="grid grid-cols-2 bg-slate-200/80 p-1 rounded-xl gap-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDomainTab('LITERACY');
                                    setDomainValidationWarning(null);
                                  }}
                                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    activeDomainTab === 'LITERACY'
                                      ? 'bg-emerald-700 text-white shadow-xs'
                                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                                  }`}
                                >
                                  <BookOpen className="w-4 h-4" />
                                  <span>1. Literacy</span>
                                  {classQuestions.some(q => (q.subject === 'LITERACY' || q.subject === 'ENGLISH') && studentAnswers[currentStudent.id]?.[q.id] !== undefined) ? (
                                    <span className="w-4 h-4 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center text-[10px] font-black">✓</span>
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => {
                                    setActiveDomainTab('NUMERACY');
                                    setDomainValidationWarning(null);
                                  }}
                                  className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                    activeDomainTab === 'NUMERACY'
                                      ? 'bg-blue-700 text-white shadow-xs'
                                      : 'text-slate-700 hover:text-slate-900 hover:bg-white/50'
                                  }`}
                                >
                                  <Calculator className="w-4 h-4" />
                                  <span>2. Numeracy</span>
                                  {classQuestions.some(q => q.subject === 'NUMERACY' && studentAnswers[currentStudent.id]?.[q.id] !== undefined) ? (
                                    <span className="w-4 h-4 rounded-full bg-blue-300 text-slate-950 flex items-center justify-center text-[10px] font-black">✓</span>
                                  ) : (
                                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
                                  )}
                                </button>
                              </div>

                              {/* ---------------- UNDER LITERACY: TELUGU & ENGLISH LANGUAGES ---------------- */}
                              {activeDomainTab === 'LITERACY' && (
                                <div className="flex items-center gap-2 bg-emerald-50 p-1.5 rounded-xl border border-emerald-200">
                                  <span className="text-[11px] font-bold text-emerald-950 px-1">Language:</span>
                                  <button
                                    type="button"
                                    onClick={() => setLiteracyLanguage('TELUGU')}
                                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                      literacyLanguage === 'TELUGU'
                                        ? 'bg-emerald-700 text-white shadow-xs'
                                        : 'text-emerald-900 hover:bg-emerald-100/70'
                                    }`}
                                  >
                                    <span>📖 Telugu</span>
                                    <span className="text-[10px] bg-black/15 px-1.5 py-0.2 rounded-full">
                                      {classQuestions.filter(q => q.subject === 'LITERACY').length} Qs
                                    </span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setLiteracyLanguage('ENGLISH')}
                                    className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                      literacyLanguage === 'ENGLISH'
                                        ? 'bg-indigo-700 text-white shadow-xs'
                                        : 'text-indigo-900 hover:bg-indigo-100/70'
                                    }`}
                                  >
                                    <span>🔤 English</span>
                                    <span className="text-[10px] bg-black/15 px-1.5 py-0.2 rounded-full">
                                      {classQuestions.filter(q => q.subject === 'ENGLISH').length} Qs
                                    </span>
                                  </button>
                                </div>
                              )}

                              {/* ---------------- DIFFICULTY FILTER BAR ---------------- */}
                              <div className="flex items-center justify-between bg-slate-100 p-2 rounded-xl text-xs">
                                <span className="font-semibold text-slate-700 text-[11px]">
                                  Difficulty Level:
                                </span>
                                <div className="flex gap-1">
                                  {(['ALL', 'EASY', 'MODERATE', 'DIFFICULT'] as const).map(diff => (
                                    <button
                                      key={diff}
                                      type="button"
                                      onClick={() => setDifficultyFilter(diff)}
                                      className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                                        difficultyFilter === diff
                                          ? 'bg-slate-900 text-white shadow-xs'
                                          : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                                      }`}
                                    >
                                      {diff === 'ALL' ? 'All (1 Q per comp)' : diff === 'EASY' ? 'Easy' : diff === 'MODERATE' ? 'Moderate' : 'Difficult'}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Standardized Repository Rule Banner */}
                              <div className="bg-emerald-50/70 border border-emerald-200 px-3 py-2 rounded-lg flex items-center justify-between text-[11px] text-emerald-950">
                                <div className="flex items-center gap-1.5 font-medium">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                                  <span>NIPUN Repository Rule: <strong>1 question per competency</strong> loaded for Class {selectedClass}.</span>
                                </div>
                                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">
                                  {selectedMedium === 'TELUGU' ? 'Telugu Medium' : 'English Medium'}
                                </span>
                              </div>

                              {/* Question Cards */}
                              <div className="space-y-3">
                                {classQuestions
                                  .filter(q => {
                                    if (activeDomainTab === 'LITERACY') {
                                      return literacyLanguage === 'TELUGU' ? q.subject === 'LITERACY' : q.subject === 'ENGLISH';
                                    }
                                    return q.subject === 'NUMERACY';
                                  })
                                  .filter(q => {
                                    if (difficultyFilter === 'ALL') return true;
                                    return q.difficulty === difficultyFilter;
                                  })
                                  .map((q, qIndex) => {
                                    const currentAnswer = studentAnswers[currentStudent.id]?.[q.id];
                                    const isLit = q.subject === 'LITERACY';
                                    const isEng = q.subject === 'ENGLISH';
                                    const isNum = q.subject === 'NUMERACY';
                                    const isPA = q.competency.toLowerCase().includes('phonological');

                                    return (
                                      <div 
                                        key={q.id} 
                                        className={`p-3 rounded-xl border space-y-2 transition-all ${
                                          isPA 
                                            ? 'bg-purple-50/40 border-purple-300 ring-1 ring-purple-500/20' 
                                            : isEng
                                            ? 'bg-indigo-50/30 border-indigo-200'
                                            : isLit
                                            ? 'bg-emerald-50/30 border-emerald-200'
                                            : 'bg-white border-slate-200'
                                        }`}
                                      >
                                        <div className="flex flex-wrap items-center justify-between text-[11px] gap-1">
                                          <div className="flex items-center gap-1.5 flex-wrap">
                                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                              isPA 
                                                ? 'bg-purple-100 text-purple-800' 
                                                : isLit 
                                                ? 'bg-emerald-100 text-emerald-800' 
                                                : isEng
                                                ? 'bg-indigo-100 text-indigo-800'
                                                : 'bg-blue-100 text-blue-800'
                                            }`}>
                                              {isPA 
                                                ? `🎧 Phonological Awareness (${isLit ? 'Telugu' : isEng ? 'English' : 'FLN'})` 
                                                : isLit 
                                                ? 'Literacy — Telugu' 
                                                : isEng 
                                                ? 'Literacy — English' 
                                                : 'Numeracy'}
                                            </span>
                                            <span className="text-[10px] text-slate-500 font-medium">
                                              {q.competency}
                                            </span>
                                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-300">
                                              1 Q per Competency (Standard)
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            {q.nipunTargetRef && (
                                              <span className="text-[9px] font-bold text-amber-900 bg-amber-100 border border-amber-300 px-1.5 py-0.2 rounded">
                                                ★ {q.nipunTargetRef.split(':')[0]}
                                              </span>
                                            )}
                                            <span className="text-slate-400 text-[10px]">
                                              {q.difficulty} • 10 Pts
                                            </span>
                                          </div>
                                        </div>

                                        {/* Instruction / Prompt */}
                                        {q.instructionPrompt && (
                                          <div className="bg-amber-50/80 text-amber-950 p-2 rounded-lg text-[11px] flex items-start gap-1.5 font-medium border border-amber-200">
                                            <span>{q.instructionPrompt}</span>
                                          </div>
                                        )}

                                        {isPA && !q.instructionPrompt && (
                                          <div className="bg-purple-100/70 text-purple-950 p-2 rounded-lg text-[11px] flex items-center gap-1.5 font-medium border border-purple-200">
                                            <span>📢 <strong>Oral/Listening Prompt:</strong> Pronounce the target sound clearly and ask the student to respond.</span>
                                          </div>
                                        )}

                                        <div className="flex items-start justify-between gap-2">
                                          <div className="text-xs font-bold text-slate-900 leading-relaxed">
                                            <span>Q{qIndex + 1}. </span>
                                            <span>{q.text}</span>
                                            {q.textTelugu && q.textTelugu !== q.text && (
                                              <div className="text-[11px] font-normal text-slate-600 mt-0.5">
                                                {q.textTelugu}
                                              </div>
                                            )}
                                          </div>
                                          {currentAnswer !== undefined ? (
                                            <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded flex items-center gap-1 shrink-0">
                                              <Check className="w-3 h-3 text-emerald-700" />
                                              <span>Response Recorded</span>
                                            </span>
                                          ) : (
                                            <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded shrink-0">
                                              ⚪ Pending Response
                                            </span>
                                          )}
                                        </div>



                                        {/* SCERT Master Solution & Diagnostic Rubric Strip */}
                                        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
                                          <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                                            <span className="font-bold text-slate-700 flex items-center gap-1">
                                              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                                              <span>SCERT Repository Target Response:</span>
                                            </span>
                                            <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-300">
                                              {(q as any).expectedAnswer || (q.options && q.options[q.correctAnswerIndex]) || 'Expected Accurate Response'}
                                            </span>
                                          </div>

                                          {(q as any).scoringRubric && (
                                            <div className="text-[10px] text-slate-600 flex items-start gap-1 pt-0.5 border-t border-slate-200/60">
                                              <strong className="text-slate-700 shrink-0">Evaluator Rubric:</strong>
                                              <span>{(q as any).scoringRubric}</span>
                                            </div>
                                          )}
                                        </div>

                                        {/* Direct Assessor Performance Evaluation Controls (Non-MCQ) */}
                                        <div className="space-y-1.5 pt-1">
                                          <div className="text-[11px] font-bold text-slate-700 flex items-center justify-between">
                                            <span>Record Student Observed Performance (Non-MCQ):</span>
                                            {currentAnswer !== undefined && (
                                              <button
                                                type="button"
                                                onClick={() => handleSelectAnswer(currentStudent.id, q.id, undefined)}
                                                className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                                              >
                                                Reset
                                              </button>
                                            )}
                                          </div>

                                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                            {/* 1: Mastered / Correct (10 Pts) */}
                                            <button
                                              type="button"
                                              onClick={() => handleSelectAnswer(currentStudent.id, q.id, 10)}
                                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                currentAnswer === 10
                                                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                                                  : 'bg-white hover:bg-emerald-50/60 border-slate-200 text-slate-800'
                                              }`}
                                            >
                                              <div className="flex items-center justify-between w-full">
                                                <span className="font-bold text-xs flex items-center gap-1">
                                                  <CheckCircle className={`w-3.5 h-3.5 ${currentAnswer === 10 ? 'text-white' : 'text-emerald-600'}`} />
                                                  <span>Mastered</span>
                                                </span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                  currentAnswer === 10 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                  10 Pts
                                                </span>
                                              </div>
                                              <span className={`text-[10px] mt-1 ${currentAnswer === 10 ? 'text-emerald-100' : 'text-slate-500'}`}>
                                                Accurate & fluent response
                                              </span>
                                            </button>

                                            {/* 2: Developing / Partial (5 Pts) */}
                                            <button
                                              type="button"
                                              onClick={() => handleSelectAnswer(currentStudent.id, q.id, 5)}
                                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                currentAnswer === 5
                                                  ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300'
                                                  : 'bg-white hover:bg-amber-50/60 border-slate-200 text-slate-800'
                                              }`}
                                            >
                                              <div className="flex items-center justify-between w-full">
                                                <span className="font-bold text-xs flex items-center gap-1">
                                                  <Clock className={`w-3.5 h-3.5 ${currentAnswer === 5 ? 'text-white' : 'text-amber-600'}`} />
                                                  <span>Developing</span>
                                                </span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                  currentAnswer === 5 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
                                                }`}>
                                                  5 Pts
                                                </span>
                                              </div>
                                              <span className={`text-[10px] mt-1 ${currentAnswer === 5 ? 'text-amber-100' : 'text-slate-500'}`}>
                                                Hesitant / with mild prompt
                                              </span>
                                            </button>

                                            {/* 3: Beginning / Needs Support (0 Pts) */}
                                            <button
                                              type="button"
                                              onClick={() => handleSelectAnswer(currentStudent.id, q.id, 0)}
                                              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                                                currentAnswer === 0
                                                  ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-400'
                                                  : 'bg-white hover:bg-rose-50/60 border-slate-200 text-slate-800'
                                              }`}
                                            >
                                              <div className="flex items-center justify-between w-full">
                                                <span className="font-bold text-xs flex items-center gap-1">
                                                  <XCircle className={`w-3.5 h-3.5 ${currentAnswer === 0 ? 'text-white' : 'text-rose-600'}`} />
                                                  <span>Beginning</span>
                                                </span>
                                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                                  currentAnswer === 0 ? 'bg-rose-700 text-white' : 'bg-slate-100 text-slate-700'
                                                }`}>
                                                  0 Pts
                                                </span>
                                              </div>
                                              <span className={`text-[10px] mt-1 ${currentAnswer === 0 ? 'text-rose-100' : 'text-slate-500'}`}>
                                                Unable / incorrect response
                                              </span>
                                            </button>
                                          </div>

                                          {/* Feedback confirmation banner */}
                                          {currentAnswer !== undefined && (
                                            <div className={`p-2 rounded-lg text-[11px] font-semibold flex items-center justify-between ${
                                              currentAnswer === 10
                                                ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                                                : currentAnswer === 5
                                                ? 'bg-amber-50 text-amber-900 border border-amber-200'
                                                : 'bg-rose-50 text-rose-900 border border-rose-200'
                                            }`}>
                                              <div className="flex items-center gap-1.5">
                                                {currentAnswer === 10 && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
                                                {currentAnswer === 5 && <Clock className="w-3.5 h-3.5 text-amber-700" />}
                                                {currentAnswer === 0 && <XCircle className="w-3.5 h-3.5 text-rose-700" />}
                                                <span>
                                                  {currentAnswer === 10
                                                    ? '✓ 10 Marks Awarded — Student mastered this competency.'
                                                    : currentAnswer === 5
                                                    ? '◐ 5 Marks Awarded — Developing (Attempted with hesitation/support).'
                                                    : '✗ 0 Marks Awarded — Beginning (Needs remedial classroom focus).'}
                                                </span>
                                              </div>
                                              <span className="text-[10px] font-bold">
                                                Score: {currentAnswer} / 10
                                              </span>
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    );
                                })}
                              </div>

                              {/* Submission Action Buttons */}
                              {(() => {
                                const curAnswers = studentAnswers[currentStudent.id] || {};
                                const isLitDone = classQuestions.some(
                                  q => (q.subject === 'LITERACY' || q.subject === 'ENGLISH') && curAnswers[q.id] !== undefined
                                );
                                const isNumDone = classQuestions.some(
                                  q => q.subject === 'NUMERACY' && curAnswers[q.id] !== undefined
                                );
                                const isBothDone = isLitDone && isNumDone;
                                const alreadyEvaluatedInSession = sessionAssessedStudentIds.includes(currentStudent.id);
                                const projectedAssessedCount = sessionAssessedStudentIds.length + (alreadyEvaluatedInSession ? 0 : (isBothDone ? 1 : 0));
                                const isMin3Achieved = sessionAssessedStudentIds.length >= 3 || (sessionAssessedStudentIds.length >= 2 && !alreadyEvaluatedInSession && isBothDone);

                                return (
                                  <div className="pt-2 space-y-2 border-t border-slate-200">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {/* Primary Button: Save & Assess Next Student if <3, or Close & Return to Schools if >=3 */}
                                      {!isMin3Achieved ? (
                                        <button
                                          type="button"
                                          onClick={() => handleSubmitCurrentStudent('ASSESS_NEXT')}
                                          className="w-full p-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer group"
                                        >
                                          <div className="flex items-center gap-1.5 font-bold text-xs">
                                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                                            <span>
                                              Save & Assess Next Student (Child {sessionAssessedStudentIds.length + (alreadyEvaluatedInSession ? 1 : 2)} of 3 Min)
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-emerald-100 font-normal mt-0.5">
                                            {isBothDone ? '✓ Both domains complete • Proceed to next child' : 'Requires both Literacy & Numeracy answers'}
                                          </span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleSubmitCurrentStudent('CLOSE_AND_RETURN_TO_SCHOOLS')}
                                          className="w-full p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer ring-2 ring-emerald-500 group"
                                        >
                                          <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-300">
                                            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                                            <span>
                                              Close Assessment & Return to School List ({projectedAssessedCount}/3 Completed)
                                            </span>
                                          </div>
                                          <span className="text-[10px] text-slate-300 font-normal mt-0.5">
                                            ✓ Statutory 3-child minimum met! Save score and return to tour schedule
                                          </span>
                                        </button>
                                      )}

                                      {/* Secondary Button: Locked Close button if <3, or Assess Next optional if >=3 */}
                                      {!isMin3Achieved ? (
                                        <button
                                          type="button"
                                          onClick={() => handleSubmitCurrentStudent('CLOSE_AND_RETURN_TO_SCHOOLS')}
                                          className="w-full p-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer border border-slate-300"
                                        >
                                          <div className="flex items-center gap-1.5 font-bold text-xs text-slate-700">
                                            <Lock className="w-3.5 h-3.5 text-amber-600" />
                                            <span>Close Assessment & Return to School List</span>
                                          </div>
                                          <span className="text-[10px] text-amber-700 font-semibold mt-0.5">
                                            Locked • Min 3 Students Required ({sessionAssessedStudentIds.length}/3 Assessed)
                                          </span>
                                        </button>
                                      ) : (
                                        <button
                                          type="button"
                                          onClick={() => handleSubmitCurrentStudent('ASSESS_NEXT')}
                                          className="w-full p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl shadow-xs flex flex-col items-center justify-center text-center transition-all cursor-pointer border border-emerald-300"
                                        >
                                          <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-900">
                                            <Users className="w-3.5 h-3.5 text-emerald-700" />
                                            <span>Assess Another Student (Optional Child {sessionAssessedStudentIds.length + 1})</span>
                                          </div>
                                          <span className="text-[10px] text-emerald-700 font-normal mt-0.5">
                                            Continue sampling more children in Class {selectedClass}-A
                                          </span>
                                        </button>
                                      )}
                                    </div>

                                    {/* Tertiary: Return to Class Roster */}
                                    <div className="flex items-center justify-between pt-1">
                                      <button
                                        type="button"
                                        onClick={() => handleSubmitCurrentStudent('BACK_TO_UNASSESSED')}
                                        className="text-xs text-slate-600 hover:text-slate-900 font-medium flex items-center gap-1 cursor-pointer py-1 px-2 rounded hover:bg-slate-100"
                                      >
                                        <Users className="w-3 h-3 text-slate-500" />
                                        <span>Save & Return to Class Roster</span>
                                      </button>

                                      <span className="text-[11px] text-slate-500">
                                        Session Progress: <strong className={sessionAssessedStudentIds.length >= 3 ? "text-emerald-700 font-bold" : "text-amber-700 font-bold"}>{sessionAssessedStudentIds.length} of 3 evaluated</strong>
                                      </span>
                                    </div>

                                    <div className="text-[11px] text-slate-600 bg-slate-100/90 p-2 rounded-lg border border-slate-200 flex items-start gap-1.5">
                                      <Info className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
                                      <span>
                                        <strong>Statutory Inspection Workflow:</strong> Evaluate each child in <em>both</em> Literacy & Numeracy. The app advances to the next student until at least <strong>3 students</strong> are completed in this class, after which you can exit back to the school list.
                                      </span>
                                    </div>
                                  </div>
                                );
                              })()}
                            </div>
                          );
                        })()}
                      </>
                    )}
                  </div>
                )}

                {/* ---------------- STEP 7: SUBMISSION & NOTIFICATIONS ---------------- */}
                {activeStep === 7 && assessmentSuccessInfo && (
                  <div className="space-y-4">
                    <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl text-center space-y-2">
                      <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto">
                        <Check className="w-5 h-5" />
                      </div>
                      <div className="text-sm font-bold text-emerald-900">
                        Assessments Successfully Recorded!
                      </div>
                      <p className="text-xs text-emerald-800">
                        {assessmentSuccessInfo.studentsCount} unique students evaluated for Class {selectedClass}-A.
                      </p>
                    </div>

                    {/* Coverage Impact Card */}
                    <div className="bg-white p-3.5 rounded-xl border border-slate-200 space-y-2">
                      <div className="text-xs font-bold text-slate-800">
                        Monthly Coverage Updated
                      </div>
                      <div className="flex items-baseline justify-between text-xs">
                        <span className="text-slate-500">New Monthly Class Coverage:</span>
                        <span className="text-base font-bold text-emerald-700 tabular-nums">
                          {assessmentSuccessInfo.newCoveragePercent}%
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Proficient: <strong className="text-emerald-700">{assessmentSuccessInfo.proficientCount}</strong> • Developing: <strong className="text-amber-700">{assessmentSuccessInfo.developingCount}</strong>
                      </div>
                    </div>

                    {/* Actionable Notification Sent to HM/Teacher */}
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl space-y-1 text-xs">
                      <div className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-700" />
                        <span>Actionable Teacher / HM Notification Dispatched</span>
                      </div>
                      <p className="text-blue-800 text-[11px] leading-relaxed">
                        “Class {selectedClass}-A: {assessmentSuccessInfo.studentsCount} students assessed. {assessmentSuccessInfo.developingCount} students require immediate remedial peer-learning in 2-digit carryover addition using TLM.”
                      </p>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStudentFilter('UNASSESSED');
                          setActiveStep(5);
                        }}
                        className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Assess More Students</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveStep(8)}
                        className="flex-1 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <span>Proceed to Sign-Off</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* ---------------- STEP 8: VISIT CHECK-OUT & ACTION ITEM ---------------- */}
                {activeStep === 8 && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-slate-800">
                      Visit Check-out & Remedial Action Item
                    </div>

                    {/* Classroom Observation Checklist Summary Card */}
                    <div className="bg-indigo-50/70 border border-indigo-200 p-3 rounded-xl space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-indigo-700" />
                          <span>Classroom Observation Instrument (12 Indicators)</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setActiveVisitMode('CLASSROOM_OBSERVATION');
                            setActiveStep(5);
                          }}
                          className="text-[10px] font-bold text-indigo-700 hover:text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200 cursor-pointer"
                        >
                          Review / Edit
                        </button>
                      </div>

                      {(() => {
                        const obs = classroomObservationData;
                        const totalRatings = obs?.ratings ? Object.keys(obs.ratings).length : 0;
                        const yesCount = obs?.ratings ? Object.values(obs.ratings).filter(r => r === 'YES').length : 0;
                        const partialCount = obs?.ratings ? Object.values(obs.ratings).filter(r => r === 'PARTIALLY').length : 0;
                        const noCount = obs?.ratings ? Object.values(obs.ratings).filter(r => r === 'NO').length : 0;
                        const naCount = obs?.ratings ? Object.values(obs.ratings).filter(r => r === 'NA').length : 0;
                        const applicable = totalRatings - naCount;
                        const score = applicable > 0 ? Math.round(((yesCount * 1 + partialCount * 0.5) / applicable) * 100) : 0;
                        const teacherName = obs?.observedTeacherName || selectedSchool.headmasterName || 'Teacher In-Charge';
                        const obsGrade = obs?.observedGrade || selectedClass;
                        const obsSection = obs?.observedSection || 'A';

                        return (
                          <div className="space-y-1.5 text-[11px] text-slate-700">
                            <div className="flex items-center justify-between text-xs">
                              <span>Teacher: <strong>{teacherName}</strong> (Class {obsGrade}-{obsSection})</span>
                              <span className="font-bold text-indigo-800">
                                {totalRatings}/12 Rated ({score}% Compliance)
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px]">
                              <span className="px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-medium">Yes: {yesCount}</span>
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-medium">Partially: {partialCount}</span>
                              <span className="px-1.5 py-0.5 bg-rose-100 text-rose-800 rounded font-medium">No: {noCount}</span>
                              <span className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-medium">N/A: {naCount}</span>
                            </div>
                            {obs?.remarks && (
                              <div className="bg-white/80 p-2 rounded border border-indigo-100 text-[11px] text-slate-600 italic">
                                "{obs.remarks}"
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>

                    {/* Visit Observations */}
                    <div className="space-y-1 text-xs">
                      <label className="font-semibold text-slate-700">
                        Field Observations & Qualitative Remarks
                      </label>
                      <textarea
                        rows={2}
                        value={visitObservations}
                        onChange={(e) => setVisitObservations(e.target.value)}
                        className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                      />
                    </div>

                    {/* Action Item Creation */}
                    <div className="bg-amber-50/70 border border-amber-200 p-3 rounded-xl space-y-2">
                      <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Create Follow-up Action Item</span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-slate-700 font-medium">Issue Title:</label>
                        <input
                          type="text"
                          value={actionTitle}
                          onChange={(e) => setActionTitle(e.target.value)}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>

                      <div className="space-y-1 text-xs">
                        <label className="text-slate-700 font-medium">Competency Area:</label>
                        <input
                          type="text"
                          value={actionCompetency}
                          onChange={(e) => setActionCompetency(e.target.value)}
                          className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs"
                        />
                      </div>

                      <div className="text-[11px] text-slate-500">
                        Assigned To: <strong>{selectedSchool.headmasterName} (HM)</strong> • Target Date: <strong>2026-07-30</strong>
                      </div>
                    </div>

                    {/* Check-out Actions */}
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setStudentFilter('UNASSESSED');
                          setActiveStep(5);
                        }}
                        className="px-3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Students</span>
                      </button>

                      <button
                        onClick={handleCompleteVisit}
                        className="flex-1 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle className="w-4 h-4 text-emerald-200" />
                        <span>Complete School Visit & Sign Off</span>
                      </button>
                    </div>
                  </div>
                )}

              </div>

              {/* Mobile App Bottom Tab Bar */}
              <div className="bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around text-[10px] text-slate-500 font-medium">
                <button
                  onClick={() => setActiveStep(1)}
                  className={`flex flex-col items-center gap-0.5 ${activeStep === 1 ? 'text-emerald-700 font-bold' : ''}`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Cockpit</span>
                </button>
                <button
                  onClick={() => setActiveStep(2)}
                  className={`flex flex-col items-center gap-0.5 ${activeStep === 2 ? 'text-emerald-700 font-bold' : ''}`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>Tour Diary</span>
                </button>
                <button
                  onClick={() => setActiveStep(5)}
                  className={`flex flex-col items-center gap-0.5 ${activeStep === 5 ? 'text-emerald-700 font-bold' : ''}`}
                >
                  <Users className="w-4 h-4" />
                  <span>Class {selectedClass}-A</span>
                </button>
                <button
                  onClick={() => setActiveStep(3)}
                  className={`flex flex-col items-center gap-0.5 ${activeStep === 3 ? 'text-emerald-700 font-bold' : ''}`}
                >
                  <MapPin className="w-4 h-4" />
                  <span>Check-in</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
