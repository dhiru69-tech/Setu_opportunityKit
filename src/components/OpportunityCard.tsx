import React from 'react';
import { 
  Bookmark, 
  BookmarkCheck, 
  Calendar, 
  MapPin, 
  DollarSign, 
  ExternalLink, 
  ShieldCheck, 
  Eye,
  Check
} from 'lucide-react';
import { Opportunity } from '../types';
import { Badge } from './Badge';

interface OpportunityCardProps {
  opportunity: Opportunity;
  isSaved: boolean;
  onToggleSave: (opp: Opportunity) => void;
  onViewDetails: (opp: Opportunity) => void;
  onCheckEligibility: (opp: Opportunity) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  isSaved,
  onToggleSave,
  onViewDetails,
  onCheckEligibility
}) => {
  const formatDeadlineDate = (dateStr: string) => {
    if (!dateStr) return 'Not specified';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getDaysLeft = (dateStr: string) => {
    if (!dateStr) return null;
    try {
      const target = new Date(dateStr).getTime();
      const diff = Math.ceil((target - Date.now()) / (1000 * 60 * 60 * 24));
      if (diff < 0) return 'Deadline passed';
      if (diff === 0) return 'Closes today';
      if (diff === 1) return '1 day remaining';
      return `${diff} days remaining`;
    } catch {
      return null;
    }
  };

  const daysRemaining = getDaysLeft(opportunity.deadline);

  return (
    <div className="bg-white rounded-xl border border-[#E5E9E5] hover:border-[#087F73]/40 transition-all duration-200 flex flex-col justify-between shadow-xs hover:shadow-sm p-5 text-[#202522]">
      {/* Top row: Category, Funding, and Save button */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="category">{opportunity.category}</Badge>
            <Badge variant="teal">{opportunity.workMode}</Badge>
            {opportunity.isVerifiedSeed && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <Check className="w-3 h-3 stroke-[3]" />
                Verified Criteria
              </span>
            )}
          </div>
          <button
            onClick={() => onToggleSave(opportunity)}
            aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
            className={`p-2 rounded-lg transition-colors cursor-pointer border ${
              isSaved
                ? 'bg-[#EEF8F6] text-[#087F73] border-[#CBE6E2]'
                : 'text-[#69716D] hover:text-[#202522] border-transparent hover:bg-stone-50'
            }`}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>

        {/* Title and Org */}
        <h3 className="font-semibold text-base text-[#202522] group-hover:text-[#087F73] mb-1 line-clamp-1">
          {opportunity.title}
        </h3>
        <p className="text-xs font-medium text-[#69716D] mb-3 flex items-center gap-1.5">
          <span>{opportunity.organization}</span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-[#69716D]" />
            {opportunity.location || 'Not specified'}
          </span>
        </p>

        {/* Short description */}
        <p className="text-xs text-[#69716D] leading-relaxed mb-4 line-clamp-2">
          {opportunity.shortDescription}
        </p>

        {/* Highlighted attributes: Funding & Deadline */}
        <div className="p-3 rounded-lg bg-stone-50 border border-[#E5E9E5] mb-4 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-[#69716D] flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-[#087F73]" />
              Support / Award:
            </span>
            <span className="font-medium text-[#202522] text-right truncate max-w-[180px]">
              {opportunity.fundingAmount || 'Not specified'}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-[#69716D] flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#087F73]" />
              Deadline:
            </span>
            <div className="text-right">
              <span className="font-medium text-[#202522]">
                {formatDeadlineDate(opportunity.deadline)}
              </span>
              {daysRemaining && (
                <span className="block text-[10px] text-amber-700 font-medium">
                  {daysRemaining}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Eligibility Snapshot */}
        <div className="text-[11px] text-[#69716D] mb-4 bg-[#FAFAF7] p-2.5 rounded border border-[#E5E9E5]">
          <span className="font-semibold text-[#202522]">Eligibility rule summary: </span>
          <span className="line-clamp-2">{opportunity.eligibilitySummary || 'Needs verification against sponsor criteria.'}</span>
        </div>
      </div>

      {/* Action Footer */}
      <div className="pt-3 border-t border-[#E5E9E5] flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(opportunity)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#202522] hover:bg-stone-100 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            Details
          </button>
          {opportunity.officialUrl && (
            <a
              href={opportunity.officialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-[#69716D] hover:text-[#087F73] transition-colors"
              title="Open official opportunity website"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <button
          onClick={() => onCheckEligibility(opportunity)}
          className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#087F73] hover:bg-[#066258] text-white transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Check Eligibility
        </button>
      </div>
    </div>
  );
};
