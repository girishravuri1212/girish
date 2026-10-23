import React, { useState } from 'react';
import { 
  ClipboardCheck, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  Save, 
  RotateCcw, 
  Download, 
  FileText, 
  User, 
  BookOpen, 
  GraduationCap,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { 
  ClassroomObservationData, 
  ObservationRating, 
  School 
} from '../types/fln';
import { 
  CLASSROOM_OBSERVATION_INDICATORS, 
  OBSERVATION_SECTIONS, 
  OBSERVATION_RATING_OPTIONS 
} from '../data/classroomObservationChecklistData';

interface ClassroomObservationChecklistProps {
  school: School;
  initialClass?: number;
  initialSection?: string;
  onSaveObservation?: (data: ClassroomObservationData) => void;
  savedData?: ClassroomObservationData | null;
  onContinueToAssessment?: () => void;
  isCompactView?: boolean;
}

export const ClassroomObservationChecklist: React.FC<ClassroomObservationChecklistProps> = ({
  school,
  initialClass = 3,
  initialSection = 'A',
  onSaveObservation,
  savedData,
  onContinueToAssessment,
  isCompactView = false,
}) => {
  // Form state
  const [observedGrade, setObservedGrade] = useState<number>(savedData?.observedGrade || initialClass);
  const [observedSection, setObservedSection] = useState<string>(savedData?.observedSection || initialSection);
  const [observedSubject, setObservedSubject] = useState<string>(savedData?.observedSubject || 'Foundational Literacy (Telugu)');
  const [observedTeacherName, setObservedTeacherName] = useState<string>(
    savedData?.observedTeacherName || 'Sri B. Ramesh Kumar (SGT)'
  );
  
  // Ratings for all 12 indicators: { [indicatorId]: 'YES' | 'PARTIALLY' | 'NO' | 'NA' }
  const [ratings, setRatings] = useState<Record<number, ObservationRating>>(
    savedData?.ratings || {
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
    }
  );

  const [remarks, setRemarks] = useState<string>(
    savedData?.remarks || 'Teacher followed the 4-step pedagogical sequence effectively. Need more focused TLM utilization for struggling learners during independent practice.'
  );

  const [saveSuccessNotification, setSaveSuccessNotification] = useState<boolean>(false);

  // Set rating for single indicator
  const handleRatingChange = (indicatorId: number, rating: ObservationRating) => {
    setRatings(prev => ({
      ...prev,
      [indicatorId]: rating,
    }));
  };

  // Quick helper to fill all with rating
  const handleSetAll = (rating: ObservationRating) => {
    const updated: Record<number, ObservationRating> = {};
    CLASSROOM_OBSERVATION_INDICATORS.forEach(ind => {
      updated[ind.id] = rating;
    });
    setRatings(updated);
  };

  // Calculate statistics
  const totalIndicators = CLASSROOM_OBSERVATION_INDICATORS.length;
  const answeredCount = Object.keys(ratings).filter(k => ratings[Number(k)]).length;
  const yesCount = Object.values(ratings).filter(r => r === 'YES').length;
  const partiallyCount = Object.values(ratings).filter(r => r === 'PARTIALLY').length;
  const noCount = Object.values(ratings).filter(r => r === 'NO').length;
  const naCount = Object.values(ratings).filter(r => r === 'NA').length;

  const validScoreItems = totalIndicators - naCount;
  const complianceScore = validScoreItems > 0 
    ? Math.round(((yesCount * 1.0 + partiallyCount * 0.5) / validScoreItems) * 100)
    : 100;

  // Handle Save
  const handleSave = () => {
    const data: ClassroomObservationData = {
      ratings,
      remarks,
      observedTeacherName,
      observedSubject,
      observedGrade,
      observedSection,
      submittedAt: new Date().toISOString(),
    };
    if (onSaveObservation) {
      onSaveObservation(data);
    }
    setSaveSuccessNotification(true);
    setTimeout(() => setSaveSuccessNotification(false), 4000);
  };

  // CSV Export of Checklist
  const handleExportCSV = () => {
    const headers = ['S.No.', 'Section', 'Observation Indicator', 'Rating', 'Remarks'];
    const rows = CLASSROOM_OBSERVATION_INDICATORS.map(ind => [
      ind.id,
      ind.sectionTitle,
      `"${ind.indicatorText.replace(/"/g, '""')}"`,
      ratings[ind.id] || 'UNANSWERED',
      `"${remarks.replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Classroom_Observation_${school.name.replace(/\s+/g, '_')}_Class${observedGrade}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden space-y-4">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-xs flex items-center justify-center shrink-0 border border-white/20">
              <ClipboardCheck className="w-6 h-6 text-emerald-200" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-100 border border-emerald-400/30">
                  School Visit • Step 2 of Inspection
                </span>
                <span className="text-[10px] text-emerald-200">
                  Official Monitoring Protocol
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold mt-1 text-white flex items-center gap-2">
                Classroom Observation Checklist
              </h2>
              <p className="text-xs text-emerald-100 mt-0.5">
                School: <strong className="text-white">{school.name}</strong> • UDISE: <span className="font-mono text-emerald-200">{school.udiseCode}</span>
              </p>
            </div>
          </div>

          {/* Quick Metrics Badge */}
          <div className="flex items-center gap-3 self-end sm:self-center">
            <div className="bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-xl border border-white/15 text-right">
              <div className="text-[10px] uppercase tracking-wider text-emerald-200 font-semibold">
                Classroom Quality
              </div>
              <div className="text-lg font-bold text-white tabular-nums flex items-baseline justify-end gap-1">
                <span>{complianceScore}%</span>
                <span className="text-[10px] text-emerald-200 font-normal">Score</span>
              </div>
            </div>
          </div>
        </div>

        {/* Classroom Observation Metadata Form Bar */}
        <div className="mt-4 pt-3 border-t border-white/15 grid grid-cols-1 sm:grid-cols-4 gap-2.5 text-xs">
          <div>
            <label className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block mb-1">
              Class & Section:
            </label>
            <div className="flex gap-1.5">
              <select
                value={observedGrade}
                onChange={(e) => setObservedGrade(Number(e.target.value))}
                className="bg-emerald-950/70 text-white border border-emerald-500/40 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-300 w-full"
              >
                {[1, 2, 3, 4, 5].map(g => (
                  <option key={g} value={g} className="bg-slate-900 text-white">Class {g}</option>
                ))}
              </select>
              <select
                value={observedSection}
                onChange={(e) => setObservedSection(e.target.value)}
                className="bg-emerald-950/70 text-white border border-emerald-500/40 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-300 w-16"
              >
                {['A', 'B', 'C'].map(s => (
                  <option key={s} value={s} className="bg-slate-900 text-white">Sec {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block mb-1">
              Subject Observed:
            </label>
            <select
              value={observedSubject}
              onChange={(e) => setObservedSubject(e.target.value)}
              className="bg-emerald-950/70 text-white border border-emerald-500/40 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-300 w-full"
            >
              <option value="Foundational Literacy (Telugu)" className="bg-slate-900 text-white">Foundational Literacy (Telugu)</option>
              <option value="Foundational Literacy (English)" className="bg-slate-900 text-white">Foundational Literacy (English)</option>
              <option value="Foundational Numeracy (Mathematics)" className="bg-slate-900 text-white">Foundational Numeracy (Mathematics)</option>
              <option value="Environmental Studies (EVS)" className="bg-slate-900 text-white">Environmental Studies (EVS)</option>
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-[10px] uppercase tracking-wider text-emerald-200 font-bold block mb-1">
              Teacher Observed:
            </label>
            <input
              type="text"
              value={observedTeacherName}
              onChange={(e) => setObservedTeacherName(e.target.value)}
              placeholder="e.g. Sri B. Ramesh Kumar (SGT)"
              className="bg-emerald-950/70 text-white border border-emerald-500/40 rounded-lg p-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-emerald-300 w-full placeholder:text-emerald-300/50"
            />
          </div>
        </div>
      </div>

      {/* Main Checklist Body */}
      <div className="p-4 sm:p-5 space-y-5">
        
        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-100 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-700">Indicators:</span>
            <span className="text-slate-500">
              <strong className="text-emerald-700">{answeredCount}</strong> of {totalIndicators} answered
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-emerald-700 font-semibold">{yesCount} Yes</span>
            <span className="text-amber-700 font-semibold">{partiallyCount} Partially</span>
            <span className="text-rose-700 font-semibold">{noCount} No</span>
            {naCount > 0 && <span className="text-slate-500 font-semibold">{naCount} N/A</span>}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1 hidden sm:inline">Quick Fill:</span>
            <button
              type="button"
              onClick={() => handleSetAll('YES')}
              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px] border border-emerald-200 transition-colors cursor-pointer"
            >
              All Yes
            </button>
            <button
              type="button"
              onClick={() => handleSetAll('PARTIALLY')}
              className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded font-semibold text-[11px] border border-amber-200 transition-colors cursor-pointer"
            >
              All Partially
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded font-semibold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
              title="Export as CSV"
            >
              <Download className="w-3 h-3" />
              <span>Export</span>
            </button>
          </div>
        </div>

        {/* Exact Table Layout Matching Uploaded Images */}
        <div className="overflow-x-auto border border-slate-200 rounded-xl shadow-xs">
          <table className="w-full text-left border-collapse text-xs">
            {/* Header matching image format */}
            <thead>
              <tr className="bg-[#eaf3eb] text-slate-800 border-b border-emerald-200/80 font-bold">
                <th className="py-3 px-3 w-14 text-center">S. No.</th>
                <th className="py-3 px-4">Observation indicator</th>
                <th className="py-3 px-3 w-20 text-center font-bold text-emerald-900">Yes</th>
                <th className="py-3 px-3 w-20 text-center font-bold text-amber-900">Partially</th>
                <th className="py-3 px-3 w-20 text-center font-bold text-rose-900">No</th>
                <th className="py-3 px-3 w-20 text-center font-bold text-slate-700">N/A</th>
              </tr>
            </thead>

            <tbody>
              {OBSERVATION_SECTIONS.map((sec) => (
                <React.Fragment key={sec.key}>
                  {/* Category Title Row matching image format */}
                  <tr className="bg-[#f2f8f3] border-t border-b border-emerald-200/60">
                    <td colSpan={6} className="py-2.5 px-4 font-bold text-emerald-950 text-xs tracking-wide">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                        <span>{sec.title}</span>
                      </div>
                    </td>
                  </tr>

                  {/* Indicators under this category */}
                  {sec.indicators.map((ind) => {
                    const currentRating = ratings[ind.id];
                    return (
                      <tr 
                        key={ind.id} 
                        className={`border-b border-slate-100 hover:bg-slate-50/80 transition-colors ${
                          !currentRating ? 'bg-amber-50/20' : ''
                        }`}
                      >
                        <td className="py-3 px-3 text-center font-bold text-slate-600 align-middle">
                          {ind.id}
                        </td>
                        <td className="py-3 px-4 text-slate-800 font-medium leading-relaxed align-middle">
                          <span>{ind.indicatorText}</span>
                        </td>

                        {/* Yes Radio Option */}
                        <td className="py-3 px-3 text-center align-middle">
                          <label className="flex items-center justify-center cursor-pointer group p-1">
                            <input
                              type="radio"
                              name={`indicator_${ind.id}`}
                              checked={currentRating === 'YES'}
                              onChange={() => handleRatingChange(ind.id, 'YES')}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              currentRating === 'YES'
                                ? 'border-emerald-600 bg-emerald-600 text-white shadow-xs scale-105'
                                : 'border-slate-300 bg-white hover:border-emerald-400 group-hover:bg-emerald-50/50'
                            }`}>
                              {currentRating === 'YES' && <Check className="w-4 h-4 stroke-[3]" />}
                            </div>
                          </label>
                        </td>

                        {/* Partially Radio Option */}
                        <td className="py-3 px-3 text-center align-middle">
                          <label className="flex items-center justify-center cursor-pointer group p-1">
                            <input
                              type="radio"
                              name={`indicator_${ind.id}`}
                              checked={currentRating === 'PARTIALLY'}
                              onChange={() => handleRatingChange(ind.id, 'PARTIALLY')}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              currentRating === 'PARTIALLY'
                                ? 'border-amber-500 bg-amber-500 text-white shadow-xs scale-105'
                                : 'border-slate-300 bg-white hover:border-amber-400 group-hover:bg-amber-50/50'
                            }`}>
                              {currentRating === 'PARTIALLY' && <span className="w-2.5 h-2.5 rounded-full bg-white"></span>}
                            </div>
                          </label>
                        </td>

                        {/* No Radio Option */}
                        <td className="py-3 px-3 text-center align-middle">
                          <label className="flex items-center justify-center cursor-pointer group p-1">
                            <input
                              type="radio"
                              name={`indicator_${ind.id}`}
                              checked={currentRating === 'NO'}
                              onChange={() => handleRatingChange(ind.id, 'NO')}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              currentRating === 'NO'
                                ? 'border-rose-600 bg-rose-600 text-white shadow-xs scale-105'
                                : 'border-slate-300 bg-white hover:border-rose-400 group-hover:bg-rose-50/50'
                            }`}>
                              {currentRating === 'NO' && <X className="w-4 h-4 stroke-[3]" />}
                            </div>
                          </label>
                        </td>

                        {/* N/A Radio Option */}
                        <td className="py-3 px-3 text-center align-middle">
                          <label className="flex items-center justify-center cursor-pointer group p-1">
                            <input
                              type="radio"
                              name={`indicator_${ind.id}`}
                              checked={currentRating === 'NA'}
                              onChange={() => handleRatingChange(ind.id, 'NA')}
                              className="sr-only"
                            />
                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                              currentRating === 'NA'
                                ? 'border-slate-600 bg-slate-600 text-white shadow-xs scale-105'
                                : 'border-slate-300 bg-white hover:border-slate-400 group-hover:bg-slate-100'
                            }`}>
                              {currentRating === 'NA' && <span className="text-[10px] font-bold">N/A</span>}
                            </div>
                          </label>
                        </td>
                      </tr>
                    );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Remarks Section matching image format */}
        <div className="space-y-1.5 pt-2">
          <label className="font-bold text-xs text-slate-800 block">
            Key observation / remarks
          </label>
          <textarea
            rows={3}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Record important observations, if any"
            className="w-full p-3 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 placeholder:text-slate-400 shadow-2xs"
          />
        </div>

        {/* Save & Continue Toolbar */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-slate-100">
          <div>
            {saveSuccessNotification && (
              <div className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Classroom Observation Checklist Saved to Visit Record!</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 self-end">
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Save Checklist</span>
            </button>

            {onContinueToAssessment && (
              <button
                type="button"
                onClick={() => {
                  handleSave();
                  onContinueToAssessment();
                }}
                className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Save & Proceed to Student Assessment</span>
                <span className="text-emerald-200">→</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
