import React, { useState } from 'react';
import { 
  Settings, 
  Save, 
  RotateCcw, 
  Calendar, 
  ShieldAlert, 
  Check, 
  Sliders, 
  Target, 
  Users,
  Info,
  UserCheck
} from 'lucide-react';
import { SystemConfig } from '../types/fln';
import { MOCK_USERS } from '../data/mockData';
import { APGovtLogo } from './APGovtLogo';

interface AdminConfigViewProps {
  config: SystemConfig;
  onUpdateConfig: (newConfig: SystemConfig) => void;
  onResetMonth: (newMonth: string) => void;
}

export const AdminConfigView: React.FC<AdminConfigViewProps> = ({
  config,
  onUpdateConfig,
  onResetMonth,
}) => {
  const [localConfig, setLocalConfig] = useState<SystemConfig>({ ...config });
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const [commissionerName, setCommissionerName] = useState<string>(
    MOCK_USERS['STATE_LEADERSHIP'].name
  );
  const [commissionerDesig, setCommissionerDesig] = useState<string>(
    MOCK_USERS['STATE_LEADERSHIP'].designation
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Update MOCK_USERS in memory
    MOCK_USERS['STATE_LEADERSHIP'].name = commissionerName;
    MOCK_USERS['STATE_LEADERSHIP'].designation = commissionerDesig;
    onUpdateConfig(localConfig);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleSimulateAugustReset = () => {
    if (confirm('Simulate August 1 New Month Reset?\n\nThis will reset monthly student eligibility for August 2026 across all schools while permanently preserving all July historical assessments.')) {
      onResetMonth('2026-08');
      alert('August 2026 Cycle Activated! All students are now eligible for August monitoring. Historical July assessment logs preserved in database.');
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header with Official AP Logo */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <APGovtLogo size="lg" />
          <div>
            <div className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-emerald-700" />
              <h1 className="text-lg font-bold text-slate-900">
                Department Administration & Rule Configuration Module
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Section 3 & Section 57 Mandate: Dynamic officer quotas, executive incumbent profiles, priority weights, and cycle schedules.
            </p>
          </div>
        </div>

        {saveSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4" />
            <span>Configurations Saved Successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 0: Executive Leadership Incumbent Configuration */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <UserCheck className="w-4 h-4 text-emerald-700" />
              <span>0. Executive Leadership & Department Incumbent Profiles</span>
            </div>
            <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
              Active Official
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Commissioner of School Education (Incumbent Name)
              </label>
              <input
                type="text"
                value={commissionerName}
                onChange={(e) => setCommissionerName(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold text-slate-900"
                placeholder="e.g. Smt. Thameem Ansariya A, IAS"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Currently configured: <strong className="text-slate-800">Smt. Thameem Ansariya A, IAS</strong> (Commissioner of School Education, AP)
              </p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Official Designation / Title
              </label>
              <input
                type="text"
                value={commissionerDesig}
                onChange={(e) => setCommissionerDesig(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
                placeholder="Commissioner of School Education, AP"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Appears on State Dashboard, reports, and digital tour diaries.
              </p>
            </div>
          </div>

          {/* Official A.P. Logo Selector / Uploader */}
          <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center gap-3">
              <APGovtLogo size="lg" />
              <div>
                <div className="text-xs font-bold text-slate-900">
                  Official A.P. Government State Logo
                </div>
                <div className="text-[11px] text-slate-500">
                  Loads your uploaded logo (`/ap-logo.png` / `/logo.png`). You can also select a new logo file directly:
                </div>
              </div>
            </div>

            <label className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-1.5">
              <span>Select A.P. Logo File</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                      const dataUrl = ev.target?.result as string;
                      if (dataUrl) {
                        localStorage.setItem('ap_custom_logo_data', dataUrl);
                        window.location.reload();
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </label>
          </div>
        </div>
        
        {/* Section 1: Monthly Field Visit Targets */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Target className="w-4 h-4 text-emerald-700" />
            <span>1. Officer Designation Monthly Visit Days Quota</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">DEO Target (Days/Mo)</label>
              <input
                type="number"
                min={5}
                max={25}
                value={localConfig.targets.DEO}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  targets: { ...localConfig.targets, DEO: parseInt(e.target.value, 10) || 10 },
                })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Deputy DEO (Days/Mo)</label>
              <input
                type="number"
                min={10}
                max={25}
                value={localConfig.targets.DY_DEO}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  targets: { ...localConfig.targets, DY_DEO: parseInt(e.target.value, 10) || 15 },
                })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">MEO Target (Days/Mo)</label>
              <input
                type="number"
                min={10}
                max={28}
                value={localConfig.targets.MEO}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  targets: { ...localConfig.targets, MEO: parseInt(e.target.value, 10) || 20 },
                })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">CRP Target (Days/Mo)</label>
              <input
                type="number"
                min={15}
                max={30}
                value={localConfig.targets.CRP}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  targets: { ...localConfig.targets, CRP: parseInt(e.target.value, 10) || 30 },
                })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Student Sampling Rules */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Users className="w-4 h-4 text-blue-700" />
            <span>2. Classroom Student Assessment Quota</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Minimum Students to Assess per Classroom Visit
              </label>
              <input
                type="number"
                min={3}
                max={15}
                value={localConfig.minimumStudentsPerClass}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  minimumStudentsPerClass: parseInt(e.target.value, 10) || 5,
                })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums"
              />
              <p className="text-[11px] text-slate-400 mt-1">Default: 5 students per visit</p>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Maximum Permissible Students per Classroom Visit
              </label>
              <input
                type="number"
                min={5}
                max={30}
                value={localConfig.maximumStudentsPerClass}
                onChange={(e) => setLocalConfig({
                  ...localConfig,
                  maximumStudentsPerClass: parseInt(e.target.value, 10) || 10,
                })}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs font-bold tabular-nums"
              />
              <p className="text-[11px] text-slate-400 mt-1">Prevents officer test fatigue</p>
            </div>
          </div>
        </div>

        {/* Section 3: School Visit Prioritization Configuration (Class 1–5 Enrolment) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
            <Sliders className="w-4 h-4 text-indigo-700" />
            <span>3. School Visit Prioritization Policy Configuration (Class 1–5 Enrolment)</span>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            School visit priority is sequenced based on <strong>Class 1–5 Student Enrolment</strong> within each officer cadre's jurisdiction: Cluster (CRP), Mandal (MEO), and District (DEO / Dy. DEO). Configure primary enrolment tier thresholds below.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="font-semibold text-slate-800 block mb-1">Critical Tier Threshold (Students)</label>
              <input
                type="number"
                defaultValue={140}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold tabular-nums bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: &ge; 140 enrolled (Top priority for immediate supervisory dispatch)</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="font-semibold text-slate-800 block mb-1">High Tier Threshold (Students)</label>
              <input
                type="number"
                defaultValue={100}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold tabular-nums bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 100–139 enrolled (High priority secondary dispatch)</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
              <label className="font-semibold text-slate-800 block mb-1">Medium Tier Threshold (Students)</label>
              <input
                type="number"
                defaultValue={60}
                className="w-full p-2 border border-slate-300 rounded-lg font-bold tabular-nums bg-white"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">Default: 60–99 enrolled (Routine inspection cycle)</span>
            </div>
          </div>
        </div>

        {/* Section 4: Monthly Reset & Cycle Simulator */}
        <div className="bg-amber-50/70 border border-amber-200 p-5 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-950">
            <Calendar className="w-4 h-4 text-amber-700" />
            <span>4. Monthly Assessment Reset Cycle Simulator</span>
          </div>

          <p className="text-xs text-amber-900 leading-relaxed">
            Section 19 Mandate: At the start of every new month, all currently enrolled students become eligible again for assessment. However, historical assessment data must <strong>NEVER</strong> be deleted.
          </p>

          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={handleSimulateAugustReset}
              className="px-4 py-2 bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs rounded-lg shadow-xs flex items-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Simulate August 1 New Month Reset</span>
            </button>
            <span className="text-[11px] text-amber-800">
              Active Cycle: <strong>{config.currentMonthYear}</strong>
            </span>
          </div>
        </div>

        {/* Submit Form Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-colors cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save & Propagate System Rules</span>
          </button>
        </div>

      </form>
    </div>
  );
};
