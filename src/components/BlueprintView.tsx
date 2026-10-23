import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy, 
  Check, 
  ChevronRight, 
  Layers, 
  FileText,
  Printer
} from 'lucide-react';
import { BLUEPRINT_SECTIONS, BlueprintSection } from '../data/blueprintData';

export const BlueprintView: React.FC = () => {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('sec_a');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const categories = ['ALL', 'Strategic', 'Architecture', 'Algorithms', 'Specifications', 'Governance'];

  const filteredSections = BLUEPRINT_SECTIONS.filter(sec => {
    const matchesCategory = selectedCategory === 'ALL' || sec.category === selectedCategory;
    const matchesSearch = sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sec.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sec.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const activeSection = BLUEPRINT_SECTIONS.find(s => s.id === selectedSectionId) || BLUEPRINT_SECTIONS[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeSection.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Blueprint Header */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-700" />
            <h1 className="text-lg font-bold text-slate-900">
              Complete PRD, SRS & Architectural Reference Blueprint (Sections A to AE)
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Authoritative software specification & engineering manual for Andhra Pradesh School Education Department FLN Monitoring System (2026–2029).
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors border border-slate-200 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied Markdown!' : 'Copy Active Section'}</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Blueprint</span>
          </button>
        </div>
      </div>

      {/* Main Layout: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Table of Contents & Navigation */}
        <div className="lg:col-span-1 bg-white rounded-xl border border-slate-200 shadow-xs p-4 space-y-3">
          <div className="space-y-2">
            <input
              type="text"
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs p-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-1">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`text-[10px] px-2 py-0.5 rounded font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-emerald-700 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pt-2 border-t border-slate-100">
            Table of Contents ({filteredSections.length} Sections)
          </div>

          <div className="space-y-1 max-h-[580px] overflow-y-auto pr-1">
            {filteredSections.map(sec => {
              const isActive = sec.id === activeSection.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`w-full text-left p-2 rounded-lg text-xs transition-all flex items-center justify-between ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-950 font-bold border border-emerald-300'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">
                    <span className="font-mono text-emerald-700 font-bold mr-1.5">{sec.code}.</span>
                    {sec.title}
                  </span>
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-emerald-700' : 'text-slate-300'}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Markdown Document Viewer */}
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-xs p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-slate-200 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 uppercase tracking-wide">
                  Section {activeSection.code}
                </span>
                <span className="text-[11px] text-slate-500 font-medium">
                  Category: {activeSection.category}
                </span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 mt-1">
                {activeSection.title}
              </h2>
            </div>

            <div className="text-right text-xs text-slate-400">
              NIPUN AP 2026–2029 Reference
            </div>
          </div>

          {/* Section Markdown Rendering */}
          <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-4">
            {activeSection.content.split('\n\n').map((paragraph, idx) => {
              if (paragraph.startsWith('### ')) {
                return (
                  <h3 key={idx} className="text-base font-bold text-slate-900 pt-2 border-b border-slate-100 pb-1">
                    {paragraph.replace('### ', '')}
                  </h3>
                );
              }
              if (paragraph.startsWith('#### ')) {
                return (
                  <h4 key={idx} className="text-sm font-bold text-slate-800 pt-1">
                    {paragraph.replace('#### ', '')}
                  </h4>
                );
              }
              if (paragraph.startsWith('```')) {
                const codeContent = paragraph.replace(/```[a-z]*\n?/g, '');
                return (
                  <pre key={idx} className="bg-slate-900 text-slate-100 p-4 rounded-xl overflow-x-auto text-[11px] font-mono leading-normal border border-slate-800">
                    <code>{codeContent}</code>
                  </pre>
                );
              }
              if (paragraph.startsWith('|')) {
                // Render table
                const rows = paragraph.split('\n').filter(r => r.trim());
                if (rows.length > 2) {
                  const headers = rows[0].split('|').filter(c => c.trim()).map(c => c.trim());
                  const dataRows = rows.slice(2).map(r => r.split('|').filter(c => c.trim()).map(c => c.trim()));

                  return (
                    <div key={idx} className="overflow-x-auto my-3">
                      <table className="w-full text-left text-xs border border-slate-200 rounded-lg">
                        <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                          <tr>
                            {headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-3 py-2 border-r border-slate-200 last:border-r-0">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {dataRows.map((r, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
                              {r.map((c, cIdx) => (
                                <td key={cIdx} className="px-3 py-2 border-r border-slate-200 last:border-r-0 text-slate-700">{c}</td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
              }

              return (
                <p key={idx} className="text-slate-700 leading-relaxed text-xs">
                  {paragraph}
                </p>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
