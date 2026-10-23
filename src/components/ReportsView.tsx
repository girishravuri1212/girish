import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  Download, 
  Filter, 
  Search, 
  CheckCircle, 
  BookOpen, 
  Calculator,
  Calendar,
  Languages
} from 'lucide-react';
import { SystemConfig, MonthlyAssessmentStatus, AssessmentRecord } from '../types/fln';
import { DISTRICTS_DATA, SCHOOLS_DATA, STUDENTS_CLASS_3A } from '../data/mockData';

interface ReportsViewProps {
  config: SystemConfig;
  monthlyStatusList: MonthlyAssessmentStatus[];
  assessmentRecords: AssessmentRecord[];
}

export const ReportsView: React.FC<ReportsViewProps> = ({
  config,
  monthlyStatusList,
  assessmentRecords,
}) => {
  const [activeReport, setActiveReport] = useState<string>('COVERAGE');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('ALL');

  // Trigger CSV Download
  const downloadCSV = (filename: string, headers: string[], rows: (string | number)[][]) => {
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${config.currentMonthYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-700" />
            <h1 className="text-lg font-bold text-slate-900">
              Department Reports & Analytical Data Exports
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 38 Mandate: Downloadable official ledgers for state reviews, legislative committees, and field audits.
          </p>
        </div>

        {/* Report Selector */}
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: 'COVERAGE', label: '1. Monthly Student Coverage' },
            { id: 'OFFICERS', label: '2. Officer Target vs Achievement' },
            { id: 'PRIORITY', label: '3. School Enrolment Priority Roster' },
            { id: 'COMPETENCY', label: '4. NIPUN Competency Gaps' },
          ].map(r => (
            <button
              key={r.id}
              onClick={() => setActiveReport(r.id)}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeReport === r.id
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* REPORT 1: MONTHLY STUDENT COVERAGE ROSTER */}
      {activeReport === 'COVERAGE' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Class 3-A Monthly Student Coverage & Diagnostic Log ({config.currentMonthYear})
              </h2>
              <p className="text-xs text-slate-500">
                School: MPPS Kaza Main (UDISE: 28172000501) • Enrolled: 30 Students
              </p>
            </div>

            <button
              onClick={() => {
                const headers = ['Roll No', 'PEN', 'Student Name', 'Gender', 'Category', 'Monthly Status', 'Assessment Count', 'Last Assessed Date', 'FLN Score %', 'Performance Band'];
                const rows = STUDENTS_CLASS_3A.map(s => {
                  const st = monthlyStatusList.find(m => m.studentId === s.id);
                  return [
                    s.rollNumber,
                    s.pen,
                    s.name,
                    s.gender,
                    s.category,
                    st?.isAssessedThisMonth ? 'ASSESSED' : 'NOT ASSESSED',
                    st?.assessmentCount || 0,
                    st?.lastAssessedDate || 'N/A',
                    st?.flnScore || 'N/A',
                    st?.performanceBand || 'N/A',
                  ];
                });
                downloadCSV('AP_FLN_Class3A_Monthly_Student_Coverage', headers, rows);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV File</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Roll</th>
                  <th className="px-3 py-3">PEN (AP Child ID)</th>
                  <th className="px-4 py-3">Student Name</th>
                  <th className="px-2 py-3 text-center">Gender</th>
                  <th className="px-3 py-3 text-center">July Status</th>
                  <th className="px-3 py-3 text-right">Assessment Count</th>
                  <th className="px-3 py-3">Last Assessed Date</th>
                  <th className="px-3 py-3 text-right">FLN Score</th>
                  <th className="px-3 py-3">Performance Band</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {STUDENTS_CLASS_3A.map((stu) => {
                  const status = monthlyStatusList.find(m => m.studentId === stu.id);
                  const isAssessed = status?.isAssessedThisMonth;

                  return (
                    <tr key={stu.id} className="hover:bg-slate-50">
                      <td className="px-4 py-2.5 font-bold text-slate-800 tabular-nums">{stu.rollNumber}</td>
                      <td className="px-3 py-2.5 font-mono text-slate-500 text-[11px]">{stu.pen}</td>
                      <td className="px-4 py-2.5 font-semibold text-slate-900">
                        {stu.name} <span className="text-[10px] text-slate-400 font-normal">({stu.nameTelugu})</span>
                      </td>
                      <td className="px-2 py-2.5 text-center text-slate-600">{stu.gender}</td>
                      <td className="px-3 py-2.5 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isAssessed ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isAssessed ? 'ASSESSED' : 'NOT ASSESSED'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono font-bold text-slate-800">
                        {status?.assessmentCount || 0}
                      </td>
                      <td className="px-3 py-2.5 text-slate-600">
                        {status?.lastAssessedDate || '—'}
                      </td>
                      <td className="px-3 py-2.5 text-right font-bold text-slate-900 tabular-nums">
                        {status?.flnScore ? `${status.flnScore}%` : '—'}
                      </td>
                      <td className="px-3 py-2.5">
                        {status?.performanceBand ? (
                          <span className={`text-[10px] font-bold ${
                            status.performanceBand === 'PROFICIENT' ? 'text-emerald-700' : 'text-amber-700'
                          }`}>
                            {status.performanceBand}
                          </span>
                        ) : '—'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 2: OFFICER TARGET VS ACHIEVEMENT */}
      {activeReport === 'OFFICERS' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Field Officer Monthly Visit & Assessment Targets vs Achievement
              </h2>
              <p className="text-xs text-slate-500">
                Formula: Visit Achievement % = Actual / Target × 100 • Visit Gap = Target - Actual
              </p>
            </div>

            <button
              onClick={() => {
                const headers = ['Officer Name', 'Designation', 'Jurisdiction', 'Planned Days', 'Actual Days', 'Visit Achievement %', 'Visit Gap', 'Target Students', 'Actual Students', 'Coverage Gap'];
                const rows = [
                  ['Sri M. Venkata Krishna', 'DEO', 'Guntur District', 10, 8, '80%', 2, 80, 72, 8],
                  ['Smt. P. Annapurna', 'Dy. DEO', 'Guntur Division', 15, 12, '80%', 3, 120, 105, 15],
                  ['Sri P. Lakshmi Narayana', 'MEO', 'Mangalagiri Mandal', 20, 17, '85%', 3, 160, 142, 18],
                  ['Sri S. Venkata Rao', 'CRP', 'Kaza Cluster', 30, 18, '60%', 12, 150, 90, 60],
                ];
                downloadCSV('AP_FLN_Officer_Targets_Achievement', headers, rows);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV File</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Officer Name</th>
                  <th className="px-3 py-3">Designation</th>
                  <th className="px-3 py-3 text-right">Planned Days</th>
                  <th className="px-3 py-3 text-right">Actual Days</th>
                  <th className="px-3 py-3 text-right">Achievement %</th>
                  <th className="px-3 py-3 text-right">Visit Gap</th>
                  <th className="px-3 py-3 text-right">Target Students</th>
                  <th className="px-3 py-3 text-right">Assessed Students</th>
                  <th className="px-3 py-3 text-right">Student Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Sri M. Venkata Krishna', desig: 'DEO, Guntur', plan: 10, act: 8, tStu: 80, aStu: 72 },
                  { name: 'Smt. P. Annapurna', desig: 'Dy. DEO, Guntur Div', plan: 15, act: 12, tStu: 120, aStu: 105 },
                  { name: 'Sri P. Lakshmi Narayana', desig: 'MEO, Mangalagiri', plan: 20, act: 17, tStu: 160, aStu: 142 },
                  { name: 'Sri S. Venkata Rao', desig: 'CRP, Kaza Cluster', plan: 30, act: 18, tStu: 150, aStu: 90 },
                ].map((row, i) => {
                  const ach = Math.round((row.act / row.plan) * 100);
                  const vGap = row.plan - row.act;
                  const sGap = row.tStu - row.aStu;

                  return (
                    <tr key={i} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{row.name}</td>
                      <td className="px-3 py-3 text-slate-600">{row.desig}</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-600">{row.plan}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">{row.act}</td>
                      <td className="px-3 py-3 text-right font-bold tabular-nums">
                        <span className={ach >= 80 ? 'text-emerald-700' : 'text-amber-700'}>{ach}%</span>
                      </td>
                      <td className="px-3 py-3 text-right font-mono text-amber-700 font-bold">{vGap}</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-600">{row.tStu}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-blue-700">{row.aStu}</td>
                      <td className="px-3 py-3 text-right font-mono text-slate-500 font-semibold">{sGap}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 3: SCHOOL PRIORITY RISK REGISTRY */}
      {activeReport === 'PRIORITY' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                School Visit Enrolment Priority Registry (Classes 1–5 Hierarchy)
              </h2>
              <p className="text-xs text-slate-500">
                School visit sequencing prioritized by Class 1–5 enrolment within officer administrative jurisdiction.
              </p>
            </div>

            <button
              onClick={() => {
                const headers = ['School Name', 'UDISE', 'Class 1-5 Enrolment', 'Priority Rank', 'Tier', 'Priority Basis', 'FLN Score %', 'Monthly Coverage %', 'Visits This Month'];
                const sorted = [...SCHOOLS_DATA].sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0));
                const rows = sorted.map((s, idx) => [
                  s.name,
                  s.udiseCode,
                  s.totalStudents,
                  idx + 1,
                  s.totalStudents >= 140 ? 'CRITICAL' : s.totalStudents >= 100 ? 'HIGH' : s.totalStudents >= 60 ? 'MEDIUM' : 'NORMAL',
                  s.priorityReason || `Class 1–5 enrolment priority (${s.totalStudents} students)`,
                  s.lastFLNScore,
                  s.monthlyCoveragePercent,
                  s.visitsThisMonth,
                ]);
                downloadCSV('AP_FLN_School_Enrolment_Visit_Priority_Registry', headers, rows);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV File</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">School Name</th>
                  <th className="px-3 py-3">UDISE Code</th>
                  <th className="px-3 py-3 text-right">Class 1–5 Enrolment</th>
                  <th className="px-3 py-3 text-center">Visit Priority Rank</th>
                  <th className="px-3 py-3 text-center">Tier</th>
                  <th className="px-4 py-3">Priority Basis</th>
                  <th className="px-3 py-3 text-right">FLN Score</th>
                  <th className="px-3 py-3 text-right">Coverage %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[...SCHOOLS_DATA].sort((a, b) => (b.totalStudents || 0) - (a.totalStudents || 0)).map((sch, idx) => {
                  const isHighDensity = sch.totalStudents >= 140;
                  const isMediumDensity = sch.totalStudents >= 100;
                  return (
                    <tr key={sch.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-bold text-slate-900">{sch.name}</td>
                      <td className="px-3 py-3 font-mono text-slate-500 text-[11px]">{sch.udiseCode}</td>
                      <td className="px-3 py-3 text-right font-mono font-bold text-indigo-700">{sch.totalStudents} Students</td>
                      <td className="px-3 py-3 text-center">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">
                          #{idx + 1}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          isHighDensity ? 'bg-indigo-100 text-indigo-800' : isMediumDensity ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {isHighDensity ? 'CRITICAL' : isMediumDensity ? 'HIGH' : 'NORMAL'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{sch.priorityReason || `Class 1–5 enrolment priority (${sch.totalStudents} students)`}</td>
                      <td className="px-3 py-3 text-right font-semibold text-slate-900">{sch.lastFLNScore}%</td>
                      <td className="px-3 py-3 text-right font-bold text-blue-700">{sch.monthlyCoveragePercent}%</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* REPORT 4: NIPUN COMPETENCY GAPS */}
      {activeReport === 'COMPETENCY' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 space-y-4">
          <div className="flex justify-between items-center border-b border-slate-200 pb-3">
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                NIPUN Lakshya Sub-Competency Diagnostic Mastery Matrix
              </h2>
              <p className="text-xs text-slate-500">
                Diagnostic percentage breakdown across Class 1 to 5 foundational standards
              </p>
            </div>

            <button
              onClick={() => alert('Competency matrix export triggered.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Telugu Literacy Track */}
            <div className="bg-emerald-50/50 p-4 rounded-xl border border-emerald-100 space-y-2">
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-emerald-700" />
                <span>Telugu Literacy</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between"><span>వర్ణమాల & అక్షరాల గుర్తింపు:</span> <strong>86.4%</strong></div>
                <div className="flex justify-between"><span>సరళ పదాల పఠన వేగం (35 WPM):</span> <strong>74.2%</strong></div>
                <div className="flex justify-between"><span>కథా భాగం వాక్యార్థ గ్రహణం:</span> <strong>62.5%</strong></div>
                <div className="flex justify-between"><span>ఊహాత్మక భావ వ్యక్తీకరణ:</span> <strong>48.0%</strong></div>
              </div>
            </div>

            {/* English Literacy Track */}
            <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 space-y-2">
              <div className="font-bold text-indigo-950 flex items-center gap-1.5">
                <Languages className="w-4 h-4 text-indigo-700" />
                <span>English Literacy</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between"><span>Phonics & Initial Sounds:</span> <strong>82.0%</strong></div>
                <div className="flex justify-between"><span>Sight Words & CVC Decoding:</span> <strong>68.5%</strong></div>
                <div className="flex justify-between"><span>Sentence Fluency & Prepositions:</span> <strong>54.2%</strong></div>
                <div className="flex justify-between text-rose-700 font-bold"><span>Short Passage Reading & Meaning:</span> <strong>46.8%</strong></div>
              </div>
            </div>

            {/* Foundational Numeracy Track */}
            <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-2">
              <div className="font-bold text-blue-950 flex items-center gap-1.5">
                <Calculator className="w-4 h-4 text-blue-700" />
                <span>Foundational Numeracy</span>
              </div>
              <div className="space-y-1.5 text-slate-700">
                <div className="flex justify-between"><span>Number sense (up to 999):</span> <strong>78.5%</strong></div>
                <div className="flex justify-between"><span>Addition without carryover:</span> <strong>74.0%</strong></div>
                <div className="flex justify-between text-rose-700 font-bold"><span>Addition with regrouping (Carry):</span> <span>48.2%</span></div>
                <div className="flex justify-between"><span>Multiplication & word problems:</span> <strong>54.0%</strong></div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
