import React from 'react';
import { 
  X, 
  ExternalLink, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Bookmark, 
  BookmarkCheck, 
  ShieldCheck, 
  CheckCircle2, 
  FileText, 
  ListOrdered, 
  Clock, 
  Check
} from 'lucide-react';
import { Opportunity } from '../types';
import { Badge } from './Badge';

interface OpportunityDetailModalProps {
  opportunity: Opportunity | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (opp: Opportunity) => void;
  onCheckEligibility: (opp: Opportunity) => void;
}

export const OpportunityDetailModal: React.FC<OpportunityDetailModalProps> = ({
  opportunity,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
  onCheckEligibility
}) => {
  if (!isOpen || !opportunity) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border border-[#E5E9E5] shadow-xl text-[#202522] my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-opp-title"
      >
        {/* Header Bar */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-xs border-b border-[#E5E9E5] px-6 py-4 flex items-start justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="category">{opportunity.category}</Badge>
              <Badge variant="teal">{opportunity.workMode}</Badge>
              {opportunity.isVerifiedSeed && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <Check className="w-3 h-3 stroke-[3]" />
                  Verified Official Criteria
                </span>
              )}
            </div>
            <h2 id="modal-opp-title" className="text-xl font-bold text-[#202522]">
              {opportunity.title}
            </h2>
            <p className="text-xs font-medium text-[#69716D] mt-0.5">
              Offered by {opportunity.organization} • {opportunity.location || 'Location not specified'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#69716D] hover:text-[#202522] hover:bg-stone-100 transition-colors"
            aria-label="Close details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-6 space-y-6 text-sm">
          {/* Key Facts Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-[#E5E9E5]">
              <span className="text-xs text-[#69716D] flex items-center gap-1 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-[#087F73]" />
                Support / Grant
              </span>
              <p className="font-semibold text-xs text-[#202522]">{opportunity.fundingAmount || 'Not specified'}</p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-[#E5E9E5]">
              <span className="text-xs text-[#69716D] flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-[#087F73]" />
                Application Deadline
              </span>
              <p className="font-semibold text-xs text-[#202522]">
                {opportunity.deadline ? new Date(opportunity.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Rolling / Unspecified'}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-[#E5E9E5]">
              <span className="text-xs text-[#69716D] flex items-center gap-1 mb-1">
                <Clock className="w-3.5 h-3.5 text-[#087F73]" />
                Last Checked
              </span>
              <p className="font-semibold text-xs text-[#202522]">{opportunity.lastVerified || 'Verified recently'}</p>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#69716D] mb-2">
              Program Overview
            </h3>
            <p className="text-xs text-[#202522] leading-relaxed whitespace-pre-line">
              {opportunity.fullDescription || opportunity.shortDescription}
            </p>
          </div>

          {/* Structured Eligibility Criteria */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#69716D] mb-2.5">
              Verified Eligibility Criteria ({opportunity.criteria.length})
            </h3>
            <div className="space-y-2">
              {opportunity.criteria.map((c) => (
                <div key={c.id} className="p-3 rounded-lg border border-[#E5E9E5] bg-[#FAFAF7] flex items-start gap-3 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#087F73] shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[#202522]">{c.name}</span>
                      <span className="text-[10px] uppercase font-bold text-[#69716D] bg-stone-200/70 px-1.5 py-0.2 rounded">
                        {c.importance}
                      </span>
                    </div>
                    <p className="text-[#69716D] leading-relaxed">{c.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Required Documents */}
          {opportunity.requiredDocuments && opportunity.requiredDocuments.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#69716D] mb-2.5 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-[#087F73]" />
                Required Documents
              </h3>
              <ul className="space-y-1.5">
                {opportunity.requiredDocuments.map((doc, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-xs text-[#202522]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#087F73]" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Application Steps */}
          {opportunity.applicationSteps && opportunity.applicationSteps.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#69716D] mb-2.5 flex items-center gap-1.5">
                <ListOrdered className="w-4 h-4 text-[#087F73]" />
                Application Steps
              </h3>
              <ol className="space-y-2">
                {opportunity.applicationSteps.map((step, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#202522]">
                    <span className="w-5 h-5 rounded-full bg-[#EEF8F6] text-[#087F73] font-bold text-[11px] flex items-center justify-center shrink-0 border border-[#CBE6E2]">
                      {idx + 1}
                    </span>
                    <span className="mt-0.5 leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          {/* Important Dates */}
          {opportunity.importantDates && opportunity.importantDates.length > 0 && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#69716D] mb-2.5">
                Key Timeline
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {opportunity.importantDates.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-lg bg-stone-50 border border-[#E5E9E5] flex justify-between items-center">
                    <span className="text-[#69716D]">{item.label}</span>
                    <span className="font-semibold text-[#202522]">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Official URL Verification Callout */}
          <div className="p-3.5 rounded-xl bg-[#FAFAF7] border border-[#E5E9E5] text-xs space-y-1">
            <span className="font-semibold text-[#202522]">Authoritative Source:</span>
            <p className="text-[#69716D]">
              Always refer to the official host notice for final rule interpretation and updates.
            </p>
            {opportunity.officialUrl && (
              <a
                href={opportunity.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#087F73] hover:underline font-medium mt-1"
              >
                <span>{opportunity.officialUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="sticky bottom-0 bg-white border-t border-[#E5E9E5] px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleSave(opportunity)}
              className={`px-3 py-2 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
                isSaved
                  ? 'bg-[#EEF8F6] text-[#087F73] border-[#CBE6E2]'
                  : 'bg-white text-[#202522] border-[#E5E9E5] hover:bg-stone-50'
              }`}
            >
              {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
              {isSaved ? 'Saved to Tracker' : 'Save Opportunity'}
            </button>

            {opportunity.officialUrl && (
              <a
                href={opportunity.officialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 rounded-lg text-xs font-medium bg-white text-[#69716D] border border-[#E5E9E5] hover:text-[#202522] flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Visit Official Portal
              </a>
            )}
          </div>

          <button
            onClick={() => {
              onClose();
              onCheckEligibility(opportunity);
            }}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-[#087F73] hover:bg-[#066258] text-white flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            Check My Eligibility for This
          </button>
        </div>
      </div>
    </div>
  );
};
