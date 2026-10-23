import React, { useState } from 'react';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Search, 
  Building2, 
  User, 
  Calendar,
  Filter,
  Check
} from 'lucide-react';
import { ActionItem, ActionStatus } from '../types/fln';

interface ActionTrackerViewProps {
  actionItems: ActionItem[];
  onUpdateStatus: (id: string, status: ActionStatus, remarks?: string) => void;
  onAddAction: (item: ActionItem) => void;
}

export const ActionTrackerView: React.FC<ActionTrackerViewProps> = ({
  actionItems,
  onUpdateStatus,
  onAddAction,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New action state
  const [newTitle, setNewTitle] = useState('');
  const [newSchool, setNewSchool] = useState('MPPS Kaza Main');
  const [newClass, setNewClass] = useState('3');
  const [newCompetency, setNewCompetency] = useState('Addition with Regrouping');
  const [newAssignedTo, setNewAssignedTo] = useState('Sri B. Ramesh Kumar (SGT)');
  const [newDesc, setNewDesc] = useState('');

  const filtered = actionItems.filter(item => {
    const matchesStatus = filterStatus === 'ALL' || item.status === filterStatus;
    const matchesSearch = item.issueTitle.toLowerCase().includes(search.toLowerCase()) ||
                          item.schoolName.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const item: ActionItem = {
      id: `ACT_${Date.now()}`,
      schoolId: 'SCH_001',
      schoolName: newSchool,
      mandalName: 'Mangalagiri',
      classNumber: parseInt(newClass, 10),
      issueTitle: newTitle,
      description: newDesc || 'Remedial instruction requested following external FLN assessment.',
      competencyArea: newCompetency,
      assignedTo: newAssignedTo,
      targetDate: '2026-07-30',
      status: 'OPEN',
      createdDate: new Date().toISOString().split('T')[0],
      createdBy: 'Sri S. Venkat (CRP)',
    };

    onAddAction(item);
    setShowAddModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h1 className="text-lg font-bold text-slate-900">
              Follow-up & Academic Remediation Action Tracker
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Section 29 Mandate: Continuous monitoring loop converting diagnostic learning deficits into trackable remedial milestones.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Log New Remedial Action</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-600">Status:</span>
          <div className="flex p-1 bg-slate-100 rounded-lg">
            {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1 rounded text-xs font-semibold transition-all ${
                  filterStatus === st ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <input
          type="text"
          placeholder="Search school name or issue title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="text-xs px-3 py-1.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 w-full sm:w-64"
        />
      </div>

      {/* Action Items List */}
      <div className="space-y-3">
        {filtered.map((item) => {
          const isOpen = item.status === 'OPEN';
          const isInProgress = item.status === 'IN_PROGRESS';
          const isResolved = item.status === 'RESOLVED';

          return (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    isOpen ? 'bg-amber-100 text-amber-800' : isInProgress ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                  }`}>
                    {item.status.replace('_', ' ')}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">{item.issueTitle}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Target Date: <strong className="text-slate-800">{item.targetDate}</strong></span>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {item.description}
              </p>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1 border-t border-slate-100">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <strong>{item.schoolName}</strong> (Class {item.classNumber || 'Primary'})
                  </span>
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    Assigned: <strong className="text-slate-700">{item.assignedTo}</strong>
                  </span>
                  <span>
                    Logged by: <span className="text-slate-700">{item.createdBy}</span>
                  </span>
                </div>

                {/* State Toggles */}
                <div className="flex items-center gap-2">
                  {isOpen && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'IN_PROGRESS')}
                      className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded text-xs font-semibold"
                    >
                      Mark In Progress
                    </button>
                  )}
                  {!isResolved && (
                    <button
                      onClick={() => onUpdateStatus(item.id, 'RESOLVED', 'Verified remedial drills completed.')}
                      className="px-2.5 py-1 bg-emerald-700 text-white hover:bg-emerald-800 rounded text-xs font-semibold flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Verify & Resolve</span>
                    </button>
                  )}
                  {isResolved && (
                    <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Remediation Closed</span>
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-sm font-bold text-slate-900">
              Create New Remedial Action Item
            </h3>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Issue Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Class 2 Telugu Reading Remediation"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">School</label>
                  <input
                    type="text"
                    value={newSchool}
                    onChange={(e) => setNewSchool(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Class</label>
                  <select
                    value={newClass}
                    onChange={(e) => setNewClass(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                  >
                    <option value="1">Class 1</option>
                    <option value="2">Class 2</option>
                    <option value="3">Class 3</option>
                    <option value="4">Class 4</option>
                    <option value="5">Class 5</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Competency Area</label>
                <input
                  type="text"
                  value={newCompetency}
                  onChange={(e) => setNewCompetency(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Assigned Person</label>
                <input
                  type="text"
                  value={newAssignedTo}
                  onChange={(e) => setNewAssignedTo(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Specific remedial activity and TLM required..."
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-emerald-700 text-white rounded-lg text-xs font-semibold hover:bg-emerald-800"
                >
                  Create Action Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
