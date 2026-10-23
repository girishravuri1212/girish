import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  Languages, 
  Calculator, 
  Filter, 
  Search, 
  CheckCircle2, 
  CheckCircle,
  AlertTriangle,
  HelpCircle, 
  Award, 
  ChevronRight, 
  Sparkles, 
  Volume2, 
  Clock, 
  SlidersHorizontal,
  GraduationCap,
  Play,
  RotateCcw,
  UserCheck,
  Check,
  X,
  Eye,
  EyeOff,
  Info,
  Download,
  ClipboardList,
  FileSpreadsheet
} from 'lucide-react';
import { 
  SUBJECT_DOMAINS, 
  COMPETENCIES_BY_DOMAIN, 
  COMPETENCY_QUESTIONS, 
  SubjectDomain, 
  CompetencyDef, 
  CompetencyQuestion 
} from '../data/competencyQuestions';
import { STUDENTS_CLASS_3A, SCHOOLS_DATA } from '../data/mockData';
import { Student, Medium } from '../types/fln';
import { ClassroomObservationChecklist } from './ClassroomObservationChecklist';

interface AssessmentStudioViewProps {
  onOpenMobileApp?: () => void;
  onRecordStudentScore?: (studentId: string, competencyId: string, score: number, maxScore: number) => void;
}

export const AssessmentStudioView: React.FC<AssessmentStudioViewProps> = ({ 
  onOpenMobileApp,
  onRecordStudentScore 
}) => {
  // Studio Top Tabs: Repository Browser vs Classroom Observation Instrument
  const [activeStudioTab, setActiveStudioTab] = useState<'ITEMS_REPOSITORY' | 'CLASSROOM_OBSERVATION'>('ITEMS_REPOSITORY');

  // Filter 1: Domain / Subject (Telugu, English, Numeracy)
  const [selectedDomain, setSelectedDomain] = useState<SubjectDomain>('LITERACY_TELUGU');

  // Filter 2: Medium (All, Telugu Medium, English Medium)
  const [selectedMedium, setSelectedMedium] = useState<'ALL' | 'TELUGU' | 'ENGLISH'>('ALL');
  
  // Filter 3: Target Class (All, Class 1, Class 2, Class 3, Class 4, Class 5)
  const [selectedClass, setSelectedClass] = useState<string>('ALL');

  // Filter 4: Competency (dynamically reflects based on Filter 1)
  const availableCompetencies = COMPETENCIES_BY_DOMAIN[selectedDomain] || [];
  const [selectedCompetencyId, setSelectedCompetencyId] = useState<string>(
    availableCompetencies[0]?.id || 'TEL_PHONOLOGY'
  );

  // Filter 5: Difficulty (Easy, Moderate, Difficult)
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Answer Key Visibility Toggle (Default: false — student practice mode without pre-selected options!)
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);

  // Interactive Answers selected by user when testing questions on cards
  const [interactiveAnswers, setInteractiveAnswers] = useState<Record<string, number>>({});

  // Live Testing Practice Modal
  const [activeTestQuestion, setActiveTestQuestion] = useState<CompetencyQuestion | null>(null);
  const [selectedStudentForTest, setSelectedStudentForTest] = useState<Student>(STUDENTS_CLASS_3A[0]);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [testFeedback, setTestFeedback] = useState<string | null>(null);

  // When domain changes, automatically select the first competency in that domain
  const handleDomainChange = (domain: SubjectDomain) => {
    setSelectedDomain(domain);
    const comps = COMPETENCIES_BY_DOMAIN[domain] || [];
    if (comps.length > 0) {
      setSelectedCompetencyId(comps[0].id);
    }
  };

  // Active competency details
  const activeCompetency = availableCompetencies.find(c => c.id === selectedCompetencyId) || availableCompetencies[0];

  // Filtered questions respecting the strict rule: "Each competency should not have more than two questions"
  const candidateQuestions = useMemo(() => {
    return COMPETENCY_QUESTIONS.filter(q => {
      if (q.domain !== selectedDomain) return false;
      if (q.competencyId !== selectedCompetencyId) return false;
      if (selectedMedium !== 'ALL' && q.medium && q.medium !== selectedMedium) return false;
      if (selectedDifficulty !== 'ALL' && q.difficulty !== selectedDifficulty) return false;
      if (selectedClass !== 'ALL' && q.classNumber.toString() !== selectedClass) return false;
      if (searchQuery.trim() !== '') {
        const qText = `${q.text} ${q.textTelugu || ''} ${q.nipunTargetRef}`.toLowerCase();
        if (!qText.includes(searchQuery.toLowerCase())) return false;
      }
      return true;
    });
  }, [selectedDomain, selectedCompetencyId, selectedMedium, selectedDifficulty, selectedClass, searchQuery]);

  // Strict 1 question per competency
  const filteredQuestions = useMemo(() => {
    return candidateQuestions.slice(0, 1);
  }, [candidateQuestions]);

  // Count by difficulty for active competency (strictly 1 item)
  const allCompQuestions = useMemo(() => {
    return COMPETENCY_QUESTIONS.filter(
      q => q.domain === selectedDomain && q.competencyId === selectedCompetencyId
    ).slice(0, 1);
  }, [selectedDomain, selectedCompetencyId]);

  const easyCount = allCompQuestions.filter(q => q.difficulty === 'EASY').length;
  const modCount = allCompQuestions.filter(q => q.difficulty === 'MODERATE').length;
  const diffCount = allCompQuestions.filter(q => q.difficulty === 'DIFFICULT').length;

  // Handle interactive card performance evaluation (Non-MCQ: 10, 5, 0)
  const handleSelectCardPerformance = (questionId: string, score: number) => {
    setInteractiveAnswers(prev => ({
      ...prev,
      [questionId]: score
    }));
  };

  const handleClearCardPerformance = (questionId: string) => {
    setInteractiveAnswers(prev => {
      const updated = { ...prev };
      delete updated[questionId];
      return updated;
    });
  };

  // Handle live test modal performance evaluation (Non-MCQ)
  const handleSelectPerformanceInTest = (score: number) => {
    setSelectedAnswerIndex(score);
    if (!activeTestQuestion) return;
    if (score === 10) {
      setTestFeedback(`Mastered (10 Pts) — Demonstrated competency independently for ${selectedStudentForTest.name}.`);
      if (onRecordStudentScore) {
        onRecordStudentScore(selectedStudentForTest.id, activeTestQuestion.competencyId, 10, 10);
      }
    } else if (score === 5) {
      setTestFeedback(`Developing (5 Pts) — Attempted with mild prompt / hesitant response.`);
      if (onRecordStudentScore) {
        onRecordStudentScore(selectedStudentForTest.id, activeTestQuestion.competencyId, 5, 10);
      }
    } else {
      setTestFeedback(`Beginning (0 Pts) — Unable to answer or incorrect response. Needs remedial focus.`);
      if (onRecordStudentScore) {
        onRecordStudentScore(selectedStudentForTest.id, activeTestQuestion.competencyId, 0, 10);
      }
    }
  };

  // Export Complete Assessment Items Repository as CSV (strictly 1 Q per competency)
  const handleExportRepositoryCSV = () => {
    const compCounter: Record<string, number> = {};
    const exportedItems: CompetencyQuestion[] = [];

    // Strictly enforce 1 question per (domain, class, medium, competency)
    for (const q of COMPETENCY_QUESTIONS) {
      const medKey = q.medium || 'ALL';
      const key = `${q.domain}__${q.classNumber}__${medKey}__${q.competencyId}`;
      const count = compCounter[key] || 0;
      if (count < 1) {
        compCounter[key] = count + 1;
        exportedItems.push(q);
      }
    }

    const headers = [
      'Item ID',
      'Domain / Subject',
      'Instruction Medium',
      'Class / Grade',
      'Competency Code',
      'Competency Name',
      'Item Order (Max 2)',
      'Difficulty Level',
      'NIPUN Target Code',
      'Question Text (English)',
      'Question Text (Telugu)',
      'Assessor Oral Prompt',
      'Option A',
      'Option B',
      'Option C',
      'Option D',
      'Correct Option Index',
      'Correct Answer Text',
      'Max Score',
      'Scoring Rubric'
    ];

    const escapeCSV = (val: string | number | undefined) => {
      if (val === undefined || val === null) return '""';
      const s = String(val).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = exportedItems.map((item) => {
      const domainName = SUBJECT_DOMAINS.find(d => d.id === item.domain)?.name || item.domain;
      const compDef = COMPETENCIES_BY_DOMAIN[item.domain]?.find(c => c.id === item.competencyId);
      const optA = item.options[0] || '';
      const optB = item.options[1] || '';
      const optC = item.options[2] || '';
      const optD = item.options[3] || '';
      const correctText = item.options[item.correctAnswerIndex] || '';

      const medKey = item.medium || 'ALL';
      const key = `${item.domain}__${item.classNumber}__${medKey}__${item.competencyId}`;
      const sameGroup = exportedItems.filter(x => `${x.domain}__${x.classNumber}__${x.medium || 'ALL'}__${x.competencyId}` === key);
      const itemNum = sameGroup.findIndex(x => x.id === item.id) + 1;

      return [
        escapeCSV(item.id),
        escapeCSV(domainName),
        escapeCSV(item.medium || 'Bilingual / Universal'),
        escapeCSV(`Class ${item.classNumber}`),
        escapeCSV(compDef?.nipunCode || item.competencyId),
        escapeCSV(compDef?.name || item.competencyId),
        escapeCSV(`Item ${itemNum} of ${Math.min(sameGroup.length, 2)}`),
        escapeCSV(item.difficulty),
        escapeCSV(item.nipunTargetRef),
        escapeCSV(item.text),
        escapeCSV(item.textTelugu || ''),
        escapeCSV(item.oralPrompt || ''),
        escapeCSV(optA),
        escapeCSV(optB),
        escapeCSV(optC),
        escapeCSV(optD),
        escapeCSV(item.correctAnswerIndex),
        escapeCSV(correctText),
        escapeCSV(item.maxScore),
        escapeCSV(item.scoringRubric)
      ].join(',');
    });

    const csvContent = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `AP_FLN_Assessment_Items_Repository_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5 pb-12 font-sans">
      {/* ---------------------------------------------------------------------- */}
      {/* 1. HEADER BANNER */}
      {/* ---------------------------------------------------------------------- */}
      <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-700" />
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">
              SCERT FLN Diagnostic Assessment Engine & Repository
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Master repository of standardized NIPUN Bharat assessment items (Subject, Class, Medium, Competency) with Classroom Observation Instrument.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
          <button
            type="button"
            onClick={handleExportRepositoryCSV}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5 border border-slate-300"
            title="Download full standardized repository with max 2 questions per competency"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
            <span>Export Repository (CSV)</span>
          </button>

          {onOpenMobileApp && (
            <button
              type="button"
              onClick={onOpenMobileApp}
              className="px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Open Field Inspection App</span>
            </button>
          )}
        </div>
      </div>

      {/* ---------------------------------------------------------------------- */}
      {/* 2. STUDIO TOP NAVIGATION TABS */}
      {/* ---------------------------------------------------------------------- */}
      <div className="flex border-b border-slate-200 gap-2 bg-white px-4 pt-2 rounded-xl shadow-xs">
        <button
          type="button"
          onClick={() => setActiveStudioTab('ITEMS_REPOSITORY')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeStudioTab === 'ITEMS_REPOSITORY'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Assessment Items Repository (Subject, Class, Medium, Competency)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveStudioTab('CLASSROOM_OBSERVATION')}
          className={`pb-3 px-3 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-2 ${
            activeStudioTab === 'CLASSROOM_OBSERVATION'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>2. Classroom Observation Instrument (12 Indicators)</span>
        </button>
      </div>

      {/* ====================================================================== */}
      {/* TAB 1: ASSESSMENT ITEMS REPOSITORY */}
      {/* ====================================================================== */}
      {activeStudioTab === 'ITEMS_REPOSITORY' && (
        <div className="space-y-5">
          {/* Clarity Hero Card */}
          <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white p-4 sm:p-5 rounded-xl shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300 uppercase tracking-wider">
              <Info className="w-4 h-4 text-amber-300" />
              <span>Standardized FLN Assessment Repository Architecture</span>
            </div>
            
            <p className="text-xs text-slate-200 leading-relaxed">
              This repository stores standardized diagnostic items calibrated for supervisory officers (MEOs, CRPs, DEOs) conducting 1-on-1 evaluations with Class 1–5 students. 
              <strong> Statutory rule:</strong> Each learning competency is capped at <strong>strictly 2 questions</strong> to avoid student fatigue while delivering high diagnostic precision.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs pt-1">
              <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>1. Multi-Dimensional Item Schema</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Indexed by Subject (Telugu, English, Math), Class (1–5), Instruction Medium (Telugu / English), and Competency.
                </p>
              </div>

              <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                <div className="font-bold text-amber-300 flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>2. Oral Instructions & Prompts</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Includes explicit oral prompts spoken aloud in Telugu and English for uniform testing across 26 districts.
                </p>
              </div>

              <div className="bg-white/10 p-3 rounded-lg border border-white/10 space-y-1">
                <div className="font-bold text-blue-300 flex items-center gap-1.5">
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>3. Max 2 Questions per Competency</span>
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  Strictly 2 calibrated questions per competency (Item 1 & Item 2) with instant scoring rubrics.
                </p>
              </div>
            </div>
          </div>

          {/* DUAL DROPDOWN & FILTER SELECTOR BAR */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-2">
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>Filter Repository Items (Subject, Class, Medium, Competency)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              {/* 1: SUBJECT / DOMAIN */}
              <div>
                <label htmlFor="subject-domain-select" className="font-bold text-slate-700 block mb-1">
                  1. Subject / Domain:
                </label>
                <select
                  id="subject-domain-select"
                  value={selectedDomain}
                  onChange={(e) => handleDomainChange(e.target.value as SubjectDomain)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SUBJECT_DOMAINS.map((dom) => (
                    <option key={dom.id} value={dom.id}>
                      {dom.id === 'LITERACY_TELUGU' ? `${dom.name} (${dom.nameTelugu})` : dom.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Choose Telugu, English, or Math
                </span>
              </div>

              {/* 2: INSTRUCTION MEDIUM */}
              <div>
                <label htmlFor="medium-select" className="font-bold text-slate-700 block mb-1">
                  2. Instruction Medium:
                </label>
                <select
                  id="medium-select"
                  value={selectedMedium}
                  onChange={(e) => setSelectedMedium(e.target.value as 'ALL' | 'TELUGU' | 'ENGLISH')}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Mediums</option>
                  <option value="TELUGU">Telugu Medium</option>
                  <option value="ENGLISH">English Medium</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Medium of instruction
                </span>
              </div>

              {/* 3: TARGET CLASS (1 to 5) */}
              <div>
                <label htmlFor="class-filter-select" className="font-bold text-slate-700 block mb-1">
                  3. Target Class / Grade:
                </label>
                <select
                  id="class-filter-select"
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="ALL">All Classes (1 to 5)</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                </select>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Primary grade level
                </span>
              </div>

              {/* 4: LEARNING COMPETENCY */}
              <div className="sm:col-span-2 lg:col-span-2">
                <label htmlFor="competency-select" className="font-bold text-slate-700 block mb-1">
                  4. Learning Competency:
                </label>
                <select
                  id="competency-select"
                  value={selectedCompetencyId}
                  onChange={(e) => setSelectedCompetencyId(e.target.value)}
                  className="w-full p-2.5 bg-emerald-50/70 border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {availableCompetencies.map((comp) => (
                    <option key={comp.id} value={comp.id}>
                      {selectedDomain === 'LITERACY_TELUGU' ? `${comp.name} — ${comp.nameTelugu}` : comp.name}
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-emerald-700 mt-1 block font-medium truncate">
                  {activeCompetency?.description}
                </span>
              </div>
            </div>

            {/* Competency Summary Strip */}
            {activeCompetency && (
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between text-xs gap-2 mt-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 text-emerald-800 text-[11px]">
                    {activeCompetency.nipunCode}
                  </span>
                  <span className="font-bold text-slate-900">{activeCompetency.name}</span>
                  <span className="text-slate-500 font-normal">({activeCompetency.nameTelugu})</span>
                </div>

                <div className="flex items-center gap-3 text-[11px]">
                  <span className="text-slate-600">Applicable: <strong>{activeCompetency.classRange}</strong></span>
                  <span className="text-slate-300">|</span>
                  <span className="text-amber-800 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    Max 2 Questions per Competency Enforced
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* MODE TOGGLE: PRACTICE MODE vs ANSWER KEY MODE */}
          <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700">Display Mode:</span>
              
              <div className="inline-flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setShowAnswerKey(false)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    !showAnswerKey
                      ? 'bg-white text-emerald-900 shadow-xs font-bold border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                  <span>Interactive Practice (Unselected)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowAnswerKey(true)}
                  className={`px-3 py-1.5 rounded-md transition-all cursor-pointer flex items-center gap-1.5 ${
                    showAnswerKey
                      ? 'bg-amber-100 text-amber-950 shadow-xs font-bold border border-amber-300'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5 text-amber-700" />
                  <span>Show Master Answer Key</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] text-slate-500">
              {!showAnswerKey ? (
                <span className="text-emerald-700 font-medium">
                  💡 Click any option below to test your answers interactively.
                </span>
              ) : (
                <span className="text-amber-800 font-semibold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  🔑 Answer Key Mode: Official SCERT solutions highlighted.
                </span>
              )}
            </div>
          </div>

          {/* QUESTION LIST FOR SELECTED COMPETENCY */}
          <div className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <h2 className="text-sm font-bold text-slate-900">
                  Questions under: {activeCompetency?.name} ({filteredQuestions.length} of 1 Item)
                </h2>
              </div>

              <div className="flex items-center gap-2">
                {/* Search box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search in questions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="text-xs px-2.5 py-1 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none w-48"
                  />
                </div>
              </div>
            </div>

            {/* Repository Rule Callout */}
            <div className="bg-emerald-50/70 border border-emerald-200 p-2.5 rounded-lg flex items-center justify-between text-[11px] text-emerald-950">
              <div className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Repository Standard: <strong>1 question per competency</strong> is displayed and assessed.</span>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                {filteredQuestions.length} / 1 Item
              </span>
            </div>

            {/* Question Cards */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-500 text-xs">
                No questions found matching the selected filter criteria. Try resetting difficulty, medium or search.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredQuestions.map((q, idx) => {
                  const isEasy = q.difficulty === 'EASY';
                  const isMod = q.difficulty === 'MODERATE';
                  const evaluatedScore = interactiveAnswers[q.id];
                  const isEvaluated = evaluatedScore !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3 hover:border-slate-300 transition-colors"
                    >
                      {/* Question Header */}
                      <div className="flex flex-wrap items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                            {idx + 1}
                          </span>
                          <span className="font-mono text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                            {q.nipunTargetRef}
                          </span>
                          <span className="text-xs text-slate-600 font-medium">
                            Class {q.classNumber}
                          </span>
                          <span className="text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-300 px-2 py-0.5 rounded">
                            Item {idx + 1} of 1 (1 Q per Competency)
                          </span>
                          {q.medium && (
                            <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded">
                              {q.medium === 'TELUGU' ? 'Telugu Medium' : 'English Medium'}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {/* Difficulty Badge */}
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                            isEasy 
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                              : isMod 
                              ? 'bg-amber-100 text-amber-800 border border-amber-200' 
                              : 'bg-rose-100 text-rose-800 border border-rose-200'
                          }`}>
                            {q.difficulty}
                          </span>

                          {/* Interactive Test Action */}
                          <button
                            type="button"
                            onClick={() => {
                              setActiveTestQuestion(q);
                              setSelectedAnswerIndex(null);
                              setTestFeedback(null);
                            }}
                            className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded border border-emerald-200 transition-colors cursor-pointer flex items-center gap-1"
                          >
                            <UserCheck className="w-3 h-3" />
                            <span>Simulate 1-on-1 Student Test</span>
                          </button>
                        </div>
                      </div>

                      {/* Question Body */}
                      <div className="space-y-1.5">
                        {/* Telugu Prompt (Primary in AP FLN) */}
                        {q.textTelugu && (
                          <div className="text-sm font-semibold text-slate-900 leading-relaxed">
                            {q.textTelugu}
                          </div>
                        )}
                        {/* English Translation / Text */}
                        <div className="text-xs text-slate-600 leading-relaxed">
                          {q.text}
                        </div>

                        {/* Assessor Oral Prompt / Script */}
                        {q.oralPrompt && (
                          <div className="bg-amber-50/80 p-2.5 rounded-lg border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2 mt-2">
                            <Volume2 className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                            <div>
                              <strong className="text-amber-900">Assessor Oral Script: </strong>
                              <span>{q.oralPrompt}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Non-MCQ Direct Target Response & Scoring Rubric */}
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                            <span>Repository Target Expected Response:</span>
                          </span>
                          <span className="font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2.5 py-0.5 rounded">
                            {q.options[q.correctAnswerIndex]}
                          </span>
                        </div>

                        <div className="text-[11px] text-slate-600 flex items-start gap-1 pt-1.5 border-t border-slate-200/60">
                          <strong className="text-slate-800 shrink-0">Diagnostic Rubric:</strong>
                          <span>{q.scoringRubric}</span>
                        </div>
                      </div>

                      {/* Direct Assessor Performance Evaluation (Non-MCQ) */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-700">
                          <span>Direct Assessor Evaluation (Non-MCQ):</span>
                          {isEvaluated && (
                            <button
                              type="button"
                              onClick={() => handleClearCardPerformance(q.id)}
                              className="text-[10px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                          <button
                            type="button"
                            onClick={() => handleSelectCardPerformance(q.id, 10)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              evaluatedScore === 10
                                ? 'bg-emerald-600 text-white border-emerald-700 shadow-sm ring-2 ring-emerald-400'
                                : 'bg-slate-50 hover:bg-emerald-50/70 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-xs flex items-center gap-1">
                                <CheckCircle className={`w-3.5 h-3.5 ${evaluatedScore === 10 ? 'text-white' : 'text-emerald-600'}`} />
                                <span>Mastered</span>
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                evaluatedScore === 10 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                10 Pts
                              </span>
                            </div>
                            <span className={`text-[10px] mt-1 ${evaluatedScore === 10 ? 'text-emerald-100' : 'text-slate-500'}`}>
                              Accurate & fluent response
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelectCardPerformance(q.id, 5)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              evaluatedScore === 5
                                ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-300'
                                : 'bg-slate-50 hover:bg-amber-50/70 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-xs flex items-center gap-1">
                                <AlertTriangle className={`w-3.5 h-3.5 ${evaluatedScore === 5 ? 'text-white' : 'text-amber-600'}`} />
                                <span>Developing</span>
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                evaluatedScore === 5 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
                              }`}>
                                5 Pts
                              </span>
                            </div>
                            <span className={`text-[10px] mt-1 ${evaluatedScore === 5 ? 'text-amber-100' : 'text-slate-500'}`}>
                              Hesitant / With prompt
                            </span>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSelectCardPerformance(q.id, 0)}
                            className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                              evaluatedScore === 0
                                ? 'bg-rose-600 text-white border-rose-700 shadow-sm ring-2 ring-rose-300'
                                : 'bg-slate-50 hover:bg-rose-50/70 border-slate-200 text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="font-bold text-xs flex items-center gap-1">
                                <X className={`w-3.5 h-3.5 ${evaluatedScore === 0 ? 'text-white' : 'text-rose-600'}`} />
                                <span>Beginning</span>
                              </span>
                              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                evaluatedScore === 0 ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
                              }`}>
                                0 Pts
                              </span>
                            </div>
                            <span className={`text-[10px] mt-1 ${evaluatedScore === 0 ? 'text-rose-100' : 'text-slate-500'}`}>
                              Needs remedial support
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Interactive Feedback */}
                      {isEvaluated && (
                        <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center justify-between ${
                          evaluatedScore === 10
                            ? 'bg-emerald-50 border border-emerald-200 text-emerald-950'
                            : evaluatedScore === 5
                            ? 'bg-amber-50 border border-amber-200 text-amber-950'
                            : 'bg-rose-50 border border-rose-200 text-rose-950'
                        }`}>
                          <div className="flex items-center gap-1.5">
                            {evaluatedScore === 10 ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                            ) : evaluatedScore === 5 ? (
                              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                            ) : (
                              <X className="w-4 h-4 text-rose-700 shrink-0" />
                            )}
                            <span>
                              {evaluatedScore === 10
                                ? 'Mastered (10 Pts) — Student demonstrated competence accurately & independently.'
                                : evaluatedScore === 5
                                ? 'Developing (5 Pts) — Demonstrated with scaffolding or partial accuracy.'
                                : 'Beginning (0 Pts) — Unable to answer or incorrect. Requires remedial support.'}
                            </span>
                          </div>
                          
                          <button
                            type="button"
                            onClick={() => handleClearCardPerformance(q.id)}
                            className="text-[11px] underline font-bold cursor-pointer hover:opacity-80 shrink-0 ml-2"
                          >
                            Re-evaluate
                          </button>
                        </div>
                      )}

                      {/* Scoring Rubric Footer */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-emerald-700" />
                          <span>Scoring Rubric: <strong className="text-slate-700">{q.scoringRubric}</strong></span>
                        </div>
                        <span className="font-semibold text-slate-700">Max Score: {q.maxScore} Mark</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ====================================================================== */}
      {/* TAB 2: CLASSROOM OBSERVATION INSTRUMENT (12 INDICATORS) */}
      {/* ====================================================================== */}
      {activeStudioTab === 'CLASSROOM_OBSERVATION' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-2">
            <div className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-indigo-700" />
              <h2 className="text-base font-bold text-slate-900">
                Official Classroom Observation Instrument (12 Indicators)
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Standardized statutory classroom observation checklist for educational officers (MEOs, CRPs, DEOs) observing teaching-learning quality in primary classrooms.
              Covers 4 core domains: <strong>1. Teaching and learning process</strong> (Indicators 1–3), <strong>2. Use of teaching-learning materials</strong> (Indicators 4–6), <strong>3. Multigrade classroom management</strong> (Indicators 7–9), and <strong>4. Assessment and student engagement</strong> (Indicators 10–12).
            </p>
          </div>

          {/* Embedded Full Interactive Checklist */}
          <ClassroomObservationChecklist 
            school={SCHOOLS_DATA[0]}
            initialClass={3}
            initialSection="A"
            onContinueToAssessment={onOpenMobileApp}
          />
        </div>
      )}

      {/* ---------------------------------------------------------------------- */}
      {/* 6. INTERACTIVE "TEST STUDENT" SIMULATOR MODAL */}
      {/* ---------------------------------------------------------------------- */}
      {activeTestQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-5 max-w-lg w-full space-y-4 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-emerald-700" />
                <h3 className="font-bold text-sm text-slate-900">
                  Direct Student Assessment Simulator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveTestQuestion(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Student Select Dropdown */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1">
              <label htmlFor="tested-student-select" className="font-bold text-slate-700 block">
                Select Student to Assess:
              </label>
              <select
                id="tested-student-select"
                value={selectedStudentForTest.id}
                onChange={(e) => {
                  const stu = STUDENTS_CLASS_3A.find(s => s.id === e.target.value) || STUDENTS_CLASS_3A[0];
                  setSelectedStudentForTest(stu);
                  setSelectedAnswerIndex(null);
                  setTestFeedback(null);
                }}
                className="w-full p-2 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                {STUDENTS_CLASS_3A.map(s => (
                  <option key={s.id} value={s.id}>
                    Roll #{s.rollNumber} — {s.name} ({s.nameTelugu}) · Class 3-A
                  </option>
                ))}
              </select>
            </div>

            {/* Question Display */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                  {activeCompetency.name}
                </span>
                <span className="font-mono text-slate-500">{activeTestQuestion.nipunTargetRef}</span>
              </div>

              {activeTestQuestion.textTelugu && (
                <div className="text-sm font-bold text-slate-900 leading-relaxed">
                  {activeTestQuestion.textTelugu}
                </div>
              )}
              <div className="text-xs text-slate-600">
                {activeTestQuestion.text}
              </div>

              {activeTestQuestion.oralPrompt && (
                <div className="text-xs text-amber-900 bg-amber-50 p-2 rounded border border-amber-200">
                  <span className="font-bold">Prompt to Student: </span>
                  {activeTestQuestion.oralPrompt}
                </div>
              )}
            </div>

            {/* Target Response & Rubric Callout */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <div className="flex flex-wrap items-center justify-between gap-1 text-[11px]">
                <span className="font-bold text-slate-700 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Repository Target Response:</span>
                </span>
                <span className="font-bold text-emerald-900 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded">
                  {activeTestQuestion.options[activeTestQuestion.correctAnswerIndex]}
                </span>
              </div>
              <div className="text-[10px] text-slate-600 border-t border-slate-200/60 pt-1">
                <strong className="text-slate-800">Diagnostic Rubric: </strong>
                <span>{activeTestQuestion.scoringRubric}</span>
              </div>
            </div>

            {/* Direct Assessor Performance Evaluation (Non-MCQ) */}
            <div className="space-y-2 pt-1">
              <div className="text-xs font-bold text-slate-700">
                Direct Assessor Evaluation (Non-MCQ):
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleSelectPerformanceInTest(10)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedAnswerIndex === 10
                      ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
                      : 'bg-white hover:bg-emerald-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs flex items-center gap-1">
                      <CheckCircle className={`w-3.5 h-3.5 ${selectedAnswerIndex === 10 ? 'text-white' : 'text-emerald-600'}`} />
                      <span>Mastered</span>
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      selectedAnswerIndex === 10 ? 'bg-emerald-700 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      10 Pts
                    </span>
                  </div>
                  <span className={`text-[10px] mt-1 ${selectedAnswerIndex === 10 ? 'text-emerald-100' : 'text-slate-500'}`}>
                    Independently accurate
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPerformanceInTest(5)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedAnswerIndex === 5
                      ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-300'
                      : 'bg-white hover:bg-amber-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs flex items-center gap-1">
                      <AlertTriangle className={`w-3.5 h-3.5 ${selectedAnswerIndex === 5 ? 'text-white' : 'text-amber-600'}`} />
                      <span>Developing</span>
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      selectedAnswerIndex === 5 ? 'bg-amber-700 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      5 Pts
                    </span>
                  </div>
                  <span className={`text-[10px] mt-1 ${selectedAnswerIndex === 5 ? 'text-amber-100' : 'text-slate-500'}`}>
                    Hesitant / With prompt
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSelectPerformanceInTest(0)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedAnswerIndex === 0
                      ? 'bg-rose-600 text-white border-rose-700 shadow-md ring-2 ring-rose-300'
                      : 'bg-white hover:bg-rose-50 border-slate-200 text-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-bold text-xs flex items-center gap-1">
                      <X className={`w-3.5 h-3.5 ${selectedAnswerIndex === 0 ? 'text-white' : 'text-rose-600'}`} />
                      <span>Beginning</span>
                    </span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      selectedAnswerIndex === 0 ? 'bg-rose-700 text-white' : 'bg-rose-100 text-rose-800'
                    }`}>
                      0 Pts
                    </span>
                  </div>
                  <span className={`text-[10px] mt-1 ${selectedAnswerIndex === 0 ? 'text-rose-100' : 'text-slate-500'}`}>
                    Needs remedial support
                  </span>
                </button>
              </div>
            </div>

            {/* Feedback Strip */}
            {testFeedback && (
              <div className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                selectedAnswerIndex === 10
                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                  : selectedAnswerIndex === 5
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-rose-100 text-rose-900 border border-rose-300'
              }`}>
                {selectedAnswerIndex === 10 ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                ) : selectedAnswerIndex === 5 ? (
                  <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-rose-700 shrink-0" />
                )}
                <span>{testFeedback}</span>
              </div>
            )}

            {/* Footer Buttons */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Rubric: {activeTestQuestion.scoringRubric}
              </span>
              <button
                type="button"
                onClick={() => setActiveTestQuestion(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
