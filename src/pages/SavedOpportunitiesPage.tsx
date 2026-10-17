import React, { useState } from 'react';
import { 
  Bookmark, 
  Trash2, 
  ExternalLink, 
  Calendar, 
  CheckSquare, 
  Square, 
  Edit2, 
  Save, 
  ShieldCheck, 
  Clock, 
  MapPin,
  CheckCircle2,
  FolderOpen
} from 'lucide-react';
import { SavedApplication, ApplicationStatus, Opportunity } from '../types';
import { Badge } from '../components/Badge';

interface SavedOpportunitiesPageProps {
  savedApplications: SavedApplication[];
  onRemoveApplication: (id: string) => Promise<void>;
  onUpdateApplication: (
    id: string,
    updates: {
      status?: ApplicationStatus;
      notes?: string;
      checklist?: Array<{ id: string; text: string; done: boolean }>;
    }
  ) => Promise<void>;
  onCheckEligibility: (opp: Opportunity) => void;
  onNavigateToExplore: () => void;
}

export const SavedOpportunitiesPage: React.FC<SavedOpportunitiesPageProps> = ({
  savedApplications,
  onRemoveApplication,
  onUpdateApplication,
  onCheckEligibility,
  onNavigateToExplore
}) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [notesInput, setNotesInput] = useState<string>('');

  const statusOptions: { value: ApplicationStatus; label: string }[] = [
    { value: 'interested', label: 'Interested' },
    { value: 'preparing', label: 'Preparing' },
    { value: 'ready_to_apply', label: 'Ready to Apply' },
    { value: 'applied', label: 'Applied' },
    { value: 'closed', label: 'Closed' }
  ];

  const filteredApps = activeFilter === 'all'
    ? savedApplications
    : savedApplications.filter(a => a.status === activeFilter);

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    await onUpdateApplication(appId, { status: newStatus });
  };

  const handleToggleChecklistItem = async (app: SavedApplication, chkId: string) => {
    const updatedChecklist = (app.checklist || []).map(item =>
      item.id === chkId ? { ...item, done: !item.done } : item
    );
    await onUpdateApplication(app.id, { checklist: updatedChecklist });
  };

  const handleStartEditNotes = (app: SavedApplication) => {
    setEditingNotesId(app.id);
    setNotesInput(app.notes || '');
  };

  const handleSaveNotes = async (appId: string) => {
    await onUpdateApplication(appId, { notes: notesInput });
    setEditingNotesId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[#202522]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E9E5]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Bookmark className="w-4 h-4 text-[#087F73]" />
            <span className="text-xs font-semibold text-[#087F73] uppercase tracking-wider">
              Application Tracker
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#202522]">
            Saved Opportunities & Preparation Tracker
          </h1>
          <p className="text-xs text-[#69716D] mt-1 max-w-xl">
            Track student application stages, record submission notes, and complete document checklists.
          </p>
        </div>

        <button
          onClick={onNavigateToExplore}
          className="px-4 py-2 rounded-xl bg-[#087F73] hover:bg-[#066258] text-white text-xs font-semibold self-start sm:self-auto cursor-pointer shadow-xs"
        >
          + Browse Opportunities
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <button
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer border ${
            activeFilter === 'all'
              ? 'bg-[#087F73] text-white border-[#087F73] font-semibold'
              : 'bg-white text-[#69716D] border-[#E5E9E5] hover:text-[#202522]'
          }`}
        >
          All Applications ({savedApplications.length})
        </button>
        {statusOptions.map(opt => {
          const count = savedApplications.filter(a => a.status === opt.value).length;
          return (
            <button
              key={opt.value}
              onClick={() => setActiveFilter(opt.value)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                activeFilter === opt.value
                  ? 'bg-[#087F73] text-white border-[#087F73] font-semibold'
                  : 'bg-white text-[#69716D] border-[#E5E9E5] hover:text-[#202522]'
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length > 0 ? (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const opp = app.opportunity;
            const completedItems = (app.checklist || []).filter(c => c.done).length;
            const totalItems = app.checklist?.length || 0;

            return (
              <div
                key={app.id}
                className="bg-white rounded-2xl border border-[#E5E9E5] p-5 sm:p-6 shadow-xs space-y-4"
              >
                {/* Header: Title, Category, Status selector, Remove */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-[#E5E9E5]">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="category">{opp.category}</Badge>
                      <Badge variant="teal">{opp.workMode}</Badge>
                      <span className="text-[11px] text-[#69716D]">
                        Saved {new Date(app.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="font-bold text-base text-[#202522]">{opp.title}</h3>
                    <p className="text-xs text-[#69716D]">
                      {opp.organization} • {opp.location}
                    </p>
                  </div>

                  {/* Status dropdown & Remove */}
                  <div className="flex items-center gap-2 shrink-0">
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="text-[#69716D] font-medium">Status:</span>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="px-2.5 py-1.5 rounded-lg border border-[#E5E9E5] bg-stone-50 font-semibold text-xs text-[#202522] focus:outline-none focus:border-[#087F73] cursor-pointer"
                      >
                        {statusOptions.map(opt => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => onRemoveApplication(app.id)}
                      className="p-1.5 text-[#69716D] hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                      title="Remove from saved opportunities"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Deadlines & Funding Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-[#E5E9E5]">
                    <span className="text-[#69716D] block text-[11px]">Funding / Award</span>
                    <span className="font-semibold text-[#202522]">{opp.fundingAmount || 'Not specified'}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-[#E5E9E5]">
                    <span className="text-[#69716D] block text-[11px]">Official Deadline</span>
                    <span className="font-semibold text-[#202522]">
                      {opp.deadline ? new Date(opp.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Rolling'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-[#E5E9E5]">
                    <span className="text-[#69716D] block text-[11px]">Document Tasks</span>
                    <span className="font-semibold text-[#202522]">{completedItems} of {totalItems} completed</span>
                  </div>
                </div>

                {/* Checklist Section */}
                {app.checklist && app.checklist.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-[#202522] mb-2 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#087F73]" />
                      <span>Required Document Checklist</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {app.checklist.map(item => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleChecklistItem(app, item.id)}
                          className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-colors cursor-pointer ${
                            item.done
                              ? 'bg-stone-50 border-[#E5E9E5] text-[#69716D] line-through'
                              : 'bg-white border-[#E5E9E5] text-[#202522] hover:border-[#087F73]/40'
                          }`}
                        >
                          {item.done ? (
                            <CheckSquare className="w-4 h-4 text-[#087F73] shrink-0" />
                          ) : (
                            <Square className="w-4 h-4 text-[#69716D] shrink-0" />
                          )}
                          <span className="truncate">{item.text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes Section */}
                <div className="pt-2 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-[#69716D]">Application Notes & Deadlines:</span>
                    {editingNotesId !== app.id && (
                      <button
                        onClick={() => handleStartEditNotes(app)}
                        className="text-[#087F73] hover:underline flex items-center gap-1 font-medium cursor-pointer"
                      >
                        <Edit2 className="w-3 h-3" />
                        <span>Edit Notes</span>
                      </button>
                    )}
                  </div>

                  {editingNotesId === app.id ? (
                    <div className="space-y-2">
                      <textarea
                        value={notesInput}
                        onChange={(e) => setNotesInput(e.target.value)}
                        rows={2}
                        placeholder="Add reminders, mentor contacts, submission links..."
                        className="w-full px-3 py-2 rounded-lg border border-[#E5E9E5] text-xs text-[#202522] focus:outline-none focus:border-[#087F73]"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleSaveNotes(app.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#087F73] text-white text-xs font-semibold cursor-pointer"
                        >
                          Save Notes
                        </button>
                        <button
                          onClick={() => setEditingNotesId(null)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#E5E9E5] text-[#69716D] text-xs cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[#202522] bg-[#FAFAF7] p-2.5 rounded-lg border border-[#E5E9E5]">
                      {app.notes ? app.notes : <span className="text-[#69716D] italic">No notes added yet. Click edit to record application details.</span>}
                    </p>
                  )}
                </div>

                {/* Bottom actions */}
                <div className="pt-2 border-t border-[#E5E9E5] flex items-center justify-between">
                  <button
                    onClick={() => onCheckEligibility(opp)}
                    className="text-xs font-semibold text-[#087F73] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Re-check Eligibility</span>
                  </button>

                  {opp.officialUrl && (
                    <a
                      href={opp.officialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-stone-50 hover:bg-stone-100 border border-[#E5E9E5] text-xs font-medium text-[#202522] flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#087F73]" />
                      <span>Official Submission Portal</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E5E9E5] space-y-3">
          <FolderOpen className="w-10 h-10 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-[#202522]">No saved opportunities in this status</h3>
          <p className="text-xs text-[#69716D] max-w-sm mx-auto">
            Save opportunities from the catalog to organize your preparation, track documents, and monitor deadlines.
          </p>
          <button
            onClick={onNavigateToExplore}
            className="px-4 py-2 rounded-lg bg-[#087F73] text-white text-xs font-semibold cursor-pointer"
          >
            Explore Opportunities
          </button>
        </div>
      )}
    </div>
  );
};
